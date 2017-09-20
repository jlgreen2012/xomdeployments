(function () {
    'use strict';

    angular
        .module('app.assessment')
        .directive('pbMultipleChoiceQuestion', MultipleChoiceQuestion);

    MultipleChoiceQuestion.$inject = ['$log'];

    /**
     * Directive to create and dispaly a multiple choice question with answers.
     * @param {$log} $log
     * @returns {type}
     */
    function MultipleChoiceQuestion($log) {
        var directive = {
            link: link,
            templateUrl: '/app/assessment/wizard/multiple.choice.html',
            restrict: 'A',
            scope: {
                question: '@',
                questionId: '@',
                number: '@',
                answers: '=',
                comment: '=',
                isAnswered: '=',
                selectedAnswer: '='
            }
        };
        return directive;

        /**
         * Link function.
         * @param {Object} scope
         * @param {Array} element
         * @param {Array} attrs
         */
        function link(scope, element, attrs) {
            scope.selectAnswer = function (answer) {
                scope.isAnswered = true;

                // not sure yet why ng-model isn't setting this.
                scope.selectedAnswer = answer.id;
            };
        }
    }
})();