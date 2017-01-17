var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var GiangVienSchema = mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
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


