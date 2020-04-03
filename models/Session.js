var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
    start_time: Date,
    end_time: Date, 
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, 
    comment: String,
    light_lumens: Number
}); 

module.exports = mongoose.model('Session', sessionSchema);