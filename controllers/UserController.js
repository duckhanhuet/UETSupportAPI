var User= require('../models/User');
var bcrypt   = require('bcryptjs');
module.exports =  {
    find: function (params, callback) {
        User.find(params,function (err, users) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,users);
        })
    },

    findById: function (id, callback) {
        User.findById(id,function (err, user) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,user);
        })
    },

    create: function (params, callback) {
        bcrypt.genSalt(10,function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(params.password,salt,function (err, hash) {
                if (err) return next(err);
                params.password= hash;
            })
        });
        User.create(params,function (err, user) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,user);
        })
    },
    update: function (id, params, callback) {
        User.findByIdAndUpdate(id,params,{new: true},function (err, user) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,user);
        })
    },
    delete: function (id, callback) {
        User.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}