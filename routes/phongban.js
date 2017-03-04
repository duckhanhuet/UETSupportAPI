var express = require('express');
var router = express.Router();
var PhongBanController = require('../controllers/PhongBanController');
var PhongBan           = require('../models/PhongBan');
var SinhVienController = require('../controllers/SinhVienController');
var SubscribeController = require('../controllers/SubscribeController');
var DiemMonHocController = require('../controllers/DiemMonHocController');
var ThongBaoController = require('../controllers/ThongBaoController');
var FileController=require('../controllers/FileController');
var DiemMonHoc = require('../models/DiemMonHoc');
var Subscribe   = require('../models/Subscribe');
var auth = require('../policies/auth');
var typeNoti = require('../policies/sinhvien');
var bodyParser = require('body-parser');
//==========================================
var fs = require('fs');
var multipart  = require('connect-multiparty');
var multipartMiddleware = multipart();
var cors = require('cors')
var storage_file = require('../Utils/storage_file');
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
    var idReceiver='';

    var files=[];
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
        //check files la array or object
        if (req.files.files instanceof Array){
            files= req.files.files;
        }else {
            files.push(req.files.files)
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
                        idSender:idSender, idReceiver:idReceiver,
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
            SubscribeController.find({idLoaiThongBao:{$in:[Number(idLoaiThongBao)]}},function (err,subscribes) {
                if (err){
                    callback(err,null)
                }else {
                    //tra ve object gom thong bao dang va list cac subcribes
                    var object ={
                        thongbao: result,
                        subscribes: subscribes
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
//=====================================================
//Gui thong bao diem
router.post('/guithongbao/diem',auth.reqIsAuthenticate,auth.reqIsPhongBan,function (req, res, next) {
    var objectDiems = JSON.parse(req.body.list);
    //console.log(objectDiems)
    var infoLopMonHoc= JSON.parse(req.body.infoLopMonHoc);
    var tenLopMonHoc = infoLopMonHoc.tenLopMonHoc;
    var tenGiangVien = infoLopMonHoc.tenGiangVien;
    var mucdothongbao=1;
    var loaithongbao=1;
    var kind=2;
    var hasfile=1;
    //console.log(objectDiems);
    //===============================================
    async.waterfall([
        function createDiem(callback) {
            //===============================================
            //lay ra thong tin diem cua tung sinh vien
            objectDiems.forEach(function (object) {
                var info = {
                    idSinhVien: object.MSV,
                    idLopMonHoc: object.tenLopMonHoc,
                    diemThanhPhan: Number(object.diemThanhPhan),
                    diemCuoiKy: Number(object.diemCuoiKi),
                    tongDiem: Number(object.tongDiem)
                }
                //check sv in lopmonhoc existed??
                //if havenot so insert else update
                DiemMonHoc.update(
                    {idLopMonHoc:info.idLopMonHoc,idSinhVien:info.idSinhVien},
                    {$setOnInsert: info},
                    {upsert: true},
                    function(err, numAffected) {
                        if (err)
                        {
                            callback(err,null);
                        }
                    }
                );
            })
            callback(null,'Success');
        }
        ,function findsubscribes(kq,callback) {
            //tim ra tat ca cac sinh vien co loai thong bao la 2: (thong bao la 2: diem mon hoc)
            Subscribe.find({idLoaiThongBao:{$in:[kind]}}).populate('_id').exec(function (err, subscribes) {
                if (err) {
                    callback(err, null)
                } else {
                    callback(null, subscribes)
                }
            })
        },
        //gui thogn bao cho tung sinh vien
        function sendThongBao(results, callback) {
            var urlDiem = '/diemmonhoc/lop/'+tenLopMonHoc;
            var arrayMSV = [];
            var registerToken=[];
            var sender = gcm.Sender(config.serverKey);
            //message gui ts app
            var message= new gcm.Message({
                data: dataNoti.createData(
                    'diem thi',
                    'da co diem thi mon '+tenLopMonHoc,
                    urlDiem, mucdothongbao, loaithongbao,
                    kind,hasfile
                )
            })
            console.log(dataNoti.createData(
                    'diem thi',
                    'da co diem thi mon '+tenLopMonHoc,
                    urlDiem, mucdothongbao, loaithongbao,
                    kind,hasfile
                ));

            //get array ma sinh vien
            results.forEach(function (sv) {
                arrayMSV.push(sv._id._id);
            });
            //tim cac sinh vien co trong danh sach diem thi de gui notification
            objectDiems.forEach(function (objectDiem) {
                if (arrayMSV.indexOf(objectDiem.MSV) > -1) {
                    console.log('sinh vien co la:'+objectDiem.MSV);
                    SinhVienController.findById(objectDiem.MSV, function (err, sv) {
                        if (err) {
                            console.log('find ' + objectDiem.MSV + ' fail');
                        }
                        registerToken.push(sv.tokenFirebase);
                    })
                }
            })
            var sendMessage =function () {
                console.log('list token firebase:'+registerToken)
                sender.send(message,registerToken, function (err, response) {
                    if (err) {
                        console.log('fail')
                    }
                    console.log(response);
                })
            }
            setTimeout(sendMessage,700);
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
router.get('/list/thongbaodagui',auth.reqIsAuthenticate,auth.reqIsPhongBan,function (req, res, next) {
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

module.exports = router;