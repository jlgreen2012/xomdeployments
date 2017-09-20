(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emModalConfirm', ModalConfirm);

    ModalConfirm.$inject = ['$log'];

    function ModalConfirm($log) {
        var directive = {
            link: link,
            templateUrl: '/app/unity-angular/modals/modal.confirm.html',
            restrict: 'A',
            transclude: true,
            scope: {
                title: '@',
                confirmFunc: '&?',
                confirmText: '@?',
                cancelFunc: '&?',
                cancelText: '@?',
                isOpen: '='
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

            // Sets defaults for the optional params.
            if (typeof scope.confirmText === "undefined") {
                scope.confirmText = 'OK';
            }
            if (typeof scope.cancelText === "undefined") {
                scope.cancelText = 'Cancel';
            }
        }
    }
})();