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
    let q = Session.findOneAndUpdate({ _id: req.params.id },
    { "comment": req.body.comment });

    q.exec(function(err, data) {
        console.log('updated session', data);
    });
    
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
// test book id 5e8e125816738a7b00ed25ad 5e836fba28dc636184951a9a  5e8e15a316738a7b00ed25af
router.get('/book/:id', (req, res, next) => {
    Session.find({ book_id: req.params.id }, (err, sessions) => {
        handleErr(err);
        // res.json(sessions);
        res.render('session_history', { title: 'Session History', sessions:sessions });
    });
});
  
// POST new session
router.post('/', (req, res, next) => {
    console.log('in post')
    let start_time = req.body.start_time;
    let end_time = req.body.end_time;

    // wrap start_time in a date object, to be saved as Date datatype in mongo
    if (start_time != undefined) {
        let start_date = new Date();
        start_date.setHours(start_time.split(':')[0], start_time.split(':')[1]);
        start_time = start_date;
    }
    // wrap end_time in a date object, to be saved as Date datatype in mongo
    if (end_time != undefined) {
        let end_date = new Date();
        end_date.setHours(end_time.split(':')[0], end_time.split(':')[1]);
        end_time = end_date;
    }
    console.log('after time set')

    // add new session
    var newSession = new Session();
    if (start_time != undefined) newSession.start_time = start_time;
    if (end_time != undefined) newSession.end_time = end_time;
    if (req.body.book_id != undefined) newSession.book_id = req.body.book_id;
    if (req.body.comment != undefined) newSession.comment = req.body.comment;
    if(req.body.light_lumens != undefined) newSession.light_lumens = req.body.light_lumens;
    console.log('about to save', newSession)

    newSession.save((err, data) => { 
        handleErr(err);
        console.log("Session saved to data collection", data);
        res.json(data);
        // return;
    });

    // res.redirect('/');
});

// Update session end time
router.post('/end_time/:id', (req, res, next) => {
    let end_time = req.body.end_time;
   
    // wrap end_time in a date object, to be saved as Date datatype in mongo
    if (end_time != undefined) {
        let end_date = new Date();
        end_date.setHours(end_time.split(':')[0], end_time.split(':')[1]);
        end_time = end_date;
    }

    let q = Session.findOneAndUpdate({ _id: req.params.id },
        { "end_time": end_time });
    
        q.exec(function(err, data) {
            console.log('updated session', end_time);
            res.json(data);
        });
  
    // // add new session
    // var newSession = new Session();
    // if (end_time != undefined) newSession.end_time = end_time;

    // newSession.save((err, data) => { 
    //     handleErr(err);
    //     console.log("Session saved to data collection", data);
    //     res.json(data);
    //     // return;
    // });

    // res.redirect('/');
});

    // get session data, with populated book data
    // test /session/5e869f8875fbcae590db6e60/book/details
    router.get('/:sessionId/book/details', (req, res, next) => {
        Session.findOne({ _id: req.params.sessionId }, (err, session) => {
            res.json(session);
        }).populate({
            path: 'book_id', 
            model: 'Book'
        });
    }); 
  

function handleErr(err) {
    if(err) return next(err);
}
  
module.exports = router;