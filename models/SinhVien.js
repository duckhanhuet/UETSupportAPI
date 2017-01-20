var mongoose = require('mongoose');

var SinhVienSchema =new  mongoose.Schema({
    _id:{
        type: String,
        unique: true
    },

    tenSinhVien: {
        type: String,
        required: true
    },

    idLopChinh:{
        type: String,
        ref :'LopChinh'
    },
    idLopMonHoc:{
        type: String,
        ref: 'LopMonHoc'
    }

})

module.exports = mongoose.model('SinhVien',SinhVienSchema);

