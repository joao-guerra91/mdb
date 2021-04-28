const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const reviews = new Schema ({
  imdbId: String,
  reviews: [
    {
      user: String,
      comment: String,
    }
  ],
});

module.exports = model('reviews', reviews);