/**
 * User: Ken
 * Date: 16/10/2013
 * Time: 22:31
 */
/*global define, test, asyncTest, start, equal, ok, $*/
define(['../../javascripts/loader.js'],
    function (Loader) {
        "use strict";
        var data = {
            "total_rows": 2,
            "offset": 0,
            "rows": [
                {
                    "id": "20a7ba46761343da9a08e6774a339a15",
                    "key": "Aura, Tuomas",
                    "value": {
                        "_id": "20a7ba46761343da9a08e6774a339a15",
                        "_rev": "2-3427da46ab8b5c01871ba205d675b614",
                        "first_name": "Test",
                        "last_name": "Test",
                        "company": "Aalto University",
                        "work_phone": [
                            "+358 00 000 0000"
                        ],
                        "work_email": [
                            "tuomas.aura@aalto.fi"
                        ],
                        "note": ""
                    }
                }
            ]
        };
        return {
            RunTests : function () {
                module('loader');
                asyncTest('it could send get request', function () {
                    function successCB(data) {
                        ok(data);
                        start();
                    }
                    function errorCB(err) {
                        ok(false, 'it should return success ok');
                        start();
                    }
                    var aLoader = new Loader();
                    aLoader.requestURL('get', '/', null, successCB, errorCB);
                });
                asyncTest('it could send post request - success ok', function () {
                    function successCB(data) {
                        ok(data);
                        start();
                    }
                    function errorCB(err) {
                        ok('failed ok');
                        start();
                    }
                    var aLoader = new Loader(),
                        data = {"firstName": "Test",
                            "lastName": "Test",
                            "company": "Aalto University",
                            "phone": [
                                "+358 00 000 0000"
                            ],
                            "email": [
                                "test.aura@aalto.fi"
                            ],
                            "note": "<script>alert('asdf')</script>"};
                    aLoader.requestURL('post', '/contacts/add', data, successCB, errorCB);
                });
                asyncTest('it could send put request', function () {
                    var aLoader = new Loader(),
                        data = {"firstName": "TestEdit",
                            "lastName": "TestEdit",
                            "company": "Aalto University Edit",
                            "phone": [
                                "+358 00 000 0001"
                            ],
                            "email": [
                                "test.edit@aalto.fi"
                            ],
                            "note": "<script>alert('edit')</script>"};
                    function putSuccessCB(body) {
                        ok(body, 'success ok');
                        start();
                    }
                    function putErrorCB(err) {
                        ok(false, err);
                        start();
                    }
                    function postSuccessCB(res) {
                        data.contactId = JSON.parse(res).id;
                        aLoader.requestURL('put', '/contact/edit', data, putSuccessCB, putErrorCB);
                    }
                    function postErrorCB(err) {
                        ok(false, err);
                        start();
                    }
                    aLoader.requestURL('post', '/contacts/add', data, postSuccessCB, postErrorCB);
                });
                asyncTest('it could send delete request', function () {
                    var aLoader = new Loader(),
                        data = {"firstName": "TestEdit",
                            "lastName": "TestEdit",
                            "company": "Aalto University Edit",
                            "phone": [
                                "+358 00 000 0001"
                            ],
                            "email": [
                                "test.edit@aalto.fi"
                            ],
                            "note": "<script>alert('edit')</script>"};
                    function deleteSuccessCB(body) {
                        ok(body, 'success ok');
                        start();
                    }
                    function deleteErrorCB(err) {
                        ok(false, err);
                        start();
                    }
                    function postSuccessCB(res) {
                        data.contactId = JSON.parse(res).id;
                        aLoader.requestURL('delete', '/contact/' + data.contactId + '/delete', null, deleteSuccessCB, deleteErrorCB);
                    }
                    function postErrorCB(err) {
                        ok(false, err);
                        start();
                    }
                    aLoader.requestURL('post', '/contacts/add', data, postSuccessCB, postErrorCB);
                });
            }
        };
    });