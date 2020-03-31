var express = require('express');
var router = express.Router();
var Book = require('../models/Book.js');
var Light = require('../models/Light.js');
var Session = require('../models/Session.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Owlio' });
});

/* GET testing page. */
router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Routes Testing' });
});

// GET book input form
router.get('/book/new', function(req, res, next) {
  res.render('new_book', { title: 'Add book' });
});

// GET book input form
router.get('/session/new', function(req, res, next) {
  res.render('new_session', { title: 'Add session' });
});

// GET book input form
router.get('/light_session/new', function(req, res, next) {
  res.render('new_light_session', { title: 'Add light session' });
});

// GET book input form
router.get('/light_settings/new', function(req, res, next) {
  res.render('new_light_settings', { title: 'Add light_settings' });
});

// Books
// API - GET all books
router.get('/books', (req, res, next) => {
    Book.find((err, books) => {
      handleErr(err);
      res.json(books);
    });
});

// POST new book
router.post('/book', (req, res, next) => {
  var newBook = new Book(); 
  newBook.review = req.body.review;
  newBook.rating = req.body.rating;
  newBook.barcode = req.body.barcode;
  newBook.isbn = req.body.isbn;
  newBook.favorite = req.body.favorite;
  // newBook.sessions_data.session_id = req.body.session_id; //req.params.session_id;//book id
  // newBook.sessions_data.comment = req.body.comment;

  newBook.save((err, data) => { 
    handleErr(err);
    console.log("Book saved to data collection", data);
  });
});

// GET book session
// test book id 5e836fba28dc636184951a9a
router.get('/book/:book_id/session/:session_id', (req, res, next) => {
    Book.find({  _id: req.params.book_id,
      "session_data.session_id": req.params.session_id }, (err, books) => {
      handleErr(err);
      res.json(books);
    });
});

    // // POST new book session //~ easier if in session table
    // router.post('/book/:book_id/session', (req, res, next) => {
    //   var newBookSession = new Book(); 
    //   newBookSession.review = req.body.review;
    //   newBookSession.rating = req.body.rating;
    //   newBookSession.barcode = req.body.barcode;
    //   newBookSession.isbn = req.body.isbn;
    //   newBookSession.favorite = req.body.favorite;
    //   // newBookSession.sessions_data.session_id = req.body.session_id; //req.params.session_id;//BookSession id
    //   // newBookSession.sessions_data.comment = req.body.comment;

    //   newBookSession.save((err, data) => { 
    //     handleErr(err);
    //     console.log("BookSession saved to data collection", data);
    //   });
    // });

// ~POST new book session comment//~ (with optional comment)
router.post('/book/:book_id/session/:session_id', (req, res, next) => {
  Book.findOneAndUpdate({
     _id: req.params.book_id,
      "session_data.session_id": req.params.session_id 
    }, { "sessions_data.comment": req.body.comment });
  newBook.save((err, data) => { 
    handleErr(err);
    console.log("Book session updated", data);
  });
});

// Sessions
// API - GET all sessions
router.get('/sessions', (req, res, next) => {
  Session.find((err, sessions) => {
    handleErr(err);
    res.json(sessions);
  });
});

  // // POST new session
  // router.post('/session/:book_id', (req, res, next) => {

  //   // add new session
  //   var newSession = new Session(); 
  //   newSession.start_time = req.body.start_time;
  //   newSession.end_time = req.body.end_time;

  //   newSession.save((err, data) => { 
  //     handleErr(err);
  //     console.log("Session saved to data collection", data);
  //   });

  //   // add new session to book 
  //   Book.findOneAndUpdate({
  //     _id: req.params.book_id,
  //     "session_data.session_id": req.params.session_id 
  //   }, { "sessions_data.comment": req.body.comment });
  //     newBook.save((err, data) => { 
  //       handleErr(err);
  //       console.log("Book session updated", data);
  // });

  //   res.redirect('/');
  // });

// API - GET most recent sessions
router.get('/sessions/recent/:recent_sessions_count', (req, res, next) => {
  let recent_sessions_count = parseInt(req.params.recent_sessions_count);
  Session.find((err, sessions) => {
    handleErr(err);
    res.json(sessions);
  }).limit(recent_sessions_count).sort({ end_time: 'desc' });
});

// API - GET all light sessions
router.get('/lightSessions', (req, res, next) => {
  Light.find((err, light_sessions) => {
    handleErr(err);
    res.json(light_sessions);
  });
});

function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;