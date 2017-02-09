var express= require('express');
var mongoose= require('mongoose');
var MucDoThongBaoSchema = new mongoose.Schema({
    _id:{
        type: Number,
        unique: true
    },
    tenMucDoThongBao:{
        type: String
    }
});

module.exports = mongoose.model('MucDoThongBao',MucDoThongBaoSchema);