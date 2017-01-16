var mongoose   = require('mongoose');

var KhoaSchema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
    ,
    tenKhoa: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Khoa',KhoaSchema);