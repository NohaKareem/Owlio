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
        freq: 100
    });

    motion_sensor.on("calibrated", function() {
        console.log("calibrated", 1000);
        io.sockets.emit('calibrated', 1000);
    });

    motion_sensor.on("motionstart", function() {
        console.log("motionstart", 1000);
        io.sockets.emit('motionstart', 1000);
    });

   motion_sensor.on("motionend", function() {
        io.sockets.emit('motionend', 1000);
        console.log("motionend", 1000);
   });

   motion_sensor.on("data", function(data) {
    // console.log(data);
    // io.sockets.emit('motioncal');
  });

  strip = new pixel.Strip({
    board: this,
    // controller: "FIRMATA",
    controller: "I2CBACKPACK",
    // pin:4,
    // length: 16,
    strips: [{ pin: 4, length: 16 }],
    gamma: 2.8
  });

  strip.on("ready", function(){
      strip.color("#ff0000");
      strip.show();
      console.log("light connected");
    //   console.log(strip);
  });
    
}); 

