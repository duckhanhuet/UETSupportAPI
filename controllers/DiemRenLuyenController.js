var DiemRenLuyen = require('../models/DiemRenLuyen');

module.exports =  {
    find: function (params, callback) {
        DiemRenLuyen.find(params).populate([
            {
                path:'idKi'
            },
            {
                path:'idSinhVien'
            }
        ]).exec(function (err, diemrenluyens) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,diemrenluyens);
        })
    },

    findById: function (id, callback) {
        DiemRenLuyen.findById(id).populate([
            {
                path:'idKi'
            },
            {
                path:'idSinhVien'
            }
        ]).exec(function (err, diemrenluyen) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,diemrenluyen);
        })
    },

    create: function (params, callback) {
        DiemRenLuyen.create(params,function (err, diemrenluyen) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,diemrenluyen);
        })
    },
    update: function (id, params, callback) {
        DiemRenLuyen.findByIdAndUpdate(id,params,{new: true},function (err, diemrenluyen) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,diemrenluyen);
        })
    },
    delete: function (id, callback) {
        DiemRenLuyen.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}