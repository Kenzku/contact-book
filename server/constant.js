/**
 * Author: Ken
 * Date: 22/09/2013
 * Time: 22:10
 */
exports.DATABASE = {
    NAME : "contact-app",
    DESIGN_NAME : 'contacts',
    VIEW_NAME : 'all_contacts'
};

exports.ERROR = {
    COUCH_DB : {
        READ : 'read document error',
        UPDATE : 'update document error',
        SAVE : 'save document error',
        DATABASE : 'no database specified',
        REMOVE : 'document remove failed'
    },
    API : {
        CONTACT_ID_REQUIRED : 'contact ID is required'
    }
};