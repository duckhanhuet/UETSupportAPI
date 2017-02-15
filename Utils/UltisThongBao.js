/**
 * Created by SmallMouse on 12/2/2017.
 */
var cheerio = require('cheerio')
var request = require('request');
var config = require('../Config/Config')
var Entities = require('html-entities').AllHtmlEntities;
entities = new Entities();
var async = require('async');
var ThongBaoController = require('../controllers/ThongBaoController')
var LoaiThongBao = require('../models/LoaiThongBao');
/**
 * parse trang chu để lấy dự liệu
 */

var IndexLast = 0;// bien toan cuc
// page cuoi cung cua trang == lastIndicator
//===========================
// file phân tich trang thong bao Sinhvien http://uet.vnu.edu.vn/coltech/taxonomy/term/53
// các trang như Tin tức sinh vien, gương mặt tiêu biểu làm tương tự ...
module.exports.parseMainPage = function () {
    var arr = [];
    // bo qua viec phan tich Gương mặt tiêu biểu, Tin tức,Danh sách thi,Kết quả học tập,Học phí,Học bổng
    // cac trang nay co cau truc hơi khác nhau nên k thể gộp lại phân tích cùng 1 lúc.
    // hien tai fix cung 1 loai thong bao duy nhat la :TatCa
    var loaithongbao0 = new LoaiThongBao({
        _id: 0,
        tenLoaiThongBao: 'TatCa',
    });
    arr.push(loaithongbao0);
    async.waterfall([
        function (callback) {
            callback(null, arr)
        },
        function (arr, callback) {
            // tim trang cuoi cung
            parseUrlLastIndicator(arrLoaiThongBao, callback)
        },
        function (list, callback) {
            getAllUrlPageThongBao(list, callback)
        },
        /**
         * mảng Url có các trường
         * http://uet.vnu.edu.vn/coltech/taxonomy/term/93?page=0
         */
            function (arrURL, callback) {
            getAllUrlThongBao(arrURL, callback)
        },
        function (arrThongBao, callback) {
            var arr = deleteDuplicate(arrThongBao)
            callback(null, arr)
        },
        function (arrThongBao, callback) {
            getPostAllForEachThongBao(arrThongBao, callback)
        }
    ], function (err, result) {
        ThongBaoController.create(result, function (err, list) {
            if (err) {
                console.log(err)
                return;
            }
            else console.log("import success")
        })
    })
}
/**
 * get All page by URL
 * Lấy tát cả các
 * @param arrLoaiThongBao
 * @param callback
 *
 * đầu ra của hàm
 * IndexLast : last,  // số trang cuối cùng của từng loại
 */
function parseUrlLastIndicator(arrLoaiThongBao, callback) {
    getObjIndicator(arrLoaiThongBao, function (err, result) {
        callback(err, result)
    })
}
//parse indicator for mainURLpage
function getObjIndicator(arrLoaiThongBao, callback) {
    async.waterfall([
        function (callback) {
            var linkthongbao = config.UetHostName + "/coltech/taxonomy/term/53";// fix cung trang
            makeRequest(linkthongbao, callback)
        },
        function (body, callback) {
            var $ = cheerio.load(body, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            var lastIndicator = $('.pager-last a').attr('href');
            // IndexLast la bien toan cuc , ham nay thay vi tra ve IndexLast thi se van tra ve arrLoaiThongBao
            IndexLast = lastIndicator.split('=')[1];
            callback(null, arrLoaiThongBao)
        }
    ], function (err, result) {
        if (err) console.log(err);
        callback(null, result)
    })
}
/**
 * /lấy tất cả url của các trang bài viết
 * @param list
 * link : loaiThongBao.linkPage,
 * kind : loaiThongBao.kind,
 * lastIndicator : last,
 * role : loaiThongBao._id
 * @param callback
 */
function getAllUrlPageThongBao(list, callback) {
    var arrUrl = []
    for (let indicator = 0; indicator <= IndexLast; indicator++) {
        var url =  config.UetHostName + "/coltech/taxonomy/term/53 "+"?page=" + indicator; //http://uet.vnu.edu.vn/coltech/taxonomy/term/93?page=0
        var obj = {
            link: url,
            role: "TatCa",// fix cung la tat ca
        }
        arrUrl.push(obj)
        // mang tra ve tat ca cac trang
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
function getAllUrlThongBao(list, callbackAll) {
    var arrFun = [];
    var firstFun = function (callback) {
        callback(null, []);
    };
    arrFun.push(firstFun);
    for (let i = 0; i < list.length; i++) {
        var fun = function (arr, callback) {
            parserHtmlThongBao(list[i].link, list[i].role, function (err, result) {
                if (err) callback(err, null);
                callback(null, arr.concat(result))// mang arr noi tat ca cac result tra ve
            })
        };
        arrFun.push(fun)
    }
    async.waterfall(arrFun, function (err, result) {// thuc hien tuan tu phan tich cac page
        if (err) callbackAll(err, null);
        callbackAll(null, result)
    })
}
/**
 * vì trong trang mail ko có thời gian post các bài viết nên
 * phair vào từng trang để lấy nên mất khá nhiều thì giờ
 * @param datas : mảng các tin tức
 * @param callback
 */
function getPostAllForEachThongBao(result, callback) {
    var stack = []
    stack.push(function (callback) {
        callback(null, result)
    })
    //make stack request to server
    for (let i = 0; i < result.length; i++) {
        var prototype = function (data, callback) {
            //gui request len server
            detailRequest(result[i].link, function (err, date) {
                data[i].time = date;// postAt
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
        callback(null, result)
    })
}
//parser html to object
function parserHtmlThongBao(url, role, callbackall) {
    // phan tich tung trang thong bao
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
                //lay tieu de
                var title = $('.field-content .title_term ', this).text();
                //phan nay sau phai phan tich tieu de de chon ra loai thong bao
                //..........
                // lay link lien ket
                var link_temp = $('.field-content > a', this).attr('href');
                //====================================
                var stringOnSpan = "";
                // lay noi dung thong bao
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
                if (title && link_temp && container) {
                    list.push({
                        tieuDe: entities.decode(title).toLowerCase().trim(),// title
                        link: (config.UetHostName + link_temp).trim().toLowerCase(),// link thong bao
                        noiDung: entities.decode(container).toLowerCase().trim(),//content
                        idLoaiThongBao: role//loaiThongBao ("tatca")
                    });
                }
            });
            callback(null, list)
        }
    ], callbackall)
}
function deleteDuplicate(a) {
    // xoa trung lap
    var list = a;
    for (var i = 0; i < list.length; i++) {
        var obj = list[i];
        var copying = []
        for (var j = i + 1; j < list.length; j++) {
            if (obj.link.toLowerCase().trim() == list[j].link.toLowerCase().trim()) {// kiem tra link trung lap
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
// doan nay khong hieu lam ?? check lai

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
 * phan tich tràn detail ThongBao
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
            callback(err, null)
            return;
        }
        callback(null, body)
        return;
    })
}
