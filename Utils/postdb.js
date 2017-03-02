var express = require('express');
var bodyParser = require('body-parser');

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

//each post
var postpban = require('../db_post/postPhongban');
var postkhoa = require('../db_post/postKhoa')
var postkihoc= require('../db_post/postKiHoc')
var postlopchinh = require('../db_post/postLopChinhQuy');
var postgvien = require('../db_post/postGiangVien')
var postlmhoc = require('../db_post/postLopMonHoc')
var postloaitbao = require('../db_post/postLoaiThongBao')
var postmucdotbao= require('../db_post/postMucDoThongBao')
var postsvien   = require('../db_post/postSinhVien')
//save to database
async.series([
    function createphongban(callback) {
        postpban.create(sheet_name_list_phong_ban,workbookPhongBan,XLSX)
        callback(null,'create phong ban success')
    },
    function createkhoa(callback) {
        postkhoa.create(sheet_name_list_khoa,workbookKhoa,XLSX)
        callback(null,'create khoa success')
    },
    function createkihoc(callback) {
        postkihoc.create(sheet_name_list_ki_hoc,workbookKiHoc,XLSX);
        callback(null,'create kihoc success')
    },
    function createlopchinh(callback) {
        postlopchinh.create(sheet_name_list_lop_chinh_quy,workbookLopChinhQuy,XLSX)
        callback(null,'create lop chinh quy success')
    },
    function creategvien(callback) {
        postgvien.create(sheet_name_list_giang_vien,workbookGiangVien,XLSX)
        callback(null,'create giang vien success')
    },
    function createlpmonhoc(callback) {
        postlmhoc.create(sheet_name_list_lop_mon_hoc,workbookLopMonHoc,XLSX)
        callback(null,'create lop mon hoc success')
    },
    function createloaithongbao(callback) {
        postloaitbao.create(sheet_name_list_loai_thong_bao,workbookLoaiThongBao,XLSX)
        callback(null,'create loai thong bao success')
    },
    function createmucdothongbao(callback) {
        postmucdotbao.create(sheet_name_list_muc_do_thong_bao,workbookMucDoThongBao,XLSX)
        callback(null,'create list muc do thong bao success')
    },
    function (callback) {
        postsvien.create(sheet_name_list_sinh_vien,workbookSinhVien,XLSX)
        callback(null,'create sinh vien success')
    }
],function (err, response) {
    if (err){
        console.error(err);
    }
    console.log(response)
})
