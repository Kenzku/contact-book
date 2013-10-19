/**
 * User: Ken
 * Date: 13/10/2013
 * Time: 23:01
 */
/*global importScripts, postMessage, self*/
importScripts('//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.8/require.min.js');
require({
    baseUrl: "./"
},
    ['loader'],
    /**
     * NOT SUPPORTED
     * @param Loader
     */
    function (Loader) {
        "use strict";
        var currentContactId,
            aLoader = new Loader();
        function successCB(res) {
            console.log('worker is posting right');
            self.postMessage({ok: true, message: res});
        }
        function errorCB(err) {
            console.log('worker is posting wrong');
            self.postMessage({ok: false, error: err});
        }
        self.addEventListener('message', function (event) {
            console.log('worker received your message 1');
            if (event && event.data) {
                console.log('worker received your message 2');
                currentContactId = event.data;
                aLoader.requestURL('get', '/contact/' + currentContactId + '/read', null, successCB, errorCB);
            }
        });
    });