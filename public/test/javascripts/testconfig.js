/**
 * Author: Ken
 * Date: 15/04/2013
 * Time: 23:10
 */
/*global QUnit*/
require.config({
    paths: {
        'contactsTest' : '/test/javascripts/contactsTest',
        'domTest' : '/test/javascripts/domTest',
        'loaderTest' : '/test/javascripts/loaderTest',
        'statusbarTest' : '/test/javascripts/statusbarTest',
        'searchTest' : '/test/javascripts/searchTest',
        'contactworkerTest' : '/test/javascripts/contactworkerTest'
    }
});
QUnit.config.autostart = false;
require(['contactsTest', 'domTest', 'loaderTest', 'statusbarTest', 'searchTest', 'contactworkerTest'],
    function (contactsTest, domTest, loaderTest, statusbarTest, searchTest, contactworkerTest) {
        "use strict";
        QUnit.start();
        contactsTest.RunTests();
        domTest.RunTests();
        loaderTest.RunTests();
        statusbarTest.RunTests();
        searchTest.RunTests();
        contactworkerTest.RunTests();
    });
