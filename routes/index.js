const express = require('express');
const router  = express.Router();
const User = require('../models/User.model');

/* GET home page */
router.get('/', async (req, res, next) => {
  res.render('index', {user: req.session.currentUser});
});

module.exports = router;
