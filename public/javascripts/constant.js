/**
 * Author: Ken
 * Date: 24/09/2013
 * Time: 22:16
 */
/*global define*/
define(function () {
    "use strict";
    return {
        API : {
            ALL_CONTACTS : '/contacts/all',
            ADD_NEW : '/contacts/add',
            EDIT : '/contact/edit'
        },
        ERROR : {
            HTML5 : {
                STORAGE : 'Storage is not supported'
            },
            ADD_NEW : "Can not add new contact",
            EDIT_CONTACT : "Can not edit the current contact",
            CONTACT_ID_NOT_FOUND : 'Contact id not found',
            DOM : 'DOM error'
        },
        NAME : {
            LENGTH : 30,
            PHONE : 'phone',
            EMAIL : 'email'
        },
        NOTIFICATION : {
            HIDE_TIMEOUT : 3000,
            SUCCESS_TEXT : 'Success!',
            FAIL_TEXT : 'Fail!'
        }
    };
});