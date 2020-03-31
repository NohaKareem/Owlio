var mongoose = require('mongoose');

var bookSchema = new mongoose.Schema({
    // sessions_data: {
    //         session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' }, 
    //         comment: String
    // }, 
    review: String, 
    rating: Number, 
    barcode: String, 
    isbn: String, 
    favorite: Boolean
}); 

module.exports = mongoose.model('Book', bookSchema);