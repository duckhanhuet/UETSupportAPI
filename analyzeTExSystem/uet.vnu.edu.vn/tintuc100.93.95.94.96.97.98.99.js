/**
 * Created by sm on 3/14/17.
 */
/**
 * Created by Administrator on 17/01/2017.
 */
var cheerio = require('cheerio')
var request = require('request');
var config = require('../Config/Config')
var Entities = require('html-entities').AllHtmlEntities;
entities = new Entities();
var async = require('async');
var TinTucController = require('../controllers/TinTucController')
var LoaiTinTuc = require('../models/LoaiTinTuc');

module.exports.test = function () {
    async.waterfall([
        function (callback) {
            LoaiTinTuc.find({}).exec(function (err,result) {
                var arr = []
                for(let i=0;i<result.length;i++){
                    var obj = {
                        link :result[i].linkPage,
                        role : result[i]._id
                    }
                    arr.push(obj)
                }
                callback(null,arr)
            })
        },
        function (arrLoaiTinTuc,callback) {
            getAllUrlTinTuc(arrLoaiTinTuc,callback)
        },
        function (arrTinTuc, callback) {
            var arr = deleteDuplicate(arrTinTuc)
            callback(null, arr)
        },
        function (arrTinTuc,callback) {
            findInDatabaseAndDelete(arrTinTuc,callback);
        },
        function (arrTinTuc, callback) {
            getPostAllForEachTinTuc(arrTinTuc, callback)
        }
    ],function (err,result) {
        if (err) console.log(err)
        if (result) {
            if (result.length != 0) {
                //do'nt anything
            } else {
                //send notification
            }
        }
    })
}

/**
 * parse trang chu để lấy dự liệu
 */
module.exports.parseMainPage = function (mainUrl) {
    async.waterfall([
        function (callback) {
            makeRequest(mainUrl, callback)
        },
        function (data, callback) {
            parsePage(data, callback)
        },
        function (data, callback) {
            var arr = [];
            for (let i = 0; i < data.length; i++) {
                var loaitintuc = new LoaiTinTuc({
                    _id: i,
                    linkPage: config.UetHostName + data[i].link,
                    kind: data[i].loai
                });
                arr.push(loaitintuc)
            }
            callback(null, arr)
        },
        function (arrLoaiTinTuc, callback) {
            LoaiTinTuc.create(arrLoaiTinTuc, function (err, result) {

                callback(null, arrLoaiTinTuc)
            })
        },
        function (arrLoaiTinTuc, callback) {
            parseUrlLastIndicator(arrLoaiTinTuc, callback)
        },
        /**
         * mảng obj có các trường
         * link : url của main
         * lastIndicator : trang cuối cùng của link
         * kind : loại tin tức
         */
            function (list, callback) {
            getAllUrlPageTinTuc(list, callback)
        },
        /**
         * mảng Url có các trường
         * http://uet.vnu.edu.vn/coltech/taxonomy/term/93?page=0
         */
            function (arrURL, callback) {
            getAllUrlTinTuc(arrURL, callback)
        },
        function (arrTinTuc, callback) {
            var arr = deleteDuplicate(arrTinTuc)
            callback(null, arr)
        },
        function (arrTinTuc, callback) {
            getPostAllForEachTinTuc(arrTinTuc, callback)
        }
    ], function (err, result) {
        TinTucController.create(result, function (err, list) {

            if (err) {
                console.log(err)
                return;
            }
            else console.log("import success")
        })
    })
}
/**
 * get URL ca trang
 * Lấy link và tên của từng loại tin tức
 * @param data HTML của trang chủ tin tức
 * @param callback
 */
function parsePage(data, callback) {
    var list = [];
    var $ = cheerio.load(data, {
        normalizeWhitespace: true,
        xmlMode: true
    });
    $('#block-menu-menu-tin-tuc-su-kien-r .menu .leaf').each(function (i, ele) {
        var link = $('a', this).attr('href');
        var loaitintuc = $('a', this).text();
        var obj = {
            link: link,
            loai: loaitintuc
        };
        //bo qua cái cuối cùng tức là tin tức
        //dang test
        if (i == 0 || i == 8) {
        } else {
            list.push(obj);
        }
    });
    callback(null, list);
}
/**
 * get All page by URL
 * Lấy tát cả các
 * @param arrLoaiTinTuc
 * @param callback
 *
 * đầu ra của hàm
 * link : loaiTinTuc.linkPage,
 * kind : loaiTinTuc.kind,
 * lastIndicator : last,  // số trang cuối cùng của từng loại
 * role : loaiTinTuc._id
 */
function parseUrlLastIndicator(arrLoaiTinTuc, callbackall) {
    var arr = []
    for (let i = 0; i < arrLoaiTinTuc.length; i++) {
        var fun = function (callback) {
            getObjIndicator(arrLoaiTinTuc[i], function (err, result) {
                callback(err, result)
            })
        }
        arr.push(fun)
    }
    async.parallel(arr, function (err, result) {
        if (err) {
            callbackall("err", null)
            return;
        }
        if (result) {
            if (result.length >= 0) {
                callbackall(null, result)
                return;
            }
        }

    })
}
//parse indicator for mainURLpage
function getObjIndicator(loaiTinTuc, callbackall) {
    async.waterfall([
        function (callback) {
            makeRequest(loaiTinTuc.linkPage, callback)
        },
        function (body, callback) {
            var list = [];
            var $ = cheerio.load(body, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            var lastIndicator = $('.pager-last a').attr('href');
            var last = lastIndicator.split('=')[1];
            var obj = {
                link: loaiTinTuc.linkPage,
                kind: loaiTinTuc.kind,
                lastIndicator: last,
                role: loaiTinTuc._id
            };
            callback(null, obj)
        }
    ], function (err, result) {

        if (err) {
            {
                callbackall("err", null)
                return;
            }
        }
        console.log(result)
        callbackall(null, result)
        return;
    })
}
/**
 * /lấy tất cả url của các trang bài viết
 * @param list
 * link : loaiTinTuc.linkPage,
 * kind : loaiTinTuc.kind,
 * lastIndicator : last,
 * role : loaiTinTuc._id
 * @param callback
 */
function getAllUrlPageTinTuc(list, callback) {
    var arrUrl = []
    for (let i = 0; i < list.length; i++) {
        for (let indicator = 0; indicator <= list[i].lastIndicator; indicator++) {
            var url = list[i].link + "?page=" + indicator; //http://uet.vnu.edu.vn/coltech/taxonomy/term/93?page=0
            var obj = {
                link: url,
                role: list[i].role
            }
            arrUrl.push(obj)
        }

    }
    callback(null, arrUrl)
}
/**
 * lấy tất cả các url của tất cả trnag bài viết
 * cacs dữ liệu truyền
 * @param list :
    * link : url
 * role : list[i].role
 * @param callbackAll
 */
function getAllUrlTinTuc(list, callbackAll) {
    var arrFun = [];
    var firstFun = function (callback) {
        callback(null, []);
    };
    arrFun.push(firstFun);
    for (let i = 0; i < list.length; i++) {
        var fun = function (arr, callback) {
            parserHtmlTinTuc(list[i].link, list[i].role, function (err, result) {
                if (err) callback(err, null);
                callback(null, arr.concat(result))
            })
        };
        arrFun.push(fun)
    }
    async.waterfall(arrFun, function (err, result) {
        if (err) callbackAll(err, null);
        if (result) {
            if (result.length >= 0) {
                callbackAll(null, result)
                return;
            }
        }
        callbackAll("err", null)

    })
}
/**
 * vì trong trang mail ko có thời gian post các bài viết nên
 * phair vào từng trang để lấy nên mất khá nhiều thì giờ
 * @param datas : mảng các tin tức
 * @param callback
 */
function getPostAllForEachTinTuc(result, callback) {
    if(!result){
        callback(null,null)
    }
    else {
        var stack = []
        stack.push(function (callback) {
            callback(null, result)
        })
        //make stack request to server
        for (let i = 0; i < result.length; i++) {
            var prototype = function (data, callback) {
                //gui request len server
                detailRequest(result[i].link, function (err, date) {
                    data[i].postAt = date;
                    callback(null, result)
                })
            }
            stack.push(prototype)
        }
        async.waterfall(stack, function (err, result) {
            if (err) {
                console.log(err);
                callback(err, null)
            }
            if (result) {
                if (result.length >= 0)
                    callback(null, result)
            }
        })
    }

}
//parser html to object
//get link,ten,anh
function parserHtmlTinTuc(url, role, callbackall) {
    async.waterfall([
        function (callback) {
            makeRequest(url, callback)
        },
        function (body, callback) {
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
                var stringOnSpan = "";
                $('div.views-field-teaser>div>div>span', this).each(function (sec, e) {
                    stringOnSpan += $('span').text();
                })
                //====================================
                //====================================
                if (stringOnSpan == "") {
                    stringOnSpan = $('div.views-field-teaser>div>div>div>span', this).text();
                }
                if (stringOnSpan == "") {
                    stringOnSpan = $('div.views-field-teaser>div>p', this).text();
                }
                if (stringOnSpan == "") {
                    stringOnSpan = $('div.views-field-teaser span', this).text();
                }
                //====================================
                var container = $('div.views-field-teaser>div>div>span>span>span', this).text()
                    || $('div.views-field-teaser>div>div>span>span', this).text()
                    || stringOnSpan;
                //tao model
                //link lấy về đoi khi cps kí tự dặc biệt
                //phai decode sang string
                if (title && link_temp && imageLink && container) {
                    list.push({
                        title: entities.decode(title).toLowerCase().trim(),
                        link: (config.UetHostName + link_temp).trim().toLowerCase(),
                        imageLink: imageLink.trim(),
                        content: entities.decode(container).toLowerCase().trim(),
                        loaiTinTuc: role
                    });
                }
            });
            callback(null, list)
        }
    ], callbackall)
}
function deleteDuplicate(a) {
    var list = a;
    for (var i = 0; i < list.length; i++) {
        var obj = list[i];
        var copying = []
        for (var j = i + 1; j < list.length; j++) {
            if (obj.link.toLowerCase().trim() == list[j].link.toLowerCase().trim()) {
                copying.push(list[j])
            }
        }
        if (copying.length > 0) {
            list = list.filter(function (el) {
                return copying.indexOf(el) < 0;
            });
        }
    }
    return list;
}
function detailRequest(url, callback) {
    async.waterfall([
        function (callback) {
            makeRequest(url, callback)
        },
        function (body, callback) {
            var $ = cheerio.load(body, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            var stringDate = $('.node .submitted').text().trim();
            console.log(stringDate);
            var date = chuanHoaDate(stringDate);
            console.log(date);
            callback(null, date)
        }
    ], function (err, result) {
        if (err) {
            console.log(err)
            return;
        }
        callback(null, result)
    })
}
function chuanHoaDate(string) {
    //string dang MM,DD,YYYY
    var stringDate = string.split(',')[1].trim().split(' ')[0].trim();
    var arr = stringDate.split('/');
    // new Date(YYYY,MM,DD)
    var str = arr[2].trim() + "-" + arr[0].trim() + "-" + arr[1].trim();
    var date = new Date(str.trim());
    return date
}
//===================================================
//tra lại body html
module.exports.adapter = function (url, finish) {
    async.waterfall([
        function (callback) {
            makeRequest(url, callback)
        },
        function (body, callback) {
            getMainHTML(body, callback)
        }
    ], function (err, result) {
        if (err) {
            console.log(err)
            return
        }
        finish(null, result)
    })
}
/**
 * phan tich tràn detail TinTuc
 * code nay kha lằng nhằng
 * - chen them href cho các the a, img
 * - them css
 * - tao layout mới
 * @param body
 * @param callback
 */
var getMainHTML = function (body, callback) {
    var $ = cheerio.load(body, {
        normalizeWhitespace: true,
        xmlMode: true
    });
    var title = entities.decode($('#main>.title').html());
    //them href len server uet
    var mainHtml = $('#main').html();
    var $$ = cheerio.load(mainHtml, {
        normalizeWhitespace: true,
        xmlMode: true
    });
    $$('a').each(function (i, ele) {
        if (ele.attribs.href.toString().search('http://') < 0) {
            ele.attribs.href = config.UetHostName + ele.attribs.href;
        }
    })
    console.log('===================================')
    $$('img').each(function (i, ele) {
        if (ele.attribs.src.toString().search('http://') < 0) {
            ele.attribs.src = config.UetHostName + ele.attribs.src;
        }
        console.log(ele.attribs.src)
    })
    $$('<hr>').insertAfter('.submitted')
    //xoa vai thu ko can thiet
    $$('.links').remove()
    $$('.print-link').remove()
    var main = entities.decode($$('.node').html());
    var result = {
        title: title,
        main: main
    }
    callback(null, result)
}
/**
 * Tim kiem trong csdl
 *  * neu nhu ton tai thi xoa ban ghi do di
 *  * chua ton tai thi de nguyen
 * @param arrTinTuc
 * @param callback
 */
function findInDatabaseAndDelete(arrTinTuc,callback) {
    console.log(arrTinTuc.length)
    TinTucController.find({},function (err,result) {
        var arrResult = [];
        for(let pos = 0;pos<arrTinTuc.length;pos++){
            var newTinTuc = arrTinTuc[pos];
            let count = 0;
            for(let sec = 0;sec<result.length;sec++){
                var old = result[sec];
                if(newTinTuc.link != old.link){
                    count++;
                }
            }
            if(count!=result.length-1){
                arrResult.push(newTinTuc)
            }
        }


        if(err) {
            callback(err,null)
            return;
        }
        callback(null,arrResult)
    })
}
//tao request trong async
function makeRequest(url, callback) {
    console.log(url)
    request({
        uri: url,
        method: "GET",
        timeout: 200000,
        followRedirect: true,
        maxRedirects: 10
    }, function (err, response, body) {
        if (err) {
            //callback(err, null)
            return;
        }
        callback(null, body)
        return;
    })
}
