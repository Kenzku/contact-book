/**
 * User: Ken
 * Date: 15/10/2013
 * Time: 17:32
 */
/*global suite, test, done, instanceof*/
var app = require('../app'),
    request = require('supertest'),
    expect = require('chai').expect;

function ok(expr, msg) {
    "use strict";
    if (!expr) {
        throw new Error(msg);
    }
}
// mocha ./server.js -R spec -u qunit -t 6000 -g 'Index Page'
suite('Index Page');

test('It should return the mobile side with iPad', function (done) {
    "use strict";
    request(app)
        .get('/')
        .set('user-agent', 'Mozilla/5.0 (ipad; cpu os 5_0 like mac os x) ' +
            'applewebkit/534.46 (khtml, like gecko) version/5.1 mobile/9a334 safari/7534.48.3')
        .expect(200)
        .end(function (err, res) {
            if (err) {
                done(err);
            } else {
                expect(res.text).to.include('<link rel="stylesheet" href="/stylesheets/style-mobile.css">');
                done();
            }
        });
});

test('It should return the mobile side with iPhone', function (done) {
    "use strict";
    request(app)
        .get('/')
        .set('user-agent', 'mozilla/5.0 (iphone; cpu iphone os 5_0 like mac os x) ' +
            'applewebkit/534.46 (khtml, like gecko) version/5.1 mobile/9a334 safari/7534.48.3')
        .expect(200)
        .end(function (err, res) {
            if (err) {
                done(err);
            } else {
                expect(res.text).to.include('<link rel="stylesheet" href="/stylesheets/style-mobile.css">');
                done();
            }
        });
});

test('It should return the desktop side with Mac', function (done) {
    "use strict";
    request(app)
        .get('/')
        .set('user-agent', 'mozilla/5.0 (macintosh; intel mac os x 10_8_5)' +
            'applewebkit/537.36 (khtml, like gecko) chrome/28.0.1500.71 safari/537.36')
        .expect(200)
        .end(function (err, res) {
            if (err) {
                done(err);
            } else {
                expect(res.text.toLowerCase()).to.include('coming soon');
                done();
            }
        });
});

// mocha ./server.js -R spec -u qunit -t 6000 -g 'CouchDB'
suite('CouchDB');

// mocha ./server.js -R spec -u qunit -t 6000 -g 'save a document'
test('I can save a document to the database', function (done) {
    "use strict";
    var CouchDB = require('../db/CouchDB'),
        aCouchDB = new CouchDB('test-contact-app');
    function successCB(http_body) {
        expect(http_body).to.include.keys('ok');
        expect(http_body).to.include.keys('id');
        done();
    }
    function errorCB(err) {
        done("fail done");
    }
    aCouchDB.saveDocument({test: true}, successCB, errorCB);
});

// mocha ./server.js -R spec -u qunit -t 6000 -g 'update a document'
test('I can update a document in the database', function (done) {
    "use strict";
    var CouchDB = require('../db/CouchDB'),
        aCouchDB = new CouchDB('test-contact-app');
    function updateSuccessCB(body) {
        done();
    }
    function updateErrorCB(err) {
        done(err);
    }
    function saveSuccessCB(http_body) {
        aCouchDB.updateDocument(http_body.id, '', {test : false}, updateSuccessCB, updateErrorCB);
    }
    aCouchDB.saveDocument({test: true}, saveSuccessCB, null);
});

// mocha ./server.js -R spec -u qunit -t 6000 -g 'read a document'
test('I can read a document in the database', function (done) {
    "use strict";
    var CouchDB = require('../db/CouchDB'),
        aCouchDB = new CouchDB('test-contact-app');
    function readSuccessCB(body) {
        expect(body).to.include.keys('_id');
        expect(body).to.include.keys('test');
        done();
    }
    function readErrorCB(err) {
        done(err);
    }
    function saveSuccessCB(http_body) {
        aCouchDB.readDocument(http_body.id, readSuccessCB, readErrorCB);
    }
    aCouchDB.saveDocument({test: true}, saveSuccessCB, null);
});

// mocha ./server.js -R spec -u qunit -t 6000 -g 'read all documents'
test('I can read all documents in the database', function (done) {
    "use strict";
    var CouchDB = require('../db/CouchDB'),
        aCouchDB = new CouchDB('test-contact-app');
    function allSuccessCB(body) {
        /*jslint es5: true */
        expect(body).to.be.instanceof(Array);
        /*jslint es5: false */
        expect(body[0]).to.have.deep.property('id');
        expect(body[0]).to.have.deep.property('key');
        expect(body[0]).to.have.deep.property('value');
        done();
    }
    function allErrorCB(err) {
        done(err);
    }
    aCouchDB.getAllDocumentID(allSuccessCB, allErrorCB);
});

// mocha ./server.js -R spec -u qunit -t 6000 -g 'read documents from a view'
test('I can read documents from a view in the database', function (done) {
    "use strict";
    var CouchDB = require('../db/CouchDB'),
        aCouchDB = new CouchDB('test-contact-app');
    function viewSuccessCB(body) {
        expect(body).to.have.property('total_rows');
        expect(body).to.have.property('offset');
        /*jslint es5: true */
        // check body has rows, and rows has key, and the key is a boolean
        expect(body).to.have.property('rows')
            .that.is.an('array')
            .with.deep.property('[0]')
                .that.have.property('key')
            .that.is.a('boolean');
        /*jslint es5: false */
        done();
    }
    function viewErrorCB(err) {
        done(err);
    }
    aCouchDB.getDocumentByView('all_doc', 'test_docs', null, viewSuccessCB, viewErrorCB);
});

// mocha ./server.js -R spec -u qunit -t 6000 -g 'remove a document'
test('I can remove a document in the database', function (done) {
    "use strict";
    var CouchDB = require('../db/CouchDB'),
        aCouchDB = new CouchDB('test-contact-app');
    function removeSuccessCB(body) {
        expect(body).to.have.property('ok')
            .that.is.a('boolean');
        done();
    }
    function removeErrorCB(err) {
        done(err);
    }
    function saveSuccessCB(http_body) {
        aCouchDB.removeDocument(http_body.id, removeSuccessCB, removeErrorCB);
    }
    aCouchDB.saveDocument({test: true}, saveSuccessCB, null);
});


