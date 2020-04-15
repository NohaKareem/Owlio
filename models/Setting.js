var mongoose = require('mongoose');

var settingSchema = new mongoose.Schema({
        phone_number: String, 
        day_of_week: Number,
        time: Date
});

module.exports = mongoose.model('Setting', settingSchema);