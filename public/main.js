//Javascript Document
console.log("Linked up");

//barcode
let barcode = document.querySelector('#barcodeInput');//'9780691158648';//'9780140157376';
// let barcodeButton = document.querySelector('#barcodeButton');
let readingButton = document.querySelector('#readingButton');
let addedBookImage = document.querySelector('#addedBookImage');
let addedBookTitle = document.querySelector('#addedBookTitle');
let readingBarcodeInput = document.querySelector('#readingBarcodeInput');
let reading = false;
// let sms = document.querySelector('#sms');
var photoresistorReading = -1;
var curr_session;
const SERVER = 'http://localhost:3000';

// finds book by input barcode using barcodable API
function findBookByBarcode() {
	barcode = document.querySelector('#barcodeInput');
	barcode = barcode.value; // test 9781455586691

	let barcode_api = `https://cors-anywhere.herokuapp.com/https://api.barcodable.com/api/v1/upc/${barcode}`;
	// let barcode_api = `https://cors-anywhere.herokuapp.com/https://api.barcodelookup.com/v2/products?barcode=${barcode}&formatted=y&key=${API_KEY}`;
	axiosGET(barcode_api, (response) => {
			console.log(response.data);
			// let bookTitle = response.data.products[0].title; //barcodelookup
			let bookTitle = response.data.item.matched_items[0].title; //barcodeable
			let isbn = response.data.item.isbn; //barcodeable
			addedBookTitle.innerHTML = bookTitle; 
			// addedBookImage.src = response.data.products[0].images[0]; //barcodelookup
			addedBookImage.alt = bookTitle + " image"; 
			
			// retrieve book image and page numbers from google books api 
			axiosGET(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`, (response) => {
				console.log('google')
				console.log(response.data)
				addedBookImage.src = response.data.items[0].volumeInfo.imageLinks.thumbnail;
				let pages = response.data.items[0].volumeInfo.pageCount;
				let categories = response.data.items[0].volumeInfo.categories;
				console.log(pages)
				console.log(categories)
			});
		// console.log(response.data);
	} );
}

function toggleReadingSession() {
	// console.log('about to sms')
	// sendMsg();
	// console.log('texted!')

	// toggle start/stop reading button display
	readingButton.innerHTML = (!reading ? "stop" : "start") + " reading";
	reading = !reading;

	let readingBarcode = readingBarcodeInput.value;

	// get book id, if exists
	var book;
	axiosGET(`${SERVER}/book/barcode/${readingBarcode}`, (response) => {
		book = response.data;
		addedBookImage.src = book.image;
		addedBookTitle.alt = book.title + " image";
		addedBookTitle.innerHTML = "Reading now: " + book.title; 
		
		// add book if doesn't exist
		// test 9781501127618  9781771642484
		if (!book) {
			// get data by barcode
			// let barcode_api = `https://cors-anywhere.herokuapp.com/https://api.barcodable.com/api/v1/upc/${readingBarcode}`;
			// let barcode_api = `https://cors-anywhere.herokuapp.com/https://api.barcodelookup.com/v2/products?barcode=${barcode}&formatted=y&key=${API_KEY}`;
			// let title, isbn;
			// axiosGET(barcode_api, (response) => {
			// title = response.data.item.matched_items[0].title; //barcodeable
			// let isbn = response.data.item.isbn; //barcodable

			// retrieve author, book image, page numbers and genre (category) from google books api (directly using barcode)
			axiosGET(`https://www.googleapis.com/books/v1/volumes?q=${readingBarcode}`, (response) => {
				// axiosGET(`https://www.googleapis.com/books/v1/volumes?q=${isbn}`, (response) => {
				console.log('in google', response.data)
				let volumeInfo = response.data.items[0].volumeInfo;
				// console.log(volumeInfo)
				
				let newBook = {};
				newBook.barcode = readingBarcode;
				newBook.isbn = volumeInfo.industryIdentifiers[0].identifier;
				newBook.title = volumeInfo.title;
				newBook.author = volumeInfo.authors[0];
				newBook.image = volumeInfo.imageLinks.thumbnail;
				newBook.pages = volumeInfo.pageCount;
				newBook.genre = volumeInfo.categories[0];
				console.log('new book is ', newBook)

				// add book
				axiosPOST(`${SERVER}/book`, newBook, (response) => {
					console.log('saved book')
					book = response.data;
					addedBookImage.src = book.image;
					addedBookTitle.alt = book.title + " image";
					addedBookTitle.innerHTML = "Reading now: " + book.title; 
				});
			});
		// });
		} else {
			console.log('book already exists');
		}
		
		// if reading (and a valid book is being read), start session
		if (reading && book._id) {
			let newSession = {
				start_time: new Date().getHours() + ":" + new Date().getMinutes(), // current time stamp 
				end_time: new Date().getHours() + ":" + new Date().getMinutes(), // current time stamp as intial end tim 
				book_id: book._id,
				light_lumens: photoresistorReading // current photoresistor reading
			};
			console.log('about to post session', newSession)
			axiosPOST(`${SERVER}/session`, newSession, (response) => {
				console.log('saved session start', response.data);
				curr_session = response.data;
			});
		} 
		// save session end time
		else {
			let newSession = {
				end_time: new Date().getHours() + ":" + new Date().getMinutes(), // current time stamp as intial end tim 
			};
			axiosPOST(`${SERVER}/session/end_time/${curr_session._id}`, newSession, (response) => {
				console.log('saved session end', response.data);
				curr_session = response.data;
			});

		}
	});
}

readingButton.addEventListener("click", toggleReadingSession, false);

/* helper methods */ 
// generates axios GET call using url and handles response using responseMethod
function axiosGET(url, responseMethod) {
	axios.get(url)
	.then(function(response) {
		responseMethod(response); 
	})
	.catch(function(error) {
		console.error(error);
	});
}

// generates axios POST call using url and handles response using responseMethod
function axiosPOST(url, data, responseMethod) {
	axios.post(url, data)
	.then(function(response) {
		responseMethod(response); 
	})
	.catch(function(error) {
		console.error(error);
	});
}

// barcodeButton.addEventListener("click", findBookByBarcode);

// sensors
let socket = io.connect("http://localhost:3000");
let lightsensor = document.querySelector("#photoresistor");
let motion = document.querySelector("#motion");
let lights = document.querySelector("#lights");

//photoresistor 
	socket.on('photoresistorhigh', function(photoresistorhigh){
		// console.log("photo");
		lightsensor.innerHTML = photoresistorhigh;

		// save later to be saved in a reading session
		photoresistorReading =  photoresistorhigh;
	});
	socket.on('photoresistorlow', function(photoresistorlow){
		// console.log("photo");
		lightsensor.innerHTML = photoresistorlow;
	});

//motion
	socket.on('motionstart', function(motionstart){
		motion.innerHTML = motionstart;
	});
	socket.on('motionend', function(motionend){
		motion.innerHTML = motionend;
	});

//lights
	socket.on('lightson', function(lightson){
		lights.innerHTML = lightson;
	});
	socket.on('lightsoff', function(lightsoff){
		lights.innerHTML = lightsoff;
	});
	
