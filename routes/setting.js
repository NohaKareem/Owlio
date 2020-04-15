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
  
// GET a setting
router.get('/:id', (req, res, next) => {
    Setting.find({  _id: req.params.id }, (err, setting) => {
        handleErr(err);
        res.json(setting);
    });
});
  
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
  
// Edit user settings
// user settings at id 5e875da13520f25d2858768f
router.post('/:id', (req, res, next) => {
    let time = req.body.time;

    // wrap time in a date object, to be saved as Date datatype in mongo
    let dateWrapper = new Date();
    dateWrapper.setHours(time.split(':')[0], time.split(':')[1]);
    time = dateWrapper;

    let q = Setting.findOneAndUpdate({ _id: req.params.id },
            { 
                "phone_number": req.body.phone_number,
                "day_of_week": req.body.day_of_week, 
                "time": time });
    q.exec(function(err, data) {
        console.log('updated settings', data);
    });
    res.redirect('/');
});
  
function handleErr(err) {
    if(err) return next(err);
  }
  
module.exports = router;