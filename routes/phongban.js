var express = require('express');
var router = express.Router();
var PhongBanController = require('../controllers/PhongBanController');
var SinhVienController = require('../controllers/SinhVienController');
var SubscribeController = require('../controllers/SubscribeController');
var DiemMonHocController = require('../controllers/DiemMonHocController');
var ThongBaoController = require('../controllers/ThongBaoController');
var FileController=require('../controllers/FileController');
var DiemMonHoc = require('../models/DiemMonHoc');
var Subscribe   = require('../models/Subscribe');
var auth = require('../policies/auth');
var typeNoti = require('../policies/sinhvien');
//==========================================
var fs = require('fs');
var multipart  = require('connect-multiparty');
var multipartMiddleware = multipart();
var cors = require('cors')
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
router.post('/guithongbao',auth.reqIsAuthenticate,auth.reqIsPhongBan,multipartMiddleware,cors(),function (req, res) {
    console.log('req',req.body)
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
        console.log('co file');
        //console.log(req.files)
        //console.log(req.files.file);
        files= req.files.files;
        console.log(files);
        hasfile=1;
    }else {
        console.log('khong co file');
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
            Subscribe.find({idLoaiThongBao:{$in:[Number(idLoaiThongBao)]}}).populate('_id').exec(function (err, subscribes) {
                if (err){
                    callback(err,null)
                }else {
                    //tra ve object sinh vien muon nhan thong bao va noi dung cua thong bao
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
            //url de lay thong bao ve
            var url = '/thongbao/' + result.thongbao._id;
            //gui tin nhan ts app
            message = new gcm.Message({
                data: dataNoti.createData(tieuDe,noiDung,url,idMucDoThongBao,idLoaiThongBao,kind,hasfile)
            });
            console.log(dataNoti.createData(tieuDe,noiDung,url,idMucDoThongBao,idLoaiThongBao,kind,hasfile));
            var subscribes= result.subscribes;
            subscribes.forEach(function (subscribe) {
                registerToken.push(subscribe._id.tokenFirebase);
            })
            //console.log(registerToken);
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
        console.log("this is end");
        if (err){
            // res.setHeader('Access-Control-Allow-Origin', '*');
            res.json({
                success:false,
                err:err.message
            })
        }else {
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
            //lay ra thong tin diem cua tung sinh vien
            objectDiems.forEach(function (object) {
                var info = {
                    idSinhVien: object.MSV,
                    idLopMonHoc: object.tenLopMonHoc,
                    diemThanhPhan: Number(object.diemThanhPhan),
                    diemCuoiKy: Number(object.diemCuoiKi)
                }
                //check xem sinh vien trong lop mon hoc do da co trong DiemMonHoc hay chua
                //neu chua co thi insert hoac neu co roi thi update lai
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
                    //console.log(subscribes);
                    callback(null, subscribes)
                }
            })
        },
        //gui thogn bao cho tung sinh vien
        function sendThongBao(results, callback) {
            var arrayMSV = [];
            var sender = gcm.Sender(config.serverKey);
            //get array ma sinh vien
            results.forEach(function (sv) {
                arrayMSV.push(sv._id._id);
            });
            //console.log(arrayMSV);
            //tim cac sinh vien co trong danh sach diem thi de gui notification
            objectDiems.forEach(function (objectDiem) {
                if (arrayMSV.indexOf(objectDiem.MSV) > -1) {
                    console.log('sinh vien co la:'+objectDiem.MSV);
                    var urlDiem = '/diemmonhoc/lop/'+ objectDiem.tenLopMonHoc;
                    //message gui ts app
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
                    console.log(dataNoti.createData(
                        'diem thi',
                        'da co diem thi mon '+objectDiem.tenLopMonHoc,
                        urlDiem,
                        mucdothongbao,
                        loaithongbao,
                        kind,
                        hasfile
                    ))
                    //gui cho tung sinh vien mot
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
//===============================================


//========================================================
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
        //luu file vao trong dir files
        fs.readFile(file.path, function(err, data) {
            if(!err) {
                fs.writeFile(pathUpload, data, function() {
                    return;
                });
            }
        });
        var objectFile ={
            tenFile: originalFilename,
            link: pathUpload
        }
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

router.post('/postdatabase', auth.reqIsAuthenticate, auth.reqIsPhongBan, function (req, res) {
    require('../test/postDatabase');
    res.json({
        success: true,
        message: 'ok man!!!!'
    })
})
module.exports = router;