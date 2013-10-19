/**
 * User: Ken
 * Date: 15/10/2013
 * Time: 19:58
 */
/*global suite, test, done*/
var app = require('../app'),
    request = require('supertest'),
    expect = require('chai').expect;

function ok(expr, msg) {
    "use strict";
    if (!expr) {
        throw new Error(msg);
    }
}
//mocha ./api.js -R spec -u qunit -t 6000 -g 'api'
suite('api');

test('Test get: It should return all contacts', function (done) {
    "use strict";
    request(app)
        .get('/contacts/all')
        .set('user-agent', 'Mozilla/5.0 (ipad; cpu os 5_0 like mac os x) ' +
            'applewebkit/534.46 (khtml, like gecko) version/5.1 mobile/9a334 safari/7534.48.3')
        .expect(200)
        .end(function (err, res) {
            if (err) {
                done(err);
            } else {
                expect(res.text).to.include('total_rows');
                expect(res.text).to.include('first_name');
                expect(res.text).to.include('last_name');
                done();
            }
        });
});
//mocha ./api.js -R spec -u qunit -t 6000 -g 'create a new contact'
test('Test post: It should return create a new contact', function (done) {
    "use strict";
    var data = {};
    data.firstName = 'testfirstname';
    data.lastName = 'testlastname';
    data.company = 'test company';
    data.work_phone = '12345';
    data.work_email = 'test@test.fi';
    data.note = '<script>alert("sadfasd")</script>';
    request(app)
        .post('/contacts/add')
        .set('user-agent', 'Mozilla/5.0 (ipad; cpu os 5_0 like mac os x) ' +
            'applewebkit/534.46 (khtml, like gecko) version/5.1 mobile/9a334 safari/7534.48.3')
        .send(data)
        .expect(200)
        .end(function (err, res) {
            if (err) {
                done(err);
            } else {
                /*jslint es5: true */
                expect(res).to.have.property('body')
                    .with.property('ok')
                    .that.is.a('boolean');
                /*jslint es5: false */
                done();
            }
        });
});

//mocha ./api.js -R spec -u qunit -t 6000 -g 'a contact with the given id'
test('Test get: It should return a contact with the given id', function (done) {
    "use strict";
    var testedId,
        data = {};
    data.firstName = 'testfirstname';
    data.lastName = 'testlastname';
    data.company = 'test company';
    data.work_phone = '12345';
    data.work_email = 'test@test.fi';
    data.note = '<script>alert("sadfasd")</script>';
    request(app)
        .post('/contacts/add')
        .set('user-agent', 'Mozilla/5.0 (ipad; cpu os 5_0 like mac os x) ' +
            'applewebkit/534.46 (khtml, like gecko) version/5.1 mobile/9a334 safari/7534.48.3')
        .send(data)
        .expect(200)
        .end(function (err, res) {
            if (err) {
                done(err);
            } else {
                testedId = res.body.id;
                request(app)
                    .get('/contact/' + testedId + '/read')
                    .set('user-agent', 'Mozilla/5.0 (ipad; cpu os 5_0 like mac os x) ' +
                        'applewebkit/534.46 (khtml, like gecko) version/5.1 mobile/9a334 safari/7534.48.3')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        } else {
                            /*jslint es5: true */
                            expect(res).to.have.property('body')
                                .with.deep.property('value')
                                    .that.is.an('object')
                                    .with.deep.property('first_name')
                                    .that.to.equal(data.firstName);
                            expect(res.body.value).to.have.ownProperty('last_name', data.lastName);
                            expect(res.body.value).to.have.ownProperty('company', data.company);
                            expect(res.body.value).to.have.ownProperty('work_phone', data.work_phone);
                            expect(res.body.value).to.have.ownProperty('work_email', data.work_email);
                            expect(res.body.value).to.have.ownProperty('note', data.note);
                            /*jslint es5: false */
                            done();
                        }
                    });
            }
        });

});

//mocha ./api.js -R spec -u qunit -t 6000 -g 'edit the contact'
test('Test put: It should edit the contact', function (done) {
    "use strict";
    var testedId,
        data = {},
        editedData = {};
    data.firstName = 'testfirstname';
    data.lastName = 'testlastname';
    data.company = 'test company';
    data.work_phone = '12345';
    data.work_email = 'test@test.fi';
    data.note = '<script>alert("sadfasd")</script>';

    editedData.firstName = 'testeditedfirstname';
    editedData.lastName = 'testeditedlastname';
    editedData.company = 'test edited company';
    editedData.work_phone = '67890';
    editedData.work_email = 'edited@test.fi';
    editedData.note = '<script>alert("edited")</script>';

    request(app)
        .post('/contacts/add')
        .set('user-agent', 'Mozilla/5.0 (ipad; cpu os 5_0 like mac os x) ' +
            'applewebkit/534.46 (khtml, like gecko) version/5.1 mobile/9a334 safari/7534.48.3')
        .send(data)
        .expect(200)
        .end(function (err, res) {
            if (err) {
                done(err);
            } else {
                testedId = res.body.id;
                editedData.contactId = testedId;
                request(app)
                    .put('/contact/edit')
                    .set('user-agent', 'Mozilla/5.0 (ipad; cpu os 5_0 like mac os x) ' +
                        'applewebkit/534.46 (khtml, like gecko) version/5.1 mobile/9a334 safari/7534.48.3')
                    .send(editedData)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        } else {
                            /*jslint es5: true */
                            expect(res).to.have.property('body')
                                .with.deep.property('ok')
                                .that.is.an('boolean')
                                .that.to.equal(true);
                            /*jslint es5: false */
                            done();
                        }
                    });
            }
        });

});

//mocha ./api.js -R spec -u qunit -t 6000 -g 'remove the contact with a given id'
test('Test delete: It should remove the contact with a given id', function (done) {
    "use strict";
    var testedId,
        data = {};
    data.firstName = 'testfirstname';
    data.lastName = 'testlastname';
    data.company = 'test company';
    data.work_phone = '12345';
    data.work_email = 'test@test.fi';
    data.note = '<script>alert("sadfasd")</script>';

    request(app)
        .post('/contacts/add')
        .set('user-agent', 'Mozilla/5.0 (ipad; cpu os 5_0 like mac os x) ' +
            'applewebkit/534.46 (khtml, like gecko) version/5.1 mobile/9a334 safari/7534.48.3')
        .send(data)
        .expect(200)
        .end(function (err, res) {
            if (err) {
                done(err);
            } else {
                testedId = res.body.id;
                /*jslint es5: true */
                request(app)
                    .del('/contact/' + testedId + '/delete')
                    .set('user-agent', 'Mozilla/5.0 (ipad; cpu os 5_0 like mac os x) ' +
                        'applewebkit/534.46 (khtml, like gecko) version/5.1 mobile/9a334 safari/7534.48.3')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            done(err);
                        } else {
                            expect(res).to.have.property('body')
                                .with.deep.property('ok')
                                .that.is.an('boolean')
                                .that.to.equal(true);
                            /*jslint es5: false */
                            done();
                        }
                    });
            }
        });
});