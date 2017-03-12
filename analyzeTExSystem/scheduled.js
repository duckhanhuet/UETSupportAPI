/**
 * Created by sm on 3/12/17.
 */
var CronJob = require('cron').CronJob;
var term53 =require('../analyzeTExSystem/uet.vnu.edu.vn/thongBaoTerm53');
try {
    var job = new CronJob('00 30 * * * *', function() {

        }, function () {
            /* This function is executed when the job stops */

        },
        true, /* Start the job right now */
        'America/Los_Angeles' /* Time zone of this job. */
    );
} catch(ex) {
    console.log("cron pattern not valid");
}