'use strict';

var bind = require('./helpers/bind');

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
        return isObject(val) && isFunction(val.pipe);
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
        if (obj === null || typeof obj === 'undefined') {
            return;
        }

        // Force an array if not already something iterable
        if (typeof obj !== 'object') {
            /*eslint no-param-reassign:0*/
            obj = [obj];
        }

        if (isArray(obj)) {
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

        function assignValue(val, key) {
            if (typeof result[key] === 'object' && typeof val === 'object') {
                result[key] = merge(result[key], val);
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

        function assignValue(val, key) {
            if (typeof result[key] === 'object' && typeof val === 'object') {
                result[key] = deepMerge(result[key], val);
            } else if (typeof val === 'object') {
                result[key] = deepMerge({}, val);
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
}