'use strict';

var Quest = require('./core/Request');
var create = require('./core/createRequest');
var defaults = require('./defaultConfig');

var AsyncQuest = create(Quest, defaults);

module.exports = AsyncQuest;

module.exports.default = AsyncQuest;