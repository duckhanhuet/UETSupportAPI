var express = require('express');
var router = express.Router();
var DiemRenLuyenController = require('../controllers/DiemRenLuyenController');
var auth = require('../policies/auth');

router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    DiemRenLuyenController.find({}, function (err, diemrenluyens) {
        if (err) {
            res.json({
                success: false,
                message: 'not found diem ren luyen'
            })
        }
        res.json({
            success: true,
            metadata: diemrenluyens
        });
    })
});
router.get('/:id', auth.reqIsAuthenticate, function (req, res, next) {
    DiemMonHocController.findById(req.params.id, function (err, diemrenluyen) {
        if (err) {
            res.json({
                success: err,
                message: 'not found diem mon hoc with id ' + req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata: diemrenluyen
            });
        }
    })
});

module.exports = router;