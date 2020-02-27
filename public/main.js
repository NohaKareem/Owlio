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

var barcode = '9780140157376';
const BARCODABLE_API = `https://cors-anywhere.herokuapp.com/https://api.barcodelookup.com/v2/products?barcode=${barcode}&formatted=y&key=gzz6z37yi996us4087hmpr2d8pjrnn`;// "https://api.barcodable.com/api/v1/upc/";
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes?q=isbn:";

/* helper methods */ 
// generates axios call using url and handles response using responseMethod
function axiosCall(url, responseMethod) {
	axios.get(url)
	.then(function(response) {
		responseMethod(response); 
	})
	.catch(function(error) {
		console.error(error);
	});
}

// finds book by input barcode using barcodable API
function findBookByBarcode(barcode) {
	console.log('in findBookByBarcode');
	axiosCall(BARCODABLE_API, (response) => {
		// axiosCall(BARCODABLE_API + barcode, (response) => {
		console.log(response.data);
	} );
}

findBookByBarcode(9781455586691);