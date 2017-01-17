var File = require('../models/File');

module.exports =  {
    find: function (params, callback) {
        File.find(params,function (err, files) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,files);
        })
    },

    findById: function (id, callback) {
        File.findById(id,function (err, file) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,file);
        })
    },

    create: function (params, callback) {
        File.create(params,function (err, file) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,file);
        })
    },
    update: function (id, params, callback) {
        File.findByIdAndUpdate(id,params,{new: true},function (err, file) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,file);
        })
    },
    delete: function (id, callback) {
        File.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}