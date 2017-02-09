var express = require('express');
var router = express.Router();
var SubscribeController = require('../controllers/SubscribeController');
var Subscribe   = require('../models/Subscribe');
var LoaiThongBaoController = require('../controllers/LoaiThongBaoController');
var auth = require('../policies/auth');
router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    Subscribe.find({}).populate([{
        path:'_id',
        populate:[{
            path:'idLopChinh',
            populate:{
                path:'idKhoa'
            }
        },
            {
                path:'idLopMonHoc',
                populate:{
                    path:'idGiangVien'
                }
            }]
    },
        {
            path:'idLoaiThongBao'
        },
        {
            path:'idLoaiTinTuc'
        }]).exec(function (err, subscribes) {
        if (err){
            res.json({
                success: false
            })
        }
        res.json({
            success:true,
            metadata: subscribes
        })
    })
});
router.get('/:id', auth.reqIsAuthenticate, function (req, res, next) {
    Subscribe.findOne({_id:req.params.id}).populate([{
        path:'_id',
        populate:[{
                path:'idLopChinh',
                populate:{
                    path:'idKhoa'
                }
            },
            {
                path:'idLopMonHoc',
                populate:{
                    path:'idGiangVien'
                }
            }]
        },
        {
        path:'idLoaiThongBao'
        },
        {
            path:'idLoaiTinTuc'
        }]).exec(function (err, subscribe) {
        if (err){
            res.json({
                success: false
            })
        }
        res.json({
            success:true,
            metadata: subscribe
        })
    })
})

module.exports = router;