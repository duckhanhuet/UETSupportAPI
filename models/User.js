var mongoose = require('mongoose');
// var bcrypt   = require('bcryptjs');
var Schema= mongoose.Schema;
var SinhVien = require('./SinhVien');

var UserSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum : ['Khoa','PhongBan','GiangVien','SinhVien'],
        default: 'SinhVien'
    }

    // UserId:{
    //     type: Schema.Types.ObjectId,
    //     ref : 'SinhVien'
    // }

});

// UserSchema.pre('save',function (next) {
//     var user= this;
//     if (this.isModified('password')||this.isNew){
//         bcrypt.genSalt(10,function (err, salt) {
//             if (err) return next(err);
//             bcrypt.hash(user.password,salt,function (err, hash) {
//                 if (err) return next(err);
//                 user.password= hash;
//                 next();
//             })
//         })
//     } else {
//         return next();
//     }
// });
//
// //create method to compare password
// UserSchema.methods.comparePassword = function (pw, cb) {
//     bcrypt.compare(pw,this.password,function (err, isMatch) {
//         if (err) return cb(err);
//
//         cb(null,isMatch);
//     })
// };

module.exports = mongoose.model('User',UserSchema);
