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

// Books
// API - GET all books
router.get('/books', (req, res, next) => {
    Book.find((err, books) => {
      handleErr(err);
      res.json(books);
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

function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;