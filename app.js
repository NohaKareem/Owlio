var dbAuth = require('./config.js'); // atlas db credentials

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var bookRouter = require('./routes/book');
var sessionRouter = require('./routes/session');
var settingRouter = require('./routes/setting');
var apiRouter = require('./routes/api');
var usersRouter = require('./routes/users');

mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true); 
mongoose.set('useNewUrlParser', true); 

mongoose.connect('mongodb+srv://' + dbAuth.DB_AUTH + '@cluster0-y9uwh.mongodb.net/' + dbAuth.DB_NAME + '?retryWrites=true&w=majority',
{ useNewUrlParser: true }, function(err) {
	if(err) {
		console.log('error connecting', err);
	} else {
		console.log('connected!');
	}
});

var app = express();
// let http = require('http').createServer(app); // create http server
// let io = require('socket.io')(http);
// app.listen(8080); 
// http.listen(8000);

// allow cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/book', bookRouter);
app.use('/session', sessionRouter);
app.use('/setting', settingRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//SENSORS

// let express = require('express');
// let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use(express.static("./public"));

http.listen(3000, function(){
    console.log(`server is running at:
     http://localhost:3000`);
});

let five = require('johnny-five');
let arduino = new five.Board();
let photoresistor;
let proximity;
// let pixel = require("node-pixel");
// let strip = null;


arduino.on('ready', function(){
    console.log("arduino is running!");

//photoresistor
    photoresistor = new five.Sensor({
        pin: 'A2',
        freq: 1000
    });

    // photoresistor.on('data', function(){
        // console.log(this.value);
        // io.sockets.emit('photoresistor', this.value); // checks light every 10 seconds
    // });

    photoresistor.on('change', function(){
        console.log(this.value);
        if (photoresistor.value > 400) {
            console.log("Lights are too low for you to read.");
            io.sockets.emit('photoresistorlow', "Lights are too low for you to read.");
        }   
        else {
            console.log("This light is good for reading.");
            io.sockets.emit('photoresistorhigh', "This light is good for reading.");
        }
    });

//motion
    proximity = new five.Proximity({
        controller: "HCSR04",
        pin: 7,
        freq: 1000
    });
            
    proximity.on("data", function() {
            //console.log(this.cm + "cm");
        if (proximity.cm < 35) {
            console.log("Someone's there!");
            io.sockets.emit('motionstart', "Someone's there!");
        } 
        else {
            console.log("Oops! no one's there.");
            io.sockets.emit('motionend', "Oops! no one's there.");
        }
    });

    proximity.on("change", function(){
        if (proximity.cm < 35 & photoresistor.value > 400) {
            console.log("ON");
            io.sockets.emit('lightson', "ON!");
        }
        else {
            console.log("OFF");
            io.sockets.emit('lightsoff', "OFF!");
        }
    });

    // neopixel lights
                // strip = new pixel.Strip({
                //     board: this,
                //     controller: "FIRMATA",
                //     strips: [ {pin: 7, length: 12}],
                //     gamma: 2.8,
                // });

                // strip.on("ready", function() {
                // console.log("light up");
                // strip.color('#903');
                // strip.pixel(0).color('#074');

                // strip.show();    

        // var loop = setInterval(function () {
        //     strip.shift(1, pixel.FORWARD, true);
        //     strip.show();
        // }, 1000 / 12);
                // });  

                // this.repl.inject({
                //     strip: strip
                // });

        // strip.on("ready", function() {
        //     console.log("light up")

        //     for (i = 0; i < strip.stripLength(); i++) {
        //         console.log(i);
        //         strip.pixel(i).color("teal");
        //     }
        //     strip.show();
        // });
}); 

module.exports = app;
