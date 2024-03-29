const express = require('express');
const router = express.Router();
// const Movie = require('../models/Movie.model'); não precisamos disto se não criarmos filmes e isso
// const fileUpload = require('../configs/cloudinary');
const imdb = require('imdb-api');
const imdbAPI = process.env.IMDB_KEY //melhor assim do que sempre escrever 'process.env...'
const Watchlist = require('../models/Watchlist.model');
const User = require('../models/User.model');
const Reviews = require('../models/Reviews.model');

router.get('/movies/search', async (req, res) => {
  res.render('movies-search', {user: req.session.currentUser});
});

router.get('/movies', async (req, res) => {
  let movieName = req.query.theMovieTitle;
  let results = await imdb.search({
    name: movieName
  }, {
    apiKey: imdbAPI
  })
  
  const moviesArray = results.results;
  let filteredArray = moviesArray.filter(result => {
   return result.type !== 'game'
 });

  res.render('movies-list', {moviesArray: filteredArray, user: req.session.currentUser});
});

router.get('/movies/watchlist', async (req, res) => {
 // const movie = await imdb
 const loggedUser = await User.findById(req.session.currentUser._id);
 const watchlist = await Watchlist.find({ user: loggedUser});
 res.render('watchlist', { watchlist, user: loggedUser });

})

router.post('/movies/:imdbid/watchlist', async (req, res) => {
  const loggedUser = await User.findById(req.session.currentUser._id);
  const imdbid = req.params.imdbid;
  const movieTitle = await imdb.get({id: imdbid}, {
    apiKey: imdbAPI
  });

  const addList = await Watchlist.find({user: loggedUser});


  let moviesIds = addList.map(film => {
    return film.movie.id
  })

  if(moviesIds.includes(imdbid)) {
    res.render('error', { error: 'Already in favorites'})
    console.log('Already in your watchlist');
    return;
  } 

  await Watchlist.create({
    user: loggedUser,
    movie: {
      title: movieTitle.title,
      id: imdbid
  }
})

res.redirect('/movies/watchlist')

});

router.post('/movies/:id/delete', async (req, res) => {
  const id = req.params.id;
  await Watchlist.findByIdAndDelete(id);
  res.redirect('/movies/watchlist');
});

router.get('/movies/:movieId', async (req, res) => {
  try {
  const movieReviews = await Reviews.findOne({imdbId: req.params.movieId}).populate('reviews.user')
  console.log(movieReviews);
  const movie = await imdb.get({id: req.params.movieId}, {
      apiKey: imdbAPI
    });
    const loggedUser = await User.findById(req.session.currentUser._id);
    const watchlist = await Watchlist.find({ user: loggedUser});
 
    let moviesIds = watchlist.map(film => {
     return film.movie.id
   });
  res.render('movie-detail', {movie, user: req.session.currentUser, movieReviews, moviesIds});
    // console.log(reviews)
  } catch(e) {
      res.render('error');
      console.log(`An error occured (${e})`);
  }
});

router.post('/reviews/:imdbId/add', async (req,res) => {
  const imdbId = req.params.imdbId;
  const { user, comment } = req.body;
  const reviews = await Reviews.findOne({ imdbId : imdbId});
  const loggedUser = await User.findById(req.session.currentUser);

  if (reviews) {
    await Reviews.findByIdAndUpdate(reviews._id, {
      $push: {reviews: {user: req.session.currentUser._id, comment}}
    });
  } else {
    await Reviews.create({
      imdbId,
      reviews: [{ user: req.session.currentUser._id, comment}]
  });
}
  res.redirect(`/movies/${imdbId}`)
})

module.exports = router
