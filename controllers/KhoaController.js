var Khoa= require('../models/Khoa');

module.exports =  {
    find: function (params, callback) {
        Khoa.find(params,function (err, khoas) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,khoas);
        })
    },

    findById: function (id, callback) {
        Khoa.findById(id,function (err, khoa) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,khoa);
        })
    },

    create: function (params, callback) {
        Khoa.create(params,function (err, khoa) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,khoa);
        })
    },
    update: function (id, params, callback) {
        Khoa.findByIdAndUpdate(id,params,{new: true},function (err, khoa) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,khoa);
        })
    },
    delete: function (id, callback) {
        Khoa.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}