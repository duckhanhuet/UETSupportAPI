var SinhVien = require('../models/SinhVien');

module.exports =  {
    find: function (params, callback) {
        SinhVien.find(params).populate([
            {
                path:'idLopChinh',
                populate:{
                    path:'idKhoa'
                }
            },
            {
                path:'idLopMonHoc',
                populate:{
                    path:'idGiangVien'
                }
            }
        ]).exec(function (err, sinhviens) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,sinhviens)
        })
    },

    findById: function (id, callback) {
        SinhVien.findById(id).populate([
            {
                path:'idLopChinh',
                populate:{
                    path:'idKhoa'
                }
            },
            {
                path:'idLopMonHoc',
                populate:{
                    path:'idGiangVien'
                }
            }
        ]).exec(function (err, sinhvien) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,sinhvien)
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