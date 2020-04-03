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

function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;