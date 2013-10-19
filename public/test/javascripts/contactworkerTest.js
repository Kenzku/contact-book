/**
 * User: Ken
 * Date: 18/10/2013
 * Time: 19:23
 */
/*global define, test, asyncTest, start, equal, ok, $, HTMLElement*/
define(['../../javascripts/contactworker.js'],
    function (ContactWorker) {
        "use strict";
        return {
            RunTests : function () {
                module('DOM');
                test('it should create a worker', function () {
                    var aContactWorker = new ContactWorker();
                    ok(aContactWorker.createWorker());
                });
                asyncTest('it should contact the worker', function () {
                    var aContactWorker = new ContactWorker();
                    function onMessageCome(event) {
                        ok(event.data.ok === false);
                        start();
                    }
                    aContactWorker.createWorker(onMessageCome);
                    aContactWorker.contactWorker('12341234');
                });
            }
        };
    });