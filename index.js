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

    photoresistor.on('data', function(){
        console.log(this.value);
        io.sockets.emit('photoresistor', this.value); // checks light every 10 seconds
    });

    photoresistor.on('change', function(){
        console.log(this.value);
        if (photoresistor.value > 400) {
            console.log("Lighs are too low for you to reading.");
        }   
        else {
            console.log("This light is good for read.");
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
            io.sockets.emit('lightson', "Lights are ON!");
        }
        else {
            console.log("OFF");
            io.sockets.emit('lightsoff', "Lights are OFF!");
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