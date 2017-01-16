var mongoose = require('mongoose');

var SinhVienSchema =new  mongoose.Schema({
    tenSinhVien: {
        type: String
    },
    idLopChinh:{
        type: mongoose.Schema.Types.ObjectId,
        ref :'LopChinh'
    }
})


module.exports = mongoose.model('SinhVien',SinhVienSchema);