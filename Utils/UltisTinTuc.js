/**
 * Created by Administrator on 17/01/2017.
 */
var cheerio = require('cheerio')
var request = require('request');
var config = require('../Config/Config')
var Entities = require('html-entities').AllHtmlEntities;
entities = new Entities();
var async = require('async');


module.exports.parserHtmlTinTuc = function (url,callbackall) {
    async.waterfall([
        function (callback) {
        console.log(url)
            request({
                uri: url,
                method: "GET",
                timeout: 10000,
                followRedirect: true,
                maxRedirects: 10
            },function (err,response,body) {
                if(err) {
                    callback(err,null)
                    return;
                }
                callback(null,body)
                return;
            })
        },
        function (body,callback) {
            var list = [];
            var $ = cheerio.load(body, {
                normalizeWhitespace: true,
                xmlMode: true
            });

            $('.views-row').each(function (i, ele) {
                var title = $('.field-content .title_term ', this).text();
                var link_temp = $('.field-content > a', this).attr('href');
                var imageLink = $('.field-content img', this).attr('src');


                //====================================
                var stringOnSpan ="";
                $('div.views-field-teaser>div>div>span', this).each(function (sec,e) {
                    stringOnSpan+=$('span').text();
                })
                //====================================
                //====================================
                if(stringOnSpan==""){
                    stringOnSpan = $('div.views-field-teaser>div>div>div>span', this).text();
                }
                if(stringOnSpan==""){
                    stringOnSpan = $('div.views-field-teaser span', this).text();
                }
                //====================================


                var container = $('div.views-field-teaser>div>div>span>span>span', this).text()
                    || $('div.views-field-teaser>div>div>span>span', this).text()
                    || stringOnSpan;

                // if(title=="") console.log("title")
                // if(container=="") console.log("containaer")
                // if(link_temp=="") console.log("linl")
                // if(imageLink=="") console.log("imageLink")
                //tao model
                //link lấy về đoi khi cps kí tự dặc biệt
                //phai decode sang string
                if (title && link_temp && imageLink && container) {
                    list[i] = {
                        title: entities.decode(title),
                        link: config.UetHostName + link_temp,
                        imageLink: imageLink,
                        content: entities.decode(container)
                    };
                }
            });
            callback(null, list)
        }
    ],callbackall)
    // request({
    //     uri: url,
    //     method: "GET",
    //     timeout: 10000,
    //     followRedirect: true,
    //     maxRedirects: 10
    // }, function(error, response, body) {
    //     if(!error){
    //
    //         var list= [];
    //         var $ = cheerio.load(body,{
    //             normalizeWhitespace: true,
    //             xmlMode: true
    //         });
    //
    //         $('.views-row').each(function (i,ele) {
    //             var title = $('.field-content .title_term ',this).text();
    //             var link_temp = $('.field-content > a',this).attr('href');
    //             var imageLink = $('.field-content img',this).attr('src');
    //
    //             var container = $('div.views-field-teaser>div>div>span>span>span',this).text()
    //                 ||$('div.views-field-teaser>div>div>span>span',this).text();
    //
    //             //tao model
    //             //link lấy về đoi khi cps kí tự dặc biệt
    //             //phai decode sang string
    //             if(title&&link_temp&&imageLink&&container){
    //                 list[i]={
    //                     title : entities.decode(title),
    //                     link : config.UetHostName+link_temp,
    //                     imageLink : imageLink,
    //                     content : entities.decode(container)
    //                 };
    //             }
    //         });
    //         callback(null,list)
    //     }
    //     callback(error,null)
    //
    // });
}