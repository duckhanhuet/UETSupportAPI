var express = require('express');
// kind=1: gui Thong Bao
//kind=2: gui Diem Thi
//kind=3: gui TIn Tuc

//hasfile=0: khong co file; //hasfile=1: co file
module.exports = {
    createData: function (tieuDe, noiDung,urlFile,mucDoThongBao,idloaiThongBaos,kind,hasfile,idSender,nameSender) {
         var data={
            tieuDe: tieuDe,
            noiDung: noiDung,
            link: urlFile,
            idMucDoThongBao: mucDoThongBao,
            idLoaiThongBao: idloaiThongBaos,
            kind: kind,
            hasfile: hasfile,
            idSender: idSender,
            nameSender: nameSender
        }
        return data;
    },
}