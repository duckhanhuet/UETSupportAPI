var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./Config/Config'); // get our config file
var tintucs = require('./routes/tintuc')
var users = require('./routes/users');
var lopmonhoc= require('./routes/lopmonhoc');
var kihoc    = require('./routes/kihoc');
var file     = require('./routes/file');
var lopchinh = require('./routes/lopchinh');
var khoa     = require('./routes/khoa');
var phongban = require('./routes/phongban');
var giangvien = require('./routes/giangvien');
var thongbao  = require('./routes/thongbao');
var sinhvien  = require('./routes/sinhvien');
var loaitintuc = require('./routes/loaitintuc');
var loaithongbao = require('./routes/loaithongbao');
var subscribe   = require('./routes/subscribe');
var mucdothongbao = require('./routes/mucdothongbao');
var diemmonhoc  = require('./routes/diemmonhoc');
var diemrenluyen = require('./routes/diemrenluyen');
var avatar       = require('./routes/avatar');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//======================================================
//connect database
mongoose.connect(config.database); // connect to database

//======================================================
//thêm routes ở đây
app.use('/users', users);  //đăng nhập trong file users.js
app.use('/tintuc',tintucs);
app.use('/lopmonhoc',lopmonhoc);
app.use('/kihoc',kihoc);
app.use('/file',file);
app.use('/lopchinh',lopchinh);
app.use('/khoa',khoa);
app.use('/giangvien',giangvien);
app.use('/phongban',phongban);
app.use('/sinhvien',sinhvien);
app.use('/thongbao',thongbao);
app.use('/loaitintuc', loaitintuc);
app.use('/loaithongbao',loaithongbao);
app.use('/subscribe',subscribe);
app.use('/mucdothongbao',mucdothongbao);
app.use('/diemmonhoc',diemmonhoc);
app.use('/diemrenluyen',diemrenluyen);
app.use('/avatar',avatar);
//======================================================
//không cần để ý phần này
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // render the error page
//   res.json({
//     error : err
//   });
// });

//================================================
//================================================
//Phan tich File xlsx
//require('./Utils/PhanTichBangDiem');

//require('./Utils/phanTichDiemFilePdf');

//test gui thong bao
// app.get('/test/guithongbao',function (req, res) {
//     res.render('guithongbao')
// })

app.get('/test/postavatar',function (req, res) {
   res.render('postavatar')
})
//post database
//require('./Utils/postdb')
module.exports = app;
