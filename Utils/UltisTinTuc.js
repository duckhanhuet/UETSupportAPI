/**
 * Created by Administrator on 17/01/2017.
 */
var cheerio = require('cheerio')
var request = require('request');
var config = require('../Config/Config')
var Entities = require('html-entities').AllHtmlEntities;
entities = new Entities();
var async = require('async');
var utils = require('./UltisTinTuc')
var TinTucController = require('../controllers/TinTucController')
var LoaiTinTuc = require('../models/LoaiTinTuc');

module.exports.importLoaiTinTuc = function () {
    var DaoTao = new LoaiTinTuc({
        _id: 0,
        kind: "Đào Tạo"
    })
    var NghienCuu = new LoaiTinTuc({
        _id: 1,
        kind: "Nghiên Cứu"
    })
    var TongHop = new LoaiTinTuc({
        _id: 2,
        kind: "Tổng Hợp"
    })
    var HoiThao = new LoaiTinTuc({
        _id: 3,
        kind: "Hội Thảo"
    })
    var HopTac = new LoaiTinTuc({
        _id: 4,
        kind: "Hợp Tác"
    })
    var HoatDongDoan = new LoaiTinTuc({
        _id: 5,
        kind: "Hoạt Động Đoàn Thể"
    })
    var TheThaoVanHoa = new LoaiTinTuc({
        _id: 6,
        kind: "Thể Thao Văn Hóa"
    })
    var TuyenDung = new LoaiTinTuc({
        _id: 7,
        kind: "Tuyển Dụng"
    })
    //==================================
    DaoTao.save(function (err) {
        console.log("DaoTao ok")
    })
    TuyenDung.save(function (err) {
        console.log("TuyenDung ok")
    })
    TheThaoVanHoa.save(function (err) {
        console.log("TheThaoVanHoa ok")
    })
    HoatDongDoan.save(function (err) {
        console.log("HoatDongDoan ok")
    })
    HopTac.save(function (err) {
        console.log("HopTac ok")
    })
    HoiThao.save(function (err) {
        console.log("HoiThao ok")
    })

    TongHop.save(function (err) {
        console.log("TongHop ok")
    })
    NghienCuu.save(function (err) {
        console.log("NghienCuu ok")
    })
}


//parser html to object
module.exports.parserHtmlTinTuc = function (url, role, callbackall) {
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

//==========================================================
//Taoj request
var getData = function (baseUrl, role, numberPage, callback) {
    var url = baseUrl;
    var arrUrl = []
    for (var i = 0; i < numberPage; i++) {
        arrUrl.push(url + '?page=' + i)
    }
    var arr = [];
    var dem = 0;
    for (var i = 0; i < numberPage; i++) {
        var fun1 = function (callback) {
            utils.parserHtmlTinTuc(arrUrl[dem++], role, callback)
        }
        arr.push(fun1)
    }

    async.parallel(arr, function (err, result) {
        if (err) {
            console.log(err)
            callback(err, null)
        }
        else {
            var list = []
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < result[i].length; j++) {
                    list.push(result[i][j])
                }
            }
            callback(null, list)
        }
    })
}
//delete duplicate
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


module.exports.importTinTuc = function () {
    async.waterfall([
        function (callback) {
            getData("http://uet.vnu.edu.vn/coltech/taxonomy/term/93", 0, 15, function (err, list) {
                if (err) {
                    callback(err, null)
                    return;
                }
                callback(null, list)
            })
        },
        // function (data,callback) {
        //     getData("http://uet.vnu.edu.vn/coltech/taxonomy/term/96",1,2,function (err,list) {
        //         if(err) {
        //             callback(err,null)
        //             return;
        //         }
        //         callback(null,list.concat(data))
        //     });
        // },
        // function (data,callback) {
        //     getData("http://uet.vnu.edu.vn/coltech/taxonomy/term/101",2,27,function (err,list) {
        //         if(err) {
        //             callback(err,null)
        //             return;
        //         }
        //         callback(null,list.concat(data))
        //     });
        // },
        // function (data,callback) {
        //     getData("http://uet.vnu.edu.vn/coltech/taxonomy/term/95",3,4,function (err,list) {
        //         if(err) {
        //             callback(err,null)
        //             return;
        //         }
        //         callback(null,list.concat(data))
        //     });
        // },
        // function (data,callback) {
        //     getData("http://uet.vnu.edu.vn/coltech/taxonomy/term/94",4,11,function (err,list) {
        //         if(err) {
        //             callback(err,null)
        //             return;
        //         }
        //         callback(null,list.concat(data))
        //     });
        // },
        // function (data,callback) {
        //     getData("http://uet.vnu.edu.vn/coltech/taxonomy/term/97",5,12,function (err,list) {
        //         if(err) {
        //             callback(err,null)
        //             return;
        //         }
        //         callback(null,list.concat(data))
        //     });
        // },
        // function (data,callback) {
        //     getData("http://uet.vnu.edu.vn/coltech/taxonomy/term/98",6,3,function (err,list) {
        //         if(err) {
        //             callback(err,null)
        //             return;
        //         }
        //         callback(null,list.concat(data))
        //     });
        // },
        function (data, callback) {
            getData("http://uet.vnu.edu.vn/coltech/taxonomy/term/99", 7, 2, function (err, list) {
                if (err) {
                    callback(err, null)
                    return;
                }
                callback(null, list.concat(data))
            });
        },
        function (data, callback) {
            //xoa cacs baif bij trung
            var result = deleteDuplicate(data)
            callback(null, result)

        },
        /*
         * Chay tung ham de boc tac thoi gian nen mat kha nhieu thi gio
         */
        function (result, callback) {
            var stack = []
            var dem = 0;
            stack.push(function (callback) {
                callback(null, result)
            })
            //make stack request to server
            for (var i = 0; i < result.length; i++) {
                var prototype = function (data, callback) {
                    //gui request len server
                    console.log(dem)
                    detailRequest(result[dem++].link, function (err, date) {
                        data[--dem].postAt = date;
                        dem++;
                        callback(null, result)
                    })
                }
                stack.push(prototype)
            }
            async.waterfall(stack, function (err, result) {
                if (err) {
                    console.log(err)
                    callback(err, null)
                }
                callback(null, result)
            })
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
function detailRequest(url, callback) {
    console.log(url)
    async.waterfall([
        function (callback) {
            request({
                uri: url,
                method: "GET",
                timeout: 60000,
                followRedirect: true,
                maxRedirects: 10
            }, function (err, response, body) {
                if (err) {
                    callback(err, null)
                    return;
                }
                callback(null, body)
                return;
            })
        },
        function (body, callback) {
            var $ = cheerio.load(body, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            var stringDate = $('.node .submitted').text().trim();
            console.log(stringDate)
            var date = chuanHoaDate(stringDate)
            console.log(date)
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

//tao request trong async
function makeRequest(url, callback) {
    console.log(url)
    request({
        uri: url,
        method: "GET",
        timeout: 60000,
        followRedirect: true,
        maxRedirects: 10
    }, function (err, response, body) {
        if (err) {
            callback(err, null)
            return;
        }
        callback(null, body)
        return;
    })
}
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
            ele.attribs.href = config.UetHostName+ele.attribs.href;
        }

    })
    console.log('===================================')
    $$('img').each(function (i, ele) {
        if (ele.attribs.src.toString().search('http://') < 0) {
            ele.attribs.src = config.UetHostName+ele.attribs.src;
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