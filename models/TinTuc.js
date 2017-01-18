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
    postAt :{
        type : Date,
        require :true,
        defaulr :Date.now()
    },
    role:{
        type: String,
        enum : ['DaoTao','NghienCuu','HoiThao','HopTac','HoatDongDoan','TheThaoVanHoa','TuyenDung','TongHop'],
        default: 'TongHop'
    }
});

module.exports = mongoose.model('TinTuc',TinTucSchema);