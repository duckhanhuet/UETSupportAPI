var User = require('../models/User')
var SinhVienController = require('../controllers/SinhVienController')
var SubscribeController = require('../controllers/SubscribeController')

module.exports ={
    create: function createmucdothongbao(sheet_name_list_sinh_vien,workbookSinhVien,XLSX) {
        sheet_name_list_sinh_vien.forEach(function (y) {
            var worksheet = workbookSinhVien.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            console.log(result);

            for (var i = 0; i < result.length; i++) {
                var sinhvien = result[i];
                //=====================
                //create users
                var user = new User({
                    _id: sinhvien._id,
                    password: sinhvien.password,
                })
                // UserController.create(user,function (err,user) {
                //     if (err){
                //
                //     }
                //     console.log(user);
                // })
                //=====================
                //save user
                user.save(function (err) {
                    if (err) {
                        //console.log('Users PhongBan existed');
                    }
                })
                //======================
                //create info sinhvien
                var info = {
                    _id: sinhvien._id,
                    tenSinhVien: sinhvien.tenSinhVien,
                    idLopChinh: sinhvien.idLopChinh,
                    idLopMonHoc: sinhvien.idLopMonHoc,
                    tokenFirebase: sinhvien.tokenFirebase
                };
                var infoSubscribe={
                    _id: sinhvien._id,
                }
                //======================
                //save info PB
                SinhVienController.create(info, function (err, info) {
                    if (err) {
                        //console.log('exist id');
                    }
                    //console.log(info);
                });
                SubscribeController.create(infoSubscribe,function (err, info) {
                    if (err){
                    }
                })
            }
        })
    }
}
