var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var DiemMonHocSchema = mongoose.Schema({

    diemThanhPhan:{
        type: Number,
        required: true
    },
    diemCuoiKy:{
        type: Number,
        required: true
    },
    tongDiem:{
        type: Number,
    }
    ,
    idSinhVien:{
        type:String,
        ref : 'SinhVien'
    },
    idLopMonHoc:{
        type:String,
        ref : 'LopMonHoc'
    }

});

module.exports = mongoose.model('DiemMonHoc',DiemMonHocSchema);

