var express = require('express');
var router = express.Router();
var GiangVienController = require('../controllers/GiangVienController');
var GiangVien           = require('../models/GiangVien');
var SinhVienController = require('../controllers/SinhVienController');
var SubscribeController = require('../controllers/SubscribeController');
var DiemMonHocController=  require('../controllers/DiemMonHocController');
var async = require('async');
//===========================================
var auth = require('../policies/auth');
var typeNoti = require('../policies/sinhvien');
//===========================================
var gcm = require('node-gcm');
var config = require('../Config/Config');
var dataNoti= require('../Utils/dataNoti');
//===========================================
//get infomation of all giangvien
router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    GiangVienController.find({}, function (err, giangviens) {
        if (err) {
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
router.get('/information/:id', auth.reqIsAuthenticate, function (req, res, next) {
    GiangVienController.findById(req.params.id,function (err, giangvien) {
        if (err){
            res.json({
                success:false
            })
        }
        res.json({
            success:true,
            meatadata: giangvien
        })
    })
});

//========================================================
//getting profile of giangvien
router.get('/profile', auth.reqIsAuthenticate, auth.reqIsGiangVien, function (req, res) {
    var id = req.user._id;
    GiangVienController.findById(req.user._id,function (err, giangvien) {
        if (err){
            res.json({
                success: false,
                message: 'cant found giang vien'
            })
        } else {
            res.json({
                success:true,
                metadata:giangvien
            })
        }
    })
})
//=============================================================
//Giang Vien gui thong bao toi lop Mon Hoc,  thong bao nay mang tinh quan trong=> gui cho toan bo sinh vien trong lop
router.post('/guithongbao', auth.reqIsAuthenticate, auth.reqIsGiangVien, function (req, res, next) {
    //Giang vien co the gui Thong bao toi cac lop mon hoc cua minh
    var idLopMonHoc = req.body.idLopMonHoc;
    var tieuDe = req.body.tieuDe;
    var noiDung = req.body.noiDung;
    var tenFile = req.body.tenFile;
    var linkFile = req.body.linkFile;
    var mucDoThongBao = req.body.mucDoThongBao;
    var loaiThongBao =req.body.loaiThongBao;
    if (!idLopMonHoc || !tieuDe || !noiDung) {
        res.json({
            success: false,
            message: 'Invalid IdLopMonHoc or tieuDe or noiDung,please enter truy again'
        })
        //callback("ERR",null)
    }
    else {
        async.waterfall([
            function findSinhViens(callback) {
                SinhVienController.find({}, function (err, sinhviens) {
                    if (err) {
                        callback(err, null)
                    } else {
                        callback(null, sinhviens);
                    }
                })
            },
            function sendNotification(sinhviens, callback) {
                var message = new gcm.Message({
                    data: dataNoti.createData(tieuDe,noiDung,tenFile,linkFile,mucDoThongBao,loaiThongBao)
                });
                var sender = new gcm.Sender(config.serverKey);
                var registerToken = [];
                sinhviens.forEach(function (sinhvien) {
                    if (sinhvien.idLopMonHoc == idLopMonHoc) {
                        registerToken.push(sinhvien.tokenFirebase)
                    }
                })
                sender.send(message, registerToken, function (err, response) {
                    if (err) {
                        callback(err, null)
                    }
                    else {
                        callback(null, "Success")
                    }
                })

            }
        ], function (err, result) {
            if (err) {
                res.json({
                    success: false,
                    message: 'send notification fail',
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

router.post('/guithongbao/diem',auth.reqIsAuthenticate,auth.reqIsGiangVien,function (req, res, next) {
    var objectDiems = JSON.parse(req.body.list);

    //===============================================
    //luu diem mon hoc vao database
    //===============================================

    objectDiems.forEach(function (object) {
        var info = {
            idSinhVien: object.MSV,
            idLopMonHoc: object.tenLopMonHoc,
            diemThanhPhan: Number(object.diemThanhPhan),
            diemCuoiKi: Number(object.diemCuoiKi)
        }
        DiemMonHocController.create(info, function (err, result) {
            if (err) {
                console.log('error create diem mon hoc');
            }
        })
    })
    //===============================================
    async.waterfall([
        function findsubscribes(callback) {
            Subscribe.find({}).populate('_id').exec(function (err, subscribes) {
                if (err) {
                    callback(err, null)
                } else {
                    callback(null, subscribes)
                }
            })
        },
        function svdkyDiem(results, callback) {
            var dsSv = [];
            results.forEach(function (subscribe) {
                if (typeNoti.checkLoaiThongBaoDiem(subscribe)) {
                    dsSv.push(subscribe);
                }
            })
            callback(null, dsSv)
        },
        function sendThongBao(results, callback) {
            var arrayMSV = [];
            var sender = gcm.Sender(config.serverKey);
            results.forEach(function (sv) {
                arrayMSV.push(sv._id);
            });

            objectDiems.forEach(function (objectDiem) {
                if (arrayMSV.indexOf(objectDiem.MSV) > -1) {
                    var message = new gcm.Message({
                        data: dataNoti.createDataDiem(
                            objectDiem.MSV, objectDiem.tenLopMonHoc
                            , objectDiem.tenKiHoc, objectDiem.tenGiangVien,
                            objectDiem.monHoc, objectDiem.diemThanhPhan,
                            objectDiem.diemCuoiKi, objectDiem.tongDiem)
                    });
                    SinhVienController.findById(objectDiem.MSV, function (err, sv) {
                        if (err) {
                            console.log('find ' + objectDiem.MSV + ' fail');
                        }
                        sender.send(message, sv.tokenFirebase, function (err, response) {
                            if (err) {
                                console.log('Send noti for sinhvien ' + objectDiem.MSV + ' fail');
                            }
                        })
                    })
                }
            })
            callback(null, 'success');
        }
    ], function (err, result) {
        if (err) {
            res.json({
                success: false
            })
        }
        res.json(result);
    })

});

module.exports = router;