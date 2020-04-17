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
		// test (cookbook)9781501127618  9781771642484 !9780310116400
		if (!book) {

			// get data by barcode
			let barcode_api = `https://cors-anywhere.herokuapp.com/https://api.barcodable.com/api/v1/upc/${barcode}`;
			// let barcode_api = `https://cors-anywhere.herokuapp.com/https://api.barcodelookup.com/v2/products?barcode=${barcode}&formatted=y&key=${key}`;
			let title, isbn;
			axiosGET(barcode_api, (response) => {
					console.log('in  barcode response', response.data)
		
					title = response.data.item.matched_items[0].title; //barcodeable
					let isbn = response.data.item.isbn; //barcodable
		
					// retrieve author, book image, page numbers and genre (category) from google books api 
					// axiosGET(`https://www.googleapis.com/books/v1/volumes?q=isbn:9781501127618`, (response) => {
					axiosGET(`https://www.googleapis.com/books/v1/volumes?q=${isbn}`, (response) => {
						console.log('in google', response.data)
						let volumeInfo = response.data.items[0].volumeInfo;
						console.log(volumeInfo)
						
						let newBook = {};
						newBook.barcode = readingBarcode;
						newBook.isbn = isbn;
						newBook.title = volumeInfo.title;
						newBook.author = volumeInfo.authors[0];
						newBook.image = volumeInfo.imageLinks.thumbnail;
						newBook.pages = volumeInfo.pageCount;
						newBook.genre = volumeInfo.categories[0];
						console.log('new book is ')
						console.log(newBook)

						// add book
						axiosPOST(`${SERVER}/book`, newBook, (response) => {
							console.log('saved book')
							book = response.data;
							addedBookImage.src = book.image;
							addedBookTitle.alt = book.title + " image";
							addedBookTitle.innerHTML = "Reading now: " + book.title; 
						});
			});
		});
		} else {
			console.log('book already exists');
		}

		// if reading, start session
		if (reading) {
			let newSession = {
				start_time: new Date(), // current time stamp 
				book_id: book._id,
				light_lumens: photoresistorReading // current photoresistor reading
			};
			console.log('about to post session', newSession)
			// axiosPOST(`${SERVER}/session`, newSession, (response) => {
			// 	console.log('saved session start', response.data);
			// 	curr_session = response.data;
			// });
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


//twilio sms notifications method
// function sendMsg() {
	// const accountSid = config.accountSid; // 'ACcfb485c8e5af917e9dcafefec52e9053';
	// const authToken = config.authToken; // '1063070c39efe9746b2992002c3c40ad';
	// const accountSid = 'ACcfb485c8e5af917e9dcafefec52e9053';
	// const authToken = '1063070c39efe9746b2992002c3c40ad';
	// const client = require('twilio')(accountSid, authToken);
	// cronJob = require('cron').CronJob;

	//That is a format specific to cron that let’s us define the time 
	//and frequency of when we want this job to fire. In this case, 
	//at 01 minutes 17 hours every day. Check time specifics via link below:
	//http://www.nncron.ru/help/EN/working/cron-format.htm

	//to: ' ' - put your cell phone number there
	// var textJob = new cronJob( '19 12 * * *', function() {
	// client.messages.create( { 
	// 		to:'+12262247542',
	// 		from: twilioPhoneNumber, 
	// 		body:'Hello!👋 Hope you’re having a good day! Wanna read?' 
	// 	}, function( err, data ) {

	// 	}).then(function(response) {
	// 		console.log('Message sent', data);
	// 	}).catch(function(err) {
	// 		console.error(error);
	// 	});
	// },  null, true);

	//This code is for non-timed messages

	// client.messages
	//   .create({
	//      body: "Hey there!👋 It's time for couple pages, isn't it?",
	//      from: '+12058435519',
	//      to: '+12269276883' //paste your own phone number
	//    })
	//   .then(message => console.log(message.sid));
// }
// sms.addEventListener("click", sendMsg, true);
// console.log("sms run");


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
	
