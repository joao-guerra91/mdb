const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const movieSchema = new Schema ({
  title: String,
  year: Number,
  imdbid: String,
  type: String,
  poster: String,
  name: String,
}, {
  timestamps: true
});

module.exports = model('Movie', movieSchema);


