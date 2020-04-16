var express = require('express');
var router = express.Router();
var Setting = require('../models/Setting.js');

// // GET settings input form
// router.get('/new', function(req, res, next) {
//     res.render('new_setting', { title: 'Add light_settings' });
//   });

// GET settings update form
router.get('/update', function(req, res, next) {
    res.render('update_settings', { title: 'Update SMS settings' });
});

// // GET settings input form
// router.get('/new', function(req, res, next) {
//     res.render('new_setting', { title: 'Add light_settings' });
//   });

router.get('/', function(req, res, next) {
    Setting.findOne({  _id: "5e875da13520f25d2858768f" }, (err, settings) => {
        handleErr(err);
        // res.json(settings);
        res.render('settings', { title: 'Settings', settings: settings });
    });
  });
  
// GET a setting
router.get('/:id', (req, res, next) => {
    Setting.findOne({  _id: req.params.id }, (err, setting) => {
        handleErr(err);
        res.json(setting);
    });
});
    
// Edit user settings
// user settings at id 5e875da13520f25d2858768f
router.post('/:id', (req, res, next) => {
    let time = req.body.time;

    // wrap time in a date object, to be saved as Date datatype in mongo
    let dateWrapper = new Date();
    dateWrapper.setHours(time.split(':')[0], time.split(':')[1]); 
    time = dateWrapper;
    // "favorite": req.body.favorite === "on" ? true : false
    let daysOfWeek = [];
    console.log(req.body.weekday_0)
    console.log(req.body.weekday_1)
    console.log(req.body.weekday_2)
    console.log(req.body.weekday_3)
    console.log(req.body.weekday_4)
    console.log(req.body.weekday_5)
    console.log(req.body.weekday_6)
    if(req.body.weekday_0 === "on") daysOfWeek.push(0);
    if(req.body.weekday_1 === "on") daysOfWeek.push(1);
    if(req.body.weekday_2 === "on") daysOfWeek.push(2);
    if(req.body.weekday_3 === "on") daysOfWeek.push(3);
    if(req.body.weekday_4 === "on") daysOfWeek.push(4);
    if(req.body.weekday_5 === "on") daysOfWeek.push(5);
    if(req.body.weekday_6 === "on") daysOfWeek.push(6);

    console.log(daysOfWeek)
    let q = Setting.findOneAndUpdate({ _id: req.params.id },
            { 
                "phone_number": req.body.phone_number,
                "days_of_week": daysOfWeek, 
                "time": time 
            });
    q.exec(function(err, data) {
        console.log('updated settings', data);
    });
    res.redirect('/');
});

// future work - light settings
// // Add light setting
// router.post('/', (req, res, next) => {
//     let time = req.body.time;

//     // wrap time in a date object, to be saved as Date datatype in mongo
//     let dateWrapper = new Date();
//     dateWrapper.setHours(time.split(':')[0], time.split(':')[1]);
//     time = dateWrapper;

//     // add setting
//     var newSetting = new Setting(); 
//     newSetting.color = req.body.color;
//     newSetting.time = time;

//     newSetting.save((err, data) => { 
//         handleErr(err);
//         console.log("Setting saved to data collection", data);
//     });
//     res.redirect('/');
// });

// // Edit light setting
// router.post('/:id', (req, res, next) => {
//     let time = req.body.time;

//     // wrap time in a date object, to be saved as Date datatype in mongo
//     let dateWrapper = new Date();
//     dateWrapper.setHours(time.split(':')[0], time.split(':')[1]);
//     time = dateWrapper;

//     Setting.findOneAndUpdate({ _id: req.params.id },
//             { "color": req.body.color, "time": time });
//         newBook.save((err, data) => { 
//         handleErr(err);
//         console.log("Session comment updated", data);
//         });

//     res.redirect('/');
// });
  
function handleErr(err) {
    if(err) return next(err);
  }
  
module.exports = router;