//Javascript Document
console.log("Linked up");

let socket = io.connect("http://localhost:3000");
let light = document.querySelector("#photoresistor");
let motion = document.querySelector("#motion");

socket.on('photoresistor', function(photoresistor){
	console.log(photoresistor);
	light.innerHTML = photoresistor;
});

socket.on('motioncal', function(motioncal){
	console.log("motion calibrated");
	motion.innerHTML = motioncal;
});

socket.on('motionstart', function(motionstart){
	console.log("motion started");
	motion.innerHTML = motionstart;
});
socket.on('motionend', function(motionend){
	console.log("motion ended");
	motion.innerHTML = motionend;
});