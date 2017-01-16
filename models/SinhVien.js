var mongoose = require('mongoose');

var SinhVienSchema =new  mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },

    tenSinhVien: {
        type: String
    },

    idLopChinh:{
        type: mongoose.Schema.Types.ObjectId,
        ref :'LopChinh'
    }

})

module.exports = mongoose.model('SinhVien',SinhVienSchema);