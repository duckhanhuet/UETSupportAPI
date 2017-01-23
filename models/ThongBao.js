var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ThongBaoSchema = mongoose.Schema({
    tieuDe:{
        type: String
    },
    noiDung:{
        type: String
    },
    time:{
        type: Date,
        default: Date.now
    },
    idUser:{
        type: String,
        ref : ['SinhVien','Khoa','PhongBan']
    },
    idFile:{
        type: String,
        ref : 'File'
    },
    loaiThongBao:[{
        type: String,
        ref: 'LoaiThongBao'
    }],
    mucDoThongBao:{
        type: String,
        enum: ['khanCap','quanTrong','binhThuong'],
        default:'binhThuong'
    }
});

module.exports = mongoose.model('ThongBao',ThongBaoSchema);

