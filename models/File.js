var mongoose = require('mongoose');

var FileSchema = mongoose.Schema({
    tenFile: {
        type: String
    },
    link:{
        type: String
    },
    img: { data: Buffer, contentType: String }
});

module.exports = mongoose.model('File',FileSchema);

