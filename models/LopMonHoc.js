var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var LopMonHocSchema = mongoose.Schema({
    tenLopMonHoc: {
        type: String,
        required: true
    },
    thoiGian:{
        type: Date,
        default: Date.now
    },
    idKiHoc:{
        type: Schema.Types.ObjectId,
        ref : 'KiHoc'
    },
    idGiangVien:[{
        type: Schema.Types.ObjectId,
        ref :'GiangVien'
    }]
});

module.exports = mongoose.model('LopMonHoc',LopMonHocSchema);