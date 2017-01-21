var express = require('express');
var router = express.Router();
var PhongBanController = require('../controllers/PhongBanController');
var auth           = require('../policies/auth');
router.get('/',auth.reqIsAuthenticate,function (req, res, next) {
    PhongBanController.find({},function (err, phongbans) {
        if (err){
            res.json({
                success: false,
                message: 'not found phongban'
            })
        }
        res.json(phongbans);
    })
});
router.get('/:id',auth.reqIsAuthenticate,function (req,res,next) {
    PhongBanController.findById(req.params.id,function (err, phongban) {
        if (err){
            res.json({
                success:err,
                message:'not found file with id '+req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata:phongban
            });
        }


    })
})
module.exports = router;