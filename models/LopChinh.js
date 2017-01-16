var mongoose    = require('mongoose');
var Schema  = mongoose.Schema;
var LopChinhSchema = mongoose.Schema({
    tenLopChinh:{
        type: String
    },
    idKhoa:{
        type: Schema.Types.ObjectId,
        ref :'Khoa'
    }
});



module.exports = mongoose.model('LopChinh',LopChinhSchema);