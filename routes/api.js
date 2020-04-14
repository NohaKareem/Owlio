var express = require('express');
var router = express.Router();
var Book = require('../models/Book.js');
var Setting = require('../models/Setting.js');
var Session = require('../models/Session.js');

// Books
// GET all books
router.get('/books', (req, res, next) => {
    Book.find((err, books) => {
      handleErr(err);
      //res.json(books);
      res.render('all_books', { title: 'All Books', books:books });
    });
});

// Sessions
// GET all sessions (including light data)
router.get('/sessions', (req, res, next) => {
  Session.find((err, sessions) => {
    handleErr(err);
    res.json(sessions);
  });
});

// GET most recent sessions
router.get('/sessions/recent/:recent_sessions_count', (req, res, next) => {
  let recent_sessions_count = parseInt(req.params.recent_sessions_count);
  Session.find((err, sessions) => {
    handleErr(err);
    res.json(sessions);
  }).limit(recent_sessions_count).sort({ end_time: 'desc' });
});

// Settings 
// GET all settings
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