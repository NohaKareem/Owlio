var express = require('express');
var router = express.Router();
var Session = require('../models/Session.js');
var Setting = require('../models/Setting.js');
var smsConfig = require('../config.js'); // sms credentials
var client = require('twilio')(smsConfig.accountSid, smsConfig.authToken);
var twilionum = (smsConfig.twilioPhoneNumber);


/* GET home page. */
// GET last 3 sessions to show in reading history, sorted by latest date
router.get('/', function(req, res, next) {
  Session.find((err, sessions) => {
    handleErr(err);
    // res.json(sessions);
    res.render('index', { title: 'Owlio', sessions:sessions });
  }).limit(3).sort({ end_time: 'desc' }).populate('book_id');
});

/* GET testing page. */
router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Routes Testing' });
});

function handleErr(err) {
  if(err) return next(err);
}

// sms 
router.get('/sendSms', function(req, res, next) {
  Setting.findOne({  _id: "5e875da13520f25d2858768f" }, (err, settings) => {
      handleErr(err);
      // res.json(settings);
      let readerNum = settings.phone_number;
      console.log('sending to readerNum ', readerNum)
      //This code is for non-timed messages
      client.messages.create({
        to: readerNum, //'+12267008563',//'+12267008563',
        from: twilionum, 
        body:'Hello!👋 Hope you’re having a good day! Wanna read?' 
      }, 
      function( err, data ) {
        if(err)
        console.log(err);
        console.log(data);
          //   console.log('sending message')
          // }).then(function(response) {
          //   console.log('Message sent', data);
          // }).catch(function(err) {
          //   console.error(error);
          // });
    }) .then((message)=>console.log(message.sid))
    res.render('settings', { title: 'Settings', settings: settings });
  });  
});

// send scheduled sms  
router.get('/sendScheduledSms', function(req, res, next) {
  console.log('in scheduled sms')

  Setting.findOne({ _id: "5e875da13520f25d2858768f" }, (err, settings) => {
      handleErr(err);
      // res.json(settings);
      let readerNum = settings.phone_number;
      let hours = settings.time.getHours();
      let minutes = settings.time.getMinutes();
      console.log(hours, ":", minutes)
      console.log('sending scheduled text to readerNum ', readerNum);
      
      const CronJob = require('cron').CronJob;

      // set a reminder per day of week
      settings.days_of_week.forEach(day => {
        console.log('day', day)
        new CronJob(minutes + " " + hours + " * * " + day + " *", function() {
          // new CronJob("* * * * *", function() {
          client.messages.create({
            to: readerNum, //'+12267008563',//'+12267008563',
            from: twilionum, 
            body:'Hello!👋 Hope you’re having a good day! Wanna read?' 
          }, 
          function( err, data ) {
            if(err)
            console.log(err);
            console.log(data);
              //   console.log('sending message')
              // }).then(function(response) {
              //   console.log('Message sent', data);
              // }).catch(function(err) {
              //   console.error(error);
              // });
        }) .then((message)=>console.log(message.sid));
  
      res.render('settings', { title: 'Settings', settings: settings });
    });  
      })
});
});


  // router.get('/create', function(req, res, next){
  //   res.render('appointments/create', {
  //     timeZones: getTimeZones(),
  //     appointment: new Appointment({
  //       phone_number: '', 
  //       days_of_week: '',
  //       time: ''
  //     })
  //   });
  // });

//twilio sms notifications method

  // const CronJob = require('cron').CronJob;

  //That is a format specific to cron that let’s us define the time 
  //and frequency of when we want this job to fire. In this case, 
  //at 01 minutes 17 hours every day. Check time specifics via link below:
  //http://www.nncron.ru/help/EN/working/cron-format.htm

  // console.log('about to write sms')
  // var textJob = new CronJob( '19 12 * * *', function() {

  // client.messages.create( { 
  //     to:'+12262247542',
  //     from: '+14158708271', 
  //     body:'Hello!👋 Hope you’re having a good day! Wanna read?' 
  //   }, function( err, data ) {
  //     console.log('sending message')
  //   }).then(function(response) {
  //     console.log('Message sent', data);
  //   }).catch(function(err) {
  //     console.error(error);
  //   });
  // });

  // client.messages
  //   .create({
  //      body: "Hey there!👋 It's time for couple pages, isn't it?",
  //      from: '+12058435519',
  //      to: '+12262247542' //paste your own phone number
  //    })
  //   .then(message => console.log(message.sid));

// }

// });


module.exports = router;