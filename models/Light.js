var mongoose = require('mongoose');

var lightSchema = new mongoose.Schema({
    // adjust light settings by time
    settings: [
        {
            color: String, 
            time: Date
        }        
    ],

    // log session light data 
    sessions: [
        {
            session_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' }, 
            lumens: Number
        }
    ]
}); 

module.exports = mongoose.model('Light', lightSchema);