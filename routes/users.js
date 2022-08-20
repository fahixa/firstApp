var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const {forwardAuth} = require('../config/auth');

// import user Schema
const User = require('../models/UserSchema');

// GET login
router.get('/login', forwardAuth, function (req, res, next) {
  res.render('login', { title: 'Login Page' });
});

// POST Login
router.post('/login', forwardAuth, function (req, res, next) {
  const { email, password } = req.body;
  console.log(req.body);

  let errors = [];
  if (!email || !password) {
    errors.push({ msg: 'Please enter all fields' });
    console.log('Please enter all fields')
  }
  if (errors.length > 0) {
    res.render('login', {
      errors,
      email,
      password,
    });
  } else {
    passport.authenticate('local', { 
      successRedirect: '/dashboard', 
      failureRedirect: '/auth/login', 
      failureFlash: true,
    })(req, res, next)
  }
});

// GET Register
router.get('/register', forwardAuth, function (req, res, next) {
  res.render('register', { title: 'Register Page' });
});

// POST Register
router.post('/register', forwardAuth, function (req, res, next) {
  const { name, email, password, password2 } = req.body;
  console.log(req.body);

  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
    console.log('Please enter all fields')
  }
  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
    console.log('Passwords do not match')
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
    console.log('Password must be at least 6 characters')
  }
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          console.log('Email already exists');
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          newUser.save()
            .then(user => {
              console.log(user);
              console.log('Congrats, you are registered');
              res.redirect('/auth/login');
            }).catch(err => console.log(err));
        }
      }).catch(err => console.log(err));
  }
});

// GET Logout
router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
})

module.exports = router;
