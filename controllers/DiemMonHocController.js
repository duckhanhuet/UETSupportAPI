var DiemMonHoc = require('../models/DiemMonHoc');

module.exports =  {
    //========================================

    find: function (params, callback) {
        DiemMonHoc.find(params).populate([
            {
                path:'idSinhVien',
                populate:{
                    path:'idLopChinh',
                    populate:{
                        path:'idKhoa'
                    }
                }
            },
            {
                path:'idLopMonHoc'
            }
        ]).exec(function (err, diemmonhocs) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,diemmonhocs)
        })
    },
    findAllByIdLopMonHoc: function (params, callback) {
        DiemMonHoc.find(params).populate([
            {
                path: 'idSinhVien',
                populate: {
                    path: 'idLopChinh',
                    populate: {
                        path: 'idKhoa'
                    }
                },
                select: '_id tenSinhVien idLopChinh'
            },
            {
                path: 'idLopMonHoc',
                populate: {
                    path: 'idGiangVien'
                }
            },
            {
                path: 'idKiHoc'
            }
        ]).exec(function (err, diemmonhocs) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, diemmonhocs)
        })
    },
    //====================================================


    findById: function (id, callback) {
        DiemMonHoc.findById(id).populate([
            {
                path:'idSinhVien',
                populate:{
                    path:'idLopChinh',
                    populate:{
                        path:'idKhoa'
                    }
                }
            },
            {
                path:'idLopMonHoc'
            }
        ]).exec(function (err, diemmonhoc) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,diemmonhoc)
        })
        // DiemMonHoc.findById(id,function (err, diemmonhoc) {
        //     if (err){
        //         callback(err,null);
        //         return;
        //     }
        //     callback(null,diemmonhoc);
        // })
    },

    create: function (params, callback) {
        DiemMonHoc.create(params,function (err, diemmonhoc) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,diemmonhoc);
        })
    },
    update: function (id, params, callback) {
        DiemMonHoc.findByIdAndUpdate(id,params,{new: true},function (err, diemmonhoc) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,diemmonhoc);
        })
    },
    delete: function (id, callback) {
        DiemMonHoc.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}