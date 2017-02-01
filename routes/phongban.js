var express = require('express');
var router = express.Router();
var PhongBanController = require('../controllers/PhongBanController');
var SinhVienController = require('../controllers/SinhVienController');
var auth = require('../policies/auth');
var typeNoti = require('../policies/sinhvien');
//========================================================
var gcm = require('node-gcm');
var config = require('../Config/Config');
var async = require('async');
//========================================================
//get infomation of all phongban
router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    PhongBanController.find({}, function (err, phongbans) {
        if (err) {
            res.json({
                success: false,
                message: 'not found phongban'
            })
        }
        res.json(phongbans);
    })
});

//=========================================================
//get infomation of phongban with phongban id
router.get('/information/:id', auth.reqIsAuthenticate, function (req, res, next) {
    PhongBanController.findById(req.params.id, function (err, phongban) {
        if (err) {
            res.json({
                success: err,
                message: 'not found file with id ' + req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata: phongban
            });
        }


    })
});

router.get('/profile', auth.reqIsAuthenticate, auth.reqIsPhongBan, function (req, res) {
    var id = req.user._id;
    PhongBanController.findById(id, function (err, result) {
        if (err) {
            res.json({
                success: false,
                message: 'cant found phong ban'
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
//====================================================
/**
 * vIET HAM DAI QUA, CHIA THANH CAC HAM NHO HON ĐÊ
 */
router.post('/guithongBao', auth.reqIsAuthenticate, auth.reqIsPhongBan, function (req, res, next) {
    //Thong bao co tieude va noi dung , thong bao nay gui cho tat ca cac sinh vien trong truong
    var tieuDe = req.body.tieuDe;
    var noiDung = req.body.noiDung;
    var tenFile = req.body.tenFile;
    var linkFile = req.body.linkFile;
    var mucDoThongBao = req.body.mucDoThongBao;
    var loaiThongBao = req.body.loaiThongBao;
    if (!tieuDe || !noiDung) {
        res.json({
            success: false,
            message: 'Invalid tieu de or noi dung, enter try again'
        })
    } else {
        async.waterfall([
            function findSinhVien(callback) {
                SinhVienController.find({}, function (err, users) {
                    if (err) {
                        callback("ERR", null)
                    }
                    else {
                        callback(null, users);
                    }
                })
            },
            //========================================
            function sendThongBao(users, callback) {
                if (!tieuDe || !noiDung) {
                    callback("ERR", null)
                } else {
                    SinhVienController.find({}, function (err, sinhviens) {
                        if (err) {
                            callback(err, null)
                        } else {
                            var message = new gcm.Message({
                                data: {
                                    tieuDe: tieuDe,
                                    noiDung: noiDung,
                                    tenFile: tenFile,
                                    linkFile: linkFile,
                                    mucDoThongBao: mucDoThongBao
                                },
                                notification: {
                                    title: tieuDe,
                                    body: noiDung
                                }
                            })
                            var sender = new gcm.Sender(config.serverKey);
                            var registerToken = [];
                            if (loaiThongBao == 'DiemThi') {
                                sinhviens.forEach(function (sinhvien) {
                                    if (typeNoti.checkLoaiThongBaoDiem(sinhvien)) {
                                        registerToken.push(sinhvien.tokenFirebase)
                                    }
                                    sender.send(message, registerToken, function (err, response) {
                                        console.log(response)
                                        if (err) {
                                            callback(err, null)
                                        }
                                        else {
                                            callback(null, "Success")
                                        }
                                    })
                                })
                            }
                            if (loaiThongBao == 'LichThi') {
                                sinhviens.forEach(function (sinhvien) {
                                    if (typeNoti.checkLoaiThongBaoLichThi(sinhvien)) {
                                        registerToken.push(sinhvien.tokenFirebase)
                                    }
                                    sender.send(message, registerToken, function (err, response) {
                                        console.log(response)
                                        if (err) {
                                            callback(err, null)
                                        }
                                        else {
                                            callback(null, "Success")
                                        }
                                    })
                                })
                            }
                            if (loaiThongBao == 'LichHoc') {
                                sinhviens.forEach(function (sinhvien) {
                                    if (typeNoti.checkLoaiThongBaoLichHoc(sinhvien)) {
                                        registerToken.push(sinhvien.tokenFirebase)
                                    }
                                    sender.send(message, registerToken, function (err, response) {
                                        console.log(response)
                                        if (err) {
                                            callback(err, null)
                                        }
                                        else {
                                            callback(null, "Success")
                                        }
                                    })
                                })
                            }
                            if (loaiThongBao == 'DangKiTinChi') {
                                sinhviens.forEach(function (sinhvien) {
                                    if (typeNoti.checkLoaiThongBaoDangKiTinChi(sinhvien)) {
                                        registerToken.push(sinhvien.tokenFirebase)
                                    }
                                    sender.send(message, registerToken, function (err, response) {
                                        console.log(response)
                                        if (err) {
                                            callback(err, null)
                                        }
                                        else {
                                            callback(null, "Success")
                                        }
                                    })
                                })
                            }
                            if (loaiThongBao == 'TatCa') {
                                sinhviens.forEach(function (sinhvien) {
                                    if (typeNoti.checkLoaiThongBaoTatCa(sinhvien)) {
                                        registerToken.push(sinhvien.tokenFirebase)
                                    }
                                    sender.send(message, registerToken, function (err, response) {
                                        console.log(response)
                                        if (err) {
                                            callback(err, null)
                                        }
                                        else {
                                            callback(null, "Success")
                                        }
                                    })
                                })
                            }
                        }
                    })
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
    }
});

//======================================================
router.post('/postDatabase', auth.reqIsAuthenticate, auth.reqIsPhongBan, function (req, res) {
    require('../test/postDatabase');
    res.json({
        success: true,
        message: 'ok man!!!!'
    })
})
module.exports = router;