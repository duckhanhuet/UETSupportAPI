var express = require('express');
var router = express.Router();
var GiangVienController = require('../controllers/GiangVienController');
var GiangVien           = require('../models/GiangVien');
var SinhVienController = require('../controllers/SinhVienController');
var SubscribeController = require('../controllers/SubscribeController');
var Subscribe   = require('../models/Subscribe');
var DiemMonHocController=  require('../controllers/DiemMonHocController');
var FileController      = require('../controllers/FileController');
var ThongBaoController = require('../controllers/ThongBaoController');
var FileController=require('../controllers/FileController')
var async = require('async');
//==========================================
var fs = require('fs');
var multipart  = require('connect-multiparty');
var multipartMiddleware = multipart();
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
});

router.post('/guithongbao',auth.reqIsAuthenticate,auth.reqIsGiangVien,multipartMiddleware,function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
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
                    ThongBaoController.create(infoThongBao,function (err, tb) {
                        console.log(tb);
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
                err:err
            })
        }
        res.json({
            success: true,
            message: result
        })
    })
    
})
//=============================================================
//Giang Vien gui thong bao toi lop Mon Hoc,  thong bao nay mang tinh quan trong=> gui cho toan bo sinh vien trong lop
// router.post('/guithongbao', auth.reqIsAuthenticate, auth.reqIsGiangVien, function (req, res, next) {
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
            Subscribe.find({idLoaiThongBao:{$in:[1]}}).populate('_id').exec(function (err, subscribes) {
                if (err) {
                    callback(err, null)
                } else {
                    callback(null, subscribes)
                }
            })
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