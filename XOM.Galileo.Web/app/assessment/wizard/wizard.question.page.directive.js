(function () {
    'use strict';

    angular
        .module('app.assessment')
        .directive('pbWizardQuestionPage', WizardQuestionPage);

    WizardQuestionPage.$inject = ['$log'];

    /**
     * Directive to handle each individual page of the ward.
     * @param {type} $log
     * @returns {type}
     */
    function WizardQuestionPage($log) {
        var directive = {
            templateUrl: '/app/assessment/wizard/wizard.question.page.html',
            restrict: 'A',
            scope: {
                page: '='
            }
        };
        return directive;
    }
})();