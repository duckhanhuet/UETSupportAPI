/**
 * Created by Administrator on 17/01/2017.
 */

var TinTucController = require('../controllers/TinTucController');

var cheerio = require('cheerio')
var request = require('request');
module.exports.parserHtmlTinTuc = function (url,callback) {
    request({
        uri: url,
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10
    }, function(error, response, body) {
        if(!error){

            var content= [];
            var $ = cheerio.load(body,{
                normalizeWhitespace: true,
                xmlMode: true
            });

            $('.views-row').each(function (i,ele) {
                var title = $('.field-content .title_term ',this).text();
                var link = $('.field-content > a',this).attr('href');
                var image = $('.field-content img',this).attr('src');
                if(title!=""){
                    content[i]={
                        title : title,
                        link : link,
                        imageLink : image
                    };
                    TinTucController.create(content[i],function (err, result) {
                        if (err){

                        }
                        else {
                            console.log('website have updated some new news: '+result);
                        }

                    })
                }
            })

            console.log(content)

            callback(null,content)

        }else {
            callback(error,null);
        }
    });
}