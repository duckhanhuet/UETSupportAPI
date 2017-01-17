/**
 * Created by Administrator on 17/01/2017.
 */
var express = require('express');
var router = express.Router();
var TinTucController = require('../controllers/TinTucController')
var utils = require('../Utils/UltisTinTuc')
var async = require('async');

router.get('/',function (req,res) {
    TinTucController.findAndLimit({},0,function (err,tintuc) {
        res.json({
            success : true,
            TinTuc : tintuc
        })
    })

})
//ham nay de impot du lieu
//CHAY LAN DAU ROI COMMENT NO LAI
// utils.importTinTuc();

module.exports = router