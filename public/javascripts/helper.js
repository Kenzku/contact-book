/**
 * User: Ken
 * Date: 29/09/2013
 * Time: 19:22
 */
/*global define*/
define(function () {
    "use strict";
    return {
        /**
         * tell if the value is an array
         * @param value
         * @returns {*|boolean}
         */
        is_array : function (value) {
            return value &&
                typeof value === 'object' &&
                typeof value.length === 'number' &&
                typeof value.splice === 'function' &&
                !(value.propertyIsEnumerable('length'));
        }
    };
});
