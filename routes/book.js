var express = require('express');
var router = express.Router();
var Book = require('../models/Book.js');

// POST new book
router.post('/', (req, res, next) => {
    var newBook = new Book(); 
    newBook.review = req.body.review;
    newBook.rating = req.body.rating;
    newBook.barcode = req.body.barcode;
    newBook.isbn = req.body.isbn;
    newBook.favorite = req.body.favorite;
  
    newBook.save((err, data) => { 
      handleErr(err);
      console.log("Book saved to data collection", data);
    });

    res.redirect('/');
  });
  
// GET book input form
router.get('/new', function(req, res, next) {
    res.render('new_book', { title: 'Add book' });
  });

  // GET a book
  // test book id 5e836fba28dc636184951a9a
  router.get('/:id', (req, res, next) => {
    Book.find({  _id: req.params.id }, (err, book) => {
      handleErr(err);
      res.json(book);
    });
  });
  
  //Edit book - add review
  router.get('/:id/review', (req, res, next) => {
    Book.findOneAndUpdate({  _id: req.params.id }, 
      { "review": req.body.review });
      newBook.save((err, book) => {
        handleErr(err);
        res.json(book);
    });
  });
  
function handleErr(err) {
    if(err) return next(err);
  }
  
module.exports = router;