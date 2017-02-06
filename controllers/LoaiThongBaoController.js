var LoaiThongBao = require('../models/LoaiThongBao');

module.exports =  {
    find: function (params, callback) {
        LoaiThongBao.find(params,function (err, loaithongbaos) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,loaithongbaos);
        })
    },

    findById: function (id, callback) {
        LoaiThongBao.findById(id,function (err, loaithongbao) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,loaithongbao);
        })
    },

    create: function (params, callback) {
        LoaiThongBao.create(params,function (err, loaithongbao) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,loaithongbao);
        })
    },
    update: function (id, params, callback) {
        LoaiThongBao.findByIdAndUpdate(id,params,{new: true},function (err, loaithongbao) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,loaithongbao);
        })
    },
    delete: function (id, callback) {
        LoaiThongBao.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}