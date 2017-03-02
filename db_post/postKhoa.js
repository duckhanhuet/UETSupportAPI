var User = require('../models/User')
var KhoaController = require('../controllers/KhoaController')

module.exports ={
    create: function createkhoa(sheet_name_list_khoa,workbookKhoa,XLSX) {
        sheet_name_list_khoa.forEach(function (y) {
            var worksheet = workbookKhoa.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            console.log(result);

            for (var i = 0; i < result.length; i++) {
                var khoa = result[i];
                //=====================
                //create users
                var user = new User({
                    _id: khoa._id,
                    password: khoa.password,
                    role: 'Khoa'
                })
                //=====================
                //save user
                user.save(function (err) {
                    if (err) {
                        //console.log('Users Khoa existed');
                    }
                })

                //======================
                //create info khoa
                var info = {
                    _id: khoa._id,
                    tenKhoa: khoa.tenKhoa
                }
                //======================
                //save info khoa
                KhoaController.create(info, function (err, info) {
                    if (err) {
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
    }
}
