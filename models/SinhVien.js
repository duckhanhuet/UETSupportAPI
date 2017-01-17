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
    },
    idLopMonHoc:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LopMonHoc'
    }

})

module.exports = mongoose.model('SinhVien',SinhVienSchema);

