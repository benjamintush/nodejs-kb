const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

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
            req.flash('success', 'You are noe registered and can log in');
            res.redirect('/users/login')
          }
        })
      });
    })
  }
});

router.get('/login', (req, res) => {
  res.render('login')
});

module.exports = router;