var express = require('express');
var router = express.Router();
var SinhVien= require('../models/SinhVien');
var User    = require('../models/User');
var LopChinh= require('../models/LopChinh');
var LopMonHoc = require('../models/LopMonHoc');
var SinhVienController = require('../controllers/SinhVienController');
var SubscribeController = require('../controllers/SubscribeController');
var DiemMonHocController = require('../controllers/DiemMonHocController');
var GiangVienController = require('../controllers/GiangVienController');
var DiemMonHoc           = require('../models/DiemMonHoc');
var DiemRenLuyenController = require('../controllers/DiemRenLuyenController');
var LopMonHocController = require('../controllers/LopMonHocController');
var auth = require('../policies/auth');
var async= require('async');
//==========================================
var gcm = require('node-gcm');
//==========================================
//get infomation of all sinhvien
router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    SinhVienController.find({}, function (err, sinhviens) {
        if (err) {
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
router.get('/information/:id', auth.reqIsAuthenticate, function (req, res, next) {
    SinhVien.findOne({_id:req.params.id}).populate([{
        path:'idLopChinh',
        populate:{
            path:'idKhoa'
        }},{
            path:'idLopMonHoc',
            populate:{
                path:'idGiangVien'
            }
        }
        ]).exec(function (err, giangvien) {
        if (err){
            res.json({
                success:false
            })
        }
        res.json({
            success:true,
            metadata:giangvien
        })
    })
    // SinhVienController.findById(req.params.id, function (err, sinhvien) {
    //     if (err) {
    //         res.json({
    //             success: err,
    //             message: 'not found file with id ' + req.params.id
    //         })
    //     }
    //     else {
    //         res.json({
    //             success: true,
    //             metadata: sinhvien
    //         });
    //     }
    // })
});

//========================================================
//getting profile of sinhvien
router.get('/profile', auth.reqIsAuthenticate, auth.reqIsSinhVien, function (req, res) {
    var id = req.user._id;
    SinhVien.findOne({_id:id}).populate('idLopChinh').populate('idLopMonHoc').exec(function (err, sv) {
        if (err){
            res.json({
                success: false
            })
        }
        LopChinh.findOne({_id:sv.idLopChinh}).populate('idKhoa').exec(function (err, lopchinh) {
            if (err){
                res.json({
                    success:false
                })
            }
            res.json({
                success:true,
                user: req.user,
                profile: sv,
                lopChinh: lopchinh
            })
        })
    })
})
//=============================================================
//sinhvien post tokenfirebase
router.post('/guitokenfirebase', auth.reqIsAuthenticate, auth.reqIsSinhVien, function (req, res, next) {
    var tokenFirebase = req.body.tokenFirebase;
    if (!tokenFirebase) {
        res.json({
            success: false,
            message: 'Invalid token firebase'
        })
    } else {
        SinhVienController.update(req.user._id, {tokenFirebase: tokenFirebase}, function (err, result) {
            if (err) {
                res.json({
                    success: false,
                    message: 'cannot insert token firebase to database'
                })
            } else {
                res.json({
                    success: true,
                    message: 'ok'
                })
            }
        })
    }
});
//===========================================================
//Sinh vien dang ki cac loai thong bao muon nhan
router.post('/guiloaithongbao', auth.reqIsAuthenticate, auth.reqIsSinhVien, function (req, res, next) {
    //android gui option cac lua chon nhan thong bao

    //phia android gui 1 mang cac id loai thong bao
    var arrayObject= req.body;
    var info={
        _id: req.user._id,
        idLoaiThongBao: arrayObject
    }
    if (arrayObject==null){
        res.json({
            success: false,
            message:'Ban chua yeu cau loai thong bao!! try again.'
        })
    } else {
        SubscribeController.create(info,function (err, result) {
            if (err){
                SubscribeController.update(req.user._id,{idLoaiThongBao: info.idLoaiThongBao},function (err, result) {
                    if (err){
                        res.json({
                            success: false,
                            message:'Error'
                        })
                    }else {
                        res.json({
                            success: true,
                            response: result
                        })
                    }
                })
            }else {
                res.json({
                    success:true,
                    message:'thanh cong'
                })
            }
        })
    }

    // var array = [];
    //
    // var DiemThi = req.body.thongBaoDiem;
    // var LichThi = req.body.thongBaoLichThi;
    // var DangKiTinChi = req.body.thongBaoDangKiTinChi;
    // var LichHoc = req.body.thongBaoLichHoc;
    // var ThongBaoKhac = req.body.thongBaoKhac;
    // if (!DiemThi && !LichThi && !DangKiTinChi && !LichHoc && !ThongBaoKhac) {
    //     res.json({
    //         success: false,
    //         message: 'Invalid option,please choose option you want to recept Notification'
    //     })
    // } else {
    //     if (DiemThi) {
    //         array.push(DiemThi);
    //     }
    //     if (LichHoc) {
    //         array.push(LichHoc);
    //     }
    //     if (DangKiTinChi) {
    //         array.push(DangKiTinChi);
    //     }
    //     if (LichThi) {
    //         array.push(LichThi);
    //     }
    //     if (ThongBaoKhac) {
    //         array.push(ThongBaoKhac);
    //     }
    //     SinhVienController.update(req.user._id, {nhanLoaiThongBao: array}, function (err, response) {
    //         if (err) {
    //             res.json({
    //                 success: false,
    //                 message: 'Register type of Notification fail'
    //             })
    //         } else {
    //             res.json({
    //                 success: true,
    //                 response: response
    //             })
    //         }
    //     })
    //}
});

// SinhVien.findOne({_id:'14020234'}).populate('_id').exec(function (err, sv) {
//     if (err){
//         console.log('error')
//     }else {
//         console.log(sv._id.password);
//     }
// })

//=======================================================
//diem tung mon hoc cu the
router.get('/diem/:idlopmonhoc',auth.reqIsAuthenticate,function (req, res, next) {
    DiemMonHocController.find({idSinhVien:req.user._id,idLopMonHoc: req.params.idlopmonhoc},function (err, diemmonhoc) {
        if (err){
            res.json({
                success:false,
            })
        }else {
            res.json({
                success: true,
                infomation: diemmonhoc
            })
        }
    })
})
//=======================================================
//lay diem tat ca cac mon hoc
router.get('/alldiem',auth.reqIsAuthenticate,function (req, res, next) {
    DiemMonHocController.find({idSinhVien:req.user._id},function (err, diemmonhocs) {
        if (err){
            res.json({
                success:false
            })
        } else {
            res.json(diemmonhocs);
        }
    })
})
//=======================================================
//get diemrenluyen
router.get('/diemrenluyen',auth.reqIsAuthenticate,function (req, res) {

});
//=======================================================
//test deep-populate
// SinhVien.findOne({_id:'14020234'}).populate({
//     path:'idLopChinh',
//     populate:{
//         path:'idKhoa'
//     }
// }).exec(function (err, sinhvien) {
//     if (err){
//         console.log('err');
//     }
//     console.log(sinhvien);
// })

//=======================================================
module.exports = router;