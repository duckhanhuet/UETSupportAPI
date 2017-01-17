/**
 * Created by Administrator on 17/01/2017.
 */
var express = require('express');
var router = express.Router();
var TinTucController = require('../controllers/TinTucController')
var utils = require('../Utils/UltisTinTuc')

router.get('/',function (req,res) {
    var url = "http://uet.vnu.edu.vn/coltech/taxonomy/term/101"
    utils.parserHtmlTinTuc(url,function (err,result) {
        if(err){
            res.json({
                success : false,
                message:'not found news in the website'
            })
        }
        res.send(result)
    })

})

module.exports = router;