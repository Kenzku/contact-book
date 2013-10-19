/**
 * Author: Ken
 * Date: 22/09/2013
 * Time: 22:16
 */
var CouchDB = require('../db/CouchDB'),
    CONSTANT = require('./constant');

function Contacts() {
    "use strict";
    var self = this,
        aCouchDB = new CouchDB(CONSTANT.DATABASE.NAME);
    /**
     * show all contact
     * @param successfulCallback
     * @param errorCallback
     */
    self.showAllContact = function (successfulCallback, errorCallback) {
        aCouchDB.getDocumentByView(CONSTANT.DATABASE.DESIGN_NAME,
            CONSTANT.DATABASE.VIEW_NAME,
            '', successfulCallback, errorCallback);
    };
    /**
     * add a new contact
     * @param data {Object}
     * example
     *  data = {};
     *  data.firstName = 'testfirstname';
     *  data.lastName = 'testlastname';
     *  data.company = 'test company';
     *  data.work_phone = '12345';
     *  data.work_email = 'test@test.fi';
     *  data.note = 'note';
     * @param successfulCallback
     * @param errorCallback
     */
    self.addNewContact = function (data, successfulCallback, errorCallback) {
        aCouchDB.saveDocument(data, successfulCallback, errorCallback);
    };
    /**
     * remove the contact give by the docId
     * @param docId (String) a contact id
     * @param successCallback
     * @param errorCallback
     */
    self.removeContact = function (docId, successCallback, errorCallback) {
        aCouchDB.removeDocument(docId, successCallback, errorCallback);
    };

    /**
     * update the contact given by the docID
     * @param docId (String) a contact id
     * @param doc {Object} the contact Object
     * @param successCallback
     * @param errorCallback
     */
    self.updateContact = function (docId, doc, successCallback, errorCallback) {
        aCouchDB.updateDocument(docId, null, doc, successCallback, errorCallback);
    };

    /**
     * read a contact given by the docId
     * @param successCallback
     * @param errorCallback
     */
    self.readContact = function (docId, successCallback, errorCallback) {
        aCouchDB.readDocument(docId, successCallback, errorCallback);
    };
    /**
     * DISCARD
     * @param filter
     * @param successCallback
     * @param errorCallback
     */
    self.readContactByView = function (filter, successCallback, errorCallback) {
        aCouchDB.getDocumentByView(CONSTANT.DATABASE.DESIGN_NAME,
            CONSTANT.DATABASE.VIEW_NAME,
            filter, successCallback, errorCallback);
    };
}

module.exports = Contacts;