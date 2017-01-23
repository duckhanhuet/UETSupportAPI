var express = require('express');
var router = express.Router();
var SinhVienController = require('../controllers/SinhVienController');
var auth           = require('../policies/auth');
//==========================================
var gcm = require('node-gcm');
//==========================================
//get infomation of all sinhvien
router.get('/',auth.reqIsAuthenticate,function (req, res, next) {
    SinhVienController.find({},function (err, sinhviens) {
        if (err){
            res.json({
                success: false,
                message: 'not found sinhvien'
            })
        }
        res.json(sinhviens);
    })
});
//====================================================
//get information of giang vien with sinhvien id
router.get('/information/:id',auth.reqIsAuthenticate,function (req,res,next) {
    SinhVienController.findById(req.params.id,function (err, sinhvien) {
        if (err){
            res.json({
                success:err,
                message:'not found file with id '+req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata:sinhvien
            });
        }
    })
});

//========================================================
//getting profile of sinhvien
router.get('/profile', auth.reqIsAuthenticate,auth.reqIsSinhVien,function (req, res) {
    var id = req.user._id;
    SinhVienController.findById(id, function (err, result) {
        if (err) {
            res.json({
                success: false,
                message: 'cant found sinh vien'
            })
        } else {
            res.json({
                success: true,
                profile: result,
                user: req.user
            })
        }
    });
})
//=============================================================
//sinhvien post tokenfirebase
router.post('/guiTokenfirebase',auth.reqIsAuthenticate,auth.reqIsSinhVien,function (req, res, next) {
    var tokenFirebase = req.body.tokenFirebase;
    if (!tokenFirebase){
        res.json({
            success: false,
            message: 'Invalid token firebase'
        })
    } else {
        SinhVienController.update(req.user._id,{tokenFirebase:tokenFirebase},function (err, result) {
            if (err){
                res.json({
                    success: false,
                    message:'cannot insert token firebase to database'
                })
            }else {
                res.json({
                    success: true,
                    message:'ok'
                })
            }
        })
    }
});
//===========================================================
//Sinh vien dang ki cac loai thong bao muon nhan
router.post('/guiLoaiThongBao',auth.reqIsAuthenticate,auth.reqIsSinhVien,function (req, res, next) {
    //android gui option cac lua chon nhan thong bao
    var array=[];

    var DiemThi= req.body.thongBaoDiem;
    var LichThi    = req.body.thongBaoLichThi;
    var DangKiTinChi= req.body.thongBaoDangKiTinChi;
    var LichHoc= req.body.thongBaoLichHoc;
    var ThongBaoKhac  = req.body.thongBaoKhac;
    if(!DiemThi&&!LichThi&&!DangKiTinChi&&!LichHoc&&!ThongBaoKhac){
        res.json({
            success: false,
            message:'Invalid option,please choose option you want to recept Notification'
        })
    } else {
        if (DiemThi){
            array.push(DiemThi);
        }
        if (LichHoc){
            array.push(LichHoc);
        }
        if (DangKiTinChi){
            array.push(DangKiTinChi);
        }
        if (LichThi){
            array.push(LichThi);
        }
        if (ThongBaoKhac){
            array.push(ThongBaoKhac);
        }
        SinhVienController.update(req.user._id,{nhanLoaiThongBao:array},function (err, response) {
            if (err){
                res.json({
                    success: false,
                    message:'Register type of Notification fail'
                })
            } else {
                res.json({
                    success: true,
                    response: response
                })
            }
        })
    }
})

module.exports = router;