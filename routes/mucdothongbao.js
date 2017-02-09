var express = require('express');
var router = express.Router();
var MucDoThongBaoController = require('../controllers/MucDoThongBaoController');
var auth = require('../policies/auth');
router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    MucDoThongBaoController.find({}, function (err, mucdothongbaos) {
        if (err) {
            res.json({
                success: false,
                message: 'not found mucdothongbao'
            })
        }
        res.json(mucdothongbaos);
    })
});
router.get('/:id', auth.reqIsAuthenticate, function (req, res, next) {
    MucDoThongBaoController.findById(req.params.id, function (err, mucdothongbao) {
        if (err) {
            res.json({
                success: err,
                message: 'not found muc do thong bao with id ' + req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata: mucdothongbao
            });
        }


    })
})
module.exports = router;