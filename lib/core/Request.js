'use strict';

var utils = require('./../utils');


function Request (defaultConfig) {
    this.default = defaultConfig;
}



Request.prototype.request = function (config) {
    console.log('发送');
}

module.exports = Request;