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
var ThongBaoController = require('../controllers/ThongBaoController');
var FileController=require('../controllers/FileController');
//==========================================
var fs = require('fs');
var multipart  = require('connect-multiparty');
var multipartMiddleware = multipart();
//===========================================
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
// Subscribe.find({idLoaiThongBao:{$in:[1]}}).populate('_id').exec(function (err, res) {
//     if (err){
//         console.log(err);
//     }else {
//         console.log(res)
//     }
// })
// SubscribeController.find({idLoaiThongBao:{$in:[1]}},function (err, subscribes) {
//     if (err){
//         console.log('err');
//     }
//     else {
//         console.log(subscribes.idLoaiThongBao);
//     }
// })

//================================================================

router.post('/guithongbao',auth.reqIsAuthenticate,auth.reqIsKhoa,multipartMiddleware,function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    var tieuDe = req.body.tieuDe;
    var noiDung = req.body.noiDung;
    var idMucDoThongBao = req.body.idMucDoThongBao;
    var idLoaiThongBao = req.body.idLoaiThongBao;
    var kind =1;
    var file;
    if(req.files)
    {
        console.log('co file');
        file= req.files.file_0;
    }else {
        console.log('khong co file');
    }
    //var file = req.files.file;
    //===============================================
    //===============================================
    var message;
    //==============================================
    var sender = new gcm.Sender(config.serverKey);
    var registerToken = [];

    //===============================================

    async.waterfall([
        function checkValidate(callback) {
            if(!tieuDe||!noiDung||!idLoaiThongBao){
                var object={
                    success:false,
                    message: 'Invalide tieu de va noi dung thong bao'
                }
                callback('err',null);
            }else {
                callback(null,'Success');
            }
        },
        function checkFile(ketqua,callback) {
            if (file){
                // Tên file
                var originalFilename = file.name;
                // File type
                var fileType         = file.type.split('/')[1];
                // File size
                var fileSize         = file.size;
                //pipe save file
                var pathUpload       = __dirname + '/files/' + originalFilename;
                var objectFile ={
                    tenFile: originalFilename,
                    link: pathUpload
                }
                FileController.create(objectFile,function (err, filess) {
                    if (err){
                        callback(err,null);
                    }
                    console.log('Create file success');
                    //============================
                    //create thong bao
                    var infoThongBao={
                        tieuDe: tieuDe,
                        noiDung: noiDung,
                        idFile: filess._id,
                        idLoaiThongBao: idLoaiThongBao,
                        idMucDoThongBao: idMucDoThongBao
                    }
                    ThongBaoController.create(infoThongBao,function (err, tb) {
                        if (err){
                            callback(err,null);
                        }
                        //console.log(tb);
                        callback(null,tb);
                    })
                    //============================

                })
            }
            else{
                var infoThongBao={
                    tieuDe: tieuDe,
                    noiDung: noiDung,
                    idLoaiThongBao: idLoaiThongBao,
                    idMucDoThongBao: idMucDoThongBao
                }
                ThongBaoController.create(infoThongBao,function (err, tb) {
                    if (err){
                        callback(err,null);
                    }
                    console.log(tb);
                    callback(null,tb);
                })
            }
        },
        function find(result,callback) {
            Subscribe.find({idLoaiThongBao:{$in:[Number(idLoaiThongBao)]}}).populate('_id').exec(function (err, subscribes) {
                if (err){
                    callback(err,null)
                }else {
                    var object ={
                        thongbao: result,
                        subscribes: subscribes
                    }
                    callback(null,object);
                    //console.log(subscribes)
                }
            })
        },
        function (result, callback) {
            var url = '/thongbao/' + result.thongbao._id;
            message = new gcm.Message({
                data: dataNoti.createData(tieuDe,noiDung,url,idMucDoThongBao,idLoaiThongBao,kind)
            });
            console.log(dataNoti.createData(tieuDe,noiDung,url,idMucDoThongBao,idLoaiThongBao,kind));
            var subscribes= result.subscribes;
            subscribes.forEach(function (subscribe) {
                registerToken.push(subscribe._id.tokenFirebase);
            })
            //console.log(registerToken);
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
                err:err.message
            })
        }
        res.json({
            success: true,
            message: result
        })
    })

})
//===============================================


// router.post('/guithongbao', auth.reqIsAuthenticate, auth.reqIsKhoa, function (req, res, next) {
//     var tieuDe = req.body.tieuDe;
//     var noiDung = req.body.noiDung;
//     var tenFile = req.body.tenFile;
//     var linkFile = req.body.linkFile;
//     var mucDoThongBao = req.body.mucDoThongBao;
//     var idLoaiThongBao = req.body.idLoaiThongBao;//gui 1 id loai thong bao
//
//     if(!tieuDe||!noiDung||!idLoaiThongBao){
//         res.json({
//             success:false,
//             message: 'Invalide tieu de va noi dung thong bao'
//         })
//     } else{
//         //============================================
//         var message;
//         //==============================================
//         var sender = new gcm.Sender(config.serverKey);
//         var registerToken = [];
//         message = new gcm.Message({
//             data: dataNoti.createData(tieuDe,noiDung,tenFile,linkFile,mucDoThongBao,idLoaiThongBao)
//         });
//
//         async.waterfall([
//             function (callback) {
//                 Subscribe.find({idLoaiThongBao:{$in:[Number(idLoaiThongBao)]}}).populate('_id').exec(function (err, subscribes) {
//                     if (err){
//                         callback(err,null)
//                     }else {
//                         callback(null,subscribes)
//                         console.log(subscribes)
//                     }
//                 })
//             },
//             function (subscribes, callback) {
//                 subscribes.forEach(function (subscribe) {
//                     registerToken.push(subscribe._id.tokenFirebase);
//                 })
//                 console.log(registerToken);
//                 sender.send(message, registerToken, function (err, response) {
//                     console.log(response)
//                     if (err) {
//                         callback(err, null)
//                     }
//                     else {
//                         callback(null, "Success")
//                     }
//                 })
//             }
//
//         ],function (err, result) {
//             if (err){
//                 res.json({
//                     success:false,
//                     err:err
//                 })
//             }
//             res.json({
//                 success: true,
//                 message: result
//             })
//         })
//     }
// });

module.exports = router;