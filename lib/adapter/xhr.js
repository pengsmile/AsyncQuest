'use strict';

var utils = require('../utils');
var buildurl = require('../helpers/buildUrl');
var parseHeaders = require('../helpers/parseHeaders');
var createError = require('../core/createError');
var settle = require('../core/settle');
var isURLSameOrigin = require('../helpers/isURLSameOrigin');

module.exports = function xhr (config) {
    return new Promise(function (resolve, reject) {
        var requestData = config.data,
            requestHeaders = config.headers;
        
        if (utils.isFormData(requestData)) {
            delete requestHeaders['Content-Type'];
        }
        var request = new XMLHttpRequest();
        var url = buildurl(config.url, config.params, config.paramsSerializer);
        request.open(config.method.toUpperCase(), url, true);
        request.timeout = config.timeout;

        // 请求完成
        request.onload = function handleLoad () {
            // if (!request || request.readyState !== 4) {
            //     return
            // }

            if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
                return
            }

            var ResponseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
            var ResponseData =  !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
            var response = {
                config: config,
                response: ResponseData,
                status: request.status,
                headers: ResponseHeaders
            }
            settle(resolve, reject, response);

            request = null;

        }

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
            if (!request) {
                return;
            }
            reject(createError('Request aborted', config, 'ECONNABORTED', request));
            // Clean up request
            request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
            reject(createError('Network Error', config, null, request));
  
            // Clean up request
            request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
            reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', request));
            // Clean up request
            request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils.isStandardBrowserEnv()) {
            var cookies = require('./../helpers/cookies');
    
            // Add xsrf header
            var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;
    
            if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
            }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
            utils.forEach(requestHeaders, function setRequestHeader(val, key) {
                if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
                    // Remove Content-Type if data is undefined
                    delete requestHeaders[key];
                } else {
                    // Otherwise add header to the request
                    request.setRequestHeader(key, val);
                }
            });
        }


        if (config.withCredentials) {
            request.withCredentials = true;
        }

        // Add responseType to request if needed
        if (config.responseType) {
            try {
                request.responseType = config.responseType;
            } catch (e) {
                if (config.responseType !== 'json') {
                    throw e;
                }
            }
        }

        // 处理下载进度
        if (typeof config.onDownloadProgress === 'function') {
            request.addEventListener('progress', config.onDownloadProgress);
        }

        // 处理上传进度
        if (typeof config.onUploadProgress === 'function' && request.upload) {
            request.upload.addEventListener('progress', config.onUploadProgress);
        }

        // 手动取消
        if (config.cancelToken) {
            // Handle cancellation
            config.cancelToken.promise.then(function onCanceled(cancel) {
              if (!request) {
                return;
              }
      
              request.abort();
              reject(cancel);
              // Clean up request
              request = null;
            });
        }
        if (requestData === undefined) {
            requestData = null;
        }
        request.send(requestData);
    })
}


