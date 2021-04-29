const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: '/images/profile-icon.png',
  },
  role: String
});


module.exports = model('User', userSchema);