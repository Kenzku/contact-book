/**
 * User: Ken
 * Date: 30/09/2013
 * Time: 19:34
 */
/*global define*/
define(['../javascripts/helper.js',
    '../javascripts/contacts.js', '../javascripts/searchbox.js'], function (H, Contacts, SearchBox) {
    "use strict";
    function Search(wordsToSearch, docIds) {
        var self = this;
        // validation
        if (wordsToSearch && !H.is_array(wordsToSearch)) {
            wordsToSearch = [];
        }
        if (wordsToSearch && !H.is_array(wordsToSearch)) {
            wordsToSearch = [];
        }
        self.wordsToSearch = wordsToSearch || [];
        self.docIds = docIds || [];
        self.minCharsToSearch = 1;
        self.textInputField = null;
        self.wordLoopId = 0;
        self.searchResultNode = null;
        self.searchResultNodeContent = "";

        self.init = function () {
            self.textInputField = document.getElementById('searchBox');
            if (self.textInputField) {
                self.createAppendingNode();
                self.textInputField.onkeydown = self.onFieldFocus;
                self.textInputField.onblur = self.onFieldBlur;
            }
        };
        /**
         * on a field such as a text box getting focus
         */
        self.onFieldFocus = function () {
            self.loop();
        };
        /**
         * on a field such as a text box losing focus
         */
        self.onFieldBlur = function () {
            clearTimeout(self.wordLoopId);
            setTimeout(self.hideSearchResultNode(), 2000);
        };
        /**
         * check if the input in the dictionary
         * if it is, populate to an array which will be used to append to DOM tree
         */
        self.loop = function () {
            var i,
                list = '',
                value = self.textInputField.value,
                numberOfContacts = self.wordsToSearch.length,
                searchResultItemNodes;
            function eventCB(event) {
                var aContacts = new Contacts();
                self.setContact(event);
                // show the contact detail
                aContacts.showContactDetail(event);
                self.hideSearchResultNode();
            }
            if (value.length >= self.minCharsToSearch) {
                for (i = 0; i < numberOfContacts; i = i + 1) {
                    if (value.toLowerCase() === self.wordsToSearch[i].slice(0, value.length).toLowerCase()) {
                        list += '<li><a class="searchResultItem" href="#" data-doc-id="' + self.docIds[i] + '">' + self.wordsToSearch[i] + '</a></li>';
                    }
                }
            }
            if (list !== '') {
                if (self.searchResultNodeContent !== list) {
                    self.searchResultNodeContent = list;
                    // this will be the <ul> content
                    self.searchResultNode.childNodes[0].innerHTML = self.searchResultNodeContent;
                    searchResultItemNodes = document.getElementsByClassName('searchResultItem');
                    for (i = 0; i < searchResultItemNodes.length; i = i + 1) {
                        searchResultItemNodes[i].addEventListener('touchend', eventCB);
                    }
                }
                self.showSearchResultNode();
            } else {
                self.hideSearchResultNode();
            }
        };
        /**
         * append the searched result array to the DOM tree
         */
        self.createAppendingNode = function () {
            var searchForm = self.textInputField.parentNode,
                contactResultList = document.createElement('ul');
            self.searchResultNode = document.createElement("div");
            self.searchResultNode.setAttribute('id', 'searchResult');
            self.searchResultNode.setAttribute('class', 'pure-menu pure-menu-open');
            self.searchResultNode.innerHTML = '';
            self.searchResultNode.appendChild(contactResultList);

            contactResultList.innerHTML = '';
            searchForm.appendChild(self.searchResultNode);
            self.hideSearchResultNode();
        };

        self.showSearchResultNode = function () {
            self.searchResultNode.style.display = "block";
        };
        self.hideSearchResultNode = function () {
            self.searchResultNode.style.display = "none";
        };
        /**
         * set up the contact name to the input box
         * @param event
         */
        self.setContact = function (event) {
            var aSearchBox = new SearchBox();
            // set the form value
            self.textInputField.value = event.currentTarget.innerHTML;
            // set up the form data-doc-id value
            try {
                aSearchBox.setDocId(event.currentTarget.dataset.docId);
            } catch (e) {
                aSearchBox.setDocId('');
            }
        };
    }
    return Search;
});