/**
 * Created by sm on 3/12/17.
 */
var CronJob = require('cron').CronJob;
var term53 = require('../analyzeTExSystem/uet.vnu.edu.vn/thongBaoTerm53');
var config = require('../Config/Config');
var parseRSS= require('./parseRSS/parseRSS');
module.exports=function () {
    try {

        console.log("start alalyze the exist System");
        var job = new CronJob('00 30 * * * *', function () {
                if (config.atFirst==true) {
                    term53.analyzeAtFirst();
                } else {
                    term53.analyze();
                }
            }, function () {
                /* This function is executed when the job stops */

            },
            true, /* Start the job right now */
            'America/Los_Angeles' /* Time zone of this job. */
        );
    } catch (ex) {
        console.log("cron pattern not valid");
    }
}