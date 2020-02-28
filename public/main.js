//Javascript Document
console.log("Linked up");

let socket = io.connect("http://localhost:3000");
let light = document.querySelector("#photoresistor");
let motion = document.querySelector("#motion");

socket.on('photoresistor', function(photoresistor){
	// console.log(photoresistor);
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

let barcode = document.querySelector('#barcodeInput');//'9780691158648';//'9780140157376';
let barcodeButton = document.querySelector('#barcodeButton');
let isbn;

// finds book by input barcode using barcodable API
function findBookByBarcode() { 
	barcode = document.querySelector('#barcodeInput');
	barcode = barcode.value;
	// console.log(barcode);

	let barcode_api = `https://cors-anywhere.herokuapp.com/https://api.barcodelookup.com/v2/products?barcode=${barcode}&formatted=y&key=gzz6z37yi996us4087hmpr2d8pjrnn`;
	axiosCall(barcode_api, (response) => {
		let addedBookTitle = document.querySelector('#addedBookTitle');
		let addedBookImage = document.querySelector('#addedBookImage');
		let bookTitle = response.data.products[0].title;
		addedBookTitle.innerHTML = bookTitle; 
		addedBookImage.src = response.data.products[0].images[0]; 
		addedBookImage.alt = bookTitle + " image"; 
		// console.log(response.data);
	} );
}

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

barcodeButton.addEventListener("click", findBookByBarcode);