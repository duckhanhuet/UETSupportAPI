var express = require('express');
var router = express.Router();
var LopChinhController = require('../controllers/LopChinhController');
var auth = require('../policies/auth');
router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    LopChinhController.find({}, function (err, lopchinhs) {
        if (err) {
            res.json({
                success: false,
                message: 'not found file'
            })
        }
        res.json(lopchinhs);
    })
});
router.get('/:id', auth.reqIsAuthenticate, function (req, res, next) {
    LopChinhController.findById(req.params.id, function (err, lopchinh) {
        if (err) {
            res.json({
                success: err,
                message: 'not found file with id ' + req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata: lopchinh
            });
        }


    })
})

module.exports = router;