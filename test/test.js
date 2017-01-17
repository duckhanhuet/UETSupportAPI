var async  = require('async');
User = require('../models/User');
SinhVien = require('../models/SinhVien');
GiangVien= require('../models/GiangVien');
LopMonHoc= require('../models/LopMonHoc');
var LopChinh= require('../models/LopChinh');

// Creat 1 Sinh Vien
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
            if (err) throw err;
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
            if (err) throw err;
        });
        callback(null,giangvien);
    }
],function (err, result) {
    if (err){
        console.error(err);
    }
    console.log(result);
})