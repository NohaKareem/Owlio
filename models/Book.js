var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
    review: String, 
    rating: Number, 
    barcode: String, 
    isbn: String, 

    title: String, 
    author: String, 
    genre: String, 
    categories: [String], 
    pages: Number, 
    image: String, 

    favorite: Boolean
}); 

module.exports = mongoose.model('Book', bookSchema);