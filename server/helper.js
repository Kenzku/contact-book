/**
 * User: Ken
 * Date: 11/10/2013
 * Time: 20:13
 */

module.exports.isNumber = function (value) {
    "use strict";
    return typeof value === 'number' && isFinite(value);
};