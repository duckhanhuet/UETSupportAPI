/**
 * Created by Vu Minh Tuan on 2/4/2017.
 */
var LoaiTinTuc = require('../models/LoaiTinTuc');
module.exports = {
    findOne: function (id, callback) {
        LoaiTinTuc.find({_id: id}, function (err, tintuc) {
            if (err) {
                callback(err, null)
                return;
            }
            callback(null, tintuc)
        })
    },
    findAll: function (callback) {
        LoaiTinTuc.find({}).sort({_id: 1}).exec(callback)
    }
}