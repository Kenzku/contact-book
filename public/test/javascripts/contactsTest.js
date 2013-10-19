/**
 * Author: Ken
 * Date: 24/09/2013
 * Time: 23:24
 */
/*global define, test, asyncTest, start, equal, ok, $*/
define(['../../javascripts/contacts.js'],
    function (Contacts) {
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
                        "first_name": "Tuomas",
                        "last_name": "Aura",
                        "company": "Aalto University",
                        "work_phone": [
                            "+358 00 000 0000"
                        ],
                        "work_email": [
                            "tuomas.aura@aalto.fi"
                        ],
                        "note": ""
                    }
                },
                {
                    "id": "ccebf37f7787a26e7de6d7610e91fe28",
                    "key": "Mario, Di Francesco",
                    "value": {
                        "_id": "ccebf37f7787a26e7de6d7610e91fe28",
                        "_rev": "5-286fc4aad1f08dd48da98014e177311e",
                        "first_name": "Di Francesco",
                        "last_name": "Mario",
                        "company": "Aalto University",
                        "work_phone": [
                            "+358 00 000 0001"
                        ],
                        "work_email": [
                            "mario.di.francesco@aalto.fi"
                        ],
                        "note": "Professor at Aalto University",
                        "_attachments": {
                            "profile.jpg": {
                                "content_type": "image/jpeg",
                                "revpos": 5,
                                "digest": "md5-vS/OTHtBGr4aU84HoRPjLw==",
                                "length": 32723,
                                "stub": true
                            }
                        }
                    }
                }
            ]
        };
        return {
            RunTests : function () {
                module('Contacts');
                asyncTest('retrieve all contacts', function () {
                    var aContacts = new Contacts();
                    function successCB(res) {
                        ok(res, "non-empty response success");
                        start();
                    }
                    function errorCB(res) {
                        console.log(res);
                        ok(res, "non-empty response failed");
                        start();
                    }
                    aContacts.getAllContacts(successCB, errorCB);
                });

                test('populate all contacts', function () {
                    var aContacts = new Contacts();
                    equal(aContacts.populate(data.rows), true);
                });

                test('show contact detail', function () {
                    var i,
                        contactItems,
                        aContacts = new Contacts();
                    aContacts.populate(data.rows);
                    contactItems = $('.contact-item');
                    for (i = 0; i < contactItems.length; i = i + 1) {
                        ok(aContacts.showContactDetail($.Event('click', {
                            currentTarget : $('<div class="contact-item" data-doc-id="20a7ba46761343da9a08e6774a339a15"><img class="contact-profile-photo" src="/images/profile.png"><div class="pure-u"><h5 class="contact-name">Tuomas, Aura</h5><h6 class="contact-company">Aalto University</h6><p class="contact-note">Tuomas Aura was appointed as p ...</p></div><img class="remove-contact-button" src="/images/close.png" style="display: none;"></div>>​')[0]
                        })));
                    }
                });

                asyncTest('add new contact - error pass', function () {
                    var aContacts = new Contacts();
                    function successCB() {
                        ok(true, "success");
                        start();
                    }
                    function errorCB() {
                        ok(true, "failed");
                        start();
                    }
                    aContacts.submitNewContact($.Event('submit'), successCB, errorCB);
                });

                asyncTest('add new contact - success pass', function () {
                    var aContacts = new Contacts();
                    function successCB() {
                        ok(true, "success");
                        start();
                    }
                    function errorCB() {
                        ok(true, "failed");
                        start();
                    }
                    document.getElementById('newLastName').value = "HUANG";
                    document.getElementById('newFirstName').value = "KEN";
                    document.getElementById('newCompany').value = "F-Secure";
                    document.getElementById('newPhone').value = "+358 46 5260416";
                    document.getElementById('newEmail').value = "ken@aalto.fi";
                    document.getElementById('newNote').value = "This is Ken";
                    aContacts.submitNewContact($.Event('submit'), successCB, errorCB);
                });

                test('display add new contact form', function () {
                    var aContacts = new Contacts(),
                        $submitNewContact = $('#submitNewContact');
                    $submitNewContact.attr('disabled', 'disabled');
                    ok($submitNewContact.attr('disabled') === 'disabled');
                    ok(aContacts.displayAddNewContact($.Event('click', {
                        currentTarget : $('<button id="addContact" class="pure-button">Add</button>')[0]
                    })));
                    ok(!$submitNewContact.attr('disabled'));
                });

                test('fill contact details to the edit contact form', function () {
                    var aContacts = new Contacts();
                    aContacts.populate(data.rows);
                    ok(aContacts.displayAddNewContact($.Event('click', {
                        currentTarget : $('<button id="editContact" class="pure-button" data-doc-id="20a7ba46761343da9a08e6774a339a15">Edit</button>')[0]
                    })));
                });

                test('display edit contact form', function () {
                    var aContacts = new Contacts(),
                        $submitEditedContact = $('#submitEditedContact');
                    $submitEditedContact.attr('disabled', 'disabled');
                    ok($submitEditedContact.attr('disabled') === 'disabled');
                    ok(aContacts.displayEditContact());
                    ok(!$submitEditedContact.attr('disabled'));
                });

                asyncTest('update contact information - success pass', function () {
                    var aContacts = new Contacts();
                    function successCB() {
                        ok(true, "success");
                        start();
                    }
                    function errorCB(err) {
                        ok(true, "failed: " + err);
                        start();
                    }
                    document.getElementById('editContact').dataset.docId = '20a7ba46761343da9a08e6774a339a15';
                    document.getElementById('editedLastName').value = data.rows[0].value.last_name + 'editedtest1';
                    document.getElementById('editedFirstName').value = data.rows[0].value.first_name + 'editedtest2';
                    document.getElementById('editedCompany').value = data.rows[0].value.company + ' edited test 3';
                    document.getElementById('editedPhone').value = data.rows[0].value.work_phone;
                    document.getElementById('editedEmail').value = 'aura.tuomas@edited.fi';
                    document.getElementById('editedNote').value = data.rows[0].value.note + ' edited test';
                    ok(aContacts.updateCurrentContact($.Event('click', {
                        currentTarget : $('<button id="submitEditedContact" type="submit" class="pure-button pure-button-primary edit-contact-button">Update</button>')[0]
                    }), successCB, errorCB));
                });

                asyncTest('update contact information - failed pass', function () {
                    var aContacts = new Contacts();
                    function successCB() {
                        ok(true, "success");
                        start();
                    }
                    function errorCB(err) {
                        ok(true, "failed: " + err);
                        start();
                    }
                    document.getElementById('editContact').dataset.docId = '20a7ba46761343da9a08e6774a339a15';
                    document.getElementById('editedLastName').value = data.rows[0].value.last_name + ' editedtest1';
                    document.getElementById('editedFirstName').value = data.rows[0].value.first_name + ' editedtest2';
                    document.getElementById('editedCompany').value = data.rows[0].value.company + ' edited test 3';
                    document.getElementById('editedPhone').value = data.rows[0].value.work_phone + 'df';
                    document.getElementById('editedEmail').value = 'aura.tuomas@edited.fi';
                    document.getElementById('editedNote').value = data.rows[0].value.note + ' edited test';
                    ok(aContacts.updateCurrentContact($.Event('click', {
                        currentTarget : $('<button id="submitEditedContact" type="submit" class="pure-button pure-button-primary edit-contact-button">Update</button>')[0]
                    }), successCB, errorCB));
                });
            }
        };
    });