var mongoose = require('mongoose');

var PhongBanSchema = mongoose.Schema({
    _id:{
        type: String,
        ref : 'User',
        unique: true
    },
    tenPhongBan:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('PhongBan',PhongBanSchema);

