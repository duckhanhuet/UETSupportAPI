var mongoose = require('mongoose');

var PhongBanSchema = mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    tenPhongBan:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('PhongBan',PhongBanSchema);