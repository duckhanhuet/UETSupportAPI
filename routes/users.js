var express = require('express');
var router = express.Router();
var User = require('../models/User');
var SinhVien = require('../models/SinhVien');
var config = require('../Config/Config');
var auth = require('../policies/auth');  //xử lý token trước khi vào API, đính kèm trước cái hàm cần đăng nhập
var async = require('async');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var UserController = require('../controllers/UserController');
var SinhVienController = require('../controllers/SinhVienController');
var KhoaController = require('../controllers/KhoaController');
var PhongBanController = require('../controllers/PhongBanController');
var GiangVienController = require('../controllers/GiangVienController');

//====================================================================
var FCM = require('fcm-node');
var serverKey =config.serverKey;
var fcm = new FCM(serverKey);

//=====================================================================
//=====================================================================

//test add some sinhvien to database
//require('../test/test');
//xem lai cai ham nay dung asynce để làm lại làm bằng bcrys để hashcode password nhé

//=====================================================================
//create database from file exels
//require('../test/postDatabase');

//=====================================================================
//=====================================================================
//api for login

router.post('/authenticate', function (req, res) {
    User.findOne({_id: req.body.username}, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.send({
                success: false,
                message: 'Authentication failed ,User not Found.'
            })
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.sign(user, config.secret);

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                } else {
                    res.json({
                        succsess: false,
                        message: 'Authentication failed.Password did not match'
                    })
                }
            })
        }
    })
})

// VD xử lý có đăng nhập
// hafm nay phải có token mới có thể chạy đc
router.get('/test', auth.reqIsAuthenticate, function (req, res) {
    res.json(req.user);
})

//Api for find sum users
router.get('/', function (req, res, next) {
    UserController.find(req.query, function (err, results) {
        if (err) {
            res.json({
                success: false,
                message: err
            })
            return;
        }
        res.json({
            success: true,
            results: results
        })
    })
});

//=========================================================
//=========================================================

//Api get profile : http://localhost:3000/users/profile?token=..........

//get User and Infomation by get link: /users/:id
router.get('/profile', auth.reqIsAuthenticate, function (req, res) {
    var id = req.user._id;
    var role = req.user.role;
    async.series([
        function findUser(callback) {
            UserController.findById(id, function (err, result) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Cannot find User'
                    })
                } else {
                    //role = result.role;
                    var kq={
                        user: result
                    }
                    callback(null, kq);
                }

            })
        },
        function findEachUser(callback) {
            switch (role) {
                // neu quyen la khoa
                case 'Khoa':
                    KhoaController.findById(id, function (err, result) {
                        if (err) {
                            res.json({
                                success: false,
                                message: 'cant found'
                            })
                        }
                        var kq={
                            profile:result
                        }
                        callback(null, kq);
                    })
                    break;
                case 'GiangVien':
                    //Neu quyen la Giang Vien
                    GiangVienController.findById(id, function (err, result) {
                        if (err) {
                            res.json({
                                success: false,
                                message: 'not found'
                            })
                        }
                        var kq={
                            profile:result
                        }
                        callback(null, kq);
                    });
                    break;
                case 'PhongBan':
                    //Neu Quyen la Phong Ban
                    PhongBanController.findById(id, function (err, result) {
                        if (err) {
                            res.json({
                                success: false,
                                message: 'cant found'
                            })
                        }
                        var kq={
                            profile:result
                        }
                        callback(null, kq);
                    })
                    break;
                default:
                    // Con lai mac dinh la Sinh Vien
                    SinhVienController.findById(id, function (err, result) {
                        if (err) {
                            res.json({
                                success: false,
                                message: 'cant found'
                            })
                        }
                        var kq={
                            profile: result
                        }
                        callback(null, kq);
                    })
            }
        }
    ], function (err, result) {
        if (err) {
            console.error(err);
        }
        res.json(result);
    })
});


//===================================================
//===================================================

//Api for add Sinh vien : http://localhost:3000/users/addSinhVien?token=....
// Only Khoa can add Sinh Vien

//Add Thong tin Sinh VIen moi chi gom co username,password,tenSSinhVien

router.post('/khoa/addSinhVien',auth.reqIsAuthenticate,function (req, res, next) {
    var role= req.user.role;

    switch (role){
        case 'Khoa':
            var _id= req.body.username;
            var password= req.body.password;
            var tenSinhVien = req.body.tenSinhVien;
            var idLopMonHoc= req.body.idLopMonHoc;
            var idLopChinh= req.body.idLopChinh;
            if (!_id||!password||!tenSinhVien)
            {
                res.json({
                    success: false,
                    message:'Invalid'
                })
            }
            else{
                async.waterfall([
                    function createUser(callback) {
                        var user= new User({_id:_id,password:password});
                        user.save(function (err) {
                            if (err){
                                res.json({
                                    success: false,
                                    message: 'create user fail'
                                })
                                return;
                            }
                            else {
                                callback(null,user);
                            }
                        })
                    },
                    function saveSinhVien(user,callback) {
                        var sinhvien= new SinhVien({tenSinhVien:tenSinhVien,_id:user._id,idLopChinh:idLopChinh,idLopMonHoc:idLopMonHoc});
                        sinhvien.save(function (err) {
                            if (err){
                                res.json({
                                    success: false,
                                    message: 'create sinh vien fail'
                                })
                                return;
                            } else {
                                var result={
                                    user: user,
                                    info: sinhvien
                                }
                                callback(null,result);
                            }
                        })
                    }
                ],function (err, result) {
                    if (err){
                        console.error(err);
                    }else {
                        res.json(result);
                    }

                })
            }
            break;
        default:
            res.json({
                success: false,
                message: 'Ban khong co quyen them sinh vien'
            })
            break;
    }
})
//==============================================================
//==============================================================
//API for sinhvien post tokenFirebase

router.post('/tokenFirebase',auth.reqIsAuthenticate,function (req, res, next) {
    var tokenFirebase = req.body.tokenFirebase;
    if (!tokenFirebase){
        res.json({
            success: false,
            message: 'Invalid token firebase'
        })
    } else {
        switch (req.user.role){
            case 'SinhVien':
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
                break;
            default:
                res.json({
                    success: false,
                    message: 'Notification only use by SinhVien'
                })
        }
    }
});

//==============================================
//api for Khoa send thongbao for user (Gui thong bao cho tat ca cac sinh vien)

// router.post('/khoa/guiThongBao',auth.reqIsAuthenticate,function (req, res, next) {
//     //var loaiThongBao= req.body.loaiThongBao;
//
//     //Thong bao ms chi co tieude va noi dung
//     var tieuDe= req.body.tieuDe;
//     var noiDung= req.body.noiDung;
//
//     switch (req.user.role){
//         case 'Khoa':
//             UserController.find({},function (err, users) {
//                 if (err){
//                     console.log('cannot found sinhvien');
//                 }
//
//             })
//             break;
//         case 'GiangVien':
//             break;
//         case 'PhongBan':
//             break;
//         default:
//             res.json({
//                 success: false,
//                 message: 'Ban Khong co quyen post Thong Bao'
//             })
//     }
// })

module.exports = router;
