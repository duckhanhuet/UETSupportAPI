/**
 * Created by Administrator on 17/01/2017.
 */
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
                        image : image
                    };
                }
            })

            console.log(content)

            callback(null,content)

        }else {
            callback(error,null);
        }
    });
}