module.exports = {
    checkLoaiThongBaoDiem: function (sinhvien) {
        if (sinhvien.nhanLoaiThongBao==null||sinhvien.nhanLoaiThongBao.indexOf('TatCa')>-1||sinhvien.nhanLoaiThongBao.
            indexOf('DiemThi')>-1){
            return true;
        } else {
            return false;
        }
    },
    checkLoaiThongBaoTatCa: function (sinhvien) {
        if (sinhvien.nhanLoaiThongBao.indexOf('TatCa')>-1||sinhvien.nhanLoaiThongBao==null){
            return true;
        }else {
            return false;
        }
    },
    checkLoaiThongBaoLichThi: function (sinhvien) {
        if (sinhvien.nhanLoaiThongBao==null||sinhvien.nhanLoaiThongBao.indexOf('LichThi')>-1){
            return true;
        }else {
            return false;
        }
    },
    checkLoaiThongBaoLichHoc: function (sinhvien) {
        if (sinhvien.nhanLoaiThongBao==null||sinhvien.nhanLoaiThongBao.indexOf('LichHoc')>-1){
            return true;
        } else {
            return false;
        }
    },
    checkLoaiThongBaoDangKiTinChi: function (sinhvien) {
        if (sinhvien.nhanLoaiThongBao==null||sinhvien.nhanLoaiThongBao.indexOf('DangKiTinChi')>-1){
            return true;
        } else {
            return false;
        }
    }
}