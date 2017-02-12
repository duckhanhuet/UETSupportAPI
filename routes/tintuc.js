/**
 * Created by Administrator on 17/01/2017.
 */
var express = require('express');
var router = express.Router();
var TinTucController = require('../controllers/TinTucController');
var utils = require('../Utils/UltisTinTuc');
var async = require('async');

router.get('/',function (req,res) {
    TinTucController.findAndLimit({},0,function (err,tintuc) {
        res.json({
            success : true,
            TinTuc : tintuc
        })
    })
})
//Tra json
router.get('/test',function (req,res) {
    var loaiTinTuc = req.query.loaitintuc;
    TinTucController.findDetailTinTuc({
        loaiTinTuc : loaiTinTuc
    },function (err,tintuc) {
        res.json(tintuc)
    })
})

//phan tích lại tin tuc detail
router.get('/detail',function (req,res) {
    var url = req.query.url;
    utils.adapter(url,function (err,result) {
        if (err) {
            console.log(err)
            res.json(err)
        }

        res.render('index',{
            result : result
        })
    })
})

//============================================================
/**
 * Lập lick lấy gửi notifi
 */
setInterval(function () {
    utils.test();
},1000*60*10);
//============================================================
//ham nay de impot du lieu
//CHAY LAN DAU ROI COMMENT NO LAI
//utils.parseMainPage('http://uet.vnu.edu.vn/coltech/taxonomy/term/101');

// utils.test();

module.exports = router;