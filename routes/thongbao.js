var express = require('express');
var router = express.Router();
var FileController = require('../controllers/FileController');
var ThongBaoController = require('../controllers/ThongBaoController');
var LoaiThongBaoController= require('../controllers/LoaiThongBaoController');
var FileController    = require('../controllers/FileController');
var ThongBao           = require('../models/ThongBao');
var auth = require('../policies/auth');
router.get('/', auth.reqIsAuthenticate, function (req, res, next) {
    ThongBaoController.find({}, function (err, thongbaos) {
        if (err) {
            res.json({
                success: false,
            })
        }
        res.json(thongbaos);
    })
});
router.get('/:id', auth.reqIsAuthenticate, function (req, res, next) {
    ThongBaoController.findById(req.params.id,function (err,thongbao) {
        if (err){
            res.json({
                success: false
            })
        }
        else {
            res.json({
                success:true,
                metadata:thongbao
            })
        }
    })
});

router.get('/list/100thongbao',function (req, res, next) {
    var list=[];
    ThongBaoController.find({},function (err, results) {
        if (err){
            res.json({
                success: false,
                message:'not found thongbao'
            })
        }
        for (var i=0;i<100;i++){
            list.push(results[i]);
        }
        res.json(list);
    });
});

//thong bao diem thi (file diem duoi dang link file pdf)
router.get('/list/diemthi',auth.reqIsAuthenticate,function (req, res) {
    ThongBaoController.find({},function (err, thongbaos) {
        if (err) {
            res.json({
                success: false
            })
        }
        else {
            var listThongBao = [];
            thongbaos.forEach(function (thongbao) {
                if (thongbao.idLoaiThongBao==1){
                    listThongBao.push(thongbao);
                }
            })
            res.json(listThongBao)
        }

    })
})
module.exports = router;