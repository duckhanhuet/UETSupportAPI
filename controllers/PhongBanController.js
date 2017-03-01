var PhongBan= require('../models/PhongBan');

module.exports =  {
    find: function (params, callback) {
        PhongBan.find(params).populate('idThongBao').exec(function (err, phongbans) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,phongbans);
        })
        // PhongBan.find(params,function (err, phongbans) {
        //
        // })
    },

    findById: function (id, callback) {
        PhongBan.findById(id).populate('idThongBao').exec(function (err, phongban) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,phongban);
        })
    },

    create: function (params, callback) {
        PhongBan.create(params,function (err, phongban) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,phongban);
        })
    },
    update: function (id, params, callback) {
        PhongBan.findByIdAndUpdate(id,params,{new: true},function (err, phongban) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,phongban);
        })
    },
    delete: function (id, callback) {
        PhongBan.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}