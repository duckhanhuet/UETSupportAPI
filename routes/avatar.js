var express = require('express');
var auth = require('../policies/auth')
var UserController = require('../controllers/UserController');
var SinhVienController = require('../controllers/SinhVienController');
var KhoaController = require('../controllers/KhoaController');
var PhongBanController       = require('../controllers/PhongBanController')
var GiangVienController      = require('../controllers/GiangVienController');

var router= express.Router();

router.get('/:idSender',function (req, res, next) {
    var idSender = req.params.idSender;
    UserController.findById(idSender,function (err, user) {
        if (err){
            res.json({
                success: false
            })
        }else {

            var role= user.role;

            if (role=='SinhVien'){
                SinhVienController.getAvatar(idSender,function (err, sinhvien) {
                    if (err){
                        res.json({
                            success: false
                        })
                    }else {
                        res.json({
                            success : true,
                            avatar: sinhvien
                        })
                    }
                })
            }
            if (role=='PhongBan'){
                PhongBanController.getAvatar(idSender,function (err, pb) {
                    if (err){
                        res.json({
                            success: false
                        })
                    } else {
                        res.json({
                            success: true,
                            avatar: pb
                        })
                    }
                })
            }
            if (role=='Khoa'){
                KhoaController.getAvatar(idSender,function (err, khoa) {
                    if (err){
                        res.json({
                            success: false
                        })
                    } else {
                        res.json({
                            success: true,
                            avatar: khoa
                        })
                    }
                })
            }
            if (role=='GiangVien'){
                GiangVienController.getAvatar(idSender,function (err, gv) {
                    if (err){
                        res.json({
                            success: false
                        })
                    } else {
                        res.json({
                            success: true,
                            avatar: gv
                        })
                    }
                })
            }
        }
    })

})

module.exports =router;