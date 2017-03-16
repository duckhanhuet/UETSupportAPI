var mongoose = require('mongoose');
var Feedback = require('./Feedback')
var Schema   = mongoose.Schema;
var ThongBaoSchema = mongoose.Schema({
    kindIdSender:{
        type: String,
        enum: ['PhongBan','Khoa','GiangVien']
    },
    kindIdReceiver:{
        type: String,
        enum:['SinhVien','Khoa','LopMonHoc','LopChinh','ALL']
    },
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
        refPath: 'kindIdSender'
        //ref : ['GiangVien','Khoa','PhongBan']
    },
    idReceiver:{
        type: String,
        refPath: 'kindIdReceiver'
        //ref: toan khoa, lop chinh, lop mon hoc , sinh vien.
    },
    idFile:[{
        type: Schema.Types.ObjectId,
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
        type: String,
        unique: true,
        sparse: true
    },
    feedback:[
        {
            kind:{
              type: String,
              enum:['Khoa','PhongBan','GiangVien','SinhVien'],
              require: true
            },
            noiDung :{
                type: String,
                require: true
            },
            idComment:{
                type: String,
                require: true,
                refPath: 'feedback.kind'
            },
            time:{
                type: Date,
                default: Date.now
            }
        }
    ]
});
module.exports = mongoose.model('ThongBao',ThongBaoSchema);

