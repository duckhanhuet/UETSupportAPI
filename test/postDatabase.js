var express = require('express');
var bodyParser = require('body-parser');
User = require('../models/User');
SinhVien = require('../models/SinhVien');
Khoa = require('../models/Khoa');
PhongBan = require('../models/PhongBan');
GiangVien = require('../models/GiangVien');
LopMonHoc = require('../models/LopMonHoc');
KiHoc = require('../models/KiHoc');
LopChinh = require('../models/LopChinh');
LoaiThongBao = require('../models/LoaiThongBao');
MucDoThongBao= require('../models/MucDoThongBao');
ThongBao = require('../models/ThongBao');
File     = require('../models/File');

var UserController = require('../controllers/UserController');
var SinhVienController = require('../controllers/SinhVienController');
var KhoaController = require('../controllers/KhoaController');
var PhongBanController = require('../controllers/PhongBanController');
var GiangVienController = require('../controllers/GiangVienController');
var LopChinhController = require('../controllers/LopChinhController');
var LopMonHocController = require('../controllers/LopMonHocController');
var KiHocController = require('../controllers/KiHocController');
var SubscribeController = require('../controllers/SubscribeController');
var LoaiThongBaoController = require('../controllers/LoaiThongBaoController');
var FileController  = require('../controllers/FileController');
var ThongBaoController        = require('../controllers/ThongBaoController');
var MucDoThongBaoController   = require('../controllers/MucDoThongBaoController');

var async = require('async');

//===========================================

if (typeof require !== 'undefined') XLSX = require('xlsx');
var workbookKhoa = XLSX.readFile('./filedatabase/khoa.xlsx');
var workbookPhongBan = XLSX.readFile('./filedatabase/phongban.xlsx');
var workbookKiHoc = XLSX.readFile('./filedatabase/kihoc.xlsx');
var workbookLopChinhQuy = XLSX.readFile('./filedatabase/lopchinhquy.xlsx');
var workbookLopMonHoc = XLSX.readFile('./filedatabase/lopmonhoc.xlsx');
var workbookGiangVien = XLSX.readFile('./filedatabase/giangvien.xlsx');
var workbookSinhVien = XLSX.readFile('./filedatabase/sinhvien.xlsx');
var workbookLoaiThongBao = XLSX.readFile('./filedatabase/loaithongbao.xlsx');
var workbookMucDoThongBao= XLSX.readFile('./filedatabase/mucdothongbao.xlsx');
var workbookThongBao     = XLSX.readFile('./filedatabase/thongbao.xlsx');

/* DO SOMETHING WITH workbook HERE */

//===========================================
//extracts the value stored in cell A1 from the first worksheet

//var first_sheet_name = workbookKhoa.SheetNames[0];
//var address_of_cell = 'A1';
/* Get worksheet */
// var worksheetKhoa = workbookKhoa.Sheets[first_sheet_name];
// var worksheetPhongBan = workbookPhongBan.Sheets[first_sheet_name];
// var worksheetKiHoc = workbookKiHoc.Sheets[first_sheet_name];
// var worksheetLopChinhQuy = workbookLopChinhQuy.Sheets[first_sheet_name];
// var worksheetLopMonHoc = workbookLopMonHoc.Sheets[first_sheet_name];
// var worksheetGiangVien = workbookGiangVien.Sheets[first_sheet_name];
// var worksheetSinhVien = workbookSinhVien.Sheets[first_sheet_name];

//==========================================
//get sheetNams from earch exels

var sheet_name_list_khoa = workbookKhoa.SheetNames;
var sheet_name_list_phong_ban = workbookPhongBan.SheetNames;
var sheet_name_list_ki_hoc = workbookKiHoc.SheetNames;
var sheet_name_list_lop_chinh_quy = workbookLopChinhQuy.SheetNames;
var sheet_name_list_lop_mon_hoc = workbookLopMonHoc.SheetNames;
var sheet_name_list_giang_vien = workbookGiangVien.SheetNames;
var sheet_name_list_sinh_vien = workbookSinhVien.SheetNames;
var sheet_name_list_loai_thong_bao = workbookSinhVien.SheetNames;
var sheet_name_list_thong_bao= workbookThongBao.SheetNames;
var sheet_name_list_muc_do_thong_bao= workbookMucDoThongBao.SheetNames;
async.series([
    function createKhoa(callback) {
        sheet_name_list_khoa.forEach(function (y) {
            var worksheet = workbookKhoa.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            console.log(result);

            for (var i = 0; i < result.length; i++) {
                var khoa = result[i];
                //=====================
                //create users
                var user = new User({
                    _id: khoa._id,
                    password: khoa.password,
                    role: 'Khoa'
                })
                //=====================
                //save user
                user.save(function (err) {
                    if (err) {
                        //console.log('Users Khoa existed');
                    }
                })

                //======================
                //create info khoa
                var info = {
                    _id: khoa._id,
                    tenKhoa: khoa.tenKhoa
                }
                //======================
                //save info khoa
                KhoaController.create(info, function (err, info) {
                    if (err) {
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
        callback(null, 'Create khoa thanh cong');
    },
    function createPhongBan(callback) {
        sheet_name_list_phong_ban.forEach(function (y) {

            var worksheet = workbookPhongBan.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            //console.log(result);

            for (var i = 0; i < result.length; i++) {
                var phongban = result[i];
                console.log(phongban);
                //=====================
                //create users
                var user = new User({
                    _id: phongban._id,
                    password: phongban.password,
                    role: 'PhongBan'
                })
                //=====================
                //save user
                user.save(function (err) {
                    if (err) {
                        //console.log('Users PhongBan existed');
                    }
                })

                //======================
                //create info PhongBan
                var info = {
                    _id: phongban._id,
                    tenPhongBan: phongban.tenPhongBan
                };
                //======================
                //save info PB
                PhongBanController.create(info, function (err, info) {
                    if (err) {
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
        callback(null, 'Create Phong ban thanh cong');
    },
    function createKiHoc(callback) {
        sheet_name_list_ki_hoc.forEach(function (y) {
            var worksheet = workbookKiHoc.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            //console.log(result);

            for (var i = 0; i < result.length; i++) {
                var kihoc = result[i];
                console.log(kihoc);
                //=====================
                //=====================
                //create info Ki hoc
                var info = {
                    _id: kihoc._id,
                    tenKiHoc: kihoc.tenKiHoc
                };
                //======================
                //save info PB
                KiHocController.create(info, function (err, info) {
                    if (err) {
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
        callback(null, 'Create ki hoc thanh cong');
    },
    function createLopChinhQuy(callback) {
        sheet_name_list_lop_chinh_quy.forEach(function (y) {
            var worksheet = workbookLopChinhQuy.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            //console.log(result);

            for (var i = 0; i < result.length; i++) {
                var lopchinhquy = result[i];
                console.log(lopchinhquy);
                //=====================
                //======================
                //create info Lop chinh quy
                var info = {
                    _id: lopchinhquy._id,
                    tenLopChinh: lopchinhquy.tenLopChinh,
                    idKhoa: lopchinhquy.idKhoa

                };
                //======================
                //save info PB
                LopChinhController.create(info, function (err, info) {
                    if (err) {
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
        callback(null, 'Create Lop Chinh Quy thanh cong');
    },
    function createGiangVien(callback) {
        sheet_name_list_giang_vien.forEach(function (y) {
            var worksheet = workbookGiangVien.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            console.log(result);

            for (var i = 0; i < result.length; i++) {
                var giangvien = result[i];

                //=====================
                //create users
                var user = new User({
                    _id: giangvien._id,
                    password: giangvien.password,
                    role: 'GiangVien'
                })
                //=====================
                //save user
                user.save(function (err) {
                    if (err) {
                        //console.log('Users PhongBan existed');
                    }
                })

                //======================
                //create info giangvien
                var info = {
                    _id: giangvien._id,
                    tenGiangVien: giangvien.tenGiangVien,
                    idKhoa: giangvien.idKhoa,
                    idKhoa: giangvien.idKhoa,
                };
                //======================
                //save info PB
                GiangVienController.create(info, function (err, info) {
                    if (err) {
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
        callback(null, 'Create Giang vien thanh cong')
    }
    ,
    function createLopMonHoc(callback) {
        sheet_name_list_lop_mon_hoc.forEach(function (y) {
            var worksheet = workbookLopMonHoc.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            console.log(result);

            for (var i = 0; i < result.length; i++) {
                var lopmonhoc = result[i];
                //======================
                //create info Lop mon hoc
                var info = {
                    _id: lopmonhoc._id,
                    tenLopMonHoc: lopmonhoc.tenLopMonHoc,
                    idGiangVien: lopmonhoc.idGiangVien
                };
                //======================
                //save info Lop Mn hoc
                LopMonHocController.create(info, function (err, info) {
                    if (err) {
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
        callback(null, 'Create Lop Mon hoc thanh cong');
    },

    function createLoaiThongBao(callback) {
        sheet_name_list_loai_thong_bao.forEach(function (y) {
            var worksheet = workbookLoaiThongBao.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            console.log(result);
            for (var i=0;i<result.length;i++){
                var loaithongbao= result[i];
                var info={
                    _id: Number(loaithongbao._id),
                    tenLoaiThongBao: loaithongbao.tenLoaiThongBao
                }
                LoaiThongBaoController.create(info,function (err, info) {
                    if (err){
                    }
                })
            }
        })
        callback(null,'Create Loai Thong Bao Thanh Cong');
    }
    ,function createMucDoThongBao(callback) {
        sheet_name_list_muc_do_thong_bao.forEach(function (y) {
            var worksheet = workbookMucDoThongBao.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            console.log(result);
            for (var i=0;i<result.length;i++){
                var mucdothongbao= result[i];
                var info={
                    _id: Number(mucdothongbao._id),
                    tenMucDoThongBao: mucdothongbao.tenMucDoThongBao
                }
                MucDoThongBaoController.create(info,function (err, info) {
                    if (err){
                    }
                })
            }
        })
        callback(null,'Create mucdothongbao thanh cong')
    },
    function createThongBao(callback) {
        sheet_name_list_thong_bao.forEach(function (y) {
            var worksheet = workbookThongBao.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            console.log(result);
            for (var i=0;i<result.length;i++){
                var thongbao= result[i];
                var infoFile ={
                    tenFile: thongbao.tenFile,
                    link: thongbao.linkFile
                }
                var infoThongBao={
                    tieuDe: thongbao.tieuDe,
                    idLoaiThongBao: thongbao.idLoaiThongBao,
                    idMucDoThongBao:thongbao.idMucDoThongBao,
                    noiDung: thongbao.noiDung,
                    idUser:thongbao.idUser,
                }
                FileController.create(infoFile,function (err, file) {
                    if(err){
                        console.log(err);
                    }
                    infoThongBao.idFile= file._id;
                    ThongBaoController.create(infoThongBao,function (err, thongbao) {
                        if (err){
                            console.log('create thongbao fail');
                        }
                    })
                })
            }
        })
        callback(null,'Create file va mucdothongbao thanh cong')
     },
    //==========================================================
    //create sinh vien va Subscribe
    function CreateSinhVien(callback) {
        sheet_name_list_sinh_vien.forEach(function (y) {
            var worksheet = workbookSinhVien.Sheets[y];
            var result = XLSX.utils.sheet_to_json(worksheet);
            console.log(result);

            for (var i = 0; i < result.length; i++) {
                var sinhvien = result[i];

                //=====================
                //create users
                var user = new User({
                    _id: sinhvien._id,
                    password: sinhvien.password,
                })
                // UserController.create(user,function (err,user) {
                //     if (err){
                //
                //     }
                //     console.log(user);
                // })
                //=====================
                //save user
                // user.save(function (err) {
                //     if (err) {
                //         //console.log('Users PhongBan existed');
                //     }
                // })
                //======================
                //create info sinhvien
                var info = {
                    _id: sinhvien._id,
                    tenSinhVien: sinhvien.tenSinhVien,
                    idLopChinh: sinhvien.idLopChinh,
                    idLopMonHoc: sinhvien.idLopMonHoc,
                    tokenFirebase: sinhvien.tokenFirebase
                };
                var infoSubscribe={
                    _id: sinhvien._id,
                }
                //======================
                //save info PB
                SinhVienController.create(info, function (err, info) {
                    if (err) {
                        //console.log('exist id');
                    }
                    //console.log(info);
                });
                SubscribeController.create(infoSubscribe,function (err, info) {
                    if (err){

                    }
                })
            }
        })
        callback(null, 'Create Sinh vien thanh cong')
    }
], function (err, result) {
    if (err) {
        console.error(err)
    }
    console.log(result);
});
