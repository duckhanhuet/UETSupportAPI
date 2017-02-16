var TinTuc= require('../models/TinTuc');
// {
//     $or: [
//         {
//             $and:[
//                 {loaiTinTuc : 0},
//                 {$limit : 10}
//             ]
//         },
//         {
//             $and:[
//                 {loaiTinTuc : 1},
//                 {$limit : 10}
//             ]
//         }
//     ]
// }
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
        TinTuc
            .find(param)
            .sort({"postAt": -1})
            .limit(10)
            .skip(offset)
            .populate('loaiTinTuc')
            .exec(callback);
    },
    find : function (param,callback) {
        TinTuc.find(param).exec(callback)
    },
    findDetailTinTuc : function (param,callback) {
        TinTuc
            .find(param)
            .limit(10)
            .sort({"postAt": -1})
            .populate('loaiTinTuc')
            .exec(callback)
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