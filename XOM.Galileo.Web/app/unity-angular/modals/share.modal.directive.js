(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emShareModal', ShareModal);

    ShareModal.$inject = ['$log', 'clipboard'];

    /**
     * Unity modal.
     * @param {$log} $log
     * @returns {Object} directive definition
     */
    function ShareModal($log, clipboard) {
        var directive = {
            link: link,
            templateUrl: '/app/unity-angular/modal-confirm/modal.confirm.html',
            restrict: 'A',
            scope: {
                title: '@',
                isOpen: '=',
                link: '='
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'app/unity-angular/modals/share.modal.html';
            }
        };
        return directive;

        function link(scope, element, attrs) {
            /**
             * Opens the modal.
             */
            scope.open = function () {
                scope.isOpen = true;
            };

            /**
             * Closes the modal.
             */
            scope.close = function () {
                scope.copied = {};
                scope.isOpen = false;
            };

            /**
             * Click the ok button.
             */
            scope.ok = function () {
                scope.close();
            };

            /**
             * Click the cancel button.
             */
            scope.cancel = function () {
                scope.close();
            }

            // Copy status.
            scope.copied = {};

            /**
             * Copies the link to the clipboard and provides feedback to the user.
             */
            scope.copy = function () {
                scope.copied = {};

                if (!clipboard.supported) {
                    scope.copied = {
                        message: 'Sorry, copy to clipboard is not supported',
                        success: false
                    };
                }
                else {
                    try {
                        clipboard.copyText(scope.link);
                        scope.copied = {
                            message: 'The link has been copied to your clipboard.',
                            success: true
                        };
                    }
                    catch(e) {
                        scope.copied = {
                            message: 'The link did not copy successfully. Please try again or use your browser shortcuts to manually copy the link.',
                            success: false
                        };
                    }
                }
            }

            // Show or hide the modal depending on our scope values.
            if (scope.isOpen === true || scope.isOpen === 'true') {
                scope.open();
            }
            else {
                scope.close();
            }
        }
    }
})();