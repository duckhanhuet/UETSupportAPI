var SinhVien = require('../models/SinhVien');

module.exports =  {
    find: function (params, callback) {
        SinhVien.find(params,function (err, sinhviens) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,sinhviens);
        })
    },

    findById: function (id, callback) {
        SinhVien.findById(id,function (err, sinhvien) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,sinhvien);
        })
    },

    create: function (params, callback) {
        SinhVien.create(params,function (err, sinhvien) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,sinhvien);
        })
    },
    update: function (id, params, callback) {
        SinhVien.findByIdAndUpdate(id,params,{new: true},function (err, sinhvien) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,sinhvien);
        })
    },
    delete: function (id, callback) {
        SinhVien.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}