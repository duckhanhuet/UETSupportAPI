module.exports = {
    checkLoaiThongBaoDiem: function (subscribe) {
        //Diem thi co id loai thong bao la 1
        var idLoaiThongBaos= subscribe.idLoaiThongBao;
        var arrayidtb =[];
        idLoaiThongBaos.forEach(function (idloaithongbao) {
            arrayidtb.push(idloaithongbao._id)
        });
        if (idLoaiThongBaos.indexOf(1)>-1){
            return true;
        }else {
            return false;
        }
    },
    //id loai thong bao cho tat ca la 0
    checkLoaiThongBaoTatCa: function (subscribe) {
        //Diem thi co id loai thong bao la 1
        var idLoaiThongBaos= subscribe.idLoaiThongBao;
        var arrayidtb =[];
        idLoaiThongBaos.forEach(function (idloaithongbao) {
            arrayidtb.push(idloaithongbao._id)
        });
        if (idLoaiThongBaos.indexOf(0)>-1){
            return true;
        }else {
            return false;
        }
    },
    //id loai thong bao cua lich thi la 2
    checkLoaiThongBaoLichThi: function (subscribe) {
        //Diem thi co id loai thong bao la 1
        var idLoaiThongBaos= subscribe.idLoaiThongBao;
        var arrayidtb =[];
        idLoaiThongBaos.forEach(function (idloaithongbao) {
            arrayidtb.push(idloaithongbao._id)
        });
        if (idLoaiThongBaos.indexOf(2)>-1){
            return true;
        }else {
            return false;
        }
    },
    //id loai thogn bao lich hoc la 3
    checkLoaiThongBaoLichHoc: function (subscribe) {
        //Diem thi co id loai thong bao la 1
        var idLoaiThongBaos= subscribe.idLoaiThongBao;
        var arrayidtb =[];
        idLoaiThongBaos.forEach(function (idloaithongbao) {
            arrayidtb.push(idloaithongbao._id)
        });
        if (idLoaiThongBaos.indexOf(3)>-1){
            return true;
        }else {
            return false;
        }
    },
    //id loai thong bao dang ky tin chi la 4
    checkLoaiThongBaoDangKiTinChi: function (subscribe) {
        //Diem thi co id loai thong bao la 1
        var idLoaiThongBaos= subscribe.idLoaiThongBao;
        var arrayidtb =[];
        idLoaiThongBaos.forEach(function (idloaithongbao) {
            arrayidtb.push(idloaithongbao._id)
        });
        if (idLoaiThongBaos.indexOf(4)>-1){
            return true;
        }else {
            return false;
        }
    }
}