const express = require('express');
const router = express.Router();

// Bring in article Models
let Article = require('../models/article');

 // Add route
 router.get('/add', function (req, res) {
   res.render('add_article', {
     title: 'Add Articles'
   });
 });

 // Add article submit route
 router.post('/add', function (req, res) {
   req.checkBody('title', 'Title is required').notEmpty();
   req.checkBody('author', 'Author is required').notEmpty();
   req.checkBody('body', 'Body is required').notEmpty();

   //Get the error if any
   let errors = req.validationErrors();
   if (errors){
     res.render('add_article', {
       title: 'Add Articles',
       errors: errors
     });
   }else{
     let article = new Article;
     article.title = req.body.title;
     article.author = req.body.author;
     article.body = req.body.body;

     article.save(function (err) {
       if (err) {
         console.log(err);
         return;
       } else {
         req.flash('success', 'Article Added');
         res.redirect('/')
       }
     });
   }
 });

 // Get single article
 router.get('/:id', (req, res) => {
   Article.findById(req.params.id, (err, article) => {
     res.render('article', {
       article: article
     });
   });
 });

 // Load Article Edit form
 router.get('/edit/:id', (req, res) => {
   Article.findById(req.params.id, (err, article) => {
     res.render('edit_article', {
       title: 'Edit Article',
       article: article
     });
   });
 });

 // Update article
 router.post('/edit/:id', function (req, res) {
   let article = {};
   article.title = req.body.title;
   article.author = req.body.author;
   article.body = req.body.body;
   let id = req.params.id;
   let query = {_id: id};

   Article.update(query, article, function (err) {
     if (err) {
       console.log(err);
       return;
     } else {
       req.flash('success', 'Article Updated');
       res.redirect('/')
     }
   });
 });

 // Delete article
 router.delete('/:id', (req, res) => {
   let query = {_id: req.params.id};
   Article.remove(query, (err) => {
     if(err){
       console.log(err)
     }
     res.send('Success');
   });
 });

 module.exports = router;
