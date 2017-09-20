﻿(function () {
    'use strict';

    angular
        .module('app.assessment')
        .directive('pbWizardStatus', WizardStatus);

    WizardStatus.$inject = ['$log'];

    /**
     * Directive for status/progress visualization within wizard.
     * @param {$log} $log
     * @returns {Object}
     */
    function WizardStatus($log) {
        var directive = {
            link: link,
            templateUrl: '/app/assessment/wizard/wizard.status.html',
            restrict: 'A',
            scope: {
                steps: '=',
                showInvalidStyles: '='
            }
        };
        return directive;

        /**
         * Link function
         * @param {Object} scope
         * @param {Array} element
         * @param {Array} attrs
         */
        function link(scope, element, attrs) {
            // Initalize items.
            scope.stepWidthPercentage = 12;


            // Changes to questions. Mostly used for initial load.
            scope.$watchCollection(
                function () {
                    return [
                        scope.steps
                    ];
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        setSteps();
                    }
                });

            /**
             * Filter steps to question steps only.
             */
            function setSteps() {
                scope.stepsToShow = scope.steps.filter(function (s) {
                    return s.type === 'QUESTION';
                });

                setStepStyles();
            }

            /**
             * Calculate the step percentage based on the total number of steps.
             */
            function setStepStyles() {
                let totalSteps = scope.stepsToShow.length,
                    totalSections = totalSteps + (totalSteps * 0.25),
                    totalWidth = 100;

                scope.stepWidthPercentage = totalWidth / totalSections;                
            }
        }
    }
})();