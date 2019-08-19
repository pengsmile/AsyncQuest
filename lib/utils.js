'use strict';

var bind = require('./helpers/bind');
var isBuffer = require('is-buffer');
var toString = Object.prototype.toString;

class utils {
    constructor() {

    }
    isArray(val) {
        return toString.call(val) === '[object Array]';
    }
    isArrayBuffer(val) {
        return toString.call(val) === '[object ArrayBuffer]';
    }
    isFormData(val) {
        return (typeof FormData !== 'undefined') && (val instanceof FormData);
    }
    isArrayBufferView(val) {
        var result;
        if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
            result = ArrayBuffer.isView(val);
        } else {
            result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
        }
        return result;
    }
    isString(val) {
        return typeof val === 'string';
    }
    isNumber(val) {
        return typeof val === 'number';
    }
    isUndefined(val) {
        return typeof val === 'undefined';
    }
    isObject(val) {
        return val !== null && typeof val === 'object';
    }
    isDate(val) {
        return toString.call(val) === '[object Date]';
    }
    isFile(val) {
        return toString.call(val) === '[object File]';
    }
    isBlob(val) {
        return toString.call(val) === '[object Blob]';
    }
    isFunction(val) {
        return toString.call(val) === '[object Function]';
    }
    isStream(val) {
        return this.isObject(val) && this.isFunction(val.pipe);
    }
    isURLSearchParams(val) {
        return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
    }
    trim(str) {
        return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }
    isStandardBrowserEnv() {
        if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                navigator.product === 'NativeScript' ||
                navigator.product === 'NS')) {
            return false;
        }
        return (
            typeof window !== 'undefined' &&
            typeof document !== 'undefined'
        );
    }
    forEach(obj, fn) { // 循环，数组或对象
        // Don't bother if no value provided
        if (obj === null || typeof obj === 'undefined') { // 判断数据来源
            return;
        }

        if (typeof obj !== 'object') { 
            /*eslint no-param-reassign:0*/
            obj = [obj]; // 强制一个数组
        }

        if (this.isArray(obj)) {
            // Iterate over array values
            for (var i = 0, l = obj.length; i < l; i++) {
                fn.call(null, obj[i], i, obj);
            }
        } else {
            // Iterate over object keys
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    fn.call(null, obj[key], key, obj);
                }
            }
        }
    }
    /**
     * 合并对象
     */
    merge( /* obj1, obj2, obj3, ... */ ) {
        var result = {};
        var that = this;
        function assignValue(val, key) {
            if (typeof result[key] === 'object' && typeof val === 'object') {
                result[key] = that.merge(result[key], val);
            } else {
                result[key] = val;
            }
        }

        for (var i = 0, l = arguments.length; i < l; i++) {
            this.forEach(arguments[i], assignValue);
        }
        return result;
    }
    deepMerge( /* obj1, obj2, obj3, ... */ ) {
        var result = {};
        var that = this;
        function assignValue(val, key) {
            if (typeof result[key] === 'object' && typeof val === 'object') {
                result[key] = that.deepMerge(result[key], val);
            } else if (typeof val === 'object') {
                result[key] = that.deepMerge({}, val);
            } else {
                result[key] = val;
            }
        }

        for (var i = 0, l = arguments.length; i < l; i++) {
            this.forEach(arguments[i], assignValue);
        }
        return result;
    }
    extend(a, b, thisArg) {
        this.forEach(b, function assignValue(val, key) {
            if (thisArg && typeof val === 'function') {
                a[key] = bind(val, thisArg);
            } else {
                a[key] = val;
            }
        });
        return a;
    }
    /**
     * 判断是否绝对路径
     * @param {*} url 
     */
    isAbsoluteURL(url) {
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    }
    /**
     * 合并url
     * @param {*} baseURL 基础url
     * @param {*} relativeURL 
     */
    combineURLs(baseURL, relativeURL) {
        return relativeURL
          ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
          : baseURL;
    }
    /**
     * 变换请求数据
     * @param {*} data 
     * @param {*} headers 
     * @param {*} fns 格式化函数
     */
    transformData(data, headers, fns) {

        this.forEach(fns, function transform(fn) {
            data = fn(data, headers);
        });
      
        return data;
    }
}
var instrument = new utils();
instrument.isBuffer = isBuffer
module.exports = instrument