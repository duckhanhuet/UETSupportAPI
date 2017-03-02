var User = require('../models/User')
var LoaiThongBaoController = require('../controllers/LoaiThongBaoController')

module.exports ={
    create: function createloaitbao(sheet_name_list_loai_thong_bao,workbookLoaiThongBao,XLSX) {
        sheet_name_list_loai_thong_bao.forEach(function (y) {
            var worksheet = workbookLoaiThongBao.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            console.log(result);
            for (var i=0;i<result.length;i++){
                var loaithongbao= result[i];
                var info={
                    _id: Number(loaithongbao._id),
                    tenLoaiThongBao: loaithongbao.tenLoaiThongBao
                }
                //console.log('ten loai thong bao:'+typeof info._id+'va '+ typeof info.tenLoaiThongBao)
                LoaiThongBaoController.create(info,function (err, info) {
                    if (err){
                        console.log('khong create dk loai thong bao')
                    }
                    //console.log('ten loai thong bao:'+info._id)
                })
            }
        })
    }
}
