var MucDoThongBao= require('../models/MucDoThongBao');

module.exports =  {
    find: function (params, callback) {
        MucDoThongBao.find(params,function (err, mucdothongbaos) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,mucdothongbaos);
        })
    },

    findById: function (id, callback) {
        MucDoThongBao.findById(id,function (err, mucdothongbao) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,mucdothongbao);
        })
    },

    create: function (params, callback) {
        MucDoThongBao.create(params,function (err, mucdothongbao) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,mucdothongbao);
        })
    },
    update: function (id, params, callback) {
        MucDoThongBao.findByIdAndUpdate(id,params,{new: true},function (err, mucdothongbao) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,mucdothongbao);
        })
    },
    delete: function (id, callback) {
        MucDoThongBao.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}