var express = require('express');
var router = express.Router();
var SubscribeController = require('../controllers/SubscribeController');
var Subscribe   = require('../models/Subscribe');
var LoaiThongBaoController = require('../controllers/LoaiThongBaoController');
var auth = require('../policies/auth');

router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    SubscribeController.findById(req.user._id, function (err, subscribes) {
        if (err){
            res.json({
                success: false
            })
        }
        res.json(subscribes)
    })
});
router.get('/:id', auth.reqIsAuthenticate, function (req, res, next) {
    SubscribeController.findById(req.params.id,function (err, subscribe) {
        if (err){
            res.json({
                success: false
            })
        }
        res.json({
            success:true,
            metadata: subscribe
        })
    })
})

module.exports = router;