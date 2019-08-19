'use strict';
var utils = require('../utils');
var bind = require('../helpers/bind');
var Request = require('./Request');


function createRequest (defaultConfig) {
    var content = new Request(defaultConfig); // 默认配置给到Request构造函数

    var instance = bind(Request.prototype.request, content); // 绑定this指针，instance指向request方法

    utils.extend(instance, Request.prototype, content); // 继承Request.prototype所有方法， 挂载至instance上
    
    utils.extend(instance, content); // 继承content所有方法

    return instance
}

module.exports = createRequest