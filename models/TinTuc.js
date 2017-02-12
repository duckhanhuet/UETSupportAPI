var mongoose = require('mongoose');

var TinTucSchema = new mongoose.Schema({
    link:{
        type: String,
        unique: true,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    content:{
        type : String,
        require: true
    },
    imageLink :{
        type : String,
        require : true
    },
    postAt :{
        type : Date,
        require :true,
        default :Date.now()
    },
    loaiTinTuc: {
        type : Number,
        ref : "LoaiTinTuc"
    }
});

module.exports = mongoose.model('TinTuc',TinTucSchema);