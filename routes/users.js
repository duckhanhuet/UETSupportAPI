var express = require('express');
var router = express.Router();
var User = require('../models/User');
var SinhVien = require('../models/SinhVien');
var config = require('../Config/Config');
var auth = require('../policies/auth');  //xử lý token trước khi vào API, đính kèm trước cái hàm cần đăng nhập
var async = require('async');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var UserController = require('../controllers/UserController');
var SinhVienController = require('../controllers/SinhVienController');
var KhoaController = require('../controllers/KhoaController');
var PhongBanController = require('../controllers/PhongBanController');
var GiangVienController = require('../controllers/GiangVienController');

//====================================================================
var gcm = require('node-gcm');
//=====================================================================
//=====================================================================

//test add some sinhvien to database
// require('../test/test');
//xem lai cai ham nay dung asynce để làm lại làm bằng bcrys để hashcode password nhé

//=====================================================================
//create database from file exels
// require('../test/postDatabase');

//=====================================================================
//=====================================================================
//api for login
//login with username and password
router.post('/authenticate', function (req, res) {
    console.log(req.body)
    User.findOne({_id: req.body.username}, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.send({
                success: false,
                message: 'Authentication failed ,User not Found.'
            })
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.sign(user, config.secret);

                    // return the information including token as JSON
                    SinhVienController.findSinhVienById(user._id, function (err, sinhvien) {
                        res.json({
                            success: true,
                            message: 'Enjoy your token!',
                            token: token,
                            sinhvien: sinhvien
                        })
                    });
                } else {
                    res.json({
                        succsess: false,
                        message: 'Authentication failed.Password did not match'
                    })
                }
            })
        }
    })
})

//Api for find sum users
router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    UserController.find({}, function (err, results) {
        if (err) {
            res.json({
                success: false,
                message: err
            })
            return;
        }
        res.json({
            success: true,
            results: results
        })
    })
});


router.get('/profile',auth.reqIsAuthenticate,function (req, res, next) {
    res.json({
        username: req.user._id,
        password: req.user.password,
        role: req.user.role
    })
})
module.exports = router;
