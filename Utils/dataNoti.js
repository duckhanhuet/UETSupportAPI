var express = require('express');
// kind=1: gui Thong Bao
//kind=2: gui Diem Thi
//kind=3: gui TIn Tuc
module.exports = {
    createData: function (tieuDe, noiDung, tenFile, linkFile, mucDoThongBao,idloaiThongBaos) {
         var data={

            tieuDe: tieuDe,
            noiDung: noiDung,
            tenFile: tenFile,
            linkFile: linkFile,
            mucDoThongBao: mucDoThongBao,
            idLoaiThongBao: idloaiThongBaos,
            kind:0
        }
        return data;
    },
    createDataDiem: function (MSV,tenLopMonHoc,tenKiHoc,tenGiangVien,monHoc,diemThanhPhan,diemCuoiKi,tongDiem) {
        var data= {
            tieuDe:'da co diem mon hoc '+monHoc,
            MSV: MSV,
            tenLopMonHoc: tenLopMonHoc,
            tenKiHoc: tenKiHoc,
            tenGiangVien: tenGiangVien,
            monHoc: monHoc,
            diemThanhPhan: diemThanhPhan,
            diemCuoiKi: diemCuoiKi,
            tongDiem: tongDiem,
            kind:2
        }
        return data;
    }
}