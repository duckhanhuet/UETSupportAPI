var TinTuc= require('../models/TinTuc');

module.exports = {
    findOne : function (id,callback) {
        TinTuc.find({_id : id},function (err,tintuc) {
            if (err){
                callback(err,null)
                return;
            }

            callback(null,tintuc)
        })
    },
    //default limit = 10
    findAndLimit : function (param,offset,callback) {
        TinTuc.find(param).limit(10).skip(offset).exec(callback);
    },
    findDetailTinTuc : function (param,callback) {
        TinTuc
            .find(param)
            .limit(10).populate('loaiTinTuc').exec(callback)
    },
    create: function (params, callback) {
        TinTuc.create(params,function (err, thongbao) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,thongbao);
        })
    },
}