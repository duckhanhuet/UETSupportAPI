var express = require('express');
var router = express.Router();
var auth = require('../policies/auth');
var LopMonHocController = require('../controllers/LopMonHocController');
var GiangVienController = require('../controllers/GiangVienController');
var SinhV = require('../controllers/SinhVienController');
var async = require('async');

router.get('/', auth.reqIsAuthenticate, function (request, res, next) {
    LopMonHocController.find({}, function (err, result) {
        if (err) {
            res.json({
                success: false,
                status: 404,
                message: 'Not found lop mon hoc'
            })
            return;
        } else {
            res.json(result);
        }
    })
});

router.get('/:id', auth.reqIsAuthenticate, function (req, res, next) {
    async.waterfall([
        function lophoc(callback) {
            LopMonHocController.findById(req.params.id, function (err, lophoc) {
                if (err) {
                    console.log('not found');
                    res.json({
                        success: false,
                        message: 'Not found'
                    })
                } else {
                    callback(null, lophoc);
                }
            })
        },
        function gv(lophoc, callback) {
            GiangVienController.findById(lophoc.idGiangVien, function (err, gv) {
                if (err) {
                    console.log('Khong tim thay giang vien trong lop hoc');
                    callback(null, lophoc);
                }
                else {
                    var result = {
                        lopmonhoc: lophoc,
                        giangvien: gv
                    }
                    callback(null, result);
                }
            })
        }
    ], function (err, result) {
        if (err) {
            console.error(err);
        }
        res.json(result);
    })
})

module.exports = router;