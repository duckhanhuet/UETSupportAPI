var User = require('../models/User')
var MucDoThongBaoController = require('../controllers/MucDoThongBaoController')

module.exports ={
    create: function createmucdothongbao(sheet_name_list_muc_do_thong_bao,workbookMucDoThongBao,XLSX) {
        sheet_name_list_muc_do_thong_bao.forEach(function (y) {
            var worksheet = workbookMucDoThongBao.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            console.log(result);
            for (var i=0;i<result.length;i++){
                var mucdothongbao= result[i];
                var info={
                    _id: Number(mucdothongbao._id),
                    tenMucDoThongBao: mucdothongbao.tenMucDoThongBao
                }
                MucDoThongBaoController.create(info,function (err, info) {
                    if (err){
                    }
                })
            }
        })
    }
}
