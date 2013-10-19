/**
 * Author: Ken
 * Date: 25/09/2013
 * Time: 21:11
 */
/*global define, HTMLElement, DOMException*/
define(['../javascripts/constant.js', ''], function (CONSTANT) {
    "use strict";
    /**
     * helper DOM
     * @constructor
     */
    function DOM() {
        var self = this;

        /**
         * get a DOM node for showing contact detail
         * x makes sense when it is phone or email
         * @param x {String} it impacts on the node's class name.
         * e.g. contact-detail-email-item
         * @param xFiled {String} the field name like 'phone' then after it,
         * is the phone number. e.g. phone + 358 00 000 0000, the 'phone' refers to the field
         * @param xContent {String} the content of the field.
         * in the above example, the actual phone number is the content.
         * @returns {HTMLElement}
         */
        self.getNewXItem = function (x, xFiled, xContent) {
            var contactDetailXItem,
                xFiledUnit,
                contactDetailFieldName,
                contactDetailFieldNameText,
                detailFieldUnit,
                contactDetailX,
                contactDetailXText;

            contactDetailXItem = document.createElement('div');
            contactDetailXItem.setAttribute('class', 'pure-g contact-detail-' + x + '-item');

            xFiledUnit = document.createElement('div');
            xFiledUnit.setAttribute('class', 'pure-u-1-3');
            contactDetailXItem.appendChild(xFiledUnit);

            contactDetailFieldName = document.createElement('h6');
            contactDetailFieldName.setAttribute('class', 'contact-detail-field-name contact-detail-' + x + '-field-name');
            contactDetailFieldNameText = document.createTextNode(xFiled || '');
            contactDetailFieldName.appendChild(contactDetailFieldNameText);
            xFiledUnit.appendChild(contactDetailFieldName);

            detailFieldUnit = document.createElement('div');
            detailFieldUnit.setAttribute('class', 'pure-u-2-3');
            contactDetailXItem.appendChild(detailFieldUnit);

            contactDetailX = document.createElement('h6');
            contactDetailX.setAttribute('class', 'contact-detail-' + x + ' contact-detail');
            contactDetailXText = document.createTextNode(xContent || '');
            contactDetailX.appendChild(contactDetailXText);
            detailFieldUnit.appendChild(contactDetailX);

            return contactDetailXItem;
        };
        /**
         * return a dom tree used to attach to the contact list
         * @param contact {Object}
         * example of the contact object:
         * {id: '20a7ba46761343da9a08e6774a339a15',
         * value:{
         * first_name : "Ken",
         * last_name : "HUANG",
         * company : "F-Secure",
         * note : "He has officially ... "
         * }}
         * @returns {HTMLElement}
         */
        self.getContactItemWrap = function (contact) {
            var LENGTH_LIMIT = CONSTANT.NAME.LENGTH,
                firstName,
                lastName,
                companyName,
                contactItemWrap,
                contactItem,
                profileNickName,
                contactInfoUnit,
                text,
                contactName,
                contactCompany,
                contactNote,
                closeImg,
                removeContactButtonArea;

            /*jslint nomen: true*/
            function isProfileImgExist(contact) {
                return contact && contact._attachments;
            }
            /*jslint nomen: false*/

            contactItemWrap = document.createElement('div');
            contactItemWrap.setAttribute('class', 'contact-item-wrap');

            contactItem = document.createElement("div");
            contactItem.setAttribute('class', 'contact-item pure-u-4-5');
            contactItem.setAttribute('data-doc-id', contact.id);

            contactItemWrap.appendChild(contactItem);

            profileNickName = document.createElement('p');
            profileNickName.setAttribute('class', 'pure-u nick-name-icon');

            contactItem.appendChild(profileNickName);

            contactInfoUnit = document.createElement("div");
            contactInfoUnit.setAttribute('class', 'pure-u-4-5');

            contactItem.appendChild(contactInfoUnit);

            contactName = document.createElement("h5");
            contactName.setAttribute('class', 'contact-name');
            firstName = contact.value.first_name;
            firstName = firstName.length > LENGTH_LIMIT ?
                    firstName.slice(0, LENGTH_LIMIT) : firstName;
            lastName = contact.value.last_name;
            lastName = lastName.length > LENGTH_LIMIT ?
                    lastName.slice(0, LENGTH_LIMIT) : lastName;
            text = document.createTextNode(firstName + ", " + lastName);
            contactName.appendChild(text);
            contactInfoUnit.appendChild(contactName);

            profileNickName.innerHTML = firstName.slice(0, 1).toUpperCase() + lastName.slice(0, 1).toUpperCase();

            contactCompany = document.createElement("h6");
            contactCompany.setAttribute('class', 'contact-company');
            companyName = contact.value.company;
            text = document.createTextNode(companyName.length > LENGTH_LIMIT ?
                    companyName.slice(0, LENGTH_LIMIT) : companyName);
            contactCompany.appendChild(text);
            contactInfoUnit.appendChild(contactCompany);

            contactNote = document.createElement("p");
            contactNote.setAttribute('class', 'contact-note');
            text = contact.value.note.slice(0, LENGTH_LIMIT);
            text = document.createTextNode(text.length === 0 ? '' : text  + ' ...');
            contactNote.appendChild(text);
            contactInfoUnit.appendChild(contactNote);

            closeImg = document.createElement('img');
            closeImg.setAttribute('class', 'remove-contact-button');
            closeImg.style.display =  "none";
            closeImg.setAttribute('src', '/images/close.png');

            removeContactButtonArea = document.createElement('div');
            removeContactButtonArea.setAttribute('class', 'pure-u remove-contact-button-area');
            removeContactButtonArea.appendChild(closeImg);

            contactItemWrap.appendChild(removeContactButtonArea);
            return contactItemWrap;
        };

        self.showCloseButtonEffectArea = function (domElement) {
            var i;
            for (i = 0; i < domElement.length; i = i + 1) {
                domElement[i].style.position = "relative";
                domElement[i].style.display = "block";
            }
        };

        self.hideCloseButtonEffectArea = function (domElement) {
            var i;
            for (i = 0; i < domElement.length; i = i + 1) {
                domElement[i].style.position = "relative";
                domElement[i].style.display = "none";
            }
        };

        self.showContactList = function (domElement) {
            domElement[0].style.position = "";
            domElement[0].style.display = "block";
        };

        self.hideContactList = function (domElement) {
            domElement[0].style.display = "none";
        };

        self.showRemoveContactButton = function (event) {
            var i,
                removeContactButtons = document.getElementsByClassName('remove-contact-button');
            if (removeContactButtons) {
                for (i = 0; i < removeContactButtons.length; i = i + 1) {
                    removeContactButtons[i].style.display = 'block';
                }
            }
        };

        self.hideRemoveContactButton = function (event) {
            var i,
                removeContactButtons = document.getElementsByClassName('remove-contact-button');
            if (removeContactButtons) {
                for (i = 0; i < removeContactButtons.length; i = i + 1) {
                    removeContactButtons[i].style.display = 'none';
                }
            }
        };

        self.hideAllContactControl = function () {
            var i,
                contactControl = document.getElementsByClassName('index-mobile-content-control');
            for (i = 0; i < contactControl.length; i = i + 1) {
                if (contactControl[i].style) {
                    contactControl[i].style.display = 'none';
                }
            }
        };

    }
    return DOM;
});