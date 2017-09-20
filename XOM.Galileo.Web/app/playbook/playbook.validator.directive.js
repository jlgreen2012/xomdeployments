(function () {
    'use strict';

    angular
        .module('app.playbook')
        .directive('playbookValidator', Validator);

    Validator.$inject = ['$log'];

    /**
     * Validates the team assessment with business rules.
     * @param {$log} $log log provider
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
         * Directive link function.
         * @param {Object} scope
         * @param {Object} element
         * @param {Array} attrs
         * @param {Object} ctrl
         */
        function link(scope, element, attrs, ctrl) {
            /**
             * Validates the team assessment is completed.
             * @param {Object} modelValue
             * @param {Object} viewValue
             * @returns {Boolean} true if completed, which is valid.
             */
            ctrl.$validators.completed = function (modelValue, viewValue) {
                if (viewValue !== null && typeof viewValue !== "undefined") {
                    return viewValue.status === 'COMPLETED';
                }
                return true;
            };

            /**
             * Validates the team assessment does not already have a playbook.
             * @param {Object} modelValue
             * @param {Object} viewValue
             * @returns {Boolean} false if does not exist, which is valid
             */
            ctrl.$validators.noPlaybook = function (modelValue, viewValue) {
                if (viewValue !== null && typeof viewValue !== "undefined") {
                    return viewValue.hasPlaybook === false;
                }
                return true;
            };

             /**
             * Validates the team assessment is the latest, completed team assessment.
             * @param {Object} modelValue
             * @param {Object} viewValue
             * @returns {Boolean} always returns true. Validity is manually set from controller.
             */
            ctrl.$validators.latestAttempt = function (modelValue, viewValue) {
                if (viewValue !== null && typeof viewValue !== "undefined") {
                    return true; // always going to be manually set from the controller.
                }
                return true;
            };
        }
    }
})();