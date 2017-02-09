var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var DiemRenLuyenSchema = mongoose.Schema({
    diemRenLuyen: {
        type: Number,
        required: true
    },
    idSinhVien:{
        type: String,
        ref : 'SinhVien'
    },
    idKi :{
        type: String,
        ref : 'KiHoc'
    }
});

module.exports = mongoose.model('DiemRenLuyen',DiemRenLuyenSchema);

