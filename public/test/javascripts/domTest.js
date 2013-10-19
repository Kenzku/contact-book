/**
 * User: Ken
 * Date: 29/09/2013
 * Time: 20:49
 */
/*global define, test, asyncTest, start, equal, ok, $, HTMLElement*/
define(['../../javascripts/dom.js'],
    function (Dom) {
        "use strict";
        var walk_the_DOM = function walk(node, func) {
            func(node);
            node = node.firstChild;
            while (node) {
                walk(node, func);
                node = node.nextSibling;
            }
        };
        return {
            RunTests : function () {
                module('DOM');
                test('it should return a document element', function () {
                    var aDom = new Dom(),
                        newNode,
                        i = 0;
                    newNode = aDom.getNewXItem('email', 'email', 'a.b@aalto.fi');
                    function countNode(node) {
                        i = i + 1;
                    }
                    walk_the_DOM(newNode, countNode);
                    equal(i, 7);
                });

                test('it should return a contact item wrap', function () {
                    var aDom = new Dom(),
                        contact = {
                            id: '20a7ba46761343da9a08e6774a339a15',
                            value: {
                                first_name : "Ken",
                                last_name : "HUANG",
                                company : "F-Secure",
                                note : "He has officially ... "
                            }
                        };
                    ok(aDom.getContactItemWrap(contact) instanceof HTMLElement);
                });
            }
        };
    });