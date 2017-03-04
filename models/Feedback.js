var mongoose = require('mongoose');

var FeedbackSchema = mongoose.Schema({
    noiDung :{
        type: String,
        require: true
    },
    idSender:{
        type: String,
        require: true
    }
    // ,
    // idReceiver:{
    //     type:String,
    //     require:true
    // }
});

module.exports = mongoose.model('Feedback',FeedbackSchema);

