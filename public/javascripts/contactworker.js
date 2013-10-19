/**
 * User: Ken
 * Date: 13/10/2013
 * Time: 22:49
 */
/*global define, Worker*/
define(function () {
    "use strict";
    function ContactWorker() {
        var self = this,
            worker = null;
        /**
         * create a web worker
         * @param onMessageCallback (message) call when the worker posts message back
         * @returns {Worker}
         */
        self.createWorker = function (onMessageCallback) {
            if (Worker) {
                worker = new Worker('../javascripts/workertask.js');
                worker.onmessage = function (event) {
                    onMessageCallback(event);
                };
            }
            return worker;
        };
        /**
         * post a message to the worker
         * @param message the message should be the contact ID
         */
        self.contactWorker = function (message) {
            if (worker) {
                worker.postMessage(message);
            }
        };
        /**
         * stop the worker
         * @returns {boolean}
         */
        self.stopWorker = function () {
            if (worker) {
                worker.terminate();
                return true;
            }
        };
    }
    return ContactWorker;
});