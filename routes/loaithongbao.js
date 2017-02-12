var express = require('express');
var router = express.Router();
var LoaiThongBaoController = require('../controllers/LoaiThongBaoController');
var auth = require('../policies/auth');
router.get('/', function (req, res, next) {
    LoaiThongBaoController.find({}, function (err, loaithongbaos) {
        if (err) {
            res.json({
                success: false,
                message: 'not found file'
            })
        }
        res.json(loaithongbaos);
    })
});
router.get('/:id', auth.reqIsAuthenticate, function (req, res, next) {
    LoaiThongBaoController.findById(req.params.id, function (err, loaithongbao) {
        if (err) {
            res.json({
                success: err,
                message: 'not found file with id ' + req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata: loaithongbao
            });
        }


    })
})

module.exports = router;