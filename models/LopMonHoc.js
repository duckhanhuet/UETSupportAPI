var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var LopMonHocSchema = mongoose.Schema({
    _id:{
        type: String,
        required: true,
        unique: true
    },
    tenLopMonHoc: {
        type: String,
        //unique: true
    },
    thoiGian:{
        type: Date,
        default: Date.now
    },
    idKiHoc:{
        type: String,
        ref : 'KiHoc'
    },
    idGiangVien:[{
        type: String,
        ref :'GiangVien'
    }]
});

module.exports = mongoose.model('LopMonHoc',LopMonHocSchema);

