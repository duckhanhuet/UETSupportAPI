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
var Khoa        = require('../models/Khoa')
var PhongBanController = require('../controllers/PhongBanController');
var GiangVienController = require('../controllers/GiangVienController');
var SubscribeController = require('../controllers/SubscribeController');
var ThongBaoController = require('../controllers/ThongBaoController');
var FileController=require('../controllers/FileController');
//==========================================
var fs = require('fs');
var multipart  = require('connect-multiparty');
var multipartMiddleware = multipart();
var storage_file = require('../Utils/storage_file');
var cors = require('cors');
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

//================================================================



router.post('/guithongbao',auth.reqIsAuthenticate,auth.reqIsKhoa,multipartMiddleware,function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log('file la:'+req.files);
    //console.log('req',req.body)
    //tieu de cua thong bao
    var tieuDe = req.body.tieuDe;
    //noi dung cua thong bao
    var noiDung = req.body.noiDung;
    //muc do thong bao
    var idMucDoThongBao = req.body.idMucDoThongBao;
    //loai thogn bao
    var idLoaiThongBao = req.body.idLoaiThongBao;
    //nguoi gui thong bao
    var idSender=req.user._id;
    //kiem tra gui thong bao
    var files;
    var hasfile; // hasfile=0 : khong co file //hasfile=1 : co file
    var kindIdSender= 'Khoa'
    var category = req.body.categoryReceiver;
    var idReceiver = req.body.idReceiver;
    // kind=1 tuc la loai thong bao (kind=2 la loai diem,..)
    var kind =1;
    var hasfile;

    //kiem tra xem co file dinh kem hay khong
    if(req.body.file_length!=0)
    {
        if (req.files.files instanceof Array){
            //console.log('la array')
            files= req.files.files;
        }else {
            //console.log('la object')
            files.push(req.files.files)
        }
        hasfile=1;
    }else {
        //console.log('khong co file');
        hasfile=0;
    }
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
            //neu co file dinh kem
            if (files){
                var idFiles=[];
                //function luu file vao database va callback lai idFiles
                storage_file.saveFile(files,idFiles);
                //function luu thong bao voi idFile la mang idFiles tim duoc o tren
                var functionTwo = function () {
                    //console.log(idFiles);
                    //create thong bao
                    var infoThongBao={
                        tieuDe: tieuDe,
                        noiDung: noiDung,
                        idFile: idFiles,
                        idLoaiThongBao: idLoaiThongBao,
                        idMucDoThongBao: idMucDoThongBao,
                        idSender:idSender,
                        idReceiver:idReceiver,
                        kindIdSender: kindIdSender,
                        kindIdReceiver: category
                    }
                    //luu thong bao vua gui
                    ThongBaoController.create(infoThongBao,function (err, tb) {
                        if (err){
                            callback(err,null);
                        }
                        console.log("tb",tb);
                        callback(null,tb);
                    })
                }
                //setTime cho functionTwo thuc hien sau 1s (settimeout de doi push idFile xong)
                setTimeout(functionTwo,1000);
                //============================
            }
            else{
                //neu khong co file dinh kem
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
            //tim tat ca cac sinh vien muon nhan loai thong bao
            SubscribeController.find({idLoaiThongBao:{$in:[Number(idLoaiThongBao)]}},function (err,subscribes) {
                if (err){
                    callback(err,null)
                }else {
                    var listSubs=[]; // list gom tat ca cac sinh vien co idLoaiThongBao va cac sinh vien thuoc khoa post
                    //push all sinh vien co idKhoa= req.user._id
                    subscribes.forEach(function (subscribe) {
                        if (subscribe._id.idLopChinh.idKhoa._id==req.user._id){
                            listSubs.push(subscribe)
                        }
                    })
                    //in ra tat ca cac sinh vien thoa man
                    //console.log('listsub:'+listSubs)

                    //tra ve object gom thong bao dang va list cac subcribes
                    var object ={
                        thongbao: result,
                        subscribes: listSubs
                    }
                    callback(null,object);
                }
            })
        },
        function (result, callback) {
            //url de lay thong bao ve
            var url = '/thongbao/' + result.thongbao._id;
            //gui tin nhan ts app
            message = new gcm.Message({
                data: dataNoti.createData(tieuDe,noiDung,url,idMucDoThongBao,idLoaiThongBao,kind,hasfile)
            });
            console.log('Thong tin gui di bao gom:');
            console.log(dataNoti.createData(tieuDe,noiDung,url,idMucDoThongBao,idLoaiThongBao,kind,hasfile));
            var subscribes= result.subscribes;

            // pust list tokenFirebase vao mang registerToken
            subscribes.forEach(function (subscribe) {
                registerToken.push(subscribe._id.tokenFirebase);
            })
            //list cac token ma server gui toi
            console.log('list tokenFirebase la:'+ registerToken);
            //gui thong bao cho tung sinh vien
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
        else {
            res.json({
                success: true,
                message: result
            })
        }

    })

})
//======================================================

router.get('/list/thongbaodagui',auth.reqIsAuthenticate,function (req, res, next) {
    ThongBaoController.find({idSender: req.user._id},function (err, thongbaos) {
        if (err){
            res.json({
                success: false
            })
        }else {
            res.json(thongbaos)
        }
    })
})
//===============================================

module.exports = router;