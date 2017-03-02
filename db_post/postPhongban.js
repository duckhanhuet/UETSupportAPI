var User= require('../models/User')
var PhongBanController = require('../controllers/PhongBanController')


module.exports =     {
    create : function creatpb(sheet_name_list_phong_ban,workbookPhongBan,XLSX) {
        sheet_name_list_phong_ban.forEach(function (y) {

            var worksheet = workbookPhongBan.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            for (var i = 0; i < result.length; i++) {
                var phongban = result[i];
                console.log(phongban);
                //=====================
                //create users
                var user = new User({
                    _id: phongban._id,
                    password: phongban.password,
                    role: 'PhongBan'
                })
                //=====================
                //save user
                user.save(function (err) {
                    if (err) {
                        //console.log('Users PhongBan existed');
                    }
                })

                //======================
                //create info PhongBan
                var info = {
                    _id: phongban._id,
                    tenPhongBan: phongban.tenPhongBan
                };
                //======================
                //save info PB
                PhongBanController.create(info, function (err, info) {
                    if (err) {
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
    }
}