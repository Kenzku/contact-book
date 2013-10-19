/**
 * Author: Ken
 * Date: 24/09/2013
 * Time: 22:15
 */
/*global define*/
require.config({
    paths: {
        'contacts' : '/javascripts/contacts',
        'constant' : '/javascripts/constant',
        'search' : '/javascripts/search',
        'searchbox' : '/javascripts/searchbox',
        'statusbar' : '/javascripts/statusbar',
        'notification' : '/javascripts/notification',
        'dom' : '/javascripts/dom',
        'contactworker' : '/javascripts/contactworker'
    }
});

require(['contacts', 'constant', 'search', 'searchbox', 'statusbar', 'notification', 'dom', 'contactworker'],
    function (Contacts, CONSTANT, Search, SearchBox, StatusBar, Notification, Dom, ContactWorker) {
        "use strict";
        var i,
            aContacts = new Contacts(),
            aSearch = new Search(),
            aSearchBox = new SearchBox(),
            aStatusBar = new StatusBar(),
            aNotification = new Notification(),
            aDom = new Dom(),
            aContactWorker = new ContactWorker(),
            theWorker,
            contentShowAllInnerHTML,
            originalDetailInnerHTML;

        /**
         * populate contacts to the DOM tree
         * @param event a DOM event such as a click
         */
        function populateContactHelper(event) {
            aDom.hideAllContactControl();
            aStatusBar.updateEditButtonDataSet(event);
            aContacts.showContactDetail(event);
        }

        /**
         * worker on message call back
         * i.e. when the worker post message
         * this function will be called
         * @param event a message from the worker
         */
        function onWorkerMessage(event) {
            var newContact;
            function updateContactListHelper(newContact) {
                var contactDetail;
                if (Storage === undefined) {
                    throw CONSTANT.ERROR.HTML5.STORAGE;
                    // FUTURE: query backend server and ask for data
                } else {
                    contactDetail = JSON.parse(sessionStorage.getItem(newContact.id));
                    if (contactDetail) {
                        // has the ID already
                        sessionStorage.setItem(newContact.id, JSON.stringify(newContact.value));
                    } else {
                        // new contact
                        aContacts.populate([newContact], populateContactHelper);
                    }
                }
            }
            if (event && event.data && event.data.ok) {
                if (event.data.message) {
                    newContact = JSON.parse(event.data.message);
                    updateContactListHelper(newContact);
                } else {
                    aNotification.notificationFail('WebWorker Fail');
                }

            }
        }
        /**
         * if gets contacts, successful callback
         * @param res [Object]
         */
        function getAllContactSuccessCB(res) {
            // restore the current template
            contentShowAllInnerHTML = document.getElementsByClassName('contact-content-body');
            originalDetailInnerHTML = document.getElementsByClassName('content-body-detail');
            // populate contacts
            aContacts.populate(JSON.parse(res).rows, populateContactHelper);
            // add contact name to search function
            for (i = 0; i < JSON.parse(res).rows.length; i = i + 1) {
                aSearch.wordsToSearch.push(JSON.parse(res).rows[i].key);
                aSearch.docIds.push(JSON.parse(res).rows[i].id);
            }
        }
        /**
         * if error
         * @param res [Object]
         */
        function getAllContactErrorCB() {
            aNotification.notificationFail();
        }

        /**
         * done button success callback
         * i.e. successfully add new contact
         * @param res response from the server
         */
        function doneSuccessCB(res) {
            var contentBodyDetail = document.getElementsByClassName('close-button-effect-area'),
                contentBodyShowAll = document.getElementsByClassName('content-body-show-all'),
                data = JSON.parse(res);
            theWorker = aContactWorker.createWorker(onWorkerMessage);
            aDom.hideCloseButtonEffectArea(contentBodyDetail);
            aDom.showContactList(contentBodyShowAll);
            aNotification.notificationSuccess();
            if (res && data && data.ok && data.id) {
                aContactWorker.contactWorker(data.id);
            }
        }

        /**
         * done error callback
         * i.e. fail to add new contact
         * @param err
         */
        function doneErrorCB(err) {
            var contentBodyEditContact = document.getElementsByClassName('content-body-edit-contact'),
                contentBodyAddNewContact = document.getElementsByClassName('content-body-add-new-contact'),
                submitEditedContact = document.getElementById('submitEditedContact'),
                submitNewContact = document.getElementById('submitNewContact');
            aNotification.notificationFail();
            if (contentBodyEditContact && contentBodyEditContact[0] &&
                    contentBodyEditContact[0].style &&
                    contentBodyEditContact[0].style.display === 'block') {
                submitEditedContact.disabled = false;
            }
            if (contentBodyAddNewContact && contentBodyAddNewContact[0] &&
                    contentBodyAddNewContact[0].style &&
                    contentBodyAddNewContact[0].style.display === 'block') {
                submitNewContact.disabled = false;
            }
        }
        // initial new contact ids
        if (!window.newContactIds) {
            window.newContactIds = [];
        }
        // retrieve contacts from server
        aContacts.getAllContacts(getAllContactSuccessCB, getAllContactErrorCB);
        // add event listen to the close function
        aContacts.initCloseButton();
        // add auto search function to search box
        aSearch.init();
        // init search form
        aSearchBox.init();
        // init status bar
        aStatusBar.initAddButton()
            .initEditButton();
        // init done button whose job is to add new contact
        aContacts.initDoneButton(doneSuccessCB, doneErrorCB);
        // init update button whose job is to update contact
        aContacts.initUpdateButton(doneSuccessCB, doneErrorCB);
    });