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
let pixel = require("node-pixel");
let strip = null;

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

//motion
            // proximity = new five.Proximity({
            //     controller: "HCSR04",
            //     pin: 7,
            //     freq: 1000
            // });

            // proximity.on("data", function() {
            //     console.log(this.cm + "cm", this.in + "in");
            // });
            
            // proximity.on("change", function() {
            //     if (proximity.cm < 35) {
            //         console.log("Someone's there!");
            //         io.sockets.emit('motionstart', "Someone's there!");
            //     } 
            //     else {
            //         console.log("Oops! no one's there.");
            //         io.sockets.emit('motionend', "Oops! no one's there.");
            //     }
            // });


// neopixel lights
    strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        strips: [ {pin: 7, length: 12}, ],
        gamma: 2.8,
    });

    strip.on("ready", function() {
        console.log("light up")
        // Set the entire strip to pink.
        strip.color('#903');

        // Set first and seventh pixels to turquoise.
        strip.pixel(0).color('#074');
        strip.pixel(6).color('#074');

        // Send instructions to NeoPixel.
        strip.show();

        // var loop = setInterval(function () {
        //     // Shift all pixels clockwise
        //     strip.shift(1, pixel.FORWARD, true);
        //     strip.show();
        // }, 1000 / 12);
    });

    this.repl.inject({
        strip: strip
    });

    // strip.on("ready", function() {
    //     console.log("light up")

    //     for (i = 0; i < strip.stripLength(); i++) {
    //         console.log(i);
    //         strip.pixel(i).color("teal");
    //     }
    //     strip.show();
    // });
    
}); 