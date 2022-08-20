var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

// import user Schema
const User = require('../models/userSchema');

// GET login
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login Page' });
});

// POST Login
router.post('/login', function (req, res, next) {
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
    User.findOne({ email: email })
    .then(async (user) => {
      if (user) {
        if (await bcrypt.compare(password, user.password)) {
          console.log(user);
          console.log('Check' + password, ' || ', user.password);
          res.redirect('/dashboard');
        } else {
          errors.push({ msg: 'Password is incorrect' });
          console.log('Password is incorrect')
          res.render('login', { errors })
        }
      } else {
        errors.push({ msg: 'Email is not registered' });
        console.log('Email is not registered')
        res.render('login', { errors })
      }
    }).catch((err) => {
      errors.push({ msg: 'Internal Server Error' });
      console.log('Internal Server Error')
      res.render('login', { errors })
    })
  }
});

// GET Register
router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Register Page' });
});

// POST Register
router.post('/register', function (req, res, next) {
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
  res.redirect('/');
})

module.exports = router;
