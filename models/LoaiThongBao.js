var mongoose = require('mongoose');

var LoaiThongBaoSchema= mongoose.Schema({
    _id: {
        type: Number,
        require: true,
        unique: true
    },
    tenLoaiThongBao:{
        type: String,
        //enum: ['DiemThi','LichThi','LichHoc','DangKiTinChi','TatCa','ThongBaoKhac'],
        default: 'TatCa'
    }
});

module.exports = mongoose.model('LoaiThongBao', LoaiThongBaoSchema);