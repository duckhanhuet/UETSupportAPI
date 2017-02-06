var Subscribe = require('../models/Subscribe');

module.exports =  {
    find: function (params, callback) {
        Subscribe.find(params,function (err, subscribes) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,subscribes);
        })
    },

    findById: function (id, callback) {
        Subscribe.findById(id,function (err, subscribe) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,subscribe);
        })
    },

    create: function (params, callback) {
        Subscribe.create(params,function (err, subscribe) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,subscribe);
        })
    },
    update: function (id, params, callback) {
        Subscribe.findByIdAndUpdate(id,params,{new: true},function (err, subscribe) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,subscribe);
        })
    },
    delete: function (id, callback) {
        Subscribe.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}