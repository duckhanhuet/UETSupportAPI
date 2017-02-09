var mongoose = require('mongoose');

var SinhVienSchema =new  mongoose.Schema({
    _id:{
        type: String,
        unique: true,
        ref: 'User'
    },

    tenSinhVien: {
        type: String,
        required: true
    },

    idLopChinh:{
        type: String,
        ref :'LopChinh'
    },
    idLopMonHoc:[{
        type: String,
        ref: 'LopMonHoc'
    }],
    tokenFirebase:{
      type: String
    },
    // nhanLoaiThongBao:[{
    //     type: String,
    //     enum:['DiemThi','LichThi','DangKiTinChi','LichHoc','ThongBaoKhac'],
    //     default:'ThongBaoKhac',
    //     ref:'LoaiThongBao'
    // }]
})

module.exports = mongoose.model('SinhVien',SinhVienSchema);

