module.exports = {
    checkLoaiThongBaoDiem: function (sinhvien) {
        //
        if (sinhvien.idLoaiThongBao==null||sinhvien.idLoaiThongBao.indexOf(0)>-1||sinhvien.idLoaiThongBao.
            indexOf(1)>-1){
            return true;
        } else {
            return false;
        }
    },
    checkLoaiThongBaoTatCa: function (sinhvien) {
        if (sinhvien.idLoaiThongBao.indexOf(0)>-1||sinhvien.idLoaiThongBao==null){
            return true;
        }else {
            return false;
        }
    },
    checkLoaiThongBaoLichThi: function (sinhvien) {
        if (sinhvien.idLoaiThongBao==null||sinhvien.idLoaiThongBao.indexOf(2)>-1){
            return true;
        }else {
            return false;
        }
    },
    checkLoaiThongBaoLichHoc: function (sinhvien) {
        if (sinhvien.idLoaiThongBao==null||sinhvien.idLoaiThongBao.indexOf(3)>-1){
            return true;
        } else {
            return false;
        }
    },
    checkLoaiThongBaoDangKiTinChi: function (sinhvien) {
        if (sinhvien.idLoaiThongBao==null||sinhvien.idLoaiThongBao.indexOf(4)>-1){
            return true;
        } else {
            return false;
        }
    }
}