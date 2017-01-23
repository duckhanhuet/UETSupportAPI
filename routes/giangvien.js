var express = require('express');
var router = express.Router();
var GiangVienController = require('../controllers/GiangVienController');
var SinhVienController = require('../controllers/SinhVienController');
var async          = require('async');
//===========================================
var auth           = require('../policies/auth');
var typeNoti       = require('../policies/sinhvien');
//===========================================
var gcm = require('node-gcm');
var config= require('../Config/Config');
//===========================================
//get infomation of all giangvien
router.get('/',auth.reqIsAuthenticate,function (req, res, next) {
    GiangVienController.find({},function (err, giangviens) {
        if (err){
            res.json({
                success: false,
                message: 'not found giangvien'
            })
        }
        res.json(giangviens);
    })
});
//====================================================
//get information of giang vien with giangvien id
router.get('/information/:id',auth.reqIsAuthenticate,function (req,res,next) {
    GiangVienController.findById(req.params.id,function (err, giangvien) {
        if (err){
            res.json({
                success:err,
                message:'not found file with id '+req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata:giangvien
            });
        }


    })
});

//========================================================
//getting profile of giangvien
router.get('/profile', auth.reqIsAuthenticate,auth.reqIsGiangVien, function (req, res) {
    var id = req.user._id;
    GiangVienController.findById(id, function (err, result) {
        if (err) {
            res.json({
                success: false,
                message: 'cant found giang vien'
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
//Giang Vien gui thong bao toi lop Mon Hoc,  thong bao nay mang tinh quan trong=> gui cho toan bo sinh vien trong lop
router.post('/guithongBao',auth.reqIsAuthenticate,auth.reqIsGiangVien,function (req, res, next) {
    //Giang vien co the gui Thong bao toi cac lop mon hoc cua minh
    var idLopMonHoc = req.body.idLopMonHoc;
    var tieuDe      = req.body.tieuDe;
    var noiDung     = req.body.noiDung;
    var tenFile     = req.body.tenFile;
    var linkFile    = req.body.linkFile;
    var mucDoThongBao= req.body.mucDoThongBao;
    if (!idLopMonHoc||!tieuDe||!noiDung){
        res.json({
            success:false,
            message:'Invalid IdLopMonHoc or tieuDe or noiDung,please enter truy again'
         })
        //callback("ERR",null)
    }
    else {
        async.waterfall([
            function findSinhViens(callback) {
                SinhVienController.find({},function (err, sinhviens) {
                    if (err){
                        callback(err,null)
                    } else {
                        callback(null,sinhviens);
                    }
                })
            },
            function sendNotification(sinhviens,callback) {
                var message= new gcm.Message({
                    data:{
                        tieuDe: tieuDe,
                        noiDung:noiDung,
                        tenFile: tenFile,
                        linkFile: linkFile,
                        mucDoThongBao: mucDoThongBao
                    },
                    notification:{
                        title: tieuDe,
                        body: noiDung
                    }
                });
                var sender = new gcm.Sender(config.serverKey);
                var registerToken = [];
                sinhviens.forEach(function (sinhvien) {
                    if (sinhvien.idLopMonHoc==idLopMonHoc){
                        registerToken.push(sinhvien.tokenFirebase)
                    }
                })
                sender.send(message,registerToken,function (err, response) {
                    if (err){
                        callback(err,null)
                    }
                    else {
                        callback(null,"Success")
                    }
                })

            }
        ],function (err, result) {
            if (err){
                res.json({
                    success: false,
                    message:'send notification fail',
                    error: err
                })
            } else {
                res.json({
                    success: true
                })
            }
        })
    }
});
//============================================================================
//============================================================================

//VI moi sinh vien co object diem khac nhau nen phai gui tung request mot
//Thanh se post len diem sinh vien va thong tin cua lop mon hoc cua tung sinh vien

router.post('/guiThongBao/diemthi',auth.reqIsAuthenticate,auth.reqIsGiangVien,function (req, res, next) {
    var tenKiHoc=req.body.tenKiHoc;
    var tenGiangVien= req.body.tenGiangVien;
    var tenLopMonHoc= req.body.tenLopMonHoc;
    var monHoc = req.body.monHoc;
    var MSV= req.body.MSV;
    var HoTen= req.body.HoTen;
    var diemThanhPhan = req.body.diemThanhPhan;
    var diemCuoiKi = req.body.diemCuoiKi;
    var tongDiem   = req.body.tongDiem;
    var lopChinh    = req.body.LopChinh;
    if (!MSV||!tenGiangVien||!tenLopMonHoc){
        res.json({
            success:false,
            message:'Invalid msv or tenGiangVien or tenLopMonHoc'
        })
    }else {
        async.waterfall([
            function findSinhVien(callback) {
                SinhVienController.find({},function (err, sinhviens) {
                    if (err){
                        callback('ERROR',null);
                    }else {
                        callback(null,sinhviens);
                    }
                })
            },
            function findSinhVienDangKiThongBaoDiem(sinhviens,callback) {
                var dsSv= [];
                sinhviens.forEach(function (sinhvien) {
                    if (typeNoti.checkLoaiThongBaoDiem(sinhvien)){
                        dsSv.push(sinhvien);
                    }
                })
                callback(null,dsSv);
            },
            function guiThongBao(dssv,callback) {
                var sender= gcm.Sender(config.serverKey);
                dssv.forEach(function (sinhvien) {
                    var message= new gcm.Message({
                        data:{
                            tenLopMonHoc: tenLopMonHoc,
                            tenKiHoc: tenKiHoc,
                            tenGiangVien: tenGiangVien,
                            monHoc: monHoc,
                            diemThanhPhan: diemThanhPhan,
                            diemCuoiKi: diemCuoiKi,
                            tongDiem: tongDiem
                        },
                        notification:{
                            title:'Da co diem mon hoc: '+monHoc,
                            body: 'Xem thong tin chi tiet....'
                        }
                    })
                    sender.send(message,sinhvien.tokenFirebase,function (err, response) {
                        if (err){
                            callback('ERR',null);
                        } else {
                            callback(null,'success');
                        }
                    })
                })
            }
        ],function (err, result) {
            if (err){
                res.json({
                    success: false,
                    message:'send notification fail'
                })
            }else {
                res.json({
                    success: true
                })
            }
        })
    }
})

module.exports = router;