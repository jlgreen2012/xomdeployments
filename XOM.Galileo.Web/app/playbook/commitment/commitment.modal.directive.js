(function () {
    'use strict';

    angular
        .module('app.playbook')
        .directive('pbCommitmentModal', Modal);

    Modal.$inject = ['$log'];

    /**
     * Modal for adding and editing commitments.
     * @param {$log} $log
     * @returns {Object} directive definition
     */
    function Modal($log) {
        var directive = {
            link: link,
            templateUrl: 'app/playbook/commitment/partials/commitment.modal.html',
            restrict: 'A',
            scope: {
                title: '@',
                saveFunc: '&',
                closeFunc: '&',
                isOpen: '='
            },
            transclude: true
        };
        return directive;

        /**
         * Directive link function
         * @param {Object} scope
         * @param {Object} element
         * @param {Array} attrs
         */
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
                //scope.close();
                if (typeof scope.saveFunc !== "undefined") {
                    scope.saveFunc();
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