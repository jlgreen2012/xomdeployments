(function () {
    'use strict';

    angular
        .module('app')
        .config(routes)
        .config(disableLogging)
        .config(decorateDebugger);

    routes.$inject = ['$routeProvider'];
    disableLogging.$inject = ['$logProvider', 'configs'];
    decorateDebugger.$inject = ['$provide'];

    /**
     * Route configuration for app module.
     * @param {$routeProvider} $routeProvider
     */
    function routes($routeProvider) {
        // TODO: refactor into states!
        $routeProvider
            .when('/', {
                controller: 'HomeController',
                controllerAs: 'hc',
                templateUrl: 'app/home/home.html'
            })

            // list all assessments.
            .when('/assessments', {
                controller: 'AssessmentController',
                controllerAs: 'ac',
                templateUrl: 'app/assessment/assessment.list.html',
                resolve: {
                    action: function () { return 'LIST_ASSESSMENTS'; }
                }
            })

            // Create and edit a team for the assessment.
            .when('/assessments/:assessmentId/team', {
                controller: 'TeamController',
                controllerAs: 'tc',
                templateUrl: 'app/team/team.details.html'
            })

            // Edit a team for the assessment.
            .when('/assessments/:assessmentId/team/:teamId', {
                controller: 'TeamController',
                controllerAs: 'tc',
                templateUrl: 'app/team/team.details.html'
            })

            // Start/edit a team assessment.
            .when('/assessments/:assessmentId/team/:teamId/edit', {
                controller: 'AssessmentController',
                controllerAs: 'ac',
                templateUrl: 'app/assessment/assessment.edit.html',
                resolve: {
                    action: function () { return 'TAKE_ASSESSMENT'; }
                }
            })

            // Review an assessment for all available team assessments.
            // Could also be used to show a single assessment's details.
            .when('/assessments/:assessmentId', {
                controller: 'AssessmentController',
                controllerAs: 'ac',
                templateUrl: 'app/assessment/assessment.review.html',
                resolve: {
                    action: function () { return 'REVIEW_ASSESSMENT'; }
                }
            })

            // Export a specific team assessment.
            .when('/assessments/:assessmentId/teamAssessments/:teamAssessmentId/export', {
                controller: 'AssessmentController',
                controllerAs: 'ac',
                templateUrl: 'app/assessment/assessment.export.pdf.html',
                resolve: {
                    action: function () { return 'EXPORT_ASSESSMENT'; }
                }
            })

            // Add a shared assessment to the list of review assessments.
            .when('/assessments/:assessmentId/team/:teamId/share', {
                controller: 'AssessmentController',
                controllerAs: 'ac',
                templateUrl: 'app/assessment/assessment.review.html',
                resolve: {
                    action: function () { return 'SHARE_ASSESSMENT'; }
                }
            })

            .when('/assessments/:assessmentId/playbook', {
                controller: 'PlaybookController',
                controllerAs: 'pc',
                templateUrl: 'app/playbook/playbook.new.html',
                resolve: {
                    action: function () { return 'CREATE_PLAYBOOK'; }
                }
            })

            // list all playbooks. This really should just be included on the assessments page.
            .when('/playbooks', {
                controller: 'AssessmentController',
                controllerAs: 'ac',
                templateUrl: 'app/playbook/playbook.list.html',
                resolve: {
                    action: function () { return 'LIST_ASSESSMENTS'; }
                }
            })

            // list all playbooks.
            .when('/assessments/:assessmentId/playbooks', {
                controller: 'PlaybookController',
                controllerAs: 'pc',
                templateUrl: 'app/playbook/playbook.details.html',
                resolve: {
                    action: function () { return 'LIST_PLAYBOOKS'; }
                }
            })

            // Playbook details
            .when('/assessments/:assessmentId/playbooks/:playbookId', {
                controller: 'PlaybookController',
                controllerAs: 'pc',
                templateUrl: 'app/playbook/playbook.details.html',
                resolve: {
                    action: function () { return 'PLAYBOOK_DETAILS'; }
                }
            })

            // Playbook export
            .when('/assessments/:assessmentId/playbooks/:playbookId/export', {
                controller: 'PlaybookController',
                controllerAs: 'pc',
                templateUrl: 'app/playbook/playbook.export.pdf.html',
                resolve: {
                    action: function () { return 'EXPORT_PLAYBOOK'; }
                }
            })

            // Create playbook details for team assessment
            .when('/assessments/:assessmentId/teamAssessments/:teamAssessmentId/playbook', {
                controller: 'PlaybookController',
                controllerAs: 'pc',
                templateUrl: 'app/playbook/playbook.new.html',
                resolve: {
                    action: function () { return 'CREATE_PLAYBOOK'; }
                }
            })

            // Get playbook details for a team assessment
            .when('/assessments/:assessmentId/teams/:teamId/playbooks/:playbookId', {
                controller: 'PlaybookController',
                controllerAs: 'pc',
                templateUrl: 'app/playbook/playbook.details.html',
                resolve: {
                    action: function () { return 'PLAYBOOK_DETAILS'; }
                }
            })

            // Add a playbook to the shared list
            .when('/assessments/:assessmentId/playbooks/:playbookId/share', {
                controller: 'PlaybookController',
                controllerAs: 'pc',
                templateUrl: 'app/playbook/playbook.details.html',
                resolve: {
                    action: function () { return 'SHARE_PLAYBOOK'; }
                }
            })

            .when('/unauthorized', {
                templateUrl: 'app/security/unauthorized.html'
            })
            .otherwise({ redirectTo: '/' });
    };

    /**
    * Applies environment value for enabling of debug.
    * @param {$logProvider} $logProvider
    * @param {Object} configs
    */
    function disableLogging($logProvider, configs) {
        $logProvider.debugEnabled(configs.enableDebug);
    }

    /**
    * Decorates the $log.debug calls to also include
    * date and timestamp information.
    * @param {$provide} $provide
    */
    function decorateDebugger($provide) {
        $provide.decorator('$log', ['$delegate', function ($delegate) {
            var origDebug = $delegate.debug;
            $delegate.debug = function () {
                var args = [].slice.call(arguments);
                args[0] = [new Date().toLocaleString(), ': ', args[0]].join('');

                origDebug.apply(null, args)
            };

            return $delegate;
        }]);
    }
})();