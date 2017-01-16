var mongoose = require('mongoose');

var FileSchema = mongoose.Schema({
    tenFile: {
        type: String
    },
    link:{
        type: String
    },
    time:{
        type:Date,
        default: Date.now
    }
});

module.exports = mongoose.model('File',FileSchema);