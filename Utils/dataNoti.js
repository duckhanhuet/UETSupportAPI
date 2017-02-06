var express = require('express');

module.exports = {
    createData: function (tieuDe, noiDung, tenFile, linkFile, mucDoThongBao,loaiThongBao) {
         var data={

            tieuDe: tieuDe,
            noiDung: noiDung,
            tenFile: tenFile,
            linkFile: linkFile,
            mucDoThongBao: mucDoThongBao,
            loaiThongBao: loaiThongBao,
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
            kind: 'DiemThi'
        }
        return data;
    }
}