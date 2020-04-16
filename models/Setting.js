var mongoose = require('mongoose');

var settingSchema = new mongoose.Schema({
        phone_number: String, 
        days_of_week: [Number],
        time: Date
});

module.exports = mongoose.model('Setting', settingSchema);