var express = require('express');
var router = express.Router();
var Book = require('../models/Book.js');
var Setting = require('../models/Setting.js');
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

// GET session input form
router.get('/session/new', function(req, res, next) {
  res.render('new_session', { title: 'Add session' });
});

// GET settings input form~~
router.get('/setting/new', function(req, res, next) {
  res.render('new_setting', { title: 'Add light_settings' });
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

  newBook.save((err, data) => { 
    handleErr(err);
    console.log("Book saved to data collection", data);
  });
});

// GET a book
// test book id 5e836fba28dc636184951a9a
router.get('/book/:id', (req, res, next) => {
  Book.find({  _id: req.params.id }, (err, book) => {
    handleErr(err);
    res.json(book);
  });
});

// Update book session comment
router.post('/session/:id/comment', (req, res, next) => {
  Session.findOneAndUpdate({ _id: req.params.id },
     { "comment": req.body.comment });
  newBook.save((err, data) => { 
    handleErr(err);
    console.log("Session comment updated", data);
  });
});

// Sessions
// API - GET all sessions (including light data)
router.get('/sessions', (req, res, next) => {
  Session.find((err, sessions) => {
    handleErr(err);
    res.json(sessions);
  });
});

// GET a session
// test session id 5e8392191b597261009970dd
router.get('/session/:id', (req, res, next) => {
  Session.find({  _id: req.params.id }, (err, session) => {
    handleErr(err);
    res.json(session);
  });
});

// GET a book session
// test book id 5e836fba28dc636184951a9a
router.get('/session/book/:id', (req, res, next) => {
  Session.find({  book_id: req.params.id }, (err, session) => {
    handleErr(err);
    res.json(session);
  });
});

// POST new session
router.post('/session', (req, res, next) => {
  let start_time = req.body.start_time;
  let end_time = req.body.end_time;

  // wrap start_time in a date object, to be saved as Date datatype in mongo
  let start_date = new Date();
  start_date.setHours(start_time.split(':')[0], start_time.split(':')[1]);
  start_time = start_date;

  // wrap end_time in a date object, to be saved as Date datatype in mongo
  let end_date = new Date();
  end_date.setHours(end_time.split(':')[0], end_time.split(':')[1]);
  end_time = end_date;
  
  // add new session
  var newSession = new Session();
  newSession.start_time = start_time;
  newSession.end_time = end_time;
  newSession.book_id = req.body.book_id;
  newSession.comment = req.body.comment;
  newSession.light_lumens = req.body.light_lumens;

  newSession.save((err, data) => { 
    handleErr(err);
    console.log("Session saved to data collection", data);
  });

  res.redirect('/');
});

// API - GET most recent sessions
router.get('/sessions/recent/:recent_sessions_count', (req, res, next) => {
  let recent_sessions_count = parseInt(req.params.recent_sessions_count);
  Session.find((err, sessions) => {
    handleErr(err);
    res.json(sessions);
  }).limit(recent_sessions_count).sort({ end_time: 'desc' });
});

// settings 
// API - GET all settings (including light data)
router.get('/settings', (req, res, next) => {
  Setting.find((err, settings) => {
    handleErr(err);
    res.json(settings);
  });
});

// GET a setting
router.get('/setting/:id', (req, res, next) => {
  Setting.find({  _id: req.params.id }, (err, setting) => {
    handleErr(err);
    res.json(setting);
  });
});

// Add light setting
router.post('/setting', (req, res, next) => {
  let time = req.body.time;

  // wrap time in a date object, to be saved as Date datatype in mongo
  let dateWrapper = new Date();
  dateWrapper.setHours(time.split(':')[0], time.split(':')[1]);
  time = dateWrapper;

  var newSetting = new Setting(); 
  newSetting.color = req.body.color;
  newSetting.time = time;

  newSetting.save((err, data) => { 
    handleErr(err);
    console.log("Setting saved to data collection", data);
  });
  res.redirect('/');
});

function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;