const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function formatDateTime(date, str) {
    var format = str || 'yyyy-mm-dd', date = new Date(date), year = '' + date.getFullYear(), month = '0' + (date.getMonth() + 1), day = '0' + date.getDate(), hour = '0' + date.getHours(), minute = '0' + date.getMinutes(), second = '0' + date.getSeconds();
    if (format.match(/(y+)/g)) format = format.replace(RegExp.$1, year.substr(0 - RegExp.$1.length));
    if (format.match(/(m+)/g)) format = format.replace(RegExp.$1, month.substr(0 - RegExp.$1.length));
    if (format.match(/(d+)/g)) format = format.replace(RegExp.$1, day.substr(0 - RegExp.$1.length));
    if (format.match(/(h+)/g)) format = format.replace(RegExp.$1, hour.substr(0 - RegExp.$1.length));
    if (format.match(/(M+)/g)) format = format.replace(RegExp.$1, minute.substr(0 - RegExp.$1.length));
    if (format.match(/(s+)/g)) format = format.replace(RegExp.$1, second.substr(0 - RegExp.$1.length));
    return format;
}

function logsError(req, err) {
    let url = (req.baseUrl + req.path).replace(/\//g, '_'), method = req.method;
    let filename = path.join(__dirname, `../logs/${formatDateTime(Date.now(), 'yyyy_mm_dd_hh_MM_ss')}_${method}_${url}.txt`)
    let query = JSON.stringify(req.query), body = JSON.stringify(req.body), errMsg = [];
    errMsg.push(`query: ${query}\n`);
    errMsg.push(`body: ${body}\n`);
    errMsg.push(`message: ${err.message}\n`);
    errMsg.push(`stack: ${err.stack}\n`);
    fs.writeFile(filename, errMsg.join(''), () => { });
}

module.exports = {
    successHandler: function (res, result) {
        res.json({ code: 200, result: result });
    },
    errorHandler: function (res, err, code = 101) {
        if (typeof(err) == 'string' || code != 101) {
            res.json({ code: code, msg: err });
        } else {
            logsError(res.req, err);
            res.json({ code: code, msg: '系统错误' });
        }
    },
    md5: function (str) {
        return crypto.createHash('md5').update(str).digest('hex');
    }
}