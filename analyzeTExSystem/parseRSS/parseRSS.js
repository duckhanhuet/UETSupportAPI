/**
 * Created by sm on 3/11/17.
 */
var parserRSS = require('rss-parser');
var async = require('async');
module.exports={
    feed:function (url) {
        async.waterfall([
            function (callback) {
                callback(null,url)
            },
            function (url,callback) {
                parserRSS.parseURL(url, function(err, parsed) {
                    if(err) console.log(err);
                    callback(null,parsed);
                })
            }
        ],function (err,parsed) {
            console.log(parsed.feed.title);
            parsed.feed.entries.forEach(function(entry) {
                console.log("=========================================")
                console.log(entry.title );
                console.log(entry.link );
                console.log(entry.pubDate );
            })

            ThongBaoController.create(result, function (err, list) {
                if (err) {
                    console.log(err)
                    return;
                }
                else console.log("import success")
            })
        });
    }
}



