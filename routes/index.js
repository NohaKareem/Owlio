var express = require('express');
var router = express.Router();
var Book = require('../models/Book.js');
var Light = require('../models/Light.js');
var Session = require('../models/Session.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Owlio' });
});

// API - GET all books
router.get('/books', (req, res, next) => {
    Book.find((err, books) => {
      handleErr(err);
      res.json(books);
    });
});

// API - GET all sessions
router.get('/sessions', (req, res, next) => {
  Session.find((err, sessions) => {
    handleErr(err);
    res.json(sessions);
  });
});

// API - GET all light sessions
router.get('/light_sessions', (req, res, next) => {
  Light.find((err, light_sessions) => {
    handleErr(err);
    res.json(light_sessions);
  });
});

function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;