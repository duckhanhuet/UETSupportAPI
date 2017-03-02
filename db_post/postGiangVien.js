var User = require('../models/User')
var GiangVienController = require('../controllers/GiangVienController')

module.exports ={
    create: function creategvien(sheet_name_list_giang_vien,workbookGiangVien,XLSX) {
        sheet_name_list_giang_vien.forEach(function (y) {
            var worksheet = workbookGiangVien.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            console.log(result);

            for (var i = 0; i < result.length; i++) {
                var giangvien = result[i];

                //=====================
                //create users
                var user = new User({
                    _id: giangvien._id,
                    password: giangvien.password,
                    role: 'GiangVien'
                })
                //=====================
                //save user
                user.save(function (err) {
                    if (err) {
                        //console.log('Users PhongBan existed');
                    }
                })

                //======================
                //create info giangvien
                var info = {
                    _id: giangvien._id,
                    tenGiangVien: giangvien.tenGiangVien,
                    idKhoa: giangvien.idKhoa,
                    idKhoa: giangvien.idKhoa,
                };
                //======================
                //save info PB
                GiangVienController.create(info, function (err, info) {
                    if (err) {
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
    }
}
