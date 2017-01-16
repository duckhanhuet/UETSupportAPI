var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var GiangVienSchema = mongoose.Schema({
    tenGiangVien:{
        type:String,
        required: true
    },
    idLopMonHoc: [{
            type: Schema.Types.ObjectId,
            ref : 'LopMonHoc'
        }]
});

module.exports = mongoose.model('GiangVien',GiangVienSchema);