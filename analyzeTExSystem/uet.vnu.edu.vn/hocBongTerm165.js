/**
 * Created by sm on 3/13/17.
 */
// tuong tu nhu term 53 thong bao, khi chinh sua xong thi coppy past sang la ok
/**
 * Created by sm on 12/2/2017.
 */
var cheerio = require('cheerio')
var request = require('request');
var config = require('../../Config/Config')
var Entities = require('html-entities').AllHtmlEntities;
entities = new Entities();
var async = require('async');

var File=require('../../models/File')

var ThongBaoController = require('../../controllers/ThongBaoController')
var FileController=require('../../controllers/FileController');
var LoaiThongBao = require('../../models/LoaiThongBao');
/**
 * parse trang chu để lấy dự liệu
 */
const PageFirst=config.UetHostName + "/coltech/taxonomy/term/165";
const LinkPrint=config.UetHostName+"/coltech/print/";
var IndexLast = 0;// bien toan cuc
// page cuoi cung cua trang == lastIndicator
//===========================
// file phân tich trang thong bao Sinhvien http://uet.vnu.edu.vn/coltech/taxonomy/term/165
// các trang như Tin tức sinh vien, gương mặt tiêu biểu làm tương tự ...
module.exports ={
    analyzeAtFirst:function () {
        var arrLoaiThongBao = [];
        // bo qua viec phan tich Gương mặt tiêu biểu, Tin tức,Danh sách thi,Kết quả học tập,Học phí,Học bổng
        // cac trang nay co cau truc hơi khác nhau nên k thể gộp lại phân tích cùng 1 lúc.
        // hien tai fix cung 1 loai thong bao duy nhat la :TatCa
        var loaithongbao0 = new LoaiThongBao({
            _id: 0,
            tenLoaiThongBao: 'TatCa',
        });
        arrLoaiThongBao.push(loaithongbao0);
        async.waterfall([
            function (callback) {
                callback(null, arrLoaiThongBao)
            },
            function (arrLoaiThongBao, callback) {
                // tim trang cuoi cung , ket qua duoc luu tru trong bien IndexLast
                parseUrlLastIndicator(arrLoaiThongBao, callback)
            },
            function (arrLoaiThongBao, callback) {
                getAllUrlPageThongBao(arrLoaiThongBao, callback)
            },
            /**
             * mảng Url có các trường
             * http://uet.vnu.edu.vn/coltech/taxonomy/term/93?page=0
             */
                function (arrURL,arrLoaiThongBao, callback) {
                // lay tat ca cac tieu de va link thong bao. set idloaithongbao
                getAllUrlThongBao(arrURL,arrLoaiThongBao, callback)
            },
            function (arrThongBao, callback) {
                // kiem tra trung lap
                var arr = deleteDuplicate(arrThongBao)
                callback(null, arr)
            },
            function (arrThongBao, callback) {
                // lay time and content thong bao
                getDateContentThongBao(arrThongBao, callback)
            }
        ], function (err, result) {
            ThongBaoController.create(result, function (err, list) {
                if (err) {
                    console.log(err)
                    return;
                }
                else {
                    console.log("import success")
                }
            })
        })
    },
    analyze:function () {
        var arrLoaiThongBao = [];

        // hien tai fix cung 1 loai thong bao duy nhat la :TatCa
        var loaithongbao0 = new LoaiThongBao({
            _id: 0,
            tenLoaiThongBao: 'TatCa',
        });
        arrLoaiThongBao.push(loaithongbao0);
        async.waterfall([
            function (callback) {
                callback(null,[{link:PageFirst}],arrLoaiThongBao );
            },
            function (arrURL,arrLoaiThongBao, callback) {
                getAllUrlThongBao(arrURL,arrLoaiThongBao, callback)
            },
            function (arrThongBao, callback) {
                var arr = deleteDuplicate(arrThongBao)
                callback(null, arr)
            },
            function (arrThongBao, callback) {
                getDateContentThongBao(arrThongBao, callback)
            }
        ], function (err, result) {
            if(!err)
                InsertDatabase(result);
            else console.log('import Wrong')
        })
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
            ThongBaoController.create(data[i], function (err, result) {
                if (err) {
                    console.log("notif exist")

                }
                else {
                    console.log("import notif success")
                    // luu file cua thong bao
                    FileController.create(result.idFile,function (err) {

                    })
                    /**
                     * thuc hien viec gui thong bao den dien thoai tai day
                     * thong la moi va da dc import  vao csdl
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
            var linkthongbao = PageFirst;// fix cung trang
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
        if (err){
            console.log(err);
            callback(err,null)
        }
        else callback(null, result)
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
function getAllUrlPageThongBao(arrLoaiThongBao, callback) {
    var arrUrl = []
    for (let indicator = 0; indicator <= IndexLast; indicator++) {
        var url = PageFirst+ "?page=" + indicator; //http://uet.vnu.edu.vn/coltech/taxonomy/term/93?page=?
        // console.log(url);
        var obj = {
            link: url,
            role: 0,// fix cung la tat ca
        }
        arrUrl.push(obj)
        // mang tra ve tat ca cac trang
    }
    callback(null, arrUrl,arrLoaiThongBao)
}
/**
 * lấy tất cả các url của tất cả trnag bài viết
 * cacs dữ liệu truyền
 * @param list :
    * link : url
 * role : list[i].role
 * @param callbackAll
 */
function getAllUrlThongBao(list,arrLoaiThongBao, callbackAll) {
    var arrFun = [];
    var firstFun = function (callback) {
        callback(null, []);
    };
    arrFun.push(firstFun);
    for (let i = 0; i < list.length; i++) {
        var fun = function (arr, callback) {
            parserHtmlThongBao(list[i].link,arrLoaiThongBao, function (err, result) {
                if (err) callback(err, null)
                else callback(null, arr.concat(result))// mang arr noi tat ca cac result tra ve
            })
        };
        arrFun.push(fun)
    }
    async.waterfall(arrFun, function (err, result) {// thuc hien tuan tu phan tich cac page
        if (err) callbackAll(err, null);
        else callbackAll(null, result)
    })
}
/**
 * lay noi dung va thoi gian cua thong bao theo tuan tu tung thong bao
 */
function  getDateContentThongBao(result, callback) {
    var stack = []
    stack.push(function (callback) {
        callback(null, result)
    })
    //make stack request to server
    for (let i = 0; i < result.length; i++) {
        var prototype = function (data, callback) {
            //gui request len server
            detailRequest(data[i].link, function (err, dateAndContent) {
                data[i].time = dateAndContent.date;
                data[i].noiDung = entities.decode(dateAndContent.content).toLowerCase().trim();
                data[i].idFile =dateAndContent.attachment;
                callback(null, data)
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
function parserHtmlThongBao(url,arrLoaiThongBao, callbackall) {
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
                //phan nay sau phai phan tich tieu de de chon ra loai thong bao, su dung arrLoaiThongBao
                //..........


                // lay link lien ket
                var link_temp = $('.field-content > a', this).attr('href');

                //tao model
                //link lấy về đoi khi cps kí tự dặc biệt
                //phai decode sang string
                if (title && link_temp) {
                    list.push({
                        tieuDe: entities.decode(title).toLowerCase().trim(),// title
                        link: (config.UetHostName + link_temp).trim().toLowerCase(),// link thong bao
                        idLoaiThongBao: arrLoaiThongBao[0]._id ,//mac dinh loai thong bao tat ca, 0
                    });
                }
            });
            callback(null, list)
        }
    ], callbackall)
}
function deleteDuplicate(a) {
    // xoa trung lap  neu thong bao co tieu de trung lap da xuat hien
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
    var urlPrint=getLinkPrint(url);
    async.waterfall([
        function (callback) {
            makeRequest(urlPrint, callback)
        },
        function (body, callback) {
            var $ = cheerio.load(body, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            var stringDate = $('.node .submitted').text().trim();
            var date = chuanHoaDate(stringDate);
            var content="";
            $('div.content .rtejustify').each(function (i, elem) {
                content+="\n";
                content+=$(this).text().trim();
            });
            var attachment=[], name,link;
            $('.rtejustify a').each(function (i, elem) {
                name=entities.decode($(this).text()).toLowerCase().trim();
                link=$(this).attr('href');
                attachment.push(new File({tenFile:name,link:link}));
            })

            $('#attachments a').each(function (i, elem) {
                name=entities.decode($(this).text()).toLowerCase().trim();
                link=$(this).attr('href');
                attachment.push(new File({tenFile:name,link:link}));
            });
            callback(null,{date:date,content:content,attachment:attachment} );
        }
    ], function (err, result) {
        if (err) {
            console.log(err)
            callback(err,null);
            return;
        }
        else callback(null, result)
    })
}
function getLinkPrint(url) {
    var split=url.toString().split("/");
    var item=split[split.length-1];
    var link=LinkPrint+item;
    return link;
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
    // console.log(url)
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
        else callback(null, body)
    })
}
