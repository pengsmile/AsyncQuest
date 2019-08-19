'use strict';

var utils = require('./../utils');
var Interce = require('./intercept'); // 拦截器
var mergeConfig = require('./megerConfig');
var buildUrl = require('../helpers/buildUrl');
var dispatchRequest = require('./dispatchRequest');

function Request(defaultConfig) {
    this.default = defaultConfig; // 默认配置
    this.interReq = new Interce(); // 发送拦截器
    this.interRes = new Interce(); // 返回拦截器
}



Request.prototype.request = function (config) {
    if (typeof config === 'string') {
        config = arguments[1] || {};
        config.url = arguments[0];
    } else {
        config = config || {};
    }
    config = mergeConfig(this.default, config);
    config.method = config.method ? config.method.toLowerCase() : 'post';
    /**
     * 添加全局参数
     * 拦截器开始前
     */
    let commonParam = utils.isObject(this.default.commonParam);
    config.data =  utils.merge(config.data, commonParam ? this.default.commonParam : {});

    var chain = [dispatchRequest, undefined];
    var promise = Promise.resolve(config);
    this.interReq.forEach(function (inter) {
        chain.unshift(inter.resolve, inter.reject);
    });
    this.interRes.forEach(function (inter) {
        chain.push(inter.resolve, inter.reject);
    });
    while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
    }
    return promise
}
Request.prototype.getUri = function (config) {
    config = mergeConfig(thid.default, config); // 合并配置
    return buildUrl(config.url, config.params, config.paramsSerializer).replace(/^\?/, '')
}


utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {

    Request.prototype[method] = function (url, config) {
        return this.request(utils.merge(config || {}, {
            method: method,
            url: url
        }));
    };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /**
     * 合并配置调用request
     */
    Request.prototype[method] = function (url, data, config) {
        return this.request(utils.merge(config || {}, {
            method: method,
            url: url,
            data: data
        }));
    };
});


module.exports = Request;