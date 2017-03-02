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
var PhongBanController    = require('../controllers/PhongBanController');
var KhoaController  =require('../controllers/KhoaController')
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
//get information of sinhvien with sinhvien id
router.get('/information/:id', auth.reqIsAuthenticate, function (req, res, next) {
    SinhVienController.findById(req.params.id,function (err, sinhvien) {
        if (err){
            res.json({
                success:false
            })
        }
        res.json({
            success:true,
            metadata:sinhvien
        })
    })
});

//========================================================
//getting profile of sinhvien
//tra ve thong tin cua sinhvien
router.get('/profile', auth.reqIsAuthenticate, auth.reqIsSinhVien, function (req, res) {
    SinhVienController.findById(req.user._id,function (err, sinhvien) {
        if (err){
            res.json({
                success:false
            })
        }
        res.json(sinhvien)
    })
})
//=============================================================
//sinhvien post tokenfirebase
//app gui token firebase len
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
    var arrayObject= req.body.srrayObj;
    console.log(arrayObject);
    //phaan tich string to arrayInt
    arrayObject = arrayObject.trim().substring(1,arrayObject.length-1);
    var arr = arrayObject.split(',');
    for (let i=0;i<arr.length;i++){
        arr[i] =arr[i].trim();
    }
    //
    var info={
        _id: req.user._id,
        idLoaiThongBao: arr
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
                            message:'thanh cong'
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
});
//Sinh vien dang ki cac loai tintuc muon nhan
router.post('/guiloaitintuc', auth.reqIsAuthenticate, auth.reqIsSinhVien, function (req, res, next) {
    //android gui option cac lua chon nhan thong bao

    //phia android gui 1 mang cac id loai thong bao
    var arrayObject= req.body.srrayObj;
    console.log(arrayObject);
    //phaan tich string to arrayInt
    arrayObject = arrayObject.trim().substring(1,arrayObject.length-1);
    var arr = arrayObject.split(',');
    for (let i=0;i<arr.length;i++){
        arr[i] =arr[i].trim();
    }
    //
    var info={
        _id: req.user._id,
        idLoaiTinTuc: arr
    }
    if (arrayObject==null){
        res.json({
            success: false,
            message:'Ban chua yeu cau loai thong bao!! try again.'
        })
    } else {
        SubscribeController.create(info,function (err, result) {
            if (err){
                SubscribeController.update(req.user._id,{idLoaiTinTuc: info.idLoaiTinTuc},function (err, result) {
                    if (err){
                        res.json({
                            success: false,
                            message:'Error'
                        })
                    }else {
                        res.json({
                            success: true,
                            message:'thanh cong'
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
});
//=======================================================
//diem tung mon hoc cu the cua sinh vien
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

//=======================================================

//xoa token firebase sinh vien
router.put('/deletetokenfirebase',auth.reqIsAuthenticate,auth.reqIsSinhVien,function (req, res, next) {

    SinhVienController.update(req.user._id,{tokenFirebase:null},function (err, sinhvien) {
        if (err){
            res.json({
                success: false,
            })
        }
        res.json({
            success: true,
            sinhvien: sinhvien
        })
    })
})

//sinh vien xem tat ca cac thong bao cua minh
//id sender co the la khoa, lopmon hoc, hoac co the la phongban
router.get('/listthongbao/:idSender',auth.reqIsAuthenticate,function (req, res, next) {
    if (req.params.idSender=='phongban'){
        async.waterfall([
            function findphongban(callback) {
                PhongBanController.find({},function (err, pbs) {
                    if (err){
                        callback(err,null)
                    }else {
                        callback(null,pbs)
                    }
                })
            },
            function (phongbans, callback) {
                var listTb =[];
                phongbans.forEach(function (phongban) {
                    var tenpb= phongban.tenPhongBan;
                    var pb= { 'id': phongban._id,
                              'ten phong ban:' :tenpb,
                              'list thong bao :': phongban.idThongBao }
                    listTb.push(pb);
                })
                callback(null,listTb)
            }
        ],function (err, response) {
            if (err){
                res.json({
                    success: false
                })
            }else {
                res.json(response)
            }
        })
    }
    else if (req.params.idSender=='khoa'){
        SinhVienController.findById(req.user._id,function (err, sv) {
            if (err){
                res.json({
                    success: false
                })
            }else {
                res.json(sv.idLopChinh.idKhoa.idThongBao)
            }
        })
    }
    else if (req.params.idSender=='giangvien'){
        SinhVienController.findById(req.user._id,function (err, sv) {
            if (err){
                res.json({
                    success: false
                })
            }else {
                res.json(sv.idLopMonHoc.idGiangVien.idThongBao)
            }
        })
    }
})
module.exports = router;