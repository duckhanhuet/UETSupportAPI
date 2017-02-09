var express = require('express');
var router = express.Router();
var PhongBanController = require('../controllers/PhongBanController');
var SinhVienController = require('../controllers/SinhVienController');
var SubscribeController = require('../controllers/SubscribeController');
var Subscribe   = require('../models/Subscribe');
var auth = require('../policies/auth');
var typeNoti = require('../policies/sinhvien');
//========================================================
var gcm = require('node-gcm');
var config = require('../Config/Config');
var async = require('async');
var dataNoti= require('../Utils/dataNoti');
//========================================================
var bodyParser= require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
router.use(bodyParser.json())
//
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
router.post('/guithongbao', auth.reqIsAuthenticate, auth.reqIsPhongBan, function (req, res, next) {
    //Thong bao co tieude va noi dung , thong bao nay gui cho tat ca cac sinh vien trong truong
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
                    success:false
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

//=====================================================
//Gui thong bao diem
router.post('/guithongbao/diem',auth.reqIsAuthenticate,auth.reqIsPhongBan,function (req, res, next) {
    var objectDiems = JSON.parse(req.body.list);

    //===============================================
    //luu diem mon hoc vao database
    //===============================================

    objectDiems.forEach(function (object) {
        var info = {
            idSinhVien: object.MSV,
            idLopMonHoc: object.tenLopMonHoc,
            diemThanhPhan: object.diemThanhPhan,
            diemCuoiKi: object.diemCuoiKi
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
//===============================================


//======================================================
router.post('/postdatabase', auth.reqIsAuthenticate, auth.reqIsPhongBan, function (req, res) {
    require('../test/postDatabase');
    res.json({
        success: true,
        message: 'ok man!!!!'
    })
})
module.exports = router;