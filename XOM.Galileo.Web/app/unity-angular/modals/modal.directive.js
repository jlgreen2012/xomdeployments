(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emModal', Modal);

    Modal.$inject = ['$log'];

    /**
     * Unity modal.
     * @param {$log} $log
     * @returns {Object} directive definition
     */
    function Modal($log) {
        var directive = {
            link: link,
            templateUrl: '/app/unity-angular/modal-confirm/modal.confirm.html',
            restrict: 'A',
            scope: {
                title: '@',
                body: '@',
                confirmFunc: '&',
                closeFunc: '&',
                isOpen: '='
            },
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'app/unity-angular/modals/modal.html';
            }
        };
        return directive;

        function link(scope, element, attrs) {
            // Opens the modal.
            scope.open = function () {
                scope.isOpen = true;
            };

            // Closes the modal.
            scope.close = function () {
                scope.isOpen = false;
            };

            // Click the ok button.
            scope.ok = function () {
                scope.close();
                if (typeof scope.confirmFunc !== "undefined") {
                    scope.confirmFunc();
                }
            };

            // Click the cancel button.
            scope.cancel = function () {
                scope.close();
                if (typeof scope.cancelFunc !== "undefined") {
                    scope.cancelFunc();
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