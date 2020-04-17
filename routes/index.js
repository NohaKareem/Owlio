var express = require('express');
var router = express.Router();
var Session = require('../models/Session.js');
var smsConfig = require('../config.js'); // sms credentials
const client = require('twilio')(smsConfig.accountSid, smsConfig.authToken);


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

//twilio sms notifications method

  cronJob = require('cron').CronJob;

  //That is a format specific to cron that let’s us define the time 
  //and frequency of when we want this job to fire. In this case, 
  //at 01 minutes 17 hours every day. Check time specifics via link below:
  //http://www.nncron.ru/help/EN/working/cron-format.htm

  //to: ' ' - put your cell phone number there
  console.log('about to write sms')
  // var textJob = new cronJob( '19 12 * * *', function() {
  cronJob.schedule( '* * * * *', function() {
    client.messages.create({ 
        to:'+12262247542',
        from: smsConfig.twilioPhoneNumber, 
        body:'Hello!👋 Hope you’re having a good day! Wanna read?' 
      }, function( err, data ) {
        console.log('sending message')
      }).then(function(response) {
        console.log('Message sent', data);
      }).catch(function(err) {
        console.error(error);
      });
  });//

  //This code is for non-timed messages
  // client.messages
  //   .create({
  //      body: "Hey there!👋 It's time for couple pages, isn't it?",
  //      from: '+12058435519',
  //      to: '+12262247542' //paste your own phone number
  //    })
  //   .then(message => console.log(message.sid));
});


module.exports = router;