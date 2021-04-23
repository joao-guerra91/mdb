const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie.model');
// const fileUpload = require('../configs/cloudinary');
const imdb = require('imdb-api')



router.get('/movies/search', async (req, res) => {
  res.render('movies-search')
})

router.get('/movies', async (req, res) => {
  let movieName = req.query.theMovieTitle;
  let results = await imdb.search({
    name: movieName
  }, {
    apiKey: process.env.IMDB_KEY
  })
  
  const moviesArray = results.results;
  res.render('movies-list', {moviesArray})
});

module.exports = router