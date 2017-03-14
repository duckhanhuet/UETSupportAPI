/**
 * Created by sm on 3/11/17.
 */
var parserRSS = require('rss-parser');
var async = require('async');
var TinTucController=require('../../controllers/TinTucController')
module.exports={
    feed:function (url) {
        async.waterfall([
            function (callback) {
                callback(null,url)
            },
            function (url,callback) {
                parserRSS.parseURL(url, function(err, parsed) {
                    if(err){
                        console.log(err);
                        callback(err,null);
                    }
                    callback(null,parsed);
                })
            }
        ],function (err,parsed) {
            if(!err){
                console.log(parsed.feed.title);
                var arrNews=[];
                parsed.feed.entries.forEach(function(entry) {
                    /**
                     * entry include title, link, pubDate,content, contentSnippet,
                     */
                    var imageLink=findImageLink(entry.content);
                    if(imageLink!="haven'tImage"){
                        arrNews.push({
                            title:entry.title,
                            link:entry.link,
                            content:entry.contentSnippet,
                            imageLink: imageLink
                        })
                    }else{
                        arrNews.push({
                            title:entry.title,
                            link:entry.link,
                            content:entry.contentSnippet,
                        })
                    }
                })
                InsertDatabase(arrNews);
            }
        });
    }
}

function InsertDatabase(result) {
    var stack = []
    stack.push(function (callback) {
        callback(null, result)
    })
    //make stack request to server
    for (let i = 0; i < result.length; i++) {
        var prototype = function (data, callback) {
            //luu tru vao csdl
            TinTucController.create(data[i], function (err, result) {
                if (err) {
                    console.log("News exist")

                }
                else {
                    console.log("import News success")
                    /**
                     * thuc hien viec gui tin tuc den dien thoai tai day
                     * tin tuc la moi va da dc import  vao csdl
                     * */
                }
                callback(null,data);
            })
        }
        stack.push(prototype)
    }
    async.waterfall(stack, function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log("import done!");
    })
}
function findImageLink(content) {
    var position = content.indexOf("img");
    var havePicture="haven'tImage";
    if(position!=-1){
        var split=content.split('"');
        split.forEach(function (p) {
            var haveLinkImage=p.indexOf("png");
            haveLinkImage=p.indexOf("jpg");
            if(haveLinkImage!=-1){
                havePicture=p;
            }
        })
    }
    return havePicture;
}



