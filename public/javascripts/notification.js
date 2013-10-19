/**
 * User: Ken
 * Date: 11/10/2013
 * Time: 19:18
 */
/*global define*/
define(['../javascripts/constant.js', '../javascripts/loader.js', '../javascripts/helper.js', '../javascripts/dom.js'], function (CONSTANT, Loader, H, Dom) {
    "use strict";
    function Notification() {
        var self = this,
            hideNotificationTimeoutId,
            notificationItem = document.getElementsByClassName('notification-item'),
            notificationImage = document.getElementsByClassName('notification-image'),
            notificationText = document.getElementsByClassName('notification-text');
        function hideNotification() {
            if (notificationItem && notificationItem[0]) {
                notificationItem[0].style.display = 'none';
            }
        }

        function showNotification() {
            if (notificationItem && notificationItem[0]) {
                notificationItem[0].style.display = 'block';
                hideNotificationTimeoutId = setTimeout(hideNotification, CONSTANT.NOTIFICATION.HIDE_TIMEOUT);
            }
        }

        self.clearHideTimeout = function () {
            window.clearTimeout(hideNotificationTimeoutId);
        };
        /**
         * successful notification board
         * @param text
         * @returns {boolean}
         */
        self.notificationSuccess = function (text) {
            try {
                if (notificationImage && notificationImage[0]) {
                    notificationImage[0].setAttribute('class', 'notification-image notification-image-success');
                    notificationImage[0].setAttribute('src', '../images/success.png');
                }
                if (notificationText && notificationText[0]) {
                    notificationText[0].setAttribute('class', 'notification-text notification-text-success');
                    notificationText[0].innerHTML = text || CONSTANT.NOTIFICATION.SUCCESS_TEXT;
                }
                showNotification();
            } catch (e) {
                return false;
            }
            return true;
        };
        /**
         * failed notification board
         * @param text
         * @returns {boolean}
         */
        self.notificationFail = function (text) {
            try {
                if (notificationImage && notificationImage[0]) {
                    notificationImage[0].setAttribute('class', 'notification-image notification-image-fail');
                    notificationImage[0].setAttribute('src', '../images/fail.png');
                }
                if (notificationText && notificationText[0]) {
                    notificationText[0].setAttribute('class', 'notification-text notification-text-fail');
                    notificationText[0].innerHTML = text || CONSTANT.NOTIFICATION.FAIL_TEXT;
                }
                showNotification();
            } catch (e) {
                return false;
            }
            return true;
        };
    }
    return Notification;
});