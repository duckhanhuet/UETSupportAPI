var express = require('express');
// kind=1: gui Thong Bao
//kind=2: gui Diem Thi
//kind=3: gui TIn Tuc
module.exports = {
    createData: function (tieuDe, noiDung,urlFile,mucDoThongBao,idloaiThongBaos,kind) {
         var data={
            tieuDe: tieuDe,
            noiDung: noiDung,
            link: urlFile,
            idMucDoThongBao: mucDoThongBao,
            idLoaiThongBao: idloaiThongBaos,
            kind: kind
        }
        return data;
    },
    // createDataDiem: function (monHoc,tenkihoc,urlDiem) {
    //     var data= {
    //         tieuDe:'da co diem mon hoc '+monHoc,
    //         tenKiHoc: tenkihoc,
    //         link: urlDiem,
    //         kind: 2
    //     }
    //     return data;
    // }
}