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

// finds book by input barcode using barcodable API
function findBookByBarcode() { 
	barcode = document.querySelector('#barcodeInput');
	barcode = barcode.value;//9781455586691
	// console.log(barcode);

	let barcode_api = `https://cors-anywhere.herokuapp.com/https://api.barcodable.com/api/v1/upc/${barcode}`;
	// let barcode_api = `https://cors-anywhere.herokuapp.com/https://api.barcodelookup.com/v2/products?barcode=${barcode}&formatted=y&key=${key}`;
	axiosCall(barcode_api, (response) => {
			console.log(response.data);
			let addedBookTitle = document.querySelector('#addedBookTitle');
			let addedBookImage = document.querySelector('#addedBookImage');
			// let bookTitle = response.data.products[0].title; //barcodelookup
			let bookTitle = response.data.item.matched_items[0].title; //barcodeable
			let isbn = response.data.item.isbn; //barcodeable
			// console.log(isbn);
			addedBookTitle.innerHTML = bookTitle; 
			// addedBookImage.src = response.data.products[0].images[0]; //barcodelookup
			addedBookImage.alt = bookTitle + " image"; 
			
			// retrieve book image and page numbers from google books api 
			axiosCall(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`, (response) => {
				console.log('google')
				console.log(response.data)
				addedBookImage.src = response.data.items[0].volumeInfo.imageLinks.thumbnail;
				let pages = response.data.items[0].pageCount;
				console.log(pages)
			});
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