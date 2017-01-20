var mongoose = require('mongoose');

var KiHocSchema = mongoose.Schema({
    tenKiHoc: {
        type: String,
        required: true
    },
    _id:{
        type:String,
        unique: true
    }
});

module.exports = mongoose.model('KiHoc',KiHocSchema);

