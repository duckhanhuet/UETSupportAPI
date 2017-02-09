var mongoose = require('mongoose');

var FileSchema = mongoose.Schema({
    tenFile: {
        type: String
    },
    link:{
        type: String
    }
});

module.exports = mongoose.model('File',FileSchema);

