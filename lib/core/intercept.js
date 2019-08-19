'use strict';

var utils = require('./../utils');

function Intercept () {
    this.aisle = []
}

Intercept.prototype.add = function add (fulfilled, rejected) {
    this.aisle.push({
        resolve: fulfilled,
        reject: function (err) {
            let result = rejected ? rejected(err) : undefined;
            if (result) {
                return Promise.reject(result)
            }
            return Promise.reject(err)
        }
    });
    return this.aisle.length - 1
}

Intercept.prototype.remove = function remove (id) {
    if (this.aisle[id]) {
        this.aisle[id] = null;
    }
}

Intercept.prototype.forEach = function forEach (fn) {
    utils.forEach(this.aisle, function (param) {
        if (param !== null) {
            fn(param)
        }
    })
}

module.exports = Intercept;