var express = require('express');
var router = express.Router();
var User = require('../models/User');
var SinhVien = require('../models/SinhVien');
var config = require('../Config/Config');
var async  = require('async');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var UserController = require('../controllers/UserController');
var SinhVienController = require('../controllers/SinhVienController');

// route to return all users (GET http://localhost:8080/users)
router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});


//xem lai cai ham nay dung asynce để làm lại làm bằng bcrys để hashcode password nhé

router.post('/authenticate',function (req, res) {
  User.findOne({username:req.body.username},function (err, user) {
    if (err) throw err;
    if (!user){
      res.send({
        success: false,
        message: 'Authentication failed ,User not Found.'
      })
    } else {
      user.comparePassword(req.body.password,function (err, isMatch) {
        if (isMatch&&!err){
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
router.get('/test',reqIsAuthenticate,function (req,res) {
  res.json(req.user);
})

//Api for find sum users
router.get('/',function (req, res, next) {
  UserController.find(req.query,function (err, results) {
    if (err){
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

router.get('/:id',reqIsAuthenticate,function (req, res) {
  var id= req.params.id;
  // prallel
})



//xử lý token trước khi vào API, đính kèm trước cái hàm cần đăng nhập
function reqIsAuthenticate(req,res,next) {
  var token = req.body.token || req.query.token || req.headers['authorization'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
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
