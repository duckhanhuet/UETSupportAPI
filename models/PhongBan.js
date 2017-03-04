var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var PhongBanSchema = mongoose.Schema({
    _id:{
        type: String,
        ref : 'User',
        unique: true
    },
    tenPhongBan:{
        type: String,
        required: true
    },
    //cai nay k dung ts nhe
    idThongBao:[{
        type: Schema.Types.ObjectId,
        ref:'ThongBao'
    }]
});

module.exports = mongoose.model('PhongBan',PhongBanSchema);

