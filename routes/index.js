const express = require('express');
const router  = express.Router();
const imdb = require('imdb-api')

/* GET home page */
router.get('/', async (req, res, next) => {
  let results = await imdb.search({
    name: 'MAtrix'
  }, {
    apiKey: process.env.IMDB_KEY
  })
  
  console.log(results)
  res.render('index');

});

module.exports = router;
