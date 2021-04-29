const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const reviews = new Schema ({
  imdbId: String,
  reviews: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User' //Relates to the Author model
    },
      comment: String,
      time: {
        type: Date,
        default: new Date()
      }
    }
  ]
});

module.exports = model('reviews', reviews);