var express = require('express');
var router = express.Router();
var PhongBanController = require('../controllers/PhongBanController');
var SinhVienController = require('../controllers/SinhVienController');
var SubscribeController = require('../controllers/SubscribeController');
var DiemMonHocController = require('../controllers/DiemMonHocController');
var ThongBaoController = require('../controllers/ThongBaoController');
var FileController=require('../controllers/FileController')
var Subscribe   = require('../models/Subscribe');
var auth = require('../policies/auth');
var typeNoti = require('../policies/sinhvien');
//==========================================
var fs = require('fs');
var multipart  = require('connect-multiparty');
var multipartMiddleware = multipart();
//===========================================
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
router.post('/guithongbao',auth.reqIsAuthenticate,auth.reqIsPhongBan,multipartMiddleware,function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log(req.body);
    var tieuDe = req.body.tieuDe;
    var noiDung = req.body.noiDung;
    var mucDoThongBao = req.body.mucDoThongBao;
    var idLoaiThongBao = req.body.idLoaiThongBao;
    var file = req.files.file_0;
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
                callback(object,null);
            }else {
                callback(null,'Check validate success');
            }
        },
        function checkFile(result,callback) {
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
                FileController.create(objectFile,function (err, result) {
                    if (err){
                        callback(err,null);
                    }
                    //============================
                    //create thong bao
                    var infoThongBao={
                        tieuDe: tieuDe,
                        noiDung: noiDung,
                        idFile: result._id,
                        idLoaiThongBao: idLoaiThongBao,
                        idMucDoThongBao: mucDoThongBao
                    }
                    console.log('infothongbao',infoThongBao)
                    ThongBaoController.create(infoThongBao,function (err, tb) {
                        console.log("tb: ",tb);
                    })
                    //============================
                    console.log('Create file success');

                    callback(null,result);
                })
            }
            else{
                callback(null,'Not found file');
            }
        },
        function find(result,callback) {
            Subscribe.find({idLoaiThongBao:{$in:[Number(idLoaiThongBao)]}}).populate('_id').exec(function (err, subscribes) {
                if (err){
                    callback(err,null)
                }else {
                    var object ={
                        file: result,
                        subscribes: subscribes
                    }
                    callback(null,object);
                    //console.log(subscribes)
                }
            })
        },
        function (result, callback) {
            var urlFile ='localhost:3000/file/'+ result.file._id;
            message = new gcm.Message({
                data: dataNoti.createData(tieuDe,noiDung,urlFile,mucDoThongBao,idLoaiThongBao)
            });

            var subscribes= result.subscribes;
            subscribes.forEach(function (subscribe) {
                registerToken.push(subscribe._id.tokenFirebase);
            })
            console.log(registerToken);
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
                message:err.message,
            })
        }
        res.json({
            success: true,
            message: result
        })
    })

})
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
            diemThanhPhan: Number(object.diemThanhPhan),
            diemCuoiKy: Number(object.diemCuoiKi)
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
                    var urlDiem = 'localhost:3000/sinhvien/diem/'+ objectDiem.tenLopMonHoc;
                    var message= new gcm.Message({
                        data: dataNoti.createDataDiem(
                            objectDiem.monHoc,
                            objectDiem.tenKiHoc,
                            urlDiem
                        )
                    })
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