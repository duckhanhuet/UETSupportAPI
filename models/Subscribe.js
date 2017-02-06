var mongoose =require('mongoose');

var SubscribeSchema= new mongoose.Schema({
    _id:{
        type:String,
        unique: true,
        ref:'SinhVien'
    },
    idLoaiTinTuc:[{
        type:Number,
        ref:'LoaiTinTuc'
    }],
    idLoaiThongBao:[{
        type: Number,
        ref:'LoaiThongBao'
    }]
})

module.exports = mongoose.model('Subscribe',SubscribeSchema);