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
    idSender:{
        type: String,
        //ref : ['GiangVien','Khoa','PhongBan']
    },
    idReceiver:{
        type: String,
        //ref: toan khoa, lop chinh, lop mon hoc , sinh vien.
    },
    idFile:[{
        type: String,
        ref : 'File'
    }],
    idLoaiThongBao:{
        type: Number,
        ref: 'LoaiThongBao'
    },
    idMucDoThongBao:{
        type: Number,
        ref:'MucDoThongBao'
    },
    link:{
        type: String
    },
});

module.exports = mongoose.model('ThongBao',ThongBaoSchema);

