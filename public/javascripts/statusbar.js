/**
 * User: Ken
 * Date: 03/10/2013
 * Time: 10:44
 */
/*global define*/
define(['../javascripts/dom.js', '../javascripts/contacts.js'], function (Dom, Contact) {
    "use strict";
    function StatusBar() {
        var self = this,
            addButton = document.getElementById('addContact'),
            editButton = document.getElementById('editContact'),
            aContact = new Contact(),
            aDom = new Dom(),
            docId;

        self.onsubmit = null;
        /**
         * init the add button,
         * so that the application shows an add-new-contact form to the user
         * @returns {StatusBar}
         */
        self.initAddButton = function () {
            function displayAddNewContactHelper(event) {
                aDom.hideAllContactControl();
                aContact.displayAddNewContact(event);
            }
            if (addButton) {
                addButton.addEventListener('click', displayAddNewContactHelper);
            }
            return self;
        };

        self.initEditButton = function () {
            if (editButton) {
                editButton.addEventListener('click', self.displayXHelper);
            }
            return self;
        };
        /**
         * a helper function trigger by clicking the edit button
         * it shows close buttons to each contact item in the contact list,
         * or it shows the close button on the contact detain panel
         * @param event
         * @returns {StatusBar}
         */
        self.displayXHelper = function (event) {
            var removeContactButtons,
                contentBodyShowAll,
                contentBodyDetail;
            contentBodyShowAll = document.getElementsByClassName('content-body-show-all');
            contentBodyDetail = document.getElementsByClassName('content-body-detail');
            if (contentBodyShowAll[0] &&
                    contentBodyShowAll[0].style &&
                    contentBodyShowAll[0].style.display === 'block') {
                // if displaying all contacts
                removeContactButtons = document.getElementsByClassName('remove-contact-button');
                if (removeContactButtons && removeContactButtons[0]) {
                    if (removeContactButtons[0] &&
                            removeContactButtons[0].style.display === 'none') {
                        // show
                        aDom.showRemoveContactButton(event);
                        return self;
                    }
                    if (removeContactButtons[0] &&
                            removeContactButtons[0].style.display === 'block') {
                        // show
                        aDom.hideRemoveContactButton(event);
                        return self;
                    }
                }
            } else if (contentBodyDetail[0] &&
                    contentBodyDetail[0].style &&
                    contentBodyDetail[0].style.display === 'block') {
                // in detail mode
                aDom.hideAllContactControl();
                aContact.showEditContactDetail(event);
                aContact.displayEditContact();
                return self;
            }
        };
        /**
         * update the edit button data attribute
         * @param event
         * @returns {*}
         */
        self.updateEditButtonDataSet = function (event) {
            var contactId;
            try {
                contactId = event.currentTarget.dataset.docId;
                if (contactId) {
                    editButton.setAttribute('data-doc-id', contactId);
                }
            } catch (e) {
                return false;
            }
            return self;
        };

    }
    return StatusBar;
});