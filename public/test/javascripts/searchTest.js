/**
 * User: Ken
 * Date: 17/10/2013
 * Time: 22:44
 */
/*global define, test, asyncTest, start, equal, ok, $, HTMLElement*/
define(['../../javascripts/search.js'],
    function (Search) {
        "use strict";
        return {
            RunTests : function () {
                module('DOM');
                test('it should create a node which searched results could append', function () {
                    var aSearch = new Search();
                    ok($('#searchResult').length === 0);
                    aSearch.textInputField = $('#searchBox')[0];
                    aSearch.createAppendingNode();
                    ok($('#searchResult').length === 1);
                });
                test('it should add result to list', function () {
                    var aSearch = new Search();
                    aSearch.textInputField = $('#searchBox')[0];
                    aSearch.createAppendingNode();
                    aSearch.wordsToSearch = ['word to search'];
                    aSearch.docIds = ['1234'];
                    aSearch.textInputField.value = 'wor';
                    aSearch.loop();
                    ok($('.searchResultItem').length === 1);
                    ok($('.searchResultItem').attr('data-doc-id') === aSearch.docIds[0]);
                });
                test('it should set the search box data attribute', function () {
                    var aSearch = new Search(),
                        data = {id: '1234',
                            "first_name": "TestEdit",
                            "last_name": "TestEdit",
                            "company": "Aalto University Edit",
                            "work_phone": [
                                "+358 00 000 0001"
                            ],
                            "work_email": [
                                "test.edit@aalto.fi"
                            ],
                            "note": "<script>alert('edit')</script>"};
                    // mock data
                    sessionStorage.setItem(data.id, JSON.stringify(data));
                    aSearch.docIds = data.id;
                    // mock nodes to test
                    $('#qunit-fixture').append('<input id="testInput"/>').
                        append('<a class="searchResultItem" href="#" data-doc-id="' +
                            data.id + '">asdf</a>');
                    aSearch.textInputField = $('#testInput');
                    // testing function
                    aSearch.setContact($.Event('touchend', {currentTarget : document.getElementsByClassName('searchResultItem')[0]}));
                    ok($('#searchForm').attr('data-doc-id') === data.id);
                });
            }
        };
    });