/**
 * Author: Ken
 * Date: 24/09/2013
 * Time: 22:16
 */
/*global define*/
define(['../javascripts/constant.js',
    '../javascripts/loader.js',
    '../javascripts/helper.js',
    '../javascripts/dom.js',
    '../javascripts/notification.js'], function (CONSTANT, Loader, H, Dom, Notification) {
    "use strict";
    function Contacts() {
        var self = this,
            aDom = new Dom();

        /**
         * remove the current contact
         * @param event a DOM event such as a click
         * NOTE: this event should contain a current target which holds the contact ID
         */
        function removeCurrentContact(event) {
            var docId,
                contactItem,
                aLoader = new Loader(),
                aNotification = new Notification();
            function successCB(res) {
                aNotification.notificationSuccess();
                contactItem.parentNode.remove();
            }
            function errorCB(err) {
                aNotification.notificationFail();
            }
            if (event.currentTarget &&
                    event.currentTarget.parentNode &&
                    event.currentTarget.parentNode.previousSibling) {
                contactItem = event.currentTarget.parentNode.previousSibling;
                docId = contactItem.dataset.docId;
                aLoader.requestURL('DELETE', '/contact/' + docId + '/delete', null, successCB, errorCB);
            }
        }

        /**
         * sanitise basic input, will be further check on the server side
         * @param input
         * @returns {XML|string}
         */
        function basicSanitise(input) {
            return input.replace(/&/g, '&amp; ').replace(/</g, '&lt; ').replace(/"/g, '&quot; ');
        }

        /**
         * init close button that effect the close button effecting area
         */
        self.initCloseButton = function () {
            var i,
                closeButton = document.getElementsByClassName('close-button'),
                contentBodyDetail = document.getElementsByClassName('close-button-effect-area'),
                contentBodyShowAll = document.getElementsByClassName('content-body-show-all');
            function CloseButtonEffectAreaHelper() {
                aDom.hideCloseButtonEffectArea(contentBodyDetail);
                aDom.showContactList(contentBodyShowAll);
            }
            for (i = 0; i < closeButton.length; i = i + 1) {
                if (closeButton && closeButton[i]) {
                    closeButton[i].addEventListener('click', CloseButtonEffectAreaHelper);
                }
            }
        };

        /**
         * init the done button whose job is to upload new contact
         * @param successCallback (body)
         * @param errorCallback (error)
         */
        self.initDoneButton = function (successCallback, errorCallback) {
            var addNewContactForm = document.getElementById('add-new-contact-form'),
                submitNewContact = document.getElementById('submitNewContact');
            if (addNewContactForm) {
                addNewContactForm.addEventListener('submit', function (event) {
                    self.submitNewContact(event, successCallback, errorCallback);
                });
                submitNewContact.disabled = true;
            }
        };

        /**
         *  init update button whose job is to update the contact
         * @param successCallback
         * @param errorCallback
         */
        self.initUpdateButton = function (successCallback, errorCallback) {
            var editContactForm = document.getElementById('edit-contact-form'),
                submitEditedContact = document.getElementById('submitEditedContact');
            if (editContactForm) {
                editContactForm.addEventListener('submit', function (event) {
                    self.updateCurrentContact(event, successCallback, errorCallback);
                    // disabled the button
                    submitEditedContact.disabled = true;
                });
            }
        };
        /**
         * retrieve all contacts from database
         * @param successCallback (response)
         * @param errorCallback (error)
         */
        self.getAllContacts = function (successCallback, errorCallback) {
            var aLoader = new Loader();
            aLoader.requestURL('GET', CONSTANT.API.ALL_CONTACTS, null, successCallback, errorCallback);
        };
        /**
         * populate contacts info on the DOM tree
         * @param contacts {Array} an array of contact objects
         * @param eventCallback (event)
         * @returns {boolean}
         */
        self.populate = function (contacts, eventCallback) {
            var aDom = new Dom(),
                contactItemWrap,
                contactItem,
                removeContactButtons,
                i,
                contactList;

            for (i = 0; i < contacts.length; i = i + 1) {
                try {
                    contactList = document.getElementById('contactList');
                    contactItemWrap = aDom.getContactItemWrap(contacts[i]);
                    contactItem = contactItemWrap.firstChild;
                    contactList.appendChild(contactItemWrap);

                    if (eventCallback && typeof eventCallback === 'function') {
                        contactItem.addEventListener('click', eventCallback);
                    }

                    // append to session storage
                    if (Storage === undefined) {
                        throw CONSTANT.ERROR.HTML5.STORAGE;
                    } else {
                        sessionStorage.setItem(contacts[i].id, JSON.stringify(contacts[i].value));
                    }
                } catch (e) {
                    console.log(e);
                    return false;
                }
            }
            removeContactButtons = document.getElementsByClassName('remove-contact-button');
            for (i = 0; i < removeContactButtons.length; i = i + 1) {
                removeContactButtons[i].addEventListener('click', removeCurrentContact);
            }
            return true;
        };
        /**
         * An event callback that reads contact detail from session storage and,
         * show the detail in the dom tree
         * @param event {Event} dom event such as click
         * @returns {boolean} return false in case of error
         */
        self.showContactDetail = function (event) {
            var i,
                aDom = new Dom(),
                contactID,
                contactDetail = {},
                contentBodyShowAll,
                contentBodyDetail,
                lastName,
                firstName,
                companyName,
                // use for phone
                contactDetailPhoneGroup,
                contactDetailPhoneItem,
                contactDetailFieldName,
                contactDetailPhoneNumber,
                newContactDetailPhoneItem,
                // use for email
                contactDetailEmailGroup,
                contactDetailEmailItem,
                contactDetailEmail,
                newContactDetailEmailItem,
                note;
            event.preventDefault();
            try {
                contactID = event.currentTarget.dataset.docId;
                // if the session storage is supported
                if (Storage === undefined) {
                    throw CONSTANT.ERROR.HTML5.STORAGE;
                    // FUTURE: query backend server and ask for data
                } else {
                    contactDetail = JSON.parse(sessionStorage.getItem(contactID));
                    contentBodyDetail = document.getElementsByClassName('content-body-detail');
                    contentBodyShowAll = document.getElementsByClassName('content-body-show-all');

                    lastName = document.getElementsByClassName('contact-detail-last-name');
                    lastName[0].innerHTML = contactDetail.last_name;

                    firstName = document.getElementsByClassName('contact-detail-first-name');
                    firstName[0].innerHTML = contactDetail.first_name;

                    companyName = document.getElementsByClassName('contact-detail-company');
                    companyName[0].innerHTML = contactDetail.company;

                    // create phone
                    contactDetailPhoneItem = document.getElementsByClassName('contact-detail-phone-item');
                    contactDetailPhoneGroup = document.getElementById('contact-detail-phone-group');
                    if (contactDetail && contactDetail.work_phone && H.is_array(contactDetail.work_phone)) {
                        for (i = 0; i < contactDetail.work_phone.length; i = i + 1) {
                            if (contactDetailPhoneItem[i]) {
                                contactDetailFieldName = document.getElementsByClassName('contact-detail-phone-field-name');
                                contactDetailFieldName[i].innerHTML = CONSTANT.NAME.PHONE;
                                contactDetailPhoneNumber = document.getElementsByClassName('contact-detail-phone');
                                contactDetailPhoneNumber[i].innerHTML = contactDetail.work_phone[i] || '';
                            } else {
                                newContactDetailPhoneItem = aDom.getNewXItem(CONSTANT.NAME.PHONE, CONSTANT.NAME.PHONE, contactDetail.work_phone[i]);
                                contactDetailPhoneGroup.appendChild(newContactDetailPhoneItem);
                            }
                        }
                    }

                    // create email
                    contactDetailEmailGroup = document.getElementById('contact-detail-email-group');
                    contactDetailEmailItem = document.getElementsByClassName('contact-detail-email-item');

                    if (contactDetail && contactDetail.work_email && H.is_array(contactDetail.work_email)) {
                        for (i = 0; i < contactDetail.work_email.length; i = i + 1) {
                            if (contactDetailEmailItem[i]) {
                                contactDetailFieldName = document.getElementsByClassName('contact-detail-email-field-name');
                                contactDetailFieldName[i].innerHTML = CONSTANT.NAME.EMAIL;
                                contactDetailEmail = document.getElementsByClassName('contact-detail-email');
                                contactDetailEmail[i].innerHTML = contactDetail.work_email[i] || '';
                            } else {
                                newContactDetailEmailItem = aDom.getNewXItem(CONSTANT.NAME.EMAIL, CONSTANT.NAME.EMAIL, contactDetail.work_email[i]);
                                contactDetailEmailGroup.appendChild(newContactDetailEmailItem);
                            }
                        }
                    }

                    note  = document.getElementsByClassName('contact-detail-note');
                    note[0].innerHTML = contactDetail.note;

                    aDom.showCloseButtonEffectArea(contentBodyDetail);
                    aDom.hideContactList(contentBodyShowAll);
                }
            } catch (e) {
                console.log(e);
                return false;
            }
            return true;
        };
        /**
         * An event callback that adds new contact into the database
         * @param event a dom event such as click
         * @param successCallback (response)
         * @param errorCallback (error)
         * @returns {*}
         */
        self.submitNewContact = function (event, successCallback, errorCallback) {
            var data = {},
                aLoader = new Loader();

            event.preventDefault();
            data.lastName = basicSanitise(document.getElementById('newLastName').value);
            data.firstName = basicSanitise(document.getElementById('newFirstName').value);
            data.company = basicSanitise(document.getElementById('newCompany').value);
            data.phone = basicSanitise(document.getElementById('newPhone').value);
            data.email = basicSanitise(document.getElementById('newEmail').value);
            data.note = basicSanitise(document.getElementById('newNote').value);
            function successCB(body) {
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(body);
                }
            }
            function errorCB(err) {
                if (errorCallback && typeof errorCallback === 'function') {
                    errorCallback(err);
                } else {
                    throw CONSTANT.ERROR.ADD_NEW;
                }
            }
            aLoader.requestURL('post', CONSTANT.API.ADD_NEW, data, successCB, errorCB);
            return self;
        };
        /**
         * An event callback that shows the add new contact form
         * meanwhile, it will enable the 'done' button
         * @param event {Event} a dom event such as click
         * @returns {Contacts} return false in case of an error
         */
        self.displayAddNewContact = function (event) {
            var contentBodyAddNewContact = document.getElementsByClassName('content-body-add-new-contact'),
                contentBodyShowAll = document.getElementsByClassName('content-body-show-all'),
                submitNewContact = document.getElementById('submitNewContact');
            event.preventDefault();
            try {
                if (contentBodyAddNewContact && contentBodyAddNewContact[0]) {
                    contentBodyAddNewContact[0].style.display = 'block';
                    if (contentBodyAddNewContact[0].firstChild) {
                        // the first child is the form
                        contentBodyAddNewContact[0].firstChild.reset();
                    }
                }
                submitNewContact.disabled = false;
                aDom.hideContactList(contentBodyShowAll);
            } catch (e) {
                console.log(e);
                return null;
            }
            return self;
        };
        /**
         * An event callback that fills the contact information
         * into an form, the edit contact form
         * The form is not shown to user yet.
         * @param event {Event} a dom event such as click
         * @param event
         * @returns {Contacts} return false in case of an error
         */
        self.showEditContactDetail = function (event) {
            var contactID,
                contactDetail = {},
                editContactForm,
                lastNameNode,
                firstNameNode,
                companyNode,
                phoneNode,
                emailNode,
                noteNode;

            try {
                contactID = event.currentTarget.dataset.docId;
                editContactForm = document.getElementById('edit-contact-form');
                lastNameNode = document.getElementById('editedLastName');
                firstNameNode = document.getElementById('editedFirstName');
                companyNode = document.getElementById('editedCompany');
                phoneNode = document.getElementById('editedPhone');
                emailNode = document.getElementById('editedEmail');
                noteNode = document.getElementById('editedNote');

                editContactForm.reset();

                if (contactID) {
                    contactDetail = JSON.parse(sessionStorage.getItem(contactID));
                    lastNameNode.value = contactDetail.first_name;
                    firstNameNode.value = contactDetail.last_name;
                    companyNode.value = contactDetail.company;
                    phoneNode.value = contactDetail.work_phone;
                    emailNode.value = contactDetail.work_email;
                    noteNode.value = contactDetail.note;
                } else {
                    throw CONSTANT.ERROR.CONTACT_ID_NOT_FOUND;
                }
            } catch (e) {
                console.log(e);
                return null;
            }
            return self;
        };
        /**
         * it shows the edit form to the user
         * meanwhile release the 'update' button
         * @returns {Contacts} return false in case of an error
         */
        self.displayEditContact = function () {
            var editContactDetail,
                submitEditedContact;
            try {
                editContactDetail = document.getElementsByClassName('content-body-edit-contact');
                submitEditedContact = document.getElementById('submitEditedContact');
                if (editContactDetail && editContactDetail[0] && editContactDetail[0].style) {
                    editContactDetail[0].style.display = 'block';
                    submitEditedContact.disabled = false;
                } else {
                    throw CONSTANT.ERROR.DOM;
                }
            } catch (e) {
                console.log(e);
                return null;
            }
            return self;
        };
        /**
         * update contact information to the database
         * @param event {Event} a dom event such as click
         * @param successCallback (response)
         * @param errorCallback (error)
         * @returns {Contacts}
         */
        self.updateCurrentContact = function (event, successCallback, errorCallback) {
            var data = {},
                aLoader = new Loader();
            event.preventDefault();
            function successCB(body) {
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(body);
                }
            }
            function errorCB(err) {
                if (errorCallback && typeof errorCallback === 'function') {
                    errorCallback(err);
                } else {
                    throw CONSTANT.ERROR.EDIT_CONTACT;
                }
            }
            try {
                data.contactId = basicSanitise(document.getElementById('editContact').dataset.docId);
                data.lastName = basicSanitise(document.getElementById('editedLastName').value);
                data.firstName = basicSanitise(document.getElementById('editedFirstName').value);
                data.company = basicSanitise(document.getElementById('editedCompany').value);
                data.phone = basicSanitise(document.getElementById('editedPhone').value);
                data.email = basicSanitise(document.getElementById('editedEmail').value);
                data.note = basicSanitise(document.getElementById('editedNote').value);

                aLoader.requestURL('put', CONSTANT.API.EDIT, data, successCB, errorCB);
            } catch (e) {
                console.log(e);
                return null;
            }
            return self;
        };
    }
    return Contacts;
});