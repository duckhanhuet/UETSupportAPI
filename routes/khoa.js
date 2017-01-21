var express = require('express');
var router = express.Router();
var KhoaController = require('../controllers/KhoaController');
var auth           = require('../policies/auth');
router.get('/',auth.reqIsAuthenticate,function (req, res, next) {
    KhoaController.find({},function (err, khoas) {
        if (err){
            res.json({
                success: false,
                message: 'not found khoa'
            })
        }
        res.json(khoas);
    })
});
router.get('/:id',auth.reqIsAuthenticate,function (req,res,next) {

    KhoaController.findById(req.params.id,function (err, khoa) {
        if (err){
            res.json({
                success:err,
                message:'not found file with id '+req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata:khoa
            });
        }
    })
})

module.exports = router;