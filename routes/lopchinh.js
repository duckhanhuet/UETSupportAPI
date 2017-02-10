var express = require('express');
var router = express.Router();
var LopChinhController = require('../controllers/LopChinhController');
var LopChinh = require('../models/LopChinh');
var auth = require('../policies/auth');
router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    LopChinhController.find({},function (err, lopchinhs) {
        if (err){
            res.json({
                success:false
            })
        }
        res.json(lopchinhs);
    })
});
router.get('/:id', auth.reqIsAuthenticate, function (req, res, next) {
    LopChinhController.findById(req.params.id,function (err, lopchinh) {
        if (err){
            res.json({
                success: false
            })
        }
        res.json({
            success: true,
            metadata: lopchinh
        })
    })
})

module.exports = router;