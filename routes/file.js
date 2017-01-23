var express = require('express');
var router = express.Router();
var FileController = require('../controllers/FileController');
var auth = require('../policies/auth');
router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    FileController.find({}, function (err, files) {
        if (err) {
            res.json({
                success: false,
                message: 'not found file'
            })
        }
        res.json(files);
    })
});
router.get('/:id', auth.reqIsAuthenticate, function (req, res, next) {
    FileController.findById(req.params.id, function (err, file) {
        if (err) {
            res.json({
                success: err,
                message: 'not found file with id ' + req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata: file
            });
        }


    })
})

module.exports = router;