var mongoose   = require('mongoose');

var KhoaSchema = new mongoose.Schema({
    tenKhoa: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Khoa',KhoaSchema);