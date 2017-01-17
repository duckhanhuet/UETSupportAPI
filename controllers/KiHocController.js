var KiHoc= require('../models/KiHoc');

module.exports =  {
    find: function (params, callback) {
        KiHoc.find(params,function (err, kihocs) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,kihocs);
        })
    },

    findById: function (id, callback) {
        KiHoc.findById(id,function (err, kihoc) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,kihoc);
        })
    },

    create: function (params, callback) {
        KiHoc.create(params,function (err, kihoc) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,kihoc);
        })
    },
    update: function (id, params, callback) {
        KiHoc.findByIdAndUpdate(id,params,{new: true},function (err, kihoc) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,kihoc);
        })
    },
    delete: function (id, callback) {
        KiHoc.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}