/**
 * Created by Administrator on 17/01/2017.
 */
var express = require('express');
var router = express.Router();
var TinTucController = require('../controllers/TinTucController')
var utils = require('../Utils/UltisTinTuc')
var async = require('async');

router.get('/',function (req,res) {
    var url = "http://uet.vnu.edu.vn/coltech/taxonomy/term/101";
    var arr = [];
    var dem =0;
    for(var i=0;i<3;i++){

        var fun1 = function (callback,dem) {
            utils.parserHtmlTinTuc(url+'?page='+dem,callback)
        }
        dem++;
        arr.push(fun1)
    }
    // var fun1 = function (callback) {
    //     utils.parserHtmlTinTuc(url+'?page=3',callback)
    // }
    // var fun2 = function (callback) {
    //     utils.parserHtmlTinTuc(url+'?page=4',callback)
    // }
    // var fun3 = function (callback) {
    //     utils.parserHtmlTinTuc(url+'?page=5',callback)
    // }

    // arr.push(fun2)
    // arr.push(fun3)
    async.parallel(arr,function (err,result) {
        res.json(result)
    })


})

module.exports = router