const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

router.get('/login', (req, res) => {
  res.render('auth/login');
})

router.post('/login', async (req, res) => {
  const { username, password} = req.body;
  if (username === '' || password === '') {
    res.render('auth/login',
    { errorMessage: 'Password is too weak' })
    return;
  }

  const user = await User.findOne({ username: username});
  if (user === null) {
    res.render('auth/login',
    { errorMessage: 'Password is too weak' })
    return;
  }
  // the user and password match
  if (bcrypt.compareSync(password, user.password)) {
    req.session.currentUser = user;
    res.render('index', { user });
    // res.redirect('index', { user });
    //Sucessfull login

  } else{
    //password dont match
    res.render('auth/login',
    { errorMessage: 'Password is too weak' })
    return;
  }
});

router.get('/signup', (req, res) => {
  res.render('auth/signup');

});


router.post('/signup', async (req, res) => {
  const {username, email, password} = req.body;
  // checking if username and password are filled out
  if (username=== '' || password === '') {
    res.render('auth/signup', { errorMessage: 'Indicate username and password' })
  return;
  }

  // check for password strength - Regular Expression
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
  if (passwordRegex.test(password) === false) {
   res.render('auth/signup', 
   { errorMessage: 'Password is too weak' })
   return;
  }

  // check if the user already exist
  const user = await User.findOne({ username: username});
  if (user !== null) {
    res.render('auth/signup', 
    { errorMesssage: ' username already exists'})
    return;
  }

  // create the user in the database
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  await User.create({
    username,
    email,
    password: hashedPassword
  });
  res.redirect('/');
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/')
});


module.exports = router;