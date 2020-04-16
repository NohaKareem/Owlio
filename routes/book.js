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

  newBook.save((err, book) => { 
    handleErr(err);
    console.log("Book saved to data collection", book);
    res.json(book);
  });

  // res.redirect('/');
});

// GET book input form
router.get('/new', function(req, res, next) {
    res.render('new_book', { title: 'Add book' });
  });

  // GET a book
  // test book id 5e836fba28dc636184951a9a
  router.get('/:id', (req, res, next) => {
    Book.findOne({  _id: req.params.id }, (err, book) => {
      handleErr(err);
      //res.json(book);
      res.render('book_details', { title: 'Book Details', book:book });
    });
  });

  // GET book if exists (check by barcode)
  router.get('/barcode/:barcode', function(req, res, next) {
    Book.findOne({ barcode: req.params.barcode }, (err, book) => {
      handleErr(err);
      if (book)
          res.json(book);
      else res.json(false);
    });
  });
  
  // GET book edit page
  router.get('/:id/edit', (req, res, next) => {
    Book.findOne({  _id: req.params.id }, (err, book) => {
      handleErr(err);
      res.render('edit_book', { title: 'Edit book', book: book });
    });
  });

  // Update book
  router.post('/:id/update', (req, res, next) => {
    let q = Book.findOneAndUpdate({  _id: req.params.id }, 
      { 
        "rating": req.body.rating,
        "barcode": req.body.barcode,
        "isbn": req.body.isbn,
        "review": req.body.review,
        "favorite": req.body.favorite === "on" ? true : false
     });

    q.exec(function(err, mydata) {
      console.log('updated book');
    });

    // res.redirect('/');
    res.json(book);
  });

  // Update favorite
  router.post('/:id/favorite', (req, res, next) => {
    var q = Book.findOneAndUpdate({  _id: req.params.id }, 
      { 
        "favorite": req.body.favorite === "on" ? true : false
      });
    q.exec(function(err, mydata) {
        console.log('updated favorite');
      });
    res.redirect('/');
  });

  // GET favorite
  router.get('/:id/favorite', (req, res, next) => {
    Book.findOne({  _id: req.params.id }, (err, book) => {
      handleErr(err);
      // res.json(book.favorite);
      // return;
      res.redirect('/api/books');
      // res.render('all_books', { title: 'All Books', books:books });
    });
  });

  // Add review
  router.post('/:id/review', (req, res, next) => {
    var q = Book.findOneAndUpdate({  _id: req.params.id }, 
      { 
        "review": req.body.review
      });
      
    q.exec(function(err, mydata) {
        console.log('updated review');
      });

    res.redirect('/');
  });
  
  // // Edit book - add review
  // router.get('/:id/review', (req, res, next) => {
  //   Book.findOneAndUpdate({  _id: req.params.id }, 
  //     { 
  //       "review": req.body.review
  //    });
  //   //   newBook.save((err, book) => {
  //   //     handleErr(err);
  //   //     res.json(book);
  //   // });
  //   res.redirect('/');
  // });
  
function handleErr(err) {
    if(err) return next(err);
  }
  
module.exports = router;