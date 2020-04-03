var mongoose = require('mongoose');

var settingSchema = new mongoose.Schema({
        // adjust light  settings by time
        color: String, 
        time: Date
}); 

module.exports = mongoose.model('Setting', settingSchema);