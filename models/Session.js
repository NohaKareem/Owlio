var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
    start_time: Date,
    end_time: Date
}); 

module.exports = mongoose.model('Session', sessionSchema);