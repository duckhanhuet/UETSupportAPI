var express = require('express');
var router = express.Router();
var FileController = require('../controllers/FileController');
var ThongBaoController= require('../controllers/ThongBaoController');
var auth           = require('../policies/auth');
router.get('/',auth.reqIsAuthenticate,function (req, res, next) {
    ThongBaoController.find({},function (err, thongbaos) {
        if (err){
            res.json({
                success: false,
                message: 'not found thongbao'
            })
        }
        res.json(thongbaos);
    })
});
router.get('/:id',auth.reqIsAuthenticate,function (req,res,next) {
    ThongBaoController.findById(req.params.id,function (err, thongbao) {
        if (err){
            res.json({
                success:err,
                message:'not found file with id '+req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata:thongbao
            });
        }
    })
})

module.exports = router;