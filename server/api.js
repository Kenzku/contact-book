/**
 * Author: Ken
 * Date: 22/09/2013
 * Time: 23:45
 */
/*global require*/
var Contacts = require('./contacts'),
    Constant = require('./constant');

function api_module() {
    "use strict";
    function is_array(value) {
        return value &&
            typeof value === 'object' &&
            typeof value.length === 'number' &&
            typeof value.splice === 'function' &&
            !(value.propertyIsEnumerable('length'));
    }
    return {
        contacts : {
            /**
             * get all contacts from internal CouchDB
             * @param req request from the client
             * @param res response to be sent to the client
             */
            all : function (req, res) {
                var aContacts = new Contacts();
                function successCB(rows) {
                    res.json(200, rows);
                }
                function errorCB(err) {
                    res.json(err.status_code || 404, err);
                    console.log("error: " + err);
                }

                aContacts.showAllContact(successCB, errorCB);
            },
            /**
             * add a new contact to the internal CouchDB
             * @param req request from the client
             * @param res response to be sent to the client
             */
            add : function (req, res) {
                var aContacts = new Contacts(),
                    data = {};
                function successCB(rows) {
                    res.json(200, rows);
                }
                function errorCB(err) {
                    res.json(err.status_code || 404, err);
                    console.log("error: " + err);
                }
                if (!req.form.isValid) {
                    console.log(req.form.errors);
                    // Handle errors
                    res.json(400, {error: req.form.errors});
                } else {
                    data.first_name = req.form.firstName;
                    data.last_name = req.form.lastName;
                    data.company = req.form.company || "";
                    if (is_array(req.form.phone)) {
                        data.work_phone =  req.form.phone;
                    } else {
                        data.work_phone =  [req.form.phone];
                    }
                    if (is_array(req.form.email)) {
                        data.work_email =  req.form.email;
                    } else {
                        data.work_email =  [req.form.email];
                    }
                    data.note = req.form.note || "";
                    aContacts.addNewContact(data, successCB, errorCB);
                }
            },
            /**
             * remove the contact from the internal CouchDB
             * @param req request from the client
             * NOTE, the request should contain contactId field/parameter
             * @param res response to be sent to the client
             */
            remove : function (req, res) {
                var docId,
                    aContacts = new Contacts();
                function successCB(body) {
                    res.json(200, body);
                }
                function errorCB(err) {
                    res.json(err.status_code || 404, err);
                    console.log("error: " + err);
                }
                if (req.params && req.params.contactId) {
                    docId = req.params.contactId;
                    aContacts.removeContact(docId, successCB, errorCB);
                } else {
                    res.json(404, Constant.ERROR.API.CONTACT_ID_REQUIRED);
                }
            },
            /**
             * edit the contact from the internal CouchDB
             * @param req request from the client
             * NOTE, the request should contain contactId field
             * @param res response to be sent to the client
             */
            edit : function (req, res) {
                var docId,
                    aContacts = new Contacts(),
                    data = {};
                function successCB(body) {
                    res.json(200, body);
                }
                function errorCB(err) {
                    res.json(err.status_code || 404, err);
                    console.log("error: " + err);
                }
                if (!req.form.isValid) {
                    // Handle errors
                    console.log(req.form.errors);
                    console.log(req.form.phone);
                    res.json(400, {error: req.form.errors});
                } else {
                    docId = req.form.contactId;
                    if (docId) {
                        data.first_name = req.form.firstName;
                        data.last_name = req.form.lastName;
                        data.company = req.form.company || "";
                        if (is_array(req.form.phone)) {
                            data.work_phone =  req.form.phone;
                        } else {
                            data.work_phone =  [req.form.phone];
                        }
                        if (is_array(req.form.email)) {
                            data.work_email =  req.form.email;
                        } else {
                            data.work_email =  [req.form.email];
                        }
                        data.note = req.form.note || "";
                        aContacts.updateContact(docId, data, successCB, errorCB);
                    } else {
                        console.log(Constant.ERROR.API.CONTACT_ID_REQUIRED);
                        res.json(404, Constant.ERROR.API.CONTACT_ID_REQUIRED);
                    }
                }
            },
            /**
             * read a document from CouchDB
             * then, this function will format the data into a format
             * that the client can understand
             * @param req request from the client
             * @param res response to be sent to the client
             */
            read : function (req, res) {
                var docId,
                    aContacts = new Contacts(),
                    data = {};
                function successCB(body) {
                    /*jslint nomen: true*/
                    data.id = body._id;
                    data.key = body.last_name + ', ' + body.first_name;
                    data.value = {};
                    data.value._id = body._id;
                    data.value._rev = body._rev;
                    /*jslint nomen: false*/
                    data.value.first_name = body.first_name;
                    data.value.last_name = body.last_name;
                    data.value.company = body.company;
                    data.value.work_phone = body.work_phone;
                    data.value.work_email = body.work_email;
                    data.value.note = body.note;
                    res.json(200, data);
                }
                function errorCB(err) {
                    res.json(err.status_code || 404, err);
                    console.log("error: " + err);
                }
                if (req.params && req.params.contactId) {
                    docId = req.params.contactId;
                    aContacts.readContact(docId, successCB, errorCB);
                } else {
                    res.json(404, Constant.ERROR.API.CONTACT_ID_REQUIRED);
                }
            }
        }
    };
}

module.exports = api_module();