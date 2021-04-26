const express = require('express');
const router = express.Router();
// const Movie = require('../models/Movie.model'); não precisamos disto se não criarmos filmes e isso
// const fileUpload = require('../configs/cloudinary');
const imdb = require('imdb-api');
const imdbAPI = process.env.IMDB_KEY //melhor assim do que sempre escrever 'process.env...'



router.get('/movies/search', async (req, res) => {
  res.render('movies-search')
})

router.get('/movies', async (req, res) => {
  let movieName = req.query.theMovieTitle;
  let results = await imdb.search({
    name: movieName
  }, {
    apiKey: imdbAPI
  })
  
  const moviesArray = results.results;
  res.render('movies-list', {moviesArray})
});

router.get('/movies/:movieId', async (req, res) => {
  try {
  const movie = await imdb.get({id: req.params.movieId}, {
      apiKey: imdbAPI
    });
  res.render('movie-detail', {movie});
  } catch(e) {
      res.render('error');
      console.log(`An error occured (${e})`);
  }
});

module.exports = router