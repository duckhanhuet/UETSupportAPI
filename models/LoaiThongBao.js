var mongoose = require('mongoose');

var LoaiThongBaoSchema= mongoose.Schema({
    _id: {
        type: String
    },
    tenLoaiThongBao:{
        type: String,
        enum: ['DiemThi','LichThi','LichHoc','DangKiTinChi','ThongBaoKhac'],
        default: 'ThongBaoKhac'
    }
})