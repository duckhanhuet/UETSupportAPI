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
        type: Schema.Types.ObjectId,
        ref : ['SinhVien','Khoa','PhongBan']
    },
    idFile:{
        type: Schema.Types.ObjectId,
        ref : 'File'
    },

});

module.exports = mongoose.model('ThongBao',ThongBaoSchema);