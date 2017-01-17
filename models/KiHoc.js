var mongoose = require('mongoose');

var KiHocSchema = mongoose.Schema({
    tenKiHoc: {
        type: String
    }
});

module.exports = mongoose.model('KiHoc',KiHocSchema);

