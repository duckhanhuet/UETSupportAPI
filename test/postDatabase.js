var express = require('express');
var bodyParser = require('body-parser');
User = require('../models/User');
Khoa=require('../models/Khoa');
var KhoaController = require('../controllers/KhoaController');
var async= require('async');


if(typeof require !== 'undefined') XLSX = require('xlsx');
var workbook = XLSX.readFile('./filedatabase/khoa.xlsx');

var first_sheet_name = workbook.SheetNames[0];
var address_of_cell = 'A1';

/* Get worksheet */
var worksheet = workbook.Sheets[first_sheet_name];

var sheet_name_list = workbook.SheetNames;
sheet_name_list.forEach(function(y) { /* iterate through sheets */
    var worksheet = workbook.Sheets[y];
    //console.log(worksheet);
    var infors = XLSX.utils.sheet_to_json(worksheet);
    infors.forEach(function (info) {
        async.waterfall([
            function functionOne(callback) {
                var user= new User(
                    {
                        username: info.username,
                        password: info.password,
                        role:'Khoa'
                    }
                );
                user.save(function (err, result) {
                    if (err){
                        console.log('sai');
                    }else {

                    }
                });

            }
        ])
    })
});



