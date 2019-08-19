'use strict';

var utils = require('./utils');
var normalizeHeaderName = require('./helpers/normalizeHeaderName.js');
// var DEFAULT_CONTENT_TYPE = {
//     'Content-Type': 'application/x-www-form-urlencoded'
// }

function setContentTypeIfUnset(headers, value) {
    if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
      headers['Content-Type'] = value;
    }
}

var defaults = {
    'Content-Type': '',
    DEFAULT_CONTENT_TYPE: 'application/x-www-form-urlencoded',
    commonParam: {},
    adapter: require('./adapter/xhr'),
    baseURL: '',
    // beforeSend: function beforeSend () {},
    timeout: 0,
    transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');
        
        if (utils.isFormData(data) ||
            utils.isArrayBuffer(data) ||
            utils.isBuffer(data) ||
            utils.isStream(data) ||
            utils.isFile(data) ||
            utils.isBlob(data)
        ) {
            return data;
        }
        if (utils.isArrayBufferView(data)) {
            return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
            setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
            return data.toString();
        }
        if (utils.isObject(data)) {
            if (defaults['Content-Type']) {
                setContentTypeIfUnset(headers, defaults['Content-Type']);
            } else {
                setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
            }
            return JSON.stringify(data);
        }
        return data;
    }],

    transformMethod: function (headers) {
        utils.forEach(['post', 'put', 'patch'], function MethodWithDate(method) {
            headers[method] = utils.merge({
                'Content-Type':  defaults['Content-Type'] ? defaults['Content-Type'] : defaults['DEFAULT_CONTENT_TYPE']
            });
        })
    },
    transformResponse: [function transformResponse(data) {
        /*eslint no-param-reassign:0*/
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (e) {
                /* Ignore */ }
        }
        return data;
    }],
    maxContentLength: -1,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
    }

};
defaults.headers = {
    common: {
        'Accept': 'application/json, text/plain, */*'
    }
}

utils.forEach(['delete', 'get', 'head'], function MethodNoDate(method) {
    defaults.headers[method] = {};
})



module.exports = defaults;