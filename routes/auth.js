const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const fileUpload = require('../configs/cloudinary');


router.get('/login', (req, res) => {
  res.render('auth/login', {layout: 'customLayout'});
})

router.post('/login', async (req, res) => {
  const { username, password} = req.body;
  if (username === '' || password === '') {
    res.render('auth/login',
    {layout: 'customLayout', errorMessage: 'Indicate username and password.' })
    return;
  }

  const user = await User.findOne({ username: username});
  if (user === null) {
    res.render('auth/login',
    {layout: 'customLayout', errorMessage: 'Invalid username or password' });
    return;
  }
  // the user and password match
  if (bcrypt.compareSync(password, user.password)) {
    req.session.currentUser = user;
    res.render('index', {user});
    
    //res.redirect('index', { user });
    //Sucessfull login

  } else{
    //password dont match
    res.render('auth/login',
    {layout: 'customLayout', errorMessage: 'Invalid username or password' })
    return;
  }
});


router.get('/signup', (req, res) => {
  res.render('auth/signup', {layout: 'customLayout'});

});


router.post('/signup', async (req, res) => {
  const {username, email, password} = req.body;
  // checking if username and password are filled out
  if (username=== '' || password === '') {
    res.render('auth/signup', { layout: 'customLayout', errorMessage: 'Indicate username and password' })
  return;
  }

  // Mudei ou remodelei esta parte
  let user = await User.findOne({ username: username});
  if (user !== null) {
    res.render('auth/signup', 
    {layout: 'customLayout', errorMesssage: 'Username already exists'})
    return;
  }

  user = await User.findOne({ email: email });
  if (user !== null) {
   res.render('auth/signup',
   {layout: 'customLayout', errorMessage: 'Email already exists' })
   return;
  };

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
  if (passwordRegex.test(password) === false) {
   res.render('auth/signup', 
   {layout: 'customLayout', errorMessage: 'Password is too weak' })
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

router.get('/account', (req, res) => {
  res.render('auth/account', {layout: 'customLayout'});
})

router.post('/account', fileUpload.single('image'), async (req, res) => {
  const userId = req.session.currentUser._id;
  const fileOnClaudinary = req.file.path;
  const {username, email} = req.body
  await User.findByIdAndUpdate(userId, {
    username,
    email,
    profilePic: fileOnClaudinary
  });
  res.redirect('/')
})

module.exports = router;
