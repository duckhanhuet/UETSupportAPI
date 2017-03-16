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
var async = require('async');
//==========================================
var fs = require('fs');
var multipart  = require('connect-multiparty');
var multipartMiddleware = multipart();
var cors = require('cors');
var storage_file = require('../Utils/storage_file');
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

// router.post('/guithongbao',auth.reqIsAuthenticate,auth.reqIsGiangVien,multipartMiddleware,cors(),function (req, res) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     var tieuDe = req.body.tieuDe;
//     var noiDung = req.body.noiDung;
//     var idMucDoThongBao = req.body.idMucDoThongBao;
//     var idLoaiThongBao = req.body.idLoaiThongBao;
//     var kind =1;
//     var file;
//     var hasfile;
//     if(req.files)
//     {
//         console.log('co file');
//         hasfile=1;
//         file= req.files.file_0;
//     }else {
//         console.log('khong co file');
//         hasfile=0;
//     }
//     //var file = req.files.file;
//     //===============================================
//     //===============================================
//     var message;
//     //==============================================
//     var sender = new gcm.Sender(config.serverKey);
//     var registerToken = [];
//
//     //===============================================
//
//     async.waterfall([
//         function checkValidate(callback) {
//             if(!tieuDe||!noiDung||!idLoaiThongBao){
//                 var object={
//                     success:false,
//                     message: 'Invalide tieu de va noi dung thong bao'
//                 }
//                 callback('err',null);
//             }else {
//                 callback(null,'Success');
//             }
//         },
//         function checkFile(ketqua,callback) {
//             if (file){
//                 // Tên file
//                 var originalFilename = file.name;
//                 // File type
//                 var fileType         = file.type.split('/')[1];
//                 // File size
//                 var fileSize         = file.size;
//                 //pipe save file
//                 var pathUpload       = __dirname + '/files/' + originalFilename;
//                 var objectFile ={
//                     tenFile: originalFilename,
//                     link: pathUpload
//                 }
//                 FileController.create(objectFile,function (err, filess) {
//                     if (err){
//                         callback(err,null);
//                     }
//                     console.log('Create file success');
//                     //============================
//                     //create thong bao
//                     var infoThongBao={
//                         tieuDe: tieuDe,
//                         noiDung: noiDung,
//                         idFile: filess._id,
//                         idLoaiThongBao: idLoaiThongBao,
//                         idMucDoThongBao: idMucDoThongBao
//                     }
//                     ThongBaoController.create(infoThongBao,function (err, tb) {
//                         if (err){
//                             callback(err,null);
//                         }
//                         //console.log(tb);
//                         callback(null,tb);
//                     })
//                     //============================
//
//                 })
//             }
//             else{
//                 var infoThongBao={
//                     tieuDe: tieuDe,
//                     noiDung: noiDung,
//                     idLoaiThongBao: idLoaiThongBao,
//                     idMucDoThongBao: idMucDoThongBao
//                 }
//                 ThongBaoController.create(infoThongBao,function (err, tb) {
//                     if (err){
//                         callback(err,null);
//                     }
//                     console.log(tb);
//                     callback(null,tb);
//                 })
//             }
//         },
//         function find(result,callback) {
//             Subscribe.find({idLoaiThongBao:{$in:[Number(idLoaiThongBao)]}}).populate('_id').exec(function (err, subscribes) {
//                 if (err){
//                     callback(err,null)
//                 }else {
//                     var object ={
//                         thongbao: result,
//                         subscribes: subscribes
//                     }
//                     callback(null,object);
//                     //console.log(subscribes)
//                 }
//             })
//         },
//         function (result, callback) {
//             var url = '/thongbao/' + result.thongbao._id;
//             message = new gcm.Message({
//                 data: dataNoti.createData(tieuDe,noiDung,url,idMucDoThongBao,idLoaiThongBao,kind,hasfile)
//             });
//             console.log(dataNoti.createData(tieuDe,noiDung,url,idMucDoThongBao,idLoaiThongBao,kind,hasfile));
//             var subscribes= result.subscribes;
//             subscribes.forEach(function (subscribe) {
//                 registerToken.push(subscribe._id.tokenFirebase);
//             })
//             //console.log(registerToken);
//             sender.send(message, registerToken, function (err, response) {
//                 console.log(response)
//                 if (err) {
//                     callback(err, null)
//                 }
//                 else {
//                     callback(null, "Success")
//                 }
//             })
//         }
//
//     ],function (err, result) {
//         if (err){
//             res.json({
//                 success:false,
//                 err:err.message
//             })
//         }
//         res.json({
//             success: true,
//             message: result
//         })
//     })
//
// })

//============================================================================

router.post('/guithongbao/diem',auth.reqIsAuthenticate,auth.reqIsGiangVien,function (req, res, next) {
    var objectDiems = JSON.parse(req.body.list);
    var mucdothongbao=1;
    var loaithongbao=1;
    var kind=2;
    var hasfile=1;
    //console.log(objectDiems);
    //===============================================
    async.waterfall([
        function createDiem(callback) {
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
                        callback(err,null);
                    }
                })
            })
            callback(null,'Success');
        }
        ,function findsubscribes(kq,callback) {
            Subscribe.find({idLoaiThongBao:{$in:[1]}}).populate('_id').exec(function (err, subscribes) {
                if (err) {
                    callback(err, null)
                } else {
                    console.log(subscribes);
                    callback(null, subscribes)
                }
            })
        },
        function sendThongBao(results, callback) {
            var arrayMSV = [];
            var sender = gcm.Sender(config.serverKey);
            results.forEach(function (sv) {
                arrayMSV.push(sv._id._id);
            });
            //console.log(arrayMSV);
            objectDiems.forEach(function (objectDiem) {
                if (arrayMSV.indexOf(objectDiem.MSV) > -1) {
                    //console.log(objectDiem.MSV);
                    var urlDiem = '/diemmonhoc/lop/'+ objectDiem.tenLopMonHoc;
                    var message= new gcm.Message({
                        data: dataNoti.createData(
                            'diem thi',
                            'da co diem thi mon '+objectDiem.tenLopMonHoc,
                            urlDiem,
                            mucdothongbao,
                            loaithongbao,
                            kind,
                            hasfile
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
                            console.log(response);
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


//====================================================
//Giang vien gui thong bao ts lop mon hoc hoac sinh vien

router.post('/guithongbao',auth.reqIsAuthenticate,auth.reqIsGiangVien,multipartMiddleware,function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
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
    var kindSender='GiangVien';
    var files=[];//file post from web app
    var hasfile; // hasfile=0 : khong co file //hasfile=1 : co file

    var category = req.body.categoryReceiver;
    var idReceiver = req.body.idReceiver;
    // kind=1 tuc la loai thong bao (kind=2 la loai diem,..)
    var kind =1;
    var hasfile;
    //kiem tra xem co file dinh kem hay khong
    if(req.body.file_length!=0)
    {
        //check files la array or object
        if (req.files.files instanceof Array){
            files= req.files.files;
        }else {
            files.push(req.files.files)
            // console.log('thogn tin files')
            // console.log(files)
        }
        hasfile=1;
    }else {
        hasfile=0;
    }
    //==============================================
    var message;
    //==============================================
    var sender = new gcm.Sender(config.serverKey);
    var registerToken = [];
    //==============================================
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
            if (files){
                var idFiles=[];
                //save file
                storage_file.saveFile(files,idFiles);
                //function luu thong bao voi idFile la mang idFiles tim duoc o tren
                var functionTwo = function () {
                    //console.log(idFiles);
                    //create thong bao
                    var infoThongBao={
                        tieuDe: tieuDe, noiDung: noiDung, idFile: idFiles,
                        idLoaiThongBao: idLoaiThongBao, idMucDoThongBao: idMucDoThongBao,
                        idSender:idSender, idReceiver:idReceiver,kindIdSender:kindSender,kindIdReceiver:category
                    }
                    //luu thong bao vua gui
                    ThongBaoController.create(infoThongBao,function (err, tb) {
                        if (err){
                            console.log('err:'+err)
                            callback(err,null);
                        }
                        console.log("tb",tb);
                        callback(null,tb);
                    })
                }
                //setTime for functionTwo proccess after 1s (wait push idFile done)
                setTimeout(functionTwo,1000);
                //============================
            }
            else{
                //neu khong co file dinh kem
                var infoThongBao={
                    tieuDe: tieuDe, noiDung: noiDung,
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
            var listSubs =[];

            //==========================================================================
            //khi nha truong gui thong bao cho tung sinh vien thi thong bao se mang tinh bat buoc
            if (category=='SinhVien'){
                idReceiver = req.body.idReceiver.split(',');
                SubscribeController.find({_id: {$in: idReceiver}},function (err, subscribes) {
                    if (err){
                        callback(err,null)
                    }else {
                        var object ={
                            thongbao: result,
                            subscribes: subscribes
                        }
                        callback(null,object);
                    }
                })
            }else {
                SubscribeController.find({idLoaiThongBao:{$in:[Number(idLoaiThongBao)]}},function (err,subscribes) {
                    if (err){
                        callback(err,null);
                    }else{
                        if (category=='LopChinh'){
                            subscribes.forEach(function (subscribe) {
                                if (subscribe._id.idLopChinh._id== idReceiver){
                                    listSubs.push(subscribe)
                                }
                            })
                            var object ={
                                thongbao: result,
                                subscribes: listSubs
                            }
                            callback(null,object)
                        }
                        else if (category=='LopMonHoc'){
                            subscribes.forEach(function (subscribe) {
                                var ls=[];
                                console.log('lop mon hoc')
                                console.log(subscribe._id.idLopMonHoc);
                                if (subscribe._id.idLopMonHoc.indexOf(idReceiver)>-1){
                                    listSubs.push(subscribe)
                                }
                            })
                            var object ={
                                thongbao: result,
                                subscribes: listSubs
                            }
                            callback(null,object)
                        }
                    }
                })
            }
            //===================================================================
        },
        function (result, callback) {
            //url de lay thong bao ve
            var url = '/thongbao/' + result.thongbao._id;
            //gui tin nhan ts app
            message = new gcm.Message({
                data: dataNoti.createData(tieuDe,noiDung,url,idMucDoThongBao,idLoaiThongBao,kind,hasfile,idSender)
            });
            console.log('Thong tin gui di bao gom:');
            console.log(dataNoti.createData(tieuDe,noiDung,url,idMucDoThongBao,idLoaiThongBao,kind,hasfile,idSender));
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
//=====================================================
//====================================================
router.get('/list/thongbaodagui',auth.reqIsAuthenticate,function (req, res, next) {
    // GiangVienController.findById(req.user._id,function (err, giangvien) {
    //     if (err){
    //         res.json({
    //             success: false
    //         })
    //     }
    //     res.json(giangvien.idThongBao);
    //
    // })
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

//========================================================

module.exports = router;