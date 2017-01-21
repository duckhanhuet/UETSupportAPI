var express = require('express');
var router = express.Router();
var GiangVienController = require('../controllers/GiangVienController');
var auth           = require('../policies/auth');
router.get('/',auth.reqIsAuthenticate,function (req, res, next) {
    GiangVienController.find({},function (err, giangviens) {
        if (err){
            res.json({
                success: false,
                message: 'not found giangvien'
            })
        }
        res.json(giangviens);
    })
});
router.get('/:id',auth.reqIsAuthenticate,function (req,res,next) {
    GiangVienController.findById(req.params.id,function (err, giangvien) {
        if (err){
            res.json({
                success:err,
                message:'not found file with id '+req.params.id
            })
        }
        else {
            res.json({
                success: true,
                metadata:giangvien
            });
        }


    })
})

module.exports = router;