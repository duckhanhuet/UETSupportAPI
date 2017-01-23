var config = require('../Config/Config');
var jwt = require('jsonwebtoken');

module.exports= {
    reqIsAuthenticate: function (req, res, next) {
        var token = req.body.token || req.query.token || req.headers['authorization'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    return res.json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    // if everything is good, save to request for use in other routes
                    //nếu mà muốn truy xuất chi tiết từng thăng thì truy vấn vào từng bảng rồi
                    //lưu nó vào user
                    req.user = decoded._doc;
                    next();
                }
            });
        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    },
    reqIsKhoa: function (req,res,next) {
        if (req.user.role=='Khoa'){
            next();
        }else {
            res.json({
                success: false,
                message: 'You dont have permission of Khoa'
            })
        }
    },
    reqIsPhongBan: function (req,res,next) {
        if (req.user.role=='PhongBan'){
            next();
        }else {
            res.json({
                success: false,
                message: 'You dont have permission of PhongBan'
            })
        }
    },
    reqIsGiangVien: function (req,res,next) {
        if (req.user.role=='GiangVien'){
            next();
        }else {
            res.json({
                success: false,
                message: 'You dont have permission of GiangVien'
            })
        }
    },
    reqIsSinhVien: function (req,res,next) {
        if (req.user.role=='SinhVien'){
            next();
        }else {
            res.json({
                success: false,
                message: 'You dont have permission of SinhVien'
            })
        }
    }
}

