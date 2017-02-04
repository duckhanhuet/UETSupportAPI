/**
 * Created by Tuan on 18/01/2017.
 */
var mongoose = require('mongoose');

var LoaiTinTuc = new mongoose.Schema({
    _id: {
        type: Number,
        require: true,
        unique: true
    },
    linkPage: {
        type: String,
        require: true
    }
    ,
    kind: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('LoaiTinTuc', LoaiTinTuc);
