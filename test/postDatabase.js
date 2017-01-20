var express = require('express');
var bodyParser = require('body-parser');
User = require('../models/User');
SinhVien = require('../models/SinhVien');
Khoa=require('../models/Khoa');
PhongBan= require('../models/PhongBan');
GiangVien= require('../models/GiangVien');
LopMonHoc= require('../models/LopMonHoc');
KiHoc    = require('../models/KiHoc');
LopChinh = require('../models/LopChinh');

var UserController = require('../controllers/UserController');
var SinhVienController = require('../controllers/SinhVienController');
var KhoaController = require('../controllers/KhoaController');
var PhongBanController = require('../controllers/PhongBanController');
var GiangVienController = require('../controllers/GiangVienController');
var LopChinhController = require('../controllers/LopChinhController');
var LopMonHocController= require('../controllers/LopMonHocController');
var KiHocController    = require('../controllers/KiHocController');

var async= require('async');

//===========================================

if(typeof require !== 'undefined') XLSX = require('xlsx');
var workbookKhoa = XLSX.readFile('./filedatabase/khoa.xlsx');
var workbookPhongBan = XLSX.readFile('./filedatabase/phongban.xlsx');
var workbookKiHoc = XLSX.readFile('./filedatabase/kihoc.xlsx');
var workbookLopChinhQuy = XLSX.readFile('./filedatabase/lopchinhquy.xlsx');
var workbookLopMonHoc = XLSX.readFile('./filedatabase/lopmonhoc.xlsx');
var workbookGiangVien = XLSX.readFile('./filedatabase/giangvien.xlsx');
var workbookSinhVien = XLSX.readFile('./filedatabase/sinhvien.xlsx');
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

async.series([
    function createKhoa(callback) {
        sheet_name_list_khoa.forEach(function (y) {
            var worksheet= workbookKhoa.Sheets[y];
            var result= XLSX.utils.sheet_to_json(worksheet);
            console.log(result);

            for (var i=0;i<result.length;i++){
                var khoa= result[i];
                //=====================
                //create users
                var user= new User({
                    _id: khoa._id,
                    password: khoa.password,
                    role: 'Khoa'
                })
                //=====================
                //save user
                user.save(function (err) {
                    if (err){
                        //console.log('Users Khoa existed');
                    }
                })

                //======================
                //create info khoa
                var info={
                    _id:khoa._id,
                    tenKhoa: khoa.tenKhoa
                }
                //======================
                //save info khoa
                KhoaController.create(info,function (err, info) {
                    if (err){
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
        callback(null,'Create khoa thanh cong');
    },
    function createPhongBan(callback) {
        sheet_name_list_phong_ban.forEach(function (y) {
            var worksheet= workbookPhongBan.Sheets[y];
            var result= XLSX.utils.sheet_to_json(worksheet);
            //console.log(result);

            for (var i=0;i<result.length;i++){
                var phongban= result[i];
                console.log(phongban);
                //=====================
                //create users
                var user= new User({
                    _id: phongban._id,
                    password: phongban.password,
                    role: 'PhongBan'
                })
                //=====================
                //save user
                user.save(function (err) {
                    if (err){
                        //console.log('Users PhongBan existed');
                    }
                })

                //======================
                //create info PhongBan
                var info={
                    _id:phongban._id,
                    tenPhongBan: phongban.tenPhongBan
                };
                //======================
                //save info PB
                PhongBanController.create(info,function (err, info) {
                    if (err){
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
        callback(null,'Create Phong ban thanh cong');
    },
    function createKiHoc(callback) {
        sheet_name_list_ki_hoc.forEach(function (y) {
            var worksheet= workbookKiHoc.Sheets[y];
            var result= XLSX.utils.sheet_to_json(worksheet);
            //console.log(result);

            for (var i=0;i<result.length;i++){
                var kihoc= result[i];
                console.log(kihoc);
                //=====================
                //=====================
                //create info Ki hoc
                var info={
                    _id:kihoc._id,
                    tenKiHoc: kihoc.tenKiHoc
                };
                //======================
                //save info PB
                KiHocController.create(info,function (err, info) {
                    if (err){
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
        callback(null,'Create ki hoc thanh cong');
    },
    function createLopChinhQuy(callback) {
        sheet_name_list_lop_chinh_quy.forEach(function (y) {
            var worksheet= workbookLopChinhQuy.Sheets[y];
            var result= XLSX.utils.sheet_to_json(worksheet);
            //console.log(result);

            for (var i=0;i<result.length;i++){
                var lopchinhquy= result[i];
                console.log(lopchinhquy);
                //=====================
                //======================
                //create info Lop chinh quy
                var info={
                    _id:lopchinhquy._id,
                    tenLopChinh: lopchinhquy.tenLopChinh,
                    idKhoa:lopchinhquy.idKhoa

                };
                //======================
                //save info PB
                LopChinhController.create(info,function (err, info) {
                    if (err){
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
        callback(null,'Create Lop Chinh Quy thanh cong');
    },
    function createGiangVien(callback) {
        sheet_name_list_giang_vien.forEach(function (y) {
            var worksheet= workbookGiangVien.Sheets[y];
            var result= XLSX.utils.sheet_to_json(worksheet);
            console.log(result);

            for (var i=0;i<result.length;i++){
                var giangvien= result[i];

                //=====================
                //create users
                var user= new User({
                    _id: giangvien._id,
                    password: giangvien.password,
                    role: 'GiangVien'
                })
                //=====================
                //save user
                user.save(function (err) {
                    if (err){
                        //console.log('Users PhongBan existed');
                    }
                })

                //======================
                //create info giangvien
                var info={
                    _id:giangvien._id,
                    tenGiangVien: giangvien.tenGiangVien,
                    idKhoa: giangvien.idKhoa,
                    idKhoa: giangvien.idKhoa,
                };
                //======================
                //save info PB
                GiangVienController.create(info,function (err, info) {
                    if (err){
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
        callback(null,'Create Giang vien thanh cong')
    }
    ,
    function createLopMonHoc(callback) {
        sheet_name_list_lop_mon_hoc.forEach(function (y) {
            var worksheet= workbookLopMonHoc.Sheets[y];
            var result= XLSX.utils.sheet_to_json(worksheet);
            console.log(result);

            for (var i=0;i<result.length;i++){
                var lopmonhoc= result[i];
                //======================
                //create info Lop mon hoc
                var info={
                    _id:lopmonhoc._id,
                    tenLopMonHoc: lopmonhoc.tenLopMonHoc,
                    idGiangVien:lopmonhoc.idGiangVien
                };
                //======================
                //save info Lop Mn hoc
                LopMonHocController.create(info,function (err, info) {
                    if (err){
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
        callback(null,'Create Lop Mon hoc thanh cong');
    },
    function CreateSinhVien(callback) {
        sheet_name_list_sinh_vien.forEach(function (y) {
            var worksheet= workbookSinhVien.Sheets[y];
            var result= XLSX.utils.sheet_to_json(worksheet);
            console.log(result);

            for (var i=0;i<result.length;i++){
                var sinhvien= result[i];

                //=====================
                //create users
                var user= new User({
                    _id: sinhvien._id,
                    password: sinhvien.password,
                })
                //=====================
                //save user
                user.save(function (err) {
                    if (err){
                        //console.log('Users PhongBan existed');
                    }
                })

                //======================
                //create info sinhvien
                var info={
                    _id:sinhvien._id,
                    tenSinhVien: sinhvien.tenSinhVien,
                    idLopChinh:sinhvien.idLopChinh,
                    idLopMonHoc: sinhvien.idLopMonHoc
                };
                //======================
                //save info PB
                SinhVienController.create(info,function (err, info) {
                    if (err){
                        //console.log('exist id');
                    }
                    //console.log(info);
                })
            }
        })
        callback(null,'Create Sinh vien thanh cong')
    }
],function (err, result) {
    if (err){
        console.error(err)
    }
    console.log(result);
})
