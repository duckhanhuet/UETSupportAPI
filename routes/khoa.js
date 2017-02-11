var express = require('express');
var router = express.Router();
var User = require('../models/User');
var SinhVien = require('../models/SinhVien');
var Subscribe= require('../models/Subscribe');
var auth = require('../policies/auth');  //xử lý token trước khi vào API, đính kèm trước cái hàm cần đăng nhập
var async = require('async');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var UserController = require('../controllers/UserController');
var SinhVienController = require('../controllers/SinhVienController');
var KhoaController = require('../controllers/KhoaController');
var PhongBanController = require('../controllers/PhongBanController');
var GiangVienController = require('../controllers/GiangVienController');
var SubscribeController = require('../controllers/SubscribeController');
//========================================
var gcm = require('node-gcm');
var config = require('../Config/Config');
var dataNoti= require('../Utils/dataNoti');
var typeNoti = require('../policies/sinhvien');
//========================================
//get information of all sinhvien
router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    KhoaController.find({}, function (err, khoas) {
        if (err) {
            res.json({
                success: false,
                message: 'not found khoa'
            })
        }
        res.json(khoas);
    })
});
//=====================================================
//getting profile of khoa

router.get('/profile', auth.reqIsAuthenticate, auth.reqIsKhoa, function (req, res) {
    var id = req.user._id;
    KhoaController.findById(id, function (err, result) {
        if (err) {
            res.json({
                success: false,
                message: 'cant found khoa'
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


//=====================================================
//getting infomation for each khoa
router.get('/information/:id', auth.reqIsAuthenticate, function (req, res, next) {

    KhoaController.findById(req.params.id, function (err, khoa) {
        if (err) {
            res.json({
                success: err,
                message: 'not found file with id ' + req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata: khoa
            });
        }
    })
});

//=====================================================
//add sinh vien
router.post('/addsinhvien', auth.reqIsAuthenticate, auth.reqIsKhoa, function (req, res, next) {
    var _id = req.body.username;
    var password = req.body.password;
    var tenSinhVien = req.body.tenSinhVien;
    var idLopMonHoc = req.body.idLopMonHoc;
    var idLopChinh = req.body.idLopChinh;
    if (!_id || !password || !tenSinhVien) {
        res.json({
            success: false,
            message: 'Invalid'
        })
    }
    else {
        async.waterfall([
            function createUser(callback) {
                var user = new User({_id: _id, password: password});
                user.save(function (err) {
                    if (err) {
                        res.json({
                            success: false,
                            message: 'create user fail'
                        })
                        return;
                    }
                    else {
                        callback(null, user);
                    }
                })
            },
            function saveSinhVien(user, callback) {
                var sinhvien = new SinhVien({
                    tenSinhVien: tenSinhVien,
                    _id: user._id,
                    idLopChinh: idLopChinh,
                    idLopMonHoc: idLopMonHoc
                });
                sinhvien.save(function (err) {
                    if (err) {
                        res.json({
                            success: false,
                            message: 'create sinh vien fail'
                        })
                        return;
                    } else {
                        var result = {
                            user: user,
                            info: sinhvien
                        }
                        callback(null, result);
                    }
                })
            }
        ], function (err, result) {
            if (err) {
                console.error(err);
            } else {
                res.json(result)
            }

        })
    }
});
/**
 * XEM LẠI CAU TRUY VẤN ĐỂ KHOA CHI GỬI CHO CÁC SINH VIÊN TRONG KHOA
 */

router.post('/guithongbao', auth.reqIsAuthenticate, auth.reqIsKhoa, function (req, res, next) {
    var tieuDe = req.body.tieuDe;
    var noiDung = req.body.noiDung;
    var tenFile = req.body.tenFile;
    var linkFile = req.body.linkFile;
    var mucDoThongBao = req.body.mucDoThongBao;
    var loaiThongBao = req.body.loaiThongBao;
    if (!tieuDe || !noiDung ||!loaiThongBao) {
        res.json({
            success: false,
            message: 'Invalid tieu de or noi dung, enter try again'
        })
    } else {
        //============================================
        var message;
        //==============================================
        var sender = new gcm.Sender(config.serverKey);
        var registerToken = [];
        async.waterfall([
            function findsubscribe(callback) {
                Subscribe.find({}).populate('_id').exec(function (err, subscribes) {
                    if (err){
                        callback(err,null)
                    }else {
                        callback(null,subscribes)
                    }
                })
            },
            function sendThongBao(results,callback) {
                if (loaiThongBao=='TatCa'){
                    message = new gcm.Message({
                        data: dataNoti.createData(tieuDe,noiDung,tenFile,linkFile,mucDoThongBao,loaiThongBao),
                        kind:'TatCa'
                    });
                    results.forEach(function (result) {
                        if (typeNoti.checkLoaiThongBaoTatCa(result)){
                            registerToken.push(result._id.tokenFirebase);
                        }
                    })
                }
                if (loaiThongBao=='DiemThi'){
                    message = new gcm.Message({
                        data: dataNoti.createData(tieuDe,noiDung,tenFile,linkFile,mucDoThongBao,loaiThongBao),
                        kind:'DiemThi'
                    });
                    results.forEach(function (result) {
                        if (typeNoti.checkLoaiThongBaoDiem(result)){
                            registerToken.push(result._id.tokenFirebase);
                        }
                    })
                }
                if (loaiThongBao=='LichThi'){
                    message = new gcm.Message({
                        data: dataNoti.createData(tieuDe,noiDung,tenFile,linkFile,mucDoThongBao,loaiThongBao),
                        kind:'LichThi'
                    });
                    results.forEach(function (result) {
                        if (typeNoti.checkLoaiThongBaoLichThi(result)){
                            registerToken.push(result._id.tokenFirebase);
                        }
                    })
                }
                if (loaiThongBao=='LichHoc'){
                    message = new gcm.Message({
                        data: dataNoti.createData(tieuDe,noiDung,tenFile,linkFile,mucDoThongBao,loaiThongBao),
                        kind: 'LichHoc'
                    });
                    results.forEach(function (result) {
                        if (typeNoti.checkLoaiThongBaoLichHoc(result)){
                            registerToken.push(result._id.tokenFirebase);
                        }
                    })
                }
                console.log(message)
                console.log(registerToken)
                sender.send(message, registerToken, function (err, response) {
                    console.log(response)
                    if (err) {
                        callback(err, null)
                    }
                    else {
                        callback(null, "Success")
                    }
                })
            }
        ],function (err, result) {
            if (err){
                res.json({
                    success:false,
                    err:err
                })
            }
            res.json({
                success: true,
                message: result
            })
        })
        //=============================================
    }
});

module.exports = router;