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
    idSinhVien:{
        type: Schema.Types.ObjectId,
        ref : 'SinhVien'
    },
    idLopMonHoc:{
        type: Schema.Types.ObjectId,
        ref : 'LopMonHoc'
    }

});

module.exports = mongoose.model('DiemMonHoc',DiemMonHocSchema);

