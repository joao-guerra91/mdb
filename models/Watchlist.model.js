const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const watchList = new Schema ({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  movie: {
    title: String,
    id: String
  }
});

module.exports = model('Watchlist', watchList);