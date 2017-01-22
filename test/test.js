var async  = require('async');
User = require('../models/User');
SinhVien = require('../models/SinhVien');
GiangVien= require('../models/GiangVien');
LopMonHoc= require('../models/LopMonHoc');
File     = require('../models/File');
var LopChinh= require('../models/LopChinh');
var LopMonHocController= require('../models/LopMonHoc');
var FileController     = require('../controllers/FileController');
var Khoa= require('../models/Khoa');

//Creat 1 Sinh Vien
async.waterfall([
    function createLopMonHoc(callback) {
        var lopmonhoc= new LopMonHoc({tenLopMonHoc:'INT345'});
        lopmonhoc.save(function (err) {
            if(err){
                console.log('this lop mon hoc existed');
            }
        })
        callback(null,lopmonhoc);
    },
    function createSinhVien(lopmonhoc,callback) {
        var user= new User({username:'14020234',password:'14020234',idLopMonHoc:lopmonhoc._id});
        user.save(function (err) {
            if (err){
                console.log('this username existed');
            }
        });
        callback(null,user);
    },
    function SaveSinhVien(user,callback) {
        var sinhvien= new SinhVien({tenSinhVien:'Nguyen Duc Khanh',_id:user._id});
        sinhvien.save(function (err) {
            if (err){
                console.log('id sinh vien exist');
            }
        });
        callback(null,sinhvien);
    }
],function (err, result) {
    if (err){
        console.error(err);
    }
    console.log(result);
})

//Create Thu 1 Giang Vien

async.waterfall([
    function createGiangVien(callback) {
        var user= new User({username:'tokhanh',password:'14020234',role:'GiangVien'});
        user.save(function (err) {
            if (err){
                console.log('this username existed');
            }
        });
        callback(null,user);
    },
    function SaveGiangVien(user,callback) {
        var giangvien= new GiangVien({tenGiangVien:'To Van Khanh',_id:user._id});
        giangvien.save(function (err) {
            if (err){
                console.log('giangvien existed');
            }
        });
        callback(null,giangvien);
    }
],function (err, result) {
    if (err){
        console.error(err);
    }
    console.log(result);
});

LopMonHocController.update('587e2903a4a1bb1300f541df',{idGiangVien:'587e2903a4a1bb1300f541e1'},function (err, result) {
    if (err){
        console.log('err');
    }
    else {
        console.log('ok');
    }
});

async.waterfall([
    function createFile(callback) {
        var file=new File({tenFile:'bao cao tai chinh',link:'http://abc.com'});
        file.save(function (err) {
            if (err){
                console.log('error when try create new file');
            }
        });
        callback(null,file);
    }
],function (err, result) {
    if (err){
        console.error(err)
    }
    console.log(result);
})


// create khoa

async.waterfall([
    function createKhoa(callback) {
        var user= new User({username:'cntt',password:'14020234',role:'Khoa'});
        user.save(function (err) {
            if (err){
                console.log('this username existed');
            }
        });
        callback(null,user);
    },
    function SaveKhoa(user,callback) {
        var khoa= new Khoa({tenKhoa:'cong nghe thong tin',_id:user._id});
        khoa.save(function (err) {
            if (err){
                console.log('giangvien existed');
            }
        });
        callback(null,khoa);
    }
],function (err, result) {
    if (err){
        console.error(err);
    }
    console.log(result);
});
