/**
 * User: Ken
 * Date: 14/10/2013
 * Time: 21:11
 */
/*global self, postMessage*/
function EventThread() {
    "use strict";
    var that = this;
    that.currentContactId = null;
    that.xhr = new XMLHttpRequest();

    // register an AJAX listener on ready stay changes
    that.xhr.onreadystatechange = function () {
        // on success, for status referencing, please check http://www.w3.org/TR/2006/WD-XMLHttpRequest-20060405/
        if (that.xhr.readyState === 4 && that.xhr.status === 200) {
            that.updateContactDetailToMain(that.xhr.responseText, true);
        } else if (that.xhr.readyState === 4) {
            that.updateContactDetailToMain(that.xhr.responseText, false);
        }
    };

    // download event by ID asynchronously
    that.getContact = function getContact() {
        try {
            that.xhr.open('GET', '/contact/' + that.currentContactId + '/read', true);
            that.xhr.setRequestHeader("Content-type", "application/json");
            that.xhr.send();
        } catch (e) {
            postMessage({ok: false, error: e.message});
        }
    };

    // post message back to the main thread with given message
    that.updateContactDetailToMain = function (message, isOk) {
        postMessage({ok: isOk, message: message});
    };
}

// initialise an EventThread object
var aEventThread = new EventThread();

// worker listens on on-coming message from the main thread
self.addEventListener('message', function (message) {
    "use strict";
    aEventThread.currentContactId = message.data;
    if (aEventThread.currentContactId) {
        aEventThread.getContact();
    } else {
        postMessage({ok: false, error: 'no contact id'});
    }
}, false);