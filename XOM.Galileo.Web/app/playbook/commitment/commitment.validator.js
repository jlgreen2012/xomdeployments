(function () {
    'use strict';

    angular
        .module('app.playbook')
        .directive('dueDateAfterToday', Validator);

    Validator.$inject = ['$log'];

    /**
     * Validates the due date for a commitment is after today.
     * @param {$log} $log
     * @returns {Object}
     */
    function Validator($log) {
        var directive = {
            link: link,
            restrict: 'A',
            require: 'ngModel'
        };
        return directive;

        /**
         * Directive link func.
         * @param {Object} scope
         * @param {Object} element
         * @param {Array} attrs
         * @param {Object} ctrl
         */
        function link(scope, element, attrs, ctrl) {
            // Validate due date is after today.
            ctrl.$validators.dueDateAfterToday = function (modelValue, viewValue) {
                if (viewValue !== null) {
                    return viewValue.dueDate > new Date();
                }
                return true;
            };
        }
    }
})();