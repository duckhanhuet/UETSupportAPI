var mongoose    = require('mongoose');
var Schema  = mongoose.Schema;
var LopChinhSchema = mongoose.Schema({
    _id:{
      type: String,
      unique: true
    },
    tenLopChinh:{
        type: String
    },
    idKhoa:{
        type: String,
        ref :'Khoa'
    }
});



module.exports = mongoose.model('LopChinh',LopChinhSchema);

