module.exports = {
    checkLoaiThongBaoDiem: function (sinhvien) {
        //Diem thi co id loai thong bao la 1
        if (sinhvien.idLoaiThongBao==null||sinhvien.idLoaiThongBao.indexOf(0)>-1||sinhvien.idLoaiThongBao.
            indexOf(1)>-1){
            return true;
        } else {
            return false;
        }
    },
    //id loai thong bao cho tat ca la 0
    checkLoaiThongBaoTatCa: function (sinhvien) {
        if (sinhvien.idLoaiThongBao.indexOf(0)>-1||sinhvien.idLoaiThongBao==null){
            return true;
        }else {
            return false;
        }
    },
    //id loai thong bao cua lich thi la 2
    checkLoaiThongBaoLichThi: function (sinhvien) {
        if (sinhvien.idLoaiThongBao==null||sinhvien.idLoaiThongBao.indexOf(2)>-1){
            return true;
        }else {
            return false;
        }
    },
    //id loai thogn bao lich hoc la 3
    checkLoaiThongBaoLichHoc: function (sinhvien) {
        if (sinhvien.idLoaiThongBao==null||sinhvien.idLoaiThongBao.indexOf(3)>-1){
            return true;
        } else {
            return false;
        }
    },
    //id loai thong bao dang ky tin chi la 4
    checkLoaiThongBaoDangKiTinChi: function (sinhvien) {
        if (sinhvien.idLoaiThongBao==null||sinhvien.idLoaiThongBao.indexOf(4)>-1){
            return true;
        } else {
            return false;
        }
    }
}