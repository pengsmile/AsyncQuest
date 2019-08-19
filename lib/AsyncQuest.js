'use strict';
var createRequest = require('./core/createRequest');
var defaults = require('./defaultConfig');
var Request = require('./core/Request');
var mergeConfig = require('./core/megerConfig');

var AsyncQuest = createRequest(defaults);
AsyncQuest.defaults = defaults;
AsyncQuest.Request = Request;

AsyncQuest.create = function (config) {
    return createRequest(mergeConfig(AsyncQuest.defaults, config));
}

module.exports = AsyncQuest;
