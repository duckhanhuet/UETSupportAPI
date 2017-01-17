var DiemMonHoc = require('../models/DiemMonHoc');

module.exports =  {
    find: function (params, callback) {
        DiemMonHoc.find(params,function (err, diemmonhocs) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,diemmonhocs);
        })
    },

    findById: function (id, callback) {
        DiemMonHoc.findById(id,function (err, diemmonhoc) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,diemmonhoc);
        })
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