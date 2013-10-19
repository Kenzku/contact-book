/**
 * User: Ken
 * Date: 30/09/2013
 * Time: 22:44
 */
/*global define*/
define(function () {
    "use strict";
    /**
     * FUTURE DEVELOPER
     * @constructor
     */
    function SearchBox() {
        var self = this,
            searchForm = document.getElementById('searchForm');

        self.onsubmit = null;

        self.init = function () {
            searchForm.addEventListener('submit', self.submitForm);
        };

        self.submitForm = function (event) {
            event.preventDefault();
            // FUTURE: SHOULD SEND A REQUEST AND SEARCH BY NAME
            return false;
        };

        self.setDocId = function (docId) {
            searchForm.setAttribute('data-doc-id', docId);
        };
    }
    return SearchBox;
});