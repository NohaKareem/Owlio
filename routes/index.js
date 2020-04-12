var express = require('express');
var router = express.Router();
var Session = require('../models/Session.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  Session.find((err, sessions) => {
    handleErr(err);
    // res.json(sessions);
    res.render('index', { title: 'Owlio', sessions:sessions });
  }).populate('book_id');;
});

/* GET testing page. */
router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Routes Testing' });
});

function handleErr(err) {
  if(err) return next(err);
}

module.exports = router;