/**
 * Created by Vu Minh Tuan on 2/4/2017.
 */
var express = require('express');
var router = express.Router();
var LoaiTinTucController = require('../controllers/LoaiTinTucController');
router.get('/', function (req, res) {
    LoaiTinTucController.findAll(function (err, result) {
        if (err) res.json({
            success: false,
            err: err
        })
        res.json(result)
    })
});
module.exports = router