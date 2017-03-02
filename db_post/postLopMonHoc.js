var User = require('../models/User')
var LopMonHocController = require('../controllers/LopMonHocController')

module.exports ={
    create: function createlopmonhoc(sheet_name_list_lop_mon_hoc,workbookLopMonHoc,XLSX) {
        sheet_name_list_lop_mon_hoc.forEach(function (y) {
            var worksheet = workbookLopMonHoc.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            console.log(result);

            for (var i = 0; i < result.length; i++) {
                var lopmonhoc = result[i];
                //======================
                //create info Lop mon hoc
                var info = {
                    _id: lopmonhoc._id,
                    tenLopMonHoc: lopmonhoc.tenLopMonHoc,
                    idGiangVien: lopmonhoc.idGiangVien
                };
                //======================
                //save info Lop Mn hoc
                LopMonHocController.create(info, function (err, info) {
                    if (err) {
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
    }
}
