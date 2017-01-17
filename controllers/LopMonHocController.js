var LopMonHoc = require('../models/LopMonHoc');

module.exports =  {
    find: function (params, callback) {
        LopMonHoc.find(params,function (err, lopmonhocs) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,lopmonhocs);
        })
    },

    findById: function (id, callback) {
        LopMonHoc.findById(id,function (err, lopmonhoc) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,lopmonhoc);
        })
    },

    create: function (params, callback) {
        LopMonHoc.create(params,function (err, lopmonhoc) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,lopmonhoc);
        })
    },
    update: function (id, params, callback) {
        LopMonHoc.findByIdAndUpdate(id,params,{new: true},function (err, lopmonhoc) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,lopmonhoc);
        })
    },
    delete: function (id, callback) {
        LopMonHoc.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}