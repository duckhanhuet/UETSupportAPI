var User = require('../models/User')
var KiHocController = require('../controllers/KiHocController')

module.exports ={
    create: function createkhoa(sheet_name_list_ki_hoc,workbookKiHoc,XLSX) {
        sheet_name_list_ki_hoc.forEach(function (y) {
            var worksheet = workbookKiHoc.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            //console.log(result);

            for (var i = 0; i < result.length; i++) {
                var kihoc = result[i];
                console.log(kihoc);
                //=====================
                //=====================
                //create info Ki hoc
                var info = {
                    _id: kihoc._id,
                    tenKiHoc: kihoc.tenKiHoc
                };
                //======================
                //save info PB
                KiHocController.create(info, function (err, info) {
                    if (err) {
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
    }
}
