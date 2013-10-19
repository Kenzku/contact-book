/**
 * Author: Ken
 * Date: 24/09/2013
 * Time: 23:03
 */
/*global define*/
define(['../javascripts/constant.js'], function (CONSTANT) {
    "use strict";
    /**
     * Load Data from e.g. /contacts/all
     * @constructor
     */
    function Loader() {

        var self = this;
        /**
         * request the server download the data from foreign domain
         * This is for the Cross-Domain policy, in order to download
         * @param method {String} GET or POST
         * @param url {String} URL
         * @param data {Object}
         * @param successCallback (String)
         * it is a String like JSON, thus you need to parse before use
         * data.url
         * @param errorCallback (error)
         * it is a String like JSON, thus you need to parse before use
         * data.error
         */
        self.requestURL = function (method, url, data, successCallback, errorCallback) {
            var xhr = new XMLHttpRequest();

            try {
                xhr.open(method.toLowerCase(), url);
                xhr.setRequestHeader("Content-type", "application/json");
                if (method.toLowerCase() === 'get') {
                    xhr.send();
                } else if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') {
                    xhr.send(JSON.stringify(data));
                } else if (method.toLowerCase() === 'delete') {
                    xhr.send(null);
                }
            } catch (e) {
                if (errorCallback && typeof errorCallback === 'function') {
                    errorCallback(e);
                } else {
                    throw e;
                }
            }

            xhr.onreadystatechange = function () {
                // on success, for status referencing, please check http://www.w3.org/TR/2006/WD-XMLHttpRequest-20060405/
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (successCallback && typeof successCallback === 'function') {
                        successCallback(xhr.responseText);
                    }
                } else if (xhr.readyState === 4 && xhr.status !== 200) {
                    if (errorCallback && typeof errorCallback === 'function') {
                        errorCallback(xhr.responseText);
                    }
                }
            };
        };

    }
    return Loader;
});