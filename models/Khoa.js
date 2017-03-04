var mongoose   = require('mongoose');
var Schema   = mongoose.Schema;

var KhoaSchema = new mongoose.Schema({
    _id:{
        type: String,
        ref : 'User',
        unique: true
    }
    ,
    tenKhoa: {
        type: String,
        required: true,
        unique:true
    },
    //cai nay khong dung toi nhe
    idThongBao:[{
        type: Schema.Types.ObjectId,
        ref:'ThongBao'
    }]
});

module.exports = mongoose.model('Khoa',KhoaSchema);

