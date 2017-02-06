var express = require('express');
var router = express.Router();
var SubscribeController = require('../controllers/SubscribeController');
var LoaiThongBaoController = require('../controllers/LoaiThongBaoController');
var auth = require('../policies/auth');
router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    SubscribeController.find({}, function (err, subscribes) {
        if (err) {
            res.json({
                success: false,
                message: 'not found file'
            })
        }
        res.json(subscribes);
    })
});
router.get('/:id', auth.reqIsAuthenticate, function (req, res, next) {
    SubscribeController.findById(req.params.id, function (err, subscribe) {
        if (err) {
            res.json({
                success: err,
                message: 'not found file with id ' + req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata: subscribe
            });
        }
    })
})

module.exports = router;