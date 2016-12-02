'use strict'
var util = require('util');
var request = require('request');

module.exports.status = function (sourceObj, callback) {
    console.log('executing status call');

    var opts = module.exports.buildRawRequest(sourceObj);
    opts.url += '/status';
    performCall(opts, callback);
}

module.exports.read = function (sourceObj, from, paramsArr, callback) {
    var opts = module.exports.buildRawRequest(sourceObj);
    opts.url += '/parts/' + sourceObj.deviceuuid + '/filter?live=false';
    if (from) {
        opts.url += '&from=' + from;
    }

    opts.method = 'POST';

    var a;
    if (Array.isArray(paramsArr) == false) {
        var a = [];
        a.push(paramsArr);
    }
    else {
        a = paramsArr;
    }

    var body = { 'variables': a };
    opts.body = JSON.stringify(body);

    console.log('executing read call, opts:' + util.inspect(opts));

    performCall(opts, callback);
}

module.exports.write = function (sourceObj, config, value, callback) {
    var opts = module.exports.buildRawRequest(sourceObj);
    opts.url += '/parts/' + sourceObj.deviceuuid + '?live=true';
    opts.method = 'PATCH';

    var vals = {};
    vals[config.variabletag] = config.variableid;
    vals.value=value;

    var body = { 'values': vals };
    opts.body = JSON.stringify(body);

    console.log('executing write call, opts:' + util.inspect(opts));
    performCall(opts, callback);
}

module.exports.buildRawRequest = function (sourceObj) {
    var opts = {};
    opts.url = sourceObj.serverUrl;
    opts.headers = { 'content-type': 'application/json', 'eitcusertoken': sourceObj.userToken };
    return opts;
}

function performCall(options, callback) {
    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            callback(null, info);
        }
        else {
            console.log('error:' + error + ' body:' + body);

            var msg = {};
            msg.error = 'error';
            msg.errorDetails = error;
            if (response && response.statusCode)
                msg.statusCode = response.statusCode;
                
            callback(msg, response);
        }
    });
}