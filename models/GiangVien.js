var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var GiangVienSchema = mongoose.Schema({
    _id:{
        type: String,
        ref : 'User',
        unique:true
    },
    tenGiangVien:{
        type:String,
        required: true
    },
    idKhoa:{
        type:String,
        ref:'Khoa'
    },
    idLopMonHoc: [{
             type: String,
             ref : 'LopMonHoc'
    }],
    //cai nay khong dung ts nhe
    idThongBao:[{
        type: Schema.ObjectId,
        ref:'ThongBao'
    }]
});

module.exports = mongoose.model('GiangVien',GiangVienSchema);


