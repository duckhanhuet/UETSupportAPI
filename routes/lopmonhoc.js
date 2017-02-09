var express = require('express');
var router = express.Router();
var auth = require('../policies/auth');
var LopMonHocController = require('../controllers/LopMonHocController');
var GiangVienController = require('../controllers/GiangVienController');
var LopMonHoc   = require('../models/LopMonHoc');
var SinhV = require('../controllers/SinhVienController');
var async = require('async');

router.get('/', auth.reqIsAuthenticate, function (request, res, next) {
    LopMonHoc.find({}).populate(
        [
            {
                path:'idGiangVien',
                populate:{
                    path:'idKhoa'
                }
            },
            {
                path:'idKiHoc'
            }
        ]
    ).exec(function (err, lopmonhocs) {
        if (err){
            res.json({
                success: false
            })
        }
        res.json(lopmonhocs);
    })
});

router.get('/:id', auth.reqIsAuthenticate, function (req, res, next) {
    LopMonHoc.findOne({_id:req.params.id}).populate(
        [
            {
                path:'idGiangVien',
                populate:{
                    path:'idKhoa'
                }
            },
            {
                path:'idKiHoc'
            }
        ]
    ).exec(function (err, lopmonhoc) {
        if (err){
            res.json({
                success: false
            })
        }
        res.json({
            success: true,
            metadata: lopmonhoc
        })
    })
})

module.exports = router;