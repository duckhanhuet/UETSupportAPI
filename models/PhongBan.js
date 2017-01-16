var mongoose = require('mongoose');

var PhongBanSchema = mongoose.Schema({
    tenPhongBan:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model('PhongBan',PhongBanSchema);