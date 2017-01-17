var async  = require('async');
User = require('../models/User');
SinhVien = require('../models/SinhVien');

async.waterfall([
    function createSinhVien(callback) {
        var user= new User({username:'14020521',password:'14020234'});
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