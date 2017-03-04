var express = require('express');
var router = express.Router();
var DiemMonHocController = require('../controllers/DiemMonHocController');
var auth = require('../policies/auth');
router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    DiemMonHocController.find({}, function (err, diemmonhocs) {
        if (err) {
            res.json({
                success: false,
                message: 'not found diem mon hoc'
            })
        }
        res.json({
            success: true,
            metadata: diemmonhocs
        });
    })
});
router.get('/:id', auth.reqIsAuthenticate, function (req, res, next) {
    DiemMonHocController.findById(req.params.id, function (err, diemmonhoc) {
        if (err) {
            res.json({
                success: err,
                message: 'not found diem mon hoc with id ' + req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata: diemmonhoc
            });
        }
    })
});
router.get('/lop/:idlop',auth.reqIsAuthenticate,auth.reqIsSinhVien,function (req, res) {
    DiemMonHocController.findAllByIdLopMonHoc({idLopMonHoc: req.params.idlop}, function (err, diemmonhoc) {
        if (err){
            res.json({
                success: false
            })
        }
        res.json(diemmonhoc);
    })
});

module.exports = router;