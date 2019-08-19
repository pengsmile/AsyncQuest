'use strict';

var utils = require('../utils');

module.exports = function megerConfig(config1, config2) {
    config2 = config2 || {};
    var config = {};

    utils.forEach(['url', 'method', 'params', 'data'], function (meger) {
        if (typeof config2[meger] !== 'undefined') { // 如config2 中有该方法并且不为空，则添加则config
            config[meger] = config2[meger];
        }
    });

    utils.forEach(['headers', 'auth', 'proxy'], function (meger) {
        if (utils.isObject(config2[meger])) {
            config[meger] = utils.deepMerge(config1[meger], config2[meger]);
        } else if (typeof config2[meger] !== 'undefined') {
            config[meger] = config2[meger];
        } else if (utils.isObject(config1[meger])) {
            config[meger] = utils.deepMerge(config1[meger]);
        } else if (typeof config1[meger] !== 'undefined') {
            config[meger] = config1[meger];
        }
    });

    utils.forEach([
        'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
        'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
        'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
        'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
        'socketPath', 'beforeSend'
    ], function defaultToConfig2(prop) {
        if (typeof config2[prop] !== 'undefined') { // config2 中有上述属性并且不为 undefined
            config[prop] = config2[prop];
        } else if (typeof config1[prop] !== 'undefined') { // 判完config1 在判断一下
            config[prop] = config1[prop];
        }
    });
    
    return config

}