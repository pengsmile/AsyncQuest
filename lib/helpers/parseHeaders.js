'use strict';

var utils = require('../utils');

var ignoreDuplicateOf = [
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
];

module.exports = function parseHeaders (headers) {
    var parsed = {};
    if (!headers) return parsed
    var key, val, i;
    utils.forEach(headers.split('\n'), function (row) {
        i = row.indexOf(':');
        key = utils.trim(row.substring(0, i)).toLowerCase();
        val = utils.trim(row.substring(i + 1));
        if (key) {
            if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
                return
            }
            if (key === 'set-cookie') {
                parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
            } else {
                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
            }
        }
    });
    
    return parsed

}