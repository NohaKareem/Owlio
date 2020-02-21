let express = require('express');
let app = express();
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
let motion_sensor;
let barcode_scanner;
let pixel = require("node-pixel");
let strip = null;

arduino.on('ready', function(){
    console.log("arduino is running! you run too.");
    photoresistor = new five.Sensor({
        pin: 'A2',
        freq: 10000
    });

    photoresistor.on('data', function(){
        console.log(this.value)     //checks light every 10secs
        io.sockets.emit('photoresistor', this.value);
    });

    motion_sensor = new five.Motion({
        pin: 7,
        freq: 1000
    });

    motion_sensor.on("calibrated", function() {
        console.log("calibrated");
    });

    motion_sensor.on("motionstart", function() {
    console.log("motionstart");
    });

   motion_sensor.on("motionend", function() {
   console.log("motionend");
   });

   motion_sensor.on("data", function(data) {
    console.log(data);
    io.sockets.emit('motioncal');
  });

  strip = new pixel.Strip({
    board:this,
    controller: "I2CBACKPACK",
    pin:4,
    length: 16,
    gamma: 2.8
  });
    

  strip.on("ready", function(){
      strip.color("#ff0000");
      strip.show();
      console.log("light connected");
      console.log(strip);
  });
    
})  

