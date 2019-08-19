'use strict';

var createError = require('./createError');

module.exports = function settle (resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (validateStatus(response.status)) {
        resolve(response.response);
    } else {
        reject(createError(
            'The Request Failed, Status Code : ' + response.status,
            response.config,
            null
        ))
    }
}