'use strict';

var utils = require('../utils');

function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
}

module.exports = function dispatchRequest (config) {
    if (!config) {
        throw new Error('The interceptor does not return a parameter')
    }
    throwIfCancellationRequested(config);
    
       
    /**
     * baseUrl基础url
     */
    if (config.baseURL && !utils.isAbsoluteURL(config.url)) {
        if (config.url && config.url.slice(0, 1) === '#') {
            config.url = ''.trim.call(config.url.substring(1))
        } else {
            config.url = utils.combineURLs(config.baseURL, config.url);
        }
    }

    config.headers = config.headers || {};

    var beforeSend = config.beforeSend ? config.beforeSend(config.data) : true;

    if (!beforeSend) {
        return Promise.reject(config)
    }

    config.data = utils.transformData(config.data, config.headers, config.transformRequest);

    

    // 合并请求头
    config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers || {}
    );

    utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function (val) {
        delete config.headers[val]
    });
    
    

    var adapter = config.adapter;

    return adapter(config).then(function (response) {
        throwIfCancellationRequested(config);
        response = utils.transformData(
            response,
            null,
            config.transformResponse
        )
        return response
    }, function (result) {
        throwIfCancellationRequested(config);
        if (result && result.response) {
            result.response.data = transformData(
                result.response.data,
                result.response.headers,
                config.transformResponse
            );
        }
        return Promise.reject(result);
    })

}