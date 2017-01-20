var mongoose   = require('mongoose');

var KhoaSchema = new mongoose.Schema({
    _id:{
        type: String,
        ref : 'User',
        unique: true
    }
    ,
    tenKhoa: {
        type: String,
        required: true,
        unique:true
    }
});

module.exports = mongoose.model('Khoa',KhoaSchema);

