var mongoose = require('mongoose');

var TinTucSchema = new mongoose.Schema({
    link:{
        type: String,
        unique: true,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    content:{
        type : String,
        require: true
    },
    imageLink :{
        type : String,
        require : true
    },
    role:{
        type: String,
        enum : ['SuKien','DaoTao','NghienCuu','HoiThao','HopTac','HoatDongDoan','TheThao_VanHoa','TuyenDung','TongHop'],
        default: 'TongHop'
    }
});

module.exports = mongoose.model('TinTuc',TinTucSchema);