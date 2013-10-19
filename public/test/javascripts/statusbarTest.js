/**
 * User: Ken
 * Date: 16/10/2013
 * Time: 23:51
 */
/*global define, test, asyncTest, start, equal, ok, $, HTMLElement*/
define(['../../javascripts/statusbar.js'],
    function (StatusBar) {
        "use strict";
        return {
            RunTests : function () {
                module('Status Bar');
                test('it should init the add button', function () {
                    var aStatusBar = new StatusBar();
                    $('.content-body-add-new-contact')[0].style.display = 'none';
                    ok(aStatusBar.initAddButton() instanceof StatusBar);
                    ok($('#addContact').trigger($.Event('click', {
                        currentTarget : $('<button id="addContact" class="pure-button">Add</button>')[0]
                    }))); // then the rest unit is tested by contactTest
                    ok($('.content-body-add-new-contact')[0].style.display === 'block');
                });

                test('it could init the edit button', function () {
                    var aStatusBar = new StatusBar();
                    ok(aStatusBar.initEditButton() instanceof StatusBar);
                });

                test('it should trigger the helper display function', function () {
                    var aStatusBar = new StatusBar();

                    $('.content-body-show-all')
                        .append('<img class="remove-contact-button" src="/images/close.png" ' +
                            'style="display: none;">')
                        .append('<img class="remove-contact-button" src="/images/close.png" ' +
                            'style="display: none;">');
                    $('.content-body-show-all')[0].style.display = 'block';
                    $('.remove-contact-button')[0].style.display = 'none';
                    ok(aStatusBar.displayXHelper($.Event('click', {
                        currentTarget : $('#editContact')
                    }) instanceof StatusBar));

                    $('.remove-contact-button')[0].style.display = 'block';
                    ok(aStatusBar.displayXHelper($.Event('click', {
                        currentTarget : $('#editContact')
                    }) instanceof StatusBar));

                    $('.content-body-show-all')[0].style.display = 'none';
                    $('.remove-contact-button').remove();
                    $('.content-body-detail')[0].style.display = 'block';
                    ok(aStatusBar.displayXHelper($.Event('click', {
                        currentTarget : $('#editContact')
                    }) instanceof StatusBar));
                });

                test('it should update the data attribute in the edit button', function () {
                    var aStatusBar = new StatusBar();
                    $('.content-body-show-all')
                        .append('<div class="contact-item pure-u-4-5" data-doc-id="dfadfebd38f26df383d704cff23939c4">');
                    ok(aStatusBar.updateEditButtonDataSet($.Event('click', {
                        currentTarget : $('.contact-item')[0]
                    })) instanceof StatusBar);
                    ok($('#editContact').attr('data-doc-id') === 'dfadfebd38f26df383d704cff23939c4');
                });
            }
        };
    });