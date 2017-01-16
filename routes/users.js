var express = require('express');
var router = express.Router();
var User = require('../models/User')
var config = require('../Config/Config');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens


// route to return all users (GET http://localhost:8080/users)
router.get('/', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});


//create Sinh viên để dung thử nao không cần
router.post('/',function (req,res) {
  var username  = req.body.username;
  var password = req.body.password;
  var role = "SinhVien"
  var sv = new User({
    username : username,
    password : password,
    role : role
  })
  sv.save(function (err,sv) {

    if(err)
      res.json({access : false});
    else
      res.json(sv)
  })
})

//xem lai cai ham nay dung asynce để làm lại làm bằng bcrys để hashcode password nhé
router.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, config.secret);

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }

    }

  });
});

// VD xử lý có đăng nhập
// hafm nay phải có token mới có thể chạy đc
router.get('/test',reqIsAuthenticate,function (req,res) {
  res.json(req.user)
})

//xử lý token trước khi vào API, đính kèm trước cái hàm cần đăng nhập
function reqIsAuthenticate(req,res,next) {
  var token = req.body.token || req.query.token || req.headers['Authorization'];

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
