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
				let pages = response.data.items[0].volumeInfo.pageCount;
				let categories = response.data.items[0].volumeInfo.categories;
				console.log(pages)
				console.log(categories)
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

//twilio sms notifications method
function sendMsg(){

const accountSid = 'ACcfb485c8e5af917e9dcafefec52e9053';
const authToken = '1063070c39efe9746b2992002c3c40ad';
const client = require('twilio')(accountSid, authToken);
cronJob = require('cron').CronJob;

//That is a format specific to cron that let’s us define the time 
//and frequency of when we want this job to fire. In this case, 
//at 01 minutes 17 hours every day. Check time specifics via link below:
//http://www.nncron.ru/help/EN/working/cron-format.htm

//to: ' ' - put your cell phone number there
var textJob = new cronJob( '19 12 * * *', function(){
  client.messages.create( { to:'+12262247542', from:'12058435519', body:'Hello!👋 Hope you’re having a good day! Wanna read?' }, function( err, data ) {});
},  null, true);


//This code is for non-timed messages

// client.messages
//   .create({
//      body: "Hey there!👋 It's time for couple pages, isn't it?",
//      from: '+12058435519',
//      to: '+12262247542' //paste your own phone number
//    })
//   .then(message => console.log(message.sid));


}

barcodeButton.addEventListener("click", findBookByBarcode);