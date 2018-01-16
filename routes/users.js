const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in article Models
let User = require('../models/user');

// Register Form
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register User'
  })
});

// Register process
router.post('/register', (req, res) => {
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not Valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      title: 'Register user',
      errors: errors
    })
  } else {
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err){
          console.log(err)
        }
        newUser.password = hash;
        newUser.save((err) => {
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success', 'You are now registered and can log in');
            res.redirect('/users/login')
          }
        })
      });
    })
  }
});

// Login Form
router.get('/login', (req, res) => {
  res.render('login')
});
// Login Process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have successfully logged out');
  res.redirect('/users/login');
});


module.exports = router;