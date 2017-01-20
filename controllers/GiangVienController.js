var GiangVien = require('../models/GiangVien');

module.exports =  {
    find: function (params, callback) {
        GiangVien.find(params,function (err, giangviens) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,giangviens);
        })
    },

    findById: function (id, callback) {
        GiangVien.findById(id,function (err, giangvien) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,giangvien);
        })
    },

    create: function (params, callback) {
        // var lopmonhocs = params['idLopMonHoc'];
        // var lopmonhoc  = lopmonhocs.split(',');
        // var newLops    = [];
        // lopmonho.forEach(function (lophoc) {
        //     newLops.push(lophoc);
        // });
        // params['idLopMonHoc']= newLops;
        GiangVien.create(params,function (err, giangvien) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,giangvien);
        })
    },
    update: function (id, params, callback) {
        GiangVien.findByIdAndUpdate(id,params,{new: true},function (err, giangvien) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,giangvien);
        })
    },
    delete: function (id, callback) {
        GiangVien.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}