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
    var idReceiver='';

    var files;
    var hasfile; // hasfile=0 : khong co file //hasfile=1 : co file
    if(req.body.categoryReceiver=='khoa')
        idReceiver='toanKhoa'
    if(req.body.categoryReceiver=='lop')
        idReceiver=req.body.receiverLopchinh;
    else if(req.body.categoryReceiver=='lopmonhoc');
    idReceiver=req.body.receiverLopmonhoc;
    // kind=1 tuc la loai thong bao (kind=2 la loai diem,..)
    var kind =1;
    var hasfile;

    //kiem tra xem co file dinh kem hay khong
    if(req.body.file_length!=0)
    {
        files= req.files.files;
        //console.log(files);
        hasfile=1;
    }else {
        //console.log('khong co file');
        hasfile=0;
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
            //neu co file dinh kem
            if (files){
                var idFiles=[];
                //function luu file vao database va callback lai idFiles
                saveFile(files,idFiles);

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
            Khoa.findByIdAndUpdate(
                req.user._id,
                {$push: {"idThongBao": result.thongbao._id}},
                {safe: true, upsert: true},
                function(err, model) {
                    console.log(err);
                }
            );

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
//function savefile and callback idFiles
function saveFile(files, idFiles) {
    files.forEach(function (file) {
        // Tên file
        var originalFilename = file.name;
        // File type
        var fileType         = file.type.split('/')[1];
        // File size
        var fileSize         = file.size;
        //pipe save file
        var pathUpload       = __dirname +'/../files/' + originalFilename;
        console.log('path upload la:'+pathUpload)
        //doc file va luu file vao trong /files/
        fs.readFile(file.path, function(err, data) {
            if(!err) {
                fs.writeFile(pathUpload, data, function() {
                    return;
                });
            }
        });

        //tra ve object file de luu vao database
        var objectFile ={
            tenFile: originalFilename,
            link: pathUpload
        }
        //luu file vao database
        FileController.create(objectFile,function (err, filess) {
            if (err){
                callback(err,null);
            }
            idFiles.push(filess._id);
            console.log('Create file success');
        })
    })
}
//========================================================

router.get('/list/thongbaodagui',auth.reqIsAuthenticate,function (req, res, next) {
    KhoaController.findById(req.user._id,function (err, khoa) {
        if (err){
            res.json({
                success: false
            })
        }
        res.json(khoa.idThongBao);

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