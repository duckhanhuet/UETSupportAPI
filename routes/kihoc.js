var express = require('express');
var router = express.Router();
var auth = require('../policies/auth');
var KiHocController = require('../controllers/KiHocController');
var KiHoc = require('../models/KiHoc');
var auth = require('../policies/auth');

router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    KiHocController.find(req.query, function (err, results) {
        if (err) {
            res.json({
                success: false,
                message: 'khong tim duoc ki hoc'
            })
        }
        res.json({
            success: true,
            message: results
        })
    })
});

router.get('/:id', auth.reqIsAuthenticate, function (req, res) {
    KiHocController.findById(req.params.id, function (err, result) {
        if (err) {
            res.json({
                success: false,
                message: 'khong tim thay ki hoc'
            })
            return;
        }
        res.json({
            success: true,
            message: result
        })
    })
})

module.exports = router;