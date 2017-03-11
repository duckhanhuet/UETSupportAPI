var mongoose = require('mongoose');

var FeedbackSchema = mongoose.Schema({
    noiDung :{
        type: String,
        require: true
    },
    idSender:{
        type: String,
        require: true
    },
    time:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Feedback',FeedbackSchema);

