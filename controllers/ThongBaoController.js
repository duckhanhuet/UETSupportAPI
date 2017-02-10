var ThongBao= require('../models/ThongBao');

module.exports =  {
    find: function (params, callback) {
        ThongBao.find(params).populate([
            {
                path:'idFile'
            },
            {
                path:'idThongBao'
            }
        ]).exec(function (err, thongbaos) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,thongbaos);
        })
    },

    findById: function (id, callback) {
        ThongBao.findById(id).populate([
            {
                path:'idFile'
            },
            {
                path:'idThongBao'
            }
        ]).exec(function (err, thongbao) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,thongbao);
        })
    },

    create: function (params, callback) {
        ThongBao.create(params,function (err, thongbao) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,thongbao);
        })
    },
    update: function (id, params, callback) {
        ThongBao.findByIdAndUpdate(id,params,{new: true},function (err, thongbao) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,thongbao);
        })
    },
    delete: function (id, callback) {
        ThongBao.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}