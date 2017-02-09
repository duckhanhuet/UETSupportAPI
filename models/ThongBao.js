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
        //ref : ['GiangVien','Khoa','PhongBan']
    },
    idFile:{
        type: String,
        ref : 'File'
    },
    idLoaiThongBao:{
        type: Number,
        ref: 'LoaiThongBao'
    },
    idMucDoThongBao:{
        type: Number,
        ref:'MucDoThongBao'
    }
});

module.exports = mongoose.model('ThongBao',ThongBaoSchema);

