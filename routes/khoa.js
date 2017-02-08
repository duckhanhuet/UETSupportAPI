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
                res.json(result);
            }

        })
    }
});
/**
 * XEM LẠI CAU TRUY VẤN ĐỂ KHOA CHI GỬI CHO CÁC SINH VIÊN TRONG KHOA
 */

router.post('/guithongbao', auth.reqIsAuthenticate, auth.reqIsKhoa, function (req, res, next) {
    //Thong bao co tieude va noi dung , thong bao nay gui cho tat ca cac sinh vien trong truong
    var tieuDe = req.body.tieuDe;
    var noiDung = req.body.noiDung;
    var tenFile = req.body.tenFile;
    var linkFile = req.body.linkFile;
    var mucDoThongBao = req.body.mucDoThongBao;
    var loaiThongBao  = req.body.loaiThongBao;

    async.waterfall([
        function findSinhVien(callback) {
            var users=[];
            SinhVienController.find({},function (err, svs) {
                if (err){
                    callback(err,null);
                }
                svs.forEach(function (sv) {
                    SinhVien.findOne({_id:sv._id}).populate('idLopChinh').exec(function (err, sinhvien) {
                        if (err){
                            throw err;
                        }
                        if (sinhvien.idLopChinh.idKhoa==req.user._id){
                            users.push(sinhvien);
                            //console.log(sinhvien);
                        }
                    })
                })
            })
            callback(null,users);
        },

        //========================================
        function sendThongBao(users, callback) {
            if (!tieuDe || !noiDung) {
                // res.json({
                //     success:false,
                //     message:'Invalid tieuDe or noiDung please enter value'
                // })
                callback("ERR", null)
            } else {
                var message= new gcm.Message({
                    data: dataNoti.createData(tieuDe,noiDung,tenFile,linkFile,mucDoThongBao,loaiThongBao)
                });
                var sender= new gcm.Sender(config.serverKey);
                var registerToken= [];
                if (loaiThongBao=='TatCa')
                {
                    SubscribeController.findById(users._id,function (err, sv) {
                        if (typeNoti.checkLoaiThongBaoTatCa(sv)){
                            registerToken.push(sv);
                        }
                    })
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

                if (loaiThongBao=='LichHoc')
                {
                    SubscribeController.findById(users._id,function (err, sv) {
                        if (typeNoti.checkLoaiThongBaoLichHoc(sv)){
                            registerToken.push(sv);
                        }
                    })
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

                if (loaiThongBao=='LichThi')
                {
                    SubscribeController.findById(users._id,function (err, sv) {
                        if (typeNoti.checkLoaiThongBaoLichThi(sv)){
                            registerToken.push(sv);
                        }
                    })
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

            }
        }
    ], function (err, result) {
        if (err) {
            console.error(err);
            res.json({
                success: false,
                error: err
            })
        } else {
            res.json({
                success: true
            })
        }
    })
});

module.exports = router;