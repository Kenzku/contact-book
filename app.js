
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    test = require('./routes/test'),
    http = require('http'),
    path = require('path'),
    api = require('./server/api'),
    form = require("express-form"),
    helper = require('./server/helper'),
    filter = form.filter,
    validate = form.validate,
    app = exports.app = express();
// all environments
app.set('port', process.env.PORT || 3000);
/*jslint nomen: true*/
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
/*jslint es5: true */
app.use(express.static(path.join(__dirname, 'public')));
/*jslint nomen: false*/
/*jslint es5: false */

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/contacts/all', api.contacts.all);
app.get('/contact/:contactId/read', api.contacts.read);
app.post('/contacts/add', form(
    filter("lastName").trim().entityEncode(),
    filter("firstName").trim().entityEncode(),
    filter("company").trim().entityEncode(),
    filter("phone").trim().entityEncode().custom(function (value) {
        "use strict";
        return value.replace(/\s+/g, "");
    }),
    filter("email").trim().entityEncode(),
    filter("note").entityEncode(),

    validate("lastName").required(),
    validate("firstName").required(),
    validate("phone").is(/^\+?\d+/),
    validate("email").isEmail()
), api.contacts.add);
/*jslint es5: true */
app.delete('/contact/:contactId/delete', api.contacts.remove);
app.put('/contact/edit', form(
    filter("contactId").trim().entityEncode(),
    filter("lastName").trim().entityEncode(),
    filter("firstName").trim().entityEncode(),
    filter("company").trim().entityEncode(),
    filter("phone").trim().entityEncode().custom(function (value) {
        "use strict";
        return value.replace(/\s+/g, "");
    }),
    filter("email").trim().entityEncode(),
    filter("note").entityEncode(),

    validate("lastName").required(),
    validate("firstName").required(),
    validate("phone").is(/^\+?\d+/),
    validate("email").isEmail()
), api.contacts.edit);
/*jslint es5: false */
app.get('/test', test.show);

http.createServer(app).listen(app.get('port'), function () {
    "use strict";
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;