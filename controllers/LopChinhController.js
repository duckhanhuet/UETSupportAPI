var LopChinh= require('../models/LopChinh');


module.exports =  {
    find: function (params, callback) {
        LopChinh.find(params,function (err, lopchinhs) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,lopchinhs);
        })
    },

    findById: function (id, callback) {
        LopChinh.findById(id,function (err, lopchinh) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,lopchinh);
        })
    },

    create: function (params, callback) {
        LopChinh.create(params,function (err, lopchinh) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,lopchinh);
        })
    },
    update: function (id, params, callback) {
        LopChinh.findByIdAndUpdate(id,params,{new: true},function (err, lopchinh) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,lopchinh);
        })
    },
    delete: function (id, callback) {
        LopChinh.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}