var mongoose = require('mongoose');

var ChuDeSchema = mongoose.Schema({
    tenChuDe: {
        type: String
    },
    ghiChu:{
        type: String
    }
});

module.exports = mongoose.model('ChuDe',ChuDeSchema);

