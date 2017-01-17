var express = require('express');
var router = express.Router();
var User = require('../models/User');
var SinhVien = require('../models/SinhVien');
var config = require('../Config/Config');
var async = require('async');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var UserController = require('../controllers/UserController');
var SinhVienController = require('../controllers/SinhVienController');
var KhoaController = require('../controllers/KhoaController');
var PhongBanController = require('../controllers/PhongBanController');
var GiangVienController = require('../controllers/GiangVienController');
// route to return all users (GET http://localhost:8080/users)
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});


//xem lai cai ham nay dung asynce để làm lại làm bằng bcrys để hashcode password nhé

router.post('/authenticate', function (req, res) {
    User.findOne({username: req.body.username}, function (err, user) {
        if (err) throw err;
        if (!user) {
            res.send({
                success: false,
                message: 'Authentication failed ,User not Found.'
            })
        } else {
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.sign(user, config.secret);

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                } else {
                    res.json({
                        succsess: false,
                        message: 'Authentication failed.Password did not match'
                    })
                }
            })
        }
    })
})

// VD xử lý có đăng nhập
// hafm nay phải có token mới có thể chạy đc
router.get('/test', reqIsAuthenticate, function (req, res) {
    res.json(req.user);
})

//Api for find sum users
router.get('/', function (req, res, next) {
    UserController.find(req.query, function (err, results) {
        if (err) {
            res.json({
                success: false,
                message: err
            })
            return;
        }
        res.json({
            success: true,
            results: results
        })
    })
});

//get User and Infomation by get link: /users/:id
router.get('/:id', function (req, res) {
    var id = req.params.id;
    var role;
    async.series([
        function findUser(callback) {
            UserController.findById(id, function (err, result) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Cannot find User'
                    })
                } else {
                    role = result.role;
                    callback(null, result);
                }

            })
        },
        function findEachUser(callback) {

            switch (role) {
                // neu quyen la khoa
                case 'Khoa':
                    KhoaController.findById(id, function (err, result) {
                        if (err) {
                            res.json({
                                success: false,
                                message: 'cant found'
                            })
                        }
                        callback(null, result);
                    })
                    break;
                case 'GiangVien':
                    //Neu quyen la Giang Vien
                    GiangVienController.findById(id, function (err, result) {
                        if (err) {
                            res.json({
                                success: false,
                                message: 'not found'
                            })
                        }
                        callback(null, result);
                    });
                    break;
                case 'PhongBan':
                    //Neu Quyen la Phong Ban
                    PhongBanController.findById(id, function (err, result) {
                        if (err) {
                            res.json({
                                success: false,
                                message: 'cant found'
                            })
                        }
                        callback(null, result);
                    })
                    break;
                default:
                    // Con lai mac dinh la Sinh Vien
                    SinhVienController.findById(id, function (err, result) {
                        if (err) {
                            res.json({
                                success: false,
                                message: 'cant found'
                            })
                        }
                        callback(null, result);
                    })
            }
        }
    ], function (err, result) {
        if (err) {
            console.error(err);
        }
        res.json({
            success: true,
            metadata: result
        });
    })
});



//Xu ly API for Sinh Vien

//xử lý token trước khi vào API, đính kèm trước cái hàm cần đăng nhập
function reqIsAuthenticate(req, res, next) {
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
}


module.exports = router;
