var SubscribeController = require('../controllers/SubscribeController')


module.exports ={
    getListSv : function getListSv(idLoaiThongBao,category,idReceiver,result) {
        var listSubs =[];
        var data;
        SubscribeController.find({idLoaiThongBao:{$in:[Number(idLoaiThongBao)]}},function (err,subscribes) {
                if (err){
                    return false;
                }else{
                    if (category=='SinhVien'){
                        var object ={
                            thongbao: result,
                            subscribes: subscribes
                        }
                        return object;
                    }
                    if (category=='Khoa'){
                        console.log('la khoa')
                        subscribes.forEach(function (subscribe) {
                            if (subscribe._id.idLopChinh.idKhoa._id=='cntt'){
                                listSubs.push(subscribe);
                            }
                        })
                        var object ={
                            thongbao: result,
                            subscribes: listSubs
                        }
                        console.log('===========================')
                        console.log('Object duoc render la:');
                        console.log(object);
                        console.log('===========================')
                        var data={
                            duckhanh:'abcd'
                        }
                        return data;
                    }
                    if (category=='LopChinh'){
                        subscribes.forEach(function (subscribe) {
                            if (subscribe._id.idLopChinh._id== idReceiver){
                                listSubs.push(subscribe)
                            }
                        })
                        var object ={
                            thongbao: result,
                            subscribes: listSubs
                        }
                        return object;
                    }
                    if (category=='LopMonHoc'){
                        subscribes.forEach(function (subscribe) {
                            if (subscribe._id.idLopMonHoc._id.indexOf(idReceiver)>-1){
                                listSubs.push(subscribe)
                            }
                        })
                        var object ={
                            thongbao: result,
                            subscribes: listSubs
                        }
                        return object;
                    }
                }
            })
        },

        create: function (a, b) {
            console.log('aaaaaaaaaaaaa')
            var data={
                duckhanh: a
            }
            return data
        }
}