var User = require('../models/User')
var LopChinhController = require('../controllers/LopChinhController')

module.exports ={
    create: function createlopchinhquy(sheet_name_list_lop_chinh_quy,workbookLopChinhQuy,XLSX) {
        sheet_name_list_lop_chinh_quy.forEach(function (y) {
            var worksheet = workbookLopChinhQuy.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            //console.log(result);

            for (var i = 0; i < result.length; i++) {
                var lopchinhquy = result[i];
                console.log(lopchinhquy);
                //=====================
                //======================
                //create info Lop chinh quy
                var info = {
                    _id: lopchinhquy._id,
                    tenLopChinh: lopchinhquy.tenLopChinh,
                    idKhoa: lopchinhquy.idKhoa

                };
                //======================
                //save info PB
                LopChinhController.create(info, function (err, info) {
                    if (err) {
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
    }
}
