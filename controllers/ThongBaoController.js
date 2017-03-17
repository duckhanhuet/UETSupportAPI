var ThongBao= require('../models/ThongBao');

module.exports =  {
    find: function (params, callback) {
        ThongBao.find(params).populate([
            {
                path:'idFile'
            },
            {
                path:'idLoaiThongBao'
            },
            {
                path: 'idMucDoThongBao'
            },
            {
                path:'feedback.idComment'
            },
            {
                path:'idSender'
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
                path:'idLoaiThongBao'
            },
            {
                path: 'idMucDoThongBao'
            },
            {
                path:'feedback.idComment',
                select: '_id tenSinhVien tokenFirebase'
            },
            {
                path:'idSender'
            },
            {
                path:'idReceiver'
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
    },
    getThongBao: function (id, callback) {
        ThongBao.findById(id).populate([
            {
                path:'idFile'
            },
            {
                path:'idLoaiThongBao'
            },
            {
                path: 'idMucDoThongBao'
            },
            {
                path:'feedback.idComment',
                select: '_id tenSinhVien tokenFirebase'
            },
            {
                path:'idSender'
            }
        ]).exec(function (err, thongbao) {

            if (err){
                callback(err,null);
                return;
            }
            callback(null,thongbao);
        })
    }
}