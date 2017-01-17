var ChuDe = require('../models/ChuDe');


module.exports =  {
    find: function (params, callback) {
        ChuDe.find(params,function (err, chudes) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,chudes);
        })
    },

    findById: function (id, callback) {
        ChuDe.findById(id,function (err, chude) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,chude);
        })
    },

    create: function (params, callback) {
        ChuDe.create(params,function (err, chude) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,chude);
        })
    },
    update: function (id, params, callback) {
        ChuDe.findByIdAndUpdate(id,params,{new: true},function (err, chude) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,chude);
        })
    },
    delete: function (id, callback) {
        ChuDe.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}