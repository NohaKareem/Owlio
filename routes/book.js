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
  
  // GET book edit page
  router.get('/:id/edit', (req, res, next) => {
    Book.find({  _id: req.params.id }, (err, book) => {
      handleErr(err);
      res.render('new_book', { title: 'Edit book', book: book });
    });
  });

  //Update book
  router.post('/:id/update', (req, res, next) => {
    Book.findOneAndUpdate({  _id: req.params.id }, 
      { 
        "rating": req.body.rating,
        "barcode": req.body.barcode,
        "isbn": req.body.isbn,
        "review": req.body.review,
        "favorite": req.body.favorite
     });
  });

  //Update favorite
  router.post('/:id/favorite', (req, res, next) => {
    Book.findOneAndUpdate({  _id: req.params.id }, 
      { 
        "favorite": req.body.favorite
      });
  });
  
  //Edit book - add review
  router.get('/:id/review', (req, res, next) => {
    Book.findOneAndUpdate({  _id: req.params.id }, 
      { 
        "review": req.body.review
     });
    //   newBook.save((err, book) => {
    //     handleErr(err);
    //     res.json(book);
    // });
    res.redirect('/');
  });
  
function handleErr(err) {
    if(err) return next(err);
  }
  
module.exports = router;