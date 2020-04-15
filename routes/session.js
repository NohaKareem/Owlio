var express = require('express');
var router = express.Router();
var Session = require('../models/Session.js');
var Book = require('../models/Book.js');

// GET session input form
router.get('/new', function(req, res, next) {
    res.render('new_session', { title: 'Add session' });
});

// Update book session comment
router.post('/:id/comment', (req, res, next) => {
Session.findOneAndUpdate({ _id: req.params.id },
    { "comment": req.body.comment });
    // newBook.save((err, data) => { 
    //     handleErr(err);
    //     console.log("Session comment updated", data);
    // });
    console.log("Session comment updated", data);
});

// GET a session
// test session id 5e8392191b597261009970dd
router.get('/:id', (req, res, next) => {
    Session.find({  _id: req.params.id }, (err, session) => {
    handleErr(err);
    res.json(session);
    });
});
  
// GET a book session
// test book id 5e836fba28dc636184951a9a  5e8e15a316738a7b00ed25af
router.get('/book/:id', (req, res, next) => {
    Session.find({ book_id: req.params.id }, (err, session) => {
        handleErr(err);
      res.json(session);
    });
});
  
// POST new session
router.post('/', (req, res, next) => {
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

    // // get session data, with populated book data
    // // test /session/5e869f8875fbcae590db6e60/book/details
    // router.get('/:sessionId/book/details', (req, res, next) => {
    //     Session.findOne({ _id: req.params.sessionId }, (err, session) => {
    //         res.json(session);
    //     }).populate('book_id');
    // }); 
  

function handleErr(err) {
    if(err) return next(err);
}
  
module.exports = router;