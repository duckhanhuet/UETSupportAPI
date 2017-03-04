var Feedback = require('../models/Feedback');


module.exports =  {
    find: function (params, callback) {
        Feedback.find(params,function (err, feedbacks) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,feedbacks);
        })
    },

    findById: function (id, callback) {
        Feedback.findById(id,function (err, feedback) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,feedback);
        })
    },

    create: function (params, callback) {
        Feedback.create(params,function (err, feedback) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,feedback);
        })
    },
    update: function (id, params, callback) {
        Feedback.findByIdAndUpdate(id,params,{new: true},function (err, feedback) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,feedback);
        })
    },
    delete: function (id, callback) {
        Feedback.findByIdAndRemove(id,function (err) {
            if (err){
                callback(err,null);
                return;
            }
            callback(null,null);
        })
    }
}