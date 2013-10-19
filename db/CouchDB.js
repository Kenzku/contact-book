/**
 * User: Ken
 * Date: 22/09/2013
 * Time: 22:12
 */

var CONSTANT = require('../server/constant'),
    nconf = require('nconf'),
    nano;
nconf.env();
nano = require('nano')("https://" + nconf.get('HEROKU_CLOUDANT_USERNAME') + ":" + nconf.get('HEROKU_CLOUDANT_PASSWORD') + "@app15816587.heroku.cloudant.com");

function CouchDB(database) {
    "use strict";
    if (!database) {
        throw CONSTANT.ERROR.COUCH_DB.DATABASE;
    }
    var self = this,
        db = nano.use(database);

    /**
     * get documents by the view in the deign document
     * @param designName [String] the name of the design document
     * @param viewName [String] the name of the view in the design document
     * @param filter [Object] { keys : [key1, key2, ...] }, where the key(n) is the key
     * that you defined in the view, it does not have to be the document _id
     * @param successCallback (body) called when succeed
     * example body:
     * { total_rows: 3,
     * offset: 0,
     * rows:
     * [ { id: '096e056aaed8be85855beb637f5faee8',
     * key: true,
     * value: [Object] },
     * { id: '84b26302193bed30eec5008a7ebfe01a',
     * key: true,
     * value: [Object] },
     * { id: '84b26302193bed30eec5008a7ec76a99',
     * key: true,
     * value: [Object] }
     * ] }
     * @param errorCallback (err) called when error
     */
    self.getDocumentByView = function (designName, viewName, filter, successCallback, errorCallback) {
        filter = filter && filter.hasOwnProperty('keys') ? filter : '';
        db.view(designName, viewName, filter, function (err, body) {
            if (!err) {
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(body);
                }
            } else {
                if (errorCallback && typeof errorCallback === 'function') {
                    errorCallback(err);
                }
            }
        });
    };

    /**
     * return all documents' id from the database
     * @param successCallback ([Array]rows) called when read succeed
     * example body.rows:
     * [
     * {
     *   id: '84b26302193bed30eec5008a7eca7a56',
     *   key: '84b26302193bed30eec5008a7eca7a56',
     *   value: { rev: '1-55fa92c1a80a923f12ca22e79eefded1' }
     * },
     * {
     *   id: '9f8a0521edef116d1ff818a9c021cefa',
     *   key: '9f8a0521edef116d1ff818a9c021cefa',
     *   value: { rev: '2-46f3c76fb73e66b0acf5f7361de725b9' }
     * }
     * ]
     * @param errorCallback called when read error
     */
    self.getAllDocumentID = function (successCallback, errorCallback) {
        db.list(function (err, body) {
            if (!err) {
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(body.rows);
                }
            } else {
                if (errorCallback && typeof errorCallback === 'function') {
                    errorCallback(err);
                } else {
                    throw CONSTANT.ERROR.COUCH_DB.READ;
                }
            }
        });
    };

    /**
     * read documents from couchDB
     * @param id {String} document id
     * @param successCallback (body), called when read succeed
     * example body:
     * { _id: '8361e3dfb52f0e28784c3cb53404477a',
     * _rev: '35-f46481583c7fbda939ec2ba9ca79b381',
     * data_field_1 : value_1,
     * data_field_2 : value_2}
     * @param errorCallback (error), called when read error
     */
    self.readDocument = function (id, successCallback, errorCallback) {

        db.get(id, function (err, body) {
            if (err) {
                if (errorCallback && typeof errorCallback === 'function') {
                    errorCallback(err);
                } else {
                    throw CONSTANT.ERROR.COUCH_DB.READ;
                }
            } else {
                if (successCallback && typeof successCallback === 'function') {
                    successCallback(body);
                }
            }
        });
    };
    /**
     * update a filed of the document given by id, or
     * update the old document to the given document, by id, which means
     * it only updates those fields in the given documents
     * @param id {String} document id
     * @param field {String} one field in document to be updated.
     * if field appears, it only update this field
     * @param doc {Object} new document to be updated
     * @param successCallback (body)
     * example body:
     * { ok: true,
     * id: '096e056aaed8be85855beb637f3c7461',
     * rev: '2-c556c96bc5fcfe6c0f6817908352ca62' }
     * @param errorCallback (err)
     */
    self.updateDocument = function (id, field, doc, successCallback, errorCallback) {
        // success for read document
        function successCallback_1(body) {
            /*jslint nomen: true*/
            var _field;
            if (field) {
                if (doc.hasOwnProperty(field)) {
                    body[field] = doc[field];
                }
            } else {
                for (_field in doc) {
                    if (doc.hasOwnProperty(_field)) {
                        body[_field] = doc[_field];
                    }
                }
            }
            /*jslint nomen: false*/
            self.saveDocument(body, successCallback, errorCallback);
        }
        self.readDocument(id, successCallback_1, errorCallback);
    };
    /**
     * save a document to the CouchDB
     * @param doc the document to save
     * @param successCallback (body)
     * @param errorCallback (err)
     */
    self.saveDocument = function (doc, successCallback, errorCallback) {
        // insert 'dataToSave' to CouchDB
        db.insert(doc,
            function (err, http_body, http_headers) {
                if (err) {
                    if (errorCallback && typeof errorCallback === 'function') {
                        errorCallback(err);
                    } else {
                        throw CONSTANT.ERROR.COUCH_DB.SAVE;
                    }
                } else {
                    /**
                     * body example:
                     * { ok: true,
                     *   id: '8361e3dfb52f0e28784c3cb5340055bd',
                     *   rev: '1-0d19569e40b9abc88b79e55d71a48bec' }
                     */
                    if (successCallback && typeof successCallback === 'function') {
                        successCallback(http_body);
                    }
                }
            });
    };
    /**
     * remove a document from database with the id
     * @param docId (String)
     * @param successCallback (body)
     * example body:
     * { ok: true,
     * id: '20c7539804f51019517ea5f970813c53',
     * rev: '2-3a8380690f94e54cb54d8e53531a427b' }
     * @param errorCallback (error)
     */
    self.removeDocument = function (docId, successCallback, errorCallback) {
        self.readDocument(docId, function (body) {
            /*jslint nomen: true*/
            db.destroy(docId, body._rev, function (err, body) {
                /*jslint nomen: false*/
                if (err) {
                    if (errorCallback && typeof errorCallback === 'function') {
                        errorCallback(err);
                    } else {
                        throw CONSTANT.ERROR.COUCH_DB.REMOVE;
                    }
                } else {
                    if (successCallback && typeof successCallback === 'function') {
                        successCallback(body);
                    }
                }
            });
        }, function (err) {
            if (errorCallback && typeof errorCallback === 'function') {
                errorCallback(err);
            } else {
                throw CONSTANT.ERROR.COUCH_DB.READ;
            }
        });
    };
}

module.exports = CouchDB;