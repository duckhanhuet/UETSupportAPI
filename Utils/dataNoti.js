var express = require('express');
// kind=1: gui Thong Bao
//kind=2: gui Diem Thi
//kind=3: gui TIn Tuc
module.exports = {
    createData: function (tieuDe, noiDung,urlFile,mucDoThongBao,idloaiThongBaos) {
         var data={
            tieuDe: tieuDe,
            noiDung: noiDung,
            urlFile: urlFile,
            mucDoThongBao: mucDoThongBao,
            idLoaiThongBao: idloaiThongBaos,
             kind: 1
        }
        return data;
    },
    createDataDiem: function (monHoc,tenkihoc,urlDiem) {
        var data= {
            tieuDe:'da co diem mon hoc '+monHoc,
            tenKiHoc: tenkihoc,
            urlDiem: urlDiem,
            kind: 2
        }
        return data;
    }
}