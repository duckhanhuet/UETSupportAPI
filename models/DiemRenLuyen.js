var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var DiemRenLuyenSchema = mongoose.Schema({
    diemRenLuyen: {
        type: Number,
        required: true
    },
    idSinhVien:{
        type: Schema.Types.ObjectId,
        ref : 'SinhVien'
    },
    idKi :{
        type: Schema.Types.ObjectId,
        ref : 'KiHoc'
    }
});

module.exports = mongoose.model('DiemRenLuyen',DiemRenLuyenSchema);