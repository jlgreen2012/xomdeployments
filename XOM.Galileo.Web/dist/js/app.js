(function () {
    'use strict';

    /*eslint array-element-newline: ["error", "always"]*/

    angular.module('app', [
        // Angular modules
        'ngRoute',
        'ngAnimate',
        'ngMessages',
        'ngResource',
        'ngCookies',
        'ngSanitize',

        // 3rd party modules
        'angular-loading-bar',
        'angular-clipboard',
        'angular-momentjs',

        // Custom modules
		'unityAngular',
        'app.admin',
        'app.assessment',
        'app.team',
        'app.visualizations',
        'app.playbook'
    ]);

    // Group by method.
    Object.defineProperty(Array.prototype, 'group', {
        enumerable: false,
        value: function (key) {
            let map = {};
            this.map(e => ({ k: key(e), d: e })).forEach(e => {
                map[e.k] = map[e.k] || [];
                map[e.k].push(e.d);
            });
            return Object.keys(map).map(k => ({ key: k, data: map[k] }));
        }
    });
})();
(function () {
    'use strict';

    angular.module('app.admin', []);
})();

(function () {
    'use strict';

    angular.module('app.assessment', []);
})();
(function () {
    'use strict';

    angular.module('app.playbook', []);
})();
(function () {
    'use strict';

    angular.module('app.team', ['ui.bootstrap']);
})();
(function () {
    'use strict';

    angular.module('unityAngular', []);
})();
(function () {
    'use strict';

    angular.module('app.visualizations', []);
})();
(function () {
    'use strict';

    angular
        .module('app')
        .config(config);

    config.$inject = ['$locationProvider', '$httpProvider', 'cfpLoadingBarProvider'];

    /**
     * Config settings for module.
     * @param {$locationProvider} $locationProvider
     * @param {$httpProvider} $httpProvider
     * @param {cfpLoadingBarProvider} cfpLoadingBarProvider
     */
    function config($locationProvider, $httpProvider, cfpLoadingBarProvider) {
        // Angular now uses '!' as hashbang.
        // This defaults to empty, but we really should...
        // TODO: implement our hashbang
        // >> https://docs.angularjs.org/guide/migration#commit-aa077e8
        // >> https://github.com/angular/angular.js/commit/aa077e81129c740041438688dff2e8d20c3d7b52
        $locationProvider.hashPrefix('');

        $httpProvider.defaults.withCredentials = true;

        // Reposition the loader
        cfpLoadingBarProvider.parentSelector = 'body > header';
    };
})();
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
(function () {
    'use strict';

    angular
        .module('app')
        .run(run);

    run.$inject = ['$rootScope', '$location', 'authService'];

    /**
     * Run configuratio for app module.
     * @param {$rootScope} $rootScope
     * @param {$location} $location
     * @param {factory} authService
     */
    function run($rootScope, $location, authService) {
        $rootScope.$on('$routeChangeError', function (evt, current, previous, rejection) {
            // This is here to ensure preloading and caching the user
            // before app modules get injected with a service singleton
            // for the first time
            authService.getCurrentUser();

            if (!rejection.authorized) {
                //DO SOMETHING
                $location.url('unauthorized');
            }
        });
    };
})();
(function () {
    'use strict';

    angular
        .module('app.admin')
        .config(routes);

    routes.$inject = ['$routeProvider'];

    /**
     * Route configuration for admin module.
     * @param {$routeProvider} $routeProvider
     */
    function routes($routeProvider) {
        let resolve = {
            resolved: resolveAuth
        };

        $routeProvider
            .when('/admin/users', {
                controller: 'UserController',
                controllerAs: 'userCtrl',
                templateUrl: 'app/admin/users/user.html'
            })
             .when('/users/:username', {
                 controller: 'UserController',
                 controllerAs: 'userCtrl',
                 templateUrl: 'app/users/user.html'
             })
            .when('/admin/users', {
                controller: 'UsersController',
                controllerAs: 'usersCtrl',
                templateUrl: 'app/admin/users/users.html',
                resolve: resolve
            })
            .when('/admin/logs', {
                controller: 'ApplicationLogsController',
                controllerAs: 'logsCtrl',
                templateUrl: 'app/admin/applogs/applogs.html',
                resolve: resolve
            })
            .otherwise({ redirectTo: '/' });

        resolveAuth.$inject = ['$location', 'authService'];

        /**
         * Re-routes to unauthorized page.
         * @param {$location} $location
         * @param {factory} authService
         * @returns {Promise}
         */
        function resolveAuth($location, authService) {
            return authService
                .isAdmin()
                .then(function (isAppAdmin) {
                    if (!isAppAdmin)
                        $location.path('/unauthorized');
                })
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .directive('pbExportHtml', ExportHtml);

    ExportHtml.$inject = ['$log', '$timeout'];

    /**
     * Exports an html element as a pdf file.
     * @returns {Object} directive definition
     */
    function ExportHtml($log, $timeout) {
        var directive = {
            restrict: 'A',
            scope: {
                fileName: '@',
                readyToDownload: '=',
                isLoading: '='
            },
            link: link
        };
        return directive;

        /**
         * Directive link function to be executed on initialization.
         * @param {$scope} scope
         * @param {Object} element
         * @param {Array} attr
         */
        function link(scope, element, attr) {
            /**
             * Watches for changes to the readToDownload indicator. Executes export when ready.
             * @param {Boolean} newValue
             * @param {Boolean} oldValue
             */
            scope.$watch('readyToDownload', function (newValue, oldValue) {
                if (newValue !== oldValue && newValue === true) {
                    $log.debug('ready to download');

                    // add a short delay to allow rendering to finish.
                    $timeout(function () {
                        exportToPdf();
                    }, 1500);
                }
            });

            /**
             * Downloads a pdf file with the content of the element.
             */
            function exportToPdf() {
                scope.isLoading = true;

                $log.debug('benchmark - export to pdf - start');
                html2canvas(element, {
                    onrendered: function (canvas) {
                        $log.debug('benchmark - export to pdf - onrendered');

                        var imgData = canvas.toDataURL('image/png');
                        $log.debug('benchmark - export to pdf - converted canvas');

                        var doc = new jsPDF('p', 'mm');
                        $log.debug('benchmark - export to pdf - created jspdf doc');

                        var imgWidth = doc.internal.pageSize.width; //210;
                        $log.debug('benchmark - export to pdf - imgWidth');

                        var pageHeight = doc.internal.pageSize.height; //295;
                        $log.debug('benchmark - export to pdf - pageHeight');

                        var imgHeight = canvas.height * imgWidth / canvas.width;
                        $log.debug('benchmark - export to pdf - imgHeight');

                        var heightLeft = imgHeight;
                        $log.debug('benchmark - export to pdf - heightLeft');

                        var position = 0;
                        $log.debug('benchmark - export to pdf - position');

                        // addimage(imageData, format, x, y, w, h, alias, compression, rotation)
                        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        $log.debug('benchmark - export to pdf - added first image');

                        heightLeft -= pageHeight;

                        while (heightLeft >= 0) {
                            $log.debug('benchmark - export to pdf - adding page');

                            position = heightLeft - imgHeight;
                            doc.addPage();
                            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                            heightLeft -= pageHeight;
                        }

                        $log.debug('benchmark - export to pdf - saving');
                        doc.save(scope.fileName);

                        scope.isLoading = false;
                        scope.$apply();
                        $log.debug('benchmark - export to pdf - done');
                    }
                });
            }
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('app')
        .directive('headerNav', headerNav);

    headerNav.$inject = ['$document', 'authService', ];

    /**
     * Directive to create the application header and navigation.
     * @param {$document} $document
     * @param {factory} authService
     * @returns {Object}
     */
    function headerNav($document, authService) {
        var directive = {
            link: link,
            templateUrl: 'app/components/header-nav.html',
            replace: true,
            restrict: 'E',
            scope: {
                appTitle: '@'
            }
        };
        return directive;

        //////////////////////////////////

        /**
         * Link function.
         * @param {Object} scope
         * @param {Array} element
         * @param {Array} attrs
         */
        function link(scope, element, attrs) {
            scope.navItems = [];
            scope.menu = false;
            scope.userName = null;
            getCurrentUser();

            scope.select = select;
            scope.showMenu = showMenu;
            checkAdminRights();

            ////////////

            var adminSubItems = [
                { title: 'Error Logs', href: '#/admin/errors' }
            ];

            scope.navItems = [
                { title: 'Assessments', href: '/#/assessments' },
                { title: 'Playbooks', href: '/#/playbooks' },
                { title: 'Admin', subItems: adminSubItems }
            ];

            /**
             * Determines if the current user is an administrator.
             * @returns {Boolean} true if admin
             */
            function checkAdminRights() {
                //checking rights
                return authService
                    .isAdmin()
                    .then(function (isAppAdmin) {
                        //admin rights checked
                        for (var item in scope.navItems) {
                            if (scope.navItems[item].title == 'Admin') {
                                scope.navItems[item].hide = !isAppAdmin;
                            }
                        }
                        return isAppAdmin;
                    }, function (error) {
                        //Admin Authentication Error
                        return false;
                    })
            }

            /**
             * Toggles showing the menu.
             * TODO: separate this into it's own directive
             */
            function showMenu() {
                scope.menu = !scope.menu;
                $document.find('body').toggleClass('em-is-disabled-small', scope.menu);
            }

            /**
             * Actions to take when a menu item is selected.
             * TODO: separate this into it's own directive
             * @param {type} navItem
             */
            function select(navItem) {
                let isActive = !navItem.active;

                angular.forEach(scope.navItems, function (item) {
                    item.active = false;
                });

                navItem.active = isActive;

                // Attach document click to hide select
                if (navItem.active)
                    $document.on('click', clickHandler);

                /**
                 * Event handler when menu item is clicked.
                 * @param {type} event
                 */
                function clickHandler(event) {
                    if (event.target.classList.contains('em-c-primary-nav__link'))
                        return;

                    select({ active: true });
                    scope.$apply();

                    $document.off('click', clickHandler);
                }
            }

            /**
             * Sets the user display name based on the current logged in user.
             */
            function getCurrentUser() {
                authService.getCurrentUser()
                    .then(function (data) {
                        scope.userName = data.FullName;
                    });
            }
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .filter('loading', loading);

    loading.$inject = [];

    /**
     * Filter to display a loading text message.
     * @returns {String}
     */
    function loading() {
        return function (input, watch) {
            if (watch)
                return input;

            return 'Loading...';
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .filter('truncate', Truncate);

    Truncate.$inject = [];

    /**
     * Filter to display text as truncated if it's too long.
     * @returns {String}
     */
    function Truncate() {
        return function (text, length, end) {
            if (isNaN(length))
                length = 10;

            if (typeof end === "undefined")
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            } else {
                return String(text).substring(0, length - end.length) + end;
            }
        };
    }
})();
(function () {
    'use strict';

    angular
        .module('app.assessment')
        .controller('AssessmentController', AssessmentController);

    AssessmentController.$inject = ['assessmentDataService', '$log',
                                    '$routeParams', 'action', '$location', '$q', '$rootScope', '$timeout'];

    /**
     * Controller responsible for all actions related to taking and reviewing an assessment.
     * @param {AssessmentDataService} assessmentDataService
     * @param {$log} $log
     * @param {$routeParams} $routeParams
     * @param {$action} action
     * @param {$location} $location
     * @param {$q} $q
     * @param {$rootScope} $rootScope
     * @param {$timeout} $timeout
     */
    function AssessmentController(assessmentDataService, $log, $routeParams,
                                     action, $location, $q, $rootScope, $timeout) {
        var vm = this,
            routeAssessmentId = null,
            routeTeamId = null,
            routeTeamAssessmentId = null;

        // Available viewing modes.
        vm.modes = {
            review: 0,
            reviewDetails: 1,
            edit: 2,
            download: 3
        };

        // All assessments. Team Assessments are objects within these assessments.
        vm.assessments = [];

        // Current assessment.
        vm.assessment = {
            teamAssessments: []
        };

        // Current TEAM assessment that the user is either taking or reviewing.
        vm.current = {
            details: {},
            radarChartData: {},
            questionResponsesByCategory: [],
            mode: vm.modes.review,
            cancel: function () { $location.path('/assessments'); },
            save: saveAssessment,
            submit: submitAssessment,
            review: function () { $location.path('/assessments/' + this.details.assessmentId); },
        };

        // Indication that we have all of the data that the UI needs to display.
        vm.loading = {
            isAnythingLoading: function () {
                return vm.loading.loaders.gettingData === true ||
                       vm.loading.loaders.processingData === true;
            },
            doneLoading: function () {
                vm.loading.loaders.gettingData = false;
                vm.loading.loaders.processingData = false;
            },
            loaders: {
                gettingData: true,
                processingData: false
            }
        }

        // Error or informative message to display instead of the intended content.
        vm.message = null;

        // Error or information message to display in addition to the intended content.
        vm.info = null;

        // Assessment actions.
        vm.getAssessmentList = getAssessmentList;
        vm.getTeamAssessmentList = getTeamAssessmentList;
        vm.getTeamAssessmentListForAssessment = getTeamAssessmentListForAssessment;
        vm.getTeamAssessmentDetailsById = getTeamAssessmentDetailsById;
        vm.takeAssessment = takeAssessment;
        vm.reviewTeamAssessment = reviewTeamAssessment;
        vm.addSharedAssessment = addSharedAssessment;
        vm.getShareAssessmentLink = getShareAssessmentLink;
        vm.activate = activate;

        activate();

        /**
         * Actions to take upon page load.
         */
        function activate() {
            //vm.loaded = false;
            vm.loading.loaders.gettingData = true;

            // Get route params.
            routeAssessmentId = +$routeParams.assessmentId;
            routeTeamId = +$routeParams.teamId;
            routeTeamAssessmentId = +$routeParams.teamAssessmentId;

            // always get all assessments and their team assessment info. Top level only.
            vm.getAssessmentList()
                .then(function () {
                    if (!isNaN(routeAssessmentId)) {
                        vm.getTeamAssessmentListForAssessment(routeAssessmentId)
                            .then(function () {
                                // Set the current assessment based on route params.
                                selectCurrentAssessmentById(routeAssessmentId);

                                switch (action) {
                                    case 'TAKE_ASSESSMENT':
                                        // Start the assessment.
                                        setCurrentMode(vm.modes.edit);
                                        vm.takeAssessment();
                                        break;

                                    case 'REVIEW_ASSESSMENT':
                                        // Get the team assessment details.
                                        setCurrentMode(vm.modes.review);
                                        var toReview = getDefaultTeamAssessmentForCurrentAssessment();
                                        vm.reviewTeamAssessment(toReview)
                                            .catch(function (error) {
                                                vm.message = 'Unable to review assessment.';
                                            })
                                            .finally(function () {
                                                //vm.loaded = true;
                                                vm.loading.doneLoading();
                                            });
                                        break;

                                    case 'SHARE_ASSESSMENT':
                                        // Add the assessment to the shared list.
                                        vm.addSharedAssessment(routeAssessmentId, routeTeamId);
                                        break;

                                    case 'EXPORT_ASSESSMENT':
                                        // Get the review data and indicate that it's loaded and read to download.
                                        var toReview =
                                            assessmentDataService.getTeamAssessmentByIdFromGroupedList(
                                                vm.assessment.teamAssessments,
                                                routeTeamAssessmentId);
                                        vm.reviewTeamAssessment(toReview)
                                            .catch(function (error) {
                                                vm.message = 'Unable to export assessment.';
                                            })
                                            .finally(function () {
                                                setCurrentMode(vm.modes.download);
                                                //vm.loaded = true;
                                                vm.loading.doneLoading();
                                            });
                                        break;

                                    default:
                                        // Indicate we've loaded all that we've been told to.
                                        //vm.loaded = true;
                                        vm.loading.doneLoading();
                                        break;
                                }
                            });
                    }
                    else {
                        vm.loading.doneLoading();
                    }
                });
        }

        /**
         * Sets the current viewing mode.
         * @param {Int} mode - from vm.modes enum
         */
        function setCurrentMode(mode) {
            vm.current.mode = mode;
        }

        /**
         * Sets the current assessment based on the provided id.
         * @param {Int} assessmentId
         */
        function selectCurrentAssessmentById(assessmentId) {
            vm.assessment = vm.assessments.find(function (a) {
                return a.id === assessmentId;
            });
        }

        /**
         * Gets the default team assessment for the current assessment.
         * @returns {Object} team assessment details. Returns undefined if not found.
         */
        function getDefaultTeamAssessmentForCurrentAssessment() {
            var teamAssessment;
            if (vm.assessment.teamAssessments.length > 0) {
                teamAssessment = vm.assessment.teamAssessments[0].latest;
            }
            return teamAssessment;
        }

        /**
         * Gets all available assessments.
         * Does not include any team assessments.
         * @returns {Promise}
         */
        function getAssessmentList() {
            var deferred = $q.defer();
            assessmentDataService.getAssessments()
                .then(function (data) {
                    vm.assessments = data;
                    deferred.resolve(vm.assessments);
                });

            // Return a promise so that we can chain these together as needed.
            return deferred.promise;
        }

        /**
         * Gets all team assessments for all assessments.
         * @returns {Promise}
         */
        function getTeamAssessmentList() {
            var deferred = $q.defer(),
                detailsPromises = [];

            // Get all team assessments for each assessment.
            detailsPromises = vm.assessments.map(function (assessment, index) {
                // add a new promise to our list.
                // this promise includes adding the team assessments to our array.
                return assessmentDataService.getTeamAssessments(assessment.id)
                        .then(function (data) {
                            vm.assessments[index].teamAssessments = data;
                            return $q.resolve();
                        });
            });

            // send all of our promises at the same time to get all of our details for all assessments.
            $q.all(detailsPromises)
                .then(function (data) {
                    deferred.resolve();
                });

            // Return a promise so that we can chain these together as needed.
            return deferred.promise;
        }

        /**
         * Gets all team assessments for the given assessment.
         * @param {Number} assessmentId
         * @returns {Promise}
         */
        function getTeamAssessmentListForAssessment(assessmentId) {
            var deferred = $q.defer();
            assessmentDataService.getTeamAssessments(assessmentId)
                .then(function (data) {
                    vm.assessments.forEach(function (a) {
                        a.teamAssessments = [];

                        // Match up to the desired assessment.
                        if (a.id === assessmentId) {
                            let teamGroup = data.group(teamAssessment => teamAssessment.teamName),
                                teamAssessments = [],
                                teamAssessmentObj = null;
                            // Get the latest team assessment for each team and add it to the list.
                            angular.forEach(teamGroup, function (groupedData) {
                                teamAssessments = groupedData.data;
                                teamAssessmentObj = assessmentDataService.getMostRecentAttemptForTeam(teamAssessments);
                                a.teamAssessments.push(teamAssessmentObj);
                            });
                        }
                    });
                    deferred.resolve();
                });
            // Return a promise so that we can chain these together as needed.
            return deferred.promise;
        }

        /**
         * Get the Team Assessment object detailed responses.
         * @param {Int} assessmentId
         * @param {Int} teamAssessmentId
         * @returns {Promise} returns empty promise when completed
         */
        function getTeamAssessmentDetailsById(assessmentId, teamAssessmentId) {
            var deferred = $q.defer();

            assessmentDataService.getTeamAssessmentDetailsById(assessmentId, teamAssessmentId)
                .then(function (data) {
                    if (typeof data !== "undefined") {
                        vm.current.details = data;
                    }
                    else {
                        vm.message = "Unable to retrieve team assessment details. Please try again.";
                    }
                    deferred.resolve();
                });

            // Return a promise so that we can chain these together as needed.
            return deferred.promise;
        }

        /**
         * Starts the assessment and loads the questions.
         */
        function takeAssessment() {
            //vm.loaded = false;
            vm.loading.loaders.gettingData = true;

            if (routeAssessmentId > 0 && routeTeamId > 0) {
                $log.debug("Starting assessment for id: " +
                    routeAssessmentId +
                    " and team id: " +
                    routeTeamId);

                // Create team assessment object.
                assessmentDataService.startAssessment(routeAssessmentId, routeTeamId)
                    .then(function (data) {
                        vm.current.details = data;
                    })
                    .catch(function (error) {
                        if (typeof error !== "undefined" && error !== null && error !== "") {
                            vm.message = error.toString();
                        }
                        else {
                            vm.message = "An unknown error occurred while trying to start this assessment. Please try again.";
                        }
                    })
                    .finally(function () {
                        vm.loading.doneLoading();
                    });
            }
        }

        /**
         * Gets the team assessment details to review.
         * Builds the radar chart data for the current assessment.
         * @param {Object} assessment - team assessment object
         */
        function reviewTeamAssessment(assessment) {
            var deferred = $q.defer();
            if (typeof assessment === "undefined") {
                deferred.reject("Assessment is undefined");
            }
            else if (typeof vm.current.details !== "undefined" && vm.current.details.id === assessment.id) {
                deferred.resolve();
            }
            else {
                vm.current.mode = vm.modes.review;
                vm.current.details = assessment;
                vm.current.radarChartData = null;
                vm.isTeamAssessmentDetailLoading = true;

                // Get other attempt info.
                vm.current.attempts = getTeamAssessmentAttempts(vm.assessment.teamAssessments,
                                                                vm.current.details.assessmentId,
                                                                vm.current.details.teamId);

                // Get the assessment details, like questions and answers.
                vm.getTeamAssessmentDetailsById(vm.current.details.assessmentId, vm.current.details.id)
                    .then(function () {
                        // Setup the radar chart data.
                        vm.current.radarChartData = {
                            data: [],
                            legend: []
                        };
                        if (typeof vm.current.details !== "undefined" && vm.current.details !== null &&
                            vm.current.details.categoryResults !== null && typeof vm.current.details.categoryResults !== "undefined" && vm.current.details.categoryResults.length > 0) {
                            buildRadarChartDataForCurrentTeamAssessment();
                        }

                        // Indicate to UI that we have the data we need.
                        vm.isTeamAssessmentDetailLoading = false;
                        deferred.resolve();
                    });
            }

            return deferred.promise;
        }

        /**
         * Adds the grouped question and radar data to the current team assessment.
         */
        function buildRadarChartDataForCurrentTeamAssessment() {
            // Setup the grouped question responses by category.
            vm.current.questionResponsesByCategory = getQuestionReviewDataForCategories();

            // Setup the data in the structure thee radar chart wants.
            // Handle the case where all questions within a category were answered with NA.
            vm.current.radarChartData.data.push(
                vm.current.details.categoryResults.map(function (category) {
                    return {
                        axis: isNaN(parseFloat(category.score)) ? category.name + ' (NA)' : category.name,
                        value: isNaN(parseFloat(category.score)) ? 0 : category.score
                    }
                }
            ));

            // Create our spike labels and their click functions.
            vm.current.radarChartData.legend =
                vm.current.details.categoryResults.map(function (category) {
                    return {
                        name: category.name,
                        click: function () {
                            if (vm.current.mode === vm.modes.review) {
                                vm.current.mode = vm.modes.reviewDetails;

                                // Filter down to just this category.
                                vm.current.radarChartData.reviewQuestionData = vm.current.questionResponsesByCategory.filter(function (categoryGroup) {
                                    return categoryGroup.categoryName === category.name;
                                });

                                // Update scope manually since we're manipulating it from within this external click function.
                                $rootScope.$apply();
                            }
                        }
                    };
                });
        }

        /**
         * Builds the grouped question response list by category name.
         * @returns {Array} Each object includes
         * category name, questions, and score.
         */
        function getQuestionReviewDataForCategories() {
            let groupdQuestionsByCategory = vm.current.details.questions
                .group(q => q.categoryName)

                .map(function (g) {
                    return {
                        categoryName: g.key,
                        questions: g.data,
                        score: vm.current.details.categoryResults.find(function (c) {
                            return c.name === g.key;
                        }).score
                    }
                });
            return groupdQuestionsByCategory;
        }

        /**
         * Gets the list of team assessment attempts.
         * @param {Array} teamAssessments all team assessments with its list and latest items.
         * @param {Int} assessmentId id of the assessment to filter on
         * @param {Int} teamId id of the team to filter on
         * @returns {Object} team assessment object with list and latest attempts.
         */
        function getTeamAssessmentAttempts(teamAssessments, assessmentId, teamId) {
            let attempts = {},
                teamAssessment = null;
            teamAssessment = teamAssessments.find(function (teamAssessment) {
                var listItem = teamAssessment.latest;
                return listItem.assessmentId === assessmentId && listItem.teamId === teamId;
            });
            if (typeof teamAssessment !== "undefined") {
                attempts = teamAssessment;
            }

            return attempts;
        }

        /**
         * Saves the current assessment but does not submit it.
         * @returns {Promise}
         */
        function saveAssessment() {
            vm.loading.loaders.processingData = true;

            return assessmentDataService
                .saveAssessment(routeAssessmentId, routeTeamId, vm.current.details)
                    .then(function (data) {
                        $log.debug("Assessment saved! Redirecting...");
                        vm.current.review();
                    })
                   .catch(function (error) {
                       // return error to wizard.
                       return $q.reject(error);
                   })
                    .finally(function () {
                        vm.loading.loaders.processingData = false;
                    });
        }

        /**
         * Submits the current assessment
         * @returns {Promise}
         */
        function submitAssessment() {
            vm.loading.loaders.processingData = true;

            return assessmentDataService
                .submitAssessment(routeAssessmentId, routeTeamId, vm.current.details)
                    .then(function (data) {
                        $log.debug("Assessment submitted!");
                    })
                    .catch(function (error) {
                        return $q.reject(error);
                    })
                    .finally(function () {
                        vm.loading.loaders.processingData = false;
                    });
        }

        /**
         * Adds the assessment to the current user's shared assessment list.
         * @param {Number} assessmentId
         * @param {Number} teamId
         */
        function addSharedAssessment(assessmentId, teamId) {
            // Create link to assessment.
            assessmentDataService.addSharedTeamAssessment(assessmentId, teamId)
                .then(function (data) {
                    // If it's not already there, add the assessment to the team assessment list.
                    // Could go to the server again to get the full list, but trying to save a trip.
                    let teamAssessmentObj = vm.assessment.teamAssessments.find(function (t) {
                        return t.latest.teamId === teamId;
                    }),
                    exists = teamAssessmentObj.list.findIndex(function (t) { return t.id === data.id; }) >= 0;

                    if (exists === false) {
                        vm.getTeamAssessmentListForAssessment(vm.assessment.id)
                        .then(function () {
                            // Show our shared message for a moment if this is a new addition to our list.
                            vm.info = 'The assessment for ' + data.teamName + ' has been successfully added to your shared assessment list.';
                            $timeout(function () {
                                vm.info = null;
                            }, 5 * 1000);
                        });
                    }

                    // Review that assessment.
                    vm.current.mode = vm.modes.review;

                    // Load the review data for the shared assessment.
                    vm.reviewTeamAssessment(data);
                })
                .catch(function (error) {
                    // If failed, show an error message instead of and review details.
                    if (error !== null && typeof error !== "undefined") {
                        vm.message = 'An error occurred while trying to add the shared assessment: ' + error;
                    }
                    else {
                        vm.message = 'An error occurred while trying to add the shared assessment. Please try again.';
                    }
                })
                .finally(function () {
                    vm.loading.doneLoading();
                });
        }

        /**
         * Gets the link used to share the currently reviewed assessment.
         * @returns {String} full url for a user to click to add the assessment to their shared assessment list.
         */
        function getShareAssessmentLink() {
            if (!angular.equals(vm.current.details, {})) {
                var assessmentId = vm.current.details.assessmentId,
                    teamId = vm.current.details.teamId;
                return assessmentDataService.getTeamAssessmentShareLink(assessmentId, teamId);
            }
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app.assessment')
        .factory('assessmentDataService', DataService);

    DataService.$inject = ['$http', '$log', '$q', 'configs', '$window', '$location'];

    /**
     * Service used to get data from the server for Assessments.
     * @param {$http} $http
     * @param {$log} $log
     * @param {$q} $q
     * @param {Object} configs
     * @param {$window} $window
     * @param {$locatoin} $location
     * @returns {Object} available methods
     */
    function DataService($http, $log, $q, configs, $window, $location) {
        var service = {
            getAssessments: getAssessments,
            startAssessment: startAssessment,
            saveAssessment: saveAssessment,
            submitAssessment: submitAssessment,
            getTeamAssessmentDetailsById: getTeamAssessmentDetailsById,
            getTeamAssessments: getTeamAssessments,
            getTeamAssessmentsForAssessments: getTeamAssessmentsForAssessments,
            getTeamAssessmentShareLink: getTeamAssessmentShareLink,
            addSharedTeamAssessment: addSharedTeamAssessment,
            getMostRecentAttemptForTeam: getMostRecentAttemptForTeam,
            getTeamAssessmentByIdFromGroupedList: getTeamAssessmentByIdFromGroupedList
        };

        return service;

        /**
         * Gets a list of assessments to take.
         * @returns {Promise} List of assessments on success. Does not reject on failure.
         */
        function getAssessments() {
            var request = {
                method: 'GET',
                url: configs.apiUrl + 'assessments'
            };

            return $http(request)
                .then(getAssessmentsComplete)
                .catch(getAssessmentsFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Array}
             */
            function getAssessmentsComplete(response) {
                return response.data;
            }

            /**
             * Failure callback
             * @param {Object} error
             */
            function getAssessmentsFailed(error) {
                var message = "";
                if ("undefined" !== typeof error.data) {
                    message = error.data.Message;
                }
                $log.error('XHR failed for getAssessments. ' + message);
            }
        }

        /**
         * Gets all team assessments for the provided assessment that the current user has permission to view.
         * @param {Number} assessmentId
         * @returns {Array} array of Team Assessments
         */
        function getTeamAssessments(assessmentId) {
            var request = {
                method: 'GET',
                url: configs.apiUrl + 'assessments/' + assessmentId + '/teamAssessments'
            };

            return $http(request)
                .then(getTeamAssessmentsComplete)
                .catch(getTeamAssessmentsFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Array}
             */
            function getTeamAssessmentsComplete(response) {
                return response.data;
            }

            /**
             * Failure Callback
             * @param {Object} error
             * @returns {Array} empty array
             */
            function getTeamAssessmentsFailed(error) {
                var message = "";
                if ("undefined" !== typeof error.data) {
                    message = error.data.Message;
                }
                $log.error('XHR failed for getTeamAssessments. ' + message);
                return [];
            }
        }

        /**
        * Gets the details for a single team assessment.
        * Includes full details, including questions, answers, grades, categories, etc.
        * @param {Number} assessmentId
        * @param {Number} teamAssessmentId
        * @returns {Object} Team assessment object
        */
        function getTeamAssessmentDetailsById(assessmentId, teamAssessmentId) {
            var request = {
                method: 'GET',
                url: configs.apiUrl + 'assessments/' + assessmentId + '/teamassessments/' + teamAssessmentId
            };

            return $http(request)
                .then(getTeamAssessmentDetailsByIdComplete)
                .catch(getTeamAssessmentDetailsByIdFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Object}
             */
            function getTeamAssessmentDetailsByIdComplete(response) {
                return response.data;
            }

            /**
             * Failure Callback
             * @param {Object} error
             */
            function getTeamAssessmentDetailsByIdFailed(error) {
                var message = "";
                if ("undefined" !== typeof error.data) {
                    message = error.data.Message;
                }
                $log.error('XHR failed for getTeamAssessmentDetailsById. ' + message);
            }
        }

        /**
         * Gets all team assessment for each assessment provided. Gets all team assessments asynchronously.
         * @param {Array} assessments
         * @returns {Array} assessment list with child team assessments.
         */
        function getTeamAssessmentsForAssessments(assessments) {
            var deferred = $q.defer(),
                detailsPromises = [];

            // Get all team assessments for each assessment.
            detailsPromises = assessments.map(function (assessment, index) {
                // add a new promise to our list.
                // this promise includes adding the team assessments to our array.
                return getTeamAssessments(assessment.id)
                        .then(function (data) {
                            assessments[index].teamAssessments = data;
                            return $q.resolve(assessments[index]);
                        });
            });

            // send all of our promises at the same time to get all of our details for all assessments.
            $q.all(detailsPromises)
                .then(function (data) {
                    // will return the list of assessments.
                    deferred.resolve(data);
                });

            // Return a promise so that we can chain these together as needed.
            return deferred.promise;
        }

        /**
        * Starts a new team assessment.
        * @param {Numnber} assessmentId
        * @param {Numnber} teamId
        * @returns {Promise} Returns a DTO or rejects with validation errors.
        */
        function startAssessment(assessmentId, teamId) {
            var request = {
                method: 'POST',
                url: configs.apiUrl + 'teams/' + teamId + '/assessments/' + assessmentId + '/start'
            };

            return $http(request)
                    .then(startTeamAssessmentComplete)
                    .catch(startTeamAssessmentFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Object}
             */
            function startTeamAssessmentComplete(response) {
                return response.data;
            }

            /**
             * Failure Callback
             * @param {Object} error
             * @returns {String}  rejects promise with an error message
             */
            function startTeamAssessmentFailed(error) {
                var message = "";
                if ("undefined" !== typeof error.data) {
                    if (error.data !== null && "undefined" !== typeof error.data.Message) {
                        message = error.data.Message;
                    }
                    else {
                        message = error.data;
                    }
                }
                $log.error('XHR failed for startTeamAssessment. ' + message);
                return $q.reject(message);
            }
        }

        /**
        * Saves an assessment's progress.
        * @param {Numnber} assessmentId
        * @param {Numnber} teamId
        * @param {Object} teamAssessment TeamAssessmentDTO
        * @returns {Promise} Returns updated DTO or rejects with validation errors.
        */
        function saveAssessment(assessmentId, teamId, teamAssessment) {
            var request = {
                method: 'POST',
                url: configs.apiUrl + 'teams/' + teamId + '/assessments/' + assessmentId + '/save',
                data: teamAssessment
            };

            return $http(request)
                    .then(saveTeamAssessmentComplete)
                    .catch(saveTeamAssessmentFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Object}
             */
            function saveTeamAssessmentComplete(response) {
                return response.data;
            }

            /**
             * Failure Callback
             * @param {Object} error
             * @returns {String}  rejects promise with an error message
             */
            function saveTeamAssessmentFailed(error) {
                var message = "";
                if ("undefined" !== typeof error.data) {
                    if (error.data !== null && "undefined" !== typeof error.data.Message) {
                        message = error.data.Message;
                    }
                    else {
                        message = error.data;
                    }
                }
                $log.error('XHR failed for saveTeamAssessment. ' + message);
                return $q.reject(message);
            }
        }

        /**
         * Saves, validates and submits an assessment.
         * @param {Numnber} assessmentId
         * @param {Numnber} teamId
         * @param {Object} teamAssessment TeamAssessmentDTO
         * @returns {Promise} Returns updated DTO or rejects with validation errors.
         */
        function submitAssessment(assessmentId, teamId, teamAssessment) {
            var request = {
                method: 'POST',
                url: configs.apiUrl + 'teams/' + teamId + '/assessments/' + assessmentId + '/submit',
                data: teamAssessment
            };

            return $http(request)
                    .then(submitTeamAssessmentComplete)
                    .catch(submitTeamAssessmentFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Object}
             */
            function submitTeamAssessmentComplete(response) {
                return response.data;
            }

            /**
             * Failure Callback
             * @param {Object} error
             * @returns {String}  rejects promise with an error message
             */
            function submitTeamAssessmentFailed(error) {
                var message = "";
                if ("undefined" !== typeof error.data) {
                    if (error.data !== null && "undefined" !== typeof error.data.Message) {
                        message = error.data.Message;
                    }
                    else {
                        message = error.data;
                    }
                }
                $log.error('XHR failed for submitTeamAssessment. ' + message);
                return $q.reject(message);
            }
        }

        /**
         * Builds the link used to share a team assessment with another user.
         * @param {Number} assessmentId
         * @param {Number} teamId
         * @returns {String} url string
         */
        function getTeamAssessmentShareLink(assessmentId, teamId) {
            var baseUrl = new $window.URL($location.absUrl()).origin;
            return baseUrl + '/#/assessments/' + assessmentId + '/team/' + teamId + '/share';
        }

        /**
         * Creates a link between a team assessment and the current user so the user can view the assessment results.
         * @param {Number} assessmentId
         * @param {Number} teamId
         * @returns {Promise} Returns team assessment on success, but the promise is rejected with an error on failure.
         */
        function addSharedTeamAssessment(assessmentId, teamId) {
            var request = {
                method: 'POST',
                url: configs.apiUrl + 'teams/' + teamId + '/assessments/' + assessmentId + '/share'
            };

            return $http(request)
                    .then(addSharedTeamAssessmentComplete)
                    .catch(addSharedTeamAssessmentFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Object}
             */
            function addSharedTeamAssessmentComplete(response) {
                return response.data;
            }

            /**
             * Failure Callback
             * @param {Object} error
             * @returns {String} rejects promise with an error message
             */
            function addSharedTeamAssessmentFailed(error) {
                var message = "";
                if ("undefined" !== typeof error.data) {
                    if (error.data !== null && "undefined" !== typeof error.data.Message) {
                        message = error.data.Message;
                    }
                    else {
                        message = error.data;
                    }
                }
                $log.error('XHR failed for addSharedTeamAssessment. ' + message);
                return $q.reject(message);
            }
        }

        /**
         * Creates the team assessment object containing the most recent team assessment
         * AND the list of all team assessments for a particular team.
         * @param {Array} groupedTeamAssessments - flat list of team assessments for a given team
         * @returns {Object} in the form of { latest: {}, list: [] }
         */
        function getMostRecentAttemptForTeam(groupedTeamAssessments) {
            let mostRecentTeamAssessment = null,
                teamAssessmentObj = null;

            if (groupedTeamAssessments.length > 1) {
                // Get the latest completed OR started team assessment.
                mostRecentTeamAssessment = groupedTeamAssessments.reduce(function (prev, current) {
                    var prevDate, currentDate;
                    prevDate = prev.completed !== null ? prev.completed : prev.started;
                    currentDate = current.completed !== null ? current.completed : current.started;
                    return prevDate > currentDate ? prev : current;
                });

                // Add to the list of team assessments.
                teamAssessmentObj = {
                    latest: mostRecentTeamAssessment,
                    list: groupedTeamAssessments
                };
            }
            else {
                // if there's only one attempt, make that the most recent.
                teamAssessmentObj = {
                    latest: groupedTeamAssessments[0],
                    list: groupedTeamAssessments
                };
            }
            return teamAssessmentObj;
        }

        /**
         * Gets the team assessment matching the provided id on the current assessment.
         * @param {Array} teamAssessmentGroupedList - structure [ { list: [], latest: {} ]
         * @param {Int} teamAssessmentId
         * @returns {Object} the team assessment details. Returns undefined if not found.
         */
        function getTeamAssessmentByIdFromGroupedList(teamAssessmentGroupedList, teamAssessmentId) {
            var teamAssessment;
            if (teamAssessmentGroupedList.length > 0) {
                teamAssessment = teamAssessmentGroupedList
                            .map(function (t) {
                                return t.list;
                            })
                            .reduce(function (flat, toFlatten) {
                                return flat.concat(toFlatten);
                            }, [])
                            .find(function (t) {
                                return t.id === teamAssessmentId;
                            });
            }
            return teamAssessment;
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = [];

    /**
     * Controller responsible for all home page interactions.
     */
    function HomeController() {
        var vm = this;

        // Supporting links.
        vm.links = [];

        activate();

        /////////////////////

        /**
         * Initializes controller.
         */
        function activate() {
            vm.links = [];
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app.playbook')
        .controller('PlaybookController', PlaybookController);

    PlaybookController.$inject = ['playbookDataService', 'assessmentDataService', '$log',
                                    '$routeParams', 'action', '$location', '$timeout', '$q', '$rootScope',
                                    'userService', 'authService'];

    /**
     * Controller responsible for all actions related to taking and reviewing an assessment.
     * @param {playbookDataService} playbookDataService
     * @param {assessmentDataService} assessmentDataService
     * @param {$log} $log
     * @param {$routeParams} $routeParams
     * @param {$action} action
     * @param {$location} $location
     * @param {$timeout} $timeout
     * @param {$q} $q
     * @param {$rootScope} $rootScope
     * @param {Object} userService
     * @param {Object} authService
     */
    function PlaybookController(playbookDataService, assessmentDataService, $log, $routeParams,
                                     action, $location, $timeout, $q, $rootScope, userService, authService) {
        var vm = this;

        // Available viewing modes.
        vm.modes = {
            review: 0,
            edit: 1,
            download: 2
        };

        // All playbooks.
        vm.playbooks = [];

        // Current playbook with details.
        vm.current = {
            details: {},
            suggestions: [],
            versions: [],
            mode: vm.modes.edit
        };

        // Available team assessments to create a playbook for.
        //vm.teamAssessments = [];
        // Assessment all of the playbooks are related to.
        vm.assessment = null;

        // New playbook form.
        vm.newPlaybookForm = {
            // Form object with validation.
            form: {},

            // List of unique teams to select from.
            teams: [],

            // Upon team selection, determine if we should show the versions dropdown or select the default team assessment.
            // Show the version dropdown if the most recent attempt is in progress.
            selectTeam: function (team) {
                vm.newPlaybookForm.showVersionSelector = team.selectedTeamAssessmentAttempt.completed === null &&
                    team.allTeamAssessmentAttempts.length > 1;

                vm.current.details.teamAssessment = team.selectedTeamAssessmentAttempt;
            },

            // Upon team assessment selection, validate that the version selected is the most recent completed attempt
            // and set the team assessment.
            selectTeamAssessment: function (ta) {
                var hasAMoreRecentAttempt = vm.newPlaybookForm.selected.allTeamAssessmentAttempts.filter(function (x) {
                    return x.completed !== null
                }).find(function (x) {
                    return x.completed > ta.completed;
                });

                if (typeof hasAMoreRecentAttempt !== "undefined") {
                    vm.newPlaybookForm.form.teamAssessment.$setValidity('latestAttempt', false);
                }
            },

            // Indicator if we should show the version dropdown.
            showVersionSelector: false,

            // Selected team item.
            selected: null,

            // Checks if a team is selected.
            hasSelectedTeam: function () {
                return vm.newPlaybookForm.selected !== null && typeof vm.newPlaybookForm.selected !== "undefined";
            },

            // Cancel action on form.
            cancel: function () {
                $location.path('/assessments/' + $routeParams.assessmentId + '/playbooks');
            }
        };
        vm.ownerForm = {
            form: {},
            onSave: updatePlaybookOwner,
            cancel: null,
            users: []
        };

        // Indication that we have all of the data that the UI needs to display.
        vm.loaded = false;

        // Error or informative message to display instead of the intended content.
        vm.message = null;

        // Error or information message to display in addition to the intended content.
        vm.info = null;

        // Playbook actions.
        vm.getPlaybookList = getPlaybookList;
        vm.getPlaybook = getPlaybook;
        vm.createPlaybook = createPlaybook;
        vm.navigateToPlaybookDetails = navigateToPlaybookDetails;
        vm.getSharePlaybookLink = getSharePlaybookLink;
        vm.addSharedPlaybook = addSharedPlaybook;
        vm.activate = activate;

        activate();

        /**
         * Actions to take upon page load.
         */
        function activate() {
            vm.loaded = false;
            vm.assessment = {
                id: +$routeParams.assessmentId
            };

            // Get the appropriate data based on our desired action.
            switch (action) {
                // Get all playbooks and then load the details for a default playbook.
                case 'LIST_PLAYBOOKS':
                    // Get the list.
                    getPlaybookList(vm.assessment.id)
                        .then(function () {
                            // Then get the details for the first playbook.
                            if (vm.playbooks.length > 0) {
                                var defaultPlaybook = vm.playbooks[0].latest;
                                getPlaybook(defaultPlaybook.id)
                                    .then(function () {
                                        setAssessmentName(vm.current.details.teamAssessment);
                                        vm.loaded = true;
                                    });
                            }
                            else {
                                vm.loaded = true;
                            }
                        });
                    break;

                    // Get the details for a specific playbook.
                case 'PLAYBOOK_DETAILS':
                    // Get the list.
                    getPlaybookList(vm.assessment.id);

                    // Get the details for the specified playbook.
                    getPlaybook(+$routeParams.playbookId)
                        .then(function () {
                            setAssessmentName(vm.current.details.teamAssessment);
                            vm.loaded = true;
                        });
                    break;

                    // Create a new playbook and then load the details.
                case 'CREATE_PLAYBOOK':
                    getLatestTeamAssessmentListByTeam(vm.assessment.id)
                        .then(function (list) {
                            // build team list with team assessments
                            vm.newPlaybookForm.teams = list.map(function (l) {
                                return {
                                    id: l.latest.teamId,
                                    name: l.latest.teamName,
                                    selectedTeamAssessmentAttempt: l.latest,
                                    allTeamAssessmentAttempts: l.list
                                };
                            });

                            // If route params are provided for a teamassessment, pre-select the fields.
                            if (+$routeParams.assessmentId > 0 && +$routeParams.teamAssessmentId > 0) {
                                let team, teamAssessment = null;
                                teamAssessment = assessmentDataService.getTeamAssessmentByIdFromGroupedList(
                                                        list, +$routeParams.teamAssessmentId);

                                if (teamAssessment !== null && typeof teamAssessment !== "undefined") {
                                    team = vm.newPlaybookForm.teams.find(function (x) {
                                        return x.id === teamAssessment.teamId;
                                    });
                                    vm.newPlaybookForm.selected = team;
                                    vm.newPlaybookForm.selectTeam(team);
                                    vm.newPlaybookForm.selectTeamAssessment(teamAssessment);
                                }
                            }

                            vm.loaded = true;
                        });
                    break;

                case 'SHARE_PLAYBOOK':
                    // Populate fields for the create form.
                    getPlaybookList(vm.assessment.id)
                        .then(function () {
                            // Add the playbook to the shared list.
                            vm.addSharedPlaybook(+$routeParams.playbookId);
                        });
                    break;

                case 'EXPORT_PLAYBOOK':
                    // Get the list.
                    getPlaybookList(vm.assessment.id);

                    // Get the details for the specified playbook.
                    getPlaybook(+$routeParams.playbookId)
                        .then(function () {
                            setAssessmentName(vm.current.details.teamAssessment);

                            // Hide irrelevant info from the pages.
                            vm.current.mode = vm.modes.download;

                            // Download the pdf. Add a delay to ensure bindings are all complete.
                            $timeout(function () {
                                // Indicate the page is loaded and ready to download.
                                vm.loaded = true;
                            }, 1250);
                        });

                    break;

                default:
                    getPlaybookList();
                    vm.loaded = true;
                    break;
            }
        }

        /**
         * Sets the assessment name. Used due to source of name being different
         * depending on the
         * @param {object} teamAssessment
         */
        function setAssessmentName(teamAssessment) {
            if (typeof teamAssessment !== "undefined" && teamAssessment !== null) {
                vm.assessment.name = teamAssessment.assessmentName;
            }
        }

        /**
         * Gets all available playbooks for an assessment.
         * Does not include any team assessments.
         * @param {Int} assessmentId
         * @returns {Promise} with list of playbook objects, containing latest and list items.
         */
        function getPlaybookList(assessmentId) {
            var deferred = $q.defer();
            playbookDataService.getPlaybooksForAssessment(assessmentId)
                .then(function (data) {
                    let teamGroup = data.group(playbook => playbook.teamName),
                        playbooks = [],
                        playbookObj = null,
                        mostRecentPlaybook = null;

                    // Get the latest team assessment for each team and add it to the list.
                    angular.forEach(teamGroup, function (groupedData) {
                        playbooks = groupedData.data;
                        if (playbooks.length > 1) {
                            // Get the latest created playbook.
                            mostRecentPlaybook = playbooks.reduce(function (prev, current) {
                                var prevDate, currentDate;
                                prevDate = prev.created;
                                currentDate = current.created;
                                return prevDate > currentDate ? prev : current;
                            });

                            // Add to the list of team assessments.
                            playbookObj = {
                                latest: mostRecentPlaybook,
                                list: playbooks
                            };
                            vm.playbooks.push(playbookObj);
                        }
                        else {
                            // if there's only one attempt, make that the most recent.
                            playbookObj = {
                                latest: playbooks[0],
                                list: playbooks
                            };
                            vm.playbooks.push(playbookObj);
                        }
                    });

                    deferred.resolve(vm.playbooks);
                });

            // Return a promise so that we can chain these together as needed.
            return deferred.promise;
        }

        /**
         * Gets the details for the playbook based on the provided id.
         * @param {Number} playbookId
         * @returns {Promise}
         */
        function getPlaybook(playbookId) {
            var deferred = $q.defer();

            playbookDataService.getPlaybookDetails(playbookId)
                .then(function (data) {
                    if (typeof data !== "undefined") {
                        vm.current.details = data;

                        // Get version info.
                        setPlaybookVersions(vm.playbooks, vm.current.details.teamName);

                        // Prepare user data for owner form.
                        canEditOwner();
                    }
                    else {
                        vm.message = "Unable to retrieve playbook details. Please try again.";
                    }
                    deferred.resolve();
                });

            // Return a promise so that we can chain these together as needed.
            return deferred.promise;
        }

        /**
         * Sets the playbok versions for the current team.
         * @param {Array} playbooks all available playbooks to search through for previous versions.
         * @param {String} teamName name of the team to filter playbooks on.
         */
        function setPlaybookVersions(playbooks, teamName) {
            let versions = {},
                playbook = null;
            playbook = playbooks.find(function (p) {
                return p.latest.teamName === teamName;
            });
            if (playbook !== null && typeof playbook !== "undefined") {
                versions = playbook;
            }

            vm.current.versions = versions;
        }

        /**
         * Redirect url to playbook details.
         * @param {Int} playbookId
         */
        function navigateToPlaybookDetails(playbookId) {
            $location.path('/assessments/' + vm.assessment.id + '/playbooks/' + playbookId);
        }

        /**
         * Creates a new playbook for the selected team assessment.
         */
        function createPlaybook() {
            var teamAssessment = vm.current.details.teamAssessment;
            vm.messaage = null;
            vm.newPlaybookForm.submitted = true;
            if (!vm.newPlaybookForm.form.$valid) {
                return
            }

            playbookDataService.createPlaybookForTeamAssessment(teamAssessment)
                .then(function (data) {
                    vm.info = 'Playbook was saved successfully';
                    $timeout(function () {
                        vm.info = null;
                        vm.newPlaybookForm.submitted = false;
                        vm.navigateToPlaybookDetails(data.id);
                    }, 1500);
                })
                .catch(function (error) {
                    vm.message = 'There was an error saving the playbook. Please try again.';
                });
        }

        /**
         * Updates an existing playbook.
         */
        function updatePlaybook() {
            playbookDataService.updatePlaybook(vm.current.details.id, vm.current.details)
                .then(function (data) {
                    vm.info = 'Playbook was saved successfully';
                    $timeout(function () {
                        vm.info = null;
                        vm.ownerForm.submitted = false;
                    }, 1500);
                    getPlaybook(vm.current.details.id);
                    getPlaybookList(vm.assessment.id);
                })
                .catch(function (error) {
                    vm.message = 'There was an error saving the playbook. Please try again.';
                });
        }

        /**
         * Gets the team assessments to build the new playbook form.
         * @param {Int} assessmentId
         * @returns {Promise} with the flat team assessment list.
         */
        function getTeamAssessmentList(assessmentId) {
            var deferred = $q.defer();

            // Get all assessments.
            assessmentDataService.getTeamAssessments(assessmentId)
                .then(function (data) {
                    if (data.length === 0) {
                        vm.message = 'You do not have any completed assessments to create a playbook for. Please complete an assessment first.';
                    }
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

        /**
         * Gets the latest team assessment for each team.
         * @param {Int} assessmentId
         * @returns {Array} flat list of the latest team assessments only.
         */
        function getLatestTeamAssessmentListByTeam(assessmentId) {
            var deferred = $q.defer();

            getTeamAssessmentList(assessmentId)
                .then(function (data) {
                    let teamGroup = data.group(teamAssessment => teamAssessment.teamName),
                        teamAssessments = [],
                        teamAssessmentObj = null;

                    angular.forEach(teamGroup, function (groupedData) {
                        teamAssessmentObj = assessmentDataService.getMostRecentAttemptForTeam(groupedData.data);
                        teamAssessments.push(teamAssessmentObj);
                    });

                    deferred.resolve(teamAssessments);
                });

            return deferred.promise;
        }

        function getMostRecentCompletedTeamAssessmentForTeam(teamAssessmentsForTeam) {
            mostRecentTeamAssessment = teamAssessmentsForTeam.filter(function (t) {
                return t.completed !== null;
            }).reduce(function (prev, current) {
                return prev.completed > current.completed ? prev : current;
            });
            return mostRecentTeamAssessment;
        }

        /**
         * Gets the link used to share the currently reviewed playbook.
         * @returns {String} full url for a user to click to add the playbook to their shared playbook list.
         */
        function getSharePlaybookLink() {
            if (!angular.equals(vm.current.details, {})) {
                var playbookId = vm.current.details.id,
                    assessmentId = vm.assessment.id;
                return playbookDataService.getPlaybookShareLink(assessmentId, playbookId);
            }
        }

        /**
         * Adds the assessment to the current user's shared assessment list.
         * @param {Int} playbookId
         */
        function addSharedPlaybook(playbookId) {
            // Create link to playbook.
            playbookDataService.addSharedPlaybook(playbookId)
                .then(function (data) {
                    // If it's not already there, add the playbook to the playbook list.
                    // Could go to the server again to get the full list, but trying to save a trip.
                    var exists = vm.playbooks.filter(function (t) { return t.id === data.id; }).length > 0;
                    if (exists === false) {
                        vm.playbooks.push(data);

                        // Show our shared message for a moment if this is a new addition to our list.
                        vm.info = 'The playbook for ' + data.teamName + ' has been successfully added to your shared playbook list.';
                        $timeout(function () {
                            vm.info = null;
                        }, 5 * 1000);
                    }

                    // Load the review data for the shared playbook.
                    vm.getPlaybook(playbookId)
                        .then(function () {
                            setAssessmentName(vm.current.details.teamAssessment);
                        });
                })
                .catch(function (error) {
                    // If failed, show an error message instead of and review details.
                    if (error !== null && typeof error !== "undefined") {
                        vm.message = 'An error occurred while trying to add the shared playbook: ' + error;
                    }
                    else {
                        vm.message = 'An error occurred while trying to add the shared playbook. Please try again.';
                    }
                })
                .finally(function () {
                    vm.loaded = true;
                });
        }

        /**
         * Gets a list of all users within the application, excluding the current user.
         * Sets the user list for the owner form.
         */
        function getUserList() {
            userService.getUsers()
            .then(function (users) {
                var result = users.filter(function (u) {
                    return u.Id !== vm.current.details.ownerId;
                });
                vm.ownerForm.users = result;
            });
        }

        /**
         * Updates the owner of the playbook based on the form values.
         */
        function updatePlaybookOwner() {
            vm.ownerForm.submitted = true;
            if (!vm.ownerForm.form.$valid) {
                return
            }

            updatePlaybook();
        }

        /**
         * Determines if the current user has the permission or ownership required
         * in order to change the owner of a playbook. If the user has the permission, get
         * the list of users prepared.
         */
        function canEditOwner() {
            // If this is an archived playbook, don't allow anyone to edit it.
            if (vm.current.details.isArchived === true) {
                return;
            }

            if (vm.current.details.isOwnedByMe === true) {
                vm.current.details.canEditOwner = true;
                getUserList();
            }
            else {
                authService.hasPermission("PLAYBOOK_OWNER", "Edit")
                    .then(function (data) {
                        vm.current.details.canEditOwner = data || false;

                        if (vm.current.details.canEditOwner === true) {
                            getUserList();
                        }
                    });
            }
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app.playbook')
        .factory('playbookDataService', DataService);

    DataService.$inject = ['$http', '$log', '$q', 'configs', '$window', '$location'];

    /**
     * Service used to get data from the server for Playbooks.
     * @param {$http} $http
     * @param {$log} $log
     * @param {$q} $q
     * @param {Object} configs
     * @param {$window} $window
     * @param {$location} $location
     * @returns {Object} available methods
     */
    function DataService($http, $log, $q, configs, $window, $location) {
        var service = {
            getPlaybooks: getPlaybooks,
            getPlaybooksForAssessment: getPlaybooksForAssessment,
            getPlaybookDetails: getPlaybookDetails,
            createPlaybookForTeamAssessment: createPlaybookForTeamAssessment,
            updatePlaybook: updatePlaybook,
            addSharedPlaybook: addSharedPlaybook,
            getPlaybookShareLink: getPlaybookShareLink,

            deleteCommitment: deleteCommitment,
            createCommitmentForPlaybook: createCommitmentForPlaybook,
            updateCommitment: updateCommitment
        };

        return service;

        /**
         * Get all playbooks for the current user.
         * @returns {Array} List of PlaybookDTOs
         */
        function getPlaybooks() {
            var request = {
                method: 'GET',
                url: configs.apiUrl + 'playbooks'
            };

            return $http(request)
                .then(getPlaybooksComplete)
                .catch(getPlaybooksFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Array}
             */
            function getPlaybooksComplete(response) {
                return response.data;
            }

            /**
             * Failure callback
             * @param {Object} error
             */
            function getPlaybooksFailed(error) {
                var message = getErrorMessage(error);
                $log.error('XHR failed for getPlaybooks. ' + message);
            }
        }

        /**
         * Get all playbooks for the current user and the specified assessment
         * @param {Int} assessmentId
         * @returns {Array} List of PlaybookDTOs
         */
        function getPlaybooksForAssessment(assessmentId) {
            var request = {
                method: 'GET',
                url: configs.apiUrl + 'assessments/' + assessmentId + '/playbooks'
            };

            return $http(request)
                .then(getPlaybooksForAssessmentComplete)
                .catch(getPlaybooksForAssessmentFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Array}
             */
            function getPlaybooksForAssessmentComplete(response) {
                return response.data;
            }

            /**
             * Failure callback
             * @param {Object} error
             */
            function getPlaybooksForAssessmentFailed(error) {
                var message = getErrorMessage(error);
                $log.error('XHR failed for getPlaybooksForAssessment. ' + message);
            }
        }

        /**
         * Get the details for the playbook.
         * @param {int} playbookId
         * @returns {Object} PlaybookDTO
         */
        function getPlaybookDetails(playbookId) {
            var request = {
                method: 'GET',
                url: configs.apiUrl + 'playbooks/' + playbookId
            };

            return $http(request)
                .then(getPlaybookDetailsComplete)
                .catch(getPlaybookDetailsFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Object}
             */
            function getPlaybookDetailsComplete(response) {
                return response.data;
            }

            /**
             * Failure Callback
             * @param {Object} error
             */
            function getPlaybookDetailsFailed(error) {
                var message = getErrorMessage(error);
                $log.error('XHR failed for getPlaybookDetails. ' + message);
            }
        }

        /**
         * Creates a new playbook for the given team assessment.
         * @param {Object} teamAssessment TeamAssessmentDTO
         * @returns {Object} PlaybookDTO
         */
        function createPlaybookForTeamAssessment(teamAssessment) {
            var request = {
                method: 'POST',
                url: configs.apiUrl + 'playbooks',
                data: teamAssessment
            };

            return $http(request)
                    .then(createPlaybookComplete)
                    .catch(createPlaybookFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Object}
             */
            function createPlaybookComplete(response) {
                return response.data;
            }

            /**
             * Failure Callback
             * @param {Object} error
             * @returns {String}  rejects promise with an error message
             */
            function createPlaybookFailed(error) {
                var message = getErrorMessage(error);
                $log.error('XHR failed for createPlaybookForTeamAssessment. ' + message);
                return $q.reject(message);
            }
        }

        /**
         * Creates a new commitment and adds it to the playbook.
         * @param {Int} playbookId
         * @param {Object} commitment
         * @returns {Object}
         */
        function createCommitmentForPlaybook(playbookId, commitment) {
            var request = {
                method: 'POST',
                url: configs.apiUrl + 'playbooks/' + playbookId + '/commitments',
                data: commitment
            };

            return $http(request)
                    .then(createCommitmentForPlaybookComplete)
                    .catch(createCommitmentForPlaybookFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Object}
             */
            function createCommitmentForPlaybookComplete(response) {
                return response.data;
            }

            /**
             * Failure Callback
             * @param {Object} error
             * @returns {String}  rejects promise with an error message
             */
            function createCommitmentForPlaybookFailed(error) {
                var message = getErrorMessage(error);
                $log.error('XHR failed for createCommitmentForPlaybook. ' + message);
                return $q.reject(message);
            }
        }

        /**
         * Updates properties for an existing commitment.
         * @param {Int} playbookId
         * @param {Object} commitment
         * @returns {Object}
         */
        function updateCommitment(playbookId, commitment) {
            var request = {
                method: 'PUT',
                url: configs.apiUrl + 'playbooks/' + playbookId + '/commitments/' + commitment.id,
                data: commitment
            };

            return $http(request)
                    .then(updateCommitmentComplete)
                    .catch(updateCommitmentFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Object}
             */
            function updateCommitmentComplete(response) {
                return response.data;
            }

            /**
             * Failure Callback
             * @param {Object} error
             * @returns {String}  rejects promise with an error message
             */
            function updateCommitmentFailed(error) {
                var message = getErrorMessage(error);
                $log.error('XHR failed for updateCommitment. ' + message);
                return $q.reject(message);
            }
        }

        /**
         * Update an existing playbook.
         * @param {int} playbookId
         * @param {Object} playbook PlaybookDTO
         * @returns {Object} PlaybookDTO
         */
        function updatePlaybook(playbookId, playbook) {
            var request = {
                method: 'PUT',
                url: configs.apiUrl + 'playbooks/' + playbookId,
                data: playbook
            };

            return $http(request)
                    .then(updatePlaybookComplete)
                    .catch(updatePlaybookFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Object}
             */
            function updatePlaybookComplete(response) {
                return response.data;
            }

            /**
             * Failure Callback
             * @param {Object} error
             * @returns {String}  rejects promise with an error message
             */
            function updatePlaybookFailed(error) {
                var message = getErrorMessage(error);
                $log.error('XHR failed for saveTeamAssessment. ' + message);
                return $q.reject(message);
            }
        }

        /**
         * Deletes the given commitment from the playbook.
         * @param {Int} playbookId
         * @param {Int} commitmentId
         * @returns {Object} rejects promise with an an error message
         */
        function deleteCommitment(playbookId, commitmentId) {
            var request = {
                method: 'DELETE',
                url: configs.apiUrl + 'playbooks/' + playbookId + '/commitments/' + commitmentId,
            };

            return $http(request)
                    .then(deleteCommitmentComplete)
                    .catch(deleteCommitmentFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Object}
             */
            function deleteCommitmentComplete(response) {
                return response.data;
            }

            /**
             * Failure Callback
             * @param {Object} error
             * @returns {String}  rejects promise with an error message
             */
            function deleteCommitmentFailed(error) {
                var message = getErrorMessage(error);
                $log.error('XHR failed for deleteCommitment. ' + message);
                return $q.reject(message);
            }
        }

        /**
         * Shares the playbook with the current user.
         * @param {Int} playbookId
         * @returns {PlaybookDTO} or rejects with a string error message.
         */
        function addSharedPlaybook(playbookId) {
            var request = {
                method: 'POST',
                url: configs.apiUrl + 'playbooks/' + playbookId + '/share'
            };

            return $http(request)
                    .then(sharePlaybookComplete)
                    .catch(sharePlaybookFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Object}
             */
            function sharePlaybookComplete(response) {
                return response.data;
            }

            /**
             * Failure Callback
             * @param {Object} error
             * @returns {String}  rejects promise with an error message
             */
            function sharePlaybookFailed(error) {
                var message = getErrorMessage(error);
                $log.error('XHR failed for sharePlaybook. ' + message);
                return $q.reject(message);
            }
        }

        /**
         * Generates the link that will share a playbook with another user.
         * @param {Int} assessmentId
         * @param {Int} playbookId
         * @returns {String}
         */
        function getPlaybookShareLink(assessmentId, playbookId) {
            var baseUrl = new $window.URL($location.absUrl()).origin;
            return baseUrl + '/#/assessments/' + assessmentId + '/playbooks/' + playbookId + '/share';
        }

        /**
         * Helper method to get the error message from the server response.
         * @param {Object} error
         * @returns {String}
         */
        function getErrorMessage(error) {
            var message = "";
            if ("undefined" !== typeof error.data) {
                if (error.data !== null && "undefined" !== typeof error.data.Message) {
                    message = error.data.Message;
                }
                else {
                    message = error.data;
                }
            }
            return message;
        }
    }
})();

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
(function () {
    'use strict';

    angular
        .module('app')
        .factory('authService', authService);

    authService.$inject = ['$q', 'userService'];

    /**
     * Data service for authentication and authorization.
     * @param {$q} $q
     * @param {factory} userService
     * @returns {Object}
     */
    function authService($q, userService) {
        var service = {
            logout: logout,
            getCurrentUser: getCurrentUser,
            isLoggedIn: isLoggedIn,
            isAdmin: isAdmin,
            hasPermission: hasPermission
        };

        /***
        * Uncomment the following when bearer tokens are
        * implemented.
        **/
        //if($cookies.get("token") && $location.path() !== '/logout') {
        //getCurrentUser();
        //}

        return service;

        //////////////////

        /**
        * Removes all tokens and resets the current user.
        *
        * Note, because this is AD based, we will not actually be logging
        * out, when bearer tokens are added this will occur to remove
        * the token from their cookie representation.
        **/
        function logout() {
            //$cookies.remove('token');
        }

        /**
        * Retrieves the current user from cache when
        * the user has been cached, otherwise retrieves
        * the current user from the UserService and adds
        * it to the cache.
        *
        * @returns {Object} user
        **/
        function getCurrentUser() {
            return userService.getUserByUsername('me');
        }

        /**
        * Provides a value which indicates whether or not
        * the user is currently logged in.
        *
        * @returns {Boolean} true if logged in
        **/
        function isLoggedIn() {
            return getCurrentUser()
                .then(function (user) {
                    return user && user.hasOwnProperty('Username');
                });
        }

        /**
        * Provides a value which indicates whether or not
        * the user is an application administrator.
        *
        * @returns {Boolean} true if admin
        **/
        function isAdmin() {
            return getCurrentUser()
                .then(function (user) {
                    return user && user.IsAppAdmin;
                });
        }

        /**
         * Gets the first permission in the list that matches the permission name.
         * @param {Array} permissions - list of permissions to search
         * @param {Strin} permissionToFind - search criteria, permission name
         */
        function getPermission(permissions, permissionToFind) {
            return permissions.find(function (p) {
                return p.name.toLowerCase() === permissionToFind.toLowerCase();
            });
        }

        /**
         * Determines if the current user has a specific permission and privilege in any of the user's roles.
         * @param {String} permission - name of permission
         * @param {String} privilege - name of privilege
         * @returns {Promise} resolved to true or false
         */
        function hasPermission(permission, privilege) {
            var deferred = $q.defer();
            getCurrentUser()
                .then(function (data) {
                    // Get all user roles.
                    var roles = data.AppRoles;
                    if (typeof roles !== "undefined" && roles !== null && roles.length > 0) {
                        // Get all permissions from those role with the name provided.
                        let matchedPermissions = roles.map(function (role) {
                            return getPermission(role.permissions, permission);
                        }),

                        // For the permissions that we found, find the first
                        // one that has the privilege level we're looking for.
                        hasAccess = matchedPermissions.find(function (p) {
                            return p.privilege.toLowerCase() === privilege.toLowerCase();
                        }) !== null;

                        deferred.resolve(hasAccess);
                    }
                    deferred.resolve(false)
                });
            return deferred.promise;
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('authServiceOld', authService);

    authService.$inject = ['$q', 'userService'];

    /**
     * Data service for authentication and authorization.
     * @param {$q} $q
     * @param {factory} userService
     * @returns {Object}
     */
    function authService($q, userService) {
        var service = {
            logout: logout,
            getCurrentUser: getCurrentUser,
            isLoggedIn: isLoggedIn,
            isAdmin: isAdmin,

            getRoles: getRoles,
            getRole: getRole,
            hasAppRoles: hasAppRoles,
            hasRoles: hasRoles,
            hasRole: hasRole,
            hasPermission: hasPermission
        };

        /***
        * Uncomment the following when bearer tokens are
        * implemented.
        **/
        //if($cookies.get("token") && $location.path() !== '/logout') {
        //getCurrentUser();
        //}

        return service;

        //////////////////

        /**
        * Removes all tokens and resets the current user.
        *
        * Note, because this is AD based, we will not actually be logging
        * out, when bearer tokens are added this will occur to remove
        * the token from their cookie representation.
        **/
        function logout() {
            //$cookies.remove('token');
        }

        /**
        * Retrieves the current user from cache when
        * the user has been cached, otherwise retrieves
        * the current user from the UserService and adds
        * it to the cache.
        *
        * @returns {Object} user
        **/
        function getCurrentUser() {
            return userService.getUserByUsername('me');
        }

        /**
        * Provides a value which indicates whether or not
        * the user is currently logged in.
        *
        * @returns {Boolean} true if logged in
        **/
        function isLoggedIn() {
            return getCurrentUser()
                .then(function (user) {
                    return user && user.hasOwnProperty('Username');
                });
        }

        /**
        * Provides a value which indicates whether or not
        * the user is an application administrator.
        *
        * @returns {Boolean} true if admin
        **/
        function isAdmin() {
            return getCurrentUser()
                .then(function (user) {
                    return user && user.IsAppAdmin;
                });
        }

        /**
        * Gets the current user specified set of roles
        * @param {Array} roleSet
        * @returns {Array}
        **/
        function getRoles(roleSet) {
            return getCurrentUser()
                .then(function (user) {
                    return user && user[roleSet + 'Roles'];
                });
        }

        /**
        * Gets the current user specified role from a specified set of roles
        * @param {Array} roleSet
        * @param {String} role
        * @returns {Object}
        **/
        function getRole(roleSet, role) {
            return getRoles(roleSet)
                .then(function (roles) {
                    return roles && roles[role];
                });
        }

        /**
        * Checks if the current user has the specified set of roles
        * @param {Array} roleSet
        * @returns {Array}
        **/
        function hasRoles(roleSet) {
            return getRoles(roleSet)
                .then(function (roles) {
                    return roles && Object.keys(roles).length > 0;
                });
        }

        /**
        * Checks if the current user has app roles
        * @returns {Boolean}
        **/
        function hasAppRoles() {
            return getRoles('App')
                .then(function (roles) {
                    return roles !== null && Object.keys(roles).length > 0;
                });
        }

        /**
        * Checks if the current user has the specified role on a specified set of roles
        * @param {Array} roleSet
        * @param {String} rolename
        * @returns {Boolean}
        **/
        function hasRole(roleSet, rolename) {
            return getRole(roleSet, rolename)
                .then(function (role) {
                    return !!role;
                });
        }

        /**
        * Determinies whether or not the specified role
        * on a specified set contains the specified permission
        * @param {Array} roleSet
        * @param {String} roleName
        * @param {String} permission
        * @returns {Boolean}
        **/
        function hasPermission(roleSet, roleName, permission) {
            if (!angular.isString(permission))
                return $q.when(false);

            getRole(roleSet, roleName)
                .then(function (role) {
                    if (!role)
                        return false;

                    switch (permission) {
                        case 'Create':
                            return role.CanCreate;
                        case 'Read':
                            return role.CanRead;
                        case 'Edit':
                            return role.CanEdit;
                        case 'Submit':
                            return role.CanSubmit;
                        case 'Delete':
                            return role.CanDelete;
                        case 'Full':
                            return role.CanCreate &&
                                    role.CanRead &&
                                    role.CanEdit &&
                                    role.CanSubmit &&
                                    role.CanDelete;
                        default:
                            return false;
                    }
                });
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app.team')
        .controller('TeamController', TeamController);

    TeamController.$inject = ['teamDataService', '$log', '$location', '$routeParams', '$q'];

    /**
     * Controller responsible for all CRUD actions surrounding a team.
     * @param {factory} teamDataService
     * @param {$log} $log
     * @param {$location} $location
     * @param {$routeParams} $routeParams
     * @param {$q} $q
     */
    function TeamController(teamDataService, $log, $location, $routeParams, $q) {
        /* jshint validthis:true */
        var vm = this;

        // Existing teams to select.
        vm.teams = [];

        // Team object we're creating.
        vm.team = {
            id: 0,
            name: null,
            info: null
        };

        // Assessment this team is tied to.
        vm.assessmentId = null;

        // Message to display to the user regarding their inputs.
        // ie. Validation messages, saved message, error message, etc.
        vm.message = null;
        vm.warning = null;

        // Loading indicator when searching teams.
        vm.isLoadingTeams = false;

        // Methods for editing the team form.
        vm.saveTeam = saveTeam;
        vm.selectTeam = selectTeam;
        vm.editTeamProperty = editTeamProperty;
        vm.validateTeamName = validateTeamName;

        // Cancel this action.
        vm.cancel = cancel;

        // Search existing teams.
        vm.search = searchByName;

        activate();

        /**
         * Page load actions. Get the route params to determine if we're
         * creating or editting.
         */
        function activate() {
            vm.team.id = +$routeParams.teamId || 0;
            vm.assessmentId = +$routeParams.assessmentId;
            if (vm.team.id > 0) {
                getTeam(vm.team.id);
            }
        }

        /**
         * Gets the details for the team based on the route id.
         */
        function getTeam() {
            teamDataService.getTeam(vm.team.id)
                .then(function (data) {
                    vm.team = data;
                });
        }

        /**
         * Updates or creates the team details.
         */
        function saveTeam() {
            vm.form.submitted = true;

            if (vm.form.$invalid) {
                return;
            }

            // Update or create new team.
            var req;
            if (vm.team.id > 0) {
                req = updateTeam();
            }
            else {
                req = createTeam();
            }
            req
                .then(function (data) {
                    if ("undefined" !== typeof data) {
                        if ("undefined" !== typeof data.id && data.id !== 0) {
                            $log.debug("Team created with id: " + data.id);

                            // Redirect to the Start Assessment page automatically after successful save.
                            // TODO: when we allow for adding of teams/project/apps from separate page, need to
                            // make this a dynamic action.
                            $location.path('/assessments/' + vm.assessmentId + '/team/' + data.id + '/edit')
                        }
                    }
                    else {
                        vm.message = 'An error occurred while trying to save your team. Please try again.';
                    }
                })
                .catch(function (error) {
                    if ("undefined" !== typeof error) {
                        vm.message = 'An error occurred while trying to save your team: ' + error;
                    }
                    else {
                        vm.message = 'An error occurred while trying to save your team. Please try again.';
                    }
                });
        }

        /**
         * Creates a new team.
         * @returns {Promise}
         */
        function createTeam() {
            return teamDataService.createTeam(vm.team);
        }

        /**
         * Updates an existing team.
         * @returns {Promise}
         */
        function updateTeam() {
            return teamDataService.updateTeam(vm.team);
        }

        /**
         * Cancel actions for the form.
         * Returns to the assessments page.
         */
        function cancel() {
            $location.path('/assessments');
        }

        /**
         * Searches existing teams by name. Sets teams list.
         * @param {String} name
         * @returns {Promise}
         */
        function searchByName(name) {
            // TODO: run load tests to determine if it's more appropriate to get list
            // of all teams and just search in javascript.
            var deferred = $q.defer();
            if (typeof name !== 'undefined' && name !== null && name.trim() !== '') {
                vm.isLoadingTeams = true;
                teamDataService.searchTeamsByName(name)
                    .then(function (data) {
                        if (typeof data !== 'undefined') {
                            vm.teams = data;
                            deferred.resolve(data);
                        }
                        else {
                            vm.teams = [];
                            deferred.resolve([]);
                        }
                        vm.isLoadingTeams = false;
                    })
                    .catch(function (error) {
                        if (typeof error !== 'undefined' && error !== null) {
                            vm.message = 'An error occurred while searching for teams. ' + error;
                        }
                        else {
                            vm.message = 'An error occurred while searching for teams. Please try again later.';
                        }
                        vm.isLoadingTeams = false;
                        deferred.reject(vm.message);
                    });
            }
            return deferred.promise;
        }

        /**
         * Select an existing team from the dropdown.
         * @param {Object} team
         */
        function selectTeam(team) {
            // Set the team object so that we retain the id and info.
            vm.team = team;

            // Reset our warning upon selecting a new team.
            vm.warning = null;
        }

        /**
         * When the name or info is changed for a team, display a warning if
         * the user is editing an existing team.
         * @param {String} teamProperty - the name or info for a team
         */
        function editTeamProperty(teamProperty) {
            // Show warning that user is editing existing team.
            if (vm.team.id > 0) {
                vm.warning = 'You are editing data for an existing team/project/application. These changes will apply to all assessments and playbooks that exist for this item.';
            }
        }

        /**
         * Sets the validity for the team name field based on required attributes.
         * Required to use instead of built-in required attribute because of the autocomplete form.
         * @param {type} name
         */
        function validateTeamName(name) {
            if (typeof name === 'undefined' || name === null || name.trim() === '') {
                vm.form.name.$setValidity('required', false);
            }
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app.team')
        .factory('teamDataService', teamDataService);

    teamDataService.$inject = ['$http', '$log', '$q', 'configs'];

    /**
     * Service used to get data from the server for Teams.
     * @param {$http} $http
     * @param {$log} $log
     * @param {$q} $q
     * @param {Object} configs
     * @returns {type}
     */
    function teamDataService($http, $log, $q, configs) {
        var service = {
            createTeam: createTeam,
            updateTeam: updateTeam,
            getTeam: getTeam,
            getTeams: getTeams,
            searchTeamsByName: searchTeamsByName
        };

        return service;

        /**
         * Gets team details for the specified team id.
         * @param {int} teamId
         * @returns {Object} TeamDTO details
         */
        function getTeam(teamId) {
            var request = {
                method: 'GET',
                url: configs.apiUrl + 'teams/' + teamId
            };

            return $http(request)
                    .then(getTeamComplete)
                    .catch(getTeamFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Object}
             */
            function getTeamComplete(response) {
                return response.data;
            }

            /**
            * Failure Callback
            * @param {Object} error
            */
            function getTeamFailed(error) {
                var message = error.data;
                $log.error('XHR failed for getTeam. ' + message);
            }
        }

        /**
         * Gets all teams for the current user.
         * @returns {Array} List of TeamDTOs
         */
        function getTeams() {
            var request = {
                method: 'GET',
                url: configs.apiUrl + 'teams'
            };

            return $http(request)
                    .then(getTeamsComplete)
                    .catch(getTeamsFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Object}
             */
            function getTeamsComplete(response) {
                return response.data;
            }

            /**
            * Failure Callback
            * @param {Object} error
            */
            function getTeamsFailed(error) {
                var message = error.data;
                $log.error('XHR failed for getTeams. ' + message);
            }
        }

        /**
         * Validates and creates a new team.
         * @param {Object} team
         * @returns {Object} created TeamDTO
         */
        function createTeam(team) {
            var request = {
                method: 'POST',
                url: configs.apiUrl + 'teams',
                data: team
            };

            if ("undefined" !== typeof team.name && "" !== team.name.trim()) {
                return $http(request)
                        .then(createTeamComplete)
                        .catch(createTeamFailed);

                /**
                 * Sucess Callback
                 * @param {Object} response
                 * @returns {Object}
                 */
                function createTeamComplete(response) {
                    return response.data;
                }

                /**
                 * Failure Callback
                 * @param {Object} error
                 * @returns {String}  rejects promise with an error message
                 */
                function createTeamFailed(error) {
                    var message = "";
                    if ("undefined" !== typeof error.data) {
                        if (error.data !== null && "undefined" !== typeof error.data.Message) {
                            message = error.data.Message;
                        }
                        else {
                            message = error.data;
                        }
                    }
                    $log.error('XHR failed for createTeam. ' + message);
                    return $q.reject(message);
                }
            }
            else {
                $log.info('Validation failed for team object during createTeam.');
                var error = "The team name is required";
                return $q.reject(error);
            }
        }

        /**
         * Updates an existing team
         * @param {Object} team
         * @returns {Object} Updated TeamDTO
         */
        function updateTeam(team) {
            var request = {
                method: 'PUT',
                url: configs.apiUrl + 'teams/' + team.id,
                data: team
            };

            if ("undefined" !== typeof team.name && "" !== team.name.trim()) {
                return $http(request)
                        .then(updateTeamComplete)
                        .catch(updateTeamFailed);

                /**
                 * Sucess Callback
                 * @param {Object} response
                 * @returns {Object}
                 */
                function updateTeamComplete(response) {
                    return response.data;
                }

                /**
                 * Failure Callback
                 * @param {Object} error
                 * @returns {String}  rejects promise with an error message
                 */
                function updateTeamFailed(error) {
                    var message = "";
                    if ("undefined" !== typeof error.data) {
                        if (error.data !== null && "undefined" !== typeof error.data.Message) {
                            message = error.data.Message;
                        }
                        else {
                            message = error.data;
                        }
                    }
                    $log.error('XHR failed for updateTeam. ' + message);
                    return $q.reject(message);
                }
            }
            else {
                $log.info('Validation failed for team object during updateTeam.');
                var error = "The team name is required";
                return $q.reject(error);
            }
        }

        /**
         * Matches team names by the input provided.
         * @param {String} name
         * @returns {Array} List of TeamDTOs
         */
        function searchTeamsByName(name) {
            var request = {
                method: 'GET',
                url: configs.apiUrl + 'teams/search/?name=' + name.toLowerCase()
            };

            return $http(request)
                    .then(searchTeamsByNameComplete)
                    .catch(searchTeamsByNameFailed);

            /**
             * Sucess Callback
             * @param {Object} response
             * @returns {Array} list of teams
             */
            function searchTeamsByNameComplete(response) {
                return response.data;
            }

            /**
            * Failure Callback
            * @param {Object} error
            * @returns {Promise} rejected promise
            */
            function searchTeamsByNameFailed(error) {
                var message = error.data;
                $log.error('XHR failed for searchTeamsByName. ' + message);
                return $q.reject(message);
            }
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .constant('Pikaday', Pikaday)
        .constant('svg4everybody', svg4everybody);
})();
(function () {
    'use strict';

    angular
        .module('app.visualizations')
        .directive('pdRadarChart', RadarChartDirective);

    RadarChartDirective.$inject = ['$log', '$window'];

    /**
     * Directive to build and display a d3.js radar chart.
     * @param {type} $log
     * @param {type} $window
     * @returns {type}
     */
    function RadarChartDirective($log, $window) {
        var directive = {
            link: link,
            templateUrl: '/app/visualizations/radar.chart.html',
            restrict: 'A',
            scope: {
                // 'Some title'
                title: '@',

                // array of array of objects: { axis: 'myName', value: 45.3 }. order array with legend items.
                data: '=',

                // 300
                width: '@',

                // 300
                height: '@',

                // [{name: 'item 1', click: func}, {name:'item 2', click: func}] // func is the click event
                legend: '='
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
            // Changes to questions. Mostly used for initial load.
            scope.$watchCollection(
                function () {
                    return [
                        scope.data
                    ];
                }, function (newValue, oldValue) {
                    // if the data has changed or we need to recreate the graph, do so.
                    if (newValue !== oldValue) {
                        if (typeof scope.data !== "undefined" && scope.data !== null &&
                            typeof scope.data[0] !== "undefined" && scope.data[0].length > 0) {
                            console.log(scope);
                            createGraph();
                        }
                        else {
                            // Clear out the graph.
                            element[0].querySelector('#graph').innerHTML = "";
                            scope.data = null;
                        }
                    }
                });

            // Changes to screen size redraws the chart.
            angular.element($window).bind('resize', function () {
                if (typeof scope.data !== 'undefined' && scope.data !== null &&
                    typeof scope.data[0] !== "undefined" && scope.data[0].length > 0) {
                    createGraph();

                    // manual $digest required as resize event
                    // is outside of angular
                    scope.$digest();
                }
                else {
                    $log.warn('Radar chart data is undefined.');
                }
            });

            /*
             * Chart Configurations.
             *
             * Default configuration:
                var cfg = {
                    radius: 5,
                    w: 600,
                    h: 600,
                    factor: 1,
                    factorLegend: .85,
                    levels: 3,
                    maxValue: 0,
                    radians: 2 * Math.PI,
                    opacityArea: 0.5,
                    ToRight: 5,
                    TranslateX: 80,
                    TranslateY: 30,
                    ExtraWidthX: 100,
                    ExtraWidthY: 100,
                    color: d3.scale.category10()
                };
            */

            // Override config settings.
            // Add to scope as necessary.
            var myCfg = {
                levels: 10,
                maxValue: 1,
                ExtraWidthX: 200,

                // extra width / 2 i think. need to make responsive.
                TranslateX: (200) / 2
            };

            /**
             * Create the graph from our configuration.
             */
            function createGraph() {
                // Set our height and width after we load.
                var windowWidth = element[0].clientWidth;
                if (windowWidth <= 0) {
                    return;
                }
                else if (windowWidth - myCfg.ExtraWidthX < 0) {
                    myCfg.w = windowWidth;
                }
                else if (windowWidth - myCfg.ExtraWidthY < 0) {
                    myCfg.h = windowWidth;
                }
                else {
                    myCfg.w = element[0].clientWidth - myCfg.ExtraWidthX;
                    myCfg.h = element[0].clientWidth - myCfg.ExtraWidthX;
                }

                // Creat the chart.
                RadarChart.draw("#graph", scope.data, myCfg); // eslint-disable-line no-undef

                // Setup our click events.
                if (typeof scope.legend !== "undefined" && scope.legend !== null && scope.legend.length > 0) {
                    // Get all legend text elements.
                    var legendItems = element[0].querySelectorAll("text.legend"),
                        thisItem;

                    // For each legend item found with matching text, set up our click bind.
                    angular.forEach(scope.legend, function (l) {
                        thisItem = [...legendItems].filter(e => e.textContent === l.name || e.textContent === l.name + ' (NA)');
                        angular.forEach(thisItem, function (i) {
                            angular.element(i).bind('click', l.click);
                        });
                    });
                }
            }
        }
    }
})();
/*
 * Taken from https://gist.github.com/nbremer/6506614
 * License: MIT
 * D3.js
 * Editted by XOM for D3.js v4
 */

//Practically all this code comes from https://github.com/alangrafu/radar-chart-d3
//I only made some additions and aesthetic adjustments to make the chart look better
//(of course, that is only my point of view)
//Such as a better placement of the titles at each line end,
//adding numbers that reflect what each circular level stands for
//Not placing the last level and slight differences in color
//
//For a bit of extra information check the blog about it:
//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html

var RadarChart = {
    draw: function (id, d, options) {
        var cfg = {
            radius: 5,
            w: 600,
            h: 600,
            factor: 1,
            factorLegend: .85,
            levels: 3,
            maxValue: 0,
            radians: 2 * Math.PI,
            opacityArea: 0.5,
            ToRight: 5,
            TranslateX: 80,
            TranslateY: 30,
            ExtraWidthX: 100,
            ExtraWidthY: 100,
            color: d3.schemeCategory10
        };

        if ('undefined' !== typeof options) {
            for (var i in options) {
                if ('undefined' !== typeof options[i]) {
                    cfg[i] = options[i];
                }
            }
        }
        cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function (i) { return d3.max(i.map(function (o) { return o.value; })) }));
        var allAxis = (d[0].map(function (i, j) { return i.axis }));
        var total = allAxis.length;
        var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
        var Format = d3.format('.0%'); // rounds to nearest full percentage. ie. 10%
        d3.select(id).select("svg").remove();

        var g = d3.select(id)
                .append("svg")
                .attr("width", cfg.w + cfg.ExtraWidthX)
                .attr("height", cfg.h + cfg.ExtraWidthY)
                .append("g")
                .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
        ;

        var tooltip;

        //Circular segments
        for (var j = 0; j < cfg.levels - 1; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
             .data(allAxis)
             .enter()
             .append("svg:line")
             .attr("x1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
             .attr("y1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
             .attr("x2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total)); })
             .attr("y2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total)); })
             .attr("class", "line")
             .style("stroke", "grey")
             .style("stroke-opacity", "0.75")
             .style("stroke-width", "0.3px")
             .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
        }

        //Text indicating at what % each level is
        for (var j = 0; j < cfg.levels; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
             .data([1]) //dummy data
             .enter()
             .append("svg:text")
             .attr("x", function (d) { return levelFactor * (1 - cfg.factor * Math.sin(0)); })
             .attr("y", function (d) { return levelFactor * (1 - cfg.factor * Math.cos(0)); })
             .attr("class", "legend")
             .style("font-family", "sans-serif")
             .style("font-size", "10px")
             .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
             .attr("fill", "#737373")
             .text(Format((j + 1) * cfg.maxValue / cfg.levels));
        }

        series = 0;

        var axis = g.selectAll(".axis")
                .data(allAxis)
                .enter()
                .append("g")
                .attr("class", "axis");

        axis.append("line")
            .attr("x1", cfg.w / 2)
            .attr("y1", cfg.h / 2)
            .attr("x2", function (d, i) { return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
            .attr("y2", function (d, i) { return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "1px");

        axis.append("text")
            .attr("class", "legend")
            .text(function (d) { return d })
            //.style("font-family", "sans-serif")
            //.style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function (d, i) { return "translate(0, -20)" })
            .attr("x", function (d, i) { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total); })
            .attr("y", function (d, i) { return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total); });

        d.forEach(function (y, x) {
            dataValues = [];
            g.selectAll(".nodes")
              .data(y, function (j, i) {
                  dataValues.push([
                    cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                    cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                  ]);
              });
            dataValues.push(dataValues[0]);
            g.selectAll(".area")
                           .data([dataValues])
                           .enter()
                           .append("polygon")
                           .attr("class", "radar-chart-serie" + series)
                           .style("stroke-width", "2px")
                           .style("stroke", cfg.color[series])
                           .attr("points", function (d) {
                               var str = "";
                               for (var pti = 0; pti < d.length; pti++) {
                                   str = str + d[pti][0] + "," + d[pti][1] + " ";
                               }
                               return str;
                           })
                           .style("fill", function (j, i) { return cfg.color[series] })
                           .style("fill-opacity", cfg.opacityArea)
                           .on('mouseover', function (d) {
                               z = "polygon." + d3.select(this).attr("class");
                               g.selectAll("polygon")
                                .transition(200)
                                .style("fill-opacity", 0.1);
                               g.selectAll(z)
                                .transition(200)
                                .style("fill-opacity", .7);
                           })
                           .on('mouseout', function () {
                               g.selectAll("polygon")
                                .transition(200)
                                .style("fill-opacity", cfg.opacityArea);
                           });
            series++;
        });
        series = 0;

        d.forEach(function (y, x) {
            g.selectAll(".nodes")
              .data(y).enter()
              .append("svg:circle")
              .attr("class", "radar-chart-serie" + series)
              .attr('r', cfg.radius)
              .attr("alt", function (j) { return Math.max(j.value, 0) })
              .attr("cx", function (j, i) {
                  dataValues.push([
                    cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                    cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                  ]);
                  return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
              })
              .attr("cy", function (j, i) {
                  return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
              })
              .attr("data-id", function (j) { return j.axis })
              .style("fill", cfg.color[series]).style("fill-opacity", .9)
              .on('mouseover', function (d) {
                  newX = parseFloat(d3.select(this).attr('cx')) - 10;
                  newY = parseFloat(d3.select(this).attr('cy')) - 5;

                  tooltip
                      .attr('x', newX)
                      .attr('y', newY)
                      .text(Format(d.value))
                      .transition(200)
                      .style('opacity', 1);

                  z = "polygon." + d3.select(this).attr("class");
                  g.selectAll("polygon")
                      .transition(200)
                      .style("fill-opacity", 0.1);
                  g.selectAll(z)
                      .transition(200)
                      .style("fill-opacity", .7);
              })
              .on('mouseout', function () {
                  tooltip
                      .transition(200)
                      .style('opacity', 0);
                  g.selectAll("polygon")
                      .transition(200)
                      .style("fill-opacity", cfg.opacityArea);
              })
              .append("svg:title")
              .text(function (j) { return Math.max(j.value, 0) });

            series++;
        });
        //Tooltip
        tooltip = g.append('text')
                   .style('opacity', 0)
                   .style('font-family', 'sans-serif')
                   .style('font-size', '13px');
    }
};
(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ApplicationLogsController', ApplicationLogsController);

    ApplicationLogsController.$inject = ['$q', 'applicationLogsService', '$log'];

    /**
     * Controller to manage application logs.
     * @param {$q} $q
     * @param {factory} applicationLogsService
     * @param {$log} $log
     */
    function ApplicationLogsController($q, applicationLogsService, $log) {
        var vm = this;
        vm.logs = [];
        vm.error = false;
        vm.loading = false;

        activate();

        /**
         * Initialize controller.
         */
        function activate() {
            // Retrieves all production lines with their CPRs for the current year then updates locks
            applicationLogsService
                .get()
                .then(function (logs) {
                    vm.logs = logs;

                    for (var i = 0; i < logs.length; i++) {
                        var sessionDetails = vm.logs[i].SessionDetails || '{}';

                        sessionDetails = replaceAll(sessionDetails, "''", "\"");
                        sessionDetails = sessionDetails.replace(/\\/g, "\\\\");
                        sessionDetails = sessionDetails.replace("Username", "\"Username\"");
                        sessionDetails = sessionDetails.replace("Session", "\"Session\"");

                        vm.logs[i].SessionDetails = JSON.parse(sessionDetails);
                    }

                    vm.loading = false;
                })
                .catch(function (error) {
                    vm.error = true;
                    $log.info(error);
                });
        };
    }

    /**
     * Replaces all instances of a string.
     * @param {String} str
     * @param {String} find
     * @param {String} replace
     * @returns {String}
     */
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('AppLog', AppLogModel);

    AppLogModel.$inject = [];

    /**
     * Js object representing an Application Log.
     * @returns {Object}
     */
    function AppLogModel() {
        return AppLog;

        /**
         * Create a new app log object based on another object.
         * @param {Object} baseObj
         * @returns {Object}
         */
        function AppLog(baseObj) {
            let instance = this;

            if (!angular.isObject(baseObj))
                baseObj = {};

            angular.extend(instance, {
                Id: baseObj.Id,
                EventId: baseObj.EventId,
                Timestamp: baseObj.Timestamp,
                Source: baseObj.Source,
                SessionDetails: baseObj.SessionDetails,
                Message: baseObj.Message,
                Level: baseObj.Level,
                ExceptionMessage: baseObj.ExceptionMessage
            });

            return instance;
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app.admin')
        .factory('ApplicationLogsService', ApplicationLogsService);

    ApplicationLogsService.$inject = ['$http', '$log', 'configs'];

    /**
     * Data service for basic application log management.
     * @param {$http} $http
     * @param {$log} $log
     * @param {Object} configs
     * @returns {Object}
     */
    function ApplicationLogsService($http, $log, configs) {
        var service = {
            getAll: getAll,
            get: get
        };

        return service;

        /**
        * Gets the set of all applog entries currently in the system.
        * @returns {Array}
        */
        function getAll() {
            var request = {
                method: 'GET',
                url: configs.apiUrl + '/ApplicationLogEntries'
            }

            return $http(request)
                .then(
                    function successCallback(response) {
                        $log.debug('Application log entries retrieved successfully.');
                        return response.data;
                    },
                    function errorCallback(response) {
                        $log.debug('Api was not found or is currently unavailable where expected. Please try again later.');
                        $log.debug('Response: ' + response);
                    }
                );
        }

        /**
        * Gets the entry corresponding to the specified identifier.
        * @param {Int} id
        * @returns {Object}
        */
        function get(id) {
            var request = {
                method: 'GET',
                url: configs.apiUrl + '/api/ApplicationLogEntries/' + id
            }

            return $http(request)
                .then(
                    function successCallback(response) {
                        $log.debug('Application log entry retrieved successfully.');
                        return response.data;
                    },
                    function errorCallback(response) {
                        $log.debug('Api was not found or is currently unavailable where expected. Please try again later.');
                        $log.debug('Response: ' + response);
                    }
                );
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserController', UserController);

    UserController.$inject = ['$routeParams', 'userService'];

    /**
     * Controller to manage users.
     * @param {$routeParams} $routeParams
     * @param {factory} userService
     */
    function UserController($routeParams, userService) {
        var vm = this;

        // Field members
        vm.user = {};
        vm.isLoading = true;
        vm.roles = [];
        vm.userNotFound = false;

        // Function mapping
        vm.getPermissions = getPermissions;

        // Initialize launch command
        activate();

        //////////////////

        /**
        * Performs initialization activities during the
        * initial instantiation.
        */
        function activate() {
            getUser($routeParams.username);
        }

        /**
        * Gets the users information for the specified.
        * @param {String} username
        */
        function getUser(username) {
            vm.userNotFound = false;

            userService.getUserByUsername(username || 'me')
                .then(function (user) {
                    vm.user = user;
                    vm.isLoading = false;
                    vm.roles = getRoles();
                }, function (error) {
                    if (error.status === 400)
                        vm.userNotFound = true;
                });
        }

        /**
         * Gets a list of all roles for the user.
         * @returns {Array}
         */
        function getRoles() {
            return filter(vm.user, 'Roles');
        }

        /**
         * Gets a list of roles the user has permission to.
         * @param {String} role
         * @returns {Array}
         */
        function getPermissions(role) {
            return filter(role, 'Can');
        }

        /**
         * Filters the object's properties.
         * @param {Object} obj
         * @param {String} includes
         * @returns {Array}
         */
        function filter(obj, includes) {
            return Object.keys(obj).filter(function (key) {
                return key.includes(includes);
            });
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('User', UserModel);

    UserModel.$inject = [];

    /**
     * Js representation of a User object.
     * @returns {Object}
     */
    function UserModel() {
        return User;

        /**
         * Creates a new user from the base Obj.
         * @param {Object} baseObj
         * @returns {Object}
         */
        function User(baseObj) {
            let instance = this;

            if (!angular.isObject(baseObj))
                baseObj = {};

            angular.extend(instance, {
                Id: baseObj.Id,
                Username: baseObj.Username,
                FriendlyName: baseObj.FriendlyName,
                EmailAddress: baseObj.EmailAddress,
                IsAppAdmin: baseObj.IsAppAdmin,
                AppRoles: baseObj.AppRoles,
                ProductionLineRoles: baseObj.ProductionLineRoles,
                PlantRoles: baseObj.PlantRoles,
                ProductionUnitRoles: baseObj.ProductionUnitRoles,
                SiteRoles: baseObj.SiteRoles
            });

            return instance;
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('userService', userService);

    userService.$inject = ['$http', '$log', 'configs', 'User'];

    /**
     * Data service for users.
     * @param {$http} $http
     * @param {$log} $log
     * @param {Object} configs
     * @param {Object} User
     * @returns {Object}
     */
    function userService($http, $log, configs, User) {
        var service = {
            getUsers: getUsers,
            getUserById: getUserById,
            getUserByUsername: getUserByUsername,
            saveUser: saveUser,
            deleteUser: deleteUser
        };

        return service;

        //////////////////

        /**
         * Get all users
         * @returns {Array}
         */
        function getUsers() {
            var req = {
                method: 'GET',
                url: configs.apiUrl + "auth/users"
            }

            return $http(req)
                    .then(
                        function successCallback(res) {
                            return res.data;
                        },

                        function errorCallback(res) {
                            $log.debug('There was an error retrieving users. Please try again later.');
                        }
                    );
        }

        /**
         * Get a specific user by the id.
         * @param {Int} id
         * @returns {Object}
         */
        function getUserById(id) {
            var req = {
                method: 'GET',
                url: configs.apiUrl + "auth/users/" + id
            }

            return $http(req)
                    .then(
                        function successCallback(res) {
                            return res.data;
                        },

                        function errorCallback(res) {
                            $log.debug('There was an error retrieving the user. Please try again later.');
                        }
                    );
        }

        /**
         * Get a specific user by the username.
         * @param {String} username
         * @returns {Object}
         */
        function getUserByUsername(username) {
            var req = {
                method: 'GET',
                url: configs.apiUrl + "auth/users/" + username
            }

            return $http(req)
                    .then(
                        function successCallback(res) {
                            //$log.debug('User retrieved successfully.');
                            //$log.debug(res.data);

                            return res.data;
                        },

                        function errorCallback(res) {
                            $log.debug('There was an error retrieving the user. Please try again later.');
                        }
                    );
        }

        /**
         * Create or Update a user.
         * @param {Object} user
         * @returns {Object}
         */
        function saveUser(user) {
            var request = {
                method: 'POST',
                url: configs.apiUrl + "auth/users",
                data: {
                    Username: user.Username,
                    FriendlyName: user.FriendlyName,
                    EmailAddress: user.EmailAddress,
                    IsAppAdmin: user.IsAppAdmin,
                    AppRoles: user.AppRoles,
                    ProductionLineRoles: user.ProductionLineRoles,
                    PlantRoles: user.PlantRoles,
                    ProductionUnitRoles: user.ProductionUnitRoles,
                    SiteRoles: user.SiteRoles
                }
            }

            if (user && user.Id > 0) {
                request.method = 'PUT';
                request.url = request.url + "/" + user.Id;
                request.data.Id = user.Id;
            }

            return $http(request)
                    .then(
                        function successCallback(res) {
                            return res.data;
                        },

                        function errorCallback(res) {
                            $log.debug('There was an error saving the user. Please try again later.');
                        }
                    );
        }

        /**
         * Delete a user by the id.
         * @param {Int} id
         * @returns {Boolean}
         */
        function deleteUser(id) {
            var req = {
                method: 'DELETE',
                url: configs.apiUrl + "auth/users/" + id
            }

            return $http(req)
                    .then(
                        function successCallback(res) {
                            return true;
                        },

                        function errorCallback(res) {
                            $log.debug('There was an error retrieving the user. Please try again later.');
                            return false;
                        }
                    );
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['productionLinesService', 'userService', 'authService'];

    /**
     * Controller to manage users.
     * @param {factory} productionLinesService
     * @param {factory} userService
     * @param {factory} authService
     */
    function UsersController(productionLinesService, userService, authService) {
        let vm = this;

        vm.error = false;
        vm.users = [];
        vm.form = {};

        vm.input = {};

        vm.loading = false;

        activate();

        /**
         * Initialize controller.
         */
        function activate() {
            vm.loading = true;

            userService
                .get()
                .then(function (users) {
                    vm.users = (users || [])
                                .filter(function (user) {
                                    return user.IsAppAdmin
                                        || isEditor(user);
                                });
                })
                .catch(function (error) {
                    vm.error = true;
                });
        };

        /**
         * Determine if you have the appropriate role to edit users.
         * @param {type} user
         * @returns {type}
         */
        function isEditor(user) {
            return user
                && user.AppRoles
                && user.AppRoles["ChemApps-Editor"];
        }
    }
})();
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
(function () {
    'use strict';

    angular
        .module('app.assessment')
        .directive('pbWizard', Wizard);

    Wizard.$inject = ['$log', '$timeout', '$sce'];

    /**
     * Directive to create an navigate through a wizard of questions.
     * @param {$log} $log
     * @param {$timeout} $timeout
     * @param {$sce} $sce
     * @returns {Object}
     */
    function Wizard($log, $timeout, $sce) {
        var directive = {
            link: link,
            templateUrl: '/app/assessment/wizard/wizard.html',
            restrict: 'A',
            scope: {
                title: '@',
                questions: '=',
                pageSize: '@',
                loaded: '&',
                save: '&',
                submit: '&',
                cancel: '&',
                review: '&',
                disableButtons: '&'
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
            // alert message for actions.
            scope.message = null;

            /*
             * Navigation methods.
             * These are navigation options that apply to the entire wizard, not a particular page or step.
             */

            scope.showSaveAndExitModal = false;
            /**
             * Show the save and exit modal.
             */
            function saveAndExit() {
                scope.showSaveAndExitModal = true;
            };

            scope.showCancelModal = false;
            /**
             * Show the cancel modal.
             */
            function cancel() {
                scope.showCancelModal = true;
            };

            scope.saveAndExitModalText = '<p>You have chosen to save the input provided thus far and exit the assessment.</p>' +
                '<p>Select OK below to save all information and return to the Assessments page, or select Cancel to return to the current assessment.</p>';
            scope.cancelModalText = '<p>You have chosen to cancel this assessment. If you are sure you want to cancel and delete all input provided thus far, click OK below.</p>' +
                '<p>If you would like to save your assessment and finish it later, select Cancel below, and then select \'Save and Exit\' from the current assessment screen.</p>';

            /**
             *  Save and exit the assessment.
             */
            scope.confirmSaveAndExit = function () {
                scope.save()
               .then(null, function (error) {
                   // Hide the modal.
                   scope.showSaveAndExitModal = false;
                   $log.error("Assessment failed to save!");

                   // Show the error message for 5 seconds. Then hide.
                   if (error === '') {
                       scope.message = "Any error occurred while saving your progress. Please try again.";
                   }
                   else {
                       scope.message = error;
                   }
                   $timeout(function () {
                       scope.message = null;
                   }, 5000);
               });
            };

            /**
             * Cancel the assessment.
             */
            scope.confirmCancel = function () {
                scope.cancel();
            };

            /**
             * Submit the assessment answers.
             */
            scope.submitAndEnd = function () {
                $log.debug("submit");

                scope.submit()
                .then(function () {
                    // Consider moving the promise chaining into the step next method so that we don't duplicate this logic.
                    scope.currentStepIndex++;
                }, function (error) {
                    $log.error("Assessment failed to save!");

                    // Show the error message for 5 seconds. Then hide.
                    if (error === '') {
                        scope.message = "Any error occurred while submitting your assessment. Please try again.";
                    }
                    else {
                        scope.message = error;
                    }
                    $timeout(function () {
                        scope.message = null;
                    }, 5000);
                });
            };

            /*
             * Watches
             */

            /**
             * Changes to questions. Mostly used for initial load.
             */
            scope.$watchCollection(
                function () {
                    return [
                        scope.questions
                    ];
                }, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        configurePages();
                    }
                });

            /**
             *  Switching between steps and pages requires rebuilding the navigation per page.f
             * Validation checks to show and disable buttons appropriately require the object be reset.
             */
            scope.$watchCollection(
              function () {
                  return [
                      scope.currentStepIndex,
                      typeof scope.currentStep() === "undefined" ? scope.currentStepIndex : scope.currentStep().currentPageIndex
                  ];
              }, function (newValue, oldValue) {
                  if (newValue !== oldValue) {
                      scope.currentStep().currentPage.createNavigation();
                  }
              });

            /*
             * Create 'pages'
             */
            scope.steps = [];
            scope.currentStepIndex = -1;

            /**
             * Gets the current step object.
             * @returns {Object}
             */
            scope.currentStep = function () { return scope.steps[scope.currentStepIndex]; }

            /**
             * Step class.
             * Represents a normal step within the wizard.
             * Extensions of this class can be built for more complex steps.
             */
            class Step {
                /**
                 * Class constructor.
                 * @param {Int} index
                 * @param {String} name
                 * @param {String} type
                 */
                constructor(index, name, type) {
                    this.index = index;
                    this.name = name;
                    this.type = type;
                    this.pages = this.createPages();
                    this.currentPageIndex = 0;
                }

                /**
                 *  Returns the current page of this step.
                 * @returns {Page}
                 */
                get currentPage() {
                    return this.calcCurrentPage();
                }

                /**
                 *  Determines if this step is the current step within the wizard.
                 * @returns {Bool}
                 */
                get isCurrentStep() {
                    return scope.currentStepIndex == this.index;
                }

                /**
                 *  Sets this step as the current step within the wizard.
                 */
                setCurrentStep() {
                    scope.currentStepIndex = this.index;
                    scope.currentStep().currentPageIndex = 0;
                    scope.showReviewAndSubmitPage = false;
                }

                /**
                 *  Gets the current page within this step.
                 * @returns {Page}
                 */
                calcCurrentPage() {
                    return this.pages[this.currentPageIndex];
                }

                /**
                 * Creates basic text pages for a normal step.
                 * @returns {Array}
                 */
                createPages() {
                    var newPages = [];
                    if (this.type === 'START') {
                        newPages.push(new StartPage(0));
                    }
                    else if (this.type === 'REVIEW') {
                        newPages.push(new ReviewPage(0));
                    }
                    else if (this.type === 'END') {
                        newPages.push(new EndPage(0));
                    }
                    return newPages;
                }
            }

            /**
             * Question step, inherits from Step.
             * Represents a step that contains a list of questions to answer.
             */
            class QuestionStep extends Step {
                /**
                 * Class constructor.
                 * @param {Int} index
                 * @param {String} name
                 * @param {String} type
                 * @param {Array} questions
                 */
                constructor(index, name, type, questions) {
                    super(index, name, type);
                    this.pages = this.createPages(questions);
                    this.totalQuestions = questions.length;
                }

                /**
                 *  Determines if all questions in all pages for this step are marked as completed.
                 * @returns {Boolean} isvalid
                 */
                get isCompleted() {
                    return this.calcStatus();
                }

                /**
                 * Create the pages for the current step based on our page size and questions provided.
                 * Each page only contains questions for this step, even if the last page does not fill the page size.
                 * ie. if we have seven questions with a page size of two, we'll have 4 pages where the last page only has one question.
                 * @param {Array} questions
                 * @returns {Array}
                 */
                createPages(questions) {
                    if (typeof questions !== "undefined") {
                        var newPages = [],
                            totalPages = Math.ceil(questions.length / scope.pageSize),

                            // index of first question we want to add.
                            startIndex = 0,

                            // index of last question PLUS ONE we want to add (for use with slice).
                            endIndex = startIndex + +scope.pageSize,

                            questionsForPage;

                        for (var i = 0; i < totalPages; i++) {
                            // get the page size number of questions and create the page object.
                            questionsForPage = questions.slice(startIndex, endIndex);
                            if (questionsForPage.length > 0) {
                                newPages.push(new QuestionPage(i, questionsForPage));
                            }
                            else {
                                $log.debug('Something went wrong while finding questions to add to page index ' + this.index);
                            }

                            // shift our indexes.
                            startIndex = endIndex;
                            endIndex += +scope.pageSize;
                        }
                        $log.debug(newPages.length + " pages created for step: " + this.name);
                        return newPages;
                    }
                    else {
                        return [];
                    }
                }

                /**
                 * Determine if all answers have been answered. Returns t/f.
                 * @returns {Boolean}
                 */
                calcStatus() {
                    var isComplete = true,
                        currentpage,
                        unanswered;

                    // Determine if any of our questions have an falsey IsAnswered value or no answer id.
                    for (var i = 0; i < this.pages.length; i++) {
                        currentpage = this.pages[i];
                        unanswered = currentpage.questions.filter(function (q) {
                            return q.selectedAnswerId === null || q.selectedAnswerId <= 0;
                        })
                        if (unanswered.length > 0) {
                            isComplete = false;
                            break;
                        }
                    }
                    return isComplete;
                }
            }

            /**
             * Page class
             * Represents a single page within the wizard.
             */
            class Page {
                /**
                 * Constructor for class.
                 * @param {Int} index
                 */
                constructor(index) {
                    // index within a step.
                    this.index = index;
                }

                /**
                 * Navigate to the previous question.
                 */
                back() {
                    // if we're on the first page of a step, return to the previous step.
                    // otherwise, if we're still navigating within the same step, just update the page number.
                    if (scope.currentStep().currentPageIndex == 0) {
                        scope.currentStepIndex--;
                    }

                    else {
                        scope.currentStep().currentPageIndex--;
                    }
                }

                /**
                 * Navigate to the next question.
                 */
                next() {
                    // if we're still navigating within the same step, just update the page number.
                    // otherwise, move to the next step.
                    const pageIndex = scope.currentStep().currentPageIndex,
                        lastPageIndex = scope.currentStep().pages.length - 1;
                    if (pageIndex < lastPageIndex) {
                        scope.currentStep().currentPageIndex++;
                    }

                    else {
                        scope.currentStepIndex++;

                        // foce start at the beginning of the step.
                        scope.currentStep().currentPageIndex = 0;
                    }
                }

                /**
                 * Cancel the entire assessment. Add items here if we needed to do any cleanup on this page before exiting.
                 */
                cancel() {
                    cancel();
                }

                /**
                 * Save and exit the entire assessment. Add items here if we needed to any cleanup on this page before exiting.
                 */
                saveAndExit() {
                    saveAndExit();
                }

                /**
                 * Text description of where we are in the step.
                 * @returns {String}
                 */
                get navigationStatus() {
                    return "";
                }

                /**
                 * Create our navigation buttons based on what we want the user to be able to do at this step.
                 * Navigation buttons are split on the left and right sides of the wizard.
                 * @returns {Array}
                 */
                createNavigation() {
                    var nav = {
                        left: [],
                        right: []
                    };
                    this.navigation = nav;
                    return nav;
                }
            }

            /**
             * First page, inherits from Page.
             * First page of the wizard, if desired.
             * This could contain information about the wizard's content, instructions, etc.
             */
            class StartPage extends Page {
                /**
                 * Class constructor.
                 * @param {Int} index
                 */
                constructor(index) {
                    super(index);
                }

                /**
                 * Create our navigation buttons based on what we want the user to be able to do at this step.
                 */
                createNavigation() {
                    var nav = super.createNavigation();
                    nav.right.push(new NavButton('Continue', this.next, true, true));
                    this.navigation = nav;
                }
            }

            /**
             * Question Page inherits from Page
             * Represents a page built up of questions as content.
             */
            class QuestionPage extends Page {
                /**
                 * Class constructor.
                 * @param {Int} index
                 * @param {Array} questions
                 */
                constructor(index, questions) {
                    super(index);
                    this.questions = questions;
                }

                /**
                 * Get the first question's number.
                 * Display version of the index, 1 based.
                 * @returns {Int}
                 */
                get lowerIndex() {
                    // question order is zero based.
                    return this.questions[0].questionOrder + 1;
                }

                /**
                 * Determine if this is the first question of the entire wizard. Prevents using the back button currently,
                 * but this is NOT hooked up to work with a StartPage yet.
                 * @returns {Boolean}
                 */
                get isFirstQuestionOfWizard() {
                    if (typeof scope.currentStep() !== "undefined") {
                        // todo: filter to type of question step.
                        const stepIndex = scope.currentStepIndex,
                              pageIndex = scope.currentStep().currentPageIndex;
                        return stepIndex == 0 && pageIndex === 0;
                    }
                    else {
                        return false;
                    }
                }

                /**
                 * Get the last question's number.
                 * Display version of the index, 1 based.
                 * @returns {Int}
                 */
                get upperIndex() {
                    // question order is zero based.
                    return this.questions.slice(-1)[0].questionOrder + 1;
                }

                /**
                 * Textual description of where we are within the step.
                 * @returns {String}
                 */
                get navigationStatus() {
                    if (this.lowerIndex === this.upperIndex) {
                        return "Question " + this.lowerIndex + " of " + scope.currentStep().totalQuestions;
                    }
                    else {
                        return "Questions " + this.lowerIndex + " - " +
                            this.upperIndex + " of " + scope.currentStep().totalQuestions;
                    }
                }

                /**
                 * Allow user to navigate between question pages.
                 */
                createNavigation() {
                    var nav = super.createNavigation();
                    nav.left.push(
                        new NavButton('Back', this.back, !this.isFirstQuestionOfWizard, false, 0));
                    nav.left.push(
                        new NavButton('Cancel', this.cancel, true, false, 1));
                    nav.right.push(
                        new NavButton('Continue', this.next, true, false, 1));
                    nav.right.push(
                        new NavButton('Save and Exit', this.saveAndExit, true, false, 0));

                    this.navigation = nav;
                }
            }

            /**
             * Review Page, inherits from Page
             * Review and confirm page of the wizard.
             * Instructs the user on their final instructions of the wizard.
             */
            class ReviewPage extends Page {
                /**
                 * Class constructor.
                 * @param {Int} index
                 */
                constructor(index) {
                    super(index);
                }

                /**
                 * Determines if the entire wizard is valid. Prevents submission of the form.
                 * @returns {Boolean}
                 */
                get isValid() {
                    // If there are any incomplete steps, the form is invalid.
                    return scope.steps.filter(function (s) {
                        return s.type === 'QUESTION' && s.isCompleted === false;
                    }).length === 0;
                }

                /**
                 * Get text context to provide instructions to the user.
                 * Context depends on validity of form.
                 * @returns {String}
                 */
                get content() {
                    var paragraphs = [];
                    if (this.isValid === true) {
                        paragraphs.push("You have now provided responses to all questions for this assessment. At this point, you may click the \"Review/Change Responses\" button to change any of your responses.");
                        paragraphs.push("If you are satisfied with your answers, you may click the \"Submit Assessment\" button to submit your final answers.");
                    }
                    else {
                        paragraphs.push("You have not answered all of the questions in the assessment. Please select one answer for every question.");
                        paragraphs.push("The incomplete steps are indicated above in the progress tracker. Click the incomplete steps to complete the assessment.");
                    }
                    return paragraphs;
                }

                /**
                 * Allow user to return to questions, save, or submit at this page.
                 */
                createNavigation() {
                    var nav = super.createNavigation();
                    nav.left.push(new NavButton('Review/Change Responses', this.back, true, false, 0));
                    nav.right.push(new NavButton('Submit Assessment', scope.submitAndEnd, true, !this.isValid, 1));
                    nav.right.push(new NavButton('Save and Exit', saveAndExit, true, false, 0));

                    this.navigation = nav;
                }
            }

            /**
             * The last page of the wizard.
             * Used to provide the next available steps to the user after the wizard is complete.
             */
            class EndPage extends Page {
                /**
                 * Class constructor.
                 * @param {Int} index
                 * @param {String} type
                 */
                constructor(index, type) {
                    super(index, type);
                }

                /**
                 * Get text context to provide instructions to the user.
                 * @returns {String}
                 */
                get content() {
                    var paragraphs = [];

                    paragraphs.push("Your responses for the " + scope.title + " have been submitted.");

                    return paragraphs;
                }

                /**
                 * Allow user to only go to the assessments page at this point.
                 */
                createNavigation() {
                    var nav = {
                        left: [],
                        right: []
                    };
                    nav.right.push(new NavButton('Review Results', scope.review, true, false, 0));

                    this.navigation = nav;
                }
            }

            /**
             * Nav Button class.
             * Builds out the available navigation options.
             * Enabled/disable and show/hide based on step or page statuses.
             */
            class NavButton {
                /**
                 * Class constructor.
                 * @param {String} text
                 * @param {Function} func
                 * @param {Boolean} enabled
                 * @param {Boolean} hidden
                 * @param {Int} order
                 */
                constructor(text, func, enabled, hidden, order) {
                    this.text = text;
                    this.func = func;
                    this.enabled = enabled;
                    this.hidden = hidden;
                    this.order = order;
                }
            }

            /**
             * Create all of our pages for each category.
             */
            function configurePages() {
                // could move a lot of this logic into the controller to make this directive
                // more reusable. Consider for later and different types of assessments.

                // Create start page.
                // NA - we don't have one for now. Will need to alter starting index for questions.

                // group questions by category name.
                let grouped = scope.questions.group(question => question.categoryName),

                // grouped will look like [ { key: 'catname', data: [ ...cats... ] }, .. ]
                // take each group and create a new step from it.
                    stepIndex = 0;
                scope.steps = grouped.map(function (group, index) {
                    return new QuestionStep((stepIndex + index),
                        group.key,
                        'QUESTION',
                        group.data);
                });

                // Create review page.
                scope.steps.push(
                    new Step((scope.steps.length - 1), 'Review', 'REVIEW')
                );

                // Create end page.
                scope.steps.push(
                    new Step((scope.steps.length - 1), 'End', 'END')
                );

                // Start us off at the first step.
                scope.currentStepIndex = 0;

                // Let the UI know we have everything we need.
                scope.loaded = true;
            }
        }
    }
})();
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
(function () {
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
(function () {
    'use strict';

    angular
        .module('app.playbook')
        .controller('CommitmentController', CommitmentController);

    CommitmentController.$inject = ['playbookDataService', '$log', '$timeout', '$q', '$rootScope', '$scope', '$moment'];

    /**
     * Controller responsible for all actions related to taking and reviewing an assessment.
     * @param {playbookDataService} playbookDataService
     * @param {$log} $log
     * @param {$timeout} $timeout
     * @param {$q} $q
     * @param {$rootScope} $rootScope
     * @param {$scope} $scope local scope
     * @param {$moment} $moment momentjs library
     */
    function CommitmentController(playbookDataService, $log, $timeout, $q, $rootScope,
                                    $scope, $moment) {
        var vm = this;

        // Indication if the data has loaded for the UI.
        vm.loaded = false;

        // Info message regarding commitments only.
        vm.info = null;

        // Error message.
        vm.error = null;

        // Formatted categories that a commitment can relate to.
        // Includes child questions.
        vm.categories = [];

        // Playbook id that all commitments here belong to.
        vm.playbookId = null;

        // All commitments for the playbook.
        vm.commitments = [];

        // Restrict fields if the user doesnt' own the playbook.
        vm.canEditPlaybook = false; 1

        // Shows/hides suggestions for commitments based on results.
        vm.enableSuggestions = true;

        // Form object for adding and editing a commitment.
        vm.form = {
            // Modal title.
            title: null,

            // Method to call when modal save button is invoked.
            onSave: null,

            // Method to call when modal cancel/close button is invoked.
            onClose: null,

            // Indication if form has been submitted. Shows validation errors when true.
            submitted: false,

            // Indication if form modal should be displayed.
            show: false,

            // Form data based on commitment.
            data: {
                category: null,
                question: null,
                name: null,
                description: null,
                status: null,
                dueDate: null,
                id: null
            }
        };

        // Available statuses for commitments.
        vm.statuses = [
            {
                display: 'In-progress',
                value: 'IN_PROGRESS'
            },
            {
                display: 'Implemented',
                value: 'IMPLEMENTED'
            },
            {
                display: 'Planned',
                value: 'PLANNED'
            }
        ];

        // Methods.
        vm.showAddCommitmentForm = showAddCommitmentForm;
        vm.add = add;
        vm.showEditCommitmentForm = showEditCommitmentForm;
        vm.update = update;
        vm.remove = remove;
        vm.setFormCategoryId = setFormCategoryId;
        vm.setFormQuestionId = setFormQuestionId;
        vm.setFormStatusValue = setFormStatusValue;
        vm.setFormDueDateValue = setFormDueDateValue;
        vm.activate = activate;

        /**
         * Category Object.
         */
        class Category {
            /**
             * Creates a new Category.
             * @param {Int} id
             * @param {String} name
             * @param {Double} score
             * @param {Array} questions
             */
            constructor(id, name, score, questions) {
                var that = this;
                that.id = id;
                that.name = name;
                that.score = score;
                that.questions = questions.map(function (q) {
                    return new Question(q.questionId,
                                        q.questionText,
                                        q.answers,
                                        q.selectedAnswerId);
                });
            }

            /**
             * Builds the text to show in the dropdown when selecting a category for a commitment.
             * Accounts for whether suggestions are enabled.
             * @returns {String}
             */
            get optionText() {
                if (vm.enableSuggestions === true) {
                    return this.name + ' (' + Math.round(+this.score * 100, 0) + '%)';
                }
                else {
                    return this.name;
                }
            }

            /**
            * Determines if the user should create commitments for this category based on:
            * Didn't answer the best answers for all questions within the category and doesn't have ANY commitments.
            * @returns {Boolean}
            */
            get needsCommitments() {
                return this.couldBeImproved();
            }

            /**
            * Gets the list of commitments directly linked to this category.
            * @returns {Array}
            */
            getCommitments() {
                var categoryId = this.id;
                return vm.commitments.filter(function (c) {
                    return c.categoryId === categoryId;
                })
            }

            /**
             * Determines if the user could make imrpovements to the category based on their responses.
             * Could later determine the percentage of questions that have commitments within the category.
             * @returns {Boolean}
             */
            couldBeImproved() {
                return this.getCommitments().length === 0 && !isNaN(this.score) && this.score < 1.0;
            }
        }

        /**
         * Question object.
         */
        class Question {
            /**
             * Creates a new instance of a Question.
             * @param {Int} id
             * @param {String} text
             * @param {Array} answers
             * @param {Int} selectedAnswerId
             */
            constructor(id, text, answers, selectedAnswerId) {
                var that = this;
                that.id = id;
                that.text = text;
                that.answers = answers;
                that.selectedAnswerId = selectedAnswerId;
            }

            /**
             * Very hacky, unstable way to get the best answer. Assumes it's
             * ordered correctly and its the second to last answer. Not last because that is NA.
             */
            get bestAnswer() {
                return this.answers[this.answers.length - 2];
            }

            /**
             * Gets the answer object that was selected during the assessment.
             * @returns {Object}
             */
            get selectedAnswer() {
                var selected = this.selectedAnswerId;
                return this.answers.find(function (a) {
                    return a.id === selected;
                });
            }

            /**
             * Builds the text to show in the dropdown when selecting a question for a commitment.
             * Accounts for whether suggestions are enabled.
             * @returns {String}
             */
            get optionText() {
                if (vm.enableSuggestions === true && this.needsCommitment()) {
                    return this.text + ' *';
                }
                else {
                    return this.text;
                }
            }

            /**
             * Gets the list of commitments directly linked to this question.
             * @returns {Array}
             */
            getCommitments() {
                var questionId = this.id;
                return vm.commitments.filter(function (c) {
                    return c.questionId === questionId;
                });
            }

            /**
             * Determines if the user should create a commitment for this question based on:
             * Didn't select the best answer and doesn't have a commitment directly linked to it.
             * @returns {Boolean}
             */
            needsCommitment() {
                return this.getCommitments().length === 0 &&
                    this.selectedAnswer.id !== this.bestAnswer.id &&
                    this.selectedAnswer.text.toLowerCase() !== "not applicable";
            }
        }

        activate();

        /**
         * Initializes the controller.
         */
        function activate() {
            vm.form.show = false;
            let playbookController = $scope.pc,
                playbook = playbookController.current.details;
            changePlaybook(playbook);
        }

        /**
         * Sets up all commitment data for the playbook.
         * @param {Object} playbook
         */
        function changePlaybook(playbook) {
            vm.playbookId = playbook.id;

            if (typeof playbook.commitments !== "undefined") {
                vm.commitments = playbook.commitments;
                vm.canEditPlaybook = playbook.isOwnedByMe &&
                                     playbook.isArchived === false &&
                                     $scope.pc.current.mode === $scope.pc.modes.edit;
            }

            if (typeof playbook.teamAssessment !== "undefined") {
                vm.categories = getCategoryList(playbook.teamAssessment);
            }

            vm.loaded = true;
        }

        /**
         * Watches for changes to the current playbook and setsup commitment data for it.
         * @param {Object} newValue
         * @param {Object} oldValue
         * @param {$scope} scope)
         */
        $scope.$watch('pc.current.details.id', function (newValue, oldValue, scope) {
            if (newValue !== oldValue) {
                var playbook = $scope.pc.current.details;
                changePlaybook(playbook);
            }
        });

        /**
         * Saves off the category id and name separately.
         * @param {Object} category
         */
        function setFormCategoryId(category) {
            vm.form.data.categoryId = category.id;
            vm.form.data.categoryName = category.name;
        }

        /**
         * Saves off the question id separately.
         * @param {Object} question
         */
        function setFormQuestionId(question) {
            if (question !== null) {
                vm.form.data.questionId = question.id;
            }
        }

        /**
         * Saves off the status id separately.
         * @param {Object} status
         */
        function setFormStatusValue(status) {
            vm.form.data.status = status.value;
        }

        /**
         * Sets the model due date to the utc version of the ui, local date selected by the user.
         * @param {String} date
         */
        function setFormDueDateValue(date) {
            var d = new Date(date);
            vm.form.data.dueDate = $moment.utc(d).toISOString();
        }

        /**
         * Sets the category list.
         * @param {Object} teamAssessment
         * @returns {Array} category list
         */
        function getCategoryList(teamAssessment) {
            var categories = teamAssessment.categoryResults.map(function (category) {
                // Get questions for the category.
                var questionList = teamAssessment.questions.filter(function (response) {
                    return response.categoryName === category.name;
                });

                return new Category(category.categoryId,
                                    category.name,
                                    category.score,
                                    questionList);
            });
            return categories;
        }

        /**
         * Shows the add commitment dialog form.
         */
        function showAddCommitmentForm() {
            vm.form.data = {
                category: null,
                question: null,
                name: null,
                description: null,
                status: null,
                dueDate: null
            };
            vm.form.title = "Add Commitment";
            vm.form.onSave = vm.add;
            vm.form.onClose = vm.form.show = false;

            vm.form.show = true;
        }

        /**
         * Adds a new commitment to the playbook.
         */
        function add() {
            vm.error = null;
            vm.form.submitted = true;

            // Show validation messages if needed.
            if (!vm.form.$valid) {
                return;
            }

            // Save and show feedback to the user.
            playbookDataService.createCommitmentForPlaybook(vm.playbookId, vm.form.data)
                .then(function (data) {
                    vm.info = "Commitment created successfully";
                    $timeout(function () {
                        vm.info = null;
                    }, 2000);

                    // Update cat name of the commitment since it's not returned.
                    data.categoryName = vm.form.data.categoryName;
                    vm.commitments.push(data);
                })
                .catch(function () {
                    vm.error = "Failed to create commitment.";
                })
                .finally(function () {
                    vm.form.submitted = false;
                    vm.form.show = false;
                    vm.form.data = {};
                });
        };

        /**
         * Shows the edit commitment form
         * @param {type} commitment
         */
        function showEditCommitmentForm(commitment) {
            vm.form.data = {
                category: vm.categories.find(function (c) { return c.id === commitment.categoryId; }),
                categoryId: commitment.categoryId,
                categoryName: commitment.name,
                questionId: commitment.questionId,
                name: commitment.name,
                description: commitment.description,
                statusObj: vm.statuses.find(function (s) { return s.value === commitment.status }),
                status: commitment.status,
                dueDate: $moment.utc(new Date(commitment.dueDate)),
                id: commitment.id
            };

            // find question based on category.
            vm.form.data.question = vm.form.data.category.questions.find(function (q) { return q.id === commitment.questionId });

            // format utc date to local.
            var d = new Date(commitment.dueDate);
            vm.form.data.dueDateLocal = $moment(d).local().format('MM-DD-YYYY');

            vm.form.title = "Edit Commitment";
            vm.form.onSave = vm.update;
            vm.form.onClose = vm.form.show = false;

            vm.form.show = true;
        }

        /**
         * Saves updates to an existing commitment.
         */
        function update() {
            vm.error = null;
            vm.form.submitted = true;

            // Show validation messages if needed.
            if (!vm.form.$valid) {
                return;
            }

            // Save and show feedback to the user.
            playbookDataService.updateCommitment(vm.playbookId, vm.form.data)
                .then(function (data) {
                    vm.info = "Commitment saved successfully";
                    $timeout(function () {
                        vm.info = null;
                    }, 2000);

                    // Update view with saved data.
                    var c = vm.commitments.find(function (c) { return c.id === data.id });
                    c.id = data.id;
                    c.categoryId = data.categoryId;
                    c.categoryName = vm.form.data.category.name;
                    c.created = data.created;
                    c.description = data.description;
                    c.dueDate = data.dueDate;
                    c.name = data.name;
                    c.questionId = data.questionId;
                    c.status = data.status;
                })
                .catch(function () {
                    vm.error = "Failed to save commitment.";
                })
                .finally(function () {
                    vm.form.submitted = false;
                    vm.form.data = {};
                    vm.form.show = false;
                });
        };

        /**
         * Deletes the given commitment.
         * @param {Object} commitment
         * @returns {Promise}
         */
        function remove(commitment) {
            vm.error = null;
            var deferred = $q.defer();
            playbookDataService.deleteCommitment(vm.playbookId, commitment.id)
                    .then(function () {
                        // Show feedback to the user.
                        vm.info = "Commitment deleted successfully";
                        $timeout(function () {
                            vm.info = null;
                        }, 2000);

                        // Remove from view.
                        vm.commitments.splice(vm.commitments.findIndex(function (c) { return c.id === commitment.id; }), 1);

                        // Resolve the promise;
                        deferred.resolve();
                    })
                    .catch(function () {
                        vm.error = "Failed to delete commitment.";
                        deferred.reject();
                    });
            return deferred.promise;
        };
    }
})();
(function () {
    'use strict';

    angular
        .module('app.playbook')
        .directive('pbCommitment', Commmitment);

    Commmitment.$inject = ['$log', 'playbookDataService', '$timeout'];

    /**
     * Directive for status/progress visualization within wizard.
     * @param {$log} $log
     * @param {playbookDataService} playbookDataService
     * @param {$timeout} $timeout
     * @returns {Object}
     */
    function Commmitment($log, playbookDataService, $timeout) {
        var directive = {
            link: link,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'app/playbook/commitment/partials/list.table.html';
            },
            restrict: 'A',
            scope: {
                commitment: '=',
                playbookId: '@'
            },
            require: '^ngController'
        };
        return directive;

        /**
         * Link function
         * @param {Object} scope
         * @param {Array} element
         * @param {Array} attrs
         * @param {Object} ctrl
         */
        function link(scope, element, attrs, ctrl) {
            // Methods.
            scope.showDeleteModal = false;
            scope.remove = remove;
            scope.cancelRemove = cancelRemove;
            scope.confirmRemove = confirmRemove;
            scope.edit = edit;
            scope.getStatusDisplayName = getStatusDisplayName;

            scope.canEdit = ctrl.canEditPlaybook;

            /**
             * Gets the display name for the status given the status value.
             * @param {String} status
             * @returns {String}
             */
            function getStatusDisplayName(status) {
                var statusObj = ctrl.statuses.find(function (s) {
                    return s.value === status;
                });
                return statusObj.display;
            }

            /**
             * Show confirmation modal.
             */
            function remove() {
                scope.showDeleteModal = true;
            };

            /**
             * Closes the delete modal.
             */
            function cancelRemove() {
                scope.showDeleteModal = false;
            };

            /**
             * Deletes this commitment.
             */
            function confirmRemove() {
                ctrl.remove(scope.commitment)
                    .then(function (response) {
                        scope.commitment = null;
                    })
                    .finally(function () {
                        scope.showDeleteModal = false;
                    });
            };

            /**
             * Make the fields editable.
             */
            function edit() {
                // Update view.
                ctrl.showEditCommitmentForm(scope.commitment);
            };
        }
    }
})();
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
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emAccordian', accordianItem);

    function accordianItem() {
        var directive = {
            scope: {
                title: '@',
                isOpen: '='
            },
            transclude: true,
            replace: true,
            restrict: 'A',
            templateUrl: 'app/unity-angular/accordian/accordian.item.html',
            link: link
        };
        return directive;

        //////////////////////

        function link(scope, element, attrs) {
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emBadge', badge);

    //badge.$inject = [];

    function badge() {
        var directive = {
            scope: {
                //
            },
            transclude: true,
            replace: true,
            restrict: 'E',
            link: link,
            templateUrl: 'app/unity-angular/badge/badge.html'
        };
        return directive;

        //////////////////////

        function link(scope, element, attrs) {
            scope.vm = {
                positive: attrs.hasOwnProperty('positive'),
                negative: attrs.hasOwnProperty('negative'),
                caution: attrs.hasOwnProperty('caution')
            };
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .factory('emColors', emColorsService);

    //emColorsService.$inject = [];

    function emColorsService() {
        let service = {
            amber: '#f2ac33',
            blue: '#0c69b0',
            burgundy: '#ad1723',
            cerise: '#a71065',
            curiousBlue: '#3190d9',
            cyan: '#00a3e0',
            darkBlue: '#233190',
            deepBlue: '#111122',
            green: '#00af53',
            indigo: '#002f6c',
            lime: '#b4d405',
            mediumGray: '#545459',
            orange: '#ed8b00',
            plum: '#890c58',
            purple: '#7a4183',
            red: '#d82424',
            ruby: '#b10040',
            seaBlue: '#005f7f',
            turquoise: '#00aca8',
            vermilion: '#d93900',
            violet: '#3a397b',
            yellow: '#ffd700'
        };

        return service;
    };
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emDatePicker', datePicker);

    datePicker.$inject = ['emFieldService'];

    function datePicker(emFieldService) {
        var directive = {
            scope: {
                name: '@',
                model: '=',
                minDate: '@',
                maxDate: '@',
                dateFormat: '@',
                showIcon: '@',
                onSelect: '&'
            },
            restrict: 'E',
            require: '^^?emField',
            link: link,
            templateUrl: 'app/unity-angular/date-picker/date-picker.html',
            controller: emDatePicker,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        //////////////////////
        function emDatePicker($scope) {
        }
        function link(scope, element, attrs, fieldCtrl) {
            emFieldService.setIconWatch(scope, attrs, fieldCtrl);

            // Show calendar icon only when not showing another
            //scope.vm.showIcon = !fieldCtrl.error
            //                 && !fieldCtrl.readonly
            //                 && !fieldCtrl.disabled;

            scope.vm.showIcon = scope.showIcon || true;
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emExpandableButton', expandableButton);

    //expandableButton.$inject = [];

    function expandableButton() {
        var directive = {
            link: link,
            restrict: 'E',
            require: '^^?emFieldGroup',
            replace: true,
            transclude: true,
            scope: {
                label: '@',
                activeLabel: '@',
                isActive: '=?active'
                // plusIcon
                // small
                // primary
            },
            templateUrl: 'app/unity-angular/expandable-button/expandable-button.html',
            controller: emExpandableButton,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        //////////////////////////////////

        function emExpandableButton() {
            var vm = this;

            // Default isActive
            if (vm.isActive === undefined)
                vm.isActive = false;
        }

        function link(scope, element, attrs) {
            scope.vm.plusIcon = attrs.hasOwnProperty('plusIcon');
            scope.vm.small = attrs.hasOwnProperty('small');
            scope.vm.primary = attrs.hasOwnProperty('primary');
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emFieldBody', fieldBody);

    //fieldBody.$inject = [];

    function fieldBody() {
        var directive = {
            link: link,
            restrict: 'E',
            require: '^^emField',
            replace: true,
            scope: {
                //
            },
            transclude: true,
            templateUrl: 'app/unity-angular/field/field-body.html'
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, fieldCtrl) {
            // Inherit controller as 'vm' (but not as prototype so it's the same object)
            scope.vm = fieldCtrl;
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emFieldGroup', fieldGroup);

    //fieldGroup.$inject = [];

    function fieldGroup() {
        var directive = {
            link: link,
            controller: emFieldGroup,
            controllerAs: 'vm',
            bindToController: true,
            restrict: 'E',
            scope: {
                valid: '=?',
                error: '=?',
                readonly: '=?',
                disabled: '=?'
            }
        };
        return directive;

        //////////////////////////////////

        function emFieldGroup() {
            let vm = this;
        }

        function link(scope, element, attrs) {
            //
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emFieldMessages', fieldMessages);

    //fieldMessages.$inject = [];

    function fieldMessages() {
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                'for': '@'
            },
            require: ['^^form', '^^?emField'],
            replace: true,
            templateUrl: 'app/unity-angular/field/field-messages.html'
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, ctrls) {
            let formCtrl = ctrls[0];
            let fieldCtrl = ctrls[1];

            if (!attrs.for)
                throw new Error('em-field-messages: attribute "for" is required');

            let vm = scope.vm = {
                // Expose the form.name model
                model: formCtrl[attrs.for],
                // Expose the emField Controller
                field: fieldCtrl,
                // Set the attributes existance as booleans for the vm
                required: attrs.messages.includes('required'),
                number: attrs.messages.includes('number'),
                min: attrs.messages.includes('min'),
                minlength: attrs.messages.includes('minlength'),
                maxlength: attrs.messages.includes('maxlength'),
                unique: attrs.messages.includes('unique')
            };
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emFieldNote', fieldNote);

    //fieldNote.$inject = [];

    function fieldNote() {
        var directive = {
            link: link,
            restrict: 'E',
            require: '^^?emField',
            replace: true,
            scope: {
                //
            }
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs) {
            element.addClass('em-c-field__note');
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emField', field);

    field.$inject = ['emFieldService'];

    function field(emFieldService) {
        var directive = {
            link: link,
            restrict: 'E',
            require: '^^?emFieldGroup',
            replace: true,
            transclude: true,
            scope: {
                valid: '=?',
                error: '=?',
                readonly: '=?',
                disabled: '=?'
            },
            templateUrl: 'app/unity-angular/field/field.html',
            controller: emField,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        //////////////////////////////////

        function emField() {
            //
        }

        function link(scope, element, attrs, fieldGroupCtrl) {
            // Watch for each attribute change on emFieldGroup if undefined on emField
            emFieldService.setFieldWatch(scope, attrs, fieldGroupCtrl);
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .factory('emFieldService', emFieldService);

    //emFieldService.$inject = [];

    function emFieldService() {
        let service = {
            setFieldWatch: setFieldWatch,
            setInputWatch: setInputWatch,
            setIconWatch: setIconWatch
        };

        return service;

        /////////////

        function setFieldWatch(scope, attrs, fieldGroupCtrl) {
            setWatch(
                scope,
                fieldGroupCtrl,
                'fieldGroupCtrl',
                attrs,
                ['valid', 'error', 'readonly', 'disabled'], // order may matter
                function (val, attr) {
                    scope.vm[attr] = val;
                });
        }

        function setInputWatch(scope, element, attrs, fieldCtrl) {
            setWatch(
                scope,
                fieldCtrl,
                'fieldCtrl',
                attrs,
                ['disabled', 'readonly'], // order may matter
                function (val) {
                    element.attr({
                        disabled: fieldCtrl.disabled || fieldCtrl.readonly
                    });
                });
        }

        function setIconWatch(scope, attrs, fieldCtrl) {
            setWatch(
                scope,
                fieldCtrl,
                'fieldCtrl',
                attrs,
                ['error', 'readonly', 'disabled'], // order may matter
                function (val, attr) {
                    scope.vm.showIcon = !fieldCtrl.error
                                     && !fieldCtrl.readonly
                                     && !fieldCtrl.disabled;
                });
        }

        function setWatch(scope, parentCtrl, parentCtrlName, elementAttributes, watchAttributes, watchCallback) {
            if (!angular.isObject(scope))
                throw new TypeError('emField: scope must be an object');
            if (!(parentCtrl === null || angular.isObject(parentCtrl)))
                throw new TypeError('emField: parentCtrl must be an object');
            if (!angular.isString(parentCtrlName))
                throw new TypeError('emField: parentCtrlName must be a string');
            if (!angular.isObject(elementAttributes))
                throw new TypeError('emField: elementAttributes must be an object');
            if (!angular.isArray(watchAttributes))
                throw new TypeError('emField: watchAttributes must be an array');
            if (!angular.isFunction(watchCallback))
                throw new TypeError('emField: watchCallback must be a function');

            if (parentCtrl) {
                // Store the parent controller
                scope[parentCtrlName] = parentCtrl;

                // Watch for each attribute change on parent required directive's controller
                angular.forEach(watchAttributes, function (attr) {
                    // Only set watch if undefined on emField
                    if (!elementAttributes.hasOwnProperty(attr))
                        scope.$watch(parentCtrlName + '.' + attr, function (val) {
                            watchCallback.call(this, val, attr);
                        });
                });
            }
        }
    };
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('input', input);

    input.$inject = ['emFieldService'];

    function input(emFieldService) {
        var directive = {
            link: link,
            restrict: 'E',
            require: ['^^?emField', '^^?emToggle', '^^?emDatePicker']
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, ctrls) {
            let fieldCtrl = ctrls[0];
            let toggleCtrl = ctrls[1];
            let datePickerCtrl = ctrls[2];

            element.addClass('em-c-input');

            // Classes depending on inherited controller
            if (toggleCtrl)
                element.addClass('em-c-toggle__input em-u-is-vishidden');
            else if (datePickerCtrl)
                new Pikaday({
                    field: element[0],
                    format: datePickerCtrl.dateFormat || 'MM-DD-YYYY',
                    minDate: datePickerCtrl.minDate || new Date(),
                    maxDate: datePickerCtrl.maxDate || new Date().setYear(new Date().getYear() + 2),

                    onSelect: datePickerCtrl.onSelect
                });

            // Watch for each attribute change on emField if undefined on input
            emFieldService.setInputWatch(scope, element, attrs, fieldCtrl);
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('label', label);

    //label.$inject = [];

    function label() {
        var directive = {
            link: link,
            restrict: 'E',
            require: ['^^?emField', '^^?emToggle'],
            scope: {
                //
            }
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, ctrls) {
            let fieldCtrl = ctrls[0];
            let toggleCtrl = ctrls[1];

            if (toggleCtrl)
                element.addClass('em-c-toggle__label');
            else if (fieldCtrl)
                element.addClass('em-c-field__label');
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('select', select);

    select.$inject = ['emFieldService'];

    function select(emFieldService) {
        var directive = {
            link: link,
            restrict: 'E',
            require: '^^?emField'
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, fieldCtrl) {
            element.addClass('em-c-select');

            if (fieldCtrl !== null) {
                fieldCtrl.hasIcon = true;
            }

            // Watch for each attribute change on emField if undefined on select
            emFieldService.setInputWatch(scope, element, attrs, fieldCtrl);
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('textarea', textarea);

    textarea.$inject = ['emFieldService'];

    function textarea(emFieldService) {
        var directive = {
            link: link,
            restrict: 'E',
            require: '^^?emField'
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, fieldCtrl) {
            element.addClass('em-c-select');

            // Watch for each attribute change on emField if undefined on textarea
            emFieldService.setInputWatch(scope, element, attrs, fieldCtrl);
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emToggle', toggle);

    //toggle.$inject = [];

    function toggle() {
        var directive = {
            link: link,
            restrict: 'E',
            require: '^^?emField',
            scope: {
                //
            },
            controller: emToggle,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        //////////////////////////////////

        function emToggle() {
            //
        }

        function link(scope, element, attrs, fieldCtrl) {
            element.addClass('em-c-toggle');
            fieldCtrl.hasIcon = true;
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emFooterLink', footerLink);

    //footerLink.$inject = [];

    function footerLink() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/footer/footer-link.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                href: '@'
            }
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs) {
            //
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emFooterLinks', footerLinks);

    //footerLinks.$inject = [];

    function footerLinks() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/footer/footer-links.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                type: '@'
            },
            controller: emFooterLinks,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        //////////////////////////////////

        function emFooterLinks() {
            //
        }

        function link(scope, element, attrs) {
            //
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emFooter', footer);

    //footer.$inject = [];

    function footer() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/footer/footer.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                //
            }
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs) {
            //
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emIcon', icon);

    icon.$inject = ['emIconService'];

    function icon(emIconService) {
        var directive = {
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: 'app/unity-angular/icon/icon.html',
            scope: {
                src: '@',
                icon: '@is'
            },
            require: ['^^?emField', '^^?emTable']
        };
        return directive;

        /////////////////

        function link(scope, element, attrs, ctrls) {
            var fieldCtrl = ctrls[0];
            var tableCtrl = ctrls[1];

            scope.vm = {
                icon: scope.icon,
                href: (scope.src || 'images') + '/em-icons.svg#icon-' + scope.icon,
                isSmall: attrs.hasOwnProperty('small'),
                isField: !!fieldCtrl,
                isTable: !!tableCtrl
            };

            emIconService.run();
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .factory('emIconService', emIconService);

    emIconService.$inject = ['$timeout', 'svg4everybody'];

    function emIconService($timeout, svg4everybody) {
        var timeout = $timeout();

        let service = {
            run: run
        };

        return service;

        /////////////

        function run() {
            // Prevents multiple calls per $digest
            $timeout.cancel(timeout);

            timeout = $timeout(svg4everybody, 50);
        }
    };
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emLoader', loader);

    loader.$inject = [];

    function loader() {
        var directive = {
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: 'app/unity-angular/loader/loader.html',
            scope: {
                size: '@',
                type: '@',
                // absolute     <--
                // center       <-- those affect css only
                // middle       <--
            }
        };
        return directive;

        /////////////////

        function link(scope, element, attrs) {
            // Default size
            if (!scope.size)
                scope.size = '50px';

            // Apply size
            element.css({
                height: scope.size,
                width: scope.size
            });
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emLoaderOverlay', loaderOverlay);

    loaderOverlay.$inject = [];

    function loaderOverlay() {
        var directive = {
            link: link,
            restrict: 'C'
        };
        return directive;

        /////////////////

        function link(scope, element, attrs) {
            // prevent clicking on anything.
            //element.bind('click', function ($event) {
            //    $event.preventDefault();
            //});
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emLogo', logo);

    //logo.$inject = [];

    function logo() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/logo/logo.html',
            restrict: 'E',
            replace: true,
            scope: {
                //
            }
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs) {
            //
        }
    }
})();
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
                    catch (e) {
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
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .factory('cellService', cellService);

    //cellService.$inject = [];

    function cellService() {
        let service = {
            mapAttributes: mapAttributes
        };

        return service;

        ///////////////////////

        function mapAttributes(element, attrs, tableCtrl) {
            // Vertical-align
            if (tableCtrl.middle || attrs.hasOwnProperty('middle'))
                element.css('vertical-align', 'middle');

            // Text-align
            if (tableCtrl.center || attrs.hasOwnProperty('center'))
                element.addClass('em-u-text-align-center');
            else if (tableCtrl.left || attrs.hasOwnProperty('left'))
                element.addClass('em-u-text-align-left');
            else if (tableCtrl.right || attrs.hasOwnProperty('right'))
                element.addClass('em-u-text-align-right');
        }
    };
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTableBody', tableObjectBody);

    //tableObjectBody.$inject = [];

    function tableObjectBody() {
        var directive = {
            transclude: true,
            replace: true,
            restrict: 'E',
            link: link,
            templateUrl: 'app/unity-angular/table/table-object-body.html',
        };
        return directive;

        //////////////////////

        function link(scope, element, attrs) {
            //
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTableFooter', tableObjectFooter);

    //tableObjectFooter.$inject = [];

    function tableObjectFooter() {
        var directive = {
            transclude: true,
            replace: true,
            restrict: 'E',
            link: link,
            templateUrl: 'app/unity-angular/table/table-object-footer.html',
        };
        return directive;

        //////////////////////

        function link(scope, element, attrs) {
            //
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTableHeader', tableObjectHeader);

    //tableObjectHeader.$inject = [];

    function tableObjectHeader() {
        var directive = {
            transclude: true,
            replace: true,
            restrict: 'E',
            link: link,
            templateUrl: 'app/unity-angular/table/table-object-header.html',
        };
        return directive;

        //////////////////////

        function link(scope, element, attrs) {
            //
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTable', tableObject);

    //tableObject.$inject = [];

    function tableObject() {
        var directive = {
            scope: {
                //
            },
            transclude: true,
            replace: true,
            restrict: 'E',
            link: link,
            templateUrl: 'app/unity-angular/table/table-object.html',
            controller: emTable,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        //////////////////////

        function emTable() {
            //
        }

        function link(scope, element, attrs) {
            //
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('table', emTable);

    //emTable.$inject = [];

    function emTable() {
        var directive = {
            restrict: 'E',
            link: link,
            controller: table,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        //////////////////////

        table.$inject = ['$attrs'];

        function table($attrs) {
            var vm = this;

            angular.extend(vm, {
                middle: $attrs.hasOwnProperty('middle'),
                center: $attrs.hasOwnProperty('center'),
                left: $attrs.hasOwnProperty('left'),
                right: $attrs.hasOwnProperty('right')
            });
        }

        function link(scope, element, attrs) {
            element.addClass('em-c-table');
            element.toggleClass('em-c-table--condensed', attrs.hasOwnProperty('condensed'));
            element.toggleClass('em-c-table--striped', attrs.hasOwnProperty('striped'));
            element.toggleClass('vertical-striped', attrs.hasOwnProperty('verticalStriped'));
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('tbody', emTbody);

    //emTbody.$inject = [];

    function emTbody() {
        var directive = {
            restrict: 'E',
            link: link,
            controller: tbody,
            controllerAs: 'vm'
        };
        return directive;

        //////////////////////

        function tbody() {
            var vm = this;

            // Private
            var parent;
            var children = [];
            var open = open;
            var isOpen = false;

            // Public
            vm.parent;
            vm.addChild = addChild;

            // Parent setter
            Object.defineProperty(vm, 'parent', {
                set: function (settingParent) {
                    if (parent)
                        throw new Error('tbody Directive: cannot have more than one <tr [parent]> per <tbody>');

                    parent = settingParent;
                    parent.on('click', open);
                }
            });

            function addChild(child) {
                children.push(child);
                child.addClass('em-c-table__row--secondary');
            }

            function open() {
                // Invert opened
                isOpen = !isOpen;

                // Toggle parent
                parent.toggleClass('em-is-open', isOpen);

                // Toggle each child
                angular.forEach(children, function (child) {
                    child.toggleClass('em-is-visible', isOpen);
                });
            }
        }

        function link(scope, element, attrs) {
            element.addClass('em-c-table__body');
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('td', td);

    td.$inject = ['cellService'];

    function td(cellService) {
        var directive = {
            restrict: 'E',
            link: link,
            require: ['^^table', '^^?tbody', '^^?tfoot', '^^tr']
        };
        return directive;

        //////////////////////

        function link(scope, element, attrs, ctrls) {
            var tableCtrl = ctrls[0];
            var tbodyCtrl = ctrls[1];
            var tfootCtrl = ctrls[2];
            var trCtrl = ctrls[3];

            // Component class
            if (tbodyCtrl)
                element.addClass('em-c-table__cell');
            else if (tfootCtrl)
                element.addClass('em-c-table__footer-cell');

            // Parent cell
            if (trCtrl.isParent)
                element.addClass('em-c-table__cell--dropdown');

            // Utility attributes
            cellService.mapAttributes(element, attrs, tableCtrl);
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('th', th);

    th.$inject = ['cellService'];

    function th(cellService) {
        var directive = {
            restrict: 'E',
            link: link,
            require: '^^table'
        };
        return directive;

        //////////////////////

        function link(scope, element, attrs, tableCtrl) {
            // Component class
            element.addClass('em-c-table__header-cell');

            // Utility attributes
            cellService.mapAttributes(element, attrs, tableCtrl);
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('thead', emThead);

    //emThead.$inject = [];

    function emThead() {
        var directive = {
            restrict: 'E',
            link: link,
            controller: thead,
            controllerAs: 'vm'
        };
        return directive;

        //////////////////////

        function thead() {
            //
        }

        function link(scope, element, attrs) {
            element.addClass('em-c-table__header');
            element.toggleClass('invert', attrs.hasOwnProperty('invert'));
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('tr', emTr);

    //emTr.$inject = [];

    function emTr() {
        var directive = {
            restrict: 'E',
            link: link,
            require: ['^^?thead', '^^?tbody', '^^?tfoot'],
            controller: tr,
            controllerAs: 'vm'
        };
        return directive;

        //////////////////////

        tr.$inject = ['$scope', '$element', '$attrs'];

        function tr($scope, $element, $attrs) {
            var vm = this;

            vm.isParent = $attrs.hasOwnProperty('parent');
        }

        function link(scope, element, attrs, ctrls) {
            var theadCtrl = ctrls[0];
            var tbodyCtrl = ctrls[1];
            var tfootCtrl = ctrls[2];

            // Component class
            if (theadCtrl)
                element.addClass('em-c-table__header-row');
            else if (tbodyCtrl)
                element.addClass('em-c-table__row');
            else if (tfootCtrl)
                element.addClass('em-c-table__footer-row');

            // Group utility
            if (tbodyCtrl)
                if (attrs.hasOwnProperty('parent'))
                    tbodyCtrl.parent = element;
                else if (attrs.hasOwnProperty('children'))
                    tbodyCtrl.addChild(element);
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTreeCollapse', treeCollapse);

    //treeCollapse.$inject = [];

    function treeCollapse() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/tree-nav/tree-collapse.html',
            replace: true,
            restrict: 'E',
            scope: {
                //
            },
            require: '^^emTreeList'
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, emTreeListCtrl) {
            scope.vm = {
                collapsed: true
            };

            scope.vm.collapse = collapse;

            ///////////

            function collapse() {
                // Invert and store
                let collapsed = scope.vm.collapsed = !scope.vm.collapsed;

                // Apply to all items (inlcuding nested)
                collapseItems(emTreeListCtrl.treeItems);

                /////////

                function collapseItems(items) {
                    if (items && items.length)
                        angular.forEach(items, function (item) {
                            collapseItem(item);
                        });
                }

                function collapseItem(item) {
                    // Apply to nested items
                    if (item.children && item.children.length) {
                        item.isActive = !collapsed;
                        collapseItems(item.children);
                    }
                }
            }
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTreeItem', treeItem);

    //treeItem.$inject = [];

    function treeItem() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/tree-nav/tree-item.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                //
            },
            controller: emTreeItem,
            controllerAs: 'vm',
            bindToController: true,
            require: '^^emTreeList'
        };
        return directive;

        //////////////////////////////////

        function emTreeItem() {
            let vm = this;

            vm.isActive = false;
            vm.children = [];
            vm.hasChildren = false;

            Object.defineProperty(vm, 'hasChildren', {
                get: function () {
                    return !!this.children.length;
                }
            });
        }

        function link(scope, element, attrs, emTreeListCtrl) {
            emTreeListCtrl.treeItems.push(scope.vm);
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTreeLink', treeLink);

    //treeLink.$inject = [];

    function treeLink() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/tree-nav/tree-link.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                //
            },
            require: '^^emTreeItem'
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, emTreeItemCtrl) {
            scope.vm = {
                item: emTreeItemCtrl
            };
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTreeList', treeList);

    //treeList.$inject = [];

    function treeList() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/tree-nav/tree-list.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                //
            },
            controller: emTreeList,
            controllerAs: "vm",
            bindToController: true,
            require: "^^?emTreeItem"
        };
        return directive;

        //////////////////////////////////
        function emTreeList() {
            let vm = this;

            let treeItems = [];

            vm.treeItems = [];

            Object.defineProperty(vm, 'treeItems', {
                get: function () {
                    return treeItems;
                }
            });
        }

        function link(scope, element, attrs, emTreeItemCtrl) {
            if (emTreeItemCtrl) {
                emTreeItemCtrl.children = scope.vm.treeItems;
                scope.vm.parent = emTreeItemCtrl;
            }
            else
                scope.vm.isTop = true;
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTreeNav', treeNav);

    //treeNav.$inject = [];

    function treeNav() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/tree-nav/tree-nav.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                //
            }
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs) {
            if (attrs.hasOwnProperty('fullWidth'))
                element.css('max-width', 'none');
        }
    }
})();
angular.module('app').run(['$templateCache', function ($templateCache) {
    $templateCache.put('app/components/header-nav.html', '<header class="header-nav em-c-header em-c-header--condensed em-c-header--blue em-u-margin-bottom-none" role="banner">\r\n    <div class="em-l-container em-c-header__inner">\r\n        <div class="em-c-header__body">\r\n            <div class="em-c-header__title-container">\r\n                <h2 class="em-c-header__title"><a href="#" rel="home" class="em-c-header__title-link">{{appTitle}}</a></h2>\r\n            </div>\r\n            <button class="em-c-btn em-c-btn--small em-c-btn--inverted em-c-header__nav-btn"\r\n                    ng-class="{ \'em-is-active\': menu }"\r\n                    ng-click="showMenu()">\r\n                <div class="em-c-btn__inner">\r\n                    <em-icon is="menu" class="em-c-btn__icon" ng-show="!menu"></em-icon>\r\n                    <em-icon is="x" class="em-c-btn__icon" ng-show="menu"></em-icon>\r\n                    <span class="em-c-btn__text">{{menu ? \'Close\' : \'Menu\'}}</span>\r\n                </div>\r\n            </button>\r\n            <div class="em-c-header__nav-container" ng-class="{ \'em-is-active\': menu }">\r\n                <nav class="em-c-primary-nav" role="navigation">\r\n                    <ul class="em-c-primary-nav__list">\r\n                        <li class="em-c-primary-nav__item" ng-repeat="navItem in navItems">\r\n                            <a class="em-c-primary-nav__link em-u-clickable"\r\n                               ng-class="{ \'em-is-active\': navItem.active }"\r\n                               ng-click="select(navItem)"\r\n                               ng-href="{{navItem.href}}">\r\n                                {{navItem.title}}\r\n                                <em-icon is="caret-down" class="em-c-primary-nav__icon" ng-if="navItem.subItems"></em-icon>\r\n                            </a>\r\n                            <ul class="em-c-primary-nav__sublist"\r\n                                ng-if="navItem.subItems"\r\n                                ng-class="{ \'em-is-active\': navItem.active }">\r\n                                <li class="em-c-primary-nav__subitem" ng-repeat="subItem in navItem.subItems">\r\n                                    <a ng-href="{{subItem.href}}" class="em-c-primary-nav__sublink">{{subItem.title}}</a>\r\n                                </li>\r\n                            </ul>\r\n                        </li>\r\n                        <li style="border-left: 1px solid white; padding-left: 1rem">\r\n                            <span class="fa fa-user em-u-margin-right-half"></span>\r\n                            <span>{{userName}}</span>\r\n                        </li>\r\n                    </ul>\r\n                </nav>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</header>');
    $templateCache.put('app/assessment/assessment.edit.html', '<div class="em-loader-overlay" data-ng-class="{\'em-loader-overlay\': ac.loading.isAnythingLoading()}">\r\n\r\n    <div data-ng-show="!ac.loading.loaders.gettingData === true && ac.message === null">\r\n        <div data-pb-wizard\r\n             data-title="{{ac.current.details.assessmentName}}"\r\n             data-page-size="2"\r\n             data-questions="ac.current.details.questions"\r\n             data-loaded="ac.loading.loaders.gettingData"\r\n             data-cancel="ac.current.cancel()"\r\n             data-save="ac.current.save()"\r\n             data-submit="ac.current.submit()"\r\n             data-review="ac.current.review()"\r\n             data-disable-buttons="ac.loading.loaders.processingData"></div>\r\n    </div>\r\n\r\n</div>\r\n\r\n<!-- Alerts -->\r\n<div data-ng-show="!ac.loading.isAnythingLoading() && ac.message !== null">\r\n    <div class="em-c-alert em-c-alert--error" role="alert" data-ng-show="message !== null">\r\n        <svg class="em-c-icon em-c-alert__icon">\r\n            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/em-icons.svg#icon-warning"></use>\r\n        </svg>\r\n        <div class="em-c-alert__body">\r\n            {{ac.message}}\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<em-loader data-ng-show="ac.loading.isAnythingLoading()"\r\n           style="position:absolute; top:50%; left: 50%;"\r\n           class="center"></em-loader>');
    $templateCache.put('app/assessment/assessment.export.pdf.html', '\r\n<div data-ng-model="isGeneratingPdf" data-ng-init="true">\r\n     <div class="em-loader-overlay" data-ng-class="{\'em-loader-overlay\': isGeneratingPdf === true || ac.loading.isAnythingLoading()}">\r\n\r\n        <!-- Export content -->\r\n        <div id="export-content"\r\n             pb-export-html data-file-name="{{ac.assessment.name.split(\' \').join(\'\') + \'_Results\'}}.pdf"\r\n             ready-to-download="!ac.loading.loaders.gettingData" is-loading="isGeneratingPdf">\r\n\r\n            <div class="em-u-padding-double">\r\n                <div class="em-u-margin-bottom">\r\n                    <h1>Review Assessment</h1>\r\n                    <h2>{{ac.assessment.name}}</h2>\r\n                </div>\r\n\r\n                <div ng-class="{\'invisible\': ac.loading.loaders.gettingData === true}">\r\n\r\n                    <!-- Overview -->\r\n                    <div ng-include="\'app/assessment/partials/review.overview.html\'"></div>\r\n\r\n                    <!-- Radar chart / In Progress message -->\r\n                    <div ng-include="\'app/assessment/partials/review.radar.html\'"></div>\r\n\r\n                    <!-- Details -->\r\n                    <div class="em-c-solid-card em-c-solid-card--compact em-c-solid-card--with-icon full-width-card em-u-margin-bottom-double">\r\n                        <div class="em-c-solid-card__body em-u-display-inline-block">\r\n                            <div class="float-left">\r\n                                <span class="fa fa-2x fa-list"></span>\r\n                                <h3 class="em-c-solid-card__title float-right">\r\n                                    <span>Responses</span>\r\n                                </h3>\r\n                            </div>\r\n                            <div class="float-right">\r\n                            </div>\r\n                        </div>\r\n                        <div class="em-c-solid-card__footer">\r\n                            <div class="em-u-margin-top-double" data-ng-repeat="category in ac.current.questionResponsesByCategory">\r\n                                <div ng-include="\'app/assessment/partials/review.details.html\'"></div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n\r\n    <!-- Loading message, not part of export -->\r\n    <em-loader data-ng-show="isGeneratingPdf === true || ac.loading.isAnythingLoading()"\r\n               style="position:absolute; top:50%; left: 50%;"\r\n               class="center"></em-loader>\r\n</div>\r\n');
    $templateCache.put('app/assessment/assessment.list.html', '\r\n<div class="em-loader-overlay" data-ng-class="{\'em-loader-overlay\': ac.loading.isAnythingLoading()}">\r\n    <div class="em-u-margin-bottom">\r\n        <h1>Assessments</h1>\r\n    </div>\r\n\r\n    <div class="em-u-margin-bottom-quad"\r\n         data-ng-repeat="assessment in ac.assessments">\r\n        <div ng-include="\'app/assessment/partials/details.html\'" onload="assessment = assessment"></div>\r\n    </div>\r\n</div>\r\n<em-loader data-ng-show="ac.loading.isAnythingLoading()"\r\n           style="position:absolute; top:50%; left: 50%;"\r\n           class="center"></em-loader>');
    $templateCache.put('app/assessment/assessment.review.html', '<div class="em-loader-overlay" data-ng-class="{\'em-loader-overlay\': ac.loading.isAnythingLoading()}">\r\n    <div class="em-u-margin-bottom">\r\n        <h1>Review Assessment</h1>\r\n        <h2>{{ac.assessment.name}}</h2>\r\n    </div>\r\n\r\n    <!-- Alerts -->\r\n\r\n    <div data-ng-show="!ac.loading.isAnythingLoading() && ac.info !== null">\r\n        <div class="em-c-alert" role="alert">\r\n            <div class="em-c-alert__body">\r\n                {{ac.info}}\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div data-ng-show="!ac.loading.isAnythingLoading() && ac.message !== null">\r\n        <div class="em-c-alert em-c-alert--error" role="alert" data-ng-show="message !== null">\r\n            <svg class="em-c-icon em-c-alert__icon">\r\n                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/em-icons.svg#icon-warning"></use>\r\n            </svg>\r\n            <div class="em-c-alert__body">\r\n                {{ac.message}}\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div data-ng-show="!ac.loading.isAnythingLoading() && ac.message === null && ac.current.mode === ac.modes.review">\r\n        <div class="em-l em-l--two-column two-column-left-sidebar-on-top">\r\n\r\n            <!-- team assessment list -->\r\n            <div class="em-l__secondary em-u-margin-right-double">\r\n                <div ng-include="\'app/assessment/partials/nav.list.html\'"></div>\r\n            </div>\r\n\r\n            <!-- Dashboard view -->\r\n            <div class="em-l__main">\r\n                <div ng-include="\'app/assessment/partials/review.overview.html\'"></div>\r\n\r\n                <!-- Review Section -->\r\n                <div data-ng-if="ac.current.attempts.list.length === 1"\r\n                     ng-include="\'app/assessment/partials/review.radar.html\'"></div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Review Section -->\r\n        <!-- Display down here instead if we\'re also showing the multiple attempts section. -->\r\n        <div data-ng-if="ac.current.attempts.list.length > 1"\r\n             ng-include="\'app/assessment/partials/review.radar.html\'"></div>\r\n    </div>\r\n\r\n    <div data-ng-show="!ac.loading.isAnythingLoading() && ac.message === null && ac.current.mode === ac.modes.reviewDetails">\r\n        <div class="em-u-margin-top-double" data-ng-repeat="category in ac.current.radarChartData.reviewQuestionData">\r\n            <div ng-include="\'app/assessment/partials/review.details.html\'"></div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<em-loader data-ng-show="ac.loading.isAnythingLoading()"\r\n           style="position:absolute; top:50%; left: 50%;"\r\n           class="center"></em-loader>\r\n');
    $templateCache.put('app/home/home.html', '<!-- Banner Image -->\r\n<div class="banner-image em-u-margin-bottom">\r\n    <div class="banner-image-background" style="background-image: url(/images/Mountains.jpg)"></div>\r\n</div>\r\n\r\n<!-- Text -->\r\n<div class="em-l-grid em-l-grid--2up ">\r\n    <div class="em-l-grid__item">\r\n        <h3>There will be some explanatory verbiage here</h3>\r\n        <div>\r\n            <p>\r\n                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In dignissim eros non enim malesuada, a vehicula velit venenatis. Nullam ligula neque, semper eget mattis a, euismod non sem. Mauris sagittis et ligula ac auctor. Integer varius eros in sem placerat laoreet. In justo tellus, pretium id ante ut, dapibus varius massa. Ut dictum sit amet metus ut viverra. Aliquam viverra lectus id est vehicula, sollicitudin bibendum tortor pulvinar. Aliquam congue turpis augue, non porta ligula porttitor ut. Mauris vehicula sem vestibulum ligula tincidunt, eu ornare sem finibus. Aenean facilisis urna erat, id hendrerit elit feugiat vel. Integer pharetra aliquam augue sit amet venenatis. Praesent condimentum lacinia urna, eu commodo augue ornare et. Donec sodales ligula in lectus fringilla venenatis.\r\n            </p>\r\n            <p>\r\n                Morbi dictum accumsan lorem. Morbi eu faucibus ante. Nam ultricies ac leo sed tempor. Aliquam eu fringilla neque, non rhoncus metus. Mauris fringilla libero id blandit sodales. Mauris nulla nunc, pharetra vitae vulputate sit amet, condimentum nec erat. Aenean ac rhoncus dui. Fusce iaculis pulvinar congue. Proin ornare nunc eget vestibulum interdum. Suspendisse ut leo nec tortor egestas congue. Morbi non mauris id turpis semper iaculis vitae sed nibh. Nullam rhoncus metus id sapien gravida imperdiet non ut massa. Suspendisse commodo, est sit amet rutrum fermentum, erat mi luctus libero, at pulvinar justo tortor nec tortor.\r\n            </p>\r\n        </div>\r\n    </div>\r\n    <div class="em-l-grid__item em-u-text-align-right">\r\n        <h3>Helpful links/Supplemental Information</h3>\r\n        <div class="">\r\n            <ul class="em-c-link-list ">\r\n                <li class="em-c-link-list__item">\r\n                    <a href=" #" class="em-c-link-list__link ">\r\n                        List Item 1\r\n                    </a>\r\n                </li>\r\n                <!-- end em-c-link-list__item -->\r\n                <li class="em-c-link-list__item">\r\n                    <a href=" #" class="em-c-link-list__link ">\r\n                        List Item 2\r\n                    </a>\r\n                </li>\r\n                <!-- end em-c-link-list__item -->\r\n                <li class="em-c-link-list__item">\r\n                    <a href=" #" class="em-c-link-list__link ">\r\n                        List Item 3\r\n                    </a>\r\n                </li>\r\n                <!-- end em-c-link-list__item -->\r\n                <li class="em-c-link-list__item">\r\n                    <a href=" #" class="em-c-link-list__link ">\r\n                        List Item 4\r\n                    </a>\r\n                </li>\r\n                <!-- end em-c-link-list__item -->\r\n                <li class="em-c-link-list__item">\r\n                    <a href=" #" class="em-c-link-list__link ">\r\n                        List Item 5\r\n                    </a>\r\n                </li>\r\n                <!-- end em-c-link-list__item -->\r\n                <li class="em-c-link-list__item">\r\n                    <a href=" #" class="em-c-link-list__link ">\r\n                        List Item 6\r\n                    </a>\r\n                </li>\r\n                <!-- end em-c-link-list__item -->\r\n            </ul>\r\n            <!-- end em-c-link-list -->\r\n        </div>\r\n    </div>\r\n</div>');
    $templateCache.put('app/playbook/playbook.details.html', '<div class="em-u-margin-bottom">\r\n    <h1>Playbook</h1>\r\n    <h2>{{pc.assessment.name}}</h2>\r\n</div>\r\n\r\n<!-- Alerts -->\r\n<div data-ng-show="pc.loaded === true && pc.info !== null">\r\n    <div class="em-c-alert" role="alert">\r\n        <div class="em-c-alert__body">\r\n            {{pc.info}}\r\n        </div>\r\n    </div>\r\n</div>\r\n<div data-ng-show="pc.loaded === true && pc.message !== null">\r\n    <div class="em-c-alert em-c-alert--error" role="alert">\r\n        <svg class="em-c-icon em-c-alert__icon">\r\n            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/em-icons.svg#icon-warning"></use>\r\n        </svg>\r\n        <div class="em-c-alert__body">\r\n            {{pc.message}}\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div class="em-l em-l--two-column two-column-left-sidebar-on-top"\r\n     data-ng-show="pc.loaded === true && pc.message === null">\r\n\r\n    <!-- team assessment list -->\r\n    <div class="em-l__secondary em-u-margin-right-double">\r\n        <div ng-include="\'app/playbook/partials/list.html\'"></div>\r\n    </div>\r\n\r\n    <div class="em-l__main">\r\n        <div ng-include="\'app/playbook/partials/edit.html\'"\r\n             data-ng-if="pc.playbooks.length > 0"></div>\r\n\r\n        <div data-ng-show="pc.playbooks == null || pc.playbooks.length === 0">\r\n            <div class="em-c-alert" role="alert">\r\n                <div class="em-c-alert__body">\r\n                    You have not created any playbooks for this assessment. \r\n                </div>\r\n                <div class="em-c-alert__actions">\r\n                    <a class="em-c-text-btn"\r\n                            href="/#/assessments/{{pc.assessment.id}}/playbook" >\r\n                        <!--TODO: allow navigation directly to playbook -->\r\n                        Create Playbook <span class="fa fa-plus-circle em-u-margin-left-half"></span>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>');
    $templateCache.put('app/playbook/playbook.export.pdf.html', '<div data-ng-model="isGeneratingPdf" data-ng-init="true">\r\n    <div class="em-loader-overlay" data-ng-class="{\'em-loader-overlay\': isGeneratingPdf === true || pc.loaded === false}">\r\n\r\n        <div id="export-content"\r\n             pb-export-html data-file-name="{{pc.assessment.name.split(\' \').join(\'\') + \'_Playbook\'}}.pdf"\r\n             ready-to-download="pc.loaded" is-loading="isGeneratingPdf">\r\n\r\n            <div class="em-u-padding-double">\r\n                <div class="em-u-margin-bottom">\r\n                    <h1>Playbook</h1>\r\n                    <h2>{{pc.assessment.name}}</h2>\r\n                </div>\r\n\r\n                <div data-ng-show="pc.loaded === true">\r\n                    <div ng-include="\'app/playbook/partials/edit.html\'"\r\n                         data-ng-if="pc.playbooks.length > 0"></div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n    </div>\r\n\r\n    <!-- Loading message, not part of export -->\r\n    <em-loader data-ng-show="isGeneratingPdf === true || pc.loaded === false"\r\n               style="position:absolute; top:50%; left: 50%;"\r\n               class="center"></em-loader>\r\n</div>');
    $templateCache.put('app/playbook/playbook.list.html', '<div class="em-u-margin-bottom">\r\n    <h1>Playbooks</h1>\r\n</div>\r\n\r\n<div class="em-u-margin-bottom-quad"\r\n     data-ng-repeat="assessment in ac.assessments">\r\n    <div ng-include="\'app/playbook/partials/details.html\'" onload="assessment = assessment"></div>\r\n</div>');
    $templateCache.put('app/playbook/playbook.new.html', '<div class="em-u-margin-bottom">\r\n    <h1>New Playbook</h1>\r\n    <h2>{{pc.assessment.name}}</h2>\r\n</div>\r\n\r\n<!-- Alerts -->\r\n<div data-ng-show="pc.loaded === true && pc.info !== null" class="em-u-margin-bottom">\r\n    <div class="em-c-alert" role="alert">\r\n        <div class="em-c-alert__body">\r\n            {{pc.info}}\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div ng-include="\'app/playbook/partials/new.html\'"></div>');
    $templateCache.put('app/security/unauthorized.html', '<!DOCTYPE html>\r\n<h1>Unauthorized</h1>');
    $templateCache.put('app/team/team.details.html', '<!-- Page Title -->\r\n<div class="em-u-margin-bottom">\r\n    <h1>Assessments</h1>\r\n</div>\r\n\r\n<!-- Section -->\r\n<div id="assessment-details">\r\n\r\n    <form name="tc.form" novalidate role="form">\r\n        <div class="em-u-margin-bottom-double">\r\n            <span>Please provide some additional information prior to completing the assessment:</span>\r\n        </div>\r\n\r\n        <div class="em-c-field em-u-margin-bottom"\r\n             data-ng-class="{\'em-has-error\': tc.form.submitted && tc.form.name.$error.required}">\r\n            <label for="team-name-input" class="em-c-field__label">The name of the team, product, or application for which I am responding:</label>\r\n            <div class="em-c-field__body">\r\n                <!--<input id="team-name-input" type="text" name="name" data-ng-model="tc.team.name" class="em-c-input em-c-field__input" required />-->\r\n                <input type="text" ng-model="tc.team.name" name="name" placeholder="" uib-typeahead="team.name as team.name for team in tc.search($viewValue)" typeahead-min-length="0" typeahead-editable="true" ng-change="tc.validateTeamName(tc.team.name); tc.editTeamProperty(tc.team.name)"\r\n                       typeahead-loading="tc.isLoadingTeams" class="em-c-input em-c-field__input" typeahead-popup-template-url="app/unity-angular/typeahead/unity-angular.typeahead.template.html" typeahead-on-select="tc.selectTeam($item)" required>\r\n                <svg class="em-c-icon em-c-field__icon"\r\n                     data-ng-show="tc.form.submitted && tc.form.name.$error.required">\r\n                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-warning"></use>\r\n                </svg>\r\n            </div>\r\n            <div class="em-c-field__note" data-ng-show="tc.form.submitted && tc.form.name.$error.required">The name is required.</div>\r\n        </div>\r\n\r\n        <div class="em-c-field">\r\n            <label for="team-info-input" class="em-c-field__label float-left">Additional information for the team, product, or application for which I am responding:</label>\r\n            <div class="em-c-field__note float-right">(optional)</div>\r\n            <div class="em-c-field__body">\r\n                <textarea id="team-info-input" data-ng-model="tc.team.info" class="em-c-textarea" ng-change="tc.editTeamProperty(tc.team.info)"></textarea>\r\n            </div>\r\n        </div>\r\n\r\n        <div class="em-c-alert em-c-alert--error" role="alert" data-ng-show="tc.message !== null">\r\n            <svg class="em-c-icon em-c-alert__icon">\r\n                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-warning"></use>\r\n            </svg>\r\n            <div class="em-c-alert__body">\r\n                {{tc.message}}\r\n            </div>\r\n        </div>\r\n\r\n        <div class="em-c-alert em-c-alert--warning" role="alert" data-ng-show="tc.warning !== null">\r\n            <svg class="em-c-icon em-c-alert__icon">\r\n                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-warning"></use>\r\n            </svg>\r\n            <div class="em-c-alert__body">\r\n                {{tc.warning}}\r\n            </div>\r\n        </div>\r\n\r\n        <div id="form-buttons" class="em-u-margin-top-double">\r\n            <button class="em-c-btn em-u-align-left float-left"\r\n                    type="button"\r\n                    data-ng-click="tc.cancel()">\r\n                <span class="em-c-btn__text">Cancel</span>\r\n            </button>\r\n            <button class="em-c-btn em-c-btn--primary float-right"\r\n                    type="button"\r\n                    data-ng-click="tc.saveTeam()">\r\n                <span class="em-c-btn__text">Continue</span>\r\n            </button>\r\n        </div>\r\n    </form>\r\n</div>');
    $templateCache.put('app/visualizations/radar.chart.html', '<div class="chart radar">\r\n    <!--<div id="legend"></div>-->\r\n    <h4>{{title}}</h4>\r\n    <div id="graph"></div>\r\n</div>');
    $templateCache.put('app/admin/applogs/applogs.html', '<!DOCTYPE html>\r\n\r\n<div class="em-c-band em-c-band--blue-deep app-logs">\r\n    <div class="em-l-container">\r\n        <div class="em-l-grid--2up">\r\n            <div class="em-l-grid__item">\r\n                <h2>Application Logs</h2>\r\n            </div>\r\n            <div class="em-l-grid__item">\r\n                <label class="em-c-search__label em-u-is-vishidden">Search</label>\r\n                <div class="em-c-search__body em-u-margin-bottom">\r\n                    <input type="search" class="em-c-search__input" placeholder="Search" ng-model="search">\r\n                    <em-button primary aria-label="Search" style="cursor: default">\r\n                        <em-icon is="search"></em-icon>\r\n                    </em-button>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div class="em-l-container app-logs">\r\n    <em-loader type="spinner" absolute center ng-if="logsCtrl.loading && !logsCtrl.error"></em-loader>\r\n    <em-alert error fixed ng-if="logsCtrl.error">\r\n        Error loading application logs.\r\n        <em-button text ng-click="logsCtrl.reload()">\r\n            Click here to try again\r\n        </em-button>\r\n    </em-alert>\r\n\r\n    <div ng-if="logsCtrl.logs.length">\r\n        <section>\r\n            <div class="em-c-well em-u-padding">\r\n                <table class="em-c-table em-c-table--condensed">\r\n                    <thead class="em-c-table__header">\r\n                        <tr class="em-c-table__header-row">\r\n                            <th class="em-c-table__header-cell">Id</th>\r\n                            <th class="em-c-table__header-cell">EventId</th>\r\n                            <th class="em-c-table__header-cell">Source</th>\r\n                            <th class="em-c-table__header-cell">Message</th>\r\n                            <th class="em-c-table__header-cell">Timestamp</th>\r\n                            <th class="em-c-table__header-cell">Level</th>\r\n                            <th></th>\r\n                        </tr>\r\n                    </thead>\r\n\r\n                    <tbody class="em-c-table__body">\r\n                        <tr class="em-c-table__row"\r\n                            ng-repeat-start="log in logsCtrl.logs | filter: search | orderBy:\'-Timestamp\' track by log.Id ">\r\n                            <td class="em-c-table__cell">{{log.Id}}</td>\r\n                            <td class="em-c-table__cell">{{log.EventId}}</td>\r\n                            <td class="em-c-table__cell">{{log.Source}}</td>\r\n                            <td class="em-c-table__cell">{{log.Message}}</td>\r\n                            <td class="em-c-table__cell">{{log.Timestamp | utcDateFormatter}}</td>\r\n                            <td class="em-c-table__cell {{log.Level | logLevel}}">{{log.Level | logLevel}}</td>\r\n                            <td class="em-c-table__cell">\r\n                                <em-button aria-label="Expand" style="cursor: default" ng-show="true" ng-click="expanded = !expanded">\r\n                                    <em-icon is="support"></em-icon>\r\n                                </em-button>\r\n                            </td>\r\n                        </tr>\r\n\r\n                        <tr ng-repeat-end ng-show="expanded">\r\n                            <td colspan="6">\r\n                                <table class="em-c-table em-c-table--condensed">\r\n                                    <thead class="em-c-table__header">\r\n                                        <tr class="em-c-table__header-row"></tr>\r\n                                    </thead>\r\n                                    <tbody class="em-c-table__body">\r\n                                        <tr class="em-c-table__row">\r\n                                            <td>\r\n                                                <div class="detail-label">Error Message:</div>\r\n                                                <div class="detail-content">\r\n                                                    {{log.Message}}\r\n                                                </div>\r\n                                                <br />\r\n                                                <div class="detail-label">Severity:</div>\r\n                                                <div class="detail-content">\r\n                                                    {{log.Level | logLevel}}\r\n                                                </div>\r\n                                            </td>\r\n                                            <td>\r\n                                                <div class="detail-label">Occurred At:</div>\r\n                                                <div class="detail-content">\r\n                                                    {{log.Timestamp | utcDateFormatter}}\r\n                                                </div>\r\n\r\n                                                <br />\r\n                                                <div class="detail-label">Occurred In:</div>\r\n                                                <div class="detail-content">\r\n                                                    {{log.Source}}\r\n                                                </div>\r\n\r\n                                            </td>\r\n                                        </tr>\r\n\r\n                                        <tr class="em-c-table__row">\r\n                                            <td colspan="2">\r\n                                                <div class="detail-label">Session Detail:</div>\r\n                                                <div class="detail-content">\r\n                                                    Username: {{log.SessionDetails.Username}}<br />\r\n                                                    Session Id: {{ log.SessionDetails.Session }}\r\n                                                </div>\r\n                                            </td>\r\n\r\n                                        </tr>\r\n                                        <tr class="em-c-table__row">\r\n                                            <td colspan="2">\r\n                                                <div class="detail-label">Exception Detail:</div>\r\n                                                <div class="detail-content">\r\n                                                    {{log.ExceptionMessage}}\r\n\r\n                                                </div>\r\n                                            </td>\r\n\r\n                                        </tr>\r\n                                    </tbody>\r\n                                </table>\r\n                            </td>\r\n                        </tr>\r\n                    </tbody>\r\n\r\n                </table>\r\n            </div>\r\n        </section>\r\n    </div>\r\n</div>');
    $templateCache.put('app/admin/users/user.html', '\r\n<div class="em-l-container em-u-padding-top">\r\n    <em-loader type="spinner" absolute center middle size="100px" ng-if="userCtrl.isLoading"></em-loader>\r\n    <div ng-if="!userCtrl.isLoading">\r\n        <div class="em-l-container">\r\n            <div class="em-l-grid em-l-grid--halves">\r\n                <div class="em-l-grid__item">\r\n                    <h3>Welcome, {{ userCtrl.user.FriendlyName }}</h3>\r\n                    <h4>Here\'s what we know about you:</h4>\r\n                    <em-field>\r\n                        <label>Id</label>\r\n                        <em-field-body>\r\n                            <input type="text" placeholder="User identifier" ng-model="userCtrl.user.Id" />\r\n                        </em-field-body>\r\n                    </em-field>\r\n                    <em-field>\r\n                        <label>Username</label>\r\n                        <em-field-body>\r\n                            <input type="text" placeholder="Username" ng-model="userCtrl.user.Username" />\r\n                        </em-field-body>\r\n                    </em-field>\r\n                    <em-field>\r\n                        <label>Friendly Name</label>\r\n                        <em-field-body>\r\n                            <input type="text" placeholder="User Friendly Name" ng-model="userCtrl.user.FriendlyName" />\r\n                        </em-field-body>\r\n                    </em-field>\r\n                    <em-field>\r\n                        <label>Email Address</label>\r\n                        <em-field-body>\r\n                            <input type="text" placeholder="Email Address" ng-model="userCtrl.user.EmailAddress" />\r\n                        </em-field-body>\r\n                    </em-field>\r\n                </div>\r\n                <div class="em-l-grid__item">\r\n                    <h3 class="em-u-margin-bottom-double">Roles</h3>\r\n\r\n                    <table class="em-c-table em-c-table--condensed">\r\n                        <thead class="em-c-table__header">\r\n                            <tr class="em-c-table__header-row">\r\n                                <th class="em-c-table__header-cell"\r\n                                    ng-class="{\r\n                                        \'em-u-text-align-center\': $index !== 0\r\n                                    }"\r\n                                    ng-repeat="th in [\'Name\', \'Read\', \'Edit\', \'Delete\', \'Create\', \'Submit\']">\r\n                                    {{th}}\r\n                                </th>\r\n                            </tr>\r\n                        </thead>\r\n                        <tbody class="em-c-table__body" ng-repeat="roles in userCtrl.roles">\r\n                            <tr class="em-c-table__row em-u-background-color--curious-blue">\r\n                                <td colspan="6" class="em-u-padding-half em-u-padding-left">{{roles.replace(\'Roles\', \'\')}}</td>\r\n                            </tr>\r\n                            <tr class="em-c-table__row" ng-repeat="(key, role) in userCtrl.user[roles]">\r\n                                <td class="em-c-table__cell"\r\n                                    style="vertical-align: middle">\r\n                                    {{key}}\r\n                                </td>\r\n                                <td class="em-c-table__cell em-u-text-align-center"\r\n                                    ng-repeat="permission in userCtrl.getPermissions(role)">\r\n                                    <div class="em-c-badge"\r\n                                         ng-class="{\r\n                                             \'em-c-badge--positive\': role[permission],\r\n                                             \'em-c-badge--negative\': !role[permission]\r\n                                         }">\r\n                                        {{permission}} {{ role[permission] ? \'Yes\' : \'No\' }}\r\n                                    </div>\r\n                                </td>\r\n                            </tr>\r\n                        </tbody>\r\n                    </table>\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>');
    $templateCache.put('app/admin/users/users.html', '<main role="main" class="admin-users">\r\n    <section class="em-l-container em-c-section"> \r\n        <div class="em-c-section__body">\r\n            <header class="em-c-section__header em-u-margin-bottom-none">\r\n                <h2 class="em-c-section__title">Users</h2>\r\n            </header>              \r\n        </div>\r\n    </section>\r\n</main>');
    $templateCache.put('app/assessment/partials/details.html', '\r\n<!-- Info -->\r\n<div id="assessment-details">\r\n    <div class="em-l-grid em-l-grid--2up ">\r\n        <!-- Instructions -->\r\n        <div class="em-l-grid__item em-u-text-align-left">\r\n            <h2 class="">{{assessment.name}}</h2>\r\n        </div>\r\n        <!--<div class="em-l-grid__item em-u-text-align-right">\r\n            <a class="em-c-btn em-c-btn--primary" href="/{{assessment.id}}">\r\n                <span class="em-c-btn__text">Start Assessment!</span>\r\n            </a>\r\n        </div>-->\r\n    </div>\r\n\r\n    <div class="em-l-grid em-l-grid--2up ">\r\n        <!-- Instructions -->\r\n        <div class="em-l-grid__item show-new-lines">\r\n            {{assessment.instructions.trim()}}\r\n        </div>\r\n\r\n        <!-- IDK -->\r\n        <div class="em-l-grid__item em-u-text-align-right box-border">\r\n            <a class="em-c-btn em-c-btn--primary em-u-align-center button-wide vertical-center em-u-margin-bottom" href="/#/assessments/{{assessment.id}}/team">\r\n                <span class="em-c-btn__text">Take Assessment</span>\r\n            </a>\r\n            <br/>\r\n            <a class="em-c-btn em-c-btn--primary em-u-align-center button-wide vertical-center" href="/#/assessments/{{assessment.id}}">\r\n                <span class="em-c-btn__text">Review Assessments</span>\r\n            </a>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div data-ng-show="ac.loaded === true && ac.message !== null">\r\n    <div class="em-c-alert em-c-alert--error" role="alert" data-ng-show="message !== null">\r\n        <svg class="em-c-icon em-c-alert__icon">\r\n            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/em-icons.svg#icon-warning"></use>\r\n        </svg>\r\n        <div class="em-c-alert__body">\r\n            {{ac.message}}\r\n        </div>\r\n    </div>\r\n</div>');
    $templateCache.put('app/assessment/partials/nav.list.html', '<ul class="em-c-accordion">\r\n    <li em-accordian data-title="My Assessments" data-is-open="true">\r\n        <div data-ng-repeat="assessment in (filteredItems = (ac.assessment.teamAssessments | filter: {latest: {isCompletedByMe: true}} ))">\r\n            <div class="em-u-padding em-u-clickable"\r\n                 data-ng-click="ac.reviewTeamAssessment(assessment.latest)">\r\n                <span data-ng-class="{\'em-u-color--blue\': assessment.latest.teamId === ac.current.details.teamId }">\r\n                    <span class="em-u-margin-right-half">{{assessment.latest.teamName}}</span>\r\n                    <span class="float-right"\r\n                          style="white-space:nowrap"\r\n                          data-ng-show="assessment.latest.status === \'COMPLETED\'">\r\n                        <span class="fa fa-check"></span>\r\n                        ({{assessment.latest.completed | date:\'MM/dd/yyyy\'}})\r\n                    </span>\r\n                </span>\r\n            </div>\r\n        </div>\r\n        <div data-ng-if="filteredItems.length === 0"\r\n             class="em-u-padding">\r\n            <span>You have not completed any assessments.</span>\r\n        </div>\r\n    </li>\r\n    <li data-em-accordian data-title="Shared with Me" data-is-open="true">\r\n        <div data-ng-repeat="assessment in (filteredSharedItems = (ac.assessment.teamAssessments | filter: {latest: {isCompletedByMe: false}}))">\r\n            <div class="em-u-padding em-u-clickable"\r\n                 data-ng-click="ac.reviewTeamAssessment(assessment.latest)">\r\n                <span data-ng-class="{\'em-u-color--blue\': assessment.latest.teamId === ac.current.details.teamId }">\r\n                    <span class="em-u-margin-right-half">{{assessment.latest.teamName}}</span>\r\n                    <span class="float-right"\r\n                          style="white-space:nowrap"\r\n                          data-ng-show="assessment.latest.status === \'COMPLETED\'">\r\n                        ({{assessment.latest.completed | date:\'MM/dd/yyyy\'}})\r\n                    </span>\r\n                </span>\r\n            </div>\r\n        </div>\r\n        <div data-ng-if="filteredSharedItems.length === 0"\r\n             class="em-u-padding">\r\n            <span>No assessments have been shared with you.</span>\r\n        </div>\r\n    </li>\r\n</ul>');
    $templateCache.put('app/assessment/partials/review.details.html', '<div class="em-u-margin-top-double">\r\n    <div class="em-u-display-inline-block em-u-width-100">\r\n        <div class="float-left">\r\n            <h3 class="em-u-margin-bottom-double em-u-display-inline-block">{{category.categoryName}}</h3>\r\n            <h6 class="em-u-margin-left-half em-u-display-inline-block"\r\n                data-ng-if="category.score >= 0">\r\n                {{category.score * 100 | number:0}}%\r\n            </h6>\r\n        </div>\r\n        <button class="em-c-btn em-c-btn--large em-js-btn-selectable float-right"\r\n                data-ng-click="ac.current.mode = ac.modes.review"\r\n                data-ng-if="ac.current.mode === ac.modes.reviewDetails">\r\n            <span class="em-c-btn__text">Back</span>\r\n        </button>\r\n    </div>\r\n\r\n    <section class="em-c-section assessment-review-question-section"\r\n             data-ng-repeat="question in category.questions | orderBy: \'questionOrder\'">\r\n        <header class="em-c-section__header ">\r\n            <h4 class="em-c-section__title ">{{question.questionText}}</h4>\r\n        </header>\r\n        <div class="em-c-section__body">\r\n            <div class="em-l-grid "\r\n                 data-ng-class="{\'em-l-grid--6up\': question.answers.length === 6, \'em-l-grid--5up\': question.answers.length === 5}">\r\n                <div class="em-l-grid__item assessment-review-answer"\r\n                     data-ng-repeat="answer in question.answers"\r\n                     data-ng-class="{\'assessment-review-selected-answer\': answer.id === question.selectedAnswerId}">\r\n                    <span class="vertical-center">\r\n                        {{answer.text}}\r\n                    </span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class="em-c-section__footer">\r\n            <span data-ng-show="question.comment !== \'\' && question.comment !== null">\r\n                <i>Additional Comments: {{question.comment}}</i>\r\n            </span>\r\n        </div>\r\n    </section>\r\n</div>');
    $templateCache.put('app/assessment/partials/review.overview.html', '<!--<div>\r\n    <h2>{{ac.current.details.assessmentName}}</h2>\r\n</div>-->\r\n\r\n<div data-ng-show="ac.assessment.teamAssessments.length === 0">\r\n    <div class="em-c-alert" role="alert">\r\n        <svg class="em-c-icon em-c-alert__icon">\r\n            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/em-icons.svg#icon-warning"></use>\r\n        </svg>\r\n        <div class="em-c-alert__body">\r\n            You do not have any completed assessments to review.\r\n        </div>\r\n        <div class="em-c-alert__actions">\r\n            <a class="em-c-text-btn "\r\n               href="/#/assessments/{{ac.assessment.id}}/team">\r\n                Take Assessment <span class="fa fa-plus-circle em-u-margin-left-half"></span>\r\n            </a>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div data-ng-show="ac.assessment.teamAssessments.length > 0">\r\n\r\n    <!-- Tiles -->\r\n    <div class="em-l-grid em-l-grid--2up ">\r\n        <div class="em-l-grid__item">\r\n            <!-- Score -->\r\n            <div class="em-c-solid-card em-c-solid-card--compact em-c-solid-card--with-icon">\r\n                <div class="em-c-solid-card__body em-u-display-flex" style="justify-content:space-between;">\r\n                    <div class="float-left em-u-display-flex">\r\n                        <span class="fa fa-2x fa-pie-chart"></span>\r\n                        <h3 class="em-c-solid-card__title float-right">\r\n                            <span data-ng-if="ac.current.details.score !== null">{{ac.current.details.score * 100 | number:0}}%</span>\r\n                            <span data-ng-if="ac.current.details.score === null">NA</span>\r\n                        </h3>\r\n                    </div>\r\n                    <div class="float-right">\r\n                        <h4 class="em-c-solid-card__kicker">SCORE</h4>\r\n                    </div>\r\n                </div>\r\n                <div class="em-c-solid-card__footer">\r\n                    <span data-ng-if="ac.current.details.completed !== null">{{ac.current.details.completed | date:\'MM/dd/yyyy h:mm a\'}}</span>\r\n                    <span data-ng-if="ac.current.details.completed === null">{{ac.current.details.lastUpdated | date:\'MM/dd/yyyy h:mm a\'}} <i>(Last Updated)</i></span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class="em-l-grid__item">\r\n            <!-- Team -->\r\n            <div class="em-c-solid-card em-c-solid-card--compact em-c-solid-card--with-icon">\r\n                <div class="em-c-solid-card__body em-u-display-flex" style="justify-content:space-between;">\r\n                    <div class="float-left em-u-display-flex">\r\n                        <span class="fa fa-2x fa-users"></span>\r\n                        <h3 class="em-c-solid-card__title float-right">\r\n                            <span>{{ac.current.details.teamName}}</span>\r\n                        </h3>\r\n                    </div>\r\n                    <div class="float-right">\r\n                        <h4 class="em-c-solid-card__kicker">TEAM</h4>\r\n                    </div>\r\n                </div>\r\n                <div class="em-c-solid-card__footer">\r\n                    <span style="word-break:break-word">{{ac.current.details.teamInfo}}</span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class="em-l-grid em-l-grid--2up" data-ng-show="ac.current.details.status === \'COMPLETED\'">\r\n        <div class="em-l-grid__item">\r\n            <!-- Playbook -->\r\n            <div class="section-header-full-height"\r\n                 data-ng-if="ac.current.mode !== ac.modes.download">\r\n                <div class="section-header-full-width" data-ng-show="ac.current.details.hasPlaybook === true">\r\n                    <div class="em-c-alert alert-plain alert-full-height" role="alert">\r\n                        <span class="fa fa-book em-u-margin-right"></span>\r\n                        <div class="em-c-alert__body">\r\n                            <span>\r\n                                View the <i ng-show="ac.current.details.id !== ac.current.attempts.latest.id">archived</i> Playbook for this team assessment.\r\n                            </span>\r\n                        </div>\r\n                        <div class="em-c-alert__actions">\r\n                            <a class="em-c-text-btn " href="/#/assessments/{{ac.current.details.assessmentId}}/teams/{{ac.current.details.teamId}}/playbooks/{{ac.current.details.playbookId}}">\r\n                                View <!--<span class="fa fa-book fa-sm em-u-margin-left-half"></span>-->\r\n                            </a>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class="section-header-full-width" data-ng-show="ac.current.details.hasPlaybook === false && ac.current.details.id === ac.current.attempts.latest.id">\r\n                    <div class="em-c-alert alert-plain alert-full-height" role="alert">\r\n                        <span class="fa fa-book em-u-margin-right"></span>\r\n                        <div class="em-c-alert__body">\r\n                            <span>\r\n                                Create a Playbook to address any areas of improvement!\r\n                            </span>\r\n                        </div>\r\n                        <div class="em-c-alert__actions">\r\n                            <a class="em-c-text-btn " href="/#/assessments/{{ac.current.details.assessmentId}}/teamAssessments/{{ac.current.details.id}}/playbook">\r\n                                Create <span class="fa fa-plus-circle fa-sm em-u-margin-left-half"></span>\r\n                            </a>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <div class="section-header-full-width" data-ng-show="ac.current.details.hasPlaybook === false && ac.current.details.id !== ac.current.attempts.latest.id">\r\n                    <div class="em-c-alert alert-plain alert-full-height" role="alert">\r\n                        <span class="fa fa-book em-u-margin-right"></span>\r\n                        <div class="em-c-alert__body">\r\n                            <span>\r\n                                Review the most recent version to view Playbook details.\r\n                            </span>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Download mode -->\r\n            <div class="section-header-full-height"\r\n                 data-ng-if="ac.current.mode === ac.modes.download">\r\n                <div class="section-header-full-width">\r\n                    <div class="em-c-alert alert-plain alert-full-height" role="alert">\r\n                        <span class="fa fa-book em-u-margin-right"></span>\r\n                        <div class="em-c-alert__body">\r\n                            <span data-ng-show="ac.current.details.hasPlaybook === true">\r\n                                A Playbook exists for this team assessment.\r\n                            </span>\r\n                            <span data-ng-show="ac.current.details.hasPlaybook === false">\r\n                                A Playbook does not exist for this team assessment.\r\n                            </span>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class="em-l-grid__item"\r\n             data-ng-model="ac.showShareModal" data-ng-init="false">\r\n            <!-- Share -->\r\n            <div class="section-header-full-width section-header-full-height" data-ng-if="ac.current.details.isCompletedByMe === true">\r\n                <div class="em-c-alert alert-plain alert-full-height" role="alert">\r\n                    <span class="fa fa-user em-u-margin-right"></span>\r\n                    <div class="em-c-alert__body">\r\n                        This assessment was completed by you.\r\n                    </div>\r\n                    <div class="em-c-alert__actions"\r\n                         data-ng-if="ac.current.mode !== ac.modes.download">\r\n                        <a class="em-c-text-btn em-u-margin-right"\r\n                           target="_blank"\r\n                           href="/#/assessments/{{ac.assessment.id}}/teamAssessments/{{ac.current.details.id}}/export">\r\n                            Download <span class="fa fa-download fa-sm em-u-margin-left-half"></span>\r\n                        </a>\r\n                        <button class="em-c-text-btn "\r\n                                data-ng-click="ac.showShareModal = true;">\r\n                            Share <span class="fa fa-share fa-sm em-u-margin-left-half"></span>\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div data-em-share-modal\r\n                 data-link="ac.getShareAssessmentLink()"\r\n                 data-title="Share Assessment"\r\n                 data-is-open="ac.showShareModal"\r\n                 data-ng-if="ac.current.details.isCompletedByMe === true"></div>\r\n            <div class="section-header-full-width section-header-full-height" data-ng-show="ac.current.details.isCompletedByMe === false">\r\n                <div class="em-c-alert alert-plain alert-full-height" role="alert">\r\n                    <span class="fa fa-user em-u-margin-right"></span>\r\n                    <div class="em-c-alert__body">\r\n                        This assessment was completed by {{ac.current.details.owner}}\r\n                    </div>\r\n                    <div class="em-c-alert__actions">\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div class="section-header-full-width em-u-margin-bottom em-u-margin-top" data-ng-if="ac.current.attempts.list.length > 1">\r\n        <!-- Multiple Attempts -->\r\n        <div class="em-c-solid-card em-c-solid-card--compact em-c-solid-card--with-icon full-width-card">\r\n            <div class="em-c-solid-card__body em-u-display-flex" style="justify-content:space-between;">\r\n                <div class="float-left em-u-display-flex">\r\n                    <span class="fa fa-2x fa-files-o"></span>\r\n                    <h3 class="em-c-solid-card__title float-right">\r\n                        <span>Versions</span>\r\n                    </h3>\r\n                </div>\r\n                <div class="float-right">\r\n                    <h4 class="em-c-solid-card__kicker"></h4>\r\n                </div>\r\n            </div>\r\n            <div class="em-c-solid-card__footer">\r\n\r\n                <div class="em-c-table-object ">\r\n                    <div class="em-c-table-object__header">\r\n                    </div>\r\n                    <!--end em-c-table-object__header-->\r\n                    <div class="em-c-table-object__body">\r\n                        <div class="em-c-table-object__body-inner">\r\n                            <table class="em-c-table ">\r\n                                <thead class="em-c-table__header">\r\n                                    <tr class="em-c-table__header-row">\r\n                                        <th scope="col" class="em-c-table__header-cell ">Date</th>\r\n                                        <th scope="col" class="em-c-table__header-cell ">Status</th>\r\n                                        <th scope="col" class="em-c-table__header-cell ">Owner</th>\r\n                                        <th scope="col" class="em-c-table__header-cell ">Score</th>\r\n                                        <th scope="col" class="em-c-table__header-cell em-u-text-align-center" data-ng-if="ac.current.mode !== ac.modes.download">Review</th>\r\n                                    </tr>\r\n                                </thead>\r\n                                <tbody class="em-c-table__body ">\r\n                                    <tr class="em-c-table__row " data-ng-repeat="teamAssessment in ac.current.attempts.list">\r\n                                        <td class="em-c-table__cell em-js-cell em-js-cell-editable">\r\n                                            {{teamAssessment.completed !== null ? teamAssessment.completed : teamAssessment.started  | date:\'MM/dd/yyyy h:mm a\' | truncate:100}}\r\n                                        </td>\r\n                                        <td class="em-c-table__cell em-js-cell em-js-cell-editable">\r\n                                            {{teamAssessment.status.replace(\'_\',\' \')}}\r\n                                        </td>\r\n                                        <td class="em-c-table__cell em-js-cell em-js-cell-editable">\r\n                                            {{teamAssessment.owner | truncate:100}}\r\n                                        </td>\r\n                                        <td class="em-c-table__cell em-js-cell em-js-cell-editable">\r\n                                            <span ng-if="teamAssessment.completed !== null">\r\n                                                {{+teamAssessment.score * 100 | number:0}}%\r\n                                            </span>\r\n                                            <span ng-if="teamAssessment.completed === null">\r\n                                                NA\r\n                                            </span>\r\n                                        </td>\r\n                                        <td class="em-c-table__cell em-js-cell em-js-cell-editable em-u-text-align-center" data-ng-if="ac.current.mode !== ac.modes.download">\r\n                                            <button class="em-c-text-btn "\r\n                                                    data-ng-click="ac.reviewTeamAssessment(teamAssessment)"\r\n                                                    data-ng-if="ac.current.details.id !== teamAssessment.id">\r\n                                                <span class="fa fa-file fa-2x em-u-margin-left-half" title="review"></span>\r\n                                            </button>\r\n                                        </td>\r\n                                    </tr>\r\n                                </tbody>\r\n                                <tfoot class="em-c-table__footer">\r\n                                    <tr class="em-c-table__footer-row"></tr>\r\n                                </tfoot>\r\n                            </table>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>');
    $templateCache.put('app/assessment/partials/review.radar.html', '<div class="em-c-solid-card em-c-solid-card--compact em-c-solid-card--with-icon full-width-card em-u-margin-bottom-double">\r\n    <div class="em-c-solid-card__body em-u-display-inline-block">\r\n        <div class="float-left">\r\n            <span class="fa fa-2x fa-file-text"></span>\r\n            <h3 class="em-c-solid-card__title float-right">\r\n                <span>Review</span>\r\n            </h3>\r\n        </div>\r\n        <div class="float-right">\r\n        </div>\r\n    </div>\r\n    <div class="em-c-solid-card__footer">\r\n        <div data-ng-show="ac.current.details.status === \'COMPLETED\'">\r\n            <!-- Radar Chart -->\r\n            <div pd-radar-chart data-data="ac.current.radarChartData.data" data-legend="ac.current.radarChartData.legend"></div>\r\n\r\n            <!-- Loading message -->\r\n            <em-loader data-ng-show="ac.isTeamAssessmentDetailLoading === true"\r\n                       class="center"></em-loader>\r\n        </div>\r\n\r\n        <!-- In Progress message -->\r\n        <div data-ng-if="ac.current.details.status === \'IN_PROGRESS\'">\r\n            <div class="em-u-align-center vertical-center">\r\n                <h3 class="em-u-color--red em-u-text-align-center">Assessment In-Progress</h3>\r\n                <p class="em-u-text-align-center">This assessment is incomplete or has not yet been submitted. Select the Resume button below to return to the assessment in-progress.</p>\r\n\r\n                <div class="em-u-text-align-center">\r\n                    <a class="em-c-btn em-c-btn--large em-js-btn-selectable"\r\n                       href="#/assessments/{{ac.current.details.assessmentId}}/team/{{ac.current.details.teamId}}">\r\n                        <span class="em-c-btn__text">Resume Assessment</span>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>');
    $templateCache.put('app/assessment/wizard/multiple.choice.html', '<div class="em-l-container">\r\n    <div class="em-c-field ">\r\n        <h4 for="" class="em-c-field__label">\r\n            <span class="wz-question-text">{{+number + 1}}. {{question}}</span>\r\n        </h4>\r\n\r\n        <!--MC Options-->\r\n        <div class="em-c-field__body">\r\n            <ul class="em-c-option-list ">\r\n                <li class="em-c-option-list__item em-js-radio-trigger-parent"\r\n                    data-ng-model="answers"\r\n                    data-ng-repeat="answer in answers">\r\n                    <label class="em-c-input-group" for="radio-{{answer.id}}">\r\n                        <input id="radio-{{answer.id}}" type="radio" name="radio-{{questionId}}" class="em-c-input-group__control em-js-radio-trigger"\r\n                               data-ng-model="selectedAnswer"\r\n                               data-ng-value="{{answer.id}}"\r\n                               data-ng-change="selectAnswer(answer)">\r\n                        <span class="em-c-input-group__text">{{answer.text}}</span>\r\n                    </label>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n\r\n        <!--Comment-->\r\n        <div class="em-c-field ">\r\n            <label for="" class="em-c-field__label">Comment</label>\r\n            <div class="em-c-field__body">\r\n                <textarea class="em-c-textarea " id="" placeholder="Optional comment..." value="" rows="2"\r\n                          data-ng-model="comment"></textarea>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>');
    $templateCache.put('app/assessment/wizard/wizard.html', '<div class="em-l-container">\r\n\r\n    <section class="em-c-section" data-ng-class="{\'em-is-disabled\': showSaveAndExitModal}">\r\n\r\n        <div class="wrapper">\r\n            <!--Header-->\r\n            <header class="em-c-section__header section-header-full-width">\r\n                <div class="em-l-grid__item float-left">\r\n                    <h2 class="em-c-section__title">{{title}}</h2>\r\n                </div>\r\n                <div class="em-l-grid__item float-right"\r\n                     data-ng-if="currentStep().type !== \'END\'">\r\n                    <div pb-wizard-status\r\n                         data-steps="steps"\r\n                         data-show-invalid-styles="currentStep().type === \'REVIEW\'"></div>\r\n                </div>\r\n            </header>\r\n\r\n            <!--Body-->\r\n            <div class="em-c-section__body">\r\n                <div>\r\n                    <div data-ng-if="currentStep().type === \'QUESTION\'"\r\n                         data-pb-wizard-question-page\r\n                         data-page="currentStep().currentPage">\r\n                    </div>\r\n                    <div data-ng-if="currentStep().type === \'START\' || currentStep().type === \'REVIEW\' || currentStep().type === \'END\'">\r\n                        <!--data-ng-include="\'app/assessment/wizard/wizard.review.page.html\'"\r\n                        data-on-load="isValid = currentStep().currentPage.isValid"\r\n                         >-->\r\n                        <div class="em-l-linelength-container em-u-align-center">\r\n                            <p data-ng-repeat="item in currentStep().currentPage.content">{{item}}</p>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <!--Footer-->\r\n        <footer class="em-c-section__footer wz-footer sticky-footer">\r\n\r\n            <!-- Alerts -->\r\n            <div class="em-c-alert em-c-alert--error" role="alert" data-ng-show="message !== null">\r\n                <svg class="em-c-icon em-c-alert__icon">\r\n                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/em-icons.svg#icon-warning"></use>\r\n                </svg>\r\n                <div class="em-c-alert__body">\r\n                    {{message}}\r\n                </div>\r\n            </div>\r\n\r\n            <div class="em-l-grid em-l-grid--1-to-3up ">\r\n                <div class="em-l-grid__item">\r\n                    <div class="em-c-btn-bar vertical-center">\r\n                        <ul class="em-c-btn-bar__list float-left">\r\n                            <li class="em-c-btn-bar__item "\r\n                                data-ng-repeat-start="button in currentStep().currentPage.navigation.left | orderBy: \'order\' | filter:{hidden : false}"\r\n                                data-ng-if="!button.hidden">\r\n                                <button class="em-c-btn em-c-btn--small em-js-btn-selectable"\r\n                                        data-ng-click="button.func()"\r\n                                        data-ng-disabled="!button.enabled || disableButtons() === true">\r\n                                    <span class="em-c-btn__text">{{button.text}}</span>\r\n                                </button>\r\n                            </li>\r\n                            <li class="em-c-btn-bar__item em-c-btn-bar__item--separator"\r\n                                data-ng-repeat-end></li>\r\n                        </ul>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="em-l-grid__item">\r\n                    <!--Category-->\r\n                    <div class="wz-footer-label em-u-align-center em-u-text-align-center">\r\n                        <h5>{{currentStep().name}}</h5>\r\n                        <h6>\r\n                            <span>{{currentStep().currentPage.navigationStatus}}</span>\r\n                        </h6>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class="em-l-grid__item">\r\n                    <div class="em-c-btn-bar vertical-center">\r\n                        <ul class="em-c-btn-bar__list float-right">\r\n                            <li class="em-c-btn-bar__item em-c-btn-bar__item--separator"\r\n                                data-ng-repeat-start="button in currentStep().currentPage.navigation.right | orderBy: \'order\' | filter:{hidden : false}"></li>\r\n                            <li class="em-c-btn-bar__item "\r\n                                data-ng-repeat-end\r\n                                data-ng-if="!button.hidden">\r\n                                <button class="em-c-btn em-c-btn--small em-js-btn-selectable"\r\n                                        data-ng-click="button.func()"\r\n                                        data-ng-disabled="!button.enabled || disableButtons() === true">\r\n                                    <span class="em-c-btn__text">{{button.text}}</span>\r\n                                </button>\r\n                            </li>\r\n                        </ul>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </footer>\r\n    </section>\r\n    <section>\r\n        <!-- Modals -->\r\n        <div em-modal-confirm\r\n             data-title="Save and Exit Assessment"\r\n             data-confirm-func="confirmSaveAndExit()"\r\n             data-is-open="showSaveAndExitModal">\r\n            <p>You have chosen to save the input provided thus far and exit the assessment.</p>\r\n            <p>Select OK below to save all information and return to the Assessments page, or select Cancel to return to the current assessment.</p>\r\n        </div>\r\n\r\n        <div em-modal-confirm\r\n             data-title="Cancel Assessment"\r\n             data-confirm-func="confirmCancel()"\r\n             data-is-open="showCancelModal">\r\n            <p>You have chosen to cancel this assessment. If you are sure you want to cancel and delete all input provided thus far, click OK below.</p>\r\n            <p>If you would like to save your assessment and finish it later, select Cancel below, and then select \'Save and Exit\' from the current assessment screen.</p>\r\n        </div>\r\n    </section>\r\n</div>');
    $templateCache.put('app/assessment/wizard/wizard.question.page.html', '<div data-ng-repeat="question in page.questions"\r\n     data-pb-multiple-choice-question\r\n     data-question="{{question.questionText}}"\r\n     data-question-id="{{question.questionId}}"\r\n     data-number="{{question.questionOrder}}"\r\n     data-answers="question.answers"\r\n     data-comment="question.comment"\r\n     data-is-answered="question.isAnswered"\r\n     data-selected-answer="question.selectedAnswerId"></div>');
    $templateCache.put('app/assessment/wizard/wizard.status.html', '<ol class="em-c-progress-tracker">\r\n    <li class="em-c-progress-tracker__item"\r\n        data-ng-repeat="step in stepsToShow"\r\n        data-ng-class="{\'em-is-complete\': step.isCompleted,\r\n                        \'em-is-current\': step.isCurrentStep,\r\n                        \'wz-invalid-step\': showInvalidStyles === true && !step.isCompleted }"\r\n        data-ng-click="step.setCurrentStep()"\r\n        style="width: {{stepWidthPercentage}}%; min-width:60px;">\r\n        <div class="em-c-progress-tracker__number">\r\n            <span class="fa fa-lg" \r\n                  data-ng-class="{\'fa-check visible\': step.isCompleted, \r\n                                  \'fa-times visible\': showInvalidStyles === true && !step.isCompleted}"></span>\r\n        </div>\r\n        <div class="em-c-progress-tracker__label">\r\n            {{step.name}}\r\n        </div>\r\n    </li>\r\n</ol>');
    $templateCache.put('app/playbook/partials/details.html', '<!-- Info -->\r\n<div id="playbook-details">\r\n    <div class="em-l-grid em-l-grid--2up ">\r\n        <!-- Instructions -->\r\n        <div class="em-l-grid__item em-u-text-align-left">\r\n            <h2 class="">{{assessment.name}}</h2>\r\n        </div>\r\n        <!--<div class="em-l-grid__item em-u-text-align-right">\r\n            <a class="em-c-btn em-c-btn--primary" href="/{{assessment.id}}">\r\n                <span class="em-c-btn__text">Start Assessment!</span>\r\n            </a>\r\n        </div>-->\r\n    </div>\r\n\r\n    <div class="em-l-grid em-l-grid--2up ">\r\n        <!-- Instructions -->\r\n        <div class="em-l-grid__item show-new-lines">\r\n            {{assessment.playbookInstructions.trim()}}\r\n        </div>\r\n\r\n        <!-- IDK -->\r\n        <div class="em-l-grid__item em-u-text-align-right box-border">\r\n            <a class="em-c-btn em-c-btn--primary em-u-align-center button-wide vertical-center em-u-margin-bottom" href="/#/assessments/{{assessment.id}}/playbook">\r\n                <span class="em-c-btn__text">Create new Playbook</span>\r\n            </a>\r\n            <br/>\r\n            <a class="em-c-btn em-c-btn--primary em-u-align-center button-wide vertical-center em-u-margin-top" href="/#/assessments/{{assessment.id}}/playbooks">\r\n                <span class="em-c-btn__text">View Playbooks</span>\r\n            </a>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div data-ng-show="ac.loaded === true && ac.message !== null">\r\n    <div class="em-c-alert em-c-alert--error" role="alert" data-ng-show="message !== null">\r\n        <svg class="em-c-icon em-c-alert__icon">\r\n            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/em-icons.svg#icon-warning"></use>\r\n        </svg>\r\n        <div class="em-c-alert__body">\r\n            {{ac.message}}\r\n        </div>\r\n    </div>\r\n</div>');
    $templateCache.put('app/playbook/partials/edit.html', '<div class="em-l-grid em-l-grid--2up ">\r\n    <!-- Team Name & Info -->\r\n    <div class="em-l-grid__item">\r\n        <div class="em-c-solid-card em-c-solid-card--compact em-c-solid-card--with-icon">\r\n            <div class="em-c-solid-card__body em-u-display-flex" style="justify-content:space-between;">\r\n                <div class="float-left em-u-display-flex">\r\n                    <span class="fa fa-2x fa-users"></span>\r\n                    <h3 class="em-c-solid-card__title float-right">\r\n                        <span>{{pc.current.details.teamName}}</span>\r\n                    </h3>\r\n                </div>\r\n                <div class="float-right">\r\n                    <h4 class="em-c-solid-card__kicker">TEAM</h4>\r\n                </div>\r\n            </div>\r\n            <div class="em-c-solid-card__footer">\r\n                <span style="word-break:break-word">{{pc.current.details.teamAssessment.teamInfo}}</span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <!-- Owner & Last Updated -->\r\n    <div class="em-l-grid__item">\r\n        <div class="em-c-solid-card em-c-solid-card--compact em-c-solid-card--with-icon">\r\n            <div class="em-c-solid-card__body em-u-display-flex" style="justify-content:space-between;">\r\n                <div class="float-left em-u-display-flex">\r\n                    <span class="fa fa-2x fa-user"></span>\r\n                    <h3 class="em-c-solid-card__title float-right">\r\n                        <span>{{pc.current.details.ownerName}}</span>\r\n                    </h3>\r\n                </div>\r\n                <div class="float-right">\r\n                    <h4 class="em-c-solid-card__kicker em-u-margin-bottom-none float-right">OWNER</h4>\r\n                    <div data-ng-if="pc.current.details.canEditOwner === true && pc.current.mode === pc.modes.edit" data-ng-model="showOwnerModal" data-ng-init="false">\r\n                        <button class="em-c-text-btn float-right"\r\n                                type="button"\r\n                                data-ng-click="showOwnerModal = true">\r\n                            <span class="em-c-btn__text">\r\n                                Change Owner\r\n                            </span>\r\n                        </button>\r\n\r\n                        <div em-modal-confirm\r\n                             data-title="Update Playbook Owner"\r\n                             data-confirm-func="pc.ownerForm.onSave()"\r\n                             data-confirm-text="Save"\r\n                             data-is-open="showOwnerModal">\r\n                            <div data-ng-include="\'app/playbook/partials/edit.owner.modal.html\'"></div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class="em-c-solid-card__footer">\r\n                <span>{{pc.current.details.lastUpdated | date:\'MM/dd/yyyy h:mm a\'}} <i>(Last Updated)</i></span>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<!-- Share -->\r\n<div class="section-header-full-width em-u-margin-top-half" data-ng-if="pc.current.details.isOwnedByMe === true" data-ng-model="pc.showShareModal" data-ng-init="false">\r\n    <div class="em-c-alert alert-plain" role="alert">\r\n        <span class="fa fa-user em-u-margin-right"></span>\r\n        <div class="em-c-alert__body">\r\n            This playbook is owned by you.\r\n        </div>\r\n        <div class="em-c-alert__pctions" ng-show="pc.current.mode === pc.modes.edit">\r\n            <a class="em-c-text-btn em-u-margin-right"\r\n                    target="_blank"\r\n                    href="/#/assessments/{{pc.assessment.id}}/playbooks/{{pc.current.details.id}}/export">\r\n                Download <span class="fa fa-download fa-sm em-u-margin-left-half"></span>\r\n            </a>\r\n            <button class="em-c-text-btn "\r\n                    data-ng-click="pc.showShareModal = true;">\r\n                Share <span class="fa fa-share fa-sm em-u-margin-left-half"></span>\r\n            </button>\r\n        </div>\r\n    </div>\r\n\r\n    <div data-em-share-modal\r\n         data-link="pc.getSharePlaybookLink()"\r\n         data-title="Share Playbook"\r\n         data-is-open="pc.showShareModal"></div>\r\n</div>\r\n\r\n<!-- Versions -->\r\n<div class="section-header-full-width em-u-margin-bottom em-u-margin-top-half" data-ng-if="pc.current.versions.list.length > 1">\r\n    <div class="em-c-solid-card em-c-solid-card--compact em-c-solid-card--with-icon full-width-card">\r\n        <div class="em-c-solid-card__body em-u-display-flex" style="justify-content:space-between;">\r\n            <div class="float-left em-u-display-flex">\r\n                <span class="fa fa-2x fa-files-o"></span>\r\n                <h3 class="em-c-solid-card__title float-right">\r\n                    <span>Versions</span>\r\n                </h3>\r\n            </div>\r\n            <div class="float-right">\r\n                <h4 class="em-c-solid-card__kicker"></h4>\r\n            </div>\r\n        </div>\r\n        <div class="em-c-solid-card__footer">\r\n\r\n            <div class="em-c-table-object ">\r\n                <div class="em-c-table-object__header">\r\n                </div>\r\n                <!--end em-c-table-object__header-->\r\n                <div class="em-c-table-object__body">\r\n                    <div class="em-c-table-object__body-inner">\r\n                        <table class="em-c-table ">\r\n                            <thead class="em-c-table__header">\r\n                                <tr class="em-c-table__header-row">\r\n                                    <th scope="col" class="em-c-table__header-cell ">Created</th>\r\n                                    <th scope="col" class="em-c-table__header-cell ">Owner</th>\r\n                                    <th scope="col" class="em-c-table__header-cell ">Status</th>\r\n                                    <th scope="col" class="em-c-table__header-cell em-u-text-align-center" data-ng-if="pc.current.mode === pc.modes.edit">Review</th>\r\n                                </tr>\r\n                            </thead>\r\n                            <tbody class="em-c-table__body ">\r\n                                <tr class="em-c-table__row " data-ng-repeat="playbook in pc.current.versions.list">\r\n                                    <td class="em-c-table__cell em-js-cell em-js-cell-editable">\r\n                                        {{playbook.created | date:\'MM/dd/yyyy h:mm a\' }}\r\n                                    </td>\r\n                                    <td class="em-c-table__cell em-js-cell em-js-cell-editable">\r\n                                        {{playbook.ownerName | truncate:100}}\r\n                                    </td>\r\n                                    <td class="em-c-table__cell em-js-cell em-js-cell-editable">\r\n                                        <span ng-show="playbook.isArchived === true"><i>Archived</i></span>\r\n                                        <span ng-show="playbook.isArchived === false">Current</span>\r\n                                    </td>\r\n                                    <td class="em-c-table__cell em-js-cell em-js-cell-editable em-u-text-align-center" data-ng-if="pc.current.mode === pc.modes.edit">\r\n                                        <button class="em-c-text-btn "\r\n                                                data-ng-click="pc.getPlaybook(playbook.id)"\r\n                                                data-ng-if="pc.current.details.id !== playbook.id">\r\n                                            <span class="fa fa-file fa-2x em-u-margin-left-half" title="review"></span>\r\n                                        </button>\r\n                                    </td>\r\n                                </tr>\r\n                            </tbody>\r\n                            <tfoot class="em-c-table__footer">\r\n                                <tr class="em-c-table__footer-row"></tr>\r\n                            </tfoot>\r\n                        </table>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<div class="em-c-solid-card em-c-solid-card--compact em-c-solid-card--with-icon full-width-card">\r\n    <div class="em-c-solid-card__body em-u-display-inline-block">\r\n        <div class="float-left">\r\n            <span class="fa fa-2x fa-th-list"></span>\r\n            <h3 class="em-c-solid-card__title float-right">\r\n                <span>Committments</span>\r\n            </h3>\r\n        </div>\r\n        <div class="float-right">\r\n        </div>\r\n    </div>\r\n    <div class="em-c-solid-card__footer"\r\n         data-ng-if="pc.loaded === true"\r\n         data-ng-controller="CommitmentController as cc"\r\n         data-ng-init="cc.activate(pc.current.details.id, pc.current.details.commitments, pc.current.details.teamAssessment)">\r\n\r\n        <!-- Commitment error message -->\r\n        <div class="em-c-alert em-c-alert--error em-u-margin-bottom" role="alert"\r\n             data-ng-show="cc.error !== null">\r\n            <svg class="em-c-icon em-c-alert__icon">\r\n                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-warning"></use>\r\n            </svg>\r\n            <div class="em-c-alert__body">\r\n                {{cc.error}}\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Commitment info message -->\r\n        <div data-ng-show="cc.loaded === true && cc.info !== null"\r\n             class="em-u-margin-bottom">\r\n            <div class="em-c-alert" role="alert">\r\n                <div class="em-c-alert__body">\r\n                    {{cc.info}}\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Commitment list -->\r\n        <table data-ng-show="cc.loaded === true && cc.commitments.length > 0"\r\n               class="table-commitments table-ellipses">\r\n            <thead>\r\n                <tr>\r\n                    <th>Name</th>\r\n                    <th>Category</th>\r\n                    <th>Description</th>\r\n                    <th>Status</th>\r\n                    <th data-ng-show="pc.current.details.isOwnedByMe === true && pc.current.details.isArchived === false && pc.current.mode === pc.modes.edit" class="em-u-text-align-center">Edit</th>\r\n                    <th data-ng-show="pc.current.details.isOwnedByMe === true && pc.current.details.isArchived === false && pc.current.mode === pc.modes.edit" class="em-u-text-align-center">Delete</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n                <tr data-ng-repeat="commitment in pc.current.details.commitments | orderBy: \'categoryName\'"\r\n                    pb-commitment\r\n                    commitment="commitment"\r\n                    playbook-id="pc.current.details.id"></tr>\r\n            </tbody>\r\n        </table>\r\n        <div data-ng-show="cc.loaded === true && cc.commitments.length === 0">\r\n            <div class="em-c-alert alert-plain" role="alert">\r\n                <div class="em-c-alert__body" data-ng-if="cc.enableSuggestions === true">\r\n                    <div ng-show="filteredCategories.length > 0">\r\n                        You have not made any commitments yet. Start by adding a few commitments for the assessment categories you could improve on:\r\n                        <ul class="em-c-bulleted-list">\r\n                            <li class="em-c-bulleted-list__item"\r\n                                data-ng-repeat="category in (cc.categories | filter: { needsCommitments: true }) as filteredCategories">{{category.name}}({{+category.score * 100 | number:0}}%)</li>\r\n                        </ul>\r\n                    </div>\r\n                    <div ng-show="filteredCategories.length == 0">\r\n                        You have not made any commitments yet.\r\n                    </div>\r\n                </div>\r\n                <div class="em-c-alert__body" data-ng-if="cc.enableSuggestions === false">\r\n                    You have not made any commitments yet.\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class="em-u-margin-top pull-right" data-ng-show="pc.current.details.isOwnedByMe === true && pc.current.details.isArchived === false && pc.current.mode === pc.modes.edit">\r\n            <button class="em-c-btn em-c-btn--primary"\r\n                    data-ng-click="cc.showAddCommitmentForm()">\r\n                Add Commitment <span class="fa fa-plus-circle fa-lg em-u-margin-left-half"></span>\r\n            </button>\r\n        </div>\r\n\r\n        <div class="em-is-closed"\r\n             pb-commitment-modal\r\n             title="{{cc.form.title}}"\r\n             save-func="cc.form.onSave()"\r\n             close-func="cc.form.onClose()"\r\n             is-open="cc.form.show">\r\n            <div ng-include="\'app/playbook/commitment/partials/edit.html\'"></div>\r\n        </div>\r\n    </div>\r\n</div>');
    $templateCache.put('app/playbook/partials/edit.owner.modal.html', '<form name="pc.ownerForm.form" novalidate role="form">\r\n    <div class="em-u-margin-bottom-double">\r\n        <span>\r\n            Change the owner of this playbook to another user. By doing so, only the new owner will be able to edit this playbook. The playbook will still\r\n            appear under your Shared Playbooks list.\r\n        </span>\r\n    </div>\r\n    <div>\r\n        <!--Users-->\r\n        <div class="em-c-field em-u-margin-bottom"\r\n             data-ng-class="{\'em-has-error\': pc.ownerForm.submitted && pc.ownerForm.form.user.$error.required}">\r\n            <label for="status" class="em-c-field__label">Users:</label>\r\n            <div class="em-c-field__body">\r\n                <select name="user" id="user" class="em-c-select em-u-width-100"\r\n                        ng-options="user.Id as user.FriendlyName + \' (\' + user.EmailAddress + \')\' for user in pc.ownerForm.users track by user.Id"\r\n                        ng-model="pc.current.details.ownerId"\r\n                        required></select>\r\n            </div>\r\n            <div class="em-c-field__note" data-ng-show="pc.ownerForm.submitted && pc.ownerForm.form.user.$error.required">The status is required.</div>\r\n        </div>\r\n    </div>\r\n</form>');
    $templateCache.put('app/playbook/partials/list.html', '\r\n<ul class="em-c-accordion">\r\n    <li em-accordian data-title="My playbooks" data-is-open="true">\r\n        <div data-ng-repeat="playbook in (filteredItems = (pc.playbooks | filter: {latest: {isOwnedByMe: true}}))">\r\n            <div class="em-u-padding em-u-clickable"\r\n                 data-ng-click="pc.getPlaybook(playbook.latest.id)">\r\n                <span data-ng-class="{\'em-u-color--blue\': playbook.latest.teamName === pc.current.details.teamName }">\r\n                    <span class="em-u-margin-right-half">{{playbook.latest.teamName}}</span>\r\n                </span>\r\n            </div>\r\n        </div>\r\n        <div data-ng-if="filteredItems.length === 0"\r\n             class="em-u-padding">\r\n            <span>You have not created any playbooks.</span>\r\n        </div>\r\n    </li>\r\n    <li data-em-accordian data-title="Shared with Me" data-is-open="true">\r\n        <div data-ng-repeat="playbook in (filteredSharedItems = (pc.playbooks | filter: {latest: {isOwnedByMe: false}}))">\r\n            <div class="em-u-padding em-u-clickable"\r\n                 data-ng-click="pc.getPlaybook(playbook.latest.id)">\r\n                <span data-ng-class="{\'em-u-color--blue\': playbook.latest.teamName === pc.current.details.teamName }">\r\n                    <span class="em-u-margin-right-half">{{playbook.latest.teamName}}</span>\r\n                </span>\r\n            </div>\r\n        </div>\r\n        <div data-ng-if="filteredSharedItems.length === 0"\r\n             class="em-u-padding">\r\n            <span>No playbooks have been shared with you.</span>\r\n        </div>\r\n    </li>\r\n</ul>');
    $templateCache.put('app/playbook/partials/new.html', '<form name="pc.newPlaybookForm.form" novalidate role="form">\r\n    <div class="em-u-margin-bottom-double">\r\n        <span>\r\n            An Evolve Playbook represents your team, application or project\'s commitment to grow its ability\r\n            to deliver highly functioning software more efficiently and frequently.\r\n        </span>\r\n    </div>\r\n    <div ng-show="pc.loaded === true">\r\n        \r\n        <!-- Team Dropdown -->\r\n        <div class="em-c-field em-u-margin-bottom"\r\n             data-ng-class="{\'em-has-error\': pc.newPlaybookForm.submitted && pc.newPlaybookForm.form.team.$error.required}"\r\n             data-ng-if="true">\r\n            <label for="team-name-input" class="em-c-field__label">Team, application or project:</label>\r\n            <div class="em-c-field__body">\r\n                <select name="team" id="team" class="em-c-select select-wide"\r\n                        ng-options="t.name | truncate:50 for t in pc.newPlaybookForm.teams track by t.id"\r\n                        required\r\n                        ng-model="pc.newPlaybookForm.selected"\r\n                        ng-change="pc.newPlaybookForm.selectTeam(pc.newPlaybookForm.selected)">\r\n                    <option value="">Select Team...</option>\r\n                </select>\r\n                <svg class="em-c-icon em-c-field__icon" style="left:51%"\r\n                     data-ng-show="pc.newPlaybookForm.submitted && pc.newPlaybookForm.form.team.$error.required">\r\n                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-warning"></use>\r\n                </svg>\r\n            </div>\r\n            <div class="em-c-field__note" data-ng-show="pc.newPlaybookForm.submitted && pc.newPlaybookForm.form.team.$error.required">The team is required.</div>\r\n        </div>\r\n\r\n        <!-- Version Dropdown -->\r\n        <div class="em-c-field em-u-margin-bottom"\r\n             data-ng-class="{\'em-has-error\': pc.newPlaybookForm.submitted && pc.newPlaybookForm.form.teamAssessment.$error.required}"\r\n             ng-show="pc.newPlaybookForm.showVersionSelector === true">\r\n            <label for="team-name-input" class="em-c-field__label">Team Assessment Attempt:</label>\r\n            <div class="em-c-field__body">\r\n                <select name="teamAssessment" id="teamAssessment" class="em-c-select select-wide"\r\n                        ng-options="ta.completed === null ? \r\n                                        (\'In Progress - started on \' + (ta.started | date:\'MM/dd/yyyy at h:mm a\') + \' by \' + ta.owner) : \r\n                                        (\'Completed on \' + (ta.completed | date:\'MM/dd/yyyy at h:mm a\') + \' by \' + ta.owner)\r\n                                    for ta \r\n                                    in pc.newPlaybookForm.selected.allTeamAssessmentAttempts \r\n                                    track by ta.id"\r\n                        required\r\n                        playbook-validator\r\n                        ng-model="pc.current.details.teamAssessment"\r\n                        data-ng-change="pc.newPlaybookForm.selectTeamAssessment(pc.newPlaybookForm.selected.selectedTeamAssessmentAttempt)">\r\n                    <option value="">Select Version...</option>\r\n                </select>\r\n                <svg class="em-c-icon em-c-field__icon" style="left:51%"\r\n                     data-ng-show="pc.newPlaybookForm.submitted && pc.newPlaybookForm.form.teamAssessment.$error.required">\r\n                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-warning"></use>\r\n                </svg>\r\n            </div>\r\n            <div class="em-c-field__note" data-ng-show="pc.newPlaybookForm.submitted && pc.newPlaybookForm.form.teamAssessment.$error.required">The team is required.</div>\r\n        </div>\r\n\r\n        <div class="section-header-full-width" data-ng-show="pc.newPlaybookForm.hasSelectedTeam() === true">\r\n\r\n            <!-- Info if playbook already exists. -->\r\n            <div class="em-c-alert em-c-alert--error" role="alert" data-ng-if="pc.newPlaybookForm.form.$error.completed">\r\n                <div class="em-c-alert__body">\r\n                    The assessment for this team is still in progress. You can create a playbook once it is completed and submitted.\r\n                </div>\r\n                <div class="em-c-alert__actions">\r\n                    <a class="em-c-text-btn"\r\n                       href="/#/assessments/{{pc.newPlaybookForm.form.teamAssessment.$viewValue.assessmentId}}/team/{{pc.newPlaybookForm.form.teamAssessment.$viewValue.teamId}}/edit">\r\n                        Resume Assessment <span class="fa fa-play-circle-o em-u-margin-left-half"></span>\r\n                    </a>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Playbook already exists. -->\r\n            <div class="em-c-alert em-c-alert--error" role="alert" data-ng-if="pc.newPlaybookForm.form.$error.noPlaybook">\r\n                <div class="em-c-alert__body">\r\n                    A Playbook already exists for this team.\r\n                </div>\r\n                <div class="em-c-alert__actions">\r\n                    <button class="em-c-text-btn"\r\n                            ng-click="pc.navigateToPlaybookDetails(pc.newPlaybookForm.form.teamAssessment.$viewValue.playbookId)">\r\n                        <!--TODO: allow navigation directly to playbook -->\r\n                        Edit Playbook <span class="fa fa-file em-u-margin-left-half"></span>\r\n                    </button>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- Attempt selected is not the most recent attempt. -->\r\n            <div class="em-c-alert em-c-alert--error" role="alert" data-ng-if="pc.newPlaybookForm.form.$error.latestAttempt">\r\n                <div class="em-c-alert__body">\r\n                    There is a more recent, completed attempt for this team. A playbook can only be created for the most recent, completed attempt.\r\n                    Please select the latest attempt.\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class="em-c-alert em-c-alert--error" role="alert" data-ng-show="pc.message !== null">\r\n            <svg class="em-c-icon em-c-alert__icon">\r\n                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-warning"></use>\r\n            </svg>\r\n            <div class="em-c-alert__body">\r\n                {{pc.message}}\r\n            </div>\r\n        </div>\r\n\r\n        <div id="form-buttons" class="em-u-margin-top-quad">\r\n            <button class="em-c-btn em-u-align-left float-left"\r\n                    type="button"\r\n                    data-ng-click="pc.newPlaybookForm.cancel()">\r\n                <span class="em-c-btn__text">Cancel</span>\r\n            </button>\r\n            <button class="em-c-btn em-c-btn--primary float-right"\r\n                    type="button"\r\n                    data-ng-click="pc.createPlaybook()"\r\n                    data-ng-disabled="pc.newPlaybookForm.form.$valid === false">\r\n                <span class="em-c-btn__text">Create</span>\r\n            </button>\r\n        </div>\r\n    </div>\r\n</form>');
    $templateCache.put('app/unity-angular/accordian/accordian.html', '');
    $templateCache.put('app/unity-angular/accordian/accordian.item.html', '<li class="em-c-accordion__item em-js-accordion-item"\r\n    data-ng-class="{\'em-is-closed\': isOpen === false}">\r\n    <div class="em-c-accordion__header">\r\n        <a class="em-c-accordion__title em-js-accordion-trigger"\r\n           data-ng-click="isOpen = !isOpen">\r\n            <svg class="em-c-icon em-c-accordion__icon"\r\n                 data-ng-show="isOpen === false">\r\n                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-caret-down"></use>\r\n            </svg>\r\n            <svg class="em-c-icon em-c-accordion__icon"\r\n                 data-ng-show="isOpen === true">\r\n                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-caret-down"></use>\r\n            </svg>\r\n            <span class="em-c-accordion__title-text">{{title}}</span>\r\n        </a>\r\n    </div>\r\n    <div class="em-c-accordion__body">\r\n        <div ng-transclude></div>\r\n    </div>\r\n</li>');
    $templateCache.put('app/unity-angular/badge/badge.html', '\r\n<span class="em-c-badge"\r\n      ng-class="{\r\n          \'em-c-badge--positive\': vm.positive,\r\n          \'em-c-badge--negative\': vm.negative,\r\n          \'em-c-badge--caution\': vm.caution\r\n      }"\r\n      ng-transclude>\r\n</span>');
    $templateCache.put('app/unity-angular/date-picker/date-picker.html', '<input type="text" \r\n       name="{{vm.name}}" \r\n       ng-model="vm.model"/>\r\n<em-icon is="calendar" ng-if="vm.showIcon"\r\n         style="position:absolute; top:55%; right: 2%;"></em-icon>');
    $templateCache.put('app/unity-angular/expandable-button/expandable-button.html', '\r\n<div class="em-c-expandable-button"\r\n     ng-class="{\r\n         \'em-is-active\': vm.isActive\r\n     }">\r\n    <button class="em-c-btn em-c-btn--is-expandable"\r\n            ng-class="{\r\n                \'em-c-btn--primary\': vm.primary,\r\n                \'em-c-btn--small\': vm.small,\r\n            }"\r\n            ng-click="vm.isActive = !vm.isActive">\r\n        <div class="em-c-btn__inner">\r\n            <em-icon is="x"\r\n                     class="em-c-btn__icon"\r\n                     ng-if="vm.plusIcon">\r\n            </em-icon>\r\n            <span class="em-c-btn__text">{{ vm.isActive ? vm.activeLabel : vm.label }}</span>\r\n            <em-icon is="caret-right"\r\n                     class="em-c-btn__icon"\r\n                     ng-if="!vm.plusIcon">\r\n            </em-icon>\r\n        </div>\r\n    </button>\r\n    <div class="expandable-target"\r\n         ng-transclude>\r\n    </div>\r\n</div>');
    $templateCache.put('app/unity-angular/field/field-body.html', '\r\n<div class="em-c-field__body"\r\n     ng-class="{\r\n        \'has-icon\': vm.hasIcon\r\n     }">\r\n    <div ng-transclude></div>\r\n    <em-icon is="ban"           ng-show="vm.disabled"></em-icon>\r\n    <em-icon is="lock"          ng-show="!vm.disabled && vm.readonly"></em-icon>\r\n    <em-icon is="warning"       ng-show="!vm.disabled && !vm.readonly && vm.error"></em-icon>\r\n    <em-icon is="circle-check"  ng-show="!vm.disabled && !vm.readonly && !vm.error && vm.valid"></em-icon>\r\n</div>');
    $templateCache.put('app/unity-angular/field/field-messages.html', '\r\n<div ng-messages="vm.model.$error"\r\n     ng-show="!vm.field.disabled && !vm.field.readonly && vm.model.$touched">\r\n    <em-field-note>\r\n        <span ng-if="vm.required"   ng-message="required">  Required                        </span>\r\n        <span ng-if="vm.number"     ng-message="number">    Only numbers allowed            </span>\r\n        <span ng-if="vm.min"        ng-message="min">       Only positive numbers allowed   </span>\r\n        <span ng-if="vm.minlength"  ng-message="minlength"> Too short                       </span>\r\n        <span ng-if="vm.maxlength"  ng-message="maxlength"> Too long                        </span>\r\n        <span ng-if="vm.unique"     ng-message="unique">    Must be unique                  </span>\r\n    </em-field-note>\r\n</div>');
    $templateCache.put('app/unity-angular/field/field.html', '\r\n<div class="em-c-field"\r\n     ng-transclude\r\n     ng-class="{\r\n        \'em-is-valid\':    !vm.disabled && !vm.readonly && !vm.error && vm.valid,\r\n        \'em-has-error\':   !vm.disabled && !vm.readonly &&  vm.error,\r\n        \'em-is-disabled\':  vm.disabled || vm.readonly,\r\n        \'em-c-field--toggle\': vm.toggle\r\n     }">\r\n</div>');
    $templateCache.put('app/unity-angular/footer/footer-link.html', '\r\n<li class="em-c-multicolumn-nav__item">\r\n    <a href="{{href}}" class="em-c-multicolumn-nav__link" ng-transclude></a>\r\n</li>');
    $templateCache.put('app/unity-angular/footer/footer-links.html', '\r\n<ul role="navigation"\r\n    class="em-c-multicolumn-nav"\r\n    ng-class="{\r\n        \'em-c-multicolumn-nav--three\': vm.type === \'three\',\r\n        \'em-c-multicolumn-nav--horizontal\': vm.type === \'horizontal\'\r\n    }"\r\n    ng-transclude></ul>');
    $templateCache.put('app/unity-angular/footer/footer.html', '\r\n<footer class="em-c-footer" role="contentinfo">\r\n    <div class="em-l-container">\r\n        <div class="em-c-footer__inner" ng-transclude></div>\r\n    </div>\r\n</footer>');
    $templateCache.put('app/unity-angular/icon/icon.html', '\r\n<svg class="em-c-icon"\r\n     ng-class="{\r\n        \'em-c-icon--small\': vm.isSmall,\r\n        \'em-c-field__icon\': vm.isField,\r\n        \'em-c-table__icon\': vm.isTable\r\n     }">\r\n    <use xmlns:xlink="http://www.w3.org/1999/xlink"\r\n         xlink:href="{{vm.href || \'\'}}"></use>\r\n</svg>');
    $templateCache.put('app/unity-angular/loader/loader.html', '\r\n<div class="em-c-loader" ng-switch="type">\r\n    <div ng-switch-when="spinner" class="spinner"></div>\r\n    <img ng-switch-default src="images/icon-spinner.svg" alt="Loading" />\r\n</div>');
    $templateCache.put('app/unity-angular/logo/logo.html', '\r\n<svg class="em-c-logo" xmlns="http://www.w3.org/2000/svg" viewBox="63 150.1 234 59.8" enable-background="new 63 150.1 234 59.8">\r\n    <path d="M145.7 156.5c-3.3 0-5 1.7-5.6 2.1v-1.5h-4.5v18.2h5v-10.1c0-2.6 1.4-4 3.5-4 2.2 0 3.5 1.5 3.5 4v10.1h5v-11.5c0-4.5-3.1-7.3-6.9-7.3zM196.5 156.5c-5.6 0-9.9 4.4-9.9 9.7 0 5.3 4.3 9.7 9.9 9.7 5.6 0 9.9-4.4 9.9-9.7 0-5.3-4.2-9.7-9.9-9.7zm0 14.3c-2.7 0-4.5-2.1-4.5-4.6 0-2.5 1.9-4.6 4.5-4.6 2.7 0 4.5 2.1 4.5 4.6.2 2.5-1.7 4.6-4.5 4.6zM122.5 156.5c-5.6 0-9.9 4.4-9.9 9.7 0 5.3 4.3 9.7 9.9 9.7 5.6 0 9.9-4.4 9.9-9.7 0-5.3-4.3-9.7-9.9-9.7zm0 14.3c-2.6 0-4.5-2.1-4.5-4.6 0-2.5 1.9-4.6 4.5-4.6 2.7 0 4.5 2.1 4.5 4.6 0 2.5-1.8 4.6-4.5 4.6zM232.6 157.1h5v18.3h-5zM232.6 150.1h5v4.5h-5zM242.6 150.1h5v25.2h-5zM220.5 156.5c-3.7 0-5.6 1.7-5.6 1.9v-8.3h-5v25.2h5v.1-1.5c.4.3 2 1.8 5.6 1.8 4.6 0 9-4.2 9-9.7 0-5.3-4.1-9.5-9-9.5zm-1.3 14.2c-2.6 0-4.6-2-4.6-4.6 0-2.6 2-4.6 4.6-4.6s4.6 2 4.6 4.6c0 2.6-2 4.6-4.6 4.6zM114.3 157.1h-6.4l-8.1 10.3-3.6-3.3 9.1-11.5h-6.3l-6.2 8-3.3-3.5h-7.7l7.7 7.5-8.6 10.7h6.4l5.6-7.3 3.5 3.9-8.1 10.3h6.3l5.2-7 9.7 9.5h7.8l-14.1-13.9zM63 175.3h17v-4.4h-12v-6.3h10.7v-4.4h-10.7v-5.6h12v-4.5h-17zM170.5 168.4h-.2l-4.3-18.3h-8.4v25.2h5.1v-18.9l4.5 18.9h6l4.8-18.9h-.2v18.9h5.7v-25.2h-8.7zM165.6 203.5h-8.5v-13.2h8.2v1.6h-6.5v4.2h6v1.6h-6v4.4h6.8v1.4zM175.2 203.5h-1.6v-5.8c0-.7-.2-1.2-.5-1.6-.3-.3-.9-.5-1.8-.5-.5 0-1 0-1.5.1-.4.1-.7.1-.9.2v7.5h-1.6v-8.8h.1c.5-.1 1.1-.3 1.7-.4.7-.1 1.4-.2 2.2-.2 1.4 0 2.4.3 2.9.8.6.6.9 1.4.9 2.5v6.2zM181.5 203.7c-.7 0-1.3-.1-1.9-.3-.5-.2-1-.5-1.4-.9-.4-.4-.7-.9-.9-1.5-.2-.6-.3-1.2-.3-2s.1-1.4.3-2c.2-.6.5-1.1.9-1.6.4-.4.9-.8 1.4-1 .6-.2 1.2-.3 1.8-.3.7 0 1.3.1 1.8.3.5.2.9.6 1.2 1 .3.4.6.9.7 1.4.1.5.2 1.1.2 1.7v.9h-6.8c0 .4.1.7.2 1 .1.4.3.7.6 1 .2.3.6.5 1 .7.4.2.9.2 1.4.2.6 0 1.2-.1 1.7-.3.5-.2.9-.4 1.2-.5l.2-.1v1.6h-.1c-.4.2-.9.4-1.4.5-.4.1-1.1.2-1.8.2zm-2.9-5.6h5.2l-.1-.9c-.1-.3-.2-.6-.4-.9-.2-.2-.5-.4-.8-.6-.3-.1-.7-.2-1.1-.2-.8 0-1.4.2-1.9.7-.5.5-.8 1.1-.9 1.9zM188.7 203.5h-1.6v-8.7h.1c.5-.2 1-.3 1.6-.4.6-.1 1.2-.2 1.8-.2.4 0 .7 0 1 .1.3 0 .5.1.7.1h.1v1.5h-.2c-.1 0-.3-.1-.6-.1-.5-.1-1.4-.1-2.1 0-.3.1-.6.1-.8.2v7.5zM196.2 208c-.8 0-1.5-.1-2-.2s-.9-.3-1.2-.4h-.1v-1.7l.2.1c.3.1.7.3 1.2.4.5.1 1.1.2 1.8.2 1 0 1.8-.2 2.3-.7.5-.5.8-1.3.8-2.4v-.3c-.3.1-.6.3-1 .4-.5.1-1 .2-1.6.2-.6 0-1.2-.1-1.8-.3-.5-.2-1-.5-1.4-1-.4-.4-.7-.9-.9-1.5-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9c.2-.6.5-1.1 1-1.6.4-.5 1-.8 1.6-1.1.6-.3 1.3-.4 2.2-.4.8 0 1.5.1 2.1.2.6.2 1 .3 1.3.4h.1v8.5c0 .7-.1 1.3-.2 1.8-.2.6-.4 1.1-.8 1.5-.4.4-.9.8-1.5 1-.5.6-1.3.7-2.1.7zm1.1-12.4c-.6 0-1.1.1-1.5.3-.4.2-.8.4-1 .7-.3.3-.5.7-.6 1.1-.1.4-.2.8-.2 1.3 0 1 .3 1.8.8 2.4.5.5 1.3.8 2.2.8.5 0 .9-.1 1.3-.2s.7-.3 1-.4v-5.7c-.2-.1-.5-.1-.8-.2-.3-.1-.7-.1-1.2-.1zM205.1 207.8h-1.7l2-4.5-3.7-9h1.7v.1l1.9 5 .5 1.3c.1.3.2.6.3.8l.3-.8c.1-.4.3-.8.5-1.3l2.2-5.1h1.7l-5.7 13.5zM217.6 203.5h-1.6v-14h1.6v14zM221.6 203.5h-1.6v-9.1h1.6v9.1zm.1-11h-1.8v-1.8h1.8v1.8zM227.7 203.5h-1.6l-3.7-9.1h1.7l2.3 5.8c.1.2.1.4.2.5.1.2.1.4.2.5 0 .1 0 .1.1.2l.3-.8.5-1.1 2.2-5.2h1.7l-3.9 9.2zM236.4 203.7c-.7 0-1.3-.1-1.9-.3-.5-.2-1-.5-1.4-.9-.4-.4-.7-.9-.9-1.5-.2-.6-.3-1.2-.3-2s.1-1.4.3-2c.2-.6.5-1.1.9-1.6.4-.4.9-.8 1.4-1 .6-.2 1.2-.3 1.8-.3.7 0 1.3.1 1.8.3.5.2.9.6 1.2 1 .3.4.6.9.7 1.4.1.5.2 1.1.2 1.7v.9h-6.8c0 .4.1.7.2 1 .1.4.3.7.6 1 .2.3.6.5 1 .7.4.2.9.2 1.4.2.6 0 1.2-.1 1.7-.3.5-.2.9-.4 1.2-.5l.2-.1v1.6h-.1c-.4.2-.9.4-1.4.5-.4.1-1.1.2-1.8.2zm-2.9-5.6h5.2l-.1-.9c-.1-.3-.2-.6-.4-.9-.2-.2-.5-.4-.8-.6-.3-.1-.7-.2-1.1-.2-.8 0-1.4.2-1.9.7-.5.5-.8 1.1-.9 1.9zM244.6 203.7c-.6 0-1.2 0-1.7-.1s-.9-.2-1.3-.4h-.1v-1.6l.2.1c.3.2.7.3 1.2.4.5.1 1 .2 1.5.2.7 0 1.2-.1 1.5-.4.3-.2.5-.5.5-.9 0-.2 0-.4-.1-.5-.1-.1-.2-.2-.4-.3-.2-.1-.4-.2-.7-.3-.3-.1-.6-.2-1-.3l-1.2-.4c-.4-.2-.7-.3-.9-.5-.3-.2-.5-.5-.6-.7-.1-.3-.2-.6-.2-1s.1-.7.2-1.1.4-.6.7-.9c.3-.2.7-.4 1.1-.6.4-.1 1-.2 1.5-.2s1 0 1.4.1c.4.1.8.2 1 .3h.1v1.5l-.2-.1c-.3-.1-.6-.2-1-.3-.4-.1-.9-.2-1.4-.2-.7 0-1.2.1-1.4.4-.3.2-.4.5-.4 1 0 .3.1.6.4.8.3.2.8.4 1.5.6l1.2.4c.4.1.7.3 1 .5.3.2.5.5.7.8.2.3.2.7.2 1.1 0 .3-.1.7-.2 1-.1.3-.3.6-.6.9-.3.3-.7.5-1.1.6-.3 0-.8.1-1.4.1zM262 203.5h-1.6v-5.6c0-.8-.2-1.4-.5-1.8-.3-.4-.8-.5-1.6-.5-.5 0-1 .1-1.5.2-.4.2-.8.3-1.1.5v7.1h-1.6v-14h1.6v5.3c.3-.2.7-.3 1.1-.4.6-.2 1.2-.3 1.8-.3 1.1 0 1.9.3 2.5.9.6.6.9 1.5.9 2.7v5.9zM268.3 203.7c-.7 0-1.3-.1-1.9-.3-.5-.2-1-.5-1.4-.9-.4-.4-.7-.9-.9-1.5-.2-.6-.3-1.2-.3-2s.1-1.4.3-2c.2-.6.5-1.1.9-1.6.4-.4.9-.8 1.4-1 .6-.2 1.2-.3 1.8-.3.7 0 1.3.1 1.8.3.5.2.9.6 1.2 1 .3.4.6.9.7 1.4.1.5.2 1.1.2 1.7v.9h-6.8c0 .4.1.7.2 1 .1.4.3.7.6 1 .2.3.6.5 1 .7.4.2.9.2 1.4.2.6 0 1.2-.1 1.7-.3.5-.2.9-.4 1.2-.5l.2-.1v1.6h-.1c-.4.2-.9.4-1.4.5-.4.1-1.1.2-1.8.2zm-2.9-5.6h5.2l-.1-.9c-.1-.3-.2-.6-.4-.9-.2-.2-.4-.4-.8-.6-.3-.1-.7-.2-1.1-.2-.8 0-1.4.2-1.9.7-.5.5-.8 1.1-.9 1.9zM275.5 203.5h-1.6v-8.7h.1c.5-.2 1-.3 1.6-.4.6-.1 1.2-.2 1.8-.2.4 0 .7 0 1 .1.3 0 .5.1.7.1h.1v1.5h-.2c-.1 0-.3-.1-.6-.1-.5-.1-1.3-.1-2.1 0-.3.1-.6.1-.8.2v7.5zM283.7 203.7c-.7 0-1.3-.1-1.9-.3-.5-.2-1-.5-1.4-.9-.4-.4-.7-.9-.9-1.5-.2-.6-.3-1.2-.3-2s.1-1.4.3-2c.2-.6.5-1.1.9-1.6.4-.4.9-.8 1.4-1 .6-.2 1.2-.3 1.8-.3.7 0 1.3.1 1.8.3.5.2.9.6 1.2 1 .3.4.6.9.7 1.4.1.5.2 1.1.2 1.7v.9h-6.8c0 .4.1.7.2 1 .1.4.3.7.6 1 .2.3.6.5 1 .7.4.2.9.2 1.4.2.6 0 1.2-.1 1.7-.3.5-.2.9-.4 1.2-.5l.2-.1v1.6h-.1c-.4.2-.9.4-1.4.5-.4.1-1 .2-1.8.2zm-2.8-5.6h5.2l-.1-.9c-.1-.3-.2-.6-.4-.9-.2-.2-.5-.4-.8-.6-.3-.1-.7-.2-1.1-.2-.8 0-1.4.2-1.9.7-.5.5-.8 1.1-.9 1.9zM289 194h-.5v-1.7h-.6v-.4h1.7v.4h-.6v1.7zM292 194h-.5v-1.2l-.5 1.2h-.4l-.5-1.1v1.2h-.5v-2.1h.5l.6 1.3.6-1.4h.5v2.1z" />\r\n</svg>');
    $templateCache.put('app/unity-angular/modals/modal.confirm.html', '<div class="em-c-modal em-js-modal"\r\n     data-ng-class="{\'em-is-closed\': isOpen !== true}">\r\n    <div class="em-c-modal__window em-js-modal-window">\r\n        <div class="em-c-modal__header">\r\n            <h3 class="em-c-modal__title">{{title}}</h3>\r\n            <button class="em-c-btn em-c-btn--bare em-c-modal__close-btn em-js-modal-close-trigger"\r\n                    data-ng-click="cancel()">\r\n                <div class="em-c-btn__inner">\r\n                    <svg class="em-c-btn__icon " data-em-icon-path="../../images/em-icons.svg">\r\n                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-x"></use>\r\n                    </svg>\r\n                </div>\r\n            </button>\r\n            <!-- end em-c-btn -->\r\n        </div>\r\n        <!-- end em-c-modal__header -->\r\n        <div class="em-c-modal__body em-c-text-passage em-c-text-passage--small">\r\n            <ng-transclude></ng-transclude>\r\n        </div>\r\n        <!-- end em-c-modal__body -->\r\n        <div class="em-c-modal__footer em-c-text-passage em-c-text-passage--small">\r\n            <div class="em-c-btn-group em-c-modal--alert em-js-modal-only">\r\n                <button class="em-c-btn em-c-btn--primary em-js-modal-confirm-trigger"\r\n                        data-ng-click="ok()">\r\n                    <span class="em-c-btn__text">{{confirmText}}</span>\r\n                </button>\r\n                <!-- end em-c-btn -->\r\n                <button class="em-c-btn em-c-btn--secondary em-js-modal-cancel-trigger"\r\n                        data-ng-click="cancel()">\r\n                    <span class="em-c-btn__text">{{cancelText}}</span>\r\n                </button>\r\n                <!-- end em-c-btn -->\r\n            </div>\r\n        </div>\r\n        <!-- end em-c-modal__footer -->\r\n    </div>\r\n    <!-- end em-c-modal__window -->\r\n</div>');
    $templateCache.put('app/unity-angular/modals/modal.html', '<div class="em-c-modal em-js-modal"\r\n     data-ng-class="{\'em-is-closed\': isOpen === false}">\r\n    <div class="em-c-modal__window em-js-modal-window">\r\n        <div class="em-c-modal__header">\r\n            <h3 class="em-c-modal__title">{{title}}</h3>\r\n            <button class="em-c-btn em-c-btn--bare em-c-modal__close-btn em-js-modal-close-trigger"\r\n                    data-ng-click="close()">\r\n                <div class="em-c-btn__inner">\r\n                    <svg class="em-c-btn__icon " data-em-icon-path="../../images/em-icons.svg">\r\n                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-x"></use>\r\n                    </svg>\r\n                </div>\r\n            </button>\r\n        </div>\r\n        <div class="em-c-modal__body em-c-text-passage em-c-text-passage--small">\r\n            {{body}}\r\n        </div>\r\n        <div class="em-c-modal__footer em-c-text-passage em-c-text-passage--small">\r\n            <div class="em-c-btn-group em-c-modal--alert em-js-modal-only">\r\n                <button class="em-c-btn em-c-btn--primary em-js-modal-confirm-trigger"\r\n                        data-ng-click="ok()">\r\n                    <span class="em-c-btn__text">OK</span>\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>');
    $templateCache.put('app/unity-angular/modals/share.modal.html', '<div class="em-c-modal em-js-modal"\r\n     data-ng-class="{\'em-is-closed\': isOpen === false}">\r\n    <div class="em-c-modal__window em-js-modal-window">\r\n        <div class="em-c-modal__header">\r\n            <h3 class="em-c-modal__title">{{title}}</h3>\r\n            <button class="em-c-btn em-c-btn--bare em-c-modal__close-btn em-js-modal-close-trigger"\r\n                    data-ng-click="close()">\r\n                <div class="em-c-btn__inner">\r\n                    <svg class="em-c-btn__icon " data-em-icon-path="../../images/em-icons.svg">\r\n                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-x"></use>\r\n                    </svg>\r\n                </div>\r\n            </button>\r\n        </div>\r\n        <div class="em-c-modal__body em-c-text-passage em-c-text-passage--small">\r\n\r\n            <!--<div class="em-c-field ">\r\n                <label for="" class="em-c-field__label">Link</label>\r\n                <div class="em-c-field__body">\r\n                    <input type="text" id="" class="em-c-input" placeholder="Placeholder" value="{{link}}" />\r\n                </div>\r\n                <div class="em-c-field__note">Provide this link to the user that wants to add this to their shared assessment list.</div>\r\n            </div>-->\r\n\r\n            <div class="em-c-search__body">\r\n                <input type="text" class="em-c-search__input" value="{{link}}" />\r\n                <button class="em-c-btn" aria-label="Copy"\r\n                        data-ng-click="copy()">\r\n                    <div class="em-c-btn__inner">Copy\r\n                        <span class="fa fa-clipboard em-u-margin-left-half"></span>\r\n                    </div>\r\n                </button>\r\n            </div>\r\n            <div class="em-c-field__note">Provide the link above to a user in order to share this item with them.</div>\r\n\r\n            <div class="em-c-alert" role="alert"\r\n                 data-ng-show="copied.message"\r\n                 data-ng-class="{\'em-c-alert--success\': copied.success === true, \'em-c-alert--error\': copied.success === false }">\r\n                <div class="em-c-alert__body">\r\n                    {{copied.message}}\r\n                </div>\r\n                <div class="em-c-alert__actions">\r\n                </div>\r\n            </div>\r\n\r\n        </div>\r\n        <div class="em-c-modal__footer em-c-text-passage em-c-text-passage--small">\r\n            <div class="em-c-btn-group em-c-modal--alert em-js-modal-only">\r\n                <button class="em-c-btn em-c-btn--primary em-js-modal-confirm-trigger"\r\n                        data-ng-click="ok()">\r\n                    <span class="em-c-btn__text">OK</span>\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>');
    $templateCache.put('app/unity-angular/table/table-object-body.html', '\r\n<div class="em-c-table-object__body">\r\n    <div class="em-c-table-object__body-inner"\r\n         ng-transclude>\r\n    </div>\r\n</div>');
    $templateCache.put('app/unity-angular/table/table-object-footer.html', '\r\n<div class="em-c-table-object__footer"\r\n     ng-transclude>\r\n</div>');
    $templateCache.put('app/unity-angular/table/table-object-header.html', '\r\n<div class="em-c-table-object__header"\r\n     ng-transclude>\r\n</div>');
    $templateCache.put('app/unity-angular/table/table-object.html', '\r\n<div class="em-c-table-object"\r\n     ng-transclude>\r\n</div>');
    $templateCache.put('app/unity-angular/tree-nav/tree-collapse.html', '\r\n<button class="em-c-btn"\r\n        ng-click="vm.collapse()">\r\n    <div class="em-c-btn__inner">\r\n        <em-icon is="x" ng-if="!vm.collapsed" class="em-c-btn__icon"></em-icon>\r\n        <em-icon is="plus" ng-if="vm.collapsed" class="em-c-btn__icon"></em-icon>\r\n        <span class="em-c-btn__text">\r\n            {{ vm.collapsed ? \'Show\' : \'Collapse\' }} all\r\n        </span>\r\n    </div>\r\n</button>');
    $templateCache.put('app/unity-angular/tree-nav/tree-item.html', '\r\n<li class="em-c-tree__item"\r\n    ng-transclude>\r\n</li>');
    $templateCache.put('app/unity-angular/tree-nav/tree-link.html', '\r\n<div ng-click="vm.item.isActive = vm.item.hasChildren ? !vm.item.isActive : false" \r\n     ng-class="{\r\n         \'em-c-tree__link--has-children\' : vm.item.hasChildren,\r\n         \'em-is-active\' : vm.item.isActive,\r\n         \'em-u-clickable\' : vm.item.hasChildren\r\n     }" \r\n     class="em-c-tree__link"\r\n     role="tab"\r\n     aria-controls=""\r\n     aria-expanded="false" \r\n     aria-selected="false">\r\n\r\n    <em-icon is="caret-right" class="em-c-tree__icon" ng-if="vm.item.hasChildren"></em-icon>\r\n\r\n    <div class="em-c-tree__text" ng-transclude></div>\r\n\r\n</div>');
    $templateCache.put('app/unity-angular/tree-nav/tree-list.html', '<ul class="em-c-tree__list"\r\n    ng-class="{\r\n        \'em-is-active\' : vm.parent.isActive,\r\n        \'em-c-tree__list--flush\': vm.isTop\r\n    }"\r\n    role="tablist"\r\n    aria-multiselectable="true"\r\n    ng-transclude>\r\n</ul>');
    $templateCache.put('app/unity-angular/tree-nav/tree-nav.html', '\r\n<nav class="em-c-tree"\r\n     role="navigation"\r\n     ng-transclude>\r\n</nav>');
    $templateCache.put('app/unity-angular/typeahead/unity-angular.typeahead.template.html', '<ul class="dropdown-menu typeahead-dropdown" ng-show="isOpen() && !moveInProgress" ng-style="{top: position().top+\'px\', left: position().left+\'px\'}" role="listbox" aria-hidden="{{!isOpen()}}">\r\n    <li class="uib-typeahead-match" ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index, $event)" role="option" id="{{::match.id}}">\r\n        <div uib-typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\r\n    </li>\r\n</ul>\r\n');
    $templateCache.put('app/playbook/commitment/partials/commitment.modal.html', '<div class="em-c-modal em-js-modal"\r\n     data-ng-class="{\'em-is-closed\': isOpen !== true}">\r\n    <div class="em-c-modal__window em-js-modal-window modal-wide"\r\n     style="overflow-y:auto">\r\n        <div class="em-c-modal__header">\r\n            <h3 class="em-c-modal__title">{{title}}</h3>\r\n            <button class="em-c-btn em-c-btn--bare em-c-modal__close-btn em-js-modal-close-trigger"\r\n                    data-ng-click="close()">\r\n                <div class="em-c-btn__inner">\r\n                    <svg class="em-c-btn__icon " data-em-icon-path="../../images/em-icons.svg">\r\n                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-x"></use>\r\n                    </svg>\r\n                </div>\r\n            </button>\r\n        </div>\r\n        <div class="em-c-modal__body em-c-text-passage em-c-text-passage--small">\r\n            <ng-transclude></ng-transclude>\r\n        </div>\r\n        <div class="em-c-modal__footer em-c-text-passage em-c-text-passage--small">\r\n            <div class="em-c-btn-group em-c-modal--alert em-js-modal-only">\r\n                <button class="em-c-btn em-c-btn--primary em-js-modal-confirm-trigger"\r\n                        data-ng-click="ok()">\r\n                    <span class="em-c-btn__text">Save</span>\r\n                </button>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>');
    $templateCache.put('app/playbook/commitment/partials/edit.html', '<form name="cc.form" novalidate role="form">\r\n    <div class="em-u-margin-bottom-double">\r\n        <span>\r\n            Commitments represent specific improvements that the team/project/application can make in relation to the \r\n            assessment results. We recommend adding at least one commitment for each area of improvement. Commitments can build\r\n            on themselves over time and be completed on your schedule.\r\n        </span>\r\n    </div>   \r\n    <div>\r\n        <!-- Name -->\r\n        <div class="em-c-field em-u-margin-bottom"\r\n             data-ng-class="{\'em-has-error\': cc.form.submitted && cc.form.name.$error.required}">\r\n            <label for="name" class="em-y-field__label">Name:</label>\r\n            <div class="em-c-field__body">\r\n                <input name="name" class="em-c-input em-u-width-100" type="text" data-ng-model="cc.form.data.name"\r\n                       required />\r\n                <svg class="em-c-field__icon"\r\n                     data-ng-show="cc.form.submitted === true && cc.form.name.$error.required">\r\n                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-warning"></use>\r\n                </svg>\r\n            </div>\r\n            <div class="em-c-field__note" data-ng-show="cc.form.submitted && cc.form.name.$error.required">The name is required.</div>\r\n        </div>\r\n\r\n        <!-- Category Dropdown -->\r\n        <div class="em-c-field em-u-margin-bottom"\r\n             data-ng-class="{\'em-has-error\': cc.form.submitted && cc.form.category.$error.required}">\r\n            <label for="category" class="em-c-field__label">Category:</label>\r\n            <div data-ng-if="cc.enableSuggestions === true">\r\n                <div class="em-c-alert alert-plain alert-condensed" role="alert">\r\n                    <div class="em-c-alert__body">\r\n                        Consider adding commitments for categories: \r\n                        \r\n                        <span ng-repeat="category in cc.categories | filter: {needsCommitments: true}">\r\n                            <span ng-show="$last"> and </span>\r\n                            <span ng-show="!$first && !$last">, </span>\r\n                                {{category.name}}\r\n                        </span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class="em-c-field__body">\r\n                <select name="category" id="category" class="em-c-select em-u-width-100"\r\n                        ng-options="category.optionText for category in cc.categories track by category.id"\r\n                        ng-model="cc.form.data.category"\r\n                        ng-change="cc.setFormCategoryId(cc.form.data.category)"\r\n                        required>\r\n                    <option value="">Select category...</option>\r\n                </select>\r\n            </div>\r\n            <div class="em-c-field__note" data-ng-show="cc.form.submitted && cc.form.category.$error.required">The category is required.</div>\r\n        </div>\r\n\r\n        <!-- Question -->\r\n        <div class="em-c-field em-u-margin-bottom"\r\n             data-ng-class="{\'em-is-disabled\': cc.form.data.category === null}">\r\n            <div class="em-u-display-inline-block em-u-width-100">\r\n                <label for="question" class="em-c-field__label float-left">Question:</label>\r\n                <div class="em-c-field__note float-right">(optional)</div>\r\n            </div>            \r\n            <div data-ng-if="cc.enableSuggestions === true && cc.form.data.category !== null && cc.form.data.category.needsCommitments === true">\r\n                <div class="em-c-alert alert-plain alert-condensed" role="alert">\r\n                    <div class="em-c-alert__body">\r\n                        Improvements could be made for the questions indicated with asterisks (*)\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class="em-c-field__body">\r\n                <select name="question" id="question" class="em-c-select em-u-width-100 em-is-disabled"\r\n                        ng-options="question.optionText for question in cc.form.data.category.questions track by question.id"\r\n                        ng-model="cc.form.data.question"\r\n                        ng-change="cc.setFormQuestionId(cc.form.data.question)"\r\n                        ng-disabled="cc.form.data.category === null">\r\n                    <option value="">Select Question...</option>\r\n                    <svg class="em-c-icon em-c-field__icon">\r\n                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-ban"></use>\r\n                    </svg>\r\n                </select>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Due Date -->\r\n        <div class="em-c-field em-u-margin-bottom">\r\n            <label for="name" class="em-y-field__label float-left">Completion Date Goal:</label>\r\n            <div class="em-c-field__note float-right">(optional)</div>\r\n            <div class="em-c-field__body">\r\n                <em-date-picker name="dueDate" data-model="cc.form.data.dueDateLocal"\r\n                                on-select="cc.setFormDueDateValue(cc.form.data.dueDateLocal)"></em-date-picker>\r\n                <!--<input class="em-c-input em-u-width-100" type="text" data-ng-model="cc.form.data.dueDate" />-->\r\n            </div>\r\n        </div>\r\n\r\n        <!--Status-->\r\n        <div class="em-c-field em-u-margin-bottom"\r\n             data-ng-class="{\'em-has-error\': cc.form.submitted && cc.form.status.$error.required}">\r\n            <label for="status" class="em-c-field__label">Implementation Status:</label>\r\n            <div class="em-c-field__body">\r\n                <select name="status" id="status" class="em-c-select em-u-width-100"\r\n                        ng-options="status.display for status in cc.statuses track by status.value"\r\n                        ng-model="cc.form.data.statusObj"\r\n                        ng-change="cc.setFormStatusValue(cc.form.data.statusObj)"\r\n                        required>\r\n                    <option value="">Select Status...</option>\r\n                </select>\r\n            </div>\r\n            <div class="em-c-field__note" data-ng-show="cc.form.submitted && cc.form.status.$error.required">The status is required.</div>\r\n        </div>\r\n\r\n        <!--Description-->\r\n        <div class="em-c-field em-u-margin-bottom"\r\n             data-ng-class="{\'em-has-error\': cc.form.submitted && cc.form.description.$error.required}">\r\n            <label for="description" class="em-c-field__label">Description:</label>\r\n            <div class="em-c-field__body">\r\n                <textarea name="description" class="em-u-width-100" \r\n                          data-ng-model="cc.form.data.description"\r\n                          required\r\n                          rows="5"\r\n                          style="resize:vertical"></textarea>\r\n                <svg class="em-c-field__icon"\r\n                     data-ng-show="cc.form.submitted === true && cc.form.description.$error.required">\r\n                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-warning"></use>\r\n                </svg>\r\n            </div>\r\n            <div class="em-c-field__note" data-ng-show="cc.form.submitted && cc.form.description.$error.required">The description is required.</div>\r\n        </div>      \r\n\r\n        <div class="em-c-alert em-c-alert--error" role="alert" data-ng-show="cc.error !== null && typeof(cc.error) !== \'undefined\' && cc.error.trim() !== \'\'">\r\n            <svg class="em-c-icon em-c-alert__icon">\r\n                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="../../images/em-icons.svg#icon-warning"></use>\r\n            </svg>\r\n            <div class="em-c-alert__body">\r\n                {{cc.error}}\r\n            </div>\r\n        </div>\r\n    </div>\r\n</form>');
    $templateCache.put('app/playbook/commitment/partials/list.table.html', '<tr>\r\n    <td>{{commitment.name}}</td>\r\n    <td>{{commitment.categoryName}}</td>\r\n    <td data-ng-model="showFullDescription" data-ng-init="showFullDescription = false">\r\n        <span ng-show="showFullDescription === false">\r\n            {{commitment.description | truncate:150}}\r\n            <a ng-show="commitment.description.length > 150"\r\n               ng-click="showFullDescription = true"\r\n               class="em-u-clickable">Show More</a>\r\n        </span>\r\n\r\n        <span ng-show="showFullDescription === true">\r\n            {{commitment.description}}\r\n            <a ng-show="commitment.description.length > 150"\r\n               ng-click="showFullDescription = false"\r\n               class="em-u-clickable">Show Less</a>\r\n\r\n           \r\n        </span>\r\n    </td>\r\n    <td>{{getStatusDisplayName(commitment.status)}}</td>\r\n    <td class="em-u-text-align-center"\r\n        data-ng-show="canEdit === true">\r\n        <button class="em-c-text-btn"\r\n                data-ng-click="edit()">\r\n            <span class="fa fa-edit fa-2x" title="edit"></span>\r\n        </button>\r\n    </td>\r\n    <td class="em-u-text-align-center"\r\n        data-ng-show="canEdit === true">\r\n        <button class="em-c-text-btn "\r\n                data-ng-click="remove()">\r\n            <span class="fa fa-remove fa-2x" title="delete"></span>\r\n        </button>\r\n</tr>\r\n\r\n<div em-modal-confirm\r\n     data-title="Delete Commitment"\r\n     data-confirm-func="confirmRemove()"\r\n     data-confirm-text="Yes"\r\n     data-cancel-func="cancelRemove()"\r\n     data-is-open="showDeleteModal"\r\n     class="em-is-closed">\r\n    <p>Are you sure you want to delete this commitment? This action cannot be undone.</p>\r\n</div>');
}]);
(function () {
    return angular.module("app")
   .constant("configs", {
       "apiUrl": "http://xom-ep-dev.eastus.cloudapp.azure.com/webapi/api/",
       "enableDebug": true
   });
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJhZG1pbi9hZG1pbi5tb2R1bGUuanMiLCJhc3Nlc3NtZW50L2Fzc2Vzc21lbnQubW9kdWxlLmpzIiwicGxheWJvb2svcGxheWJvb2subW9kdWxlLmpzIiwidGVhbS90ZXN0Lm1vZHVsZS5qcyIsInVuaXR5LWFuZ3VsYXIvdW5pdHktYW5ndWxhci5tb2R1bGUuanMiLCJ2aXN1YWxpemF0aW9ucy92aXN1YWxpemF0aW9ucy5tb2R1bGUuanMiLCJhcHAuY29uZmlnLmpzIiwiYXBwLnJvdXRlLmpzIiwiYXBwLnJ1bi5qcyIsImFkbWluL2FkbWluLnJvdXRlLmpzIiwiY29tcG9uZW50cy9leHBvcnQuaHRtbC5kaXJlY3RpdmUuanMiLCJjb21wb25lbnRzL2hlYWRlci1uYXYuZGlyZWN0aXZlLmpzIiwiY29tcG9uZW50cy9sb2FkaW5nLmZpbHRlci5qcyIsImNvbXBvbmVudHMvdHJ1bmNhdGUuZmlsdGVyLmpzIiwiYXNzZXNzbWVudC9hc3Nlc3NtZW50LmNvbnRyb2xsZXIuanMiLCJhc3Nlc3NtZW50L2Fzc2Vzc21lbnQuZGF0YS5zZXJ2aWNlLmpzIiwiaG9tZS9ob21lLmNvbnRyb2xsZXIuanMiLCJwbGF5Ym9vay9wbGF5Ym9vay5jb250cm9sbGVyLmpzIiwicGxheWJvb2svcGxheWJvb2suZGF0YS5zZXJ2aWNlLmpzIiwicGxheWJvb2svcGxheWJvb2sucm91dGVzLmpzIiwicGxheWJvb2svcGxheWJvb2sudmFsaWRhdG9yLmRpcmVjdGl2ZS5qcyIsInNlY3VyaXR5L2F1dGguc2VydmljZS5qcyIsInNlY3VyaXR5L2F1dGguc2VydmljZS5vbGQuanMiLCJ0ZWFtL3RlYW0uY29udHJvbGxlci5qcyIsInRlYW0vdGVhbS5kYXRhLnNlcnZpY2UuanMiLCJ1bml0eS1hbmd1bGFyL3VuaXR5LWFuZ3VsYXIuY29uc3RhbnRzLmpzIiwidmlzdWFsaXphdGlvbnMvcmFkYXIuY2hhcnQuZGlyZWN0aXZlLmpzIiwidmlzdWFsaXphdGlvbnMvcmFkYXIuanMiLCJhZG1pbi9hcHBsb2dzL2FwcGxvZ3MuY29udHJvbGxlci5qcyIsImFkbWluL2FwcGxvZ3MvYXBwbG9ncy5tb2RlbC5qcyIsImFkbWluL2FwcGxvZ3MvYXBwbG9ncy5zZXJ2aWNlLmpzIiwiYWRtaW4vdXNlcnMvdXNlci5jb250cm9sbGVyLmpzIiwiYWRtaW4vdXNlcnMvdXNlci5tb2RlbC5qcyIsImFkbWluL3VzZXJzL3VzZXIuc2VydmljZS5qcyIsImFkbWluL3VzZXJzL3VzZXJzLmNvbnRyb2xsZXIuanMiLCJhc3Nlc3NtZW50L3dpemFyZC9tdWx0aXBsZS5jaG9pY2UuZGlyZWN0aXZlLmpzIiwiYXNzZXNzbWVudC93aXphcmQvd2l6YXJkLmRpcmVjdGl2ZS5qcyIsImFzc2Vzc21lbnQvd2l6YXJkL3dpemFyZC5xdWVzdGlvbi5wYWdlLmRpcmVjdGl2ZS5qcyIsImFzc2Vzc21lbnQvd2l6YXJkL3dpemFyZC5zdGF0dXMuZGlyZWN0aXZlLmpzIiwicGxheWJvb2svY29tbWl0bWVudC9jb21taXRtZW50LmNvbnRyb2xsZXIuanMiLCJwbGF5Ym9vay9jb21taXRtZW50L2NvbW1pdG1lbnQuZGlyZWN0aXZlLmpzIiwicGxheWJvb2svY29tbWl0bWVudC9jb21taXRtZW50Lm1vZGFsLmRpcmVjdGl2ZS5qcyIsInBsYXlib29rL2NvbW1pdG1lbnQvY29tbWl0bWVudC52YWxpZGF0b3IuanMiLCJ1bml0eS1hbmd1bGFyL2FjY29yZGlhbi9hY2NvcmRpYW4uZGlyZWN0aXZlLmpzIiwidW5pdHktYW5ndWxhci9iYWRnZS9iYWRnZS5kaXJlY3RpdmUuanMiLCJ1bml0eS1hbmd1bGFyL2NvbG9ycy9jb2xvcnMuc2VydmljZS5qcyIsInVuaXR5LWFuZ3VsYXIvZGF0ZS1waWNrZXIvZGF0ZS1waWNrZXIuZGlyZWN0aXZlLmpzIiwidW5pdHktYW5ndWxhci9leHBhbmRhYmxlLWJ1dHRvbi9leHBhbmRhYmxlLWJ1dHRvbi5kaXJlY3RpdmUuanMiLCJ1bml0eS1hbmd1bGFyL2ZpZWxkL2ZpZWxkLWJvZHktZGlyZWN0aXZlLmpzIiwidW5pdHktYW5ndWxhci9maWVsZC9maWVsZC1ncm91cC5kaXJlY3RpdmUuanMiLCJ1bml0eS1hbmd1bGFyL2ZpZWxkL2ZpZWxkLW1lc3NhZ2VzLmRpcmVjdGl2ZS5qcyIsInVuaXR5LWFuZ3VsYXIvZmllbGQvZmllbGQtbm90ZS5kaXJlY3RpdmUuanMiLCJ1bml0eS1hbmd1bGFyL2ZpZWxkL2ZpZWxkLmRpcmVjdGl2ZS5qcyIsInVuaXR5LWFuZ3VsYXIvZmllbGQvZmllbGQuc2VydmljZS5qcyIsInVuaXR5LWFuZ3VsYXIvZmllbGQvaW5wdXQuZGlyZWN0aXZlLmpzIiwidW5pdHktYW5ndWxhci9maWVsZC9sYWJlbC5kaXJlY3RpdmUuanMiLCJ1bml0eS1hbmd1bGFyL2ZpZWxkL3NlbGVjdC5kaXJlY3RpdmUuanMiLCJ1bml0eS1hbmd1bGFyL2ZpZWxkL3RleHRhcmVhLmRpcmVjdGl2ZS5qcyIsInVuaXR5LWFuZ3VsYXIvZmllbGQvdG9nZ2xlLmRpcmVjdGl2ZS5qcyIsInVuaXR5LWFuZ3VsYXIvZm9vdGVyL2Zvb3Rlci1saW5rLmRpcmVjdGl2ZS5qcyIsInVuaXR5LWFuZ3VsYXIvZm9vdGVyL2Zvb3Rlci1saW5rcy5kaXJlY3RpdmUuanMiLCJ1bml0eS1hbmd1bGFyL2Zvb3Rlci9mb290ZXIuZGlyZWN0aXZlLmpzIiwidW5pdHktYW5ndWxhci9pY29uL2ljb24uZGlyZWN0aXZlLmpzIiwidW5pdHktYW5ndWxhci9pY29uL2ljb24uc2VydmljZS5qcyIsInVuaXR5LWFuZ3VsYXIvbG9hZGVyL2xvYWRlci5kaXJlY3RpdmUuanMiLCJ1bml0eS1hbmd1bGFyL2xvYWRlci9sb2FkZXIub3ZlcmxheS5kaXJlY3RpdmUuanMiLCJ1bml0eS1hbmd1bGFyL2xvZ28vbG9nby5kaXJlY3RpdmUuanMiLCJ1bml0eS1hbmd1bGFyL21vZGFscy9tb2RhbC5jb25maXJtLmRpcmVjdGl2ZS5qcyIsInVuaXR5LWFuZ3VsYXIvbW9kYWxzL21vZGFsLmRpcmVjdGl2ZS5qcyIsInVuaXR5LWFuZ3VsYXIvbW9kYWxzL3NoYXJlLm1vZGFsLmRpcmVjdGl2ZS5qcyIsInVuaXR5LWFuZ3VsYXIvdGFibGUvY2VsbC5zZXJ2aWNlLmpzIiwidW5pdHktYW5ndWxhci90YWJsZS90YWJsZS1vYmplY3QtYm9keS5kaXJlY3RpdmUuanMiLCJ1bml0eS1hbmd1bGFyL3RhYmxlL3RhYmxlLW9iamVjdC1mb290ZXIuZGlyZWN0aXZlLmpzIiwidW5pdHktYW5ndWxhci90YWJsZS90YWJsZS1vYmplY3QtaGVhZGVyLmRpcmVjdGl2ZS5qcyIsInVuaXR5LWFuZ3VsYXIvdGFibGUvdGFibGUtb2JqZWN0LmRpcmVjdGl2ZS5qcyIsInVuaXR5LWFuZ3VsYXIvdGFibGUvdGFibGUuZGlyZWN0aXZlLmpzIiwidW5pdHktYW5ndWxhci90YWJsZS90Ym9keS5kaXJlY3RpdmUuanMiLCJ1bml0eS1hbmd1bGFyL3RhYmxlL3RkLmRpcmVjdGl2ZS5qcyIsInVuaXR5LWFuZ3VsYXIvdGFibGUvdGguZGlyZWN0aXZlLmpzIiwidW5pdHktYW5ndWxhci90YWJsZS90aGVhZC5kaXJlY3RpdmUuanMiLCJ1bml0eS1hbmd1bGFyL3RhYmxlL3RyLmRpcmVjdGl2ZS5qcyIsInVuaXR5LWFuZ3VsYXIvdHJlZS1uYXYvdHJlZS1jb2xsYXBzZS5kaXJlY3RpdmUgLmpzIiwidW5pdHktYW5ndWxhci90cmVlLW5hdi90cmVlLWl0ZW0uZGlyZWN0aXZlLmpzIiwidW5pdHktYW5ndWxhci90cmVlLW5hdi90cmVlLWxpbmsuZGlyZWN0aXZlLmpzIiwidW5pdHktYW5ndWxhci90cmVlLW5hdi90cmVlLWxpc3QuZGlyZWN0aXZlLmpzIiwidW5pdHktYW5ndWxhci90cmVlLW5hdi90cmVlLW5hdi5kaXJlY3RpdmUuanMiLCJhcHAudGVtcGxhdGVzLmpzIiwiY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbGpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25iQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdFlBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbnJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTt1RUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8qZXNsaW50IGFycmF5LWVsZW1lbnQtbmV3bGluZTogW1wiZXJyb3JcIiwgXCJhbHdheXNcIl0qL1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXHJcbiAgICAgICAgLy8gQW5ndWxhciBtb2R1bGVzXHJcbiAgICAgICAgJ25nUm91dGUnLFxyXG4gICAgICAgICduZ0FuaW1hdGUnLFxyXG4gICAgICAgICduZ01lc3NhZ2VzJyxcclxuICAgICAgICAnbmdSZXNvdXJjZScsXHJcbiAgICAgICAgJ25nQ29va2llcycsXHJcbiAgICAgICAgJ25nU2FuaXRpemUnLFxyXG5cclxuICAgICAgICAvLyAzcmQgcGFydHkgbW9kdWxlc1xyXG4gICAgICAgICdhbmd1bGFyLWxvYWRpbmctYmFyJyxcclxuICAgICAgICAnYW5ndWxhci1jbGlwYm9hcmQnLFxyXG4gICAgICAgICdhbmd1bGFyLW1vbWVudGpzJyxcclxuXHJcbiAgICAgICAgLy8gQ3VzdG9tIG1vZHVsZXNcclxuXHRcdCd1bml0eUFuZ3VsYXInLFxyXG4gICAgICAgICdhcHAuYWRtaW4nLFxyXG4gICAgICAgICdhcHAuYXNzZXNzbWVudCcsXHJcbiAgICAgICAgJ2FwcC50ZWFtJyxcclxuICAgICAgICAnYXBwLnZpc3VhbGl6YXRpb25zJyxcclxuICAgICAgICAnYXBwLnBsYXlib29rJ1xyXG4gICAgXSk7XHJcblxyXG4gICAgLy8gR3JvdXAgYnkgbWV0aG9kLlxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJ2dyb3VwJywge1xyXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIGxldCBtYXAgPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5tYXAoZSA9PiAoeyBrOiBrZXkoZSksIGQ6IGUgfSkpLmZvckVhY2goZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtYXBbZS5rXSA9IG1hcFtlLmtdIHx8IFtdO1xyXG4gICAgICAgICAgICAgICAgbWFwW2Uua10ucHVzaChlLmQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG1hcCkubWFwKGsgPT4gKHsga2V5OiBrLCBkYXRhOiBtYXBba10gfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5hZG1pbicsIFtdKTtcclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5hc3Nlc3NtZW50JywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2FwcC5wbGF5Ym9vaycsIFtdKTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhcHAudGVhbScsIFsndWkuYm9vdHN0cmFwJ10pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3VuaXR5QW5ndWxhcicsIFtdKTtcclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXBwLnZpc3VhbGl6YXRpb25zJywgW10pO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbmZpZyhjb25maWcpO1xyXG5cclxuICAgIGNvbmZpZy4kaW5qZWN0ID0gWyckbG9jYXRpb25Qcm92aWRlcicsICckaHR0cFByb3ZpZGVyJywgJ2NmcExvYWRpbmdCYXJQcm92aWRlciddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uZmlnIHNldHRpbmdzIGZvciBtb2R1bGUuXHJcbiAgICAgKiBAcGFyYW0geyRsb2NhdGlvblByb3ZpZGVyfSAkbG9jYXRpb25Qcm92aWRlclxyXG4gICAgICogQHBhcmFtIHskaHR0cFByb3ZpZGVyfSAkaHR0cFByb3ZpZGVyXHJcbiAgICAgKiBAcGFyYW0ge2NmcExvYWRpbmdCYXJQcm92aWRlcn0gY2ZwTG9hZGluZ0JhclByb3ZpZGVyXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGNvbmZpZygkbG9jYXRpb25Qcm92aWRlciwgJGh0dHBQcm92aWRlciwgY2ZwTG9hZGluZ0JhclByb3ZpZGVyKSB7XHJcbiAgICAgICAgLy8gQW5ndWxhciBub3cgdXNlcyAnIScgYXMgaGFzaGJhbmcuXHJcbiAgICAgICAgLy8gVGhpcyBkZWZhdWx0cyB0byBlbXB0eSwgYnV0IHdlIHJlYWxseSBzaG91bGQuLi5cclxuICAgICAgICAvLyBUT0RPOiBpbXBsZW1lbnQgb3VyIGhhc2hiYW5nXHJcbiAgICAgICAgLy8gPj4gaHR0cHM6Ly9kb2NzLmFuZ3VsYXJqcy5vcmcvZ3VpZGUvbWlncmF0aW9uI2NvbW1pdC1hYTA3N2U4XHJcbiAgICAgICAgLy8gPj4gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9jb21taXQvYWEwNzdlODExMjljNzQwMDQxNDM4Njg4ZGZmMmU4ZDIwYzNkN2I1MlxyXG4gICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmhhc2hQcmVmaXgoJycpO1xyXG5cclxuICAgICAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLndpdGhDcmVkZW50aWFscyA9IHRydWU7XHJcblxyXG4gICAgICAgIC8vIFJlcG9zaXRpb24gdGhlIGxvYWRlclxyXG4gICAgICAgIGNmcExvYWRpbmdCYXJQcm92aWRlci5wYXJlbnRTZWxlY3RvciA9ICdib2R5ID4gaGVhZGVyJztcclxuICAgIH07XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29uZmlnKHJvdXRlcylcclxuICAgICAgICAuY29uZmlnKGRpc2FibGVMb2dnaW5nKVxyXG4gICAgICAgIC5jb25maWcoZGVjb3JhdGVEZWJ1Z2dlcik7XHJcblxyXG4gICAgcm91dGVzLiRpbmplY3QgPSBbJyRyb3V0ZVByb3ZpZGVyJ107XHJcbiAgICBkaXNhYmxlTG9nZ2luZy4kaW5qZWN0ID0gWyckbG9nUHJvdmlkZXInLCAnY29uZmlncyddO1xyXG4gICAgZGVjb3JhdGVEZWJ1Z2dlci4kaW5qZWN0ID0gWyckcHJvdmlkZSddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUm91dGUgY29uZmlndXJhdGlvbiBmb3IgYXBwIG1vZHVsZS5cclxuICAgICAqIEBwYXJhbSB7JHJvdXRlUHJvdmlkZXJ9ICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJvdXRlcygkcm91dGVQcm92aWRlcikge1xyXG4gICAgICAgIC8vIFRPRE86IHJlZmFjdG9yIGludG8gc3RhdGVzIVxyXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC53aGVuKCcvJywge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2hjJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2hvbWUvaG9tZS5odG1sJ1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLy8gbGlzdCBhbGwgYXNzZXNzbWVudHMuXHJcbiAgICAgICAgICAgIC53aGVuKCcvYXNzZXNzbWVudHMnLCB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQXNzZXNzbWVudENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYWMnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvYXNzZXNzbWVudC9hc3Nlc3NtZW50Lmxpc3QuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbiAoKSB7IHJldHVybiAnTElTVF9BU1NFU1NNRU5UUyc7IH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhbmQgZWRpdCBhIHRlYW0gZm9yIHRoZSBhc3Nlc3NtZW50LlxyXG4gICAgICAgICAgICAud2hlbignL2Fzc2Vzc21lbnRzLzphc3Nlc3NtZW50SWQvdGVhbScsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdUZWFtQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd0YycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC90ZWFtL3RlYW0uZGV0YWlscy5odG1sJ1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLy8gRWRpdCBhIHRlYW0gZm9yIHRoZSBhc3Nlc3NtZW50LlxyXG4gICAgICAgICAgICAud2hlbignL2Fzc2Vzc21lbnRzLzphc3Nlc3NtZW50SWQvdGVhbS86dGVhbUlkJywge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1RlYW1Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3RjJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3RlYW0vdGVhbS5kZXRhaWxzLmh0bWwnXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyBTdGFydC9lZGl0IGEgdGVhbSBhc3Nlc3NtZW50LlxyXG4gICAgICAgICAgICAud2hlbignL2Fzc2Vzc21lbnRzLzphc3Nlc3NtZW50SWQvdGVhbS86dGVhbUlkL2VkaXQnLCB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQXNzZXNzbWVudENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYWMnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvYXNzZXNzbWVudC9hc3Nlc3NtZW50LmVkaXQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbiAoKSB7IHJldHVybiAnVEFLRV9BU1NFU1NNRU5UJzsgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLy8gUmV2aWV3IGFuIGFzc2Vzc21lbnQgZm9yIGFsbCBhdmFpbGFibGUgdGVhbSBhc3Nlc3NtZW50cy5cclxuICAgICAgICAgICAgLy8gQ291bGQgYWxzbyBiZSB1c2VkIHRvIHNob3cgYSBzaW5nbGUgYXNzZXNzbWVudCdzIGRldGFpbHMuXHJcbiAgICAgICAgICAgIC53aGVuKCcvYXNzZXNzbWVudHMvOmFzc2Vzc21lbnRJZCcsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBc3Nlc3NtZW50Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdhYycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9hc3Nlc3NtZW50L2Fzc2Vzc21lbnQucmV2aWV3Lmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24gKCkgeyByZXR1cm4gJ1JFVklFV19BU1NFU1NNRU5UJzsgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLy8gRXhwb3J0IGEgc3BlY2lmaWMgdGVhbSBhc3Nlc3NtZW50LlxyXG4gICAgICAgICAgICAud2hlbignL2Fzc2Vzc21lbnRzLzphc3Nlc3NtZW50SWQvdGVhbUFzc2Vzc21lbnRzLzp0ZWFtQXNzZXNzbWVudElkL2V4cG9ydCcsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBc3Nlc3NtZW50Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdhYycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9hc3Nlc3NtZW50L2Fzc2Vzc21lbnQuZXhwb3J0LnBkZi5odG1sJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdFWFBPUlRfQVNTRVNTTUVOVCc7IH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBhIHNoYXJlZCBhc3Nlc3NtZW50IHRvIHRoZSBsaXN0IG9mIHJldmlldyBhc3Nlc3NtZW50cy5cclxuICAgICAgICAgICAgLndoZW4oJy9hc3Nlc3NtZW50cy86YXNzZXNzbWVudElkL3RlYW0vOnRlYW1JZC9zaGFyZScsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBc3Nlc3NtZW50Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdhYycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9hc3Nlc3NtZW50L2Fzc2Vzc21lbnQucmV2aWV3Lmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24gKCkgeyByZXR1cm4gJ1NIQVJFX0FTU0VTU01FTlQnOyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAud2hlbignL2Fzc2Vzc21lbnRzLzphc3Nlc3NtZW50SWQvcGxheWJvb2snLCB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGxheWJvb2tDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3BjJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3BsYXlib29rL3BsYXlib29rLm5ldy5odG1sJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdDUkVBVEVfUExBWUJPT0snOyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyBsaXN0IGFsbCBwbGF5Ym9va3MuIFRoaXMgcmVhbGx5IHNob3VsZCBqdXN0IGJlIGluY2x1ZGVkIG9uIHRoZSBhc3Nlc3NtZW50cyBwYWdlLlxyXG4gICAgICAgICAgICAud2hlbignL3BsYXlib29rcycsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBc3Nlc3NtZW50Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdhYycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9wbGF5Ym9vay9wbGF5Ym9vay5saXN0Lmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24gKCkgeyByZXR1cm4gJ0xJU1RfQVNTRVNTTUVOVFMnOyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyBsaXN0IGFsbCBwbGF5Ym9va3MuXHJcbiAgICAgICAgICAgIC53aGVuKCcvYXNzZXNzbWVudHMvOmFzc2Vzc21lbnRJZC9wbGF5Ym9va3MnLCB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGxheWJvb2tDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3BjJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3BsYXlib29rL3BsYXlib29rLmRldGFpbHMuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbiAoKSB7IHJldHVybiAnTElTVF9QTEFZQk9PS1MnOyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyBQbGF5Ym9vayBkZXRhaWxzXHJcbiAgICAgICAgICAgIC53aGVuKCcvYXNzZXNzbWVudHMvOmFzc2Vzc21lbnRJZC9wbGF5Ym9va3MvOnBsYXlib29rSWQnLCB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGxheWJvb2tDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3BjJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3BsYXlib29rL3BsYXlib29rLmRldGFpbHMuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbiAoKSB7IHJldHVybiAnUExBWUJPT0tfREVUQUlMUyc7IH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vIFBsYXlib29rIGV4cG9ydFxyXG4gICAgICAgICAgICAud2hlbignL2Fzc2Vzc21lbnRzLzphc3Nlc3NtZW50SWQvcGxheWJvb2tzLzpwbGF5Ym9va0lkL2V4cG9ydCcsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQbGF5Ym9va0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAncGMnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGxheWJvb2svcGxheWJvb2suZXhwb3J0LnBkZi5odG1sJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdFWFBPUlRfUExBWUJPT0snOyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgcGxheWJvb2sgZGV0YWlscyBmb3IgdGVhbSBhc3Nlc3NtZW50XHJcbiAgICAgICAgICAgIC53aGVuKCcvYXNzZXNzbWVudHMvOmFzc2Vzc21lbnRJZC90ZWFtQXNzZXNzbWVudHMvOnRlYW1Bc3Nlc3NtZW50SWQvcGxheWJvb2snLCB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUGxheWJvb2tDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3BjJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3BsYXlib29rL3BsYXlib29rLm5ldy5odG1sJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdDUkVBVEVfUExBWUJPT0snOyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgcGxheWJvb2sgZGV0YWlscyBmb3IgYSB0ZWFtIGFzc2Vzc21lbnRcclxuICAgICAgICAgICAgLndoZW4oJy9hc3Nlc3NtZW50cy86YXNzZXNzbWVudElkL3RlYW1zLzp0ZWFtSWQvcGxheWJvb2tzLzpwbGF5Ym9va0lkJywge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1BsYXlib29rQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICdwYycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9wbGF5Ym9vay9wbGF5Ym9vay5kZXRhaWxzLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24gKCkgeyByZXR1cm4gJ1BMQVlCT09LX0RFVEFJTFMnOyB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgYSBwbGF5Ym9vayB0byB0aGUgc2hhcmVkIGxpc3RcclxuICAgICAgICAgICAgLndoZW4oJy9hc3Nlc3NtZW50cy86YXNzZXNzbWVudElkL3BsYXlib29rcy86cGxheWJvb2tJZC9zaGFyZScsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQbGF5Ym9va0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAncGMnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGxheWJvb2svcGxheWJvb2suZGV0YWlscy5odG1sJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdTSEFSRV9QTEFZQk9PSyc7IH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC53aGVuKCcvdW5hdXRob3JpemVkJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvc2VjdXJpdHkvdW5hdXRob3JpemVkLmh0bWwnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vdGhlcndpc2UoeyByZWRpcmVjdFRvOiAnLycgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgKiBBcHBsaWVzIGVudmlyb25tZW50IHZhbHVlIGZvciBlbmFibGluZyBvZiBkZWJ1Zy5cclxuICAgICogQHBhcmFtIHskbG9nUHJvdmlkZXJ9ICRsb2dQcm92aWRlclxyXG4gICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnc1xyXG4gICAgKi9cclxuICAgIGZ1bmN0aW9uIGRpc2FibGVMb2dnaW5nKCRsb2dQcm92aWRlciwgY29uZmlncykge1xyXG4gICAgICAgICRsb2dQcm92aWRlci5kZWJ1Z0VuYWJsZWQoY29uZmlncy5lbmFibGVEZWJ1Zyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIERlY29yYXRlcyB0aGUgJGxvZy5kZWJ1ZyBjYWxscyB0byBhbHNvIGluY2x1ZGVcclxuICAgICogZGF0ZSBhbmQgdGltZXN0YW1wIGluZm9ybWF0aW9uLlxyXG4gICAgKiBAcGFyYW0geyRwcm92aWRlfSAkcHJvdmlkZVxyXG4gICAgKi9cclxuICAgIGZ1bmN0aW9uIGRlY29yYXRlRGVidWdnZXIoJHByb3ZpZGUpIHtcclxuICAgICAgICAkcHJvdmlkZS5kZWNvcmF0b3IoJyRsb2cnLCBbJyRkZWxlZ2F0ZScsIGZ1bmN0aW9uICgkZGVsZWdhdGUpIHtcclxuICAgICAgICAgICAgdmFyIG9yaWdEZWJ1ZyA9ICRkZWxlZ2F0ZS5kZWJ1ZztcclxuICAgICAgICAgICAgJGRlbGVnYXRlLmRlYnVnID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICBhcmdzWzBdID0gW25ldyBEYXRlKCkudG9Mb2NhbGVTdHJpbmcoKSwgJzogJywgYXJnc1swXV0uam9pbignJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgb3JpZ0RlYnVnLmFwcGx5KG51bGwsIGFyZ3MpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGRlbGVnYXRlO1xyXG4gICAgICAgIH1dKTtcclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5ydW4ocnVuKTtcclxuXHJcbiAgICBydW4uJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckbG9jYXRpb24nLCAnYXV0aFNlcnZpY2UnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJ1biBjb25maWd1cmF0aW8gZm9yIGFwcCBtb2R1bGUuXHJcbiAgICAgKiBAcGFyYW0geyRyb290U2NvcGV9ICRyb290U2NvcGVcclxuICAgICAqIEBwYXJhbSB7JGxvY2F0aW9ufSAkbG9jYXRpb25cclxuICAgICAqIEBwYXJhbSB7ZmFjdG9yeX0gYXV0aFNlcnZpY2VcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcnVuKCRyb290U2NvcGUsICRsb2NhdGlvbiwgYXV0aFNlcnZpY2UpIHtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignJHJvdXRlQ2hhbmdlRXJyb3InLCBmdW5jdGlvbiAoZXZ0LCBjdXJyZW50LCBwcmV2aW91cywgcmVqZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgaGVyZSB0byBlbnN1cmUgcHJlbG9hZGluZyBhbmQgY2FjaGluZyB0aGUgdXNlclxyXG4gICAgICAgICAgICAvLyBiZWZvcmUgYXBwIG1vZHVsZXMgZ2V0IGluamVjdGVkIHdpdGggYSBzZXJ2aWNlIHNpbmdsZXRvblxyXG4gICAgICAgICAgICAvLyBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgICAgICAgICAgYXV0aFNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghcmVqZWN0aW9uLmF1dGhvcml6ZWQpIHtcclxuICAgICAgICAgICAgICAgIC8vRE8gU09NRVRISU5HXHJcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24udXJsKCd1bmF1dGhvcml6ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuYWRtaW4nKVxyXG4gICAgICAgIC5jb25maWcocm91dGVzKTtcclxuXHJcbiAgICByb3V0ZXMuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJvdXRlIGNvbmZpZ3VyYXRpb24gZm9yIGFkbWluIG1vZHVsZS5cclxuICAgICAqIEBwYXJhbSB7JHJvdXRlUHJvdmlkZXJ9ICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJvdXRlcygkcm91dGVQcm92aWRlcikge1xyXG4gICAgICAgIGxldCByZXNvbHZlID0ge1xyXG4gICAgICAgICAgICByZXNvbHZlZDogcmVzb2x2ZUF1dGhcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgICAgICAud2hlbignL2FkbWluL3VzZXJzJywge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3VzZXJDdHJsJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2FkbWluL3VzZXJzL3VzZXIuaHRtbCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgIC53aGVuKCcvdXNlcnMvOnVzZXJuYW1lJywge1xyXG4gICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdVc2VyQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndXNlckN0cmwnLFxyXG4gICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3VzZXJzL3VzZXIuaHRtbCdcclxuICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvYWRtaW4vdXNlcnMnLCB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVXNlcnNDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3VzZXJzQ3RybCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9hZG1pbi91c2Vycy91c2Vycy5odG1sJyxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHJlc29sdmVcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9hZG1pbi9sb2dzJywge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FwcGxpY2F0aW9uTG9nc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAnbG9nc0N0cmwnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvYWRtaW4vYXBwbG9ncy9hcHBsb2dzLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZTogcmVzb2x2ZVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub3RoZXJ3aXNlKHsgcmVkaXJlY3RUbzogJy8nIH0pO1xyXG5cclxuICAgICAgICByZXNvbHZlQXV0aC4kaW5qZWN0ID0gWyckbG9jYXRpb24nLCAnYXV0aFNlcnZpY2UnXTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmUtcm91dGVzIHRvIHVuYXV0aG9yaXplZCBwYWdlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7JGxvY2F0aW9ufSAkbG9jYXRpb25cclxuICAgICAgICAgKiBAcGFyYW0ge2ZhY3Rvcnl9IGF1dGhTZXJ2aWNlXHJcbiAgICAgICAgICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gcmVzb2x2ZUF1dGgoJGxvY2F0aW9uLCBhdXRoU2VydmljZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXV0aFNlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5pc0FkbWluKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChpc0FwcEFkbWluKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FwcEFkbWluKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3VuYXV0aG9yaXplZCcpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdwYkV4cG9ydEh0bWwnLEV4cG9ydEh0bWwpO1xyXG5cclxuICAgIEV4cG9ydEh0bWwuJGluamVjdCA9IFsnJGxvZycsICckdGltZW91dCddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhwb3J0cyBhbiBodG1sIGVsZW1lbnQgYXMgYSBwZGYgZmlsZS5cclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IGRpcmVjdGl2ZSBkZWZpbml0aW9uXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIEV4cG9ydEh0bWwoJGxvZywgJHRpbWVvdXQpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgZmlsZU5hbWU6ICdAJyxcclxuICAgICAgICAgICAgICAgIHJlYWR5VG9Eb3dubG9hZDogJz0nLFxyXG4gICAgICAgICAgICAgICAgaXNMb2FkaW5nOiAnPSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGluazogbGlua1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGlyZWN0aXZlIGxpbmsgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgb24gaW5pdGlhbGl6YXRpb24uXHJcbiAgICAgICAgICogQHBhcmFtIHskc2NvcGV9IHNjb3BlXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnRcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBhdHRyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayAoc2NvcGUsIGVsZW1lbnQsIGF0dHIpIHtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBXYXRjaGVzIGZvciBjaGFuZ2VzIHRvIHRoZSByZWFkVG9Eb3dubG9hZCBpbmRpY2F0b3IuIEV4ZWN1dGVzIGV4cG9ydCB3aGVuIHJlYWR5LlxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IG5ld1ZhbHVlXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gb2xkVmFsdWVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaCgncmVhZHlUb0Rvd25sb2FkJywgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSBvbGRWYWx1ZSAmJiBuZXdWYWx1ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2cuZGVidWcoJ3JlYWR5IHRvIGRvd25sb2FkJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFkZCBhIHNob3J0IGRlbGF5IHRvIGFsbG93IHJlbmRlcmluZyB0byBmaW5pc2guXHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBvcnRUb1BkZigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDE1MDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBEb3dubG9hZHMgYSBwZGYgZmlsZSB3aXRoIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gZXhwb3J0VG9QZGYoKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5pc0xvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICRsb2cuZGVidWcoJ2JlbmNobWFyayAtIGV4cG9ydCB0byBwZGYgLSBzdGFydCcpO1xyXG4gICAgICAgICAgICAgICAgaHRtbDJjYW52YXMoZWxlbWVudCwge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ucmVuZGVyZWQ6IGZ1bmN0aW9uIChjYW52YXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5kZWJ1ZygnYmVuY2htYXJrIC0gZXhwb3J0IHRvIHBkZiAtIG9ucmVuZGVyZWQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbWdEYXRhID0gY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvcG5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuZGVidWcoJ2JlbmNobWFyayAtIGV4cG9ydCB0byBwZGYgLSBjb252ZXJ0ZWQgY2FudmFzJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZG9jID0gbmV3IGpzUERGKCdwJywgJ21tJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuZGVidWcoJ2JlbmNobWFyayAtIGV4cG9ydCB0byBwZGYgLSBjcmVhdGVkIGpzcGRmIGRvYycpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGltZ1dpZHRoID0gZG9jLmludGVybmFsLnBhZ2VTaXplLndpZHRoOyAvLzIxMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5kZWJ1ZygnYmVuY2htYXJrIC0gZXhwb3J0IHRvIHBkZiAtIGltZ1dpZHRoJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFnZUhlaWdodCA9IGRvYy5pbnRlcm5hbC5wYWdlU2l6ZS5oZWlnaHQ7IC8vMjk1O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9nLmRlYnVnKCdiZW5jaG1hcmsgLSBleHBvcnQgdG8gcGRmIC0gcGFnZUhlaWdodCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGltZ0hlaWdodCA9IGNhbnZhcy5oZWlnaHQgKiBpbWdXaWR0aCAvIGNhbnZhcy53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5kZWJ1ZygnYmVuY2htYXJrIC0gZXhwb3J0IHRvIHBkZiAtIGltZ0hlaWdodCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhlaWdodExlZnQgPSBpbWdIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuZGVidWcoJ2JlbmNobWFyayAtIGV4cG9ydCB0byBwZGYgLSBoZWlnaHRMZWZ0Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb24gPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9nLmRlYnVnKCdiZW5jaG1hcmsgLSBleHBvcnQgdG8gcGRmIC0gcG9zaXRpb24nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZGltYWdlKGltYWdlRGF0YSwgZm9ybWF0LCB4LCB5LCB3LCBoLCBhbGlhcywgY29tcHJlc3Npb24sIHJvdGF0aW9uKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2MuYWRkSW1hZ2UoaW1nRGF0YSwgJ1BORycsIDAsIHBvc2l0aW9uLCBpbWdXaWR0aCwgaW1nSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5kZWJ1ZygnYmVuY2htYXJrIC0gZXhwb3J0IHRvIHBkZiAtIGFkZGVkIGZpcnN0IGltYWdlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHRMZWZ0IC09IHBhZ2VIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaGVpZ2h0TGVmdCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9nLmRlYnVnKCdiZW5jaG1hcmsgLSBleHBvcnQgdG8gcGRmIC0gYWRkaW5nIHBhZ2UnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IGhlaWdodExlZnQgLSBpbWdIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2MuYWRkUGFnZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jLmFkZEltYWdlKGltZ0RhdGEsICdQTkcnLCAwLCBwb3NpdGlvbiwgaW1nV2lkdGgsIGltZ0hlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHRMZWZ0IC09IHBhZ2VIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuZGVidWcoJ2JlbmNobWFyayAtIGV4cG9ydCB0byBwZGYgLSBzYXZpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jLnNhdmUoc2NvcGUuZmlsZU5hbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9nLmRlYnVnKCdiZW5jaG1hcmsgLSBleHBvcnQgdG8gcGRmIC0gZG9uZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdoZWFkZXJOYXYnLCBoZWFkZXJOYXYpO1xyXG5cclxuICAgIGhlYWRlck5hdi4kaW5qZWN0ID0gWyckZG9jdW1lbnQnLCAnYXV0aFNlcnZpY2UnLCBdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlyZWN0aXZlIHRvIGNyZWF0ZSB0aGUgYXBwbGljYXRpb24gaGVhZGVyIGFuZCBuYXZpZ2F0aW9uLlxyXG4gICAgICogQHBhcmFtIHskZG9jdW1lbnR9ICRkb2N1bWVudFxyXG4gICAgICogQHBhcmFtIHtmYWN0b3J5fSBhdXRoU2VydmljZVxyXG4gICAgICogQHJldHVybnMge09iamVjdH1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaGVhZGVyTmF2KCRkb2N1bWVudCwgYXV0aFNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL2hlYWRlci1uYXYuaHRtbCcsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICBhcHBUaXRsZTogJ0AnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTGluayBmdW5jdGlvbi5cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gc2NvcGVcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBlbGVtZW50XHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gYXR0cnNcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICBzY29wZS5uYXZJdGVtcyA9IFtdO1xyXG4gICAgICAgICAgICBzY29wZS5tZW51ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHNjb3BlLnVzZXJOYW1lID0gbnVsbDtcclxuICAgICAgICAgICAgZ2V0Q3VycmVudFVzZXIoKTtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLnNlbGVjdCA9IHNlbGVjdDtcclxuICAgICAgICAgICAgc2NvcGUuc2hvd01lbnUgPSBzaG93TWVudTtcclxuICAgICAgICAgICAgY2hlY2tBZG1pblJpZ2h0cygpO1xyXG5cclxuICAgICAgICAgICAgLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgICAgICB2YXIgYWRtaW5TdWJJdGVtcyA9IFtcclxuICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdFcnJvciBMb2dzJywgaHJlZjogJyMvYWRtaW4vZXJyb3JzJyB9XHJcbiAgICAgICAgICAgIF07XHJcblxyXG4gICAgICAgICAgICBzY29wZS5uYXZJdGVtcyA9IFtcclxuICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdBc3Nlc3NtZW50cycsIGhyZWY6ICcvIy9hc3Nlc3NtZW50cycgfSxcclxuICAgICAgICAgICAgICAgIHsgdGl0bGU6ICdQbGF5Ym9va3MnLCBocmVmOiAnLyMvcGxheWJvb2tzJyB9LFxyXG4gICAgICAgICAgICAgICAgeyB0aXRsZTogJ0FkbWluJywgc3ViSXRlbXM6IGFkbWluU3ViSXRlbXMgfVxyXG4gICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIERldGVybWluZXMgaWYgdGhlIGN1cnJlbnQgdXNlciBpcyBhbiBhZG1pbmlzdHJhdG9yLlxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiBhZG1pblxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gY2hlY2tBZG1pblJpZ2h0cygpIHtcclxuICAgICAgICAgICAgICAgIC8vY2hlY2tpbmcgcmlnaHRzXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXV0aFNlcnZpY2VcclxuICAgICAgICAgICAgICAgICAgICAuaXNBZG1pbigpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGlzQXBwQWRtaW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9hZG1pbiByaWdodHMgY2hlY2tlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpdGVtIGluIHNjb3BlLm5hdkl0ZW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2NvcGUubmF2SXRlbXNbaXRlbV0udGl0bGUgPT0gJ0FkbWluJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLm5hdkl0ZW1zW2l0ZW1dLmhpZGUgPSAhaXNBcHBBZG1pbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNBcHBBZG1pbjtcclxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9BZG1pbiBBdXRoZW50aWNhdGlvbiBFcnJvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFRvZ2dsZXMgc2hvd2luZyB0aGUgbWVudS5cclxuICAgICAgICAgICAgICogVE9ETzogc2VwYXJhdGUgdGhpcyBpbnRvIGl0J3Mgb3duIGRpcmVjdGl2ZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2hvd01lbnUoKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5tZW51ID0gIXNjb3BlLm1lbnU7XHJcbiAgICAgICAgICAgICAgICAkZG9jdW1lbnQuZmluZCgnYm9keScpLnRvZ2dsZUNsYXNzKCdlbS1pcy1kaXNhYmxlZC1zbWFsbCcsIHNjb3BlLm1lbnUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQWN0aW9ucyB0byB0YWtlIHdoZW4gYSBtZW51IGl0ZW0gaXMgc2VsZWN0ZWQuXHJcbiAgICAgICAgICAgICAqIFRPRE86IHNlcGFyYXRlIHRoaXMgaW50byBpdCdzIG93biBkaXJlY3RpdmVcclxuICAgICAgICAgICAgICogQHBhcmFtIHt0eXBlfSBuYXZJdGVtXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZWxlY3QobmF2SXRlbSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGlzQWN0aXZlID0gIW5hdkl0ZW0uYWN0aXZlO1xyXG5cclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzY29wZS5uYXZJdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgbmF2SXRlbS5hY3RpdmUgPSBpc0FjdGl2ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBdHRhY2ggZG9jdW1lbnQgY2xpY2sgdG8gaGlkZSBzZWxlY3RcclxuICAgICAgICAgICAgICAgIGlmIChuYXZJdGVtLmFjdGl2ZSlcclxuICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub24oJ2NsaWNrJywgY2xpY2tIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEV2ZW50IGhhbmRsZXIgd2hlbiBtZW51IGl0ZW0gaXMgY2xpY2tlZC5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7dHlwZX0gZXZlbnRcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY2xpY2tIYW5kbGVyKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2VtLWMtcHJpbWFyeS1uYXZfX2xpbmsnKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3QoeyBhY3RpdmU6IHRydWUgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuJGFwcGx5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5vZmYoJ2NsaWNrJywgY2xpY2tIYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFNldHMgdGhlIHVzZXIgZGlzcGxheSBuYW1lIGJhc2VkIG9uIHRoZSBjdXJyZW50IGxvZ2dlZCBpbiB1c2VyLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0Q3VycmVudFVzZXIoKSB7XHJcbiAgICAgICAgICAgICAgICBhdXRoU2VydmljZS5nZXRDdXJyZW50VXNlcigpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUudXNlck5hbWUgPSBkYXRhLkZ1bGxOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmZpbHRlcignbG9hZGluZycsIGxvYWRpbmcpO1xyXG5cclxuICAgIGxvYWRpbmcuJGluamVjdCA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmlsdGVyIHRvIGRpc3BsYXkgYSBsb2FkaW5nIHRleHQgbWVzc2FnZS5cclxuICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGxvYWRpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChpbnB1dCwgd2F0Y2gpIHtcclxuICAgICAgICAgICAgaWYgKHdhdGNoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlucHV0O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICdMb2FkaW5nLi4uJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuZmlsdGVyKCd0cnVuY2F0ZScsIFRydW5jYXRlKTtcclxuXHJcbiAgICBUcnVuY2F0ZS4kaW5qZWN0ID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaWx0ZXIgdG8gZGlzcGxheSB0ZXh0IGFzIHRydW5jYXRlZCBpZiBpdCdzIHRvbyBsb25nLlxyXG4gICAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gVHJ1bmNhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0ZXh0LCBsZW5ndGgsIGVuZCkge1xyXG4gICAgICAgICAgICBpZiAoaXNOYU4obGVuZ3RoKSlcclxuICAgICAgICAgICAgICAgIGxlbmd0aCA9IDEwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBlbmQgPT09IFwidW5kZWZpbmVkXCIpXHJcbiAgICAgICAgICAgICAgICBlbmQgPSBcIi4uLlwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRleHQubGVuZ3RoIDw9IGxlbmd0aCB8fCB0ZXh0Lmxlbmd0aCAtIGVuZC5sZW5ndGggPD0gbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcodGV4dCkuc3Vic3RyaW5nKDAsIGxlbmd0aCAtIGVuZC5sZW5ndGgpICsgZW5kO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuYXNzZXNzbWVudCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0Fzc2Vzc21lbnRDb250cm9sbGVyJywgQXNzZXNzbWVudENvbnRyb2xsZXIpO1xyXG5cclxuICAgIEFzc2Vzc21lbnRDb250cm9sbGVyLiRpbmplY3QgPSBbJ2Fzc2Vzc21lbnREYXRhU2VydmljZScsICckbG9nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyRyb3V0ZVBhcmFtcycsICdhY3Rpb24nLCAnJGxvY2F0aW9uJywgJyRxJywgJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnRyb2xsZXIgcmVzcG9uc2libGUgZm9yIGFsbCBhY3Rpb25zIHJlbGF0ZWQgdG8gdGFraW5nIGFuZCByZXZpZXdpbmcgYW4gYXNzZXNzbWVudC5cclxuICAgICAqIEBwYXJhbSB7QXNzZXNzbWVudERhdGFTZXJ2aWNlfSBhc3Nlc3NtZW50RGF0YVNlcnZpY2VcclxuICAgICAqIEBwYXJhbSB7JGxvZ30gJGxvZ1xyXG4gICAgICogQHBhcmFtIHskcm91dGVQYXJhbXN9ICRyb3V0ZVBhcmFtc1xyXG4gICAgICogQHBhcmFtIHskYWN0aW9ufSBhY3Rpb25cclxuICAgICAqIEBwYXJhbSB7JGxvY2F0aW9ufSAkbG9jYXRpb25cclxuICAgICAqIEBwYXJhbSB7JHF9ICRxXHJcbiAgICAgKiBAcGFyYW0geyRyb290U2NvcGV9ICRyb290U2NvcGVcclxuICAgICAqIEBwYXJhbSB7JHRpbWVvdXR9ICR0aW1lb3V0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIEFzc2Vzc21lbnRDb250cm9sbGVyKGFzc2Vzc21lbnREYXRhU2VydmljZSwgJGxvZywgJHJvdXRlUGFyYW1zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uLCAkbG9jYXRpb24sICRxLCAkcm9vdFNjb3BlLCAkdGltZW91dCkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXMsXHJcbiAgICAgICAgICAgIHJvdXRlQXNzZXNzbWVudElkID0gbnVsbCxcclxuICAgICAgICAgICAgcm91dGVUZWFtSWQgPSBudWxsLFxyXG4gICAgICAgICAgICByb3V0ZVRlYW1Bc3Nlc3NtZW50SWQgPSBudWxsO1xyXG5cclxuICAgICAgICAvLyBBdmFpbGFibGUgdmlld2luZyBtb2Rlcy5cclxuICAgICAgICB2bS5tb2RlcyA9IHtcclxuICAgICAgICAgICAgcmV2aWV3OiAwLFxyXG4gICAgICAgICAgICByZXZpZXdEZXRhaWxzOiAxLFxyXG4gICAgICAgICAgICBlZGl0OiAyLFxyXG4gICAgICAgICAgICBkb3dubG9hZDogM1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEFsbCBhc3Nlc3NtZW50cy4gVGVhbSBBc3Nlc3NtZW50cyBhcmUgb2JqZWN0cyB3aXRoaW4gdGhlc2UgYXNzZXNzbWVudHMuXHJcbiAgICAgICAgdm0uYXNzZXNzbWVudHMgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gQ3VycmVudCBhc3Nlc3NtZW50LlxyXG4gICAgICAgIHZtLmFzc2Vzc21lbnQgPSB7XHJcbiAgICAgICAgICAgIHRlYW1Bc3Nlc3NtZW50czogW11cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBDdXJyZW50IFRFQU0gYXNzZXNzbWVudCB0aGF0IHRoZSB1c2VyIGlzIGVpdGhlciB0YWtpbmcgb3IgcmV2aWV3aW5nLlxyXG4gICAgICAgIHZtLmN1cnJlbnQgPSB7XHJcbiAgICAgICAgICAgIGRldGFpbHM6IHt9LFxyXG4gICAgICAgICAgICByYWRhckNoYXJ0RGF0YToge30sXHJcbiAgICAgICAgICAgIHF1ZXN0aW9uUmVzcG9uc2VzQnlDYXRlZ29yeTogW10sXHJcbiAgICAgICAgICAgIG1vZGU6IHZtLm1vZGVzLnJldmlldyxcclxuICAgICAgICAgICAgY2FuY2VsOiBmdW5jdGlvbiAoKSB7ICRsb2NhdGlvbi5wYXRoKCcvYXNzZXNzbWVudHMnKTsgfSxcclxuICAgICAgICAgICAgc2F2ZTogc2F2ZUFzc2Vzc21lbnQsXHJcbiAgICAgICAgICAgIHN1Ym1pdDogc3VibWl0QXNzZXNzbWVudCxcclxuICAgICAgICAgICAgcmV2aWV3OiBmdW5jdGlvbiAoKSB7ICRsb2NhdGlvbi5wYXRoKCcvYXNzZXNzbWVudHMvJyArIHRoaXMuZGV0YWlscy5hc3Nlc3NtZW50SWQpOyB9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEluZGljYXRpb24gdGhhdCB3ZSBoYXZlIGFsbCBvZiB0aGUgZGF0YSB0aGF0IHRoZSBVSSBuZWVkcyB0byBkaXNwbGF5LlxyXG4gICAgICAgIHZtLmxvYWRpbmcgPSB7XHJcbiAgICAgICAgICAgIGlzQW55dGhpbmdMb2FkaW5nOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdm0ubG9hZGluZy5sb2FkZXJzLmdldHRpbmdEYXRhID09PSB0cnVlIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZy5sb2FkZXJzLnByb2Nlc3NpbmdEYXRhID09PSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkb25lTG9hZGluZzogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5sb2FkaW5nLmxvYWRlcnMuZ2V0dGluZ0RhdGEgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcubG9hZGVycy5wcm9jZXNzaW5nRGF0YSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsb2FkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBnZXR0aW5nRGF0YTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHByb2Nlc3NpbmdEYXRhOiBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBFcnJvciBvciBpbmZvcm1hdGl2ZSBtZXNzYWdlIHRvIGRpc3BsYXkgaW5zdGVhZCBvZiB0aGUgaW50ZW5kZWQgY29udGVudC5cclxuICAgICAgICB2bS5tZXNzYWdlID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gRXJyb3Igb3IgaW5mb3JtYXRpb24gbWVzc2FnZSB0byBkaXNwbGF5IGluIGFkZGl0aW9uIHRvIHRoZSBpbnRlbmRlZCBjb250ZW50LlxyXG4gICAgICAgIHZtLmluZm8gPSBudWxsO1xyXG5cclxuICAgICAgICAvLyBBc3Nlc3NtZW50IGFjdGlvbnMuXHJcbiAgICAgICAgdm0uZ2V0QXNzZXNzbWVudExpc3QgPSBnZXRBc3Nlc3NtZW50TGlzdDtcclxuICAgICAgICB2bS5nZXRUZWFtQXNzZXNzbWVudExpc3QgPSBnZXRUZWFtQXNzZXNzbWVudExpc3Q7XHJcbiAgICAgICAgdm0uZ2V0VGVhbUFzc2Vzc21lbnRMaXN0Rm9yQXNzZXNzbWVudCA9IGdldFRlYW1Bc3Nlc3NtZW50TGlzdEZvckFzc2Vzc21lbnQ7XHJcbiAgICAgICAgdm0uZ2V0VGVhbUFzc2Vzc21lbnREZXRhaWxzQnlJZCA9IGdldFRlYW1Bc3Nlc3NtZW50RGV0YWlsc0J5SWQ7XHJcbiAgICAgICAgdm0udGFrZUFzc2Vzc21lbnQgPSB0YWtlQXNzZXNzbWVudDtcclxuICAgICAgICB2bS5yZXZpZXdUZWFtQXNzZXNzbWVudCA9IHJldmlld1RlYW1Bc3Nlc3NtZW50O1xyXG4gICAgICAgIHZtLmFkZFNoYXJlZEFzc2Vzc21lbnQgPSBhZGRTaGFyZWRBc3Nlc3NtZW50O1xyXG4gICAgICAgIHZtLmdldFNoYXJlQXNzZXNzbWVudExpbmsgPSBnZXRTaGFyZUFzc2Vzc21lbnRMaW5rO1xyXG4gICAgICAgIHZtLmFjdGl2YXRlID0gYWN0aXZhdGU7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFjdGlvbnMgdG8gdGFrZSB1cG9uIHBhZ2UgbG9hZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgLy92bS5sb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdm0ubG9hZGluZy5sb2FkZXJzLmdldHRpbmdEYXRhID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCByb3V0ZSBwYXJhbXMuXHJcbiAgICAgICAgICAgIHJvdXRlQXNzZXNzbWVudElkID0gKyRyb3V0ZVBhcmFtcy5hc3Nlc3NtZW50SWQ7XHJcbiAgICAgICAgICAgIHJvdXRlVGVhbUlkID0gKyRyb3V0ZVBhcmFtcy50ZWFtSWQ7XHJcbiAgICAgICAgICAgIHJvdXRlVGVhbUFzc2Vzc21lbnRJZCA9ICskcm91dGVQYXJhbXMudGVhbUFzc2Vzc21lbnRJZDtcclxuXHJcbiAgICAgICAgICAgIC8vIGFsd2F5cyBnZXQgYWxsIGFzc2Vzc21lbnRzIGFuZCB0aGVpciB0ZWFtIGFzc2Vzc21lbnQgaW5mby4gVG9wIGxldmVsIG9ubHkuXHJcbiAgICAgICAgICAgIHZtLmdldEFzc2Vzc21lbnRMaXN0KClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKHJvdXRlQXNzZXNzbWVudElkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRUZWFtQXNzZXNzbWVudExpc3RGb3JBc3Nlc3NtZW50KHJvdXRlQXNzZXNzbWVudElkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgY3VycmVudCBhc3Nlc3NtZW50IGJhc2VkIG9uIHJvdXRlIHBhcmFtcy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RDdXJyZW50QXNzZXNzbWVudEJ5SWQocm91dGVBc3Nlc3NtZW50SWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdUQUtFX0FTU0VTU01FTlQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3RhcnQgdGhlIGFzc2Vzc21lbnQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDdXJyZW50TW9kZSh2bS5tb2Rlcy5lZGl0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnRha2VBc3Nlc3NtZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ1JFVklFV19BU1NFU1NNRU5UJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgdGVhbSBhc3Nlc3NtZW50IGRldGFpbHMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDdXJyZW50TW9kZSh2bS5tb2Rlcy5yZXZpZXcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRvUmV2aWV3ID0gZ2V0RGVmYXVsdFRlYW1Bc3Nlc3NtZW50Rm9yQ3VycmVudEFzc2Vzc21lbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLnJldmlld1RlYW1Bc3Nlc3NtZW50KHRvUmV2aWV3KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9ICdVbmFibGUgdG8gcmV2aWV3IGFzc2Vzc21lbnQuJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92bS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nLmRvbmVMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ1NIQVJFX0FTU0VTU01FTlQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIHRoZSBhc3Nlc3NtZW50IHRvIHRoZSBzaGFyZWQgbGlzdC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmFkZFNoYXJlZEFzc2Vzc21lbnQocm91dGVBc3Nlc3NtZW50SWQsIHJvdXRlVGVhbUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnRVhQT1JUX0FTU0VTU01FTlQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSByZXZpZXcgZGF0YSBhbmQgaW5kaWNhdGUgdGhhdCBpdCdzIGxvYWRlZCBhbmQgcmVhZCB0byBkb3dubG9hZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0b1JldmlldyA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXNzbWVudERhdGFTZXJ2aWNlLmdldFRlYW1Bc3Nlc3NtZW50QnlJZEZyb21Hcm91cGVkTGlzdChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uYXNzZXNzbWVudC50ZWFtQXNzZXNzbWVudHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlVGVhbUFzc2Vzc21lbnRJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5yZXZpZXdUZWFtQXNzZXNzbWVudCh0b1JldmlldylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSAnVW5hYmxlIHRvIGV4cG9ydCBhc3Nlc3NtZW50Lic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmluYWxseShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEN1cnJlbnRNb2RlKHZtLm1vZGVzLmRvd25sb2FkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92bS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nLmRvbmVMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJbmRpY2F0ZSB3ZSd2ZSBsb2FkZWQgYWxsIHRoYXQgd2UndmUgYmVlbiB0b2xkIHRvLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92bS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGluZy5kb25lTG9hZGluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nLmRvbmVMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXRzIHRoZSBjdXJyZW50IHZpZXdpbmcgbW9kZS5cclxuICAgICAgICAgKiBAcGFyYW0ge0ludH0gbW9kZSAtIGZyb20gdm0ubW9kZXMgZW51bVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNldEN1cnJlbnRNb2RlKG1vZGUpIHtcclxuICAgICAgICAgICAgdm0uY3VycmVudC5tb2RlID0gbW9kZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNldHMgdGhlIGN1cnJlbnQgYXNzZXNzbWVudCBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgaWQuXHJcbiAgICAgICAgICogQHBhcmFtIHtJbnR9IGFzc2Vzc21lbnRJZFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNlbGVjdEN1cnJlbnRBc3Nlc3NtZW50QnlJZChhc3Nlc3NtZW50SWQpIHtcclxuICAgICAgICAgICAgdm0uYXNzZXNzbWVudCA9IHZtLmFzc2Vzc21lbnRzLmZpbmQoZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhLmlkID09PSBhc3Nlc3NtZW50SWQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0cyB0aGUgZGVmYXVsdCB0ZWFtIGFzc2Vzc21lbnQgZm9yIHRoZSBjdXJyZW50IGFzc2Vzc21lbnQuXHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH0gdGVhbSBhc3Nlc3NtZW50IGRldGFpbHMuIFJldHVybnMgdW5kZWZpbmVkIGlmIG5vdCBmb3VuZC4gXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0RGVmYXVsdFRlYW1Bc3Nlc3NtZW50Rm9yQ3VycmVudEFzc2Vzc21lbnQoKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZWFtQXNzZXNzbWVudDtcclxuICAgICAgICAgICAgaWYgKHZtLmFzc2Vzc21lbnQudGVhbUFzc2Vzc21lbnRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRlYW1Bc3Nlc3NtZW50ID0gdm0uYXNzZXNzbWVudC50ZWFtQXNzZXNzbWVudHNbMF0ubGF0ZXN0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0ZWFtQXNzZXNzbWVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgYWxsIGF2YWlsYWJsZSBhc3Nlc3NtZW50cy5cclxuICAgICAgICAgKiBEb2VzIG5vdCBpbmNsdWRlIGFueSB0ZWFtIGFzc2Vzc21lbnRzLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldEFzc2Vzc21lbnRMaXN0KCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICBhc3Nlc3NtZW50RGF0YVNlcnZpY2UuZ2V0QXNzZXNzbWVudHMoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5hc3Nlc3NtZW50cyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh2bS5hc3Nlc3NtZW50cyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJldHVybiBhIHByb21pc2Ugc28gdGhhdCB3ZSBjYW4gY2hhaW4gdGhlc2UgdG9nZXRoZXIgYXMgbmVlZGVkLlxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgYWxsIHRlYW0gYXNzZXNzbWVudHMgZm9yIGFsbCBhc3Nlc3NtZW50cy5cclxuICAgICAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRUZWFtQXNzZXNzbWVudExpc3QoKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCksXHJcbiAgICAgICAgICAgICAgICBkZXRhaWxzUHJvbWlzZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCBhbGwgdGVhbSBhc3Nlc3NtZW50cyBmb3IgZWFjaCBhc3Nlc3NtZW50LlxyXG4gICAgICAgICAgICBkZXRhaWxzUHJvbWlzZXMgPSB2bS5hc3Nlc3NtZW50cy5tYXAoZnVuY3Rpb24gKGFzc2Vzc21lbnQsIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhZGQgYSBuZXcgcHJvbWlzZSB0byBvdXIgbGlzdC5cclxuICAgICAgICAgICAgICAgIC8vIHRoaXMgcHJvbWlzZSBpbmNsdWRlcyBhZGRpbmcgdGhlIHRlYW0gYXNzZXNzbWVudHMgdG8gb3VyIGFycmF5LlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzc2Vzc21lbnREYXRhU2VydmljZS5nZXRUZWFtQXNzZXNzbWVudHMoYXNzZXNzbWVudC5pZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmFzc2Vzc21lbnRzW2luZGV4XS50ZWFtQXNzZXNzbWVudHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gc2VuZCBhbGwgb2Ygb3VyIHByb21pc2VzIGF0IHRoZSBzYW1lIHRpbWUgdG8gZ2V0IGFsbCBvZiBvdXIgZGV0YWlscyBmb3IgYWxsIGFzc2Vzc21lbnRzLlxyXG4gICAgICAgICAgICAkcS5hbGwoZGV0YWlsc1Byb21pc2VzKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJldHVybiBhIHByb21pc2Ugc28gdGhhdCB3ZSBjYW4gY2hhaW4gdGhlc2UgdG9nZXRoZXIgYXMgbmVlZGVkLlxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgYWxsIHRlYW0gYXNzZXNzbWVudHMgZm9yIHRoZSBnaXZlbiBhc3Nlc3NtZW50LlxyXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhc3Nlc3NtZW50SWRcclxuICAgICAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRUZWFtQXNzZXNzbWVudExpc3RGb3JBc3Nlc3NtZW50KGFzc2Vzc21lbnRJZCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICBhc3Nlc3NtZW50RGF0YVNlcnZpY2UuZ2V0VGVhbUFzc2Vzc21lbnRzKGFzc2Vzc21lbnRJZClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uYXNzZXNzbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhLnRlYW1Bc3Nlc3NtZW50cyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gTWF0Y2ggdXAgdG8gdGhlIGRlc2lyZWQgYXNzZXNzbWVudC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGEuaWQgPT09IGFzc2Vzc21lbnRJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlYW1Hcm91cCA9IGRhdGEuZ3JvdXAodGVhbUFzc2Vzc21lbnQgPT4gdGVhbUFzc2Vzc21lbnQudGVhbU5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlYW1Bc3Nlc3NtZW50cyA9IFtdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlYW1Bc3Nlc3NtZW50T2JqID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgbGF0ZXN0IHRlYW0gYXNzZXNzbWVudCBmb3IgZWFjaCB0ZWFtIGFuZCBhZGQgaXQgdG8gdGhlIGxpc3QuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godGVhbUdyb3VwLCBmdW5jdGlvbiAoZ3JvdXBlZERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZWFtQXNzZXNzbWVudHMgPSBncm91cGVkRGF0YS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlYW1Bc3Nlc3NtZW50T2JqID0gYXNzZXNzbWVudERhdGFTZXJ2aWNlLmdldE1vc3RSZWNlbnRBdHRlbXB0Rm9yVGVhbSh0ZWFtQXNzZXNzbWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEudGVhbUFzc2Vzc21lbnRzLnB1c2godGVhbUFzc2Vzc21lbnRPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZSBzbyB0aGF0IHdlIGNhbiBjaGFpbiB0aGVzZSB0b2dldGhlciBhcyBuZWVkZWQuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0IHRoZSBUZWFtIEFzc2Vzc21lbnQgb2JqZWN0IGRldGFpbGVkIHJlc3BvbnNlcy5cclxuICAgICAgICAgKiBAcGFyYW0ge0ludH0gYXNzZXNzbWVudElkXHJcbiAgICAgICAgICogQHBhcmFtIHtJbnR9IHRlYW1Bc3Nlc3NtZW50SWRcclxuICAgICAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gcmV0dXJucyBlbXB0eSBwcm9taXNlIHdoZW4gY29tcGxldGVkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VGVhbUFzc2Vzc21lbnREZXRhaWxzQnlJZChhc3Nlc3NtZW50SWQsIHRlYW1Bc3Nlc3NtZW50SWQpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGFzc2Vzc21lbnREYXRhU2VydmljZS5nZXRUZWFtQXNzZXNzbWVudERldGFpbHNCeUlkKGFzc2Vzc21lbnRJZCwgdGVhbUFzc2Vzc21lbnRJZClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmN1cnJlbnQuZGV0YWlscyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gXCJVbmFibGUgdG8gcmV0cmlldmUgdGVhbSBhc3Nlc3NtZW50IGRldGFpbHMuIFBsZWFzZSB0cnkgYWdhaW4uXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gUmV0dXJuIGEgcHJvbWlzZSBzbyB0aGF0IHdlIGNhbiBjaGFpbiB0aGVzZSB0b2dldGhlciBhcyBuZWVkZWQuXHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU3RhcnRzIHRoZSBhc3Nlc3NtZW50IGFuZCBsb2FkcyB0aGUgcXVlc3Rpb25zLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHRha2VBc3Nlc3NtZW50KCkge1xyXG4gICAgICAgICAgICAvL3ZtLmxvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2bS5sb2FkaW5nLmxvYWRlcnMuZ2V0dGluZ0RhdGEgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJvdXRlQXNzZXNzbWVudElkID4gMCAmJiByb3V0ZVRlYW1JZCA+IDApIHtcclxuICAgICAgICAgICAgICAgICRsb2cuZGVidWcoXCJTdGFydGluZyBhc3Nlc3NtZW50IGZvciBpZDogXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlQXNzZXNzbWVudElkICtcclxuICAgICAgICAgICAgICAgICAgICBcIiBhbmQgdGVhbSBpZDogXCIgK1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlVGVhbUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgdGVhbSBhc3Nlc3NtZW50IG9iamVjdC5cclxuICAgICAgICAgICAgICAgIGFzc2Vzc21lbnREYXRhU2VydmljZS5zdGFydEFzc2Vzc21lbnQocm91dGVBc3Nlc3NtZW50SWQsIHJvdXRlVGVhbUlkKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmN1cnJlbnQuZGV0YWlscyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3IgIT09IFwidW5kZWZpbmVkXCIgJiYgZXJyb3IgIT09IG51bGwgJiYgZXJyb3IgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBlcnJvci50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9IFwiQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCB3aGlsZSB0cnlpbmcgdG8gc3RhcnQgdGhpcyBhc3Nlc3NtZW50LiBQbGVhc2UgdHJ5IGFnYWluLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuZmluYWxseShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcuZG9uZUxvYWRpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0cyB0aGUgdGVhbSBhc3Nlc3NtZW50IGRldGFpbHMgdG8gcmV2aWV3LlxyXG4gICAgICAgICAqIEJ1aWxkcyB0aGUgcmFkYXIgY2hhcnQgZGF0YSBmb3IgdGhlIGN1cnJlbnQgYXNzZXNzbWVudC5cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gYXNzZXNzbWVudCAtIHRlYW0gYXNzZXNzbWVudCBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiByZXZpZXdUZWFtQXNzZXNzbWVudChhc3Nlc3NtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXNzZXNzbWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KFwiQXNzZXNzbWVudCBpcyB1bmRlZmluZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZtLmN1cnJlbnQuZGV0YWlscyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB2bS5jdXJyZW50LmRldGFpbHMuaWQgPT09IGFzc2Vzc21lbnQuaWQpIHtcclxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2bS5jdXJyZW50Lm1vZGUgPSB2bS5tb2Rlcy5yZXZpZXc7XHJcbiAgICAgICAgICAgICAgICB2bS5jdXJyZW50LmRldGFpbHMgPSBhc3Nlc3NtZW50O1xyXG4gICAgICAgICAgICAgICAgdm0uY3VycmVudC5yYWRhckNoYXJ0RGF0YSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2bS5pc1RlYW1Bc3Nlc3NtZW50RGV0YWlsTG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gR2V0IG90aGVyIGF0dGVtcHQgaW5mby5cclxuICAgICAgICAgICAgICAgIHZtLmN1cnJlbnQuYXR0ZW1wdHMgPSBnZXRUZWFtQXNzZXNzbWVudEF0dGVtcHRzKHZtLmFzc2Vzc21lbnQudGVhbUFzc2Vzc21lbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uY3VycmVudC5kZXRhaWxzLmFzc2Vzc21lbnRJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmN1cnJlbnQuZGV0YWlscy50ZWFtSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgYXNzZXNzbWVudCBkZXRhaWxzLCBsaWtlIHF1ZXN0aW9ucyBhbmQgYW5zd2Vycy5cclxuICAgICAgICAgICAgICAgIHZtLmdldFRlYW1Bc3Nlc3NtZW50RGV0YWlsc0J5SWQodm0uY3VycmVudC5kZXRhaWxzLmFzc2Vzc21lbnRJZCwgdm0uY3VycmVudC5kZXRhaWxzLmlkKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2V0dXAgdGhlIHJhZGFyIGNoYXJ0IGRhdGEuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmN1cnJlbnQucmFkYXJDaGFydERhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZ2VuZDogW11cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2bS5jdXJyZW50LmRldGFpbHMgIT09IFwidW5kZWZpbmVkXCIgJiYgdm0uY3VycmVudC5kZXRhaWxzICE9PSBudWxsICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5jdXJyZW50LmRldGFpbHMuY2F0ZWdvcnlSZXN1bHRzICE9PSBudWxsICYmIHR5cGVvZiB2bS5jdXJyZW50LmRldGFpbHMuY2F0ZWdvcnlSZXN1bHRzICE9PSBcInVuZGVmaW5lZFwiICYmIHZtLmN1cnJlbnQuZGV0YWlscy5jYXRlZ29yeVJlc3VsdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRSYWRhckNoYXJ0RGF0YUZvckN1cnJlbnRUZWFtQXNzZXNzbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJbmRpY2F0ZSB0byBVSSB0aGF0IHdlIGhhdmUgdGhlIGRhdGEgd2UgbmVlZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uaXNUZWFtQXNzZXNzbWVudERldGFpbExvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFkZHMgdGhlIGdyb3VwZWQgcXVlc3Rpb24gYW5kIHJhZGFyIGRhdGEgdG8gdGhlIGN1cnJlbnQgdGVhbSBhc3Nlc3NtZW50LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGJ1aWxkUmFkYXJDaGFydERhdGFGb3JDdXJyZW50VGVhbUFzc2Vzc21lbnQoKSB7XHJcbiAgICAgICAgICAgIC8vIFNldHVwIHRoZSBncm91cGVkIHF1ZXN0aW9uIHJlc3BvbnNlcyBieSBjYXRlZ29yeS5cclxuICAgICAgICAgICAgdm0uY3VycmVudC5xdWVzdGlvblJlc3BvbnNlc0J5Q2F0ZWdvcnkgPSBnZXRRdWVzdGlvblJldmlld0RhdGFGb3JDYXRlZ29yaWVzKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXR1cCB0aGUgZGF0YSBpbiB0aGUgc3RydWN0dXJlIHRoZWUgcmFkYXIgY2hhcnQgd2FudHMuXHJcbiAgICAgICAgICAgIC8vIEhhbmRsZSB0aGUgY2FzZSB3aGVyZSBhbGwgcXVlc3Rpb25zIHdpdGhpbiBhIGNhdGVnb3J5IHdlcmUgYW5zd2VyZWQgd2l0aCBOQS5cclxuICAgICAgICAgICAgdm0uY3VycmVudC5yYWRhckNoYXJ0RGF0YS5kYXRhLnB1c2goXHJcbiAgICAgICAgICAgICAgICB2bS5jdXJyZW50LmRldGFpbHMuY2F0ZWdvcnlSZXN1bHRzLm1hcChmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBheGlzOiBpc05hTihwYXJzZUZsb2F0KGNhdGVnb3J5LnNjb3JlKSkgPyBjYXRlZ29yeS5uYW1lICsgJyAoTkEpJyA6IGNhdGVnb3J5Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBpc05hTihwYXJzZUZsb2F0KGNhdGVnb3J5LnNjb3JlKSkgPyAwIDogY2F0ZWdvcnkuc2NvcmVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICkpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG91ciBzcGlrZSBsYWJlbHMgYW5kIHRoZWlyIGNsaWNrIGZ1bmN0aW9ucy5cclxuICAgICAgICAgICAgdm0uY3VycmVudC5yYWRhckNoYXJ0RGF0YS5sZWdlbmQgPVxyXG4gICAgICAgICAgICAgICAgdm0uY3VycmVudC5kZXRhaWxzLmNhdGVnb3J5UmVzdWx0cy5tYXAoZnVuY3Rpb24gKGNhdGVnb3J5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogY2F0ZWdvcnkubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2bS5jdXJyZW50Lm1vZGUgPT09IHZtLm1vZGVzLnJldmlldykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmN1cnJlbnQubW9kZSA9IHZtLm1vZGVzLnJldmlld0RldGFpbHM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpbHRlciBkb3duIHRvIGp1c3QgdGhpcyBjYXRlZ29yeS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5jdXJyZW50LnJhZGFyQ2hhcnREYXRhLnJldmlld1F1ZXN0aW9uRGF0YSA9IHZtLmN1cnJlbnQucXVlc3Rpb25SZXNwb25zZXNCeUNhdGVnb3J5LmZpbHRlcihmdW5jdGlvbiAoY2F0ZWdvcnlHcm91cCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2F0ZWdvcnlHcm91cC5jYXRlZ29yeU5hbWUgPT09IGNhdGVnb3J5Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBzY29wZSBtYW51YWxseSBzaW5jZSB3ZSdyZSBtYW5pcHVsYXRpbmcgaXQgZnJvbSB3aXRoaW4gdGhpcyBleHRlcm5hbCBjbGljayBmdW5jdGlvbi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRhcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQnVpbGRzIHRoZSBncm91cGVkIHF1ZXN0aW9uIHJlc3BvbnNlIGxpc3QgYnkgY2F0ZWdvcnkgbmFtZS5cclxuICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9IEVhY2ggb2JqZWN0IGluY2x1ZGVzXHJcbiAgICAgICAgICogY2F0ZWdvcnkgbmFtZSwgcXVlc3Rpb25zLCBhbmQgc2NvcmUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UXVlc3Rpb25SZXZpZXdEYXRhRm9yQ2F0ZWdvcmllcygpIHtcclxuICAgICAgICAgICAgbGV0IGdyb3VwZFF1ZXN0aW9uc0J5Q2F0ZWdvcnkgPSB2bS5jdXJyZW50LmRldGFpbHMucXVlc3Rpb25zXHJcbiAgICAgICAgICAgICAgICAuZ3JvdXAocSA9PiBxLmNhdGVnb3J5TmFtZSlcclxuXHJcbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0ZWdvcnlOYW1lOiBnLmtleSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25zOiBnLmRhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3JlOiB2bS5jdXJyZW50LmRldGFpbHMuY2F0ZWdvcnlSZXN1bHRzLmZpbmQoZnVuY3Rpb24gKGMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjLm5hbWUgPT09IGcua2V5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5zY29yZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZ3JvdXBkUXVlc3Rpb25zQnlDYXRlZ29yeTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgdGhlIGxpc3Qgb2YgdGVhbSBhc3Nlc3NtZW50IGF0dGVtcHRzLlxyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IHRlYW1Bc3Nlc3NtZW50cyBhbGwgdGVhbSBhc3Nlc3NtZW50cyB3aXRoIGl0cyBsaXN0IGFuZCBsYXRlc3QgaXRlbXMuXHJcbiAgICAgICAgICogQHBhcmFtIHtJbnR9IGFzc2Vzc21lbnRJZCBpZCBvZiB0aGUgYXNzZXNzbWVudCB0byBmaWx0ZXIgb25cclxuICAgICAgICAgKiBAcGFyYW0ge0ludH0gdGVhbUlkIGlkIG9mIHRoZSB0ZWFtIHRvIGZpbHRlciBvblxyXG4gICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHRlYW0gYXNzZXNzbWVudCBvYmplY3Qgd2l0aCBsaXN0IGFuZCBsYXRlc3QgYXR0ZW1wdHMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VGVhbUFzc2Vzc21lbnRBdHRlbXB0cyh0ZWFtQXNzZXNzbWVudHMsIGFzc2Vzc21lbnRJZCwgdGVhbUlkKSB7XHJcbiAgICAgICAgICAgIGxldCBhdHRlbXB0cyA9IHt9LFxyXG4gICAgICAgICAgICAgICAgdGVhbUFzc2Vzc21lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICB0ZWFtQXNzZXNzbWVudCA9IHRlYW1Bc3Nlc3NtZW50cy5maW5kKGZ1bmN0aW9uICh0ZWFtQXNzZXNzbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpc3RJdGVtID0gdGVhbUFzc2Vzc21lbnQubGF0ZXN0O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RJdGVtLmFzc2Vzc21lbnRJZCA9PT0gYXNzZXNzbWVudElkICYmIGxpc3RJdGVtLnRlYW1JZCA9PT0gdGVhbUlkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0ZWFtQXNzZXNzbWVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgYXR0ZW1wdHMgPSB0ZWFtQXNzZXNzbWVudDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGF0dGVtcHRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2F2ZXMgdGhlIGN1cnJlbnQgYXNzZXNzbWVudCBidXQgZG9lcyBub3Qgc3VibWl0IGl0LlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmVBc3Nlc3NtZW50KCkge1xyXG4gICAgICAgICAgICB2bS5sb2FkaW5nLmxvYWRlcnMucHJvY2Vzc2luZ0RhdGEgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGFzc2Vzc21lbnREYXRhU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLnNhdmVBc3Nlc3NtZW50KHJvdXRlQXNzZXNzbWVudElkLCByb3V0ZVRlYW1JZCwgdm0uY3VycmVudC5kZXRhaWxzKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuZGVidWcoXCJBc3Nlc3NtZW50IHNhdmVkISBSZWRpcmVjdGluZy4uLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uY3VycmVudC5yZXZpZXcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiBlcnJvciB0byB3aXphcmQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuZmluYWxseShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcubG9hZGVycy5wcm9jZXNzaW5nRGF0YSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU3VibWl0cyB0aGUgY3VycmVudCBhc3Nlc3NtZW50XHJcbiAgICAgICAgICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc3VibWl0QXNzZXNzbWVudCgpIHtcclxuICAgICAgICAgICAgdm0ubG9hZGluZy5sb2FkZXJzLnByb2Nlc3NpbmdEYXRhID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBhc3Nlc3NtZW50RGF0YVNlcnZpY2VcclxuICAgICAgICAgICAgICAgIC5zdWJtaXRBc3Nlc3NtZW50KHJvdXRlQXNzZXNzbWVudElkLCByb3V0ZVRlYW1JZCwgdm0uY3VycmVudC5kZXRhaWxzKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuZGVidWcoXCJBc3Nlc3NtZW50IHN1Ym1pdHRlZCFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nLmxvYWRlcnMucHJvY2Vzc2luZ0RhdGEgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFkZHMgdGhlIGFzc2Vzc21lbnQgdG8gdGhlIGN1cnJlbnQgdXNlcidzIHNoYXJlZCBhc3Nlc3NtZW50IGxpc3QuXHJcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IGFzc2Vzc21lbnRJZFxyXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0ZWFtSWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBhZGRTaGFyZWRBc3Nlc3NtZW50KGFzc2Vzc21lbnRJZCwgdGVhbUlkKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBsaW5rIHRvIGFzc2Vzc21lbnQuXHJcbiAgICAgICAgICAgIGFzc2Vzc21lbnREYXRhU2VydmljZS5hZGRTaGFyZWRUZWFtQXNzZXNzbWVudChhc3Nlc3NtZW50SWQsIHRlYW1JZClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgaXQncyBub3QgYWxyZWFkeSB0aGVyZSwgYWRkIHRoZSBhc3Nlc3NtZW50IHRvIHRoZSB0ZWFtIGFzc2Vzc21lbnQgbGlzdC5cclxuICAgICAgICAgICAgICAgICAgICAvLyBDb3VsZCBnbyB0byB0aGUgc2VydmVyIGFnYWluIHRvIGdldCB0aGUgZnVsbCBsaXN0LCBidXQgdHJ5aW5nIHRvIHNhdmUgYSB0cmlwLlxyXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZWFtQXNzZXNzbWVudE9iaiA9IHZtLmFzc2Vzc21lbnQudGVhbUFzc2Vzc21lbnRzLmZpbmQoZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQubGF0ZXN0LnRlYW1JZCA9PT0gdGVhbUlkO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4aXN0cyA9IHRlYW1Bc3Nlc3NtZW50T2JqLmxpc3QuZmluZEluZGV4KGZ1bmN0aW9uICh0KSB7IHJldHVybiB0LmlkID09PSBkYXRhLmlkOyB9KSA+PSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5nZXRUZWFtQXNzZXNzbWVudExpc3RGb3JBc3Nlc3NtZW50KHZtLmFzc2Vzc21lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNob3cgb3VyIHNoYXJlZCBtZXNzYWdlIGZvciBhIG1vbWVudCBpZiB0aGlzIGlzIGEgbmV3IGFkZGl0aW9uIHRvIG91ciBsaXN0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0uaW5mbyA9ICdUaGUgYXNzZXNzbWVudCBmb3IgJyArIGRhdGEudGVhbU5hbWUgKyAnIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBhZGRlZCB0byB5b3VyIHNoYXJlZCBhc3Nlc3NtZW50IGxpc3QuJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5pbmZvID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUgKiAxMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBSZXZpZXcgdGhhdCBhc3Nlc3NtZW50LlxyXG4gICAgICAgICAgICAgICAgICAgIHZtLmN1cnJlbnQubW9kZSA9IHZtLm1vZGVzLnJldmlldztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTG9hZCB0aGUgcmV2aWV3IGRhdGEgZm9yIHRoZSBzaGFyZWQgYXNzZXNzbWVudC5cclxuICAgICAgICAgICAgICAgICAgICB2bS5yZXZpZXdUZWFtQXNzZXNzbWVudChkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgZmFpbGVkLCBzaG93IGFuIGVycm9yIG1lc3NhZ2UgaW5zdGVhZCBvZiBhbmQgcmV2aWV3IGRldGFpbHMuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yICE9PSBudWxsICYmIHR5cGVvZiBlcnJvciAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIHRyeWluZyB0byBhZGQgdGhlIHNoYXJlZCBhc3Nlc3NtZW50OiAnICsgZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIHRyeWluZyB0byBhZGQgdGhlIHNoYXJlZCBhc3Nlc3NtZW50LiBQbGVhc2UgdHJ5IGFnYWluLic7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkaW5nLmRvbmVMb2FkaW5nKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgdGhlIGxpbmsgdXNlZCB0byBzaGFyZSB0aGUgY3VycmVudGx5IHJldmlld2VkIGFzc2Vzc21lbnQuXHJcbiAgICAgICAgICogQHJldHVybnMge1N0cmluZ30gZnVsbCB1cmwgZm9yIGEgdXNlciB0byBjbGljayB0byBhZGQgdGhlIGFzc2Vzc21lbnQgdG8gdGhlaXIgc2hhcmVkIGFzc2Vzc21lbnQgbGlzdC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRTaGFyZUFzc2Vzc21lbnRMaW5rKCkge1xyXG4gICAgICAgICAgICBpZiAoIWFuZ3VsYXIuZXF1YWxzKHZtLmN1cnJlbnQuZGV0YWlscywge30pKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXNzZXNzbWVudElkID0gdm0uY3VycmVudC5kZXRhaWxzLmFzc2Vzc21lbnRJZCxcclxuICAgICAgICAgICAgICAgICAgICB0ZWFtSWQgPSB2bS5jdXJyZW50LmRldGFpbHMudGVhbUlkO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFzc2Vzc21lbnREYXRhU2VydmljZS5nZXRUZWFtQXNzZXNzbWVudFNoYXJlTGluayhhc3Nlc3NtZW50SWQsIHRlYW1JZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFzc2Vzc21lbnQnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdhc3Nlc3NtZW50RGF0YVNlcnZpY2UnLCBEYXRhU2VydmljZSk7XHJcblxyXG4gICAgRGF0YVNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJGxvZycsICckcScsICdjb25maWdzJywgJyR3aW5kb3cnLCAnJGxvY2F0aW9uJ107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXJ2aWNlIHVzZWQgdG8gZ2V0IGRhdGEgZnJvbSB0aGUgc2VydmVyIGZvciBBc3Nlc3NtZW50cy5cclxuICAgICAqIEBwYXJhbSB7JGh0dHB9ICRodHRwXHJcbiAgICAgKiBAcGFyYW0geyRsb2d9ICRsb2dcclxuICAgICAqIEBwYXJhbSB7JHF9ICRxXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY29uZmlnc1xyXG4gICAgICogQHBhcmFtIHskd2luZG93fSAkd2luZG93XHJcbiAgICAgKiBAcGFyYW0geyRsb2NhdG9pbn0gJGxvY2F0aW9uXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBhdmFpbGFibGUgbWV0aG9kc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBEYXRhU2VydmljZSgkaHR0cCwgJGxvZywgJHEsIGNvbmZpZ3MsICR3aW5kb3csICRsb2NhdGlvbikge1xyXG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICAgICAgICBnZXRBc3Nlc3NtZW50czogZ2V0QXNzZXNzbWVudHMsXHJcbiAgICAgICAgICAgIHN0YXJ0QXNzZXNzbWVudDogc3RhcnRBc3Nlc3NtZW50LFxyXG4gICAgICAgICAgICBzYXZlQXNzZXNzbWVudDogc2F2ZUFzc2Vzc21lbnQsXHJcbiAgICAgICAgICAgIHN1Ym1pdEFzc2Vzc21lbnQ6IHN1Ym1pdEFzc2Vzc21lbnQsXHJcbiAgICAgICAgICAgIGdldFRlYW1Bc3Nlc3NtZW50RGV0YWlsc0J5SWQ6IGdldFRlYW1Bc3Nlc3NtZW50RGV0YWlsc0J5SWQsXHJcbiAgICAgICAgICAgIGdldFRlYW1Bc3Nlc3NtZW50czogZ2V0VGVhbUFzc2Vzc21lbnRzLFxyXG4gICAgICAgICAgICBnZXRUZWFtQXNzZXNzbWVudHNGb3JBc3Nlc3NtZW50czogZ2V0VGVhbUFzc2Vzc21lbnRzRm9yQXNzZXNzbWVudHMsXHJcbiAgICAgICAgICAgIGdldFRlYW1Bc3Nlc3NtZW50U2hhcmVMaW5rOiBnZXRUZWFtQXNzZXNzbWVudFNoYXJlTGluayxcclxuICAgICAgICAgICAgYWRkU2hhcmVkVGVhbUFzc2Vzc21lbnQ6IGFkZFNoYXJlZFRlYW1Bc3Nlc3NtZW50LFxyXG4gICAgICAgICAgICBnZXRNb3N0UmVjZW50QXR0ZW1wdEZvclRlYW06IGdldE1vc3RSZWNlbnRBdHRlbXB0Rm9yVGVhbSxcclxuICAgICAgICAgICAgZ2V0VGVhbUFzc2Vzc21lbnRCeUlkRnJvbUdyb3VwZWRMaXN0OiBnZXRUZWFtQXNzZXNzbWVudEJ5SWRGcm9tR3JvdXBlZExpc3RcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0cyBhIGxpc3Qgb2YgYXNzZXNzbWVudHMgdG8gdGFrZS5cclxuICAgICAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gTGlzdCBvZiBhc3Nlc3NtZW50cyBvbiBzdWNjZXNzLiBEb2VzIG5vdCByZWplY3Qgb24gZmFpbHVyZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRBc3Nlc3NtZW50cygpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBjb25maWdzLmFwaVVybCArICdhc3Nlc3NtZW50cydcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cChyZXF1ZXN0KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZ2V0QXNzZXNzbWVudHNDb21wbGV0ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChnZXRBc3Nlc3NtZW50c0ZhaWxlZCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU3VjZXNzIENhbGxiYWNrXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZVxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRBc3Nlc3NtZW50c0NvbXBsZXRlKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEZhaWx1cmUgY2FsbGJhY2tcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVycm9yXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRBc3Nlc3NtZW50c0ZhaWxlZChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBlcnJvci5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGVycm9yLmRhdGEuTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ1hIUiBmYWlsZWQgZm9yIGdldEFzc2Vzc21lbnRzLiAnICsgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgYWxsIHRlYW0gYXNzZXNzbWVudHMgZm9yIHRoZSBwcm92aWRlZCBhc3Nlc3NtZW50IHRoYXQgdGhlIGN1cnJlbnQgdXNlciBoYXMgcGVybWlzc2lvbiB0byB2aWV3LlxyXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhc3Nlc3NtZW50SWRcclxuICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9IGFycmF5IG9mIFRlYW0gQXNzZXNzbWVudHNcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRUZWFtQXNzZXNzbWVudHMoYXNzZXNzbWVudElkKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogY29uZmlncy5hcGlVcmwgKyAnYXNzZXNzbWVudHMvJyArIGFzc2Vzc21lbnRJZCArICcvdGVhbUFzc2Vzc21lbnRzJ1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAudGhlbihnZXRUZWFtQXNzZXNzbWVudHNDb21wbGV0ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChnZXRUZWFtQXNzZXNzbWVudHNGYWlsZWQpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFN1Y2VzcyBDYWxsYmFja1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2VcclxuICAgICAgICAgICAgICogQHJldHVybnMge0FycmF5fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0VGVhbUFzc2Vzc21lbnRzQ29tcGxldGUocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRmFpbHVyZSBDYWxsYmFja1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXJyb3JcclxuICAgICAgICAgICAgICogQHJldHVybnMge0FycmF5fSBlbXB0eSBhcnJheVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0VGVhbUFzc2Vzc21lbnRzRmFpbGVkKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIGVycm9yLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IuZGF0YS5NZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignWEhSIGZhaWxlZCBmb3IgZ2V0VGVhbUFzc2Vzc21lbnRzLiAnICsgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogR2V0cyB0aGUgZGV0YWlscyBmb3IgYSBzaW5nbGUgdGVhbSBhc3Nlc3NtZW50LlxyXG4gICAgICAgICogSW5jbHVkZXMgZnVsbCBkZXRhaWxzLCBpbmNsdWRpbmcgcXVlc3Rpb25zLCBhbnN3ZXJzLCBncmFkZXMsIGNhdGVnb3JpZXMsIGV0Yy5cclxuICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhc3Nlc3NtZW50SWRcclxuICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0ZWFtQXNzZXNzbWVudElkXHJcbiAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUZWFtIGFzc2Vzc21lbnQgb2JqZWN0XHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRUZWFtQXNzZXNzbWVudERldGFpbHNCeUlkKGFzc2Vzc21lbnRJZCwgdGVhbUFzc2Vzc21lbnRJZCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGNvbmZpZ3MuYXBpVXJsICsgJ2Fzc2Vzc21lbnRzLycgKyBhc3Nlc3NtZW50SWQgKyAnL3RlYW1hc3Nlc3NtZW50cy8nICsgdGVhbUFzc2Vzc21lbnRJZFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAudGhlbihnZXRUZWFtQXNzZXNzbWVudERldGFpbHNCeUlkQ29tcGxldGUpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZ2V0VGVhbUFzc2Vzc21lbnREZXRhaWxzQnlJZEZhaWxlZCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU3VjZXNzIENhbGxiYWNrXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZVxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0VGVhbUFzc2Vzc21lbnREZXRhaWxzQnlJZENvbXBsZXRlKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEZhaWx1cmUgQ2FsbGJhY2tcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVycm9yXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRUZWFtQXNzZXNzbWVudERldGFpbHNCeUlkRmFpbGVkKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIGVycm9yLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IuZGF0YS5NZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignWEhSIGZhaWxlZCBmb3IgZ2V0VGVhbUFzc2Vzc21lbnREZXRhaWxzQnlJZC4gJyArIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXRzIGFsbCB0ZWFtIGFzc2Vzc21lbnQgZm9yIGVhY2ggYXNzZXNzbWVudCBwcm92aWRlZC4gR2V0cyBhbGwgdGVhbSBhc3Nlc3NtZW50cyBhc3luY2hyb25vdXNseS5cclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBhc3Nlc3NtZW50c1xyXG4gICAgICAgICAqIEByZXR1cm5zIHtBcnJheX0gYXNzZXNzbWVudCBsaXN0IHdpdGggY2hpbGQgdGVhbSBhc3Nlc3NtZW50cy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRUZWFtQXNzZXNzbWVudHNGb3JBc3Nlc3NtZW50cyhhc3Nlc3NtZW50cykge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpLFxyXG4gICAgICAgICAgICAgICAgZGV0YWlsc1Byb21pc2VzID0gW107XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgYWxsIHRlYW0gYXNzZXNzbWVudHMgZm9yIGVhY2ggYXNzZXNzbWVudC5cclxuICAgICAgICAgICAgZGV0YWlsc1Byb21pc2VzID0gYXNzZXNzbWVudHMubWFwKGZ1bmN0aW9uIChhc3Nlc3NtZW50LCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgLy8gYWRkIGEgbmV3IHByb21pc2UgdG8gb3VyIGxpc3QuXHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzIHByb21pc2UgaW5jbHVkZXMgYWRkaW5nIHRoZSB0ZWFtIGFzc2Vzc21lbnRzIHRvIG91ciBhcnJheS5cclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRUZWFtQXNzZXNzbWVudHMoYXNzZXNzbWVudC5pZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzc2Vzc21lbnRzW2luZGV4XS50ZWFtQXNzZXNzbWVudHMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlc29sdmUoYXNzZXNzbWVudHNbaW5kZXhdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gc2VuZCBhbGwgb2Ygb3VyIHByb21pc2VzIGF0IHRoZSBzYW1lIHRpbWUgdG8gZ2V0IGFsbCBvZiBvdXIgZGV0YWlscyBmb3IgYWxsIGFzc2Vzc21lbnRzLlxyXG4gICAgICAgICAgICAkcS5hbGwoZGV0YWlsc1Byb21pc2VzKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB3aWxsIHJldHVybiB0aGUgbGlzdCBvZiBhc3Nlc3NtZW50cy5cclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlIHNvIHRoYXQgd2UgY2FuIGNoYWluIHRoZXNlIHRvZ2V0aGVyIGFzIG5lZWRlZC5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFN0YXJ0cyBhIG5ldyB0ZWFtIGFzc2Vzc21lbnQuXHJcbiAgICAgICAgKiBAcGFyYW0ge051bW5iZXJ9IGFzc2Vzc21lbnRJZFxyXG4gICAgICAgICogQHBhcmFtIHtOdW1uYmVyfSB0ZWFtSWRcclxuICAgICAgICAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXR1cm5zIGEgRFRPIG9yIHJlamVjdHMgd2l0aCB2YWxpZGF0aW9uIGVycm9ycy5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHN0YXJ0QXNzZXNzbWVudChhc3Nlc3NtZW50SWQsIHRlYW1JZCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBjb25maWdzLmFwaVVybCArICd0ZWFtcy8nICsgdGVhbUlkICsgJy9hc3Nlc3NtZW50cy8nICsgYXNzZXNzbWVudElkICsgJy9zdGFydCdcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cChyZXF1ZXN0KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHN0YXJ0VGVhbUFzc2Vzc21lbnRDb21wbGV0ZSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goc3RhcnRUZWFtQXNzZXNzbWVudEZhaWxlZCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU3VjZXNzIENhbGxiYWNrXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZVxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gc3RhcnRUZWFtQXNzZXNzbWVudENvbXBsZXRlKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEZhaWx1cmUgQ2FsbGJhY2tcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVycm9yXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9ICByZWplY3RzIHByb21pc2Ugd2l0aCBhbiBlcnJvciBtZXNzYWdlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBzdGFydFRlYW1Bc3Nlc3NtZW50RmFpbGVkKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIGVycm9yLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3IuZGF0YSAhPT0gbnVsbCAmJiBcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgZXJyb3IuZGF0YS5NZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBlcnJvci5kYXRhLk1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdYSFIgZmFpbGVkIGZvciBzdGFydFRlYW1Bc3Nlc3NtZW50LiAnICsgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFNhdmVzIGFuIGFzc2Vzc21lbnQncyBwcm9ncmVzcy5cclxuICAgICAgICAqIEBwYXJhbSB7TnVtbmJlcn0gYXNzZXNzbWVudElkXHJcbiAgICAgICAgKiBAcGFyYW0ge051bW5iZXJ9IHRlYW1JZFxyXG4gICAgICAgICogQHBhcmFtIHtPYmplY3R9IHRlYW1Bc3Nlc3NtZW50IFRlYW1Bc3Nlc3NtZW50RFRPXHJcbiAgICAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gUmV0dXJucyB1cGRhdGVkIERUTyBvciByZWplY3RzIHdpdGggdmFsaWRhdGlvbiBlcnJvcnMuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBzYXZlQXNzZXNzbWVudChhc3Nlc3NtZW50SWQsIHRlYW1JZCwgdGVhbUFzc2Vzc21lbnQpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogY29uZmlncy5hcGlVcmwgKyAndGVhbXMvJyArIHRlYW1JZCArICcvYXNzZXNzbWVudHMvJyArIGFzc2Vzc21lbnRJZCArICcvc2F2ZScsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB0ZWFtQXNzZXNzbWVudFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oc2F2ZVRlYW1Bc3Nlc3NtZW50Q29tcGxldGUpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKHNhdmVUZWFtQXNzZXNzbWVudEZhaWxlZCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU3VjZXNzIENhbGxiYWNrXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZVxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2F2ZVRlYW1Bc3Nlc3NtZW50Q29tcGxldGUocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRmFpbHVyZSBDYWxsYmFja1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXJyb3JcclxuICAgICAgICAgICAgICogQHJldHVybnMge1N0cmluZ30gIHJlamVjdHMgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG1lc3NhZ2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNhdmVUZWFtQXNzZXNzbWVudEZhaWxlZChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBlcnJvci5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yLmRhdGEgIT09IG51bGwgJiYgXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIGVycm9yLmRhdGEuTWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IuZGF0YS5NZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGVycm9yLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignWEhSIGZhaWxlZCBmb3Igc2F2ZVRlYW1Bc3Nlc3NtZW50LiAnICsgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTYXZlcywgdmFsaWRhdGVzIGFuZCBzdWJtaXRzIGFuIGFzc2Vzc21lbnQuXHJcbiAgICAgICAgICogQHBhcmFtIHtOdW1uYmVyfSBhc3Nlc3NtZW50SWRcclxuICAgICAgICAgKiBAcGFyYW0ge051bW5iZXJ9IHRlYW1JZFxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0ZWFtQXNzZXNzbWVudCBUZWFtQXNzZXNzbWVudERUT1xyXG4gICAgICAgICAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXR1cm5zIHVwZGF0ZWQgRFRPIG9yIHJlamVjdHMgd2l0aCB2YWxpZGF0aW9uIGVycm9ycy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBzdWJtaXRBc3Nlc3NtZW50KGFzc2Vzc21lbnRJZCwgdGVhbUlkLCB0ZWFtQXNzZXNzbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBjb25maWdzLmFwaVVybCArICd0ZWFtcy8nICsgdGVhbUlkICsgJy9hc3Nlc3NtZW50cy8nICsgYXNzZXNzbWVudElkICsgJy9zdWJtaXQnLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdGVhbUFzc2Vzc21lbnRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cChyZXF1ZXN0KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHN1Ym1pdFRlYW1Bc3Nlc3NtZW50Q29tcGxldGUpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKHN1Ym1pdFRlYW1Bc3Nlc3NtZW50RmFpbGVkKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTdWNlc3MgQ2FsbGJhY2tcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBzdWJtaXRUZWFtQXNzZXNzbWVudENvbXBsZXRlKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEZhaWx1cmUgQ2FsbGJhY2tcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVycm9yXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9ICByZWplY3RzIHByb21pc2Ugd2l0aCBhbiBlcnJvciBtZXNzYWdlXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBzdWJtaXRUZWFtQXNzZXNzbWVudEZhaWxlZChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBlcnJvci5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yLmRhdGEgIT09IG51bGwgJiYgXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIGVycm9yLmRhdGEuTWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IuZGF0YS5NZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGVycm9yLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignWEhSIGZhaWxlZCBmb3Igc3VibWl0VGVhbUFzc2Vzc21lbnQuICcgKyBtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJ1aWxkcyB0aGUgbGluayB1c2VkIHRvIHNoYXJlIGEgdGVhbSBhc3Nlc3NtZW50IHdpdGggYW5vdGhlciB1c2VyLlxyXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhc3Nlc3NtZW50SWRcclxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gdGVhbUlkXHJcbiAgICAgICAgICogQHJldHVybnMge1N0cmluZ30gdXJsIHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFRlYW1Bc3Nlc3NtZW50U2hhcmVMaW5rKGFzc2Vzc21lbnRJZCwgdGVhbUlkKSB7XHJcbiAgICAgICAgICAgIHZhciBiYXNlVXJsID0gbmV3ICR3aW5kb3cuVVJMKCRsb2NhdGlvbi5hYnNVcmwoKSkub3JpZ2luO1xyXG4gICAgICAgICAgICByZXR1cm4gYmFzZVVybCArICcvIy9hc3Nlc3NtZW50cy8nICsgYXNzZXNzbWVudElkICsgJy90ZWFtLycgKyB0ZWFtSWQgKyAnL3NoYXJlJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENyZWF0ZXMgYSBsaW5rIGJldHdlZW4gYSB0ZWFtIGFzc2Vzc21lbnQgYW5kIHRoZSBjdXJyZW50IHVzZXIgc28gdGhlIHVzZXIgY2FuIHZpZXcgdGhlIGFzc2Vzc21lbnQgcmVzdWx0cy5cclxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gYXNzZXNzbWVudElkXHJcbiAgICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IHRlYW1JZFxyXG4gICAgICAgICAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXR1cm5zIHRlYW0gYXNzZXNzbWVudCBvbiBzdWNjZXNzLCBidXQgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQgd2l0aCBhbiBlcnJvciBvbiBmYWlsdXJlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFkZFNoYXJlZFRlYW1Bc3Nlc3NtZW50KGFzc2Vzc21lbnRJZCwgdGVhbUlkKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGNvbmZpZ3MuYXBpVXJsICsgJ3RlYW1zLycgKyB0ZWFtSWQgKyAnL2Fzc2Vzc21lbnRzLycgKyBhc3Nlc3NtZW50SWQgKyAnL3NoYXJlJ1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oYWRkU2hhcmVkVGVhbUFzc2Vzc21lbnRDb21wbGV0ZSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goYWRkU2hhcmVkVGVhbUFzc2Vzc21lbnRGYWlsZWQpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFN1Y2VzcyBDYWxsYmFja1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2VcclxuICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdH1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFkZFNoYXJlZFRlYW1Bc3Nlc3NtZW50Q29tcGxldGUocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRmFpbHVyZSBDYWxsYmFja1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXJyb3JcclxuICAgICAgICAgICAgICogQHJldHVybnMge1N0cmluZ30gcmVqZWN0cyBwcm9taXNlIHdpdGggYW4gZXJyb3IgbWVzc2FnZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gYWRkU2hhcmVkVGVhbUFzc2Vzc21lbnRGYWlsZWQoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGlmIChcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgZXJyb3IuZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvci5kYXRhICE9PSBudWxsICYmIFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBlcnJvci5kYXRhLk1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGVycm9yLmRhdGEuTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBlcnJvci5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ1hIUiBmYWlsZWQgZm9yIGFkZFNoYXJlZFRlYW1Bc3Nlc3NtZW50LiAnICsgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGVzIHRoZSB0ZWFtIGFzc2Vzc21lbnQgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIG1vc3QgcmVjZW50IHRlYW0gYXNzZXNzbWVudFxyXG4gICAgICAgICAqIEFORCB0aGUgbGlzdCBvZiBhbGwgdGVhbSBhc3Nlc3NtZW50cyBmb3IgYSBwYXJ0aWN1bGFyIHRlYW0uXHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gZ3JvdXBlZFRlYW1Bc3Nlc3NtZW50cyAtIGZsYXQgbGlzdCBvZiB0ZWFtIGFzc2Vzc21lbnRzIGZvciBhIGdpdmVuIHRlYW1cclxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBpbiB0aGUgZm9ybSBvZiB7IGxhdGVzdDoge30sIGxpc3Q6IFtdIH1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRNb3N0UmVjZW50QXR0ZW1wdEZvclRlYW0oZ3JvdXBlZFRlYW1Bc3Nlc3NtZW50cykge1xyXG4gICAgICAgICAgICBsZXQgbW9zdFJlY2VudFRlYW1Bc3Nlc3NtZW50ID0gbnVsbCxcclxuICAgICAgICAgICAgICAgIHRlYW1Bc3Nlc3NtZW50T2JqID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChncm91cGVkVGVhbUFzc2Vzc21lbnRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgbGF0ZXN0IGNvbXBsZXRlZCBPUiBzdGFydGVkIHRlYW0gYXNzZXNzbWVudC5cclxuICAgICAgICAgICAgICAgIG1vc3RSZWNlbnRUZWFtQXNzZXNzbWVudCA9IGdyb3VwZWRUZWFtQXNzZXNzbWVudHMucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjdXJyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZEYXRlLCBjdXJyZW50RGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2RGF0ZSA9IHByZXYuY29tcGxldGVkICE9PSBudWxsID8gcHJldi5jb21wbGV0ZWQgOiBwcmV2LnN0YXJ0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudERhdGUgPSBjdXJyZW50LmNvbXBsZXRlZCAhPT0gbnVsbCA/IGN1cnJlbnQuY29tcGxldGVkIDogY3VycmVudC5zdGFydGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2RGF0ZSA+IGN1cnJlbnREYXRlID8gcHJldiA6IGN1cnJlbnQ7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgdG8gdGhlIGxpc3Qgb2YgdGVhbSBhc3Nlc3NtZW50cy5cclxuICAgICAgICAgICAgICAgIHRlYW1Bc3Nlc3NtZW50T2JqID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdGVzdDogbW9zdFJlY2VudFRlYW1Bc3Nlc3NtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3Q6IGdyb3VwZWRUZWFtQXNzZXNzbWVudHNcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSdzIG9ubHkgb25lIGF0dGVtcHQsIG1ha2UgdGhhdCB0aGUgbW9zdCByZWNlbnQuXHJcbiAgICAgICAgICAgICAgICB0ZWFtQXNzZXNzbWVudE9iaiA9IHtcclxuICAgICAgICAgICAgICAgICAgICBsYXRlc3Q6IGdyb3VwZWRUZWFtQXNzZXNzbWVudHNbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdDogZ3JvdXBlZFRlYW1Bc3Nlc3NtZW50c1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGVhbUFzc2Vzc21lbnRPYmo7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXRzIHRoZSB0ZWFtIGFzc2Vzc21lbnQgbWF0Y2hpbmcgdGhlIHByb3ZpZGVkIGlkIG9uIHRoZSBjdXJyZW50IGFzc2Vzc21lbnQuXHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gdGVhbUFzc2Vzc21lbnRHcm91cGVkTGlzdCAtIHN0cnVjdHVyZSBbIHsgbGlzdDogW10sIGxhdGVzdDoge30gXVxyXG4gICAgICAgICAqIEBwYXJhbSB7SW50fSB0ZWFtQXNzZXNzbWVudElkXHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH0gdGhlIHRlYW0gYXNzZXNzbWVudCBkZXRhaWxzLiBSZXR1cm5zIHVuZGVmaW5lZCBpZiBub3QgZm91bmQuIFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFRlYW1Bc3Nlc3NtZW50QnlJZEZyb21Hcm91cGVkTGlzdCh0ZWFtQXNzZXNzbWVudEdyb3VwZWRMaXN0LCB0ZWFtQXNzZXNzbWVudElkKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZWFtQXNzZXNzbWVudDtcclxuICAgICAgICAgICAgaWYgKHRlYW1Bc3Nlc3NtZW50R3JvdXBlZExpc3QubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGVhbUFzc2Vzc21lbnQgPSB0ZWFtQXNzZXNzbWVudEdyb3VwZWRMaXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQubGlzdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVkdWNlKGZ1bmN0aW9uIChmbGF0LCB0b0ZsYXR0ZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmxhdC5jb25jYXQodG9GbGF0dGVuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIFtdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdC5pZCA9PT0gdGVhbUFzc2Vzc21lbnRJZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0ZWFtQXNzZXNzbWVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0hvbWVDb250cm9sbGVyJywgSG9tZUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIEhvbWVDb250cm9sbGVyLiRpbmplY3QgPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnRyb2xsZXIgcmVzcG9uc2libGUgZm9yIGFsbCBob21lIHBhZ2UgaW50ZXJhY3Rpb25zLlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBIb21lQ29udHJvbGxlcigpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBTdXBwb3J0aW5nIGxpbmtzLlxyXG4gICAgICAgIHZtLmxpbmtzID0gW107XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbml0aWFsaXplcyBjb250cm9sbGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICB2bS5saW5rcyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucGxheWJvb2snKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdQbGF5Ym9va0NvbnRyb2xsZXInLCBQbGF5Ym9va0NvbnRyb2xsZXIpO1xyXG5cclxuICAgIFBsYXlib29rQ29udHJvbGxlci4kaW5qZWN0ID0gWydwbGF5Ym9va0RhdGFTZXJ2aWNlJywgJ2Fzc2Vzc21lbnREYXRhU2VydmljZScsICckbG9nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJyRyb3V0ZVBhcmFtcycsICdhY3Rpb24nLCAnJGxvY2F0aW9uJywgJyR0aW1lb3V0JywgJyRxJywgJyRyb290U2NvcGUnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAndXNlclNlcnZpY2UnLCAnYXV0aFNlcnZpY2UnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnRyb2xsZXIgcmVzcG9uc2libGUgZm9yIGFsbCBhY3Rpb25zIHJlbGF0ZWQgdG8gdGFraW5nIGFuZCByZXZpZXdpbmcgYW4gYXNzZXNzbWVudC5cclxuICAgICAqIEBwYXJhbSB7cGxheWJvb2tEYXRhU2VydmljZX0gcGxheWJvb2tEYXRhU2VydmljZVxyXG4gICAgICogQHBhcmFtIHthc3Nlc3NtZW50RGF0YVNlcnZpY2V9IGFzc2Vzc21lbnREYXRhU2VydmljZVxyXG4gICAgICogQHBhcmFtIHskbG9nfSAkbG9nXHJcbiAgICAgKiBAcGFyYW0geyRyb3V0ZVBhcmFtc30gJHJvdXRlUGFyYW1zXHJcbiAgICAgKiBAcGFyYW0geyRhY3Rpb259IGFjdGlvblxyXG4gICAgICogQHBhcmFtIHskbG9jYXRpb259ICRsb2NhdGlvblxyXG4gICAgICogQHBhcmFtIHskdGltZW91dH0gJHRpbWVvdXRcclxuICAgICAqIEBwYXJhbSB7JHF9ICRxXHJcbiAgICAgKiBAcGFyYW0geyRyb290U2NvcGV9ICRyb290U2NvcGVcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB1c2VyU2VydmljZVxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGF1dGhTZXJ2aWNlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFBsYXlib29rQ29udHJvbGxlcihwbGF5Ym9va0RhdGFTZXJ2aWNlLCBhc3Nlc3NtZW50RGF0YVNlcnZpY2UsICRsb2csICRyb3V0ZVBhcmFtcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbiwgJGxvY2F0aW9uLCAkdGltZW91dCwgJHEsICRyb290U2NvcGUsIHVzZXJTZXJ2aWNlLCBhdXRoU2VydmljZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIEF2YWlsYWJsZSB2aWV3aW5nIG1vZGVzLlxyXG4gICAgICAgIHZtLm1vZGVzID0ge1xyXG4gICAgICAgICAgICByZXZpZXc6IDAsXHJcbiAgICAgICAgICAgIGVkaXQ6IDEsXHJcbiAgICAgICAgICAgIGRvd25sb2FkOiAyXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQWxsIHBsYXlib29rcy5cclxuICAgICAgICB2bS5wbGF5Ym9va3MgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gQ3VycmVudCBwbGF5Ym9vayB3aXRoIGRldGFpbHMuXHJcbiAgICAgICAgdm0uY3VycmVudCA9IHtcclxuICAgICAgICAgICAgZGV0YWlsczoge30sXHJcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25zOiBbXSxcclxuICAgICAgICAgICAgdmVyc2lvbnM6IFtdLFxyXG4gICAgICAgICAgICBtb2RlOiB2bS5tb2Rlcy5lZGl0XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQXZhaWxhYmxlIHRlYW0gYXNzZXNzbWVudHMgdG8gY3JlYXRlIGEgcGxheWJvb2sgZm9yLlxyXG4gICAgICAgIC8vdm0udGVhbUFzc2Vzc21lbnRzID0gW107XHJcbiAgICAgICAgLy8gQXNzZXNzbWVudCBhbGwgb2YgdGhlIHBsYXlib29rcyBhcmUgcmVsYXRlZCB0by5cclxuICAgICAgICB2bS5hc3Nlc3NtZW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gTmV3IHBsYXlib29rIGZvcm0uXHJcbiAgICAgICAgdm0ubmV3UGxheWJvb2tGb3JtID0ge1xyXG4gICAgICAgICAgICAvLyBGb3JtIG9iamVjdCB3aXRoIHZhbGlkYXRpb24uXHJcbiAgICAgICAgICAgIGZvcm06IHt9LFxyXG5cclxuICAgICAgICAgICAgLy8gTGlzdCBvZiB1bmlxdWUgdGVhbXMgdG8gc2VsZWN0IGZyb20uXHJcbiAgICAgICAgICAgIHRlYW1zOiBbXSxcclxuXHJcbiAgICAgICAgICAgIC8vIFVwb24gdGVhbSBzZWxlY3Rpb24sIGRldGVybWluZSBpZiB3ZSBzaG91bGQgc2hvdyB0aGUgdmVyc2lvbnMgZHJvcGRvd24gb3Igc2VsZWN0IHRoZSBkZWZhdWx0IHRlYW0gYXNzZXNzbWVudC5cclxuICAgICAgICAgICAgLy8gU2hvdyB0aGUgdmVyc2lvbiBkcm9wZG93biBpZiB0aGUgbW9zdCByZWNlbnQgYXR0ZW1wdCBpcyBpbiBwcm9ncmVzcy5cclxuICAgICAgICAgICAgc2VsZWN0VGVhbTogZnVuY3Rpb24gKHRlYW0pIHtcclxuICAgICAgICAgICAgICAgIHZtLm5ld1BsYXlib29rRm9ybS5zaG93VmVyc2lvblNlbGVjdG9yID0gdGVhbS5zZWxlY3RlZFRlYW1Bc3Nlc3NtZW50QXR0ZW1wdC5jb21wbGV0ZWQgPT09IG51bGwgJiZcclxuICAgICAgICAgICAgICAgICAgICB0ZWFtLmFsbFRlYW1Bc3Nlc3NtZW50QXR0ZW1wdHMubGVuZ3RoID4gMTtcclxuXHJcbiAgICAgICAgICAgICAgICB2bS5jdXJyZW50LmRldGFpbHMudGVhbUFzc2Vzc21lbnQgPSB0ZWFtLnNlbGVjdGVkVGVhbUFzc2Vzc21lbnRBdHRlbXB0O1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLy8gVXBvbiB0ZWFtIGFzc2Vzc21lbnQgc2VsZWN0aW9uLCB2YWxpZGF0ZSB0aGF0IHRoZSB2ZXJzaW9uIHNlbGVjdGVkIGlzIHRoZSBtb3N0IHJlY2VudCBjb21wbGV0ZWQgYXR0ZW1wdFxyXG4gICAgICAgICAgICAvLyBhbmQgc2V0IHRoZSB0ZWFtIGFzc2Vzc21lbnQuXHJcbiAgICAgICAgICAgIHNlbGVjdFRlYW1Bc3Nlc3NtZW50OiBmdW5jdGlvbiAodGEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBoYXNBTW9yZVJlY2VudEF0dGVtcHQgPSB2bS5uZXdQbGF5Ym9va0Zvcm0uc2VsZWN0ZWQuYWxsVGVhbUFzc2Vzc21lbnRBdHRlbXB0cy5maWx0ZXIoZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geC5jb21wbGV0ZWQgIT09IG51bGxcclxuICAgICAgICAgICAgICAgIH0pLmZpbmQoZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geC5jb21wbGV0ZWQgPiB0YS5jb21wbGV0ZWQ7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGhhc0FNb3JlUmVjZW50QXR0ZW1wdCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLm5ld1BsYXlib29rRm9ybS5mb3JtLnRlYW1Bc3Nlc3NtZW50LiRzZXRWYWxpZGl0eSgnbGF0ZXN0QXR0ZW1wdCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vIEluZGljYXRvciBpZiB3ZSBzaG91bGQgc2hvdyB0aGUgdmVyc2lvbiBkcm9wZG93bi5cclxuICAgICAgICAgICAgc2hvd1ZlcnNpb25TZWxlY3RvcjogZmFsc2UsXHJcblxyXG4gICAgICAgICAgICAvLyBTZWxlY3RlZCB0ZWFtIGl0ZW0uXHJcbiAgICAgICAgICAgIHNlbGVjdGVkOiBudWxsLFxyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2tzIGlmIGEgdGVhbSBpcyBzZWxlY3RlZC5cclxuICAgICAgICAgICAgaGFzU2VsZWN0ZWRUZWFtOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5uZXdQbGF5Ym9va0Zvcm0uc2VsZWN0ZWQgIT09IG51bGwgJiYgdHlwZW9mIHZtLm5ld1BsYXlib29rRm9ybS5zZWxlY3RlZCAhPT0gXCJ1bmRlZmluZWRcIjtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8vIENhbmNlbCBhY3Rpb24gb24gZm9ybS5cclxuICAgICAgICAgICAgY2FuY2VsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2Fzc2Vzc21lbnRzLycgKyAkcm91dGVQYXJhbXMuYXNzZXNzbWVudElkICsgJy9wbGF5Ym9va3MnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdm0ub3duZXJGb3JtID0ge1xyXG4gICAgICAgICAgICBmb3JtOiB7fSxcclxuICAgICAgICAgICAgb25TYXZlOiB1cGRhdGVQbGF5Ym9va093bmVyLFxyXG4gICAgICAgICAgICBjYW5jZWw6IG51bGwsXHJcbiAgICAgICAgICAgIHVzZXJzOiBbXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIEluZGljYXRpb24gdGhhdCB3ZSBoYXZlIGFsbCBvZiB0aGUgZGF0YSB0aGF0IHRoZSBVSSBuZWVkcyB0byBkaXNwbGF5LlxyXG4gICAgICAgIHZtLmxvYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvLyBFcnJvciBvciBpbmZvcm1hdGl2ZSBtZXNzYWdlIHRvIGRpc3BsYXkgaW5zdGVhZCBvZiB0aGUgaW50ZW5kZWQgY29udGVudC5cclxuICAgICAgICB2bS5tZXNzYWdlID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gRXJyb3Igb3IgaW5mb3JtYXRpb24gbWVzc2FnZSB0byBkaXNwbGF5IGluIGFkZGl0aW9uIHRvIHRoZSBpbnRlbmRlZCBjb250ZW50LlxyXG4gICAgICAgIHZtLmluZm8gPSBudWxsO1xyXG5cclxuICAgICAgICAvLyBQbGF5Ym9vayBhY3Rpb25zLlxyXG4gICAgICAgIHZtLmdldFBsYXlib29rTGlzdCA9IGdldFBsYXlib29rTGlzdDtcclxuICAgICAgICB2bS5nZXRQbGF5Ym9vayA9IGdldFBsYXlib29rO1xyXG4gICAgICAgIHZtLmNyZWF0ZVBsYXlib29rID0gY3JlYXRlUGxheWJvb2s7XHJcbiAgICAgICAgdm0ubmF2aWdhdGVUb1BsYXlib29rRGV0YWlscyA9IG5hdmlnYXRlVG9QbGF5Ym9va0RldGFpbHM7XHJcbiAgICAgICAgdm0uZ2V0U2hhcmVQbGF5Ym9va0xpbmsgPSBnZXRTaGFyZVBsYXlib29rTGluaztcclxuICAgICAgICB2bS5hZGRTaGFyZWRQbGF5Ym9vayA9IGFkZFNoYXJlZFBsYXlib29rO1xyXG4gICAgICAgIHZtLmFjdGl2YXRlID0gYWN0aXZhdGU7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFjdGlvbnMgdG8gdGFrZSB1cG9uIHBhZ2UgbG9hZC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgdm0ubG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZtLmFzc2Vzc21lbnQgPSB7XHJcbiAgICAgICAgICAgICAgICBpZDogKyRyb3V0ZVBhcmFtcy5hc3Nlc3NtZW50SWRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgYXBwcm9wcmlhdGUgZGF0YSBiYXNlZCBvbiBvdXIgZGVzaXJlZCBhY3Rpb24uXHJcbiAgICAgICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBHZXQgYWxsIHBsYXlib29rcyBhbmQgdGhlbiBsb2FkIHRoZSBkZXRhaWxzIGZvciBhIGRlZmF1bHQgcGxheWJvb2suXHJcbiAgICAgICAgICAgICAgICBjYXNlICdMSVNUX1BMQVlCT09LUyc6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBsaXN0LlxyXG4gICAgICAgICAgICAgICAgICAgIGdldFBsYXlib29rTGlzdCh2bS5hc3Nlc3NtZW50LmlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGVuIGdldCB0aGUgZGV0YWlscyBmb3IgdGhlIGZpcnN0IHBsYXlib29rLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZtLnBsYXlib29rcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlZmF1bHRQbGF5Ym9vayA9IHZtLnBsYXlib29rc1swXS5sYXRlc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UGxheWJvb2soZGVmYXVsdFBsYXlib29rLmlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRBc3Nlc3NtZW50TmFtZSh2bS5jdXJyZW50LmRldGFpbHMudGVhbUFzc2Vzc21lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBkZXRhaWxzIGZvciBhIHNwZWNpZmljIHBsYXlib29rLlxyXG4gICAgICAgICAgICAgICAgY2FzZSAnUExBWUJPT0tfREVUQUlMUyc6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBsaXN0LlxyXG4gICAgICAgICAgICAgICAgICAgIGdldFBsYXlib29rTGlzdCh2bS5hc3Nlc3NtZW50LmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBkZXRhaWxzIGZvciB0aGUgc3BlY2lmaWVkIHBsYXlib29rLlxyXG4gICAgICAgICAgICAgICAgICAgIGdldFBsYXlib29rKCskcm91dGVQYXJhbXMucGxheWJvb2tJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0QXNzZXNzbWVudE5hbWUodm0uY3VycmVudC5kZXRhaWxzLnRlYW1Bc3Nlc3NtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgcGxheWJvb2sgYW5kIHRoZW4gbG9hZCB0aGUgZGV0YWlscy5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ0NSRUFURV9QTEFZQk9PSyc6XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0TGF0ZXN0VGVhbUFzc2Vzc21lbnRMaXN0QnlUZWFtKHZtLmFzc2Vzc21lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChsaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBidWlsZCB0ZWFtIGxpc3Qgd2l0aCB0ZWFtIGFzc2Vzc21lbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5uZXdQbGF5Ym9va0Zvcm0udGVhbXMgPSBsaXN0Lm1hcChmdW5jdGlvbiAobCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBsLmxhdGVzdC50ZWFtSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGwubGF0ZXN0LnRlYW1OYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZFRlYW1Bc3Nlc3NtZW50QXR0ZW1wdDogbC5sYXRlc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbFRlYW1Bc3Nlc3NtZW50QXR0ZW1wdHM6IGwubGlzdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgcm91dGUgcGFyYW1zIGFyZSBwcm92aWRlZCBmb3IgYSB0ZWFtYXNzZXNzbWVudCwgcHJlLXNlbGVjdCB0aGUgZmllbGRzLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCskcm91dGVQYXJhbXMuYXNzZXNzbWVudElkID4gMCAmJiArJHJvdXRlUGFyYW1zLnRlYW1Bc3Nlc3NtZW50SWQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlYW0sIHRlYW1Bc3Nlc3NtZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZWFtQXNzZXNzbWVudCA9IGFzc2Vzc21lbnREYXRhU2VydmljZS5nZXRUZWFtQXNzZXNzbWVudEJ5SWRGcm9tR3JvdXBlZExpc3QoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCwgKyRyb3V0ZVBhcmFtcy50ZWFtQXNzZXNzbWVudElkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRlYW1Bc3Nlc3NtZW50ICE9PSBudWxsICYmIHR5cGVvZiB0ZWFtQXNzZXNzbWVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZWFtID0gdm0ubmV3UGxheWJvb2tGb3JtLnRlYW1zLmZpbmQoZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4LmlkID09PSB0ZWFtQXNzZXNzbWVudC50ZWFtSWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5uZXdQbGF5Ym9va0Zvcm0uc2VsZWN0ZWQgPSB0ZWFtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5uZXdQbGF5Ym9va0Zvcm0uc2VsZWN0VGVhbSh0ZWFtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0ubmV3UGxheWJvb2tGb3JtLnNlbGVjdFRlYW1Bc3Nlc3NtZW50KHRlYW1Bc3Nlc3NtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnU0hBUkVfUExBWUJPT0snOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFBvcHVsYXRlIGZpZWxkcyBmb3IgdGhlIGNyZWF0ZSBmb3JtLlxyXG4gICAgICAgICAgICAgICAgICAgIGdldFBsYXlib29rTGlzdCh2bS5hc3Nlc3NtZW50LmlkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgdGhlIHBsYXlib29rIHRvIHRoZSBzaGFyZWQgbGlzdC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmFkZFNoYXJlZFBsYXlib29rKCskcm91dGVQYXJhbXMucGxheWJvb2tJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ0VYUE9SVF9QTEFZQk9PSyc6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBsaXN0LlxyXG4gICAgICAgICAgICAgICAgICAgIGdldFBsYXlib29rTGlzdCh2bS5hc3Nlc3NtZW50LmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IHRoZSBkZXRhaWxzIGZvciB0aGUgc3BlY2lmaWVkIHBsYXlib29rLlxyXG4gICAgICAgICAgICAgICAgICAgIGdldFBsYXlib29rKCskcm91dGVQYXJhbXMucGxheWJvb2tJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0QXNzZXNzbWVudE5hbWUodm0uY3VycmVudC5kZXRhaWxzLnRlYW1Bc3Nlc3NtZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBIaWRlIGlycmVsZXZhbnQgaW5mbyBmcm9tIHRoZSBwYWdlcy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmN1cnJlbnQubW9kZSA9IHZtLm1vZGVzLmRvd25sb2FkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvd25sb2FkIHRoZSBwZGYuIEFkZCBhIGRlbGF5IHRvIGVuc3VyZSBiaW5kaW5ncyBhcmUgYWxsIGNvbXBsZXRlLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluZGljYXRlIHRoZSBwYWdlIGlzIGxvYWRlZCBhbmQgcmVhZHkgdG8gZG93bmxvYWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEyNTApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBnZXRQbGF5Ym9va0xpc3QoKTtcclxuICAgICAgICAgICAgICAgICAgICB2bS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXRzIHRoZSBhc3Nlc3NtZW50IG5hbWUuIFVzZWQgZHVlIHRvIHNvdXJjZSBvZiBuYW1lIGJlaW5nIGRpZmZlcmVudFxyXG4gICAgICAgICAqIGRlcGVuZGluZyBvbiB0aGVcclxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gdGVhbUFzc2Vzc21lbnRcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBzZXRBc3Nlc3NtZW50TmFtZSh0ZWFtQXNzZXNzbWVudCkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRlYW1Bc3Nlc3NtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIHRlYW1Bc3Nlc3NtZW50ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5hc3Nlc3NtZW50Lm5hbWUgPSB0ZWFtQXNzZXNzbWVudC5hc3Nlc3NtZW50TmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0cyBhbGwgYXZhaWxhYmxlIHBsYXlib29rcyBmb3IgYW4gYXNzZXNzbWVudC5cclxuICAgICAgICAgKiBEb2VzIG5vdCBpbmNsdWRlIGFueSB0ZWFtIGFzc2Vzc21lbnRzLlxyXG4gICAgICAgICAqIEBwYXJhbSB7SW50fSBhc3Nlc3NtZW50SWRcclxuICAgICAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gd2l0aCBsaXN0IG9mIHBsYXlib29rIG9iamVjdHMsIGNvbnRhaW5pbmcgbGF0ZXN0IGFuZCBsaXN0IGl0ZW1zLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFBsYXlib29rTGlzdChhc3Nlc3NtZW50SWQpIHtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgcGxheWJvb2tEYXRhU2VydmljZS5nZXRQbGF5Ym9va3NGb3JBc3Nlc3NtZW50KGFzc2Vzc21lbnRJZClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlYW1Hcm91cCA9IGRhdGEuZ3JvdXAocGxheWJvb2sgPT4gcGxheWJvb2sudGVhbU5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5Ym9va3MgPSBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGxheWJvb2tPYmogPSBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb3N0UmVjZW50UGxheWJvb2sgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdGhlIGxhdGVzdCB0ZWFtIGFzc2Vzc21lbnQgZm9yIGVhY2ggdGVhbSBhbmQgYWRkIGl0IHRvIHRoZSBsaXN0LlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh0ZWFtR3JvdXAsIGZ1bmN0aW9uIChncm91cGVkRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwbGF5Ym9va3MgPSBncm91cGVkRGF0YS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGxheWJvb2tzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdldCB0aGUgbGF0ZXN0IGNyZWF0ZWQgcGxheWJvb2suXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb3N0UmVjZW50UGxheWJvb2sgPSBwbGF5Ym9va3MucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjdXJyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZEYXRlLCBjdXJyZW50RGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2RGF0ZSA9IHByZXYuY3JlYXRlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RGF0ZSA9IGN1cnJlbnQuY3JlYXRlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldkRhdGUgPiBjdXJyZW50RGF0ZSA/IHByZXYgOiBjdXJyZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQWRkIHRvIHRoZSBsaXN0IG9mIHRlYW0gYXNzZXNzbWVudHMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5Ym9va09iaiA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXRlc3Q6IG1vc3RSZWNlbnRQbGF5Ym9vayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0OiBwbGF5Ym9va3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5wbGF5Ym9va3MucHVzaChwbGF5Ym9va09iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSdzIG9ubHkgb25lIGF0dGVtcHQsIG1ha2UgdGhhdCB0aGUgbW9zdCByZWNlbnQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5Ym9va09iaiA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXRlc3Q6IHBsYXlib29rc1swXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0OiBwbGF5Ym9va3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5wbGF5Ym9va3MucHVzaChwbGF5Ym9va09iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh2bS5wbGF5Ym9va3MpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZXR1cm4gYSBwcm9taXNlIHNvIHRoYXQgd2UgY2FuIGNoYWluIHRoZXNlIHRvZ2V0aGVyIGFzIG5lZWRlZC5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXRzIHRoZSBkZXRhaWxzIGZvciB0aGUgcGxheWJvb2sgYmFzZWQgb24gdGhlIHByb3ZpZGVkIGlkLlxyXG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwbGF5Ym9va0lkXHJcbiAgICAgICAgICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UGxheWJvb2socGxheWJvb2tJZCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG5cclxuICAgICAgICAgICAgcGxheWJvb2tEYXRhU2VydmljZS5nZXRQbGF5Ym9va0RldGFpbHMocGxheWJvb2tJZClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmN1cnJlbnQuZGV0YWlscyA9IGRhdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBHZXQgdmVyc2lvbiBpbmZvLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRQbGF5Ym9va1ZlcnNpb25zKHZtLnBsYXlib29rcywgdm0uY3VycmVudC5kZXRhaWxzLnRlYW1OYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFByZXBhcmUgdXNlciBkYXRhIGZvciBvd25lciBmb3JtLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5FZGl0T3duZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSBcIlVuYWJsZSB0byByZXRyaWV2ZSBwbGF5Ym9vayBkZXRhaWxzLiBQbGVhc2UgdHJ5IGFnYWluLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJldHVybiBhIHByb21pc2Ugc28gdGhhdCB3ZSBjYW4gY2hhaW4gdGhlc2UgdG9nZXRoZXIgYXMgbmVlZGVkLlxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNldHMgdGhlIHBsYXlib2sgdmVyc2lvbnMgZm9yIHRoZSBjdXJyZW50IHRlYW0uXHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gcGxheWJvb2tzIGFsbCBhdmFpbGFibGUgcGxheWJvb2tzIHRvIHNlYXJjaCB0aHJvdWdoIGZvciBwcmV2aW91cyB2ZXJzaW9ucy5cclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGVhbU5hbWUgbmFtZSBvZiB0aGUgdGVhbSB0byBmaWx0ZXIgcGxheWJvb2tzIG9uLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNldFBsYXlib29rVmVyc2lvbnMocGxheWJvb2tzLCB0ZWFtTmFtZSkge1xyXG4gICAgICAgICAgICBsZXQgdmVyc2lvbnMgPSB7fSxcclxuICAgICAgICAgICAgICAgIHBsYXlib29rID0gbnVsbDtcclxuICAgICAgICAgICAgcGxheWJvb2sgPSBwbGF5Ym9va3MuZmluZChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHAubGF0ZXN0LnRlYW1OYW1lID09PSB0ZWFtTmFtZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChwbGF5Ym9vayAhPT0gbnVsbCAmJiB0eXBlb2YgcGxheWJvb2sgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHZlcnNpb25zID0gcGxheWJvb2s7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZtLmN1cnJlbnQudmVyc2lvbnMgPSB2ZXJzaW9ucztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlZGlyZWN0IHVybCB0byBwbGF5Ym9vayBkZXRhaWxzLlxyXG4gICAgICAgICAqIEBwYXJhbSB7SW50fSBwbGF5Ym9va0lkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbmF2aWdhdGVUb1BsYXlib29rRGV0YWlscyhwbGF5Ym9va0lkKSB7XHJcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvYXNzZXNzbWVudHMvJyArIHZtLmFzc2Vzc21lbnQuaWQgKyAnL3BsYXlib29rcy8nICsgcGxheWJvb2tJZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGVzIGEgbmV3IHBsYXlib29rIGZvciB0aGUgc2VsZWN0ZWQgdGVhbSBhc3Nlc3NtZW50LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVBsYXlib29rKCkge1xyXG4gICAgICAgICAgICB2YXIgdGVhbUFzc2Vzc21lbnQgPSB2bS5jdXJyZW50LmRldGFpbHMudGVhbUFzc2Vzc21lbnQ7XHJcbiAgICAgICAgICAgIHZtLm1lc3NhYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgdm0ubmV3UGxheWJvb2tGb3JtLnN1Ym1pdHRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICghdm0ubmV3UGxheWJvb2tGb3JtLmZvcm0uJHZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcGxheWJvb2tEYXRhU2VydmljZS5jcmVhdGVQbGF5Ym9va0ZvclRlYW1Bc3Nlc3NtZW50KHRlYW1Bc3Nlc3NtZW50KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5pbmZvID0gJ1BsYXlib29rIHdhcyBzYXZlZCBzdWNjZXNzZnVsbHknO1xyXG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uaW5mbyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLm5ld1BsYXlib29rRm9ybS5zdWJtaXR0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0ubmF2aWdhdGVUb1BsYXlib29rRGV0YWlscyhkYXRhLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9ICdUaGVyZSB3YXMgYW4gZXJyb3Igc2F2aW5nIHRoZSBwbGF5Ym9vay4gUGxlYXNlIHRyeSBhZ2Fpbi4nO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBVcGRhdGVzIGFuIGV4aXN0aW5nIHBsYXlib29rLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVBsYXlib29rKCkge1xyXG4gICAgICAgICAgICBwbGF5Ym9va0RhdGFTZXJ2aWNlLnVwZGF0ZVBsYXlib29rKHZtLmN1cnJlbnQuZGV0YWlscy5pZCwgdm0uY3VycmVudC5kZXRhaWxzKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5pbmZvID0gJ1BsYXlib29rIHdhcyBzYXZlZCBzdWNjZXNzZnVsbHknO1xyXG4gICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uaW5mbyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLm93bmVyRm9ybS5zdWJtaXR0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9LCAxNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICBnZXRQbGF5Ym9vayh2bS5jdXJyZW50LmRldGFpbHMuaWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGdldFBsYXlib29rTGlzdCh2bS5hc3Nlc3NtZW50LmlkKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9ICdUaGVyZSB3YXMgYW4gZXJyb3Igc2F2aW5nIHRoZSBwbGF5Ym9vay4gUGxlYXNlIHRyeSBhZ2Fpbi4nO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXRzIHRoZSB0ZWFtIGFzc2Vzc21lbnRzIHRvIGJ1aWxkIHRoZSBuZXcgcGxheWJvb2sgZm9ybS5cclxuICAgICAgICAgKiBAcGFyYW0ge0ludH0gYXNzZXNzbWVudElkXHJcbiAgICAgICAgICogQHJldHVybnMge1Byb21pc2V9IHdpdGggdGhlIGZsYXQgdGVhbSBhc3Nlc3NtZW50IGxpc3QuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VGVhbUFzc2Vzc21lbnRMaXN0KGFzc2Vzc21lbnRJZCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IGFsbCBhc3Nlc3NtZW50cy5cclxuICAgICAgICAgICAgYXNzZXNzbWVudERhdGFTZXJ2aWNlLmdldFRlYW1Bc3Nlc3NtZW50cyhhc3Nlc3NtZW50SWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gJ1lvdSBkbyBub3QgaGF2ZSBhbnkgY29tcGxldGVkIGFzc2Vzc21lbnRzIHRvIGNyZWF0ZSBhIHBsYXlib29rIGZvci4gUGxlYXNlIGNvbXBsZXRlIGFuIGFzc2Vzc21lbnQgZmlyc3QuJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgdGhlIGxhdGVzdCB0ZWFtIGFzc2Vzc21lbnQgZm9yIGVhY2ggdGVhbS5cclxuICAgICAgICAgKiBAcGFyYW0ge0ludH0gYXNzZXNzbWVudElkXHJcbiAgICAgICAgICogQHJldHVybnMge0FycmF5fSBmbGF0IGxpc3Qgb2YgdGhlIGxhdGVzdCB0ZWFtIGFzc2Vzc21lbnRzIG9ubHkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0TGF0ZXN0VGVhbUFzc2Vzc21lbnRMaXN0QnlUZWFtKGFzc2Vzc21lbnRJZCkge1xyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG5cclxuICAgICAgICAgICAgZ2V0VGVhbUFzc2Vzc21lbnRMaXN0KGFzc2Vzc21lbnRJZClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlYW1Hcm91cCA9IGRhdGEuZ3JvdXAodGVhbUFzc2Vzc21lbnQgPT4gdGVhbUFzc2Vzc21lbnQudGVhbU5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWFtQXNzZXNzbWVudHMgPSBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVhbUFzc2Vzc21lbnRPYmogPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2godGVhbUdyb3VwLCBmdW5jdGlvbiAoZ3JvdXBlZERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVhbUFzc2Vzc21lbnRPYmogPSBhc3Nlc3NtZW50RGF0YVNlcnZpY2UuZ2V0TW9zdFJlY2VudEF0dGVtcHRGb3JUZWFtKGdyb3VwZWREYXRhLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZWFtQXNzZXNzbWVudHMucHVzaCh0ZWFtQXNzZXNzbWVudE9iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUodGVhbUFzc2Vzc21lbnRzKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRNb3N0UmVjZW50Q29tcGxldGVkVGVhbUFzc2Vzc21lbnRGb3JUZWFtKHRlYW1Bc3Nlc3NtZW50c0ZvclRlYW0pIHtcclxuICAgICAgICAgICAgbW9zdFJlY2VudFRlYW1Bc3Nlc3NtZW50ID0gdGVhbUFzc2Vzc21lbnRzRm9yVGVhbS5maWx0ZXIoZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0LmNvbXBsZXRlZCAhPT0gbnVsbDtcclxuICAgICAgICAgICAgfSkucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjdXJyZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldi5jb21wbGV0ZWQgPiBjdXJyZW50LmNvbXBsZXRlZCA/IHByZXYgOiBjdXJyZW50O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIG1vc3RSZWNlbnRUZWFtQXNzZXNzbWVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgdGhlIGxpbmsgdXNlZCB0byBzaGFyZSB0aGUgY3VycmVudGx5IHJldmlld2VkIHBsYXlib29rLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9IGZ1bGwgdXJsIGZvciBhIHVzZXIgdG8gY2xpY2sgdG8gYWRkIHRoZSBwbGF5Ym9vayB0byB0aGVpciBzaGFyZWQgcGxheWJvb2sgbGlzdC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRTaGFyZVBsYXlib29rTGluaygpIHtcclxuICAgICAgICAgICAgaWYgKCFhbmd1bGFyLmVxdWFscyh2bS5jdXJyZW50LmRldGFpbHMsIHt9KSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBsYXlib29rSWQgPSB2bS5jdXJyZW50LmRldGFpbHMuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXNzbWVudElkID0gdm0uYXNzZXNzbWVudC5pZDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwbGF5Ym9va0RhdGFTZXJ2aWNlLmdldFBsYXlib29rU2hhcmVMaW5rKGFzc2Vzc21lbnRJZCwgcGxheWJvb2tJZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFkZHMgdGhlIGFzc2Vzc21lbnQgdG8gdGhlIGN1cnJlbnQgdXNlcidzIHNoYXJlZCBhc3Nlc3NtZW50IGxpc3QuXHJcbiAgICAgICAgICogQHBhcmFtIHtJbnR9IHBsYXlib29rSWRcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBhZGRTaGFyZWRQbGF5Ym9vayhwbGF5Ym9va0lkKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBsaW5rIHRvIHBsYXlib29rLlxyXG4gICAgICAgICAgICBwbGF5Ym9va0RhdGFTZXJ2aWNlLmFkZFNoYXJlZFBsYXlib29rKHBsYXlib29rSWQpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGl0J3Mgbm90IGFscmVhZHkgdGhlcmUsIGFkZCB0aGUgcGxheWJvb2sgdG8gdGhlIHBsYXlib29rIGxpc3QuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ291bGQgZ28gdG8gdGhlIHNlcnZlciBhZ2FpbiB0byBnZXQgdGhlIGZ1bGwgbGlzdCwgYnV0IHRyeWluZyB0byBzYXZlIGEgdHJpcC5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgZXhpc3RzID0gdm0ucGxheWJvb2tzLmZpbHRlcihmdW5jdGlvbiAodCkgeyByZXR1cm4gdC5pZCA9PT0gZGF0YS5pZDsgfSkubGVuZ3RoID4gMDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RzID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5wbGF5Ym9va3MucHVzaChkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNob3cgb3VyIHNoYXJlZCBtZXNzYWdlIGZvciBhIG1vbWVudCBpZiB0aGlzIGlzIGEgbmV3IGFkZGl0aW9uIHRvIG91ciBsaXN0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5pbmZvID0gJ1RoZSBwbGF5Ym9vayBmb3IgJyArIGRhdGEudGVhbU5hbWUgKyAnIGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBhZGRlZCB0byB5b3VyIHNoYXJlZCBwbGF5Ym9vayBsaXN0Lic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmluZm8gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCA1ICogMTAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBMb2FkIHRoZSByZXZpZXcgZGF0YSBmb3IgdGhlIHNoYXJlZCBwbGF5Ym9vay5cclxuICAgICAgICAgICAgICAgICAgICB2bS5nZXRQbGF5Ym9vayhwbGF5Ym9va0lkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRBc3Nlc3NtZW50TmFtZSh2bS5jdXJyZW50LmRldGFpbHMudGVhbUFzc2Vzc21lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgZmFpbGVkLCBzaG93IGFuIGVycm9yIG1lc3NhZ2UgaW5zdGVhZCBvZiBhbmQgcmV2aWV3IGRldGFpbHMuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yICE9PSBudWxsICYmIHR5cGVvZiBlcnJvciAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIHRyeWluZyB0byBhZGQgdGhlIHNoYXJlZCBwbGF5Ym9vazogJyArIGVycm9yO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0ubWVzc2FnZSA9ICdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSB0cnlpbmcgdG8gYWRkIHRoZSBzaGFyZWQgcGxheWJvb2suIFBsZWFzZSB0cnkgYWdhaW4uJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgYSBsaXN0IG9mIGFsbCB1c2VycyB3aXRoaW4gdGhlIGFwcGxpY2F0aW9uLCBleGNsdWRpbmcgdGhlIGN1cnJlbnQgdXNlci5cclxuICAgICAgICAgKiBTZXRzIHRoZSB1c2VyIGxpc3QgZm9yIHRoZSBvd25lciBmb3JtLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFVzZXJMaXN0KCkge1xyXG4gICAgICAgICAgICB1c2VyU2VydmljZS5nZXRVc2VycygpXHJcbiAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh1c2Vycykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHVzZXJzLmZpbHRlcihmdW5jdGlvbiAodSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1LklkICE9PSB2bS5jdXJyZW50LmRldGFpbHMub3duZXJJZDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdm0ub3duZXJGb3JtLnVzZXJzID0gcmVzdWx0O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVwZGF0ZXMgdGhlIG93bmVyIG9mIHRoZSBwbGF5Ym9vayBiYXNlZCBvbiB0aGUgZm9ybSB2YWx1ZXMuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlUGxheWJvb2tPd25lcigpIHtcclxuICAgICAgICAgICAgdm0ub3duZXJGb3JtLnN1Ym1pdHRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICghdm0ub3duZXJGb3JtLmZvcm0uJHZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdXBkYXRlUGxheWJvb2soKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERldGVybWluZXMgaWYgdGhlIGN1cnJlbnQgdXNlciBoYXMgdGhlIHBlcm1pc3Npb24gb3Igb3duZXJzaGlwIHJlcXVpcmVkXHJcbiAgICAgICAgICogaW4gb3JkZXIgdG8gY2hhbmdlIHRoZSBvd25lciBvZiBhIHBsYXlib29rLiBJZiB0aGUgdXNlciBoYXMgdGhlIHBlcm1pc3Npb24sIGdldFxyXG4gICAgICAgICAqIHRoZSBsaXN0IG9mIHVzZXJzIHByZXBhcmVkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGNhbkVkaXRPd25lcigpIHtcclxuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhbiBhcmNoaXZlZCBwbGF5Ym9vaywgZG9uJ3QgYWxsb3cgYW55b25lIHRvIGVkaXQgaXQuXHJcbiAgICAgICAgICAgIGlmICh2bS5jdXJyZW50LmRldGFpbHMuaXNBcmNoaXZlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodm0uY3VycmVudC5kZXRhaWxzLmlzT3duZWRCeU1lID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jdXJyZW50LmRldGFpbHMuY2FuRWRpdE93bmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGdldFVzZXJMaXN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhdXRoU2VydmljZS5oYXNQZXJtaXNzaW9uKFwiUExBWUJPT0tfT1dORVJcIiwgXCJFZGl0XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uY3VycmVudC5kZXRhaWxzLmNhbkVkaXRPd25lciA9IGRhdGEgfHwgZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodm0uY3VycmVudC5kZXRhaWxzLmNhbkVkaXRPd25lciA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0VXNlckxpc3QoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wbGF5Ym9vaycpXHJcbiAgICAgICAgLmZhY3RvcnkoJ3BsYXlib29rRGF0YVNlcnZpY2UnLCBEYXRhU2VydmljZSk7XHJcblxyXG4gICAgRGF0YVNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnLCAnJGxvZycsICckcScsICdjb25maWdzJywgJyR3aW5kb3cnLCAnJGxvY2F0aW9uJ107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXJ2aWNlIHVzZWQgdG8gZ2V0IGRhdGEgZnJvbSB0aGUgc2VydmVyIGZvciBQbGF5Ym9va3MuXHJcbiAgICAgKiBAcGFyYW0geyRodHRwfSAkaHR0cFxyXG4gICAgICogQHBhcmFtIHskbG9nfSAkbG9nXHJcbiAgICAgKiBAcGFyYW0geyRxfSAkcVxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZ3NcclxuICAgICAqIEBwYXJhbSB7JHdpbmRvd30gJHdpbmRvd1xyXG4gICAgICogQHBhcmFtIHskbG9jYXRpb259ICRsb2NhdGlvblxyXG4gICAgICogQHJldHVybnMge09iamVjdH0gYXZhaWxhYmxlIG1ldGhvZHNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gRGF0YVNlcnZpY2UoJGh0dHAsICRsb2csICRxLCBjb25maWdzLCAkd2luZG93LCAkbG9jYXRpb24pIHtcclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgZ2V0UGxheWJvb2tzOiBnZXRQbGF5Ym9va3MsXHJcbiAgICAgICAgICAgIGdldFBsYXlib29rc0ZvckFzc2Vzc21lbnQ6IGdldFBsYXlib29rc0ZvckFzc2Vzc21lbnQsXHJcbiAgICAgICAgICAgIGdldFBsYXlib29rRGV0YWlsczogZ2V0UGxheWJvb2tEZXRhaWxzLFxyXG4gICAgICAgICAgICBjcmVhdGVQbGF5Ym9va0ZvclRlYW1Bc3Nlc3NtZW50OiBjcmVhdGVQbGF5Ym9va0ZvclRlYW1Bc3Nlc3NtZW50LFxyXG4gICAgICAgICAgICB1cGRhdGVQbGF5Ym9vazogdXBkYXRlUGxheWJvb2ssXHJcbiAgICAgICAgICAgIGFkZFNoYXJlZFBsYXlib29rOiBhZGRTaGFyZWRQbGF5Ym9vayxcclxuICAgICAgICAgICAgZ2V0UGxheWJvb2tTaGFyZUxpbms6IGdldFBsYXlib29rU2hhcmVMaW5rLFxyXG5cclxuICAgICAgICAgICAgZGVsZXRlQ29tbWl0bWVudDogZGVsZXRlQ29tbWl0bWVudCxcclxuICAgICAgICAgICAgY3JlYXRlQ29tbWl0bWVudEZvclBsYXlib29rOiBjcmVhdGVDb21taXRtZW50Rm9yUGxheWJvb2ssXHJcbiAgICAgICAgICAgIHVwZGF0ZUNvbW1pdG1lbnQ6IHVwZGF0ZUNvbW1pdG1lbnRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0IGFsbCBwbGF5Ym9va3MgZm9yIHRoZSBjdXJyZW50IHVzZXIuXHJcbiAgICAgICAgICogQHJldHVybnMge0FycmF5fSBMaXN0IG9mIFBsYXlib29rRFRPc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFBsYXlib29rcygpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBjb25maWdzLmFwaVVybCArICdwbGF5Ym9va3MnXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAocmVxdWVzdClcclxuICAgICAgICAgICAgICAgIC50aGVuKGdldFBsYXlib29rc0NvbXBsZXRlKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGdldFBsYXlib29rc0ZhaWxlZCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU3VjZXNzIENhbGxiYWNrXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZVxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRQbGF5Ym9va3NDb21wbGV0ZShyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBGYWlsdXJlIGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlcnJvclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0UGxheWJvb2tzRmFpbGVkKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IGdldEVycm9yTWVzc2FnZShlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdYSFIgZmFpbGVkIGZvciBnZXRQbGF5Ym9va3MuICcgKyBtZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0IGFsbCBwbGF5Ym9va3MgZm9yIHRoZSBjdXJyZW50IHVzZXIgYW5kIHRoZSBzcGVjaWZpZWQgYXNzZXNzbWVudFxyXG4gICAgICAgICAqIEBwYXJhbSB7SW50fSBhc3Nlc3NtZW50SWRcclxuICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9IExpc3Qgb2YgUGxheWJvb2tEVE9zXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UGxheWJvb2tzRm9yQXNzZXNzbWVudChhc3Nlc3NtZW50SWQpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBjb25maWdzLmFwaVVybCArICdhc3Nlc3NtZW50cy8nICsgYXNzZXNzbWVudElkICsgJy9wbGF5Ym9va3MnXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAocmVxdWVzdClcclxuICAgICAgICAgICAgICAgIC50aGVuKGdldFBsYXlib29rc0ZvckFzc2Vzc21lbnRDb21wbGV0ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChnZXRQbGF5Ym9va3NGb3JBc3Nlc3NtZW50RmFpbGVkKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTdWNlc3MgQ2FsbGJhY2tcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtBcnJheX1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFBsYXlib29rc0ZvckFzc2Vzc21lbnRDb21wbGV0ZShyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBGYWlsdXJlIGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlcnJvclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0UGxheWJvb2tzRm9yQXNzZXNzbWVudEZhaWxlZChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBnZXRFcnJvck1lc3NhZ2UoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignWEhSIGZhaWxlZCBmb3IgZ2V0UGxheWJvb2tzRm9yQXNzZXNzbWVudC4gJyArIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgdGhlIGRldGFpbHMgZm9yIHRoZSBwbGF5Ym9vay5cclxuICAgICAgICAgKiBAcGFyYW0ge2ludH0gcGxheWJvb2tJZFxyXG4gICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFBsYXlib29rRFRPXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UGxheWJvb2tEZXRhaWxzKHBsYXlib29rSWQpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBjb25maWdzLmFwaVVybCArICdwbGF5Ym9va3MvJyArIHBsYXlib29rSWRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cChyZXF1ZXN0KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZ2V0UGxheWJvb2tEZXRhaWxzQ29tcGxldGUpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZ2V0UGxheWJvb2tEZXRhaWxzRmFpbGVkKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTdWNlc3MgQ2FsbGJhY2tcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRQbGF5Ym9va0RldGFpbHNDb21wbGV0ZShyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBGYWlsdXJlIENhbGxiYWNrXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlcnJvclxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0UGxheWJvb2tEZXRhaWxzRmFpbGVkKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IGdldEVycm9yTWVzc2FnZShlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdYSFIgZmFpbGVkIGZvciBnZXRQbGF5Ym9va0RldGFpbHMuICcgKyBtZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBwbGF5Ym9vayBmb3IgdGhlIGdpdmVuIHRlYW0gYXNzZXNzbWVudC5cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdGVhbUFzc2Vzc21lbnQgVGVhbUFzc2Vzc21lbnREVE9cclxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBQbGF5Ym9va0RUT1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVBsYXlib29rRm9yVGVhbUFzc2Vzc21lbnQodGVhbUFzc2Vzc21lbnQpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogY29uZmlncy5hcGlVcmwgKyAncGxheWJvb2tzJyxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHRlYW1Bc3Nlc3NtZW50XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAocmVxdWVzdClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihjcmVhdGVQbGF5Ym9va0NvbXBsZXRlKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChjcmVhdGVQbGF5Ym9va0ZhaWxlZCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU3VjZXNzIENhbGxiYWNrXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZVxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlUGxheWJvb2tDb21wbGV0ZShyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBGYWlsdXJlIENhbGxiYWNrXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlcnJvclxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSAgcmVqZWN0cyBwcm9taXNlIHdpdGggYW4gZXJyb3IgbWVzc2FnZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlUGxheWJvb2tGYWlsZWQoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gZ2V0RXJyb3JNZXNzYWdlKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ1hIUiBmYWlsZWQgZm9yIGNyZWF0ZVBsYXlib29rRm9yVGVhbUFzc2Vzc21lbnQuICcgKyBtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENyZWF0ZXMgYSBuZXcgY29tbWl0bWVudCBhbmQgYWRkcyBpdCB0byB0aGUgcGxheWJvb2suXHJcbiAgICAgICAgICogQHBhcmFtIHtJbnR9IHBsYXlib29rSWRcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY29tbWl0bWVudFxyXG4gICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlQ29tbWl0bWVudEZvclBsYXlib29rKHBsYXlib29rSWQsIGNvbW1pdG1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIHVybDogY29uZmlncy5hcGlVcmwgKyAncGxheWJvb2tzLycgKyBwbGF5Ym9va0lkICsgJy9jb21taXRtZW50cycsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBjb21taXRtZW50XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAocmVxdWVzdClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihjcmVhdGVDb21taXRtZW50Rm9yUGxheWJvb2tDb21wbGV0ZSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goY3JlYXRlQ29tbWl0bWVudEZvclBsYXlib29rRmFpbGVkKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTdWNlc3MgQ2FsbGJhY2tcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVDb21taXRtZW50Rm9yUGxheWJvb2tDb21wbGV0ZShyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBGYWlsdXJlIENhbGxiYWNrXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlcnJvclxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSAgcmVqZWN0cyBwcm9taXNlIHdpdGggYW4gZXJyb3IgbWVzc2FnZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlQ29tbWl0bWVudEZvclBsYXlib29rRmFpbGVkKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IGdldEVycm9yTWVzc2FnZShlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdYSFIgZmFpbGVkIGZvciBjcmVhdGVDb21taXRtZW50Rm9yUGxheWJvb2suICcgKyBtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVwZGF0ZXMgcHJvcGVydGllcyBmb3IgYW4gZXhpc3RpbmcgY29tbWl0bWVudC5cclxuICAgICAgICAgKiBAcGFyYW0ge0ludH0gcGxheWJvb2tJZFxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb21taXRtZW50XHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVDb21taXRtZW50KHBsYXlib29rSWQsIGNvbW1pdG1lbnQpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBjb25maWdzLmFwaVVybCArICdwbGF5Ym9va3MvJyArIHBsYXlib29rSWQgKyAnL2NvbW1pdG1lbnRzLycgKyBjb21taXRtZW50LmlkLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogY29tbWl0bWVudFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4odXBkYXRlQ29tbWl0bWVudENvbXBsZXRlKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCh1cGRhdGVDb21taXRtZW50RmFpbGVkKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTdWNlc3MgQ2FsbGJhY2tcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVDb21taXRtZW50Q29tcGxldGUocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRmFpbHVyZSBDYWxsYmFja1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXJyb3JcclxuICAgICAgICAgICAgICogQHJldHVybnMge1N0cmluZ30gIHJlamVjdHMgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG1lc3NhZ2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNvbW1pdG1lbnRGYWlsZWQoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gZ2V0RXJyb3JNZXNzYWdlKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ1hIUiBmYWlsZWQgZm9yIHVwZGF0ZUNvbW1pdG1lbnQuICcgKyBtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVwZGF0ZSBhbiBleGlzdGluZyBwbGF5Ym9vay5cclxuICAgICAgICAgKiBAcGFyYW0ge2ludH0gcGxheWJvb2tJZFxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwbGF5Ym9vayBQbGF5Ym9va0RUT1xyXG4gICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IFBsYXlib29rRFRPXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlUGxheWJvb2socGxheWJvb2tJZCwgcGxheWJvb2spIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBjb25maWdzLmFwaVVybCArICdwbGF5Ym9va3MvJyArIHBsYXlib29rSWQsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBwbGF5Ym9va1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4odXBkYXRlUGxheWJvb2tDb21wbGV0ZSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2godXBkYXRlUGxheWJvb2tGYWlsZWQpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFN1Y2VzcyBDYWxsYmFja1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2VcclxuICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdH1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVBsYXlib29rQ29tcGxldGUocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRmFpbHVyZSBDYWxsYmFja1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXJyb3JcclxuICAgICAgICAgICAgICogQHJldHVybnMge1N0cmluZ30gIHJlamVjdHMgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG1lc3NhZ2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVBsYXlib29rRmFpbGVkKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IGdldEVycm9yTWVzc2FnZShlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdYSFIgZmFpbGVkIGZvciBzYXZlVGVhbUFzc2Vzc21lbnQuICcgKyBtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERlbGV0ZXMgdGhlIGdpdmVuIGNvbW1pdG1lbnQgZnJvbSB0aGUgcGxheWJvb2suXHJcbiAgICAgICAgICogQHBhcmFtIHtJbnR9IHBsYXlib29rSWRcclxuICAgICAgICAgKiBAcGFyYW0ge0ludH0gY29tbWl0bWVudElkXHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH0gcmVqZWN0cyBwcm9taXNlIHdpdGggYW4gYW4gZXJyb3IgbWVzc2FnZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGRlbGV0ZUNvbW1pdG1lbnQocGxheWJvb2tJZCwgY29tbWl0bWVudElkKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcclxuICAgICAgICAgICAgICAgIHVybDogY29uZmlncy5hcGlVcmwgKyAncGxheWJvb2tzLycgKyBwbGF5Ym9va0lkICsgJy9jb21taXRtZW50cy8nICsgY29tbWl0bWVudElkLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZGVsZXRlQ29tbWl0bWVudENvbXBsZXRlKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChkZWxldGVDb21taXRtZW50RmFpbGVkKTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTdWNlc3MgQ2FsbGJhY2tcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBkZWxldGVDb21taXRtZW50Q29tcGxldGUocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRmFpbHVyZSBDYWxsYmFja1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXJyb3JcclxuICAgICAgICAgICAgICogQHJldHVybnMge1N0cmluZ30gIHJlamVjdHMgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG1lc3NhZ2VcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGRlbGV0ZUNvbW1pdG1lbnRGYWlsZWQoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gZ2V0RXJyb3JNZXNzYWdlKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ1hIUiBmYWlsZWQgZm9yIGRlbGV0ZUNvbW1pdG1lbnQuICcgKyBtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNoYXJlcyB0aGUgcGxheWJvb2sgd2l0aCB0aGUgY3VycmVudCB1c2VyLlxyXG4gICAgICAgICAqIEBwYXJhbSB7SW50fSBwbGF5Ym9va0lkXHJcbiAgICAgICAgICogQHJldHVybnMge1BsYXlib29rRFRPfSBvciByZWplY3RzIHdpdGggYSBzdHJpbmcgZXJyb3IgbWVzc2FnZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBhZGRTaGFyZWRQbGF5Ym9vayhwbGF5Ym9va0lkKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGNvbmZpZ3MuYXBpVXJsICsgJ3BsYXlib29rcy8nICsgcGxheWJvb2tJZCArICcvc2hhcmUnXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAocmVxdWVzdClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihzaGFyZVBsYXlib29rQ29tcGxldGUpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKHNoYXJlUGxheWJvb2tGYWlsZWQpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFN1Y2VzcyBDYWxsYmFja1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2VcclxuICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdH1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNoYXJlUGxheWJvb2tDb21wbGV0ZShyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBGYWlsdXJlIENhbGxiYWNrXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlcnJvclxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSAgcmVqZWN0cyBwcm9taXNlIHdpdGggYW4gZXJyb3IgbWVzc2FnZVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2hhcmVQbGF5Ym9va0ZhaWxlZChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2UgPSBnZXRFcnJvck1lc3NhZ2UoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgJGxvZy5lcnJvcignWEhSIGZhaWxlZCBmb3Igc2hhcmVQbGF5Ym9vay4gJyArIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChtZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2VuZXJhdGVzIHRoZSBsaW5rIHRoYXQgd2lsbCBzaGFyZSBhIHBsYXlib29rIHdpdGggYW5vdGhlciB1c2VyLlxyXG4gICAgICAgICAqIEBwYXJhbSB7SW50fSBhc3Nlc3NtZW50SWRcclxuICAgICAgICAgKiBAcGFyYW0ge0ludH0gcGxheWJvb2tJZFxyXG4gICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UGxheWJvb2tTaGFyZUxpbmsoYXNzZXNzbWVudElkLCBwbGF5Ym9va0lkKSB7XHJcbiAgICAgICAgICAgIHZhciBiYXNlVXJsID0gbmV3ICR3aW5kb3cuVVJMKCRsb2NhdGlvbi5hYnNVcmwoKSkub3JpZ2luO1xyXG4gICAgICAgICAgICByZXR1cm4gYmFzZVVybCArICcvIy9hc3Nlc3NtZW50cy8nICsgYXNzZXNzbWVudElkICsgJy9wbGF5Ym9va3MvJyArIHBsYXlib29rSWQgKyAnL3NoYXJlJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEhlbHBlciBtZXRob2QgdG8gZ2V0IHRoZSBlcnJvciBtZXNzYWdlIGZyb20gdGhlIHNlcnZlciByZXNwb25zZS5cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXJyb3JcclxuICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldEVycm9yTWVzc2FnZShlcnJvcikge1xyXG4gICAgICAgICAgICB2YXIgbWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmIChcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgZXJyb3IuZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yLmRhdGEgIT09IG51bGwgJiYgXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIGVycm9yLmRhdGEuTWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBlcnJvci5kYXRhLk1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IuZGF0YTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnBsYXlib29rJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdwbGF5Ym9va1ZhbGlkYXRvcicsIFZhbGlkYXRvcik7XHJcblxyXG4gICAgVmFsaWRhdG9yLiRpbmplY3QgPSBbJyRsb2cnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFZhbGlkYXRlcyB0aGUgdGVhbSBhc3Nlc3NtZW50IHdpdGggYnVzaW5lc3MgcnVsZXMuXHJcbiAgICAgKiBAcGFyYW0geyRsb2d9ICRsb2cgbG9nIHByb3ZpZGVyXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBWYWxpZGF0b3IoJGxvZykge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgIHJlcXVpcmU6ICduZ01vZGVsJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGlyZWN0aXZlIGxpbmsgZnVuY3Rpb24uXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNjb3BlXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnRcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBhdHRyc1xyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjdHJsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFZhbGlkYXRlcyB0aGUgdGVhbSBhc3Nlc3NtZW50IGlzIGNvbXBsZXRlZC5cclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG1vZGVsVmFsdWVcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHZpZXdWYWx1ZVxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiBjb21wbGV0ZWQsIHdoaWNoIGlzIHZhbGlkLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY3RybC4kdmFsaWRhdG9ycy5jb21wbGV0ZWQgPSBmdW5jdGlvbiAobW9kZWxWYWx1ZSwgdmlld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmlld1ZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2aWV3VmFsdWUgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmlld1ZhbHVlLnN0YXR1cyA9PT0gJ0NPTVBMRVRFRCc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBWYWxpZGF0ZXMgdGhlIHRlYW0gYXNzZXNzbWVudCBkb2VzIG5vdCBhbHJlYWR5IGhhdmUgYSBwbGF5Ym9vay5cclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IG1vZGVsVmFsdWVcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHZpZXdWYWx1ZVxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gZmFsc2UgaWYgZG9lcyBub3QgZXhpc3QsIHdoaWNoIGlzIHZhbGlkXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBjdHJsLiR2YWxpZGF0b3JzLm5vUGxheWJvb2sgPSBmdW5jdGlvbiAobW9kZWxWYWx1ZSwgdmlld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmlld1ZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2aWV3VmFsdWUgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmlld1ZhbHVlLmhhc1BsYXlib29rID09PSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBWYWxpZGF0ZXMgdGhlIHRlYW0gYXNzZXNzbWVudCBpcyB0aGUgbGF0ZXN0LCBjb21wbGV0ZWQgdGVhbSBhc3Nlc3NtZW50LlxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gbW9kZWxWYWx1ZVxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdmlld1ZhbHVlXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufSBhbHdheXMgcmV0dXJucyB0cnVlLiBWYWxpZGl0eSBpcyBtYW51YWxseSBzZXQgZnJvbSBjb250cm9sbGVyLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY3RybC4kdmFsaWRhdG9ycy5sYXRlc3RBdHRlbXB0ID0gZnVuY3Rpb24gKG1vZGVsVmFsdWUsIHZpZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZpZXdWYWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2Ygdmlld1ZhbHVlICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7IC8vIGFsd2F5cyBnb2luZyB0byBiZSBtYW51YWxseSBzZXQgZnJvbSB0aGUgY29udHJvbGxlci5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdhdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlKTtcclxuXHJcbiAgICBhdXRoU2VydmljZS4kaW5qZWN0ID0gWyckcScsICd1c2VyU2VydmljZSddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGF0YSBzZXJ2aWNlIGZvciBhdXRoZW50aWNhdGlvbiBhbmQgYXV0aG9yaXphdGlvbi5cclxuICAgICAqIEBwYXJhbSB7JHF9ICRxXHJcbiAgICAgKiBAcGFyYW0ge2ZhY3Rvcnl9IHVzZXJTZXJ2aWNlXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhdXRoU2VydmljZSgkcSwgdXNlclNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgbG9nb3V0OiBsb2dvdXQsXHJcbiAgICAgICAgICAgIGdldEN1cnJlbnRVc2VyOiBnZXRDdXJyZW50VXNlcixcclxuICAgICAgICAgICAgaXNMb2dnZWRJbjogaXNMb2dnZWRJbixcclxuICAgICAgICAgICAgaXNBZG1pbjogaXNBZG1pbixcclxuICAgICAgICAgICAgaGFzUGVybWlzc2lvbjogaGFzUGVybWlzc2lvblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKipcclxuICAgICAgICAqIFVuY29tbWVudCB0aGUgZm9sbG93aW5nIHdoZW4gYmVhcmVyIHRva2VucyBhcmVcclxuICAgICAgICAqIGltcGxlbWVudGVkLlxyXG4gICAgICAgICoqL1xyXG4gICAgICAgIC8vaWYoJGNvb2tpZXMuZ2V0KFwidG9rZW5cIikgJiYgJGxvY2F0aW9uLnBhdGgoKSAhPT0gJy9sb2dvdXQnKSB7XHJcbiAgICAgICAgLy9nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgIC8vfVxyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogUmVtb3ZlcyBhbGwgdG9rZW5zIGFuZCByZXNldHMgdGhlIGN1cnJlbnQgdXNlci5cclxuICAgICAgICAqXHJcbiAgICAgICAgKiBOb3RlLCBiZWNhdXNlIHRoaXMgaXMgQUQgYmFzZWQsIHdlIHdpbGwgbm90IGFjdHVhbGx5IGJlIGxvZ2dpbmdcclxuICAgICAgICAqIG91dCwgd2hlbiBiZWFyZXIgdG9rZW5zIGFyZSBhZGRlZCB0aGlzIHdpbGwgb2NjdXIgdG8gcmVtb3ZlXHJcbiAgICAgICAgKiB0aGUgdG9rZW4gZnJvbSB0aGVpciBjb29raWUgcmVwcmVzZW50YXRpb24uXHJcbiAgICAgICAgKiovXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgICAgICAgICAvLyRjb29raWVzLnJlbW92ZSgndG9rZW4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogUmV0cmlldmVzIHRoZSBjdXJyZW50IHVzZXIgZnJvbSBjYWNoZSB3aGVuXHJcbiAgICAgICAgKiB0aGUgdXNlciBoYXMgYmVlbiBjYWNoZWQsIG90aGVyd2lzZSByZXRyaWV2ZXNcclxuICAgICAgICAqIHRoZSBjdXJyZW50IHVzZXIgZnJvbSB0aGUgVXNlclNlcnZpY2UgYW5kIGFkZHNcclxuICAgICAgICAqIGl0IHRvIHRoZSBjYWNoZS5cclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSB1c2VyXHJcbiAgICAgICAgKiovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0Q3VycmVudFVzZXIoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1c2VyU2VydmljZS5nZXRVc2VyQnlVc2VybmFtZSgnbWUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogUHJvdmlkZXMgYSB2YWx1ZSB3aGljaCBpbmRpY2F0ZXMgd2hldGhlciBvciBub3RcclxuICAgICAgICAqIHRoZSB1c2VyIGlzIGN1cnJlbnRseSBsb2dnZWQgaW4uXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHJldHVybnMge0Jvb2xlYW59IHRydWUgaWYgbG9nZ2VkIGluXHJcbiAgICAgICAgKiovXHJcbiAgICAgICAgZnVuY3Rpb24gaXNMb2dnZWRJbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldEN1cnJlbnRVc2VyKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVzZXIgJiYgdXNlci5oYXNPd25Qcm9wZXJ0eSgnVXNlcm5hbWUnKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBQcm92aWRlcyBhIHZhbHVlIHdoaWNoIGluZGljYXRlcyB3aGV0aGVyIG9yIG5vdFxyXG4gICAgICAgICogdGhlIHVzZXIgaXMgYW4gYXBwbGljYXRpb24gYWRtaW5pc3RyYXRvci5cclxuICAgICAgICAqXHJcbiAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gdHJ1ZSBpZiBhZG1pblxyXG4gICAgICAgICoqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGlzQWRtaW4oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRDdXJyZW50VXNlcigpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1c2VyICYmIHVzZXIuSXNBcHBBZG1pbjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0cyB0aGUgZmlyc3QgcGVybWlzc2lvbiBpbiB0aGUgbGlzdCB0aGF0IG1hdGNoZXMgdGhlIHBlcm1pc3Npb24gbmFtZS5cclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBwZXJtaXNzaW9ucyAtIGxpc3Qgb2YgcGVybWlzc2lvbnMgdG8gc2VhcmNoXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbn0gcGVybWlzc2lvblRvRmluZCAtIHNlYXJjaCBjcml0ZXJpYSwgcGVybWlzc2lvbiBuYW1lXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0UGVybWlzc2lvbihwZXJtaXNzaW9ucywgcGVybWlzc2lvblRvRmluZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMuZmluZChmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHAubmFtZS50b0xvd2VyQ2FzZSgpID09PSBwZXJtaXNzaW9uVG9GaW5kLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGV0ZXJtaW5lcyBpZiB0aGUgY3VycmVudCB1c2VyIGhhcyBhIHNwZWNpZmljIHBlcm1pc3Npb24gYW5kIHByaXZpbGVnZSBpbiBhbnkgb2YgdGhlIHVzZXIncyByb2xlcy5cclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGVybWlzc2lvbiAtIG5hbWUgb2YgcGVybWlzc2lvblxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcml2aWxlZ2UgLSBuYW1lIG9mIHByaXZpbGVnZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtQcm9taXNlfSByZXNvbHZlZCB0byB0cnVlIG9yIGZhbHNlIFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGhhc1Blcm1pc3Npb24ocGVybWlzc2lvbiwgcHJpdmlsZWdlKSB7XHJcbiAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIGdldEN1cnJlbnRVc2VyKClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGFsbCB1c2VyIHJvbGVzLlxyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb2xlcyA9IGRhdGEuQXBwUm9sZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByb2xlcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiByb2xlcyAhPT0gbnVsbCAmJiByb2xlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEdldCBhbGwgcGVybWlzc2lvbnMgZnJvbSB0aG9zZSByb2xlIHdpdGggdGhlIG5hbWUgcHJvdmlkZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBtYXRjaGVkUGVybWlzc2lvbnMgPSByb2xlcy5tYXAoZnVuY3Rpb24gKHJvbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRQZXJtaXNzaW9uKHJvbGUucGVybWlzc2lvbnMsIHBlcm1pc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZvciB0aGUgcGVybWlzc2lvbnMgdGhhdCB3ZSBmb3VuZCwgZmluZCB0aGUgZmlyc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb25lIHRoYXQgaGFzIHRoZSBwcml2aWxlZ2UgbGV2ZWwgd2UncmUgbG9va2luZyBmb3IuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc0FjY2VzcyA9IG1hdGNoZWRQZXJtaXNzaW9ucy5maW5kKGZ1bmN0aW9uIChwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcC5wcml2aWxlZ2UudG9Mb3dlckNhc2UoKSA9PT0gcHJpdmlsZWdlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pICE9PSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShoYXNBY2Nlc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdhdXRoU2VydmljZU9sZCcsIGF1dGhTZXJ2aWNlKTtcclxuXHJcbiAgICBhdXRoU2VydmljZS4kaW5qZWN0ID0gWyckcScsICd1c2VyU2VydmljZSddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGF0YSBzZXJ2aWNlIGZvciBhdXRoZW50aWNhdGlvbiBhbmQgYXV0aG9yaXphdGlvbi5cclxuICAgICAqIEBwYXJhbSB7JHF9ICRxXHJcbiAgICAgKiBAcGFyYW0ge2ZhY3Rvcnl9IHVzZXJTZXJ2aWNlXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhdXRoU2VydmljZSgkcSwgdXNlclNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgbG9nb3V0OiBsb2dvdXQsXHJcbiAgICAgICAgICAgIGdldEN1cnJlbnRVc2VyOiBnZXRDdXJyZW50VXNlcixcclxuICAgICAgICAgICAgaXNMb2dnZWRJbjogaXNMb2dnZWRJbixcclxuICAgICAgICAgICAgaXNBZG1pbjogaXNBZG1pbixcclxuXHJcbiAgICAgICAgICAgIGdldFJvbGVzOiBnZXRSb2xlcyxcclxuICAgICAgICAgICAgZ2V0Um9sZTogZ2V0Um9sZSxcclxuICAgICAgICAgICAgaGFzQXBwUm9sZXM6IGhhc0FwcFJvbGVzLFxyXG4gICAgICAgICAgICBoYXNSb2xlczogaGFzUm9sZXMsXHJcbiAgICAgICAgICAgIGhhc1JvbGU6IGhhc1JvbGUsXHJcbiAgICAgICAgICAgIGhhc1Blcm1pc3Npb246IGhhc1Blcm1pc3Npb25cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKioqXHJcbiAgICAgICAgKiBVbmNvbW1lbnQgdGhlIGZvbGxvd2luZyB3aGVuIGJlYXJlciB0b2tlbnMgYXJlXHJcbiAgICAgICAgKiBpbXBsZW1lbnRlZC5cclxuICAgICAgICAqKi9cclxuICAgICAgICAvL2lmKCRjb29raWVzLmdldChcInRva2VuXCIpICYmICRsb2NhdGlvbi5wYXRoKCkgIT09ICcvbG9nb3V0Jykge1xyXG4gICAgICAgIC8vZ2V0Q3VycmVudFVzZXIoKTtcclxuICAgICAgICAvL31cclxuXHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFJlbW92ZXMgYWxsIHRva2VucyBhbmQgcmVzZXRzIHRoZSBjdXJyZW50IHVzZXIuXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogTm90ZSwgYmVjYXVzZSB0aGlzIGlzIEFEIGJhc2VkLCB3ZSB3aWxsIG5vdCBhY3R1YWxseSBiZSBsb2dnaW5nXHJcbiAgICAgICAgKiBvdXQsIHdoZW4gYmVhcmVyIHRva2VucyBhcmUgYWRkZWQgdGhpcyB3aWxsIG9jY3VyIHRvIHJlbW92ZVxyXG4gICAgICAgICogdGhlIHRva2VuIGZyb20gdGhlaXIgY29va2llIHJlcHJlc2VudGF0aW9uLlxyXG4gICAgICAgICoqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcclxuICAgICAgICAgICAgLy8kY29va2llcy5yZW1vdmUoJ3Rva2VuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFJldHJpZXZlcyB0aGUgY3VycmVudCB1c2VyIGZyb20gY2FjaGUgd2hlblxyXG4gICAgICAgICogdGhlIHVzZXIgaGFzIGJlZW4gY2FjaGVkLCBvdGhlcndpc2UgcmV0cmlldmVzXHJcbiAgICAgICAgKiB0aGUgY3VycmVudCB1c2VyIGZyb20gdGhlIFVzZXJTZXJ2aWNlIGFuZCBhZGRzXHJcbiAgICAgICAgKiBpdCB0byB0aGUgY2FjaGUuXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHJldHVybnMge09iamVjdH0gdXNlclxyXG4gICAgICAgICoqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldEN1cnJlbnRVc2VyKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdXNlclNlcnZpY2UuZ2V0VXNlckJ5VXNlcm5hbWUoJ21lJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIFByb3ZpZGVzIGEgdmFsdWUgd2hpY2ggaW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90XHJcbiAgICAgICAgKiB0aGUgdXNlciBpcyBjdXJyZW50bHkgbG9nZ2VkIGluLlxyXG4gICAgICAgICpcclxuICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufSB0cnVlIGlmIGxvZ2dlZCBpblxyXG4gICAgICAgICoqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGlzTG9nZ2VkSW4oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRDdXJyZW50VXNlcigpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1c2VyICYmIHVzZXIuaGFzT3duUHJvcGVydHkoJ1VzZXJuYW1lJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogUHJvdmlkZXMgYSB2YWx1ZSB3aGljaCBpbmRpY2F0ZXMgd2hldGhlciBvciBub3RcclxuICAgICAgICAqIHRoZSB1c2VyIGlzIGFuIGFwcGxpY2F0aW9uIGFkbWluaXN0cmF0b3IuXHJcbiAgICAgICAgKlxyXG4gICAgICAgICogQHJldHVybnMge0Jvb2xlYW59IHRydWUgaWYgYWRtaW5cclxuICAgICAgICAqKi9cclxuICAgICAgICBmdW5jdGlvbiBpc0FkbWluKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2V0Q3VycmVudFVzZXIoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdXNlciAmJiB1c2VyLklzQXBwQWRtaW47XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogR2V0cyB0aGUgY3VycmVudCB1c2VyIHNwZWNpZmllZCBzZXQgb2Ygcm9sZXNcclxuICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IHJvbGVTZXRcclxuICAgICAgICAqIEByZXR1cm5zIHtBcnJheX1cclxuICAgICAgICAqKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRSb2xlcyhyb2xlU2V0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRDdXJyZW50VXNlcigpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodXNlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1c2VyICYmIHVzZXJbcm9sZVNldCArICdSb2xlcyddO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEdldHMgdGhlIGN1cnJlbnQgdXNlciBzcGVjaWZpZWQgcm9sZSBmcm9tIGEgc3BlY2lmaWVkIHNldCBvZiByb2xlc1xyXG4gICAgICAgICogQHBhcmFtIHtBcnJheX0gcm9sZVNldFxyXG4gICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHJvbGVcclxuICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICAgICAgKiovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0Um9sZShyb2xlU2V0LCByb2xlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRSb2xlcyhyb2xlU2V0KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJvbGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvbGVzICYmIHJvbGVzW3JvbGVdO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIENoZWNrcyBpZiB0aGUgY3VycmVudCB1c2VyIGhhcyB0aGUgc3BlY2lmaWVkIHNldCBvZiByb2xlc1xyXG4gICAgICAgICogQHBhcmFtIHtBcnJheX0gcm9sZVNldFxyXG4gICAgICAgICogQHJldHVybnMge0FycmF5fVxyXG4gICAgICAgICoqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGhhc1JvbGVzKHJvbGVTZXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldFJvbGVzKHJvbGVTZXQpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocm9sZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm9sZXMgJiYgT2JqZWN0LmtleXMocm9sZXMpLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogQ2hlY2tzIGlmIHRoZSBjdXJyZW50IHVzZXIgaGFzIGFwcCByb2xlc1xyXG4gICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XHJcbiAgICAgICAgKiovXHJcbiAgICAgICAgZnVuY3Rpb24gaGFzQXBwUm9sZXMoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRSb2xlcygnQXBwJylcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyb2xlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByb2xlcyAhPT0gbnVsbCAmJiBPYmplY3Qua2V5cyhyb2xlcykubGVuZ3RoID4gMDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBDaGVja3MgaWYgdGhlIGN1cnJlbnQgdXNlciBoYXMgdGhlIHNwZWNpZmllZCByb2xlIG9uIGEgc3BlY2lmaWVkIHNldCBvZiByb2xlc1xyXG4gICAgICAgICogQHBhcmFtIHtBcnJheX0gcm9sZVNldFxyXG4gICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHJvbGVuYW1lXHJcbiAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICAgICAgICAqKi9cclxuICAgICAgICBmdW5jdGlvbiBoYXNSb2xlKHJvbGVTZXQsIHJvbGVuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRSb2xlKHJvbGVTZXQsIHJvbGVuYW1lKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJvbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISFyb2xlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIERldGVybWluaWVzIHdoZXRoZXIgb3Igbm90IHRoZSBzcGVjaWZpZWQgcm9sZVxyXG4gICAgICAgICogb24gYSBzcGVjaWZpZWQgc2V0IGNvbnRhaW5zIHRoZSBzcGVjaWZpZWQgcGVybWlzc2lvblxyXG4gICAgICAgICogQHBhcmFtIHtBcnJheX0gcm9sZVNldFxyXG4gICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHJvbGVOYW1lXHJcbiAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gcGVybWlzc2lvblxyXG4gICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XHJcbiAgICAgICAgKiovXHJcbiAgICAgICAgZnVuY3Rpb24gaGFzUGVybWlzc2lvbihyb2xlU2V0LCByb2xlTmFtZSwgcGVybWlzc2lvbikge1xyXG4gICAgICAgICAgICBpZiAoIWFuZ3VsYXIuaXNTdHJpbmcocGVybWlzc2lvbikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbihmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICBnZXRSb2xlKHJvbGVTZXQsIHJvbGVOYW1lKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJvbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJvbGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChwZXJtaXNzaW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ0NyZWF0ZSc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm9sZS5DYW5DcmVhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ1JlYWQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvbGUuQ2FuUmVhZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnRWRpdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm9sZS5DYW5FZGl0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdTdWJtaXQnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvbGUuQ2FuU3VibWl0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdEZWxldGUnOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvbGUuQ2FuRGVsZXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdGdWxsJzpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByb2xlLkNhbkNyZWF0ZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2xlLkNhblJlYWQgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZS5DYW5FZGl0ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGUuQ2FuU3VibWl0ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvbGUuQ2FuRGVsZXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAudGVhbScpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1RlYW1Db250cm9sbGVyJywgVGVhbUNvbnRyb2xsZXIpO1xyXG5cclxuICAgIFRlYW1Db250cm9sbGVyLiRpbmplY3QgPSBbJ3RlYW1EYXRhU2VydmljZScsICckbG9nJywgJyRsb2NhdGlvbicsICckcm91dGVQYXJhbXMnLCAnJHEnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnRyb2xsZXIgcmVzcG9uc2libGUgZm9yIGFsbCBDUlVEIGFjdGlvbnMgc3Vycm91bmRpbmcgYSB0ZWFtLlxyXG4gICAgICogQHBhcmFtIHtmYWN0b3J5fSB0ZWFtRGF0YVNlcnZpY2VcclxuICAgICAqIEBwYXJhbSB7JGxvZ30gJGxvZ1xyXG4gICAgICogQHBhcmFtIHskbG9jYXRpb259ICRsb2NhdGlvblxyXG4gICAgICogQHBhcmFtIHskcm91dGVQYXJhbXN9ICRyb3V0ZVBhcmFtc1xyXG4gICAgICogQHBhcmFtIHskcX0gJHFcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gVGVhbUNvbnRyb2xsZXIodGVhbURhdGFTZXJ2aWNlLCAkbG9nLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgJHEpIHtcclxuICAgICAgICAvKiBqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBFeGlzdGluZyB0ZWFtcyB0byBzZWxlY3QuXHJcbiAgICAgICAgdm0udGVhbXMgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gVGVhbSBvYmplY3Qgd2UncmUgY3JlYXRpbmcuXHJcbiAgICAgICAgdm0udGVhbSA9IHtcclxuICAgICAgICAgICAgaWQ6IDAsXHJcbiAgICAgICAgICAgIG5hbWU6IG51bGwsXHJcbiAgICAgICAgICAgIGluZm86IG51bGxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBBc3Nlc3NtZW50IHRoaXMgdGVhbSBpcyB0aWVkIHRvLlxyXG4gICAgICAgIHZtLmFzc2Vzc21lbnRJZCA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vIE1lc3NhZ2UgdG8gZGlzcGxheSB0byB0aGUgdXNlciByZWdhcmRpbmcgdGhlaXIgaW5wdXRzLlxyXG4gICAgICAgIC8vIGllLiBWYWxpZGF0aW9uIG1lc3NhZ2VzLCBzYXZlZCBtZXNzYWdlLCBlcnJvciBtZXNzYWdlLCBldGMuXHJcbiAgICAgICAgdm0ubWVzc2FnZSA9IG51bGw7XHJcbiAgICAgICAgdm0ud2FybmluZyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vIExvYWRpbmcgaW5kaWNhdG9yIHdoZW4gc2VhcmNoaW5nIHRlYW1zLlxyXG4gICAgICAgIHZtLmlzTG9hZGluZ1RlYW1zID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vIE1ldGhvZHMgZm9yIGVkaXRpbmcgdGhlIHRlYW0gZm9ybS5cclxuICAgICAgICB2bS5zYXZlVGVhbSA9IHNhdmVUZWFtO1xyXG4gICAgICAgIHZtLnNlbGVjdFRlYW0gPSBzZWxlY3RUZWFtO1xyXG4gICAgICAgIHZtLmVkaXRUZWFtUHJvcGVydHkgPSBlZGl0VGVhbVByb3BlcnR5O1xyXG4gICAgICAgIHZtLnZhbGlkYXRlVGVhbU5hbWUgPSB2YWxpZGF0ZVRlYW1OYW1lO1xyXG5cclxuICAgICAgICAvLyBDYW5jZWwgdGhpcyBhY3Rpb24uXHJcbiAgICAgICAgdm0uY2FuY2VsID0gY2FuY2VsO1xyXG5cclxuICAgICAgICAvLyBTZWFyY2ggZXhpc3RpbmcgdGVhbXMuXHJcbiAgICAgICAgdm0uc2VhcmNoID0gc2VhcmNoQnlOYW1lO1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQYWdlIGxvYWQgYWN0aW9ucy4gR2V0IHRoZSByb3V0ZSBwYXJhbXMgdG8gZGV0ZXJtaW5lIGlmIHdlJ3JlXHJcbiAgICAgICAgICogY3JlYXRpbmcgb3IgZWRpdHRpbmcuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgICAgICAgICAgIHZtLnRlYW0uaWQgPSArJHJvdXRlUGFyYW1zLnRlYW1JZCB8fCAwO1xyXG4gICAgICAgICAgICB2bS5hc3Nlc3NtZW50SWQgPSArJHJvdXRlUGFyYW1zLmFzc2Vzc21lbnRJZDtcclxuICAgICAgICAgICAgaWYgKHZtLnRlYW0uaWQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBnZXRUZWFtKHZtLnRlYW0uaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXRzIHRoZSBkZXRhaWxzIGZvciB0aGUgdGVhbSBiYXNlZCBvbiB0aGUgcm91dGUgaWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VGVhbSgpIHtcclxuICAgICAgICAgICAgdGVhbURhdGFTZXJ2aWNlLmdldFRlYW0odm0udGVhbS5pZClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0udGVhbSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVwZGF0ZXMgb3IgY3JlYXRlcyB0aGUgdGVhbSBkZXRhaWxzLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmVUZWFtKCkge1xyXG4gICAgICAgICAgICB2bS5mb3JtLnN1Ym1pdHRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodm0uZm9ybS4kaW52YWxpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBVcGRhdGUgb3IgY3JlYXRlIG5ldyB0ZWFtLlxyXG4gICAgICAgICAgICB2YXIgcmVxO1xyXG4gICAgICAgICAgICBpZiAodm0udGVhbS5pZCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHJlcSA9IHVwZGF0ZVRlYW0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlcSA9IGNyZWF0ZVRlYW0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXFcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgZGF0YS5pZCAmJiBkYXRhLmlkICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9nLmRlYnVnKFwiVGVhbSBjcmVhdGVkIHdpdGggaWQ6IFwiICsgZGF0YS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVkaXJlY3QgdG8gdGhlIFN0YXJ0IEFzc2Vzc21lbnQgcGFnZSBhdXRvbWF0aWNhbGx5IGFmdGVyIHN1Y2Nlc3NmdWwgc2F2ZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IHdoZW4gd2UgYWxsb3cgZm9yIGFkZGluZyBvZiB0ZWFtcy9wcm9qZWN0L2FwcHMgZnJvbSBzZXBhcmF0ZSBwYWdlLCBuZWVkIHRvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIHRoaXMgYSBkeW5hbWljIGFjdGlvbi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvYXNzZXNzbWVudHMvJyArIHZtLmFzc2Vzc21lbnRJZCArICcvdGVhbS8nICsgZGF0YS5pZCArICcvZWRpdCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSAnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgdHJ5aW5nIHRvIHNhdmUgeW91ciB0ZWFtLiBQbGVhc2UgdHJ5IGFnYWluLic7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSAnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgdHJ5aW5nIHRvIHNhdmUgeW91ciB0ZWFtOiAnICsgZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIHRyeWluZyB0byBzYXZlIHlvdXIgdGVhbS4gUGxlYXNlIHRyeSBhZ2Fpbi4nO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlcyBhIG5ldyB0ZWFtLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVRlYW0oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZWFtRGF0YVNlcnZpY2UuY3JlYXRlVGVhbSh2bS50ZWFtKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVwZGF0ZXMgYW4gZXhpc3RpbmcgdGVhbS5cclxuICAgICAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVUZWFtKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGVhbURhdGFTZXJ2aWNlLnVwZGF0ZVRlYW0odm0udGVhbSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYW5jZWwgYWN0aW9ucyBmb3IgdGhlIGZvcm0uXHJcbiAgICAgICAgICogUmV0dXJucyB0byB0aGUgYXNzZXNzbWVudHMgcGFnZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBjYW5jZWwoKSB7XHJcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvYXNzZXNzbWVudHMnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNlYXJjaGVzIGV4aXN0aW5nIHRlYW1zIGJ5IG5hbWUuIFNldHMgdGVhbXMgbGlzdC5cclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHNlYXJjaEJ5TmFtZShuYW1lKSB7XHJcbiAgICAgICAgICAgIC8vIFRPRE86IHJ1biBsb2FkIHRlc3RzIHRvIGRldGVybWluZSBpZiBpdCdzIG1vcmUgYXBwcm9wcmlhdGUgdG8gZ2V0IGxpc3RcclxuICAgICAgICAgICAgLy8gb2YgYWxsIHRlYW1zIGFuZCBqdXN0IHNlYXJjaCBpbiBqYXZhc2NyaXB0LlxyXG4gICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09ICd1bmRlZmluZWQnICYmIG5hbWUgIT09IG51bGwgJiYgbmFtZS50cmltKCkgIT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5pc0xvYWRpbmdUZWFtcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0ZWFtRGF0YVNlcnZpY2Uuc2VhcmNoVGVhbXNCeU5hbWUobmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGRhdGEgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS50ZWFtcyA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdm0udGVhbXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoW10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmlzTG9hZGluZ1RlYW1zID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3IgIT09ICd1bmRlZmluZWQnICYmIGVycm9yICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2bS5tZXNzYWdlID0gJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIHNlYXJjaGluZyBmb3IgdGVhbXMuICcgKyBlcnJvcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLm1lc3NhZ2UgPSAnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgc2VhcmNoaW5nIGZvciB0ZWFtcy4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmlzTG9hZGluZ1RlYW1zID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCh2bS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNlbGVjdCBhbiBleGlzdGluZyB0ZWFtIGZyb20gdGhlIGRyb3Bkb3duLlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0ZWFtXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2VsZWN0VGVhbSh0ZWFtKSB7XHJcbiAgICAgICAgICAgIC8vIFNldCB0aGUgdGVhbSBvYmplY3Qgc28gdGhhdCB3ZSByZXRhaW4gdGhlIGlkIGFuZCBpbmZvLlxyXG4gICAgICAgICAgICB2bS50ZWFtID0gdGVhbTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlc2V0IG91ciB3YXJuaW5nIHVwb24gc2VsZWN0aW5nIGEgbmV3IHRlYW0uXHJcbiAgICAgICAgICAgIHZtLndhcm5pbmcgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV2hlbiB0aGUgbmFtZSBvciBpbmZvIGlzIGNoYW5nZWQgZm9yIGEgdGVhbSwgZGlzcGxheSBhIHdhcm5pbmcgaWZcclxuICAgICAgICAgKiB0aGUgdXNlciBpcyBlZGl0aW5nIGFuIGV4aXN0aW5nIHRlYW0uXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRlYW1Qcm9wZXJ0eSAtIHRoZSBuYW1lIG9yIGluZm8gZm9yIGEgdGVhbVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGVkaXRUZWFtUHJvcGVydHkodGVhbVByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIC8vIFNob3cgd2FybmluZyB0aGF0IHVzZXIgaXMgZWRpdGluZyBleGlzdGluZyB0ZWFtLlxyXG4gICAgICAgICAgICBpZiAodm0udGVhbS5pZCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHZtLndhcm5pbmcgPSAnWW91IGFyZSBlZGl0aW5nIGRhdGEgZm9yIGFuIGV4aXN0aW5nIHRlYW0vcHJvamVjdC9hcHBsaWNhdGlvbi4gVGhlc2UgY2hhbmdlcyB3aWxsIGFwcGx5IHRvIGFsbCBhc3Nlc3NtZW50cyBhbmQgcGxheWJvb2tzIHRoYXQgZXhpc3QgZm9yIHRoaXMgaXRlbS4nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXRzIHRoZSB2YWxpZGl0eSBmb3IgdGhlIHRlYW0gbmFtZSBmaWVsZCBiYXNlZCBvbiByZXF1aXJlZCBhdHRyaWJ1dGVzLlxyXG4gICAgICAgICAqIFJlcXVpcmVkIHRvIHVzZSBpbnN0ZWFkIG9mIGJ1aWx0LWluIHJlcXVpcmVkIGF0dHJpYnV0ZSBiZWNhdXNlIG9mIHRoZSBhdXRvY29tcGxldGUgZm9ybS5cclxuICAgICAgICAgKiBAcGFyYW0ge3R5cGV9IG5hbWVcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiB2YWxpZGF0ZVRlYW1OYW1lKG5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSAndW5kZWZpbmVkJyB8fCBuYW1lID09PSBudWxsIHx8IG5hbWUudHJpbSgpID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgdm0uZm9ybS5uYW1lLiRzZXRWYWxpZGl0eSgncmVxdWlyZWQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnRlYW0nKVxyXG4gICAgICAgIC5mYWN0b3J5KCd0ZWFtRGF0YVNlcnZpY2UnLCB0ZWFtRGF0YVNlcnZpY2UpO1xyXG5cclxuICAgIHRlYW1EYXRhU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCcsICckbG9nJywgJyRxJywgJ2NvbmZpZ3MnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFNlcnZpY2UgdXNlZCB0byBnZXQgZGF0YSBmcm9tIHRoZSBzZXJ2ZXIgZm9yIFRlYW1zLlxyXG4gICAgICogQHBhcmFtIHskaHR0cH0gJGh0dHBcclxuICAgICAqIEBwYXJhbSB7JGxvZ30gJGxvZ1xyXG4gICAgICogQHBhcmFtIHskcX0gJHFcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdzXHJcbiAgICAgKiBAcmV0dXJucyB7dHlwZX1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdGVhbURhdGFTZXJ2aWNlKCRodHRwLCAkbG9nLCAkcSwgY29uZmlncykge1xyXG4gICAgICAgIHZhciBzZXJ2aWNlID0ge1xyXG4gICAgICAgICAgICBjcmVhdGVUZWFtOiBjcmVhdGVUZWFtLFxyXG4gICAgICAgICAgICB1cGRhdGVUZWFtOiB1cGRhdGVUZWFtLFxyXG4gICAgICAgICAgICBnZXRUZWFtOiBnZXRUZWFtLFxyXG4gICAgICAgICAgICBnZXRUZWFtczogZ2V0VGVhbXMsXHJcbiAgICAgICAgICAgIHNlYXJjaFRlYW1zQnlOYW1lOiBzZWFyY2hUZWFtc0J5TmFtZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXRzIHRlYW0gZGV0YWlscyBmb3IgdGhlIHNwZWNpZmllZCB0ZWFtIGlkLlxyXG4gICAgICAgICAqIEBwYXJhbSB7aW50fSB0ZWFtSWRcclxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBUZWFtRFRPIGRldGFpbHNcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRUZWFtKHRlYW1JZCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGNvbmZpZ3MuYXBpVXJsICsgJ3RlYW1zLycgKyB0ZWFtSWRcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cChyZXF1ZXN0KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGdldFRlYW1Db21wbGV0ZSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZ2V0VGVhbUZhaWxlZCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU3VjZXNzIENhbGxiYWNrXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZVxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gZ2V0VGVhbUNvbXBsZXRlKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICogRmFpbHVyZSBDYWxsYmFja1xyXG4gICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlcnJvclxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRUZWFtRmFpbGVkKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IGVycm9yLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdYSFIgZmFpbGVkIGZvciBnZXRUZWFtLiAnICsgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgYWxsIHRlYW1zIGZvciB0aGUgY3VycmVudCB1c2VyLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtBcnJheX0gTGlzdCBvZiBUZWFtRFRPc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFRlYW1zKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGNvbmZpZ3MuYXBpVXJsICsgJ3RlYW1zJ1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZ2V0VGVhbXNDb21wbGV0ZSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZ2V0VGVhbXNGYWlsZWQpO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFN1Y2VzcyBDYWxsYmFja1xyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gcmVzcG9uc2VcclxuICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdH1cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFRlYW1zQ29tcGxldGUocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgKiBGYWlsdXJlIENhbGxiYWNrXHJcbiAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVycm9yXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFRlYW1zRmFpbGVkKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IGVycm9yLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdYSFIgZmFpbGVkIGZvciBnZXRUZWFtcy4gJyArIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBWYWxpZGF0ZXMgYW5kIGNyZWF0ZXMgYSBuZXcgdGVhbS5cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdGVhbVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9IGNyZWF0ZWQgVGVhbURUT1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVRlYW0odGVhbSkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBjb25maWdzLmFwaVVybCArICd0ZWFtcycsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB0ZWFtXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAoXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIHRlYW0ubmFtZSAmJiBcIlwiICE9PSB0ZWFtLm5hbWUudHJpbSgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAocmVxdWVzdClcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY3JlYXRlVGVhbUNvbXBsZXRlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goY3JlYXRlVGVhbUZhaWxlZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBTdWNlc3MgQ2FsbGJhY2tcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZVxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge09iamVjdH1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlVGVhbUNvbXBsZXRlKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBGYWlsdXJlIENhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXJyb3JcclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9ICByZWplY3RzIHByb21pc2Ugd2l0aCBhbiBlcnJvciBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZVRlYW1GYWlsZWQoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBlcnJvci5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnJvci5kYXRhICE9PSBudWxsICYmIFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBlcnJvci5kYXRhLk1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBlcnJvci5kYXRhLk1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gZXJyb3IuZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAkbG9nLmVycm9yKCdYSFIgZmFpbGVkIGZvciBjcmVhdGVUZWFtLiAnICsgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdChtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRsb2cuaW5mbygnVmFsaWRhdGlvbiBmYWlsZWQgZm9yIHRlYW0gb2JqZWN0IGR1cmluZyBjcmVhdGVUZWFtLicpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGVycm9yID0gXCJUaGUgdGVhbSBuYW1lIGlzIHJlcXVpcmVkXCI7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVXBkYXRlcyBhbiBleGlzdGluZyB0ZWFtXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHRlYW1cclxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBVcGRhdGVkIFRlYW1EVE9cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVUZWFtKHRlYW0pIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBjb25maWdzLmFwaVVybCArICd0ZWFtcy8nICsgdGVhbS5pZCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IHRlYW1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgdGVhbS5uYW1lICYmIFwiXCIgIT09IHRlYW0ubmFtZS50cmltKCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cChyZXF1ZXN0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbih1cGRhdGVUZWFtQ29tcGxldGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCh1cGRhdGVUZWFtRmFpbGVkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIFN1Y2VzcyBDYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHJlc3BvbnNlXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVUZWFtQ29tcGxldGUocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEZhaWx1cmUgQ2FsbGJhY2tcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlcnJvclxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge1N0cmluZ30gIHJlamVjdHMgcHJvbWlzZSB3aXRoIGFuIGVycm9yIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlVGVhbUZhaWxlZChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIGVycm9yLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yLmRhdGEgIT09IG51bGwgJiYgXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIGVycm9yLmRhdGEuTWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGVycm9yLmRhdGEuTWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBlcnJvci5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ1hIUiBmYWlsZWQgZm9yIHVwZGF0ZVRlYW0uICcgKyBtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGxvZy5pbmZvKCdWYWxpZGF0aW9uIGZhaWxlZCBmb3IgdGVhbSBvYmplY3QgZHVyaW5nIHVwZGF0ZVRlYW0uJyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSBcIlRoZSB0ZWFtIG5hbWUgaXMgcmVxdWlyZWRcIjtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNYXRjaGVzIHRlYW0gbmFtZXMgYnkgdGhlIGlucHV0IHByb3ZpZGVkLlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXHJcbiAgICAgICAgICogQHJldHVybnMge0FycmF5fSBMaXN0IG9mIFRlYW1EVE9zXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2VhcmNoVGVhbXNCeU5hbWUobmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGNvbmZpZ3MuYXBpVXJsICsgJ3RlYW1zL3NlYXJjaC8/bmFtZT0nICsgbmFtZS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAocmVxdWVzdClcclxuICAgICAgICAgICAgICAgICAgICAudGhlbihzZWFyY2hUZWFtc0J5TmFtZUNvbXBsZXRlKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChzZWFyY2hUZWFtc0J5TmFtZUZhaWxlZCk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU3VjZXNzIENhbGxiYWNrXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZXNwb25zZVxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9IGxpc3Qgb2YgdGVhbXNcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNlYXJjaFRlYW1zQnlOYW1lQ29tcGxldGUocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgKiBGYWlsdXJlIENhbGxiYWNrXHJcbiAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVycm9yXHJcbiAgICAgICAgICAgICogQHJldHVybnMge1Byb21pc2V9IHJlamVjdGVkIHByb21pc2VcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2VhcmNoVGVhbXNCeU5hbWVGYWlsZWQoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlID0gZXJyb3IuZGF0YTtcclxuICAgICAgICAgICAgICAgICRsb2cuZXJyb3IoJ1hIUiBmYWlsZWQgZm9yIHNlYXJjaFRlYW1zQnlOYW1lLiAnICsgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmNvbnN0YW50KCdQaWthZGF5JywgUGlrYWRheSlcclxuICAgICAgICAuY29uc3RhbnQoJ3N2ZzRldmVyeWJvZHknLCBzdmc0ZXZlcnlib2R5KTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAudmlzdWFsaXphdGlvbnMnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BkUmFkYXJDaGFydCcsIFJhZGFyQ2hhcnREaXJlY3RpdmUpO1xyXG5cclxuICAgIFJhZGFyQ2hhcnREaXJlY3RpdmUuJGluamVjdCA9IFsnJGxvZycsICckd2luZG93J107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEaXJlY3RpdmUgdG8gYnVpbGQgYW5kIGRpc3BsYXkgYSBkMy5qcyByYWRhciBjaGFydC5cclxuICAgICAqIEBwYXJhbSB7dHlwZX0gJGxvZ1xyXG4gICAgICogQHBhcmFtIHt0eXBlfSAkd2luZG93XHJcbiAgICAgKiBAcmV0dXJucyB7dHlwZX1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gUmFkYXJDaGFydERpcmVjdGl2ZSgkbG9nLCAkd2luZG93KSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwL3Zpc3VhbGl6YXRpb25zL3JhZGFyLmNoYXJ0Lmh0bWwnLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgLy8gJ1NvbWUgdGl0bGUnXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0AnLFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGFycmF5IG9mIGFycmF5IG9mIG9iamVjdHM6IHsgYXhpczogJ215TmFtZScsIHZhbHVlOiA0NS4zIH0uIG9yZGVyIGFycmF5IHdpdGggbGVnZW5kIGl0ZW1zLlxyXG4gICAgICAgICAgICAgICAgZGF0YTogJz0nLFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIDMwMFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6ICdAJyxcclxuXHJcbiAgICAgICAgICAgICAgICAvLyAzMDBcclxuICAgICAgICAgICAgICAgIGhlaWdodDogJ0AnLFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFt7bmFtZTogJ2l0ZW0gMScsIGNsaWNrOiBmdW5jfSwge25hbWU6J2l0ZW0gMicsIGNsaWNrOiBmdW5jfV0gLy8gZnVuYyBpcyB0aGUgY2xpY2sgZXZlbnRcclxuICAgICAgICAgICAgICAgIGxlZ2VuZDogJz0nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExpbmsgZnVuY3Rpb24uXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNjb3BlXHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gZWxlbWVudFxyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IGF0dHJzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgLy8gQ2hhbmdlcyB0byBxdWVzdGlvbnMuIE1vc3RseSB1c2VkIGZvciBpbml0aWFsIGxvYWQuXHJcbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaENvbGxlY3Rpb24oXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIGRhdGEgaGFzIGNoYW5nZWQgb3Igd2UgbmVlZCB0byByZWNyZWF0ZSB0aGUgZ3JhcGgsIGRvIHNvLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gb2xkVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzY29wZS5kYXRhICE9PSBcInVuZGVmaW5lZFwiICYmIHNjb3BlLmRhdGEgIT09IG51bGwgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBzY29wZS5kYXRhWzBdICE9PSBcInVuZGVmaW5lZFwiICYmIHNjb3BlLmRhdGFbMF0ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlR3JhcGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIENsZWFyIG91dCB0aGUgZ3JhcGguXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3IoJyNncmFwaCcpLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5kYXRhID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hhbmdlcyB0byBzY3JlZW4gc2l6ZSByZWRyYXdzIHRoZSBjaGFydC5cclxuICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KCR3aW5kb3cpLmJpbmQoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2NvcGUuZGF0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgc2NvcGUuZGF0YSAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBzY29wZS5kYXRhWzBdICE9PSBcInVuZGVmaW5lZFwiICYmIHNjb3BlLmRhdGFbMF0ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZUdyYXBoKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hbnVhbCAkZGlnZXN0IHJlcXVpcmVkIGFzIHJlc2l6ZSBldmVudFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlzIG91dHNpZGUgb2YgYW5ndWxhclxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiRkaWdlc3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2cud2FybignUmFkYXIgY2hhcnQgZGF0YSBpcyB1bmRlZmluZWQuJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIENoYXJ0IENvbmZpZ3VyYXRpb25zLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBEZWZhdWx0IGNvbmZpZ3VyYXRpb246XHJcbiAgICAgICAgICAgICAgICB2YXIgY2ZnID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1czogNSxcclxuICAgICAgICAgICAgICAgICAgICB3OiA2MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgaDogNjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGZhY3RvcjogMSxcclxuICAgICAgICAgICAgICAgICAgICBmYWN0b3JMZWdlbmQ6IC44NSxcclxuICAgICAgICAgICAgICAgICAgICBsZXZlbHM6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgbWF4VmFsdWU6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgcmFkaWFuczogMiAqIE1hdGguUEksXHJcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eUFyZWE6IDAuNSxcclxuICAgICAgICAgICAgICAgICAgICBUb1JpZ2h0OiA1LFxyXG4gICAgICAgICAgICAgICAgICAgIFRyYW5zbGF0ZVg6IDgwLFxyXG4gICAgICAgICAgICAgICAgICAgIFRyYW5zbGF0ZVk6IDMwLFxyXG4gICAgICAgICAgICAgICAgICAgIEV4dHJhV2lkdGhYOiAxMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgRXh0cmFXaWR0aFk6IDEwMCxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogZDMuc2NhbGUuY2F0ZWdvcnkxMCgpXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGUgY29uZmlnIHNldHRpbmdzLlxyXG4gICAgICAgICAgICAvLyBBZGQgdG8gc2NvcGUgYXMgbmVjZXNzYXJ5LlxyXG4gICAgICAgICAgICB2YXIgbXlDZmcgPSB7XHJcbiAgICAgICAgICAgICAgICBsZXZlbHM6IDEwLFxyXG4gICAgICAgICAgICAgICAgbWF4VmFsdWU6IDEsXHJcbiAgICAgICAgICAgICAgICBFeHRyYVdpZHRoWDogMjAwLFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGV4dHJhIHdpZHRoIC8gMiBpIHRoaW5rLiBuZWVkIHRvIG1ha2UgcmVzcG9uc2l2ZS5cclxuICAgICAgICAgICAgICAgIFRyYW5zbGF0ZVg6ICgyMDApIC8gMlxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIENyZWF0ZSB0aGUgZ3JhcGggZnJvbSBvdXIgY29uZmlndXJhdGlvbi5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZUdyYXBoKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gU2V0IG91ciBoZWlnaHQgYW5kIHdpZHRoIGFmdGVyIHdlIGxvYWQuXHJcbiAgICAgICAgICAgICAgICB2YXIgd2luZG93V2lkdGggPSBlbGVtZW50WzBdLmNsaWVudFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvd1dpZHRoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh3aW5kb3dXaWR0aCAtIG15Q2ZnLkV4dHJhV2lkdGhYIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG15Q2ZnLncgPSB3aW5kb3dXaWR0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHdpbmRvd1dpZHRoIC0gbXlDZmcuRXh0cmFXaWR0aFkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbXlDZmcuaCA9IHdpbmRvd1dpZHRoO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbXlDZmcudyA9IGVsZW1lbnRbMF0uY2xpZW50V2lkdGggLSBteUNmZy5FeHRyYVdpZHRoWDtcclxuICAgICAgICAgICAgICAgICAgICBteUNmZy5oID0gZWxlbWVudFswXS5jbGllbnRXaWR0aCAtIG15Q2ZnLkV4dHJhV2lkdGhYO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIENyZWF0IHRoZSBjaGFydC5cclxuICAgICAgICAgICAgICAgIFJhZGFyQ2hhcnQuZHJhdyhcIiNncmFwaFwiLCBzY29wZS5kYXRhLCBteUNmZyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTZXR1cCBvdXIgY2xpY2sgZXZlbnRzLlxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzY29wZS5sZWdlbmQgIT09IFwidW5kZWZpbmVkXCIgJiYgc2NvcGUubGVnZW5kICE9PSBudWxsICYmIHNjb3BlLmxlZ2VuZC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGFsbCBsZWdlbmQgdGV4dCBlbGVtZW50cy5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGVnZW5kSXRlbXMgPSBlbGVtZW50WzBdLnF1ZXJ5U2VsZWN0b3JBbGwoXCJ0ZXh0LmxlZ2VuZFwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0l0ZW07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvciBlYWNoIGxlZ2VuZCBpdGVtIGZvdW5kIHdpdGggbWF0Y2hpbmcgdGV4dCwgc2V0IHVwIG91ciBjbGljayBiaW5kLlxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChzY29wZS5sZWdlbmQsIGZ1bmN0aW9uIChsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNJdGVtID0gWy4uLmxlZ2VuZEl0ZW1zXS5maWx0ZXIoZSA9PiBlLnRleHRDb250ZW50ID09PSBsLm5hbWUgfHwgZS50ZXh0Q29udGVudCA9PT0gbC5uYW1lICsgJyAoTkEpJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCh0aGlzSXRlbSwgZnVuY3Rpb24gKGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZWxlbWVudChpKS5iaW5kKCdjbGljaycsIGwuY2xpY2spO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIvKlxyXG4gKiBUYWtlbiBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL25icmVtZXIvNjUwNjYxNFxyXG4gKiBMaWNlbnNlOiBNSVRcclxuICogRDMuanNcclxuICogRWRpdHRlZCBieSBYT00gZm9yIEQzLmpzIHY0XHJcbiAqL1xyXG5cclxuLy9QcmFjdGljYWxseSBhbGwgdGhpcyBjb2RlIGNvbWVzIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2FsYW5ncmFmdS9yYWRhci1jaGFydC1kM1xyXG4vL0kgb25seSBtYWRlIHNvbWUgYWRkaXRpb25zIGFuZCBhZXN0aGV0aWMgYWRqdXN0bWVudHMgdG8gbWFrZSB0aGUgY2hhcnQgbG9vayBiZXR0ZXJcclxuLy8ob2YgY291cnNlLCB0aGF0IGlzIG9ubHkgbXkgcG9pbnQgb2YgdmlldylcclxuLy9TdWNoIGFzIGEgYmV0dGVyIHBsYWNlbWVudCBvZiB0aGUgdGl0bGVzIGF0IGVhY2ggbGluZSBlbmQsXHJcbi8vYWRkaW5nIG51bWJlcnMgdGhhdCByZWZsZWN0IHdoYXQgZWFjaCBjaXJjdWxhciBsZXZlbCBzdGFuZHMgZm9yXHJcbi8vTm90IHBsYWNpbmcgdGhlIGxhc3QgbGV2ZWwgYW5kIHNsaWdodCBkaWZmZXJlbmNlcyBpbiBjb2xvclxyXG4vL1xyXG4vL0ZvciBhIGJpdCBvZiBleHRyYSBpbmZvcm1hdGlvbiBjaGVjayB0aGUgYmxvZyBhYm91dCBpdDpcclxuLy9odHRwOi8vbmJyZW1lci5ibG9nc3BvdC5ubC8yMDEzLzA5L21ha2luZy1kMy1yYWRhci1jaGFydC1sb29rLWJpdC1iZXR0ZXIuaHRtbFxyXG5cclxudmFyIFJhZGFyQ2hhcnQgPSB7XHJcbiAgICBkcmF3OiBmdW5jdGlvbiAoaWQsIGQsIG9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgY2ZnID0ge1xyXG4gICAgICAgICAgICByYWRpdXM6IDUsXHJcbiAgICAgICAgICAgIHc6IDYwMCxcclxuICAgICAgICAgICAgaDogNjAwLFxyXG4gICAgICAgICAgICBmYWN0b3I6IDEsXHJcbiAgICAgICAgICAgIGZhY3RvckxlZ2VuZDogLjg1LFxyXG4gICAgICAgICAgICBsZXZlbHM6IDMsXHJcbiAgICAgICAgICAgIG1heFZhbHVlOiAwLFxyXG4gICAgICAgICAgICByYWRpYW5zOiAyICogTWF0aC5QSSxcclxuICAgICAgICAgICAgb3BhY2l0eUFyZWE6IDAuNSxcclxuICAgICAgICAgICAgVG9SaWdodDogNSxcclxuICAgICAgICAgICAgVHJhbnNsYXRlWDogODAsXHJcbiAgICAgICAgICAgIFRyYW5zbGF0ZVk6IDMwLFxyXG4gICAgICAgICAgICBFeHRyYVdpZHRoWDogMTAwLFxyXG4gICAgICAgICAgICBFeHRyYVdpZHRoWTogMTAwLFxyXG4gICAgICAgICAgICBjb2xvcjogZDMuc2NoZW1lQ2F0ZWdvcnkxMFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBvcHRpb25zW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2ZnW2ldID0gb3B0aW9uc1tpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjZmcubWF4VmFsdWUgPSBNYXRoLm1heChjZmcubWF4VmFsdWUsIGQzLm1heChkLCBmdW5jdGlvbiAoaSkgeyByZXR1cm4gZDMubWF4KGkubWFwKGZ1bmN0aW9uIChvKSB7IHJldHVybiBvLnZhbHVlOyB9KSkgfSkpO1xyXG4gICAgICAgIHZhciBhbGxBeGlzID0gKGRbMF0ubWFwKGZ1bmN0aW9uIChpLCBqKSB7IHJldHVybiBpLmF4aXMgfSkpO1xyXG4gICAgICAgIHZhciB0b3RhbCA9IGFsbEF4aXMubGVuZ3RoO1xyXG4gICAgICAgIHZhciByYWRpdXMgPSBjZmcuZmFjdG9yICogTWF0aC5taW4oY2ZnLncgLyAyLCBjZmcuaCAvIDIpO1xyXG4gICAgICAgIHZhciBGb3JtYXQgPSBkMy5mb3JtYXQoJy4wJScpOyAvLyByb3VuZHMgdG8gbmVhcmVzdCBmdWxsIHBlcmNlbnRhZ2UuIGllLiAxMCVcclxuICAgICAgICBkMy5zZWxlY3QoaWQpLnNlbGVjdChcInN2Z1wiKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgdmFyIGcgPSBkMy5zZWxlY3QoaWQpXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIGNmZy53ICsgY2ZnLkV4dHJhV2lkdGhYKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgY2ZnLmggKyBjZmcuRXh0cmFXaWR0aFkpXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyBjZmcuVHJhbnNsYXRlWCArIFwiLFwiICsgY2ZnLlRyYW5zbGF0ZVkgKyBcIilcIik7XHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICB2YXIgdG9vbHRpcDtcclxuXHJcbiAgICAgICAgLy9DaXJjdWxhciBzZWdtZW50c1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY2ZnLmxldmVscyAtIDE7IGorKykge1xyXG4gICAgICAgICAgICB2YXIgbGV2ZWxGYWN0b3IgPSBjZmcuZmFjdG9yICogcmFkaXVzICogKChqICsgMSkgLyBjZmcubGV2ZWxzKTtcclxuICAgICAgICAgICAgZy5zZWxlY3RBbGwoXCIubGV2ZWxzXCIpXHJcbiAgICAgICAgICAgICAuZGF0YShhbGxBeGlzKVxyXG4gICAgICAgICAgICAgLmVudGVyKClcclxuICAgICAgICAgICAgIC5hcHBlbmQoXCJzdmc6bGluZVwiKVxyXG4gICAgICAgICAgICAgLmF0dHIoXCJ4MVwiLCBmdW5jdGlvbiAoZCwgaSkgeyByZXR1cm4gbGV2ZWxGYWN0b3IgKiAoMSAtIGNmZy5mYWN0b3IgKiBNYXRoLnNpbihpICogY2ZnLnJhZGlhbnMgLyB0b3RhbCkpOyB9KVxyXG4gICAgICAgICAgICAgLmF0dHIoXCJ5MVwiLCBmdW5jdGlvbiAoZCwgaSkgeyByZXR1cm4gbGV2ZWxGYWN0b3IgKiAoMSAtIGNmZy5mYWN0b3IgKiBNYXRoLmNvcyhpICogY2ZnLnJhZGlhbnMgLyB0b3RhbCkpOyB9KVxyXG4gICAgICAgICAgICAgLmF0dHIoXCJ4MlwiLCBmdW5jdGlvbiAoZCwgaSkgeyByZXR1cm4gbGV2ZWxGYWN0b3IgKiAoMSAtIGNmZy5mYWN0b3IgKiBNYXRoLnNpbigoaSArIDEpICogY2ZnLnJhZGlhbnMgLyB0b3RhbCkpOyB9KVxyXG4gICAgICAgICAgICAgLmF0dHIoXCJ5MlwiLCBmdW5jdGlvbiAoZCwgaSkgeyByZXR1cm4gbGV2ZWxGYWN0b3IgKiAoMSAtIGNmZy5mYWN0b3IgKiBNYXRoLmNvcygoaSArIDEpICogY2ZnLnJhZGlhbnMgLyB0b3RhbCkpOyB9KVxyXG4gICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmVcIilcclxuICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcImdyZXlcIilcclxuICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZS1vcGFjaXR5XCIsIFwiMC43NVwiKVxyXG4gICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIFwiMC4zcHhcIilcclxuICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKGNmZy53IC8gMiAtIGxldmVsRmFjdG9yKSArIFwiLCBcIiArIChjZmcuaCAvIDIgLSBsZXZlbEZhY3RvcikgKyBcIilcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1RleHQgaW5kaWNhdGluZyBhdCB3aGF0ICUgZWFjaCBsZXZlbCBpc1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY2ZnLmxldmVsczsgaisrKSB7XHJcbiAgICAgICAgICAgIHZhciBsZXZlbEZhY3RvciA9IGNmZy5mYWN0b3IgKiByYWRpdXMgKiAoKGogKyAxKSAvIGNmZy5sZXZlbHMpO1xyXG4gICAgICAgICAgICBnLnNlbGVjdEFsbChcIi5sZXZlbHNcIilcclxuICAgICAgICAgICAgIC5kYXRhKFsxXSkgLy9kdW1teSBkYXRhXHJcbiAgICAgICAgICAgICAuZW50ZXIoKVxyXG4gICAgICAgICAgICAgLmFwcGVuZChcInN2Zzp0ZXh0XCIpXHJcbiAgICAgICAgICAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGxldmVsRmFjdG9yICogKDEgLSBjZmcuZmFjdG9yICogTWF0aC5zaW4oMCkpOyB9KVxyXG4gICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBsZXZlbEZhY3RvciAqICgxIC0gY2ZnLmZhY3RvciAqIE1hdGguY29zKDApKTsgfSlcclxuICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsZWdlbmRcIilcclxuICAgICAgICAgICAgIC5zdHlsZShcImZvbnQtZmFtaWx5XCIsIFwic2Fucy1zZXJpZlwiKVxyXG4gICAgICAgICAgICAgLnN0eWxlKFwiZm9udC1zaXplXCIsIFwiMTBweFwiKVxyXG4gICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoY2ZnLncgLyAyIC0gbGV2ZWxGYWN0b3IgKyBjZmcuVG9SaWdodCkgKyBcIiwgXCIgKyAoY2ZnLmggLyAyIC0gbGV2ZWxGYWN0b3IpICsgXCIpXCIpXHJcbiAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCIjNzM3MzczXCIpXHJcbiAgICAgICAgICAgICAudGV4dChGb3JtYXQoKGogKyAxKSAqIGNmZy5tYXhWYWx1ZSAvIGNmZy5sZXZlbHMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlcmllcyA9IDA7XHJcblxyXG4gICAgICAgIHZhciBheGlzID0gZy5zZWxlY3RBbGwoXCIuYXhpc1wiKVxyXG4gICAgICAgICAgICAgICAgLmRhdGEoYWxsQXhpcylcclxuICAgICAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImF4aXNcIik7XHJcblxyXG4gICAgICAgIGF4aXMuYXBwZW5kKFwibGluZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIngxXCIsIGNmZy53IC8gMilcclxuICAgICAgICAgICAgLmF0dHIoXCJ5MVwiLCBjZmcuaCAvIDIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwieDJcIiwgZnVuY3Rpb24gKGQsIGkpIHsgcmV0dXJuIGNmZy53IC8gMiAqICgxIC0gY2ZnLmZhY3RvciAqIE1hdGguc2luKGkgKiBjZmcucmFkaWFucyAvIHRvdGFsKSk7IH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwieTJcIiwgZnVuY3Rpb24gKGQsIGkpIHsgcmV0dXJuIGNmZy5oIC8gMiAqICgxIC0gY2ZnLmZhY3RvciAqIE1hdGguY29zKGkgKiBjZmcucmFkaWFucyAvIHRvdGFsKSk7IH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5lXCIpXHJcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCBcImdyZXlcIilcclxuICAgICAgICAgICAgLnN0eWxlKFwic3Ryb2tlLXdpZHRoXCIsIFwiMXB4XCIpO1xyXG5cclxuICAgICAgICBheGlzLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxlZ2VuZFwiKVxyXG4gICAgICAgICAgICAudGV4dChmdW5jdGlvbiAoZCkgeyByZXR1cm4gZCB9KVxyXG4gICAgICAgICAgICAvLy5zdHlsZShcImZvbnQtZmFtaWx5XCIsIFwic2Fucy1zZXJpZlwiKVxyXG4gICAgICAgICAgICAvLy5zdHlsZShcImZvbnQtc2l6ZVwiLCBcIjExcHhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImR5XCIsIFwiMS41ZW1cIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQsIGkpIHsgcmV0dXJuIFwidHJhbnNsYXRlKDAsIC0yMClcIiB9KVxyXG4gICAgICAgICAgICAuYXR0cihcInhcIiwgZnVuY3Rpb24gKGQsIGkpIHsgcmV0dXJuIGNmZy53IC8gMiAqICgxIC0gY2ZnLmZhY3RvckxlZ2VuZCAqIE1hdGguc2luKGkgKiBjZmcucmFkaWFucyAvIHRvdGFsKSkgLSA2MCAqIE1hdGguc2luKGkgKiBjZmcucmFkaWFucyAvIHRvdGFsKTsgfSlcclxuICAgICAgICAgICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkLCBpKSB7IHJldHVybiBjZmcuaCAvIDIgKiAoMSAtIE1hdGguY29zKGkgKiBjZmcucmFkaWFucyAvIHRvdGFsKSkgLSAyMCAqIE1hdGguY29zKGkgKiBjZmcucmFkaWFucyAvIHRvdGFsKTsgfSk7XHJcblxyXG4gICAgICAgIGQuZm9yRWFjaChmdW5jdGlvbiAoeSwgeCkge1xyXG4gICAgICAgICAgICBkYXRhVmFsdWVzID0gW107XHJcbiAgICAgICAgICAgIGcuc2VsZWN0QWxsKFwiLm5vZGVzXCIpXHJcbiAgICAgICAgICAgICAgLmRhdGEoeSwgZnVuY3Rpb24gKGosIGkpIHtcclxuICAgICAgICAgICAgICAgICAgZGF0YVZhbHVlcy5wdXNoKFtcclxuICAgICAgICAgICAgICAgICAgICBjZmcudyAvIDIgKiAoMSAtIChwYXJzZUZsb2F0KE1hdGgubWF4KGoudmFsdWUsIDApKSAvIGNmZy5tYXhWYWx1ZSkgKiBjZmcuZmFjdG9yICogTWF0aC5zaW4oaSAqIGNmZy5yYWRpYW5zIC8gdG90YWwpKSxcclxuICAgICAgICAgICAgICAgICAgICBjZmcuaCAvIDIgKiAoMSAtIChwYXJzZUZsb2F0KE1hdGgubWF4KGoudmFsdWUsIDApKSAvIGNmZy5tYXhWYWx1ZSkgKiBjZmcuZmFjdG9yICogTWF0aC5jb3MoaSAqIGNmZy5yYWRpYW5zIC8gdG90YWwpKVxyXG4gICAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZGF0YVZhbHVlcy5wdXNoKGRhdGFWYWx1ZXNbMF0pO1xyXG4gICAgICAgICAgICBnLnNlbGVjdEFsbChcIi5hcmVhXCIpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5kYXRhKFtkYXRhVmFsdWVzXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLmVudGVyKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcInBvbHlnb25cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcInJhZGFyLWNoYXJ0LXNlcmllXCIgKyBzZXJpZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZS13aWR0aFwiLCBcIjJweFwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgY2ZnLmNvbG9yW3Nlcmllc10pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKFwicG9pbnRzXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RyID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHB0aSA9IDA7IHB0aSA8IGQubGVuZ3RoOyBwdGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IHN0ciArIGRbcHRpXVswXSArIFwiLFwiICsgZFtwdGldWzFdICsgXCIgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsXCIsIGZ1bmN0aW9uIChqLCBpKSB7IHJldHVybiBjZmcuY29sb3Jbc2VyaWVzXSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgY2ZnLm9wYWNpdHlBcmVhKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB6ID0gXCJwb2x5Z29uLlwiICsgZDMuc2VsZWN0KHRoaXMpLmF0dHIoXCJjbGFzc1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcuc2VsZWN0QWxsKFwicG9seWdvblwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMC4xKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGcuc2VsZWN0QWxsKHopXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGwtb3BhY2l0eVwiLCAuNyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vbignbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnLnNlbGVjdEFsbChcInBvbHlnb25cIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIGNmZy5vcGFjaXR5QXJlYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzZXJpZXMrKztcclxuICAgICAgICB9KTtcclxuICAgICAgICBzZXJpZXMgPSAwO1xyXG5cclxuICAgICAgICBkLmZvckVhY2goZnVuY3Rpb24gKHksIHgpIHtcclxuICAgICAgICAgICAgZy5zZWxlY3RBbGwoXCIubm9kZXNcIilcclxuICAgICAgICAgICAgICAuZGF0YSh5KS5lbnRlcigpXHJcbiAgICAgICAgICAgICAgLmFwcGVuZChcInN2ZzpjaXJjbGVcIilcclxuICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwicmFkYXItY2hhcnQtc2VyaWVcIiArIHNlcmllcylcclxuICAgICAgICAgICAgICAuYXR0cigncicsIGNmZy5yYWRpdXMpXHJcbiAgICAgICAgICAgICAgLmF0dHIoXCJhbHRcIiwgZnVuY3Rpb24gKGopIHsgcmV0dXJuIE1hdGgubWF4KGoudmFsdWUsIDApIH0pXHJcbiAgICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCBmdW5jdGlvbiAoaiwgaSkge1xyXG4gICAgICAgICAgICAgICAgICBkYXRhVmFsdWVzLnB1c2goW1xyXG4gICAgICAgICAgICAgICAgICAgIGNmZy53IC8gMiAqICgxIC0gKHBhcnNlRmxvYXQoTWF0aC5tYXgoai52YWx1ZSwgMCkpIC8gY2ZnLm1heFZhbHVlKSAqIGNmZy5mYWN0b3IgKiBNYXRoLnNpbihpICogY2ZnLnJhZGlhbnMgLyB0b3RhbCkpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNmZy5oIC8gMiAqICgxIC0gKHBhcnNlRmxvYXQoTWF0aC5tYXgoai52YWx1ZSwgMCkpIC8gY2ZnLm1heFZhbHVlKSAqIGNmZy5mYWN0b3IgKiBNYXRoLmNvcyhpICogY2ZnLnJhZGlhbnMgLyB0b3RhbCkpXHJcbiAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gY2ZnLncgLyAyICogKDEgLSAoTWF0aC5tYXgoai52YWx1ZSwgMCkgLyBjZmcubWF4VmFsdWUpICogY2ZnLmZhY3RvciAqIE1hdGguc2luKGkgKiBjZmcucmFkaWFucyAvIHRvdGFsKSk7XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAuYXR0cihcImN5XCIsIGZ1bmN0aW9uIChqLCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBjZmcuaCAvIDIgKiAoMSAtIChNYXRoLm1heChqLnZhbHVlLCAwKSAvIGNmZy5tYXhWYWx1ZSkgKiBjZmcuZmFjdG9yICogTWF0aC5jb3MoaSAqIGNmZy5yYWRpYW5zIC8gdG90YWwpKTtcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIC5hdHRyKFwiZGF0YS1pZFwiLCBmdW5jdGlvbiAoaikgeyByZXR1cm4gai5heGlzIH0pXHJcbiAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBjZmcuY29sb3Jbc2VyaWVzXSkuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgLjkpXHJcbiAgICAgICAgICAgICAgLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgICBuZXdYID0gcGFyc2VGbG9hdChkMy5zZWxlY3QodGhpcykuYXR0cignY3gnKSkgLSAxMDtcclxuICAgICAgICAgICAgICAgICAgbmV3WSA9IHBhcnNlRmxvYXQoZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ2N5JykpIC0gNTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIHRvb2x0aXBcclxuICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCd4JywgbmV3WClcclxuICAgICAgICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgbmV3WSlcclxuICAgICAgICAgICAgICAgICAgICAgIC50ZXh0KEZvcm1hdChkLnZhbHVlKSlcclxuICAgICAgICAgICAgICAgICAgICAgIC50cmFuc2l0aW9uKDIwMClcclxuICAgICAgICAgICAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDEpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgeiA9IFwicG9seWdvbi5cIiArIGQzLnNlbGVjdCh0aGlzKS5hdHRyKFwiY2xhc3NcIik7XHJcbiAgICAgICAgICAgICAgICAgIGcuc2VsZWN0QWxsKFwicG9seWdvblwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIDAuMSk7XHJcbiAgICAgICAgICAgICAgICAgIGcuc2VsZWN0QWxsKHopXHJcbiAgICAgICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigyMDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgLjcpO1xyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgLm9uKCdtb3VzZW91dCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgdG9vbHRpcFxyXG4gICAgICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKCdvcGFjaXR5JywgMCk7XHJcbiAgICAgICAgICAgICAgICAgIGcuc2VsZWN0QWxsKFwicG9seWdvblwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgLnRyYW5zaXRpb24oMjAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbC1vcGFjaXR5XCIsIGNmZy5vcGFjaXR5QXJlYSk7XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAuYXBwZW5kKFwic3ZnOnRpdGxlXCIpXHJcbiAgICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24gKGopIHsgcmV0dXJuIE1hdGgubWF4KGoudmFsdWUsIDApIH0pO1xyXG5cclxuICAgICAgICAgICAgc2VyaWVzKys7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy9Ub29sdGlwXHJcbiAgICAgICAgdG9vbHRpcCA9IGcuYXBwZW5kKCd0ZXh0JylcclxuICAgICAgICAgICAgICAgICAgIC5zdHlsZSgnb3BhY2l0eScsIDApXHJcbiAgICAgICAgICAgICAgICAgICAuc3R5bGUoJ2ZvbnQtZmFtaWx5JywgJ3NhbnMtc2VyaWYnKVxyXG4gICAgICAgICAgICAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLCAnMTNweCcpO1xyXG4gICAgfVxyXG59OyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5hZG1pbicpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0FwcGxpY2F0aW9uTG9nc0NvbnRyb2xsZXInLCBBcHBsaWNhdGlvbkxvZ3NDb250cm9sbGVyKTtcclxuXHJcbiAgICBBcHBsaWNhdGlvbkxvZ3NDb250cm9sbGVyLiRpbmplY3QgPSBbJyRxJywgJ2FwcGxpY2F0aW9uTG9nc1NlcnZpY2UnLCAnJGxvZyddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udHJvbGxlciB0byBtYW5hZ2UgYXBwbGljYXRpb24gbG9ncy5cclxuICAgICAqIEBwYXJhbSB7JHF9ICRxXHJcbiAgICAgKiBAcGFyYW0ge2ZhY3Rvcnl9IGFwcGxpY2F0aW9uTG9nc1NlcnZpY2VcclxuICAgICAqIEBwYXJhbSB7JGxvZ30gJGxvZ1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBBcHBsaWNhdGlvbkxvZ3NDb250cm9sbGVyKCRxLCBhcHBsaWNhdGlvbkxvZ3NTZXJ2aWNlLCAkbG9nKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5sb2dzID0gW107XHJcbiAgICAgICAgdm0uZXJyb3IgPSBmYWxzZTtcclxuICAgICAgICB2bS5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEluaXRpYWxpemUgY29udHJvbGxlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgLy8gUmV0cmlldmVzIGFsbCBwcm9kdWN0aW9uIGxpbmVzIHdpdGggdGhlaXIgQ1BScyBmb3IgdGhlIGN1cnJlbnQgeWVhciB0aGVuIHVwZGF0ZXMgbG9ja3NcclxuICAgICAgICAgICAgYXBwbGljYXRpb25Mb2dzU2VydmljZVxyXG4gICAgICAgICAgICAgICAgLmdldCgpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAobG9ncykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmxvZ3MgPSBsb2dzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvZ3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlc3Npb25EZXRhaWxzID0gdm0ubG9nc1tpXS5TZXNzaW9uRGV0YWlscyB8fCAne30nO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbkRldGFpbHMgPSByZXBsYWNlQWxsKHNlc3Npb25EZXRhaWxzLCBcIicnXCIsIFwiXFxcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbkRldGFpbHMgPSBzZXNzaW9uRGV0YWlscy5yZXBsYWNlKC9cXFxcL2csIFwiXFxcXFxcXFxcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb25EZXRhaWxzID0gc2Vzc2lvbkRldGFpbHMucmVwbGFjZShcIlVzZXJuYW1lXCIsIFwiXFxcIlVzZXJuYW1lXFxcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbkRldGFpbHMgPSBzZXNzaW9uRGV0YWlscy5yZXBsYWNlKFwiU2Vzc2lvblwiLCBcIlxcXCJTZXNzaW9uXFxcIlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmxvZ3NbaV0uU2Vzc2lvbkRldGFpbHMgPSBKU09OLnBhcnNlKHNlc3Npb25EZXRhaWxzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZXJyb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICRsb2cuaW5mbyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVwbGFjZXMgYWxsIGluc3RhbmNlcyBvZiBhIHN0cmluZy5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBmaW5kXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcmVwbGFjZVxyXG4gICAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcmVwbGFjZUFsbChzdHIsIGZpbmQsIHJlcGxhY2UpIHtcclxuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cChmaW5kLCAnZycpLCByZXBsYWNlKTtcclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdBcHBMb2cnLCBBcHBMb2dNb2RlbCk7XHJcblxyXG4gICAgQXBwTG9nTW9kZWwuJGluamVjdCA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSnMgb2JqZWN0IHJlcHJlc2VudGluZyBhbiBBcHBsaWNhdGlvbiBMb2cuXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBBcHBMb2dNb2RlbCgpIHtcclxuICAgICAgICByZXR1cm4gQXBwTG9nO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGUgYSBuZXcgYXBwIGxvZyBvYmplY3QgYmFzZWQgb24gYW5vdGhlciBvYmplY3QuXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGJhc2VPYmpcclxuICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIEFwcExvZyhiYXNlT2JqKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnN0YW5jZSA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWFuZ3VsYXIuaXNPYmplY3QoYmFzZU9iaikpXHJcbiAgICAgICAgICAgICAgICBiYXNlT2JqID0ge307XHJcblxyXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChpbnN0YW5jZSwge1xyXG4gICAgICAgICAgICAgICAgSWQ6IGJhc2VPYmouSWQsXHJcbiAgICAgICAgICAgICAgICBFdmVudElkOiBiYXNlT2JqLkV2ZW50SWQsXHJcbiAgICAgICAgICAgICAgICBUaW1lc3RhbXA6IGJhc2VPYmouVGltZXN0YW1wLFxyXG4gICAgICAgICAgICAgICAgU291cmNlOiBiYXNlT2JqLlNvdXJjZSxcclxuICAgICAgICAgICAgICAgIFNlc3Npb25EZXRhaWxzOiBiYXNlT2JqLlNlc3Npb25EZXRhaWxzLFxyXG4gICAgICAgICAgICAgICAgTWVzc2FnZTogYmFzZU9iai5NZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgTGV2ZWw6IGJhc2VPYmouTGV2ZWwsXHJcbiAgICAgICAgICAgICAgICBFeGNlcHRpb25NZXNzYWdlOiBiYXNlT2JqLkV4Y2VwdGlvbk1lc3NhZ2VcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5hZG1pbicpXHJcbiAgICAgICAgLmZhY3RvcnkoJ0FwcGxpY2F0aW9uTG9nc1NlcnZpY2UnLCBBcHBsaWNhdGlvbkxvZ3NTZXJ2aWNlKTtcclxuXHJcbiAgICBBcHBsaWNhdGlvbkxvZ3NTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJywgJyRsb2cnLCAnY29uZmlncyddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGF0YSBzZXJ2aWNlIGZvciBiYXNpYyBhcHBsaWNhdGlvbiBsb2cgbWFuYWdlbWVudC5cclxuICAgICAqIEBwYXJhbSB7JGh0dHB9ICRodHRwXHJcbiAgICAgKiBAcGFyYW0geyRsb2d9ICRsb2dcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdzXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBBcHBsaWNhdGlvbkxvZ3NTZXJ2aWNlKCRodHRwLCAkbG9nLCBjb25maWdzKSB7XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB7XHJcbiAgICAgICAgICAgIGdldEFsbDogZ2V0QWxsLFxyXG4gICAgICAgICAgICBnZXQ6IGdldFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEdldHMgdGhlIHNldCBvZiBhbGwgYXBwbG9nIGVudHJpZXMgY3VycmVudGx5IGluIHRoZSBzeXN0ZW0uXHJcbiAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRBbGwoKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogY29uZmlncy5hcGlVcmwgKyAnL0FwcGxpY2F0aW9uTG9nRW50cmllcydcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzQ2FsbGJhY2socmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5kZWJ1ZygnQXBwbGljYXRpb24gbG9nIGVudHJpZXMgcmV0cmlldmVkIHN1Y2Nlc3NmdWxseS4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBlcnJvckNhbGxiYWNrKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuZGVidWcoJ0FwaSB3YXMgbm90IGZvdW5kIG9yIGlzIGN1cnJlbnRseSB1bmF2YWlsYWJsZSB3aGVyZSBleHBlY3RlZC4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5kZWJ1ZygnUmVzcG9uc2U6ICcgKyByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogR2V0cyB0aGUgZW50cnkgY29ycmVzcG9uZGluZyB0byB0aGUgc3BlY2lmaWVkIGlkZW50aWZpZXIuXHJcbiAgICAgICAgKiBAcGFyYW0ge0ludH0gaWRcclxuICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXQoaWQpIHtcclxuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBjb25maWdzLmFwaVVybCArICcvYXBpL0FwcGxpY2F0aW9uTG9nRW50cmllcy8nICsgaWRcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRodHRwKHJlcXVlc3QpXHJcbiAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzQ2FsbGJhY2socmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5kZWJ1ZygnQXBwbGljYXRpb24gbG9nIGVudHJ5IHJldHJpZXZlZCBzdWNjZXNzZnVsbHkuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZXJyb3JDYWxsYmFjayhyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9nLmRlYnVnKCdBcGkgd2FzIG5vdCBmb3VuZCBvciBpcyBjdXJyZW50bHkgdW5hdmFpbGFibGUgd2hlcmUgZXhwZWN0ZWQuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuZGVidWcoJ1Jlc3BvbnNlOiAnICsgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1VzZXJDb250cm9sbGVyJywgVXNlckNvbnRyb2xsZXIpO1xyXG5cclxuICAgIFVzZXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb3V0ZVBhcmFtcycsICd1c2VyU2VydmljZSddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udHJvbGxlciB0byBtYW5hZ2UgdXNlcnMuXHJcbiAgICAgKiBAcGFyYW0geyRyb3V0ZVBhcmFtc30gJHJvdXRlUGFyYW1zXHJcbiAgICAgKiBAcGFyYW0ge2ZhY3Rvcnl9IHVzZXJTZXJ2aWNlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFVzZXJDb250cm9sbGVyKCRyb3V0ZVBhcmFtcywgdXNlclNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICAvLyBGaWVsZCBtZW1iZXJzXHJcbiAgICAgICAgdm0udXNlciA9IHt9O1xyXG4gICAgICAgIHZtLmlzTG9hZGluZyA9IHRydWU7XHJcbiAgICAgICAgdm0ucm9sZXMgPSBbXTtcclxuICAgICAgICB2bS51c2VyTm90Rm91bmQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8gRnVuY3Rpb24gbWFwcGluZ1xyXG4gICAgICAgIHZtLmdldFBlcm1pc3Npb25zID0gZ2V0UGVybWlzc2lvbnM7XHJcblxyXG4gICAgICAgIC8vIEluaXRpYWxpemUgbGF1bmNoIGNvbW1hbmRcclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBQZXJmb3JtcyBpbml0aWFsaXphdGlvbiBhY3Rpdml0aWVzIGR1cmluZyB0aGVcclxuICAgICAgICAqIGluaXRpYWwgaW5zdGFudGlhdGlvbi5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICBnZXRVc2VyKCRyb3V0ZVBhcmFtcy51c2VybmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAqIEdldHMgdGhlIHVzZXJzIGluZm9ybWF0aW9uIGZvciB0aGUgc3BlY2lmaWVkLlxyXG4gICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVzZXJuYW1lXHJcbiAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRVc2VyKHVzZXJuYW1lKSB7XHJcbiAgICAgICAgICAgIHZtLnVzZXJOb3RGb3VuZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdXNlclNlcnZpY2UuZ2V0VXNlckJ5VXNlcm5hbWUodXNlcm5hbWUgfHwgJ21lJylcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0udXNlciA9IHVzZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0ucm9sZXMgPSBnZXRSb2xlcygpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PT0gNDAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS51c2VyTm90Rm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXRzIGEgbGlzdCBvZiBhbGwgcm9sZXMgZm9yIHRoZSB1c2VyLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtBcnJheX1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRSb2xlcygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcih2bS51c2VyLCAnUm9sZXMnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgYSBsaXN0IG9mIHJvbGVzIHRoZSB1c2VyIGhhcyBwZXJtaXNzaW9uIHRvLlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSByb2xlXHJcbiAgICAgICAgICogQHJldHVybnMge0FycmF5fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFBlcm1pc3Npb25zKHJvbGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcihyb2xlLCAnQ2FuJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBGaWx0ZXJzIHRoZSBvYmplY3QncyBwcm9wZXJ0aWVzLlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW5jbHVkZXNcclxuICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZmlsdGVyKG9iaiwgaW5jbHVkZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikuZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBrZXkuaW5jbHVkZXMoaW5jbHVkZXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuZmFjdG9yeSgnVXNlcicsIFVzZXJNb2RlbCk7XHJcblxyXG4gICAgVXNlck1vZGVsLiRpbmplY3QgPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEpzIHJlcHJlc2VudGF0aW9uIG9mIGEgVXNlciBvYmplY3QuXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBVc2VyTW9kZWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIFVzZXI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENyZWF0ZXMgYSBuZXcgdXNlciBmcm9tIHRoZSBiYXNlIE9iai5cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gYmFzZU9ialxyXG4gICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gVXNlcihiYXNlT2JqKSB7XHJcbiAgICAgICAgICAgIGxldCBpbnN0YW5jZSA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWFuZ3VsYXIuaXNPYmplY3QoYmFzZU9iaikpXHJcbiAgICAgICAgICAgICAgICBiYXNlT2JqID0ge307XHJcblxyXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZChpbnN0YW5jZSwge1xyXG4gICAgICAgICAgICAgICAgSWQ6IGJhc2VPYmouSWQsXHJcbiAgICAgICAgICAgICAgICBVc2VybmFtZTogYmFzZU9iai5Vc2VybmFtZSxcclxuICAgICAgICAgICAgICAgIEZyaWVuZGx5TmFtZTogYmFzZU9iai5GcmllbmRseU5hbWUsXHJcbiAgICAgICAgICAgICAgICBFbWFpbEFkZHJlc3M6IGJhc2VPYmouRW1haWxBZGRyZXNzLFxyXG4gICAgICAgICAgICAgICAgSXNBcHBBZG1pbjogYmFzZU9iai5Jc0FwcEFkbWluLFxyXG4gICAgICAgICAgICAgICAgQXBwUm9sZXM6IGJhc2VPYmouQXBwUm9sZXMsXHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0aW9uTGluZVJvbGVzOiBiYXNlT2JqLlByb2R1Y3Rpb25MaW5lUm9sZXMsXHJcbiAgICAgICAgICAgICAgICBQbGFudFJvbGVzOiBiYXNlT2JqLlBsYW50Um9sZXMsXHJcbiAgICAgICAgICAgICAgICBQcm9kdWN0aW9uVW5pdFJvbGVzOiBiYXNlT2JqLlByb2R1Y3Rpb25Vbml0Um9sZXMsXHJcbiAgICAgICAgICAgICAgICBTaXRlUm9sZXM6IGJhc2VPYmouU2l0ZVJvbGVzXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5mYWN0b3J5KCd1c2VyU2VydmljZScsIHVzZXJTZXJ2aWNlKTtcclxuXHJcbiAgICB1c2VyU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCcsICckbG9nJywgJ2NvbmZpZ3MnLCAnVXNlciddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGF0YSBzZXJ2aWNlIGZvciB1c2Vycy5cclxuICAgICAqIEBwYXJhbSB7JGh0dHB9ICRodHRwXHJcbiAgICAgKiBAcGFyYW0geyRsb2d9ICRsb2dcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdzXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gVXNlclxyXG4gICAgICogQHJldHVybnMge09iamVjdH1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdXNlclNlcnZpY2UoJGh0dHAsICRsb2csIGNvbmZpZ3MsIFVzZXIpIHtcclxuICAgICAgICB2YXIgc2VydmljZSA9IHtcclxuICAgICAgICAgICAgZ2V0VXNlcnM6IGdldFVzZXJzLFxyXG4gICAgICAgICAgICBnZXRVc2VyQnlJZDogZ2V0VXNlckJ5SWQsXHJcbiAgICAgICAgICAgIGdldFVzZXJCeVVzZXJuYW1lOiBnZXRVc2VyQnlVc2VybmFtZSxcclxuICAgICAgICAgICAgc2F2ZVVzZXI6IHNhdmVVc2VyLFxyXG4gICAgICAgICAgICBkZWxldGVVc2VyOiBkZWxldGVVc2VyXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgYWxsIHVzZXJzXHJcbiAgICAgICAgICogQHJldHVybnMge0FycmF5fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFVzZXJzKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxID0ge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogY29uZmlncy5hcGlVcmwgKyBcImF1dGgvdXNlcnNcIlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAocmVxKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzQ2FsbGJhY2socmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBlcnJvckNhbGxiYWNrKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5kZWJ1ZygnVGhlcmUgd2FzIGFuIGVycm9yIHJldHJpZXZpbmcgdXNlcnMuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0IGEgc3BlY2lmaWMgdXNlciBieSB0aGUgaWQuXHJcbiAgICAgICAgICogQHBhcmFtIHtJbnR9IGlkXHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRVc2VyQnlJZChpZCkge1xyXG4gICAgICAgICAgICB2YXIgcmVxID0ge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogY29uZmlncy5hcGlVcmwgKyBcImF1dGgvdXNlcnMvXCIgKyBpZFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAocmVxKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzQ2FsbGJhY2socmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBlcnJvckNhbGxiYWNrKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5kZWJ1ZygnVGhlcmUgd2FzIGFuIGVycm9yIHJldHJpZXZpbmcgdGhlIHVzZXIuIFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0IGEgc3BlY2lmaWMgdXNlciBieSB0aGUgdXNlcm5hbWUuXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHVzZXJuYW1lXHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRVc2VyQnlVc2VybmFtZSh1c2VybmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVxID0ge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIHVybDogY29uZmlncy5hcGlVcmwgKyBcImF1dGgvdXNlcnMvXCIgKyB1c2VybmFtZVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAocmVxKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzQ2FsbGJhY2socmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyRsb2cuZGVidWcoJ1VzZXIgcmV0cmlldmVkIHN1Y2Nlc3NmdWxseS4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vJGxvZy5kZWJ1ZyhyZXMuZGF0YSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZXJyb3JDYWxsYmFjayhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuZGVidWcoJ1RoZXJlIHdhcyBhbiBlcnJvciByZXRyaWV2aW5nIHRoZSB1c2VyLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENyZWF0ZSBvciBVcGRhdGUgYSB1c2VyLlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB1c2VyXHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBzYXZlVXNlcih1c2VyKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGNvbmZpZ3MuYXBpVXJsICsgXCJhdXRoL3VzZXJzXCIsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgVXNlcm5hbWU6IHVzZXIuVXNlcm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgRnJpZW5kbHlOYW1lOiB1c2VyLkZyaWVuZGx5TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBFbWFpbEFkZHJlc3M6IHVzZXIuRW1haWxBZGRyZXNzLFxyXG4gICAgICAgICAgICAgICAgICAgIElzQXBwQWRtaW46IHVzZXIuSXNBcHBBZG1pbixcclxuICAgICAgICAgICAgICAgICAgICBBcHBSb2xlczogdXNlci5BcHBSb2xlcyxcclxuICAgICAgICAgICAgICAgICAgICBQcm9kdWN0aW9uTGluZVJvbGVzOiB1c2VyLlByb2R1Y3Rpb25MaW5lUm9sZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgUGxhbnRSb2xlczogdXNlci5QbGFudFJvbGVzLFxyXG4gICAgICAgICAgICAgICAgICAgIFByb2R1Y3Rpb25Vbml0Um9sZXM6IHVzZXIuUHJvZHVjdGlvblVuaXRSb2xlcyxcclxuICAgICAgICAgICAgICAgICAgICBTaXRlUm9sZXM6IHVzZXIuU2l0ZVJvbGVzXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh1c2VyICYmIHVzZXIuSWQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm1ldGhvZCA9ICdQVVQnO1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdC51cmwgPSByZXF1ZXN0LnVybCArIFwiL1wiICsgdXNlci5JZDtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3QuZGF0YS5JZCA9IHVzZXIuSWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cChyZXF1ZXN0KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzdWNjZXNzQ2FsbGJhY2socmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBlcnJvckNhbGxiYWNrKHJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvZy5kZWJ1ZygnVGhlcmUgd2FzIGFuIGVycm9yIHNhdmluZyB0aGUgdXNlci4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci4nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZWxldGUgYSB1c2VyIGJ5IHRoZSBpZC5cclxuICAgICAgICAgKiBAcGFyYW0ge0ludH0gaWRcclxuICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBkZWxldGVVc2VyKGlkKSB7XHJcbiAgICAgICAgICAgIHZhciByZXEgPSB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBjb25maWdzLmFwaVVybCArIFwiYXV0aC91c2Vycy9cIiArIGlkXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cChyZXEpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3NDYWxsYmFjayhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gZXJyb3JDYWxsYmFjayhyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuZGVidWcoJ1RoZXJlIHdhcyBhbiBlcnJvciByZXRyaWV2aW5nIHRoZSB1c2VyLiBQbGVhc2UgdHJ5IGFnYWluIGxhdGVyLicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFkbWluJylcclxuICAgICAgICAuY29udHJvbGxlcignVXNlcnNDb250cm9sbGVyJywgVXNlcnNDb250cm9sbGVyKTtcclxuXHJcbiAgICBVc2Vyc0NvbnRyb2xsZXIuJGluamVjdCA9IFsncHJvZHVjdGlvbkxpbmVzU2VydmljZScsICd1c2VyU2VydmljZScsICdhdXRoU2VydmljZSddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udHJvbGxlciB0byBtYW5hZ2UgdXNlcnMuXHJcbiAgICAgKiBAcGFyYW0ge2ZhY3Rvcnl9IHByb2R1Y3Rpb25MaW5lc1NlcnZpY2VcclxuICAgICAqIEBwYXJhbSB7ZmFjdG9yeX0gdXNlclNlcnZpY2VcclxuICAgICAqIEBwYXJhbSB7ZmFjdG9yeX0gYXV0aFNlcnZpY2VcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gVXNlcnNDb250cm9sbGVyKHByb2R1Y3Rpb25MaW5lc1NlcnZpY2UsIHVzZXJTZXJ2aWNlLCBhdXRoU2VydmljZSkge1xyXG4gICAgICAgIGxldCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZtLmVycm9yID0gZmFsc2U7XHJcbiAgICAgICAgdm0udXNlcnMgPSBbXTtcclxuICAgICAgICB2bS5mb3JtID0ge307XHJcblxyXG4gICAgICAgIHZtLmlucHV0ID0ge307XHJcblxyXG4gICAgICAgIHZtLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5pdGlhbGl6ZSBjb250cm9sbGVyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICB2bS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHVzZXJTZXJ2aWNlXHJcbiAgICAgICAgICAgICAgICAuZ2V0KClcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uICh1c2Vycykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnVzZXJzID0gKHVzZXJzIHx8IFtdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHVzZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVzZXIuSXNBcHBBZG1pblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgaXNFZGl0b3IodXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmVycm9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERldGVybWluZSBpZiB5b3UgaGF2ZSB0aGUgYXBwcm9wcmlhdGUgcm9sZSB0byBlZGl0IHVzZXJzLlxyXG4gICAgICAgICAqIEBwYXJhbSB7dHlwZX0gdXNlclxyXG4gICAgICAgICAqIEByZXR1cm5zIHt0eXBlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGlzRWRpdG9yKHVzZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHVzZXJcclxuICAgICAgICAgICAgICAgICYmIHVzZXIuQXBwUm9sZXNcclxuICAgICAgICAgICAgICAgICYmIHVzZXIuQXBwUm9sZXNbXCJDaGVtQXBwcy1FZGl0b3JcIl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5hc3Nlc3NtZW50JylcclxuICAgICAgICAuZGlyZWN0aXZlKCdwYk11bHRpcGxlQ2hvaWNlUXVlc3Rpb24nLCBNdWx0aXBsZUNob2ljZVF1ZXN0aW9uKTtcclxuXHJcbiAgICBNdWx0aXBsZUNob2ljZVF1ZXN0aW9uLiRpbmplY3QgPSBbJyRsb2cnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERpcmVjdGl2ZSB0byBjcmVhdGUgYW5kIGRpc3BhbHkgYSBtdWx0aXBsZSBjaG9pY2UgcXVlc3Rpb24gd2l0aCBhbnN3ZXJzLlxyXG4gICAgICogQHBhcmFtIHskbG9nfSAkbG9nXHJcbiAgICAgKiBAcmV0dXJucyB7dHlwZX1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gTXVsdGlwbGVDaG9pY2VRdWVzdGlvbigkbG9nKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwL2Fzc2Vzc21lbnQvd2l6YXJkL211bHRpcGxlLmNob2ljZS5odG1sJyxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uOiAnQCcsXHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvbklkOiAnQCcsXHJcbiAgICAgICAgICAgICAgICBudW1iZXI6ICdAJyxcclxuICAgICAgICAgICAgICAgIGFuc3dlcnM6ICc9JyxcclxuICAgICAgICAgICAgICAgIGNvbW1lbnQ6ICc9JyxcclxuICAgICAgICAgICAgICAgIGlzQW5zd2VyZWQ6ICc9JyxcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkQW5zd2VyOiAnPSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTGluayBmdW5jdGlvbi5cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gc2NvcGVcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBlbGVtZW50XHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gYXR0cnNcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICBzY29wZS5zZWxlY3RBbnN3ZXIgPSBmdW5jdGlvbiAoYW5zd2VyKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5pc0Fuc3dlcmVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBub3Qgc3VyZSB5ZXQgd2h5IG5nLW1vZGVsIGlzbid0IHNldHRpbmcgdGhpcy5cclxuICAgICAgICAgICAgICAgIHNjb3BlLnNlbGVjdGVkQW5zd2VyID0gYW5zd2VyLmlkO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAuYXNzZXNzbWVudCcpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGJXaXphcmQnLCBXaXphcmQpO1xyXG5cclxuICAgIFdpemFyZC4kaW5qZWN0ID0gWyckbG9nJywgJyR0aW1lb3V0JywgJyRzY2UnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERpcmVjdGl2ZSB0byBjcmVhdGUgYW4gbmF2aWdhdGUgdGhyb3VnaCBhIHdpemFyZCBvZiBxdWVzdGlvbnMuXHJcbiAgICAgKiBAcGFyYW0geyRsb2d9ICRsb2dcclxuICAgICAqIEBwYXJhbSB7JHRpbWVvdXR9ICR0aW1lb3V0XHJcbiAgICAgKiBAcGFyYW0geyRzY2V9ICRzY2VcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFdpemFyZCgkbG9nLCAkdGltZW91dCwgJHNjZSkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC9hc3Nlc3NtZW50L3dpemFyZC93aXphcmQuaHRtbCcsXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0AnLFxyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zOiAnPScsXHJcbiAgICAgICAgICAgICAgICBwYWdlU2l6ZTogJ0AnLFxyXG4gICAgICAgICAgICAgICAgbG9hZGVkOiAnJicsXHJcbiAgICAgICAgICAgICAgICBzYXZlOiAnJicsXHJcbiAgICAgICAgICAgICAgICBzdWJtaXQ6ICcmJyxcclxuICAgICAgICAgICAgICAgIGNhbmNlbDogJyYnLFxyXG4gICAgICAgICAgICAgICAgcmV2aWV3OiAnJicsXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlQnV0dG9uczogJyYnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExpbmsgZnVuY3Rpb24uXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNjb3BlXHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gZWxlbWVudFxyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IGF0dHJzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgLy8gYWxlcnQgbWVzc2FnZSBmb3IgYWN0aW9ucy5cclxuICAgICAgICAgICAgc2NvcGUubWVzc2FnZSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBOYXZpZ2F0aW9uIG1ldGhvZHMuXHJcbiAgICAgICAgICAgICAqIFRoZXNlIGFyZSBuYXZpZ2F0aW9uIG9wdGlvbnMgdGhhdCBhcHBseSB0byB0aGUgZW50aXJlIHdpemFyZCwgbm90IGEgcGFydGljdWxhciBwYWdlIG9yIHN0ZXAuXHJcbiAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuc2hvd1NhdmVBbmRFeGl0TW9kYWwgPSBmYWxzZTtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFNob3cgdGhlIHNhdmUgYW5kIGV4aXQgbW9kYWwuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBzYXZlQW5kRXhpdCgpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnNob3dTYXZlQW5kRXhpdE1vZGFsID0gdHJ1ZTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLnNob3dDYW5jZWxNb2RhbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU2hvdyB0aGUgY2FuY2VsIG1vZGFsLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gY2FuY2VsICgpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnNob3dDYW5jZWxNb2RhbCA9IHRydWU7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBzY29wZS5zYXZlQW5kRXhpdE1vZGFsVGV4dCA9ICc8cD5Zb3UgaGF2ZSBjaG9zZW4gdG8gc2F2ZSB0aGUgaW5wdXQgcHJvdmlkZWQgdGh1cyBmYXIgYW5kIGV4aXQgdGhlIGFzc2Vzc21lbnQuPC9wPicgK1xyXG4gICAgICAgICAgICAgICAgJzxwPlNlbGVjdCBPSyBiZWxvdyB0byBzYXZlIGFsbCBpbmZvcm1hdGlvbiBhbmQgcmV0dXJuIHRvIHRoZSBBc3Nlc3NtZW50cyBwYWdlLCBvciBzZWxlY3QgQ2FuY2VsIHRvIHJldHVybiB0byB0aGUgY3VycmVudCBhc3Nlc3NtZW50LjwvcD4nO1xyXG4gICAgICAgICAgICBzY29wZS5jYW5jZWxNb2RhbFRleHQgPSAnPHA+WW91IGhhdmUgY2hvc2VuIHRvIGNhbmNlbCB0aGlzIGFzc2Vzc21lbnQuIElmIHlvdSBhcmUgc3VyZSB5b3Ugd2FudCB0byBjYW5jZWwgYW5kIGRlbGV0ZSBhbGwgaW5wdXQgcHJvdmlkZWQgdGh1cyBmYXIsIGNsaWNrIE9LIGJlbG93LjwvcD4nICtcclxuICAgICAgICAgICAgICAgICc8cD5JZiB5b3Ugd291bGQgbGlrZSB0byBzYXZlIHlvdXIgYXNzZXNzbWVudCBhbmQgZmluaXNoIGl0IGxhdGVyLCBzZWxlY3QgQ2FuY2VsIGJlbG93LCBhbmQgdGhlbiBzZWxlY3QgXFwnU2F2ZSBhbmQgRXhpdFxcJyBmcm9tIHRoZSBjdXJyZW50IGFzc2Vzc21lbnQgc2NyZWVuLjwvcD4nO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqICBTYXZlIGFuZCBleGl0IHRoZSBhc3Nlc3NtZW50LlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2NvcGUuY29uZmlybVNhdmVBbmRFeGl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuc2F2ZSgpXHJcbiAgICAgICAgICAgICAgIC50aGVuKG51bGwsIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgLy8gSGlkZSB0aGUgbW9kYWwuXHJcbiAgICAgICAgICAgICAgICAgICBzY29wZS5zaG93U2F2ZUFuZEV4aXRNb2RhbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgJGxvZy5lcnJvcihcIkFzc2Vzc21lbnQgZmFpbGVkIHRvIHNhdmUhXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgIC8vIFNob3cgdGhlIGVycm9yIG1lc3NhZ2UgZm9yIDUgc2Vjb25kcy4gVGhlbiBoaWRlLlxyXG4gICAgICAgICAgICAgICAgICAgaWYgKGVycm9yID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLm1lc3NhZ2UgPSBcIkFueSBlcnJvciBvY2N1cnJlZCB3aGlsZSBzYXZpbmcgeW91ciBwcm9ncmVzcy4gUGxlYXNlIHRyeSBhZ2Fpbi5cIjtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLm1lc3NhZ2UgPSBlcnJvcjtcclxuICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5tZXNzYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgIH0sIDUwMDApO1xyXG4gICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBDYW5jZWwgdGhlIGFzc2Vzc21lbnQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzY29wZS5jb25maXJtQ2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU3VibWl0IHRoZSBhc3Nlc3NtZW50IGFuc3dlcnMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzY29wZS5zdWJtaXRBbmRFbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkbG9nLmRlYnVnKFwic3VibWl0XCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNjb3BlLnN1Ym1pdCgpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29uc2lkZXIgbW92aW5nIHRoZSBwcm9taXNlIGNoYWluaW5nIGludG8gdGhlIHN0ZXAgbmV4dCBtZXRob2Qgc28gdGhhdCB3ZSBkb24ndCBkdXBsaWNhdGUgdGhpcyBsb2dpYy5cclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJyZW50U3RlcEluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAkbG9nLmVycm9yKFwiQXNzZXNzbWVudCBmYWlsZWQgdG8gc2F2ZSFcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNob3cgdGhlIGVycm9yIG1lc3NhZ2UgZm9yIDUgc2Vjb25kcy4gVGhlbiBoaWRlLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnJvciA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUubWVzc2FnZSA9IFwiQW55IGVycm9yIG9jY3VycmVkIHdoaWxlIHN1Ym1pdHRpbmcgeW91ciBhc3Nlc3NtZW50LiBQbGVhc2UgdHJ5IGFnYWluLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUubWVzc2FnZSA9IGVycm9yO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLm1lc3NhZ2UgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMDApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBXYXRjaGVzXHJcbiAgICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIENoYW5nZXMgdG8gcXVlc3Rpb25zLiBNb3N0bHkgdXNlZCBmb3IgaW5pdGlhbCBsb2FkLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoQ29sbGVjdGlvbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5xdWVzdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gb2xkVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlndXJlUGFnZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiAgU3dpdGNoaW5nIGJldHdlZW4gc3RlcHMgYW5kIHBhZ2VzIHJlcXVpcmVzIHJlYnVpbGRpbmcgdGhlIG5hdmlnYXRpb24gcGVyIHBhZ2UuZlxyXG4gICAgICAgICAgICAgKiBWYWxpZGF0aW9uIGNoZWNrcyB0byBzaG93IGFuZCBkaXNhYmxlIGJ1dHRvbnMgYXBwcm9wcmlhdGVseSByZXF1aXJlIHRoZSBvYmplY3QgYmUgcmVzZXQuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKFxyXG4gICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1cnJlbnRTdGVwSW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlb2Ygc2NvcGUuY3VycmVudFN0ZXAoKSA9PT0gXCJ1bmRlZmluZWRcIiA/IHNjb3BlLmN1cnJlbnRTdGVwSW5kZXggOiBzY29wZS5jdXJyZW50U3RlcCgpLmN1cnJlbnRQYWdlSW5kZXhcclxuICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZSAhPT0gb2xkVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1cnJlbnRTdGVwKCkuY3VycmVudFBhZ2UuY3JlYXRlTmF2aWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBDcmVhdGUgJ3BhZ2VzJ1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2NvcGUuc3RlcHMgPSBbXTtcclxuICAgICAgICAgICAgc2NvcGUuY3VycmVudFN0ZXBJbmRleCA9IC0xO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEdldHMgdGhlIGN1cnJlbnQgc3RlcCBvYmplY3QuXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtPYmplY3R9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzY29wZS5jdXJyZW50U3RlcCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNjb3BlLnN0ZXBzW3Njb3BlLmN1cnJlbnRTdGVwSW5kZXhdOyB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU3RlcCBjbGFzcy5cclxuICAgICAgICAgICAgICogUmVwcmVzZW50cyBhIG5vcm1hbCBzdGVwIHdpdGhpbiB0aGUgd2l6YXJkLlxyXG4gICAgICAgICAgICAgKiBFeHRlbnNpb25zIG9mIHRoaXMgY2xhc3MgY2FuIGJlIGJ1aWx0IGZvciBtb3JlIGNvbXBsZXggc3RlcHMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBjbGFzcyBTdGVwIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQ2xhc3MgY29uc3RydWN0b3IuXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ludH0gaW5kZXhcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvcihpbmRleCwgbmFtZSwgdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlcyA9IHRoaXMuY3JlYXRlUGFnZXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlSW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogIFJldHVybnMgdGhlIGN1cnJlbnQgcGFnZSBvZiB0aGlzIHN0ZXAuXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7UGFnZX1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZ2V0IGN1cnJlbnRQYWdlKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGNDdXJyZW50UGFnZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogIERldGVybWluZXMgaWYgdGhpcyBzdGVwIGlzIHRoZSBjdXJyZW50IHN0ZXAgd2l0aGluIHRoZSB3aXphcmQuXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7Qm9vbH1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZ2V0IGlzQ3VycmVudFN0ZXAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjb3BlLmN1cnJlbnRTdGVwSW5kZXggPT0gdGhpcy5pbmRleDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqICBTZXRzIHRoaXMgc3RlcCBhcyB0aGUgY3VycmVudCBzdGVwIHdpdGhpbiB0aGUgd2l6YXJkLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBzZXRDdXJyZW50U3RlcCgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJyZW50U3RlcEluZGV4ID0gdGhpcy5pbmRleDtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJyZW50U3RlcCgpLmN1cnJlbnRQYWdlSW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnNob3dSZXZpZXdBbmRTdWJtaXRQYWdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiAgR2V0cyB0aGUgY3VycmVudCBwYWdlIHdpdGhpbiB0aGlzIHN0ZXAuXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7UGFnZX1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY2FsY0N1cnJlbnRQYWdlKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhZ2VzW3RoaXMuY3VycmVudFBhZ2VJbmRleF07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBDcmVhdGVzIGJhc2ljIHRleHQgcGFnZXMgZm9yIGEgbm9ybWFsIHN0ZXAuXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNyZWF0ZVBhZ2VzKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdQYWdlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdTVEFSVCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3UGFnZXMucHVzaChuZXcgU3RhcnRQYWdlKDApKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSAnUkVWSUVXJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdQYWdlcy5wdXNoKG5ldyBSZXZpZXdQYWdlKDApKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSAnRU5EJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdQYWdlcy5wdXNoKG5ldyBFbmRQYWdlKDApKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld1BhZ2VzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogUXVlc3Rpb24gc3RlcCwgaW5oZXJpdHMgZnJvbSBTdGVwLlxyXG4gICAgICAgICAgICAgKiBSZXByZXNlbnRzIGEgc3RlcCB0aGF0IGNvbnRhaW5zIGEgbGlzdCBvZiBxdWVzdGlvbnMgdG8gYW5zd2VyLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY2xhc3MgUXVlc3Rpb25TdGVwIGV4dGVuZHMgU3RlcCB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIENsYXNzIGNvbnN0cnVjdG9yLlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtJbnR9IGluZGV4XHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IHF1ZXN0aW9uc1xyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvcihpbmRleCwgbmFtZSwgdHlwZSwgcXVlc3Rpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoaW5kZXgsIG5hbWUsIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnZXMgPSB0aGlzLmNyZWF0ZVBhZ2VzKHF1ZXN0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b3RhbFF1ZXN0aW9ucyA9IHF1ZXN0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiAgRGV0ZXJtaW5lcyBpZiBhbGwgcXVlc3Rpb25zIGluIGFsbCBwYWdlcyBmb3IgdGhpcyBzdGVwIGFyZSBtYXJrZWQgYXMgY29tcGxldGVkLlxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59IGlzdmFsaWRcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZ2V0IGlzQ29tcGxldGVkKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNhbGNTdGF0dXMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIENyZWF0ZSB0aGUgcGFnZXMgZm9yIHRoZSBjdXJyZW50IHN0ZXAgYmFzZWQgb24gb3VyIHBhZ2Ugc2l6ZSBhbmQgcXVlc3Rpb25zIHByb3ZpZGVkLlxyXG4gICAgICAgICAgICAgICAgICogRWFjaCBwYWdlIG9ubHkgY29udGFpbnMgcXVlc3Rpb25zIGZvciB0aGlzIHN0ZXAsIGV2ZW4gaWYgdGhlIGxhc3QgcGFnZSBkb2VzIG5vdCBmaWxsIHRoZSBwYWdlIHNpemUuXHJcbiAgICAgICAgICAgICAgICAgKiBpZS4gaWYgd2UgaGF2ZSBzZXZlbiBxdWVzdGlvbnMgd2l0aCBhIHBhZ2Ugc2l6ZSBvZiB0d28sIHdlJ2xsIGhhdmUgNCBwYWdlcyB3aGVyZSB0aGUgbGFzdCBwYWdlIG9ubHkgaGFzIG9uZSBxdWVzdGlvbi5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IHF1ZXN0aW9uc1xyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge0FycmF5fVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVQYWdlcyhxdWVzdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHF1ZXN0aW9ucyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3UGFnZXMgPSBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsUGFnZXMgPSBNYXRoLmNlaWwocXVlc3Rpb25zLmxlbmd0aCAvIHNjb3BlLnBhZ2VTaXplKSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbmRleCBvZiBmaXJzdCBxdWVzdGlvbiB3ZSB3YW50IHRvIGFkZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSAwLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluZGV4IG9mIGxhc3QgcXVlc3Rpb24gUExVUyBPTkUgd2Ugd2FudCB0byBhZGQgKGZvciB1c2Ugd2l0aCBzbGljZSkuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRJbmRleCA9IHN0YXJ0SW5kZXggKyArc2NvcGUucGFnZVNpemUsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25zRm9yUGFnZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdG90YWxQYWdlczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIHBhZ2Ugc2l6ZSBudW1iZXIgb2YgcXVlc3Rpb25zIGFuZCBjcmVhdGUgdGhlIHBhZ2Ugb2JqZWN0LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25zRm9yUGFnZSA9IHF1ZXN0aW9ucy5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocXVlc3Rpb25zRm9yUGFnZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3UGFnZXMucHVzaChuZXcgUXVlc3Rpb25QYWdlKGksIHF1ZXN0aW9uc0ZvclBhZ2UpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2cuZGVidWcoJ1NvbWV0aGluZyB3ZW50IHdyb25nIHdoaWxlIGZpbmRpbmcgcXVlc3Rpb25zIHRvIGFkZCB0byBwYWdlIGluZGV4ICcgKyB0aGlzLmluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzaGlmdCBvdXIgaW5kZXhlcy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSBlbmRJbmRleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZEluZGV4ICs9ICtzY29wZS5wYWdlU2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbG9nLmRlYnVnKG5ld1BhZ2VzLmxlbmd0aCArIFwiIHBhZ2VzIGNyZWF0ZWQgZm9yIHN0ZXA6IFwiICsgdGhpcy5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ld1BhZ2VzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIERldGVybWluZSBpZiBhbGwgYW5zd2VycyBoYXZlIGJlZW4gYW5zd2VyZWQuIFJldHVybnMgdC9mLlxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNhbGNTdGF0dXMoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQ29tcGxldGUgPSB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50cGFnZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdW5hbnN3ZXJlZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIGlmIGFueSBvZiBvdXIgcXVlc3Rpb25zIGhhdmUgYW4gZmFsc2V5IElzQW5zd2VyZWQgdmFsdWUgb3Igbm8gYW5zd2VyIGlkLlxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50cGFnZSA9IHRoaXMucGFnZXNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuYW5zd2VyZWQgPSBjdXJyZW50cGFnZS5xdWVzdGlvbnMuZmlsdGVyKGZ1bmN0aW9uIChxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcS5zZWxlY3RlZEFuc3dlcklkID09PSBudWxsIHx8IHEuc2VsZWN0ZWRBbnN3ZXJJZCA8PSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodW5hbnN3ZXJlZC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBsZXRlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNDb21wbGV0ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFBhZ2UgY2xhc3NcclxuICAgICAgICAgICAgICogUmVwcmVzZW50cyBhIHNpbmdsZSBwYWdlIHdpdGhpbiB0aGUgd2l6YXJkLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY2xhc3MgUGFnZSB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIENvbnN0cnVjdG9yIGZvciBjbGFzcy5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7SW50fSBpbmRleFxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvcihpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGluZGV4IHdpdGhpbiBhIHN0ZXAuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogTmF2aWdhdGUgdG8gdGhlIHByZXZpb3VzIHF1ZXN0aW9uLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBiYWNrKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHdlJ3JlIG9uIHRoZSBmaXJzdCBwYWdlIG9mIGEgc3RlcCwgcmV0dXJuIHRvIHRoZSBwcmV2aW91cyBzdGVwLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSwgaWYgd2UncmUgc3RpbGwgbmF2aWdhdGluZyB3aXRoaW4gdGhlIHNhbWUgc3RlcCwganVzdCB1cGRhdGUgdGhlIHBhZ2UgbnVtYmVyLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY29wZS5jdXJyZW50U3RlcCgpLmN1cnJlbnRQYWdlSW5kZXggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJyZW50U3RlcEluZGV4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY3VycmVudFN0ZXAoKS5jdXJyZW50UGFnZUluZGV4LS07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogTmF2aWdhdGUgdG8gdGhlIG5leHQgcXVlc3Rpb24uXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIG5leHQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgd2UncmUgc3RpbGwgbmF2aWdhdGluZyB3aXRoaW4gdGhlIHNhbWUgc3RlcCwganVzdCB1cGRhdGUgdGhlIHBhZ2UgbnVtYmVyLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSwgbW92ZSB0byB0aGUgbmV4dCBzdGVwLlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2VJbmRleCA9IHNjb3BlLmN1cnJlbnRTdGVwKCkuY3VycmVudFBhZ2VJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2VJbmRleCA9IHNjb3BlLmN1cnJlbnRTdGVwKCkucGFnZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFnZUluZGV4IDwgbGFzdFBhZ2VJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJyZW50U3RlcCgpLmN1cnJlbnRQYWdlSW5kZXgrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jdXJyZW50U3RlcEluZGV4Kys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmb2NlIHN0YXJ0IGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIHN0ZXAuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmN1cnJlbnRTdGVwKCkuY3VycmVudFBhZ2VJbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQ2FuY2VsIHRoZSBlbnRpcmUgYXNzZXNzbWVudC4gQWRkIGl0ZW1zIGhlcmUgaWYgd2UgbmVlZGVkIHRvIGRvIGFueSBjbGVhbnVwIG9uIHRoaXMgcGFnZSBiZWZvcmUgZXhpdGluZy5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY2FuY2VsKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogU2F2ZSBhbmQgZXhpdCB0aGUgZW50aXJlIGFzc2Vzc21lbnQuIEFkZCBpdGVtcyBoZXJlIGlmIHdlIG5lZWRlZCB0byBhbnkgY2xlYW51cCBvbiB0aGlzIHBhZ2UgYmVmb3JlIGV4aXRpbmcuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHNhdmVBbmRFeGl0KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNhdmVBbmRFeGl0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBUZXh0IGRlc2NyaXB0aW9uIG9mIHdoZXJlIHdlIGFyZSBpbiB0aGUgc3RlcC5cclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGdldCBuYXZpZ2F0aW9uU3RhdHVzKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQ3JlYXRlIG91ciBuYXZpZ2F0aW9uIGJ1dHRvbnMgYmFzZWQgb24gd2hhdCB3ZSB3YW50IHRoZSB1c2VyIHRvIGJlIGFibGUgdG8gZG8gYXQgdGhpcyBzdGVwLlxyXG4gICAgICAgICAgICAgICAgICogTmF2aWdhdGlvbiBidXR0b25zIGFyZSBzcGxpdCBvbiB0aGUgbGVmdCBhbmQgcmlnaHQgc2lkZXMgb2YgdGhlIHdpemFyZC5cclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtBcnJheX1cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlTmF2aWdhdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmF2ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiBbXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IFtdXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRpb24gPSBuYXY7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hdjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEZpcnN0IHBhZ2UsIGluaGVyaXRzIGZyb20gUGFnZS5cclxuICAgICAgICAgICAgICogRmlyc3QgcGFnZSBvZiB0aGUgd2l6YXJkLCBpZiBkZXNpcmVkLlxyXG4gICAgICAgICAgICAgKiBUaGlzIGNvdWxkIGNvbnRhaW4gaW5mb3JtYXRpb24gYWJvdXQgdGhlIHdpemFyZCdzIGNvbnRlbnQsIGluc3RydWN0aW9ucywgZXRjLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY2xhc3MgU3RhcnRQYWdlIGV4dGVuZHMgUGFnZSB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIENsYXNzIGNvbnN0cnVjdG9yLlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtJbnR9IGluZGV4XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQ3JlYXRlIG91ciBuYXZpZ2F0aW9uIGJ1dHRvbnMgYmFzZWQgb24gd2hhdCB3ZSB3YW50IHRoZSB1c2VyIHRvIGJlIGFibGUgdG8gZG8gYXQgdGhpcyBzdGVwLlxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVOYXZpZ2F0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuYXYgPSBzdXBlci5jcmVhdGVOYXZpZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmF2LnJpZ2h0LnB1c2gobmV3IE5hdkJ1dHRvbignQ29udGludWUnLCB0aGlzLm5leHQsIHRydWUsIHRydWUpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRpb24gPSBuYXY7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBRdWVzdGlvbiBQYWdlIGluaGVyaXRzIGZyb20gUGFnZVxyXG4gICAgICAgICAgICAgKiBSZXByZXNlbnRzIGEgcGFnZSBidWlsdCB1cCBvZiBxdWVzdGlvbnMgYXMgY29udGVudC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNsYXNzIFF1ZXN0aW9uUGFnZSBleHRlbmRzIFBhZ2Uge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBDbGFzcyBjb25zdHJ1Y3Rvci5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7SW50fSBpbmRleFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtBcnJheX0gcXVlc3Rpb25zXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKGluZGV4LCBxdWVzdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdXBlcihpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMgPSBxdWVzdGlvbnM7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBHZXQgdGhlIGZpcnN0IHF1ZXN0aW9uJ3MgbnVtYmVyLlxyXG4gICAgICAgICAgICAgICAgICogRGlzcGxheSB2ZXJzaW9uIG9mIHRoZSBpbmRleCwgMSBiYXNlZC5cclxuICAgICAgICAgICAgICAgICAqIEByZXR1cm5zIHtJbnR9XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGdldCBsb3dlckluZGV4KCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHF1ZXN0aW9uIG9yZGVyIGlzIHplcm8gYmFzZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVlc3Rpb25zWzBdLnF1ZXN0aW9uT3JkZXIgKyAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogRGV0ZXJtaW5lIGlmIHRoaXMgaXMgdGhlIGZpcnN0IHF1ZXN0aW9uIG9mIHRoZSBlbnRpcmUgd2l6YXJkLiBQcmV2ZW50cyB1c2luZyB0aGUgYmFjayBidXR0b24gY3VycmVudGx5LFxyXG4gICAgICAgICAgICAgICAgICogYnV0IHRoaXMgaXMgTk9UIGhvb2tlZCB1cCB0byB3b3JrIHdpdGggYSBTdGFydFBhZ2UgeWV0LlxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGdldCBpc0ZpcnN0UXVlc3Rpb25PZldpemFyZCgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNjb3BlLmN1cnJlbnRTdGVwKCkgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG9kbzogZmlsdGVyIHRvIHR5cGUgb2YgcXVlc3Rpb24gc3RlcC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RlcEluZGV4ID0gc2NvcGUuY3VycmVudFN0ZXBJbmRleCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFnZUluZGV4ID0gc2NvcGUuY3VycmVudFN0ZXAoKS5jdXJyZW50UGFnZUluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RlcEluZGV4ID09IDAgJiYgcGFnZUluZGV4ID09PSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEdldCB0aGUgbGFzdCBxdWVzdGlvbidzIG51bWJlci5cclxuICAgICAgICAgICAgICAgICAqIERpc3BsYXkgdmVyc2lvbiBvZiB0aGUgaW5kZXgsIDEgYmFzZWQuXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7SW50fVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBnZXQgdXBwZXJJbmRleCgpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBxdWVzdGlvbiBvcmRlciBpcyB6ZXJvIGJhc2VkLlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnF1ZXN0aW9ucy5zbGljZSgtMSlbMF0ucXVlc3Rpb25PcmRlciArIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBUZXh0dWFsIGRlc2NyaXB0aW9uIG9mIHdoZXJlIHdlIGFyZSB3aXRoaW4gdGhlIHN0ZXAuXHJcbiAgICAgICAgICAgICAgICAgKiBAcmV0dXJucyB7U3RyaW5nfVxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBnZXQgbmF2aWdhdGlvblN0YXR1cygpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sb3dlckluZGV4ID09PSB0aGlzLnVwcGVySW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiUXVlc3Rpb24gXCIgKyB0aGlzLmxvd2VySW5kZXggKyBcIiBvZiBcIiArIHNjb3BlLmN1cnJlbnRTdGVwKCkudG90YWxRdWVzdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJRdWVzdGlvbnMgXCIgKyB0aGlzLmxvd2VySW5kZXggKyBcIiAtIFwiICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBwZXJJbmRleCArIFwiIG9mIFwiICsgc2NvcGUuY3VycmVudFN0ZXAoKS50b3RhbFF1ZXN0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBBbGxvdyB1c2VyIHRvIG5hdmlnYXRlIGJldHdlZW4gcXVlc3Rpb24gcGFnZXMuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNyZWF0ZU5hdmlnYXRpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hdiA9IHN1cGVyLmNyZWF0ZU5hdmlnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBuYXYubGVmdC5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgTmF2QnV0dG9uKCdCYWNrJywgdGhpcy5iYWNrLCAhdGhpcy5pc0ZpcnN0UXVlc3Rpb25PZldpemFyZCwgZmFsc2UsIDApKTtcclxuICAgICAgICAgICAgICAgICAgICBuYXYubGVmdC5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgTmF2QnV0dG9uKCdDYW5jZWwnLCB0aGlzLmNhbmNlbCwgdHJ1ZSwgZmFsc2UsIDEpKTtcclxuICAgICAgICAgICAgICAgICAgICBuYXYucmlnaHQucHVzaChcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IE5hdkJ1dHRvbignQ29udGludWUnLCB0aGlzLm5leHQsIHRydWUsIGZhbHNlLCAxKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmF2LnJpZ2h0LnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBOYXZCdXR0b24oJ1NhdmUgYW5kIEV4aXQnLCB0aGlzLnNhdmVBbmRFeGl0LCB0cnVlLCBmYWxzZSwgMCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRpb24gPSBuYXY7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBSZXZpZXcgUGFnZSwgaW5oZXJpdHMgZnJvbSBQYWdlXHJcbiAgICAgICAgICAgICAqIFJldmlldyBhbmQgY29uZmlybSBwYWdlIG9mIHRoZSB3aXphcmQuXHJcbiAgICAgICAgICAgICAqIEluc3RydWN0cyB0aGUgdXNlciBvbiB0aGVpciBmaW5hbCBpbnN0cnVjdGlvbnMgb2YgdGhlIHdpemFyZC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNsYXNzIFJldmlld1BhZ2UgZXh0ZW5kcyBQYWdlIHtcclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQ2xhc3MgY29uc3RydWN0b3IuXHJcbiAgICAgICAgICAgICAgICAgKiBAcGFyYW0ge0ludH0gaW5kZXhcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY29uc3RydWN0b3IoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdXBlcihpbmRleCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBlbnRpcmUgd2l6YXJkIGlzIHZhbGlkLiBQcmV2ZW50cyBzdWJtaXNzaW9uIG9mIHRoZSBmb3JtLlxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGdldCBpc1ZhbGlkKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBhbnkgaW5jb21wbGV0ZSBzdGVwcywgdGhlIGZvcm0gaXMgaW52YWxpZC5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2NvcGUuc3RlcHMuZmlsdGVyKGZ1bmN0aW9uIChzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzLnR5cGUgPT09ICdRVUVTVElPTicgJiYgcy5pc0NvbXBsZXRlZCA9PT0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSkubGVuZ3RoID09PSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogR2V0IHRleHQgY29udGV4dCB0byBwcm92aWRlIGluc3RydWN0aW9ucyB0byB0aGUgdXNlci5cclxuICAgICAgICAgICAgICAgICAqIENvbnRleHQgZGVwZW5kcyBvbiB2YWxpZGl0eSBvZiBmb3JtLlxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZ2V0IGNvbnRlbnQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmFncmFwaHMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1ZhbGlkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFncmFwaHMucHVzaChcIllvdSBoYXZlIG5vdyBwcm92aWRlZCByZXNwb25zZXMgdG8gYWxsIHF1ZXN0aW9ucyBmb3IgdGhpcyBhc3Nlc3NtZW50LiBBdCB0aGlzIHBvaW50LCB5b3UgbWF5IGNsaWNrIHRoZSBcXFwiUmV2aWV3L0NoYW5nZSBSZXNwb25zZXNcXFwiIGJ1dHRvbiB0byBjaGFuZ2UgYW55IG9mIHlvdXIgcmVzcG9uc2VzLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYWdyYXBocy5wdXNoKFwiSWYgeW91IGFyZSBzYXRpc2ZpZWQgd2l0aCB5b3VyIGFuc3dlcnMsIHlvdSBtYXkgY2xpY2sgdGhlIFxcXCJTdWJtaXQgQXNzZXNzbWVudFxcXCIgYnV0dG9uIHRvIHN1Ym1pdCB5b3VyIGZpbmFsIGFuc3dlcnMuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYWdyYXBocy5wdXNoKFwiWW91IGhhdmUgbm90IGFuc3dlcmVkIGFsbCBvZiB0aGUgcXVlc3Rpb25zIGluIHRoZSBhc3Nlc3NtZW50LiBQbGVhc2Ugc2VsZWN0IG9uZSBhbnN3ZXIgZm9yIGV2ZXJ5IHF1ZXN0aW9uLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYWdyYXBocy5wdXNoKFwiVGhlIGluY29tcGxldGUgc3RlcHMgYXJlIGluZGljYXRlZCBhYm92ZSBpbiB0aGUgcHJvZ3Jlc3MgdHJhY2tlci4gQ2xpY2sgdGhlIGluY29tcGxldGUgc3RlcHMgdG8gY29tcGxldGUgdGhlIGFzc2Vzc21lbnQuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyYWdyYXBocztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIEFsbG93IHVzZXIgdG8gcmV0dXJuIHRvIHF1ZXN0aW9ucywgc2F2ZSwgb3Igc3VibWl0IGF0IHRoaXMgcGFnZS5cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlTmF2aWdhdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbmF2ID0gc3VwZXIuY3JlYXRlTmF2aWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5hdi5sZWZ0LnB1c2gobmV3IE5hdkJ1dHRvbignUmV2aWV3L0NoYW5nZSBSZXNwb25zZXMnLCB0aGlzLmJhY2ssIHRydWUsIGZhbHNlLCAwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbmF2LnJpZ2h0LnB1c2gobmV3IE5hdkJ1dHRvbignU3VibWl0IEFzc2Vzc21lbnQnLCBzY29wZS5zdWJtaXRBbmRFbmQsIHRydWUsICF0aGlzLmlzVmFsaWQsIDEpKTtcclxuICAgICAgICAgICAgICAgICAgICBuYXYucmlnaHQucHVzaChuZXcgTmF2QnV0dG9uKCdTYXZlIGFuZCBFeGl0Jywgc2F2ZUFuZEV4aXQsIHRydWUsIGZhbHNlLCAwKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGlvbiA9IG5hdjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIFRoZSBsYXN0IHBhZ2Ugb2YgdGhlIHdpemFyZC5cclxuICAgICAgICAgICAgICogVXNlZCB0byBwcm92aWRlIHRoZSBuZXh0IGF2YWlsYWJsZSBzdGVwcyB0byB0aGUgdXNlciBhZnRlciB0aGUgd2l6YXJkIGlzIGNvbXBsZXRlLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY2xhc3MgRW5kUGFnZSBleHRlbmRzIFBhZ2Uge1xyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBDbGFzcyBjb25zdHJ1Y3Rvci5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7SW50fSBpbmRleFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgY29uc3RydWN0b3IoaW5kZXgsIHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdXBlcihpbmRleCwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAgICAgKiBHZXQgdGV4dCBjb250ZXh0IHRvIHByb3ZpZGUgaW5zdHJ1Y3Rpb25zIHRvIHRoZSB1c2VyLlxyXG4gICAgICAgICAgICAgICAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZ2V0IGNvbnRlbnQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhcmFncmFwaHMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYWdyYXBocy5wdXNoKFwiWW91ciByZXNwb25zZXMgZm9yIHRoZSBcIiArIHNjb3BlLnRpdGxlICsgXCIgaGF2ZSBiZWVuIHN1Ym1pdHRlZC5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJhZ3JhcGhzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgICAgICogQWxsb3cgdXNlciB0byBvbmx5IGdvIHRvIHRoZSBhc3Nlc3NtZW50cyBwYWdlIGF0IHRoaXMgcG9pbnQuXHJcbiAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGNyZWF0ZU5hdmlnYXRpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hdiA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJpZ2h0OiBbXVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgbmF2LnJpZ2h0LnB1c2gobmV3IE5hdkJ1dHRvbignUmV2aWV3IFJlc3VsdHMnLCBzY29wZS5yZXZpZXcsIHRydWUsIGZhbHNlLCAwKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGlvbiA9IG5hdjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE5hdiBCdXR0b24gY2xhc3MuXHJcbiAgICAgICAgICAgICAqIEJ1aWxkcyBvdXQgdGhlIGF2YWlsYWJsZSBuYXZpZ2F0aW9uIG9wdGlvbnMuXHJcbiAgICAgICAgICAgICAqIEVuYWJsZWQvZGlzYWJsZSBhbmQgc2hvdy9oaWRlIGJhc2VkIG9uIHN0ZXAgb3IgcGFnZSBzdGF0dXNlcy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNsYXNzIE5hdkJ1dHRvbiB7XHJcbiAgICAgICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICAgICAqIENsYXNzIGNvbnN0cnVjdG9yLlxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IHRleHRcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmNcclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gZW5hYmxlZFxyXG4gICAgICAgICAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBoaWRkZW5cclxuICAgICAgICAgICAgICAgICAqIEBwYXJhbSB7SW50fSBvcmRlclxyXG4gICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjb25zdHJ1Y3Rvcih0ZXh0LCBmdW5jLCBlbmFibGVkLCBoaWRkZW4sIG9yZGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZ1bmMgPSBmdW5jO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlZCA9IGVuYWJsZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRkZW4gPSBoaWRkZW47XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcmRlciA9IG9yZGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQ3JlYXRlIGFsbCBvZiBvdXIgcGFnZXMgZm9yIGVhY2ggY2F0ZWdvcnkuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBjb25maWd1cmVQYWdlcygpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvdWxkIG1vdmUgYSBsb3Qgb2YgdGhpcyBsb2dpYyBpbnRvIHRoZSBjb250cm9sbGVyIHRvIG1ha2UgdGhpcyBkaXJlY3RpdmVcclxuICAgICAgICAgICAgICAgIC8vIG1vcmUgcmV1c2FibGUuIENvbnNpZGVyIGZvciBsYXRlciBhbmQgZGlmZmVyZW50IHR5cGVzIG9mIGFzc2Vzc21lbnRzLlxyXG5cclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBzdGFydCBwYWdlLlxyXG4gICAgICAgICAgICAgICAgLy8gTkEgLSB3ZSBkb24ndCBoYXZlIG9uZSBmb3Igbm93LiBXaWxsIG5lZWQgdG8gYWx0ZXIgc3RhcnRpbmcgaW5kZXggZm9yIHF1ZXN0aW9ucy5cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBncm91cCBxdWVzdGlvbnMgYnkgY2F0ZWdvcnkgbmFtZS5cclxuICAgICAgICAgICAgICAgIGxldCBncm91cGVkID0gc2NvcGUucXVlc3Rpb25zLmdyb3VwKHF1ZXN0aW9uID0+IHF1ZXN0aW9uLmNhdGVnb3J5TmFtZSksXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZ3JvdXBlZCB3aWxsIGxvb2sgbGlrZSBbIHsga2V5OiAnY2F0bmFtZScsIGRhdGE6IFsgLi4uY2F0cy4uLiBdIH0sIC4uIF1cclxuICAgICAgICAgICAgICAgIC8vIHRha2UgZWFjaCBncm91cCBhbmQgY3JlYXRlIGEgbmV3IHN0ZXAgZnJvbSBpdC5cclxuICAgICAgICAgICAgICAgICAgICBzdGVwSW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuc3RlcHMgPSBncm91cGVkLm1hcChmdW5jdGlvbiAoZ3JvdXAsIGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBRdWVzdGlvblN0ZXAoKHN0ZXBJbmRleCArIGluZGV4KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAua2V5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnUVVFU1RJT04nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cC5kYXRhKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSByZXZpZXcgcGFnZS5cclxuICAgICAgICAgICAgICAgIHNjb3BlLnN0ZXBzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IFN0ZXAoKHNjb3BlLnN0ZXBzLmxlbmd0aCAtIDEpLCAnUmV2aWV3JywgJ1JFVklFVycpXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBlbmQgcGFnZS5cclxuICAgICAgICAgICAgICAgIHNjb3BlLnN0ZXBzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IFN0ZXAoKHNjb3BlLnN0ZXBzLmxlbmd0aCAtIDEpLCAnRW5kJywgJ0VORCcpXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFN0YXJ0IHVzIG9mZiBhdCB0aGUgZmlyc3Qgc3RlcC5cclxuICAgICAgICAgICAgICAgIHNjb3BlLmN1cnJlbnRTdGVwSW5kZXggPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIExldCB0aGUgVUkga25vdyB3ZSBoYXZlIGV2ZXJ5dGhpbmcgd2UgbmVlZC5cclxuICAgICAgICAgICAgICAgIHNjb3BlLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFzc2Vzc21lbnQnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BiV2l6YXJkUXVlc3Rpb25QYWdlJywgV2l6YXJkUXVlc3Rpb25QYWdlKTtcclxuXHJcbiAgICBXaXphcmRRdWVzdGlvblBhZ2UuJGluamVjdCA9IFsnJGxvZyddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlyZWN0aXZlIHRvIGhhbmRsZSBlYWNoIGluZGl2aWR1YWwgcGFnZSBvZiB0aGUgd2FyZC5cclxuICAgICAqIEBwYXJhbSB7dHlwZX0gJGxvZ1xyXG4gICAgICogQHJldHVybnMge3R5cGV9XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFdpemFyZFF1ZXN0aW9uUGFnZSgkbG9nKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwL2Fzc2Vzc21lbnQvd2l6YXJkL3dpemFyZC5xdWVzdGlvbi5wYWdlLmh0bWwnLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgcGFnZTogJz0nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLmFzc2Vzc21lbnQnKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BiV2l6YXJkU3RhdHVzJywgV2l6YXJkU3RhdHVzKTtcclxuXHJcbiAgICBXaXphcmRTdGF0dXMuJGluamVjdCA9IFsnJGxvZyddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlyZWN0aXZlIGZvciBzdGF0dXMvcHJvZ3Jlc3MgdmlzdWFsaXphdGlvbiB3aXRoaW4gd2l6YXJkLlxyXG4gICAgICogQHBhcmFtIHskbG9nfSAkbG9nXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBXaXphcmRTdGF0dXMoJGxvZykge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC9hc3Nlc3NtZW50L3dpemFyZC93aXphcmQuc3RhdHVzLmh0bWwnLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgc3RlcHM6ICc9JyxcclxuICAgICAgICAgICAgICAgIHNob3dJbnZhbGlkU3R5bGVzOiAnPSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTGluayBmdW5jdGlvblxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzY29wZVxyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IGVsZW1lbnRcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBhdHRyc1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIC8vIEluaXRhbGl6ZSBpdGVtcy5cclxuICAgICAgICAgICAgc2NvcGUuc3RlcFdpZHRoUGVyY2VudGFnZSA9IDEyO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIENoYW5nZXMgdG8gcXVlc3Rpb25zLiBNb3N0bHkgdXNlZCBmb3IgaW5pdGlhbCBsb2FkLlxyXG4gICAgICAgICAgICBzY29wZS4kd2F0Y2hDb2xsZWN0aW9uKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnN0ZXBzXHJcbiAgICAgICAgICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUgIT09IG9sZFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFN0ZXBzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogRmlsdGVyIHN0ZXBzIHRvIHF1ZXN0aW9uIHN0ZXBzIG9ubHkuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRTdGVwcygpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnN0ZXBzVG9TaG93ID0gc2NvcGUuc3RlcHMuZmlsdGVyKGZ1bmN0aW9uIChzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHMudHlwZSA9PT0gJ1FVRVNUSU9OJztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHNldFN0ZXBTdHlsZXMoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIENhbGN1bGF0ZSB0aGUgc3RlcCBwZXJjZW50YWdlIGJhc2VkIG9uIHRoZSB0b3RhbCBudW1iZXIgb2Ygc3RlcHMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBzZXRTdGVwU3R5bGVzKCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHRvdGFsU3RlcHMgPSBzY29wZS5zdGVwc1RvU2hvdy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxTZWN0aW9ucyA9IHRvdGFsU3RlcHMgKyAodG90YWxTdGVwcyAqIDAuMjUpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsV2lkdGggPSAxMDA7XHJcblxyXG4gICAgICAgICAgICAgICAgc2NvcGUuc3RlcFdpZHRoUGVyY2VudGFnZSA9IHRvdGFsV2lkdGggLyB0b3RhbFNlY3Rpb25zOyAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucGxheWJvb2snKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdDb21taXRtZW50Q29udHJvbGxlcicsIENvbW1pdG1lbnRDb250cm9sbGVyKTtcclxuXHJcbiAgICBDb21taXRtZW50Q29udHJvbGxlci4kaW5qZWN0ID0gWydwbGF5Ym9va0RhdGFTZXJ2aWNlJywgJyRsb2cnLCAnJHRpbWVvdXQnLCAnJHEnLCAnJHJvb3RTY29wZScsICckc2NvcGUnLCAnJG1vbWVudCddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udHJvbGxlciByZXNwb25zaWJsZSBmb3IgYWxsIGFjdGlvbnMgcmVsYXRlZCB0byB0YWtpbmcgYW5kIHJldmlld2luZyBhbiBhc3Nlc3NtZW50LlxyXG4gICAgICogQHBhcmFtIHtwbGF5Ym9va0RhdGFTZXJ2aWNlfSBwbGF5Ym9va0RhdGFTZXJ2aWNlXHJcbiAgICAgKiBAcGFyYW0geyRsb2d9ICRsb2dcclxuICAgICAqIEBwYXJhbSB7JHRpbWVvdXR9ICR0aW1lb3V0XHJcbiAgICAgKiBAcGFyYW0geyRxfSAkcVxyXG4gICAgICogQHBhcmFtIHskcm9vdFNjb3BlfSAkcm9vdFNjb3BlXHJcbiAgICAgKiBAcGFyYW0geyRzY29wZX0gJHNjb3BlIGxvY2FsIHNjb3BlXHJcbiAgICAgKiBAcGFyYW0geyRtb21lbnR9ICRtb21lbnQgbW9tZW50anMgbGlicmFyeVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBDb21taXRtZW50Q29udHJvbGxlcihwbGF5Ym9va0RhdGFTZXJ2aWNlLCAkbG9nLCAkdGltZW91dCwgJHEsICRyb290U2NvcGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZSwgJG1vbWVudCkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIEluZGljYXRpb24gaWYgdGhlIGRhdGEgaGFzIGxvYWRlZCBmb3IgdGhlIFVJLlxyXG4gICAgICAgIHZtLmxvYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvLyBJbmZvIG1lc3NhZ2UgcmVnYXJkaW5nIGNvbW1pdG1lbnRzIG9ubHkuXHJcbiAgICAgICAgdm0uaW5mbyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vIEVycm9yIG1lc3NhZ2UuXHJcbiAgICAgICAgdm0uZXJyb3IgPSBudWxsO1xyXG5cclxuICAgICAgICAvLyBGb3JtYXR0ZWQgY2F0ZWdvcmllcyB0aGF0IGEgY29tbWl0bWVudCBjYW4gcmVsYXRlIHRvLlxyXG4gICAgICAgIC8vIEluY2x1ZGVzIGNoaWxkIHF1ZXN0aW9ucy5cclxuICAgICAgICB2bS5jYXRlZ29yaWVzID0gW107XHJcblxyXG4gICAgICAgIC8vIFBsYXlib29rIGlkIHRoYXQgYWxsIGNvbW1pdG1lbnRzIGhlcmUgYmVsb25nIHRvLlxyXG4gICAgICAgIHZtLnBsYXlib29rSWQgPSBudWxsO1xyXG5cclxuICAgICAgICAvLyBBbGwgY29tbWl0bWVudHMgZm9yIHRoZSBwbGF5Ym9vay5cclxuICAgICAgICB2bS5jb21taXRtZW50cyA9IFtdO1xyXG5cclxuICAgICAgICAvLyBSZXN0cmljdCBmaWVsZHMgaWYgdGhlIHVzZXIgZG9lc250JyBvd24gdGhlIHBsYXlib29rLlxyXG4gICAgICAgIHZtLmNhbkVkaXRQbGF5Ym9vayA9IGZhbHNlOyAxXHJcblxyXG4gICAgICAgIC8vIFNob3dzL2hpZGVzIHN1Z2dlc3Rpb25zIGZvciBjb21taXRtZW50cyBiYXNlZCBvbiByZXN1bHRzLlxyXG4gICAgICAgIHZtLmVuYWJsZVN1Z2dlc3Rpb25zID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgLy8gRm9ybSBvYmplY3QgZm9yIGFkZGluZyBhbmQgZWRpdGluZyBhIGNvbW1pdG1lbnQuXHJcbiAgICAgICAgdm0uZm9ybSA9IHtcclxuICAgICAgICAgICAgLy8gTW9kYWwgdGl0bGUuXHJcbiAgICAgICAgICAgIHRpdGxlOiBudWxsLFxyXG5cclxuICAgICAgICAgICAgLy8gTWV0aG9kIHRvIGNhbGwgd2hlbiBtb2RhbCBzYXZlIGJ1dHRvbiBpcyBpbnZva2VkLlxyXG4gICAgICAgICAgICBvblNhdmU6IG51bGwsXHJcblxyXG4gICAgICAgICAgICAvLyBNZXRob2QgdG8gY2FsbCB3aGVuIG1vZGFsIGNhbmNlbC9jbG9zZSBidXR0b24gaXMgaW52b2tlZC5cclxuICAgICAgICAgICAgb25DbG9zZTogbnVsbCxcclxuXHJcbiAgICAgICAgICAgIC8vIEluZGljYXRpb24gaWYgZm9ybSBoYXMgYmVlbiBzdWJtaXR0ZWQuIFNob3dzIHZhbGlkYXRpb24gZXJyb3JzIHdoZW4gdHJ1ZS5cclxuICAgICAgICAgICAgc3VibWl0dGVkOiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgIC8vIEluZGljYXRpb24gaWYgZm9ybSBtb2RhbCBzaG91bGQgYmUgZGlzcGxheWVkLlxyXG4gICAgICAgICAgICBzaG93OiBmYWxzZSxcclxuXHJcbiAgICAgICAgICAgIC8vIEZvcm0gZGF0YSBiYXNlZCBvbiBjb21taXRtZW50LlxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogbnVsbCxcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgZHVlRGF0ZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIGlkOiBudWxsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBBdmFpbGFibGUgc3RhdHVzZXMgZm9yIGNvbW1pdG1lbnRzLlxyXG4gICAgICAgIHZtLnN0YXR1c2VzID0gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnSW4tcHJvZ3Jlc3MnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6ICdJTl9QUk9HUkVTUydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ0ltcGxlbWVudGVkJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAnSU1QTEVNRU5URUQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdQbGFubmVkJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiAnUExBTk5FRCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIC8vIE1ldGhvZHMuXHJcbiAgICAgICAgdm0uc2hvd0FkZENvbW1pdG1lbnRGb3JtID0gc2hvd0FkZENvbW1pdG1lbnRGb3JtO1xyXG4gICAgICAgIHZtLmFkZCA9IGFkZDtcclxuICAgICAgICB2bS5zaG93RWRpdENvbW1pdG1lbnRGb3JtID0gc2hvd0VkaXRDb21taXRtZW50Rm9ybTtcclxuICAgICAgICB2bS51cGRhdGUgPSB1cGRhdGU7XHJcbiAgICAgICAgdm0ucmVtb3ZlID0gcmVtb3ZlO1xyXG4gICAgICAgIHZtLnNldEZvcm1DYXRlZ29yeUlkID0gc2V0Rm9ybUNhdGVnb3J5SWQ7XHJcbiAgICAgICAgdm0uc2V0Rm9ybVF1ZXN0aW9uSWQgPSBzZXRGb3JtUXVlc3Rpb25JZDtcclxuICAgICAgICB2bS5zZXRGb3JtU3RhdHVzVmFsdWUgPSBzZXRGb3JtU3RhdHVzVmFsdWU7XHJcbiAgICAgICAgdm0uc2V0Rm9ybUR1ZURhdGVWYWx1ZSA9IHNldEZvcm1EdWVEYXRlVmFsdWU7XHJcbiAgICAgICAgdm0uYWN0aXZhdGUgPSBhY3RpdmF0ZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2F0ZWdvcnkgT2JqZWN0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNsYXNzIENhdGVnb3J5IHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIENyZWF0ZXMgYSBuZXcgQ2F0ZWdvcnkuXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7SW50fSBpZFxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge0RvdWJsZX0gc2NvcmVcclxuICAgICAgICAgICAgICogQHBhcmFtIHtBcnJheX0gcXVlc3Rpb25zXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBjb25zdHJ1Y3RvcihpZCwgbmFtZSwgc2NvcmUsIHF1ZXN0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5pZCA9IGlkO1xyXG4gICAgICAgICAgICAgICAgdGhhdC5uYW1lID0gbmFtZTtcclxuICAgICAgICAgICAgICAgIHRoYXQuc2NvcmUgPSBzY29yZTtcclxuICAgICAgICAgICAgICAgIHRoYXQucXVlc3Rpb25zID0gcXVlc3Rpb25zLm1hcChmdW5jdGlvbiAocSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUXVlc3Rpb24ocS5xdWVzdGlvbklkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcS5xdWVzdGlvblRleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxLmFuc3dlcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxLnNlbGVjdGVkQW5zd2VySWQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBCdWlsZHMgdGhlIHRleHQgdG8gc2hvdyBpbiB0aGUgZHJvcGRvd24gd2hlbiBzZWxlY3RpbmcgYSBjYXRlZ29yeSBmb3IgYSBjb21taXRtZW50LlxyXG4gICAgICAgICAgICAgKiBBY2NvdW50cyBmb3Igd2hldGhlciBzdWdnZXN0aW9ucyBhcmUgZW5hYmxlZC5cclxuICAgICAgICAgICAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGdldCBvcHRpb25UZXh0KCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZtLmVuYWJsZVN1Z2dlc3Rpb25zID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubmFtZSArICcgKCcgKyBNYXRoLnJvdW5kKCt0aGlzLnNjb3JlICogMTAwLCAwKSArICclKSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5uYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgKiBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIHNob3VsZCBjcmVhdGUgY29tbWl0bWVudHMgZm9yIHRoaXMgY2F0ZWdvcnkgYmFzZWQgb246XHJcbiAgICAgICAgICAgICogRGlkbid0IGFuc3dlciB0aGUgYmVzdCBhbnN3ZXJzIGZvciBhbGwgcXVlc3Rpb25zIHdpdGhpbiB0aGUgY2F0ZWdvcnkgYW5kIGRvZXNuJ3QgaGF2ZSBBTlkgY29tbWl0bWVudHMuXHJcbiAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGdldCBuZWVkc0NvbW1pdG1lbnRzKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY291bGRCZUltcHJvdmVkKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAqIEdldHMgdGhlIGxpc3Qgb2YgY29tbWl0bWVudHMgZGlyZWN0bHkgbGlua2VkIHRvIHRoaXMgY2F0ZWdvcnkuXHJcbiAgICAgICAgICAgICogQHJldHVybnMge0FycmF5fVxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBnZXRDb21taXRtZW50cygpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjYXRlZ29yeUlkID0gdGhpcy5pZDtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5jb21taXRtZW50cy5maWx0ZXIoZnVuY3Rpb24gKGMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYy5jYXRlZ29yeUlkID09PSBjYXRlZ29yeUlkO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIERldGVybWluZXMgaWYgdGhlIHVzZXIgY291bGQgbWFrZSBpbXJwb3ZlbWVudHMgdG8gdGhlIGNhdGVnb3J5IGJhc2VkIG9uIHRoZWlyIHJlc3BvbnNlcy5cclxuICAgICAgICAgICAgICogQ291bGQgbGF0ZXIgZGV0ZXJtaW5lIHRoZSBwZXJjZW50YWdlIG9mIHF1ZXN0aW9ucyB0aGF0IGhhdmUgY29tbWl0bWVudHMgd2l0aGluIHRoZSBjYXRlZ29yeS5cclxuICAgICAgICAgICAgICogQHJldHVybnMge0Jvb2xlYW59XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBjb3VsZEJlSW1wcm92ZWQoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRDb21taXRtZW50cygpLmxlbmd0aCA9PT0gMCAmJiAhaXNOYU4odGhpcy5zY29yZSkgJiYgdGhpcy5zY29yZSA8IDEuMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUXVlc3Rpb24gb2JqZWN0LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNsYXNzIFF1ZXN0aW9uIHtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgYSBRdWVzdGlvbi5cclxuICAgICAgICAgICAgICogQHBhcmFtIHtJbnR9IGlkXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IGFuc3dlcnNcclxuICAgICAgICAgICAgICogQHBhcmFtIHtJbnR9IHNlbGVjdGVkQW5zd2VySWRcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNvbnN0cnVjdG9yKGlkLCB0ZXh0LCBhbnN3ZXJzLCBzZWxlY3RlZEFuc3dlcklkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGF0LmlkID0gaWQ7XHJcbiAgICAgICAgICAgICAgICB0aGF0LnRleHQgPSB0ZXh0O1xyXG4gICAgICAgICAgICAgICAgdGhhdC5hbnN3ZXJzID0gYW5zd2VycztcclxuICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRBbnN3ZXJJZCA9IHNlbGVjdGVkQW5zd2VySWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBWZXJ5IGhhY2t5LCB1bnN0YWJsZSB3YXkgdG8gZ2V0IHRoZSBiZXN0IGFuc3dlci4gQXNzdW1lcyBpdCdzXHJcbiAgICAgICAgICAgICAqIG9yZGVyZWQgY29ycmVjdGx5IGFuZCBpdHMgdGhlIHNlY29uZCB0byBsYXN0IGFuc3dlci4gTm90IGxhc3QgYmVjYXVzZSB0aGF0IGlzIE5BLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZ2V0IGJlc3RBbnN3ZXIoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hbnN3ZXJzW3RoaXMuYW5zd2Vycy5sZW5ndGggLSAyXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEdldHMgdGhlIGFuc3dlciBvYmplY3QgdGhhdCB3YXMgc2VsZWN0ZWQgZHVyaW5nIHRoZSBhc3Nlc3NtZW50LlxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZ2V0IHNlbGVjdGVkQW5zd2VyKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkID0gdGhpcy5zZWxlY3RlZEFuc3dlcklkO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYW5zd2Vycy5maW5kKGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEuaWQgPT09IHNlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBCdWlsZHMgdGhlIHRleHQgdG8gc2hvdyBpbiB0aGUgZHJvcGRvd24gd2hlbiBzZWxlY3RpbmcgYSBxdWVzdGlvbiBmb3IgYSBjb21taXRtZW50LlxyXG4gICAgICAgICAgICAgKiBBY2NvdW50cyBmb3Igd2hldGhlciBzdWdnZXN0aW9ucyBhcmUgZW5hYmxlZC5cclxuICAgICAgICAgICAgICogQHJldHVybnMge1N0cmluZ31cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGdldCBvcHRpb25UZXh0KCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZtLmVuYWJsZVN1Z2dlc3Rpb25zID09PSB0cnVlICYmIHRoaXMubmVlZHNDb21taXRtZW50KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0ICsgJyAqJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRleHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBHZXRzIHRoZSBsaXN0IG9mIGNvbW1pdG1lbnRzIGRpcmVjdGx5IGxpbmtlZCB0byB0aGlzIHF1ZXN0aW9uLlxyXG4gICAgICAgICAgICAgKiBAcmV0dXJucyB7QXJyYXl9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBnZXRDb21taXRtZW50cygpIHtcclxuICAgICAgICAgICAgICAgIHZhciBxdWVzdGlvbklkID0gdGhpcy5pZDtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2bS5jb21taXRtZW50cy5maWx0ZXIoZnVuY3Rpb24gKGMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYy5xdWVzdGlvbklkID09PSBxdWVzdGlvbklkO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBEZXRlcm1pbmVzIGlmIHRoZSB1c2VyIHNob3VsZCBjcmVhdGUgYSBjb21taXRtZW50IGZvciB0aGlzIHF1ZXN0aW9uIGJhc2VkIG9uOlxyXG4gICAgICAgICAgICAgKiBEaWRuJ3Qgc2VsZWN0IHRoZSBiZXN0IGFuc3dlciBhbmQgZG9lc24ndCBoYXZlIGEgY29tbWl0bWVudCBkaXJlY3RseSBsaW5rZWQgdG8gaXQuXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgbmVlZHNDb21taXRtZW50KCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Q29tbWl0bWVudHMoKS5sZW5ndGggPT09IDAgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQW5zd2VyLmlkICE9PSB0aGlzLmJlc3RBbnN3ZXIuaWQgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQW5zd2VyLnRleHQudG9Mb3dlckNhc2UoKSAhPT0gXCJub3QgYXBwbGljYWJsZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbml0aWFsaXplcyB0aGUgY29udHJvbGxlci5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICAgICAgICAgICAgdm0uZm9ybS5zaG93ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBwbGF5Ym9va0NvbnRyb2xsZXIgPSAkc2NvcGUucGMsXHJcbiAgICAgICAgICAgICAgICBwbGF5Ym9vayA9IHBsYXlib29rQ29udHJvbGxlci5jdXJyZW50LmRldGFpbHM7XHJcbiAgICAgICAgICAgIGNoYW5nZVBsYXlib29rKHBsYXlib29rKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNldHMgdXAgYWxsIGNvbW1pdG1lbnQgZGF0YSBmb3IgdGhlIHBsYXlib29rLlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwbGF5Ym9va1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVBsYXlib29rKHBsYXlib29rKSB7XHJcbiAgICAgICAgICAgIHZtLnBsYXlib29rSWQgPSBwbGF5Ym9vay5pZDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGxheWJvb2suY29tbWl0bWVudHMgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgIHZtLmNvbW1pdG1lbnRzID0gcGxheWJvb2suY29tbWl0bWVudHM7XHJcbiAgICAgICAgICAgICAgICB2bS5jYW5FZGl0UGxheWJvb2sgPSBwbGF5Ym9vay5pc093bmVkQnlNZSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheWJvb2suaXNBcmNoaXZlZCA9PT0gZmFsc2UgJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUucGMuY3VycmVudC5tb2RlID09PSAkc2NvcGUucGMubW9kZXMuZWRpdDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwbGF5Ym9vay50ZWFtQXNzZXNzbWVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgdm0uY2F0ZWdvcmllcyA9IGdldENhdGVnb3J5TGlzdChwbGF5Ym9vay50ZWFtQXNzZXNzbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZtLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBXYXRjaGVzIGZvciBjaGFuZ2VzIHRvIHRoZSBjdXJyZW50IHBsYXlib29rIGFuZCBzZXRzdXAgY29tbWl0bWVudCBkYXRhIGZvciBpdC5cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gbmV3VmFsdWVcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb2xkVmFsdWVcclxuICAgICAgICAgKiBAcGFyYW0geyRzY29wZX0gc2NvcGUpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgJHNjb3BlLiR3YXRjaCgncGMuY3VycmVudC5kZXRhaWxzLmlkJywgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSwgc2NvcGUpIHtcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSBvbGRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBsYXlib29rID0gJHNjb3BlLnBjLmN1cnJlbnQuZGV0YWlscztcclxuICAgICAgICAgICAgICAgIGNoYW5nZVBsYXlib29rKHBsYXlib29rKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTYXZlcyBvZmYgdGhlIGNhdGVnb3J5IGlkIGFuZCBuYW1lIHNlcGFyYXRlbHkuXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGNhdGVnb3J5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0Rm9ybUNhdGVnb3J5SWQoY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgdm0uZm9ybS5kYXRhLmNhdGVnb3J5SWQgPSBjYXRlZ29yeS5pZDtcclxuICAgICAgICAgICAgdm0uZm9ybS5kYXRhLmNhdGVnb3J5TmFtZSA9IGNhdGVnb3J5Lm5hbWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTYXZlcyBvZmYgdGhlIHF1ZXN0aW9uIGlkIHNlcGFyYXRlbHkuXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHF1ZXN0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0Rm9ybVF1ZXN0aW9uSWQocXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5mb3JtLmRhdGEucXVlc3Rpb25JZCA9IHF1ZXN0aW9uLmlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTYXZlcyBvZmYgdGhlIHN0YXR1cyBpZCBzZXBhcmF0ZWx5LlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzdGF0dXNcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBzZXRGb3JtU3RhdHVzVmFsdWUoc3RhdHVzKSB7XHJcbiAgICAgICAgICAgIHZtLmZvcm0uZGF0YS5zdGF0dXMgPSBzdGF0dXMudmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXRzIHRoZSBtb2RlbCBkdWUgZGF0ZSB0byB0aGUgdXRjIHZlcnNpb24gb2YgdGhlIHVpLCBsb2NhbCBkYXRlIHNlbGVjdGVkIGJ5IHRoZSB1c2VyLlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0Rm9ybUR1ZURhdGVWYWx1ZShkYXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICAgICAgICAgIHZtLmZvcm0uZGF0YS5kdWVEYXRlID0gJG1vbWVudC51dGMoZCkudG9JU09TdHJpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNldHMgdGhlIGNhdGVnb3J5IGxpc3QuXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHRlYW1Bc3Nlc3NtZW50XHJcbiAgICAgICAgICogQHJldHVybnMge0FycmF5fSBjYXRlZ29yeSBsaXN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0Q2F0ZWdvcnlMaXN0KHRlYW1Bc3Nlc3NtZW50KSB7XHJcbiAgICAgICAgICAgIHZhciBjYXRlZ29yaWVzID0gdGVhbUFzc2Vzc21lbnQuY2F0ZWdvcnlSZXN1bHRzLm1hcChmdW5jdGlvbiAoY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgICAgIC8vIEdldCBxdWVzdGlvbnMgZm9yIHRoZSBjYXRlZ29yeS5cclxuICAgICAgICAgICAgICAgIHZhciBxdWVzdGlvbkxpc3QgPSB0ZWFtQXNzZXNzbWVudC5xdWVzdGlvbnMuZmlsdGVyKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5jYXRlZ29yeU5hbWUgPT09IGNhdGVnb3J5Lm5hbWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENhdGVnb3J5KGNhdGVnb3J5LmNhdGVnb3J5SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGVnb3J5LnNjb3JlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbkxpc3QpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGNhdGVnb3JpZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTaG93cyB0aGUgYWRkIGNvbW1pdG1lbnQgZGlhbG9nIGZvcm0uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd0FkZENvbW1pdG1lbnRGb3JtKCkge1xyXG4gICAgICAgICAgICB2bS5mb3JtLmRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogbnVsbCxcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgZHVlRGF0ZTogbnVsbFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2bS5mb3JtLnRpdGxlID0gXCJBZGQgQ29tbWl0bWVudFwiO1xyXG4gICAgICAgICAgICB2bS5mb3JtLm9uU2F2ZSA9IHZtLmFkZDtcclxuICAgICAgICAgICAgdm0uZm9ybS5vbkNsb3NlID0gdm0uZm9ybS5zaG93ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB2bS5mb3JtLnNob3cgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQWRkcyBhIG5ldyBjb21taXRtZW50IHRvIHRoZSBwbGF5Ym9vay5cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBhZGQoKSB7XHJcbiAgICAgICAgICAgIHZtLmVycm9yID0gbnVsbDtcclxuICAgICAgICAgICAgdm0uZm9ybS5zdWJtaXR0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgLy8gU2hvdyB2YWxpZGF0aW9uIG1lc3NhZ2VzIGlmIG5lZWRlZC5cclxuICAgICAgICAgICAgaWYgKCF2bS5mb3JtLiR2YWxpZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTYXZlIGFuZCBzaG93IGZlZWRiYWNrIHRvIHRoZSB1c2VyLlxyXG4gICAgICAgICAgICBwbGF5Ym9va0RhdGFTZXJ2aWNlLmNyZWF0ZUNvbW1pdG1lbnRGb3JQbGF5Ym9vayh2bS5wbGF5Ym9va0lkLCB2bS5mb3JtLmRhdGEpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmluZm8gPSBcIkNvbW1pdG1lbnQgY3JlYXRlZCBzdWNjZXNzZnVsbHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmluZm8gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgY2F0IG5hbWUgb2YgdGhlIGNvbW1pdG1lbnQgc2luY2UgaXQncyBub3QgcmV0dXJuZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5jYXRlZ29yeU5hbWUgPSB2bS5mb3JtLmRhdGEuY2F0ZWdvcnlOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmNvbW1pdG1lbnRzLnB1c2goZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5lcnJvciA9IFwiRmFpbGVkIHRvIGNyZWF0ZSBjb21taXRtZW50LlwiO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5mb3JtLnN1Ym1pdHRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmZvcm0uc2hvdyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmZvcm0uZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2hvd3MgdGhlIGVkaXQgY29tbWl0bWVudCBmb3JtXHJcbiAgICAgICAgICogQHBhcmFtIHt0eXBlfSBjb21taXRtZW50XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd0VkaXRDb21taXRtZW50Rm9ybShjb21taXRtZW50KSB7XHJcbiAgICAgICAgICAgIHZtLmZvcm0uZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiB2bS5jYXRlZ29yaWVzLmZpbmQoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMuaWQgPT09IGNvbW1pdG1lbnQuY2F0ZWdvcnlJZDsgfSksXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeUlkOiBjb21taXRtZW50LmNhdGVnb3J5SWQsXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeU5hbWU6IGNvbW1pdG1lbnQubmFtZSxcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uSWQ6IGNvbW1pdG1lbnQucXVlc3Rpb25JZCxcclxuICAgICAgICAgICAgICAgIG5hbWU6IGNvbW1pdG1lbnQubmFtZSxcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBjb21taXRtZW50LmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgc3RhdHVzT2JqOiB2bS5zdGF0dXNlcy5maW5kKGZ1bmN0aW9uIChzKSB7IHJldHVybiBzLnZhbHVlID09PSBjb21taXRtZW50LnN0YXR1cyB9KSxcclxuICAgICAgICAgICAgICAgIHN0YXR1czogY29tbWl0bWVudC5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICBkdWVEYXRlOiAkbW9tZW50LnV0YyhuZXcgRGF0ZShjb21taXRtZW50LmR1ZURhdGUpKSxcclxuICAgICAgICAgICAgICAgIGlkOiBjb21taXRtZW50LmlkXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyBmaW5kIHF1ZXN0aW9uIGJhc2VkIG9uIGNhdGVnb3J5LlxyXG4gICAgICAgICAgICB2bS5mb3JtLmRhdGEucXVlc3Rpb24gPSB2bS5mb3JtLmRhdGEuY2F0ZWdvcnkucXVlc3Rpb25zLmZpbmQoZnVuY3Rpb24gKHEpIHsgcmV0dXJuIHEuaWQgPT09IGNvbW1pdG1lbnQucXVlc3Rpb25JZCB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGZvcm1hdCB1dGMgZGF0ZSB0byBsb2NhbC5cclxuICAgICAgICAgICAgdmFyIGQgPSBuZXcgRGF0ZShjb21taXRtZW50LmR1ZURhdGUpO1xyXG4gICAgICAgICAgICB2bS5mb3JtLmRhdGEuZHVlRGF0ZUxvY2FsID0gJG1vbWVudChkKS5sb2NhbCgpLmZvcm1hdCgnTU0tREQtWVlZWScpO1xyXG5cclxuICAgICAgICAgICAgdm0uZm9ybS50aXRsZSA9IFwiRWRpdCBDb21taXRtZW50XCI7XHJcbiAgICAgICAgICAgIHZtLmZvcm0ub25TYXZlID0gdm0udXBkYXRlO1xyXG4gICAgICAgICAgICB2bS5mb3JtLm9uQ2xvc2UgPSB2bS5mb3JtLnNob3cgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHZtLmZvcm0uc2hvdyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTYXZlcyB1cGRhdGVzIHRvIGFuIGV4aXN0aW5nIGNvbW1pdG1lbnQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gICAgICAgICAgICB2bS5lcnJvciA9IG51bGw7XHJcbiAgICAgICAgICAgIHZtLmZvcm0uc3VibWl0dGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNob3cgdmFsaWRhdGlvbiBtZXNzYWdlcyBpZiBuZWVkZWQuXHJcbiAgICAgICAgICAgIGlmICghdm0uZm9ybS4kdmFsaWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gU2F2ZSBhbmQgc2hvdyBmZWVkYmFjayB0byB0aGUgdXNlci5cclxuICAgICAgICAgICAgcGxheWJvb2tEYXRhU2VydmljZS51cGRhdGVDb21taXRtZW50KHZtLnBsYXlib29rSWQsIHZtLmZvcm0uZGF0YSlcclxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uaW5mbyA9IFwiQ29tbWl0bWVudCBzYXZlZCBzdWNjZXNzZnVsbHlcIjtcclxuICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmluZm8gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdmlldyB3aXRoIHNhdmVkIGRhdGEuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGMgPSB2bS5jb21taXRtZW50cy5maW5kKGZ1bmN0aW9uIChjKSB7IHJldHVybiBjLmlkID09PSBkYXRhLmlkIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGMuaWQgPSBkYXRhLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGMuY2F0ZWdvcnlJZCA9IGRhdGEuY2F0ZWdvcnlJZDtcclxuICAgICAgICAgICAgICAgICAgICBjLmNhdGVnb3J5TmFtZSA9IHZtLmZvcm0uZGF0YS5jYXRlZ29yeS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGMuY3JlYXRlZCA9IGRhdGEuY3JlYXRlZDtcclxuICAgICAgICAgICAgICAgICAgICBjLmRlc2NyaXB0aW9uID0gZGF0YS5kZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBjLmR1ZURhdGUgPSBkYXRhLmR1ZURhdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5uYW1lID0gZGF0YS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGMucXVlc3Rpb25JZCA9IGRhdGEucXVlc3Rpb25JZDtcclxuICAgICAgICAgICAgICAgICAgICBjLnN0YXR1cyA9IGRhdGEuc3RhdHVzO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmVycm9yID0gXCJGYWlsZWQgdG8gc2F2ZSBjb21taXRtZW50LlwiO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5mb3JtLnN1Ym1pdHRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmZvcm0uZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmZvcm0uc2hvdyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGVsZXRlcyB0aGUgZ2l2ZW4gY29tbWl0bWVudC5cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY29tbWl0bWVudFxyXG4gICAgICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZShjb21taXRtZW50KSB7XHJcbiAgICAgICAgICAgIHZtLmVycm9yID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgcGxheWJvb2tEYXRhU2VydmljZS5kZWxldGVDb21taXRtZW50KHZtLnBsYXlib29rSWQsIGNvbW1pdG1lbnQuaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTaG93IGZlZWRiYWNrIHRvIHRoZSB1c2VyLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5pbmZvID0gXCJDb21taXRtZW50IGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZtLmluZm8gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAyMDAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBmcm9tIHZpZXcuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmNvbW1pdG1lbnRzLnNwbGljZSh2bS5jb21taXRtZW50cy5maW5kSW5kZXgoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMuaWQgPT09IGNvbW1pdG1lbnQuaWQ7IH0pLCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlc29sdmUgdGhlIHByb21pc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmVycm9yID0gXCJGYWlsZWQgdG8gZGVsZXRlIGNvbW1pdG1lbnQuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcC5wbGF5Ym9vaycpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGJDb21taXRtZW50JywgQ29tbW1pdG1lbnQpO1xyXG5cclxuICAgIENvbW1taXRtZW50LiRpbmplY3QgPSBbJyRsb2cnLCAncGxheWJvb2tEYXRhU2VydmljZScsICckdGltZW91dCddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlyZWN0aXZlIGZvciBzdGF0dXMvcHJvZ3Jlc3MgdmlzdWFsaXphdGlvbiB3aXRoaW4gd2l6YXJkLlxyXG4gICAgICogQHBhcmFtIHskbG9nfSAkbG9nXHJcbiAgICAgKiBAcGFyYW0ge3BsYXlib29rRGF0YVNlcnZpY2V9IHBsYXlib29rRGF0YVNlcnZpY2VcclxuICAgICAqIEBwYXJhbSB7JHRpbWVvdXR9ICR0aW1lb3V0XHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBDb21tbWl0bWVudCgkbG9nLCBwbGF5Ym9va0RhdGFTZXJ2aWNlLCAkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbiAoZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhdHRycy50ZW1wbGF0ZVVybCB8fCAnYXBwL3BsYXlib29rL2NvbW1pdG1lbnQvcGFydGlhbHMvbGlzdC50YWJsZS5odG1sJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgIGNvbW1pdG1lbnQ6ICc9JyxcclxuICAgICAgICAgICAgICAgIHBsYXlib29rSWQ6ICdAJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXF1aXJlOiAnXm5nQ29udHJvbGxlcidcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExpbmsgZnVuY3Rpb25cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gc2NvcGVcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBlbGVtZW50XHJcbiAgICAgICAgICogQHBhcmFtIHtBcnJheX0gYXR0cnNcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY3RybFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJsKSB7XHJcbiAgICAgICAgICAgIC8vIE1ldGhvZHMuXHJcbiAgICAgICAgICAgIHNjb3BlLnNob3dEZWxldGVNb2RhbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzY29wZS5yZW1vdmUgPSByZW1vdmU7XHJcbiAgICAgICAgICAgIHNjb3BlLmNhbmNlbFJlbW92ZSA9IGNhbmNlbFJlbW92ZTtcclxuICAgICAgICAgICAgc2NvcGUuY29uZmlybVJlbW92ZSA9IGNvbmZpcm1SZW1vdmU7XHJcbiAgICAgICAgICAgIHNjb3BlLmVkaXQgPSBlZGl0O1xyXG4gICAgICAgICAgICBzY29wZS5nZXRTdGF0dXNEaXNwbGF5TmFtZSA9IGdldFN0YXR1c0Rpc3BsYXlOYW1lO1xyXG5cclxuICAgICAgICAgICAgc2NvcGUuY2FuRWRpdCA9IGN0cmwuY2FuRWRpdFBsYXlib29rO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEdldHMgdGhlIGRpc3BsYXkgbmFtZSBmb3IgdGhlIHN0YXR1cyBnaXZlbiB0aGUgc3RhdHVzIHZhbHVlLlxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RhdHVzXHJcbiAgICAgICAgICAgICAqIEByZXR1cm5zIHtTdHJpbmd9XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBnZXRTdGF0dXNEaXNwbGF5TmFtZShzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdGF0dXNPYmogPSBjdHJsLnN0YXR1c2VzLmZpbmQoZnVuY3Rpb24gKHMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcy52YWx1ZSA9PT0gc3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdHVzT2JqLmRpc3BsYXk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTaG93IGNvbmZpcm1hdGlvbiBtb2RhbC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlbW92ZSgpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLnNob3dEZWxldGVNb2RhbCA9IHRydWU7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQ2xvc2VzIHRoZSBkZWxldGUgbW9kYWwuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBjYW5jZWxSZW1vdmUoKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5zaG93RGVsZXRlTW9kYWwgPSBmYWxzZTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBEZWxldGVzIHRoaXMgY29tbWl0bWVudC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvbmZpcm1SZW1vdmUoKSB7XHJcbiAgICAgICAgICAgICAgICBjdHJsLnJlbW92ZShzY29wZS5jb21taXRtZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY29wZS5jb21taXRtZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5maW5hbGx5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuc2hvd0RlbGV0ZU1vZGFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogTWFrZSB0aGUgZmllbGRzIGVkaXRhYmxlLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gZWRpdCgpIHtcclxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB2aWV3LlxyXG4gICAgICAgICAgICAgICAgY3RybC5zaG93RWRpdENvbW1pdG1lbnRGb3JtKHNjb3BlLmNvbW1pdG1lbnQpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAucGxheWJvb2snKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BiQ29tbWl0bWVudE1vZGFsJywgTW9kYWwpO1xyXG5cclxuICAgIE1vZGFsLiRpbmplY3QgPSBbJyRsb2cnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1vZGFsIGZvciBhZGRpbmcgYW5kIGVkaXRpbmcgY29tbWl0bWVudHMuXHJcbiAgICAgKiBAcGFyYW0geyRsb2d9ICRsb2dcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IGRpcmVjdGl2ZSBkZWZpbml0aW9uXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIE1vZGFsKCRsb2cpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9wbGF5Ym9vay9jb21taXRtZW50L3BhcnRpYWxzL2NvbW1pdG1lbnQubW9kYWwuaHRtbCcsXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0AnLFxyXG4gICAgICAgICAgICAgICAgc2F2ZUZ1bmM6ICcmJyxcclxuICAgICAgICAgICAgICAgIGNsb3NlRnVuYzogJyYnLFxyXG4gICAgICAgICAgICAgICAgaXNPcGVuOiAnPSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGlyZWN0aXZlIGxpbmsgZnVuY3Rpb25cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gc2NvcGVcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXl9IGF0dHJzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgLy8gT3BlbnMgdGhlIG1vZGFsLlxyXG4gICAgICAgICAgICBzY29wZS5vcGVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuaXNPcGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIENsb3NlcyB0aGUgbW9kYWwuXHJcbiAgICAgICAgICAgIHNjb3BlLmNsb3NlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuaXNPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyBDbGljayB0aGUgb2sgYnV0dG9uLlxyXG4gICAgICAgICAgICBzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vc2NvcGUuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2NvcGUuc2F2ZUZ1bmMgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5zYXZlRnVuYygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gQ2xpY2sgdGhlIGNhbmNlbCBidXR0b24uXHJcbiAgICAgICAgICAgIHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNjb3BlLmNhbmNlbEZ1bmMgIT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jYW5jZWxGdW5jKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFNob3cgb3IgaGlkZSB0aGUgbW9kYWwgZGVwZW5kaW5nIG9uIG91ciBzY29wZSB2YWx1ZXMuXHJcbiAgICAgICAgICAgIGlmIChzY29wZS5pc09wZW4gPT09IHRydWUgfHwgc2NvcGUuaXNPcGVuID09PSAndHJ1ZScpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLm9wZW4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwLnBsYXlib29rJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdkdWVEYXRlQWZ0ZXJUb2RheScsIFZhbGlkYXRvcik7XHJcblxyXG4gICAgVmFsaWRhdG9yLiRpbmplY3QgPSBbJyRsb2cnXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFZhbGlkYXRlcyB0aGUgZHVlIGRhdGUgZm9yIGEgY29tbWl0bWVudCBpcyBhZnRlciB0b2RheS5cclxuICAgICAqIEBwYXJhbSB7JGxvZ30gJGxvZ1xyXG4gICAgICogQHJldHVybnMge09iamVjdH1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gVmFsaWRhdG9yKCRsb2cpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICByZXF1aXJlOiAnbmdNb2RlbCdcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERpcmVjdGl2ZSBsaW5rIGZ1bmMuXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNjb3BlXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnRcclxuICAgICAgICAgKiBAcGFyYW0ge0FycmF5fSBhdHRyc1xyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjdHJsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmwpIHtcclxuICAgICAgICAgICAgLy8gVmFsaWRhdGUgZHVlIGRhdGUgaXMgYWZ0ZXIgdG9kYXkuXHJcbiAgICAgICAgICAgIGN0cmwuJHZhbGlkYXRvcnMuZHVlRGF0ZUFmdGVyVG9kYXkgPSBmdW5jdGlvbiAobW9kZWxWYWx1ZSwgdmlld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmlld1ZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZpZXdWYWx1ZS5kdWVEYXRlID4gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1bml0eUFuZ3VsYXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2VtQWNjb3JkaWFuJywgYWNjb3JkaWFuSXRlbSk7XHJcblxyXG4gICAgZnVuY3Rpb24gYWNjb3JkaWFuSXRlbSgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdAJyxcclxuICAgICAgICAgICAgICAgIGlzT3BlbjogJz0nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3VuaXR5LWFuZ3VsYXIvYWNjb3JkaWFuL2FjY29yZGlhbi5pdGVtLmh0bWwnLFxyXG4gICAgICAgICAgICBsaW5rOiBsaW5rXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZW1CYWRnZScsIGJhZGdlKTtcclxuXHJcbiAgICAvL2JhZGdlLiRpbmplY3QgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBiYWRnZSgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvdW5pdHktYW5ndWxhci9iYWRnZS9iYWRnZS5odG1sJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICBzY29wZS52bSA9IHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aXZlOiBhdHRycy5oYXNPd25Qcm9wZXJ0eSgncG9zaXRpdmUnKSxcclxuICAgICAgICAgICAgICAgIG5lZ2F0aXZlOiBhdHRycy5oYXNPd25Qcm9wZXJ0eSgnbmVnYXRpdmUnKSxcclxuICAgICAgICAgICAgICAgIGNhdXRpb246IGF0dHJzLmhhc093blByb3BlcnR5KCdjYXV0aW9uJylcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgndW5pdHlBbmd1bGFyJylcclxuICAgICAgICAuZmFjdG9yeSgnZW1Db2xvcnMnLCBlbUNvbG9yc1NlcnZpY2UpO1xyXG5cclxuICAgIC8vZW1Db2xvcnNTZXJ2aWNlLiRpbmplY3QgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBlbUNvbG9yc1NlcnZpY2UoKSB7XHJcbiAgICAgICAgbGV0IHNlcnZpY2UgPSB7XHJcbiAgICAgICAgICAgIGFtYmVyOiAgICAgICAgICAnI2YyYWMzMycsXHJcbiAgICAgICAgICAgIGJsdWU6ICAgICAgICAgICAnIzBjNjliMCcsXHJcbiAgICAgICAgICAgIGJ1cmd1bmR5OiAgICAgICAnI2FkMTcyMycsXHJcbiAgICAgICAgICAgIGNlcmlzZTogICAgICAgICAnI2E3MTA2NScsXHJcbiAgICAgICAgICAgIGN1cmlvdXNCbHVlOiAgICAnIzMxOTBkOScsXHJcbiAgICAgICAgICAgIGN5YW46ICAgICAgICAgICAnIzAwYTNlMCcsXHJcbiAgICAgICAgICAgIGRhcmtCbHVlOiAgICAgICAnIzIzMzE5MCcsXHJcbiAgICAgICAgICAgIGRlZXBCbHVlOiAgICAgICAnIzExMTEyMicsXHJcbiAgICAgICAgICAgIGdyZWVuOiAgICAgICAgICAnIzAwYWY1MycsXHJcbiAgICAgICAgICAgIGluZGlnbzogICAgICAgICAnIzAwMmY2YycsXHJcbiAgICAgICAgICAgIGxpbWU6ICAgICAgICAgICAnI2I0ZDQwNScsXHJcbiAgICAgICAgICAgIG1lZGl1bUdyYXk6ICAgICAnIzU0NTQ1OScsXHJcbiAgICAgICAgICAgIG9yYW5nZTogICAgICAgICAnI2VkOGIwMCcsXHJcbiAgICAgICAgICAgIHBsdW06ICAgICAgICAgICAnIzg5MGM1OCcsXHJcbiAgICAgICAgICAgIHB1cnBsZTogICAgICAgICAnIzdhNDE4MycsXHJcbiAgICAgICAgICAgIHJlZDogICAgICAgICAgICAnI2Q4MjQyNCcsXHJcbiAgICAgICAgICAgIHJ1Ynk6ICAgICAgICAgICAnI2IxMDA0MCcsXHJcbiAgICAgICAgICAgIHNlYUJsdWU6ICAgICAgICAnIzAwNWY3ZicsXHJcbiAgICAgICAgICAgIHR1cnF1b2lzZTogICAgICAnIzAwYWNhOCcsXHJcbiAgICAgICAgICAgIHZlcm1pbGlvbjogICAgICAnI2Q5MzkwMCcsXHJcbiAgICAgICAgICAgIHZpb2xldDogICAgICAgICAnIzNhMzk3YicsXHJcbiAgICAgICAgICAgIHllbGxvdzogICAgICAgICAnI2ZmZDcwMCdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gc2VydmljZTtcclxuICAgIH07XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgndW5pdHlBbmd1bGFyJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdlbURhdGVQaWNrZXInLCBkYXRlUGlja2VyKTtcclxuXHJcbiAgICBkYXRlUGlja2VyLiRpbmplY3QgPSBbJ2VtRmllbGRTZXJ2aWNlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gZGF0ZVBpY2tlcihlbUZpZWxkU2VydmljZSkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnQCcsXHJcbiAgICAgICAgICAgICAgICBtb2RlbDogJz0nLFxyXG4gICAgICAgICAgICAgICAgbWluRGF0ZTogJ0AnLFxyXG4gICAgICAgICAgICAgICAgbWF4RGF0ZTogJ0AnLFxyXG4gICAgICAgICAgICAgICAgZGF0ZUZvcm1hdDogJ0AnLFxyXG4gICAgICAgICAgICAgICAgc2hvd0ljb246ICdAJyxcclxuICAgICAgICAgICAgICAgIG9uU2VsZWN0OiAnJidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgcmVxdWlyZTogJ15eP2VtRmllbGQnLFxyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC91bml0eS1hbmd1bGFyL2RhdGUtcGlja2VyL2RhdGUtcGlja2VyLmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBlbURhdGVQaWNrZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIGZ1bmN0aW9uIGVtRGF0ZVBpY2tlcigkc2NvcGUpIHtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBmaWVsZEN0cmwpIHsgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgZW1GaWVsZFNlcnZpY2Uuc2V0SWNvbldhdGNoKHNjb3BlLCBhdHRycywgZmllbGRDdHJsKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNob3cgY2FsZW5kYXIgaWNvbiBvbmx5IHdoZW4gbm90IHNob3dpbmcgYW5vdGhlclxyXG4gICAgICAgICAgICAvL3Njb3BlLnZtLnNob3dJY29uID0gIWZpZWxkQ3RybC5lcnJvclxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgJiYgIWZpZWxkQ3RybC5yZWFkb25seVxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgJiYgIWZpZWxkQ3RybC5kaXNhYmxlZDtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLnZtLnNob3dJY29uID0gc2NvcGUuc2hvd0ljb24gfHwgdHJ1ZTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgndW5pdHlBbmd1bGFyJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdlbUV4cGFuZGFibGVCdXR0b24nLCBleHBhbmRhYmxlQnV0dG9uKTtcclxuXHJcbiAgICAvL2V4cGFuZGFibGVCdXR0b24uJGluamVjdCA9IFtdO1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBleHBhbmRhYmxlQnV0dG9uKCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHJlcXVpcmU6ICdeXj9lbUZpZWxkR3JvdXAnLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICdAJyxcclxuICAgICAgICAgICAgICAgIGFjdGl2ZUxhYmVsOiAnQCcsXHJcbiAgICAgICAgICAgICAgICBpc0FjdGl2ZTogJz0/YWN0aXZlJ1xyXG4gICAgICAgICAgICAgICAgLy8gcGx1c0ljb25cclxuICAgICAgICAgICAgICAgIC8vIHNtYWxsXHJcbiAgICAgICAgICAgICAgICAvLyBwcmltYXJ5XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3VuaXR5LWFuZ3VsYXIvZXhwYW5kYWJsZS1idXR0b24vZXhwYW5kYWJsZS1idXR0b24uaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGVtRXhwYW5kYWJsZUJ1dHRvbixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGVtRXhwYW5kYWJsZUJ1dHRvbigpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIC8vIERlZmF1bHQgaXNBY3RpdmVcclxuICAgICAgICAgICAgaWYgKHZtLmlzQWN0aXZlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICB2bS5pc0FjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgc2NvcGUudm0ucGx1c0ljb24gPSBhdHRycy5oYXNPd25Qcm9wZXJ0eSgncGx1c0ljb24nKTtcclxuICAgICAgICAgICAgc2NvcGUudm0uc21hbGwgPSBhdHRycy5oYXNPd25Qcm9wZXJ0eSgnc21hbGwnKTtcclxuICAgICAgICAgICAgc2NvcGUudm0ucHJpbWFyeSA9IGF0dHJzLmhhc093blByb3BlcnR5KCdwcmltYXJ5Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgndW5pdHlBbmd1bGFyJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdlbUZpZWxkQm9keScsIGZpZWxkQm9keSk7XHJcblxyXG4gICAgLy9maWVsZEJvZHkuJGluamVjdCA9IFtdO1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBmaWVsZEJvZHkoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgcmVxdWlyZTogJ15eZW1GaWVsZCcsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC91bml0eS1hbmd1bGFyL2ZpZWxkL2ZpZWxkLWJvZHkuaHRtbCdcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGZpZWxkQ3RybCkge1xyXG4gICAgICAgICAgICAvLyBJbmhlcml0IGNvbnRyb2xsZXIgYXMgJ3ZtJyAoYnV0IG5vdCBhcyBwcm90b3R5cGUgc28gaXQncyB0aGUgc2FtZSBvYmplY3QpXHJcbiAgICAgICAgICAgIHNjb3BlLnZtID0gZmllbGRDdHJsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZW1GaWVsZEdyb3VwJywgZmllbGRHcm91cCk7XHJcblxyXG4gICAgLy9maWVsZEdyb3VwLiRpbmplY3QgPSBbXTtcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gZmllbGRHcm91cCgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBlbUZpZWxkR3JvdXAsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgIHZhbGlkOiAnPT8nLFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6ICc9PycsXHJcbiAgICAgICAgICAgICAgICByZWFkb25seTogJz0/JyxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiAnPT8nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZW1GaWVsZEdyb3VwKCkge1xyXG4gICAgICAgICAgICBsZXQgdm0gPSB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1bml0eUFuZ3VsYXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2VtRmllbGRNZXNzYWdlcycsIGZpZWxkTWVzc2FnZXMpO1xyXG5cclxuICAgIC8vZmllbGRNZXNzYWdlcy4kaW5qZWN0ID0gW107XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGZpZWxkTWVzc2FnZXMoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgICdmb3InOiAnQCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVxdWlyZTogWydeXmZvcm0nLCAnXl4/ZW1GaWVsZCddLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC91bml0eS1hbmd1bGFyL2ZpZWxkL2ZpZWxkLW1lc3NhZ2VzLmh0bWwnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBjdHJscykge1xyXG4gICAgICAgICAgICBsZXQgZm9ybUN0cmwgPSBjdHJsc1swXTtcclxuICAgICAgICAgICAgbGV0IGZpZWxkQ3RybCA9IGN0cmxzWzFdO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFhdHRycy5mb3IpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2VtLWZpZWxkLW1lc3NhZ2VzOiBhdHRyaWJ1dGUgXCJmb3JcIiBpcyByZXF1aXJlZCcpO1xyXG5cclxuICAgICAgICAgICAgbGV0IHZtID0gc2NvcGUudm0gPSB7XHJcbiAgICAgICAgICAgICAgICAvLyBFeHBvc2UgdGhlIGZvcm0ubmFtZSBtb2RlbFxyXG4gICAgICAgICAgICAgICAgbW9kZWw6IGZvcm1DdHJsW2F0dHJzLmZvcl0sXHJcbiAgICAgICAgICAgICAgICAvLyBFeHBvc2UgdGhlIGVtRmllbGQgQ29udHJvbGxlclxyXG4gICAgICAgICAgICAgICAgZmllbGQ6IGZpZWxkQ3RybCxcclxuICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgYXR0cmlidXRlcyBleGlzdGFuY2UgYXMgYm9vbGVhbnMgZm9yIHRoZSB2bVxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6ICAgYXR0cnMubWVzc2FnZXMuaW5jbHVkZXMoJ3JlcXVpcmVkJyksXHJcbiAgICAgICAgICAgICAgICBudW1iZXI6ICAgICBhdHRycy5tZXNzYWdlcy5pbmNsdWRlcygnbnVtYmVyJyksXHJcbiAgICAgICAgICAgICAgICBtaW46ICAgICAgICBhdHRycy5tZXNzYWdlcy5pbmNsdWRlcygnbWluJyksXHJcbiAgICAgICAgICAgICAgICBtaW5sZW5ndGg6ICBhdHRycy5tZXNzYWdlcy5pbmNsdWRlcygnbWlubGVuZ3RoJyksXHJcbiAgICAgICAgICAgICAgICBtYXhsZW5ndGg6ICBhdHRycy5tZXNzYWdlcy5pbmNsdWRlcygnbWF4bGVuZ3RoJyksXHJcbiAgICAgICAgICAgICAgICB1bmlxdWU6ICAgICBhdHRycy5tZXNzYWdlcy5pbmNsdWRlcygndW5pcXVlJylcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1bml0eUFuZ3VsYXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2VtRmllbGROb3RlJywgZmllbGROb3RlKTtcclxuXHJcbiAgICAvL2ZpZWxkTm90ZS4kaW5qZWN0ID0gW107XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGZpZWxkTm90ZSgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICByZXF1aXJlOiAnXl4/ZW1GaWVsZCcsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2VtLWMtZmllbGRfX25vdGUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1bml0eUFuZ3VsYXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2VtRmllbGQnLCBmaWVsZCk7XHJcblxyXG4gICAgZmllbGQuJGluamVjdCA9IFsnZW1GaWVsZFNlcnZpY2UnXTtcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gZmllbGQoZW1GaWVsZFNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICByZXF1aXJlOiAnXl4/ZW1GaWVsZEdyb3VwJyxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgIHZhbGlkOiAnPT8nLFxyXG4gICAgICAgICAgICAgICAgZXJyb3I6ICc9PycsXHJcbiAgICAgICAgICAgICAgICByZWFkb25seTogJz0/JyxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVkOiAnPT8nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3VuaXR5LWFuZ3VsYXIvZmllbGQvZmllbGQuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGVtRmllbGQsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBlbUZpZWxkKCkge1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGZpZWxkR3JvdXBDdHJsKSB7XHJcbiAgICAgICAgICAgIC8vIFdhdGNoIGZvciBlYWNoIGF0dHJpYnV0ZSBjaGFuZ2Ugb24gZW1GaWVsZEdyb3VwIGlmIHVuZGVmaW5lZCBvbiBlbUZpZWxkXHJcbiAgICAgICAgICAgIGVtRmllbGRTZXJ2aWNlLnNldEZpZWxkV2F0Y2goc2NvcGUsIGF0dHJzLCBmaWVsZEdyb3VwQ3RybCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmZhY3RvcnkoJ2VtRmllbGRTZXJ2aWNlJywgZW1GaWVsZFNlcnZpY2UpO1xyXG5cclxuICAgIC8vZW1GaWVsZFNlcnZpY2UuJGluamVjdCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGVtRmllbGRTZXJ2aWNlKCkge1xyXG4gICAgICAgIGxldCBzZXJ2aWNlID0ge1xyXG4gICAgICAgICAgICBzZXRGaWVsZFdhdGNoOiBzZXRGaWVsZFdhdGNoLFxyXG4gICAgICAgICAgICBzZXRJbnB1dFdhdGNoOiBzZXRJbnB1dFdhdGNoLFxyXG4gICAgICAgICAgICBzZXRJY29uV2F0Y2g6IHNldEljb25XYXRjaFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBzZXJ2aWNlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldEZpZWxkV2F0Y2goc2NvcGUsIGF0dHJzLCBmaWVsZEdyb3VwQ3RybCkge1xyXG4gICAgICAgICAgICBzZXRXYXRjaChcclxuICAgICAgICAgICAgICAgIHNjb3BlLFxyXG4gICAgICAgICAgICAgICAgZmllbGRHcm91cEN0cmwsXHJcbiAgICAgICAgICAgICAgICAnZmllbGRHcm91cEN0cmwnLFxyXG4gICAgICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgICAgICBbJ3ZhbGlkJywgJ2Vycm9yJywgJ3JlYWRvbmx5JywgJ2Rpc2FibGVkJ10sIC8vIG9yZGVyIG1heSBtYXR0ZXJcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2YWwsIGF0dHIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS52bVthdHRyXSA9IHZhbDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0SW5wdXRXYXRjaChzY29wZSwgZWxlbWVudCwgYXR0cnMsIGZpZWxkQ3RybCkge1xyXG4gICAgICAgICAgICBzZXRXYXRjaChcclxuICAgICAgICAgICAgICAgIHNjb3BlLFxyXG4gICAgICAgICAgICAgICAgZmllbGRDdHJsLFxyXG4gICAgICAgICAgICAgICAgJ2ZpZWxkQ3RybCcsXHJcbiAgICAgICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgICAgIFsnZGlzYWJsZWQnLCAncmVhZG9ubHknXSwgLy8gb3JkZXIgbWF5IG1hdHRlclxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXR0cih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiBmaWVsZEN0cmwuZGlzYWJsZWQgfHwgZmllbGRDdHJsLnJlYWRvbmx5XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldEljb25XYXRjaChzY29wZSwgYXR0cnMsIGZpZWxkQ3RybCkge1xyXG4gICAgICAgICAgICBzZXRXYXRjaChcclxuICAgICAgICAgICAgICAgIHNjb3BlLFxyXG4gICAgICAgICAgICAgICAgZmllbGRDdHJsLFxyXG4gICAgICAgICAgICAgICAgJ2ZpZWxkQ3RybCcsXHJcbiAgICAgICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgICAgIFsnZXJyb3InLCAncmVhZG9ubHknLCAnZGlzYWJsZWQnXSwgLy8gb3JkZXIgbWF5IG1hdHRlclxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKHZhbCwgYXR0cikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnZtLnNob3dJY29uID0gIWZpZWxkQ3RybC5lcnJvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgIWZpZWxkQ3RybC5yZWFkb25seVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgIWZpZWxkQ3RybC5kaXNhYmxlZDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0V2F0Y2goc2NvcGUsIHBhcmVudEN0cmwsIHBhcmVudEN0cmxOYW1lLCBlbGVtZW50QXR0cmlidXRlcywgd2F0Y2hBdHRyaWJ1dGVzLCB3YXRjaENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGlmICghYW5ndWxhci5pc09iamVjdChzY29wZSkpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbUZpZWxkOiBzY29wZSBtdXN0IGJlIGFuIG9iamVjdCcpO1xyXG4gICAgICAgICAgICBpZiAoIShwYXJlbnRDdHJsID09PSBudWxsIHx8IGFuZ3VsYXIuaXNPYmplY3QocGFyZW50Q3RybCkpKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZW1GaWVsZDogcGFyZW50Q3RybCBtdXN0IGJlIGFuIG9iamVjdCcpO1xyXG4gICAgICAgICAgICBpZiAoIWFuZ3VsYXIuaXNTdHJpbmcocGFyZW50Q3RybE5hbWUpKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZW1GaWVsZDogcGFyZW50Q3RybE5hbWUgbXVzdCBiZSBhIHN0cmluZycpO1xyXG4gICAgICAgICAgICBpZiAoIWFuZ3VsYXIuaXNPYmplY3QoZWxlbWVudEF0dHJpYnV0ZXMpKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZW1GaWVsZDogZWxlbWVudEF0dHJpYnV0ZXMgbXVzdCBiZSBhbiBvYmplY3QnKTtcclxuICAgICAgICAgICAgaWYgKCFhbmd1bGFyLmlzQXJyYXkod2F0Y2hBdHRyaWJ1dGVzKSlcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VtRmllbGQ6IHdhdGNoQXR0cmlidXRlcyBtdXN0IGJlIGFuIGFycmF5Jyk7XHJcbiAgICAgICAgICAgIGlmICghYW5ndWxhci5pc0Z1bmN0aW9uKHdhdGNoQ2FsbGJhY2spKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZW1GaWVsZDogd2F0Y2hDYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJlbnRDdHJsKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTdG9yZSB0aGUgcGFyZW50IGNvbnRyb2xsZXJcclxuICAgICAgICAgICAgICAgIHNjb3BlW3BhcmVudEN0cmxOYW1lXSA9IHBhcmVudEN0cmw7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gV2F0Y2ggZm9yIGVhY2ggYXR0cmlidXRlIGNoYW5nZSBvbiBwYXJlbnQgcmVxdWlyZWQgZGlyZWN0aXZlJ3MgY29udHJvbGxlclxyXG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHdhdGNoQXR0cmlidXRlcywgZnVuY3Rpb24gKGF0dHIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IHNldCB3YXRjaCBpZiB1bmRlZmluZWQgb24gZW1GaWVsZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudEF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoYXR0cikpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChwYXJlbnRDdHJsTmFtZSArICcuJyArIGF0dHIsIGZ1bmN0aW9uICh2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhdGNoQ2FsbGJhY2suY2FsbCh0aGlzLCB2YWwsIGF0dHIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnaW5wdXQnLCBpbnB1dCk7XHJcblxyXG4gICAgaW5wdXQuJGluamVjdCA9IFsnZW1GaWVsZFNlcnZpY2UnXTtcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gaW5wdXQoZW1GaWVsZFNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICByZXF1aXJlOiBbJ15eP2VtRmllbGQnLCAnXl4/ZW1Ub2dnbGUnLCAnXl4/ZW1EYXRlUGlja2VyJ11cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XHJcbiAgICAgICAgICAgIGxldCBmaWVsZEN0cmwgPSBjdHJsc1swXTtcclxuICAgICAgICAgICAgbGV0IHRvZ2dsZUN0cmwgPSBjdHJsc1sxXTtcclxuICAgICAgICAgICAgbGV0IGRhdGVQaWNrZXJDdHJsID0gY3RybHNbMl07XHJcblxyXG4gICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdlbS1jLWlucHV0Jyk7XHJcblxyXG4gICAgICAgICAgICAvLyBDbGFzc2VzIGRlcGVuZGluZyBvbiBpbmhlcml0ZWQgY29udHJvbGxlclxyXG4gICAgICAgICAgICBpZiAodG9nZ2xlQ3RybClcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2VtLWMtdG9nZ2xlX19pbnB1dCBlbS11LWlzLXZpc2hpZGRlbicpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChkYXRlUGlja2VyQ3RybClcclxuICAgICAgICAgICAgICAgIG5ldyBQaWthZGF5KHtcclxuICAgICAgICAgICAgICAgICAgICBmaWVsZDogZWxlbWVudFswXSxcclxuICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IGRhdGVQaWNrZXJDdHJsLmRhdGVGb3JtYXQgfHwgJ01NLURELVlZWVknLFxyXG4gICAgICAgICAgICAgICAgICAgIG1pbkRhdGU6IGRhdGVQaWNrZXJDdHJsLm1pbkRhdGUgfHwgbmV3IERhdGUoKSxcclxuICAgICAgICAgICAgICAgICAgICBtYXhEYXRlOiBkYXRlUGlja2VyQ3RybC5tYXhEYXRlIHx8IG5ldyBEYXRlKCkuc2V0WWVhcihuZXcgRGF0ZSgpLmdldFllYXIoKSArIDIpLFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0OiBkYXRlUGlja2VyQ3RybC5vblNlbGVjdFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBXYXRjaCBmb3IgZWFjaCBhdHRyaWJ1dGUgY2hhbmdlIG9uIGVtRmllbGQgaWYgdW5kZWZpbmVkIG9uIGlucHV0XHJcbiAgICAgICAgICAgIGVtRmllbGRTZXJ2aWNlLnNldElucHV0V2F0Y2goc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBmaWVsZEN0cmwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnbGFiZWwnLCBsYWJlbCk7XHJcblxyXG4gICAgLy9sYWJlbC4kaW5qZWN0ID0gW107XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGxhYmVsKCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHJlcXVpcmU6IFsnXl4/ZW1GaWVsZCcsICdeXj9lbVRvZ2dsZSddLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcclxuICAgICAgICAgICAgbGV0IGZpZWxkQ3RybCA9IGN0cmxzWzBdO1xyXG4gICAgICAgICAgICBsZXQgdG9nZ2xlQ3RybCA9IGN0cmxzWzFdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRvZ2dsZUN0cmwpXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdlbS1jLXRvZ2dsZV9fbGFiZWwnKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoZmllbGRDdHJsKVxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnZW0tYy1maWVsZF9fbGFiZWwnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1bml0eUFuZ3VsYXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3NlbGVjdCcsIHNlbGVjdCk7XHJcblxyXG4gICAgc2VsZWN0LiRpbmplY3QgPSBbJ2VtRmllbGRTZXJ2aWNlJ107XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIHNlbGVjdChlbUZpZWxkU2VydmljZSkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHJlcXVpcmU6ICdeXj9lbUZpZWxkJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgZmllbGRDdHJsKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2VtLWMtc2VsZWN0Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZmllbGRDdHJsICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZEN0cmwuaGFzSWNvbiA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFdhdGNoIGZvciBlYWNoIGF0dHJpYnV0ZSBjaGFuZ2Ugb24gZW1GaWVsZCBpZiB1bmRlZmluZWQgb24gc2VsZWN0XHJcbiAgICAgICAgICAgIGVtRmllbGRTZXJ2aWNlLnNldElucHV0V2F0Y2goc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBmaWVsZEN0cmwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgndGV4dGFyZWEnLCB0ZXh0YXJlYSk7XHJcblxyXG4gICAgdGV4dGFyZWEuJGluamVjdCA9IFsnZW1GaWVsZFNlcnZpY2UnXTtcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gdGV4dGFyZWEoZW1GaWVsZFNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICByZXF1aXJlOiAnXl4/ZW1GaWVsZCdcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGZpZWxkQ3RybCkge1xyXG4gICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdlbS1jLXNlbGVjdCcpO1xyXG5cclxuICAgICAgICAgICAgLy8gV2F0Y2ggZm9yIGVhY2ggYXR0cmlidXRlIGNoYW5nZSBvbiBlbUZpZWxkIGlmIHVuZGVmaW5lZCBvbiB0ZXh0YXJlYVxyXG4gICAgICAgICAgICBlbUZpZWxkU2VydmljZS5zZXRJbnB1dFdhdGNoKHNjb3BlLCBlbGVtZW50LCBhdHRycywgZmllbGRDdHJsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1bml0eUFuZ3VsYXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2VtVG9nZ2xlJywgdG9nZ2xlKTtcclxuXHJcbiAgICAvL3RvZ2dsZS4kaW5qZWN0ID0gW107XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIHRvZ2dsZSgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICByZXF1aXJlOiAnXl4/ZW1GaWVsZCcsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBlbVRvZ2dsZSxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGVtVG9nZ2xlKCkge1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGZpZWxkQ3RybCkge1xyXG4gICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdlbS1jLXRvZ2dsZScpO1xyXG4gICAgICAgICAgICBmaWVsZEN0cmwuaGFzSWNvbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgndW5pdHlBbmd1bGFyJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdlbUZvb3RlckxpbmsnLCBmb290ZXJMaW5rKTtcclxuXHJcbiAgICAvL2Zvb3RlckxpbmsuJGluamVjdCA9IFtdO1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBmb290ZXJMaW5rKCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3VuaXR5LWFuZ3VsYXIvZm9vdGVyL2Zvb3Rlci1saW5rLmh0bWwnLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgaHJlZjogJ0AnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1bml0eUFuZ3VsYXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2VtRm9vdGVyTGlua3MnLCBmb290ZXJMaW5rcyk7XHJcblxyXG4gICAgLy9mb290ZXJMaW5rcy4kaW5qZWN0ID0gW107XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIGZvb3RlckxpbmtzKCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3VuaXR5LWFuZ3VsYXIvZm9vdGVyL2Zvb3Rlci1saW5rcy5odG1sJyxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdAJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBlbUZvb3RlckxpbmtzLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZW1Gb290ZXJMaW5rcygpIHtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgndW5pdHlBbmd1bGFyJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdlbUZvb3RlcicsIGZvb3Rlcik7XHJcblxyXG4gICAgLy9mb290ZXIuJGluamVjdCA9IFtdO1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiBmb290ZXIoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvdW5pdHktYW5ndWxhci9mb290ZXIvZm9vdGVyLmh0bWwnLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1bml0eUFuZ3VsYXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2VtSWNvbicsIGljb24pO1xyXG5cclxuICAgIGljb24uJGluamVjdCA9IFsnZW1JY29uU2VydmljZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGljb24oZW1JY29uU2VydmljZSkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3VuaXR5LWFuZ3VsYXIvaWNvbi9pY29uLmh0bWwnLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgc3JjOiAnQCcsXHJcbiAgICAgICAgICAgICAgICBpY29uOiAnQGlzJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXF1aXJlOiBbJ15eP2VtRmllbGQnLCAnXl4/ZW1UYWJsZSddXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcclxuICAgICAgICAgICAgdmFyIGZpZWxkQ3RybCA9IGN0cmxzWzBdO1xyXG4gICAgICAgICAgICB2YXIgdGFibGVDdHJsID0gY3RybHNbMV07XHJcblxyXG4gICAgICAgICAgICBzY29wZS52bSA9IHtcclxuICAgICAgICAgICAgICAgIGljb246IHNjb3BlLmljb24sXHJcbiAgICAgICAgICAgICAgICBocmVmOiAoc2NvcGUuc3JjIHx8ICdpbWFnZXMnKSArICcvZW0taWNvbnMuc3ZnI2ljb24tJyArIHNjb3BlLmljb24sXHJcbiAgICAgICAgICAgICAgICBpc1NtYWxsOiBhdHRycy5oYXNPd25Qcm9wZXJ0eSgnc21hbGwnKSxcclxuICAgICAgICAgICAgICAgIGlzRmllbGQ6ICEhZmllbGRDdHJsLFxyXG4gICAgICAgICAgICAgICAgaXNUYWJsZTogISF0YWJsZUN0cmxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGVtSWNvblNlcnZpY2UucnVuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1bml0eUFuZ3VsYXInKVxyXG4gICAgICAgIC5mYWN0b3J5KCdlbUljb25TZXJ2aWNlJywgZW1JY29uU2VydmljZSk7XHJcblxyXG4gICAgZW1JY29uU2VydmljZS4kaW5qZWN0ID0gWyckdGltZW91dCcsICdzdmc0ZXZlcnlib2R5J107XHJcblxyXG4gICAgZnVuY3Rpb24gZW1JY29uU2VydmljZSgkdGltZW91dCwgc3ZnNGV2ZXJ5Ym9keSkge1xyXG4gICAgICAgIHZhciB0aW1lb3V0ID0gJHRpbWVvdXQoKTtcclxuXHJcbiAgICAgICAgbGV0IHNlcnZpY2UgPSB7XHJcbiAgICAgICAgICAgIHJ1bjogcnVuXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcnVuKCkge1xyXG4gICAgICAgICAgICAvLyBQcmV2ZW50cyBtdWx0aXBsZSBjYWxscyBwZXIgJGRpZ2VzdFxyXG4gICAgICAgICAgICAkdGltZW91dC5jYW5jZWwodGltZW91dCk7XHJcblxyXG4gICAgICAgICAgICB0aW1lb3V0ID0gJHRpbWVvdXQoc3ZnNGV2ZXJ5Ym9keSwgNTApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgndW5pdHlBbmd1bGFyJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdlbUxvYWRlcicsIGxvYWRlcik7XHJcblxyXG4gICAgbG9hZGVyLiRpbmplY3QgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkZXIoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvdW5pdHktYW5ndWxhci9sb2FkZXIvbG9hZGVyLmh0bWwnLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgc2l6ZTogJ0AnLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogJ0AnLFxyXG4gICAgICAgICAgICAgICAgLy8gYWJzb2x1dGUgICAgIDwtLVxyXG4gICAgICAgICAgICAgICAgLy8gY2VudGVyICAgICAgIDwtLSB0aG9zZSBhZmZlY3QgY3NzIG9ubHlcclxuICAgICAgICAgICAgICAgIC8vIG1pZGRsZSAgICAgICA8LS1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgLy8gRGVmYXVsdCBzaXplXHJcbiAgICAgICAgICAgIGlmICghc2NvcGUuc2l6ZSlcclxuICAgICAgICAgICAgICAgIHNjb3BlLnNpemUgPSAnNTBweCc7XHJcblxyXG4gICAgICAgICAgICAvLyBBcHBseSBzaXplXHJcbiAgICAgICAgICAgIGVsZW1lbnQuY3NzKHtcclxuICAgICAgICAgICAgICAgIGhlaWdodDogc2NvcGUuc2l6ZSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBzY29wZS5zaXplXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgndW5pdHlBbmd1bGFyJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdlbUxvYWRlck92ZXJsYXknLCBsb2FkZXJPdmVybGF5KTtcclxuXHJcbiAgICBsb2FkZXJPdmVybGF5LiRpbmplY3QgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkZXJPdmVybGF5KCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQydcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIC8vIHByZXZlbnQgY2xpY2tpbmcgb24gYW55dGhpbmcuXHJcbiAgICAgICAgICAgIC8vZWxlbWVudC5iaW5kKCdjbGljaycsIGZ1bmN0aW9uICgkZXZlbnQpIHtcclxuICAgICAgICAgICAgLy8gICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIC8vfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZW1Mb2dvJywgbG9nbyk7XHJcblxyXG4gICAgLy9sb2dvLiRpbmplY3QgPSBbXTtcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gbG9nbygpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC91bml0eS1hbmd1bGFyL2xvZ28vbG9nby5odG1sJyxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgndW5pdHlBbmd1bGFyJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdlbU1vZGFsQ29uZmlybScsIE1vZGFsQ29uZmlybSk7XHJcblxyXG4gICAgTW9kYWxDb25maXJtLiRpbmplY3QgPSBbJyRsb2cnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBNb2RhbENvbmZpcm0oJGxvZykge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC91bml0eS1hbmd1bGFyL21vZGFscy9tb2RhbC5jb25maXJtLmh0bWwnLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdAJyxcclxuICAgICAgICAgICAgICAgIGNvbmZpcm1GdW5jOiAnJj8nLFxyXG4gICAgICAgICAgICAgICAgY29uZmlybVRleHQ6ICdAPycsXHJcbiAgICAgICAgICAgICAgICBjYW5jZWxGdW5jOiAnJj8nLFxyXG4gICAgICAgICAgICAgICAgY2FuY2VsVGV4dDogJ0A/JyxcclxuICAgICAgICAgICAgICAgIGlzT3BlbjogJz0nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIC8vIE9wZW5zIHRoZSBtb2RhbC5cclxuICAgICAgICAgICAgc2NvcGUub3BlbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmlzT3BlbiA9IHRydWU7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyBDbG9zZXMgdGhlIG1vZGFsLlxyXG4gICAgICAgICAgICBzY29wZS5jbG9zZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmlzT3BlbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gQ2xpY2sgdGhlIG9rIGJ1dHRvbi5cclxuICAgICAgICAgICAgc2NvcGUub2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzY29wZS5jb25maXJtRnVuYyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNvbmZpcm1GdW5jKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyBDbGljayB0aGUgY2FuY2VsIGJ1dHRvbi5cclxuICAgICAgICAgICAgc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2NvcGUuY2FuY2VsRnVuYyAhPT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLmNhbmNlbEZ1bmMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gU2hvdyBvciBoaWRlIHRoZSBtb2RhbCBkZXBlbmRpbmcgb24gb3VyIHNjb3BlIHZhbHVlcy5cclxuICAgICAgICAgICAgaWYgKHNjb3BlLmlzT3BlbiA9PT0gdHJ1ZSB8fCBzY29wZS5pc09wZW4gPT09ICd0cnVlJykge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUub3BlbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuY2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gU2V0cyBkZWZhdWx0cyBmb3IgdGhlIG9wdGlvbmFsIHBhcmFtcy5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBzY29wZS5jb25maXJtVGV4dCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuY29uZmlybVRleHQgPSAnT0snO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2NvcGUuY2FuY2VsVGV4dCA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuY2FuY2VsVGV4dCA9ICdDYW5jZWwnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZW1Nb2RhbCcsIE1vZGFsKTtcclxuXHJcbiAgICBNb2RhbC4kaW5qZWN0ID0gWyckbG9nJ107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVbml0eSBtb2RhbC5cclxuICAgICAqIEBwYXJhbSB7JGxvZ30gJGxvZ1xyXG4gICAgICogQHJldHVybnMge09iamVjdH0gZGlyZWN0aXZlIGRlZmluaXRpb25cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gTW9kYWwoJGxvZykge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL2FwcC91bml0eS1hbmd1bGFyL21vZGFsLWNvbmZpcm0vbW9kYWwuY29uZmlybS5odG1sJyxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnQCcsXHJcbiAgICAgICAgICAgICAgICBib2R5OiAnQCcsXHJcbiAgICAgICAgICAgICAgICBjb25maXJtRnVuYzogJyYnLFxyXG4gICAgICAgICAgICAgICAgY2xvc2VGdW5jOiAnJicsXHJcbiAgICAgICAgICAgICAgICBpc09wZW46ICc9J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogZnVuY3Rpb24gKGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXR0cnMudGVtcGxhdGVVcmwgfHwgJ2FwcC91bml0eS1hbmd1bGFyL21vZGFscy9tb2RhbC5odG1sJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgLy8gT3BlbnMgdGhlIG1vZGFsLlxyXG4gICAgICAgICAgICBzY29wZS5vcGVuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuaXNPcGVuID0gdHJ1ZTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIENsb3NlcyB0aGUgbW9kYWwuXHJcbiAgICAgICAgICAgIHNjb3BlLmNsb3NlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuaXNPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyBDbGljayB0aGUgb2sgYnV0dG9uLlxyXG4gICAgICAgICAgICBzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNjb3BlLmNvbmZpcm1GdW5jICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY29uZmlybUZ1bmMoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIENsaWNrIHRoZSBjYW5jZWwgYnV0dG9uLlxyXG4gICAgICAgICAgICBzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzY29wZS5jYW5jZWxGdW5jICE9PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUuY2FuY2VsRnVuYygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTaG93IG9yIGhpZGUgdGhlIG1vZGFsIGRlcGVuZGluZyBvbiBvdXIgc2NvcGUgdmFsdWVzLlxyXG4gICAgICAgICAgICBpZiAoc2NvcGUuaXNPcGVuID09PSB0cnVlIHx8IHNjb3BlLmlzT3BlbiA9PT0gJ3RydWUnKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZW1TaGFyZU1vZGFsJywgU2hhcmVNb2RhbCk7XHJcblxyXG4gICAgU2hhcmVNb2RhbC4kaW5qZWN0ID0gWyckbG9nJywgJ2NsaXBib2FyZCddO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5pdHkgbW9kYWwuXHJcbiAgICAgKiBAcGFyYW0geyRsb2d9ICRsb2dcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IGRpcmVjdGl2ZSBkZWZpbml0aW9uXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIFNoYXJlTW9kYWwoJGxvZywgY2xpcGJvYXJkKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYXBwL3VuaXR5LWFuZ3VsYXIvbW9kYWwtY29uZmlybS9tb2RhbC5jb25maXJtLmh0bWwnLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdAJyxcclxuICAgICAgICAgICAgICAgIGlzT3BlbjogJz0nLFxyXG4gICAgICAgICAgICAgICAgbGluazogJz0nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBmdW5jdGlvbiAoZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhdHRycy50ZW1wbGF0ZVVybCB8fCAnYXBwL3VuaXR5LWFuZ3VsYXIvbW9kYWxzL3NoYXJlLm1vZGFsLmh0bWwnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogT3BlbnMgdGhlIG1vZGFsLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2NvcGUub3BlbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlLmlzT3BlbiA9IHRydWU7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQ2xvc2VzIHRoZSBtb2RhbC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNjb3BlLmNsb3NlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuY29waWVkID0ge307XHJcbiAgICAgICAgICAgICAgICBzY29wZS5pc09wZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBDbGljayB0aGUgb2sgYnV0dG9uLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2NvcGUub2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIENsaWNrIHRoZSBjYW5jZWwgYnV0dG9uLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUuY2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ29weSBzdGF0dXMuXHJcbiAgICAgICAgICAgIHNjb3BlLmNvcGllZCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIENvcGllcyB0aGUgbGluayB0byB0aGUgY2xpcGJvYXJkIGFuZCBwcm92aWRlcyBmZWVkYmFjayB0byB0aGUgdXNlci5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNjb3BlLmNvcHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5jb3BpZWQgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWNsaXBib2FyZC5zdXBwb3J0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY29wZS5jb3BpZWQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdTb3JyeSwgY29weSB0byBjbGlwYm9hcmQgaXMgbm90IHN1cHBvcnRlZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBib2FyZC5jb3B5VGV4dChzY29wZS5saW5rKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUuY29waWVkID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogJ1RoZSBsaW5rIGhhcyBiZWVuIGNvcGllZCB0byB5b3VyIGNsaXBib2FyZC4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmNvcGllZCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdUaGUgbGluayBkaWQgbm90IGNvcHkgc3VjY2Vzc2Z1bGx5LiBQbGVhc2UgdHJ5IGFnYWluIG9yIHVzZSB5b3VyIGJyb3dzZXIgc2hvcnRjdXRzIHRvIG1hbnVhbGx5IGNvcHkgdGhlIGxpbmsuJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTaG93IG9yIGhpZGUgdGhlIG1vZGFsIGRlcGVuZGluZyBvbiBvdXIgc2NvcGUgdmFsdWVzLlxyXG4gICAgICAgICAgICBpZiAoc2NvcGUuaXNPcGVuID09PSB0cnVlIHx8IHNjb3BlLmlzT3BlbiA9PT0gJ3RydWUnKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5vcGVuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmZhY3RvcnkoJ2NlbGxTZXJ2aWNlJywgY2VsbFNlcnZpY2UpO1xyXG5cclxuICAgIC8vY2VsbFNlcnZpY2UuJGluamVjdCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNlbGxTZXJ2aWNlKCkge1xyXG4gICAgICAgIGxldCBzZXJ2aWNlID0ge1xyXG4gICAgICAgICAgICBtYXBBdHRyaWJ1dGVzOiBtYXBBdHRyaWJ1dGVzXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hcEF0dHJpYnV0ZXMoZWxlbWVudCwgYXR0cnMsIHRhYmxlQ3RybCkge1xyXG4gICAgICAgICAgICAvLyBWZXJ0aWNhbC1hbGlnblxyXG4gICAgICAgICAgICBpZiAodGFibGVDdHJsLm1pZGRsZSB8fCBhdHRycy5oYXNPd25Qcm9wZXJ0eSgnbWlkZGxlJykpXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNzcygndmVydGljYWwtYWxpZ24nLCAnbWlkZGxlJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBUZXh0LWFsaWduXHJcbiAgICAgICAgICAgIGlmICh0YWJsZUN0cmwuY2VudGVyIHx8IGF0dHJzLmhhc093blByb3BlcnR5KCdjZW50ZXInKSlcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2VtLXUtdGV4dC1hbGlnbi1jZW50ZXInKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodGFibGVDdHJsLmxlZnQgfHwgYXR0cnMuaGFzT3duUHJvcGVydHkoJ2xlZnQnKSlcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2VtLXUtdGV4dC1hbGlnbi1sZWZ0Jyk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRhYmxlQ3RybC5yaWdodCB8fCBhdHRycy5oYXNPd25Qcm9wZXJ0eSgncmlnaHQnKSlcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2VtLXUtdGV4dC1hbGlnbi1yaWdodCcpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgndW5pdHlBbmd1bGFyJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdlbVRhYmxlQm9keScsIHRhYmxlT2JqZWN0Qm9keSk7XHJcblxyXG4gICAgLy90YWJsZU9iamVjdEJvZHkuJGluamVjdCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIHRhYmxlT2JqZWN0Qm9keSgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXBsYWNlOiB0cnVlLFxyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC91bml0eS1hbmd1bGFyL3RhYmxlL3RhYmxlLW9iamVjdC1ib2R5Lmh0bWwnLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1bml0eUFuZ3VsYXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2VtVGFibGVGb290ZXInLCB0YWJsZU9iamVjdEZvb3Rlcik7XHJcblxyXG4gICAgLy90YWJsZU9iamVjdEZvb3Rlci4kaW5qZWN0ID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gdGFibGVPYmplY3RGb290ZXIoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvdW5pdHktYW5ndWxhci90YWJsZS90YWJsZS1vYmplY3QtZm9vdGVyLmh0bWwnLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1bml0eUFuZ3VsYXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2VtVGFibGVIZWFkZXInLCB0YWJsZU9iamVjdEhlYWRlcik7XHJcblxyXG4gICAgLy90YWJsZU9iamVjdEhlYWRlci4kaW5qZWN0ID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gdGFibGVPYmplY3RIZWFkZXIoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvdW5pdHktYW5ndWxhci90YWJsZS90YWJsZS1vYmplY3QtaGVhZGVyLmh0bWwnLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1bml0eUFuZ3VsYXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2VtVGFibGUnLCB0YWJsZU9iamVjdCk7XHJcblxyXG4gICAgLy90YWJsZU9iamVjdC4kaW5qZWN0ID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gdGFibGVPYmplY3QoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3VuaXR5LWFuZ3VsYXIvdGFibGUvdGFibGUtb2JqZWN0Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBlbVRhYmxlLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZW1UYWJsZSgpIHtcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgndGFibGUnLCBlbVRhYmxlKTtcclxuXHJcbiAgICAvL2VtVGFibGUuJGluamVjdCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGVtVGFibGUoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogdGFibGUsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICB0YWJsZS4kaW5qZWN0ID0gWyckYXR0cnMnXTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGFibGUoJGF0dHJzKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBhbmd1bGFyLmV4dGVuZCh2bSwge1xyXG4gICAgICAgICAgICAgICAgbWlkZGxlOiAkYXR0cnMuaGFzT3duUHJvcGVydHkoJ21pZGRsZScpLFxyXG4gICAgICAgICAgICAgICAgY2VudGVyOiAkYXR0cnMuaGFzT3duUHJvcGVydHkoJ2NlbnRlcicpLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJGF0dHJzLmhhc093blByb3BlcnR5KCdsZWZ0JyksXHJcbiAgICAgICAgICAgICAgICByaWdodDogJGF0dHJzLmhhc093blByb3BlcnR5KCdyaWdodCcpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnZW0tYy10YWJsZScpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnRvZ2dsZUNsYXNzKCdlbS1jLXRhYmxlLS1jb25kZW5zZWQnLCBhdHRycy5oYXNPd25Qcm9wZXJ0eSgnY29uZGVuc2VkJykpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnRvZ2dsZUNsYXNzKCdlbS1jLXRhYmxlLS1zdHJpcGVkJywgYXR0cnMuaGFzT3duUHJvcGVydHkoJ3N0cmlwZWQnKSk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQudG9nZ2xlQ2xhc3MoJ3ZlcnRpY2FsLXN0cmlwZWQnLCBhdHRycy5oYXNPd25Qcm9wZXJ0eSgndmVydGljYWxTdHJpcGVkJykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1bml0eUFuZ3VsYXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3Rib2R5JywgZW1UYm9keSk7XHJcblxyXG4gICAgLy9lbVRib2R5LiRpbmplY3QgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBlbVRib2R5KCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHRib2R5LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdGJvZHkoKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICAvLyBQcml2YXRlXHJcbiAgICAgICAgICAgIHZhciBwYXJlbnQ7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgb3BlbiA9IG9wZW47XHJcbiAgICAgICAgICAgIHZhciBpc09wZW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIFB1YmxpY1xyXG4gICAgICAgICAgICB2bS5wYXJlbnQ7XHJcbiAgICAgICAgICAgIHZtLmFkZENoaWxkID0gYWRkQ2hpbGQ7XHJcblxyXG4gICAgICAgICAgICAvLyBQYXJlbnQgc2V0dGVyXHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2bSwgJ3BhcmVudCcsIHtcclxuICAgICAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHNldHRpbmdQYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Rib2R5IERpcmVjdGl2ZTogY2Fubm90IGhhdmUgbW9yZSB0aGFuIG9uZSA8dHIgW3BhcmVudF0+IHBlciA8dGJvZHk+Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IHNldHRpbmdQYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50Lm9uKCdjbGljaycsIG9wZW4pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFkZENoaWxkKGNoaWxkKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgIGNoaWxkLmFkZENsYXNzKCdlbS1jLXRhYmxlX19yb3ctLXNlY29uZGFyeScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBvcGVuKCkge1xyXG4gICAgICAgICAgICAgICAgLy8gSW52ZXJ0IG9wZW5lZFxyXG4gICAgICAgICAgICAgICAgaXNPcGVuID0gIWlzT3BlbjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUb2dnbGUgcGFyZW50XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQudG9nZ2xlQ2xhc3MoJ2VtLWlzLW9wZW4nLCBpc09wZW4pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRvZ2dsZSBlYWNoIGNoaWxkXHJcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goY2hpbGRyZW4sIGZ1bmN0aW9uIChjaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLnRvZ2dsZUNsYXNzKCdlbS1pcy12aXNpYmxlJywgaXNPcGVuKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdlbS1jLXRhYmxlX19ib2R5Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgndGQnLCB0ZCk7XHJcblxyXG4gICAgdGQuJGluamVjdCA9IFsnY2VsbFNlcnZpY2UnXTtcclxuXHJcbiAgICBmdW5jdGlvbiB0ZChjZWxsU2VydmljZSkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHJlcXVpcmU6IFsnXl50YWJsZScsICdeXj90Ym9keScsICdeXj90Zm9vdCcsICdeXnRyJ11cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkaXJlY3RpdmU7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGN0cmxzKSB7XHJcbiAgICAgICAgICAgIHZhciB0YWJsZUN0cmwgPSBjdHJsc1swXTtcclxuICAgICAgICAgICAgdmFyIHRib2R5Q3RybCA9IGN0cmxzWzFdO1xyXG4gICAgICAgICAgICB2YXIgdGZvb3RDdHJsID0gY3RybHNbMl07XHJcbiAgICAgICAgICAgIHZhciB0ckN0cmwgPSBjdHJsc1szXTtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbXBvbmVudCBjbGFzc1xyXG4gICAgICAgICAgICBpZiAodGJvZHlDdHJsKVxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnZW0tYy10YWJsZV9fY2VsbCcpO1xyXG4gICAgICAgICAgICBlbHNlIGlmICh0Zm9vdEN0cmwpXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdlbS1jLXRhYmxlX19mb290ZXItY2VsbCcpO1xyXG5cclxuICAgICAgICAgICAgLy8gUGFyZW50IGNlbGxcclxuICAgICAgICAgICAgaWYgKHRyQ3RybC5pc1BhcmVudClcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2VtLWMtdGFibGVfX2NlbGwtLWRyb3Bkb3duJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBVdGlsaXR5IGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgY2VsbFNlcnZpY2UubWFwQXR0cmlidXRlcyhlbGVtZW50LCBhdHRycywgdGFibGVDdHJsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgndW5pdHlBbmd1bGFyJylcclxuICAgICAgICAuZGlyZWN0aXZlKCd0aCcsIHRoKTtcclxuXHJcbiAgICB0aC4kaW5qZWN0ID0gWydjZWxsU2VydmljZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIHRoKGNlbGxTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVxdWlyZTogJ15edGFibGUnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCB0YWJsZUN0cmwpIHtcclxuICAgICAgICAgICAgLy8gQ29tcG9uZW50IGNsYXNzXHJcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ2VtLWMtdGFibGVfX2hlYWRlci1jZWxsJyk7XHJcblxyXG4gICAgICAgICAgICAvLyBVdGlsaXR5IGF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgY2VsbFNlcnZpY2UubWFwQXR0cmlidXRlcyhlbGVtZW50LCBhdHRycywgdGFibGVDdHJsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgndW5pdHlBbmd1bGFyJylcclxuICAgICAgICAuZGlyZWN0aXZlKCd0aGVhZCcsIGVtVGhlYWQpO1xyXG5cclxuICAgIC8vZW1UaGVhZC4kaW5qZWN0ID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gZW1UaGVhZCgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiB0aGVhZCxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHRoZWFkKCkge1xyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnZW0tYy10YWJsZV9faGVhZGVyJyk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQudG9nZ2xlQ2xhc3MoJ2ludmVydCcsIGF0dHJzLmhhc093blByb3BlcnR5KCdpbnZlcnQnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgndHInLCBlbVRyKTtcclxuXHJcbiAgICAvL2VtVHIuJGluamVjdCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGVtVHIoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgcmVxdWlyZTogWydeXj90aGVhZCcsICdeXj90Ym9keScsICdeXj90Zm9vdCddLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiB0cixcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIHRyLiRpbmplY3QgPSBbJyRzY29wZScsICckZWxlbWVudCcsICckYXR0cnMnXTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdHIoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSB7XHJcbiAgICAgICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICB2bS5pc1BhcmVudCA9ICRhdHRycy5oYXNPd25Qcm9wZXJ0eSgncGFyZW50Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybHMpIHtcclxuICAgICAgICAgICAgdmFyIHRoZWFkQ3RybCA9IGN0cmxzWzBdO1xyXG4gICAgICAgICAgICB2YXIgdGJvZHlDdHJsID0gY3RybHNbMV07XHJcbiAgICAgICAgICAgIHZhciB0Zm9vdEN0cmwgPSBjdHJsc1syXTtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbXBvbmVudCBjbGFzc1xyXG4gICAgICAgICAgICBpZiAodGhlYWRDdHJsKVxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnZW0tYy10YWJsZV9faGVhZGVyLXJvdycpO1xyXG4gICAgICAgICAgICBlbHNlIGlmICh0Ym9keUN0cmwpXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdlbS1jLXRhYmxlX19yb3cnKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodGZvb3RDdHJsKVxyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnZW0tYy10YWJsZV9fZm9vdGVyLXJvdycpO1xyXG5cclxuICAgICAgICAgICAgLy8gR3JvdXAgdXRpbGl0eVxyXG4gICAgICAgICAgICBpZiAodGJvZHlDdHJsKVxyXG4gICAgICAgICAgICAgICAgaWYgKGF0dHJzLmhhc093blByb3BlcnR5KCdwYXJlbnQnKSlcclxuICAgICAgICAgICAgICAgICAgICB0Ym9keUN0cmwucGFyZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGF0dHJzLmhhc093blByb3BlcnR5KCdjaGlsZHJlbicpKVxyXG4gICAgICAgICAgICAgICAgICAgIHRib2R5Q3RybC5hZGRDaGlsZChlbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCd1bml0eUFuZ3VsYXInKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ2VtVHJlZUNvbGxhcHNlJywgdHJlZUNvbGxhcHNlKTtcclxuXHJcbiAgICAvL3RyZWVDb2xsYXBzZS4kaW5qZWN0ID0gW107XHJcbiAgICBcclxuICAgIGZ1bmN0aW9uIHRyZWVDb2xsYXBzZSgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC91bml0eS1hbmd1bGFyL3RyZWUtbmF2L3RyZWUtY29sbGFwc2UuaHRtbCcsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXF1aXJlOiAnXl5lbVRyZWVMaXN0J1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgZW1UcmVlTGlzdEN0cmwpIHtcclxuICAgICAgICAgICAgc2NvcGUudm0gPSB7XHJcbiAgICAgICAgICAgICAgICBjb2xsYXBzZWQ6IHRydWVcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHNjb3BlLnZtLmNvbGxhcHNlID0gY29sbGFwc2U7XHJcblxyXG4gICAgICAgICAgICAvLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gY29sbGFwc2UoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJbnZlcnQgYW5kIHN0b3JlXHJcbiAgICAgICAgICAgICAgICBsZXQgY29sbGFwc2VkID0gc2NvcGUudm0uY29sbGFwc2VkID0gIXNjb3BlLnZtLmNvbGxhcHNlZDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBcHBseSB0byBhbGwgaXRlbXMgKGlubGN1ZGluZyBuZXN0ZWQpXHJcbiAgICAgICAgICAgICAgICBjb2xsYXBzZUl0ZW1zKGVtVHJlZUxpc3RDdHJsLnRyZWVJdGVtcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8vLy8vLy8vXHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY29sbGFwc2VJdGVtcyhpdGVtcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtcyAmJiBpdGVtcy5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChpdGVtcywgZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlSXRlbShpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gY29sbGFwc2VJdGVtKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBcHBseSB0byBuZXN0ZWQgaXRlbXNcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5jaGlsZHJlbiAmJiBpdGVtLmNoaWxkcmVuLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uaXNBY3RpdmUgPSAhY29sbGFwc2VkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsYXBzZUl0ZW1zKGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZW1UcmVlSXRlbScsIHRyZWVJdGVtKTtcclxuXHJcbiAgICAvL3RyZWVJdGVtLiRpbmplY3QgPSBbXTtcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gdHJlZUl0ZW0oKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvdW5pdHktYW5ndWxhci90cmVlLW5hdi90cmVlLWl0ZW0uaHRtbCcsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBlbVRyZWVJdGVtLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXHJcbiAgICAgICAgICAgIHJlcXVpcmU6ICdeXmVtVHJlZUxpc3QnXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGVtVHJlZUl0ZW0oKSB7XHJcbiAgICAgICAgICAgIGxldCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICB2bS5pc0FjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2bS5jaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgICAgICB2bS5oYXNDaGlsZHJlbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHZtLCAnaGFzQ2hpbGRyZW4nLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gISF0aGlzLmNoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycywgZW1UcmVlTGlzdEN0cmwpIHtcclxuICAgICAgICAgICAgZW1UcmVlTGlzdEN0cmwudHJlZUl0ZW1zLnB1c2goc2NvcGUudm0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3VuaXR5QW5ndWxhcicpXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgnZW1UcmVlTGluaycsIHRyZWVMaW5rKTtcclxuXHJcbiAgICAvL3RyZWVMaW5rLiRpbmplY3QgPSBbXTtcclxuICAgIFxyXG4gICAgZnVuY3Rpb24gdHJlZUxpbmsoKSB7XHJcbiAgICAgICAgdmFyIGRpcmVjdGl2ZSA9IHtcclxuICAgICAgICAgICAgbGluazogbGluayxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvdW5pdHktYW5ndWxhci90cmVlLW5hdi90cmVlLWxpbmsuaHRtbCcsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXF1aXJlOiAnXl5lbVRyZWVJdGVtJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuICAgICAgICBcclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCBlbVRyZWVJdGVtQ3RybCkge1xyXG4gICAgICAgICAgICBzY29wZS52bSA9IHtcclxuICAgICAgICAgICAgICAgIGl0ZW06IGVtVHJlZUl0ZW1DdHJsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgndW5pdHlBbmd1bGFyJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdlbVRyZWVMaXN0JywgdHJlZUxpc3QpO1xyXG5cclxuICAgIC8vdHJlZUxpc3QuJGluamVjdCA9IFtdO1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiB0cmVlTGlzdCgpIHtcclxuICAgICAgICB2YXIgZGlyZWN0aXZlID0ge1xyXG4gICAgICAgICAgICBsaW5rOiBsaW5rLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC91bml0eS1hbmd1bGFyL3RyZWUtbmF2L3RyZWUtbGlzdC5odG1sJyxcclxuICAgICAgICAgICAgcmVwbGFjZTogdHJ1ZSxcclxuICAgICAgICAgICAgdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdFJyxcclxuICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGVtVHJlZUxpc3QsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogXCJ2bVwiLFxyXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB0cnVlLFxyXG4gICAgICAgICAgICByZXF1aXJlOiBcIl5eP2VtVHJlZUl0ZW1cIlxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIGZ1bmN0aW9uIGVtVHJlZUxpc3QoKSB7XHJcbiAgICAgICAgICAgIGxldCB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBsZXQgdHJlZUl0ZW1zID0gW107XHJcblxyXG4gICAgICAgICAgICB2bS50cmVlSXRlbXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh2bSwgJ3RyZWVJdGVtcycsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cmVlSXRlbXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbGluayhzY29wZSwgZWxlbWVudCwgYXR0cnMsIGVtVHJlZUl0ZW1DdHJsKSB7XHJcbiAgICAgICAgICAgIGlmIChlbVRyZWVJdGVtQ3RybCkge1xyXG4gICAgICAgICAgICAgICAgZW1UcmVlSXRlbUN0cmwuY2hpbGRyZW4gPSBzY29wZS52bS50cmVlSXRlbXM7XHJcbiAgICAgICAgICAgICAgICBzY29wZS52bS5wYXJlbnQgPSBlbVRyZWVJdGVtQ3RybDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBzY29wZS52bS5pc1RvcCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgndW5pdHlBbmd1bGFyJylcclxuICAgICAgICAuZGlyZWN0aXZlKCdlbVRyZWVOYXYnLCB0cmVlTmF2KTtcclxuXHJcbiAgICAvL3RyZWVOYXYuJGluamVjdCA9IFtdO1xyXG4gICAgXHJcbiAgICBmdW5jdGlvbiB0cmVlTmF2KCkge1xyXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XHJcbiAgICAgICAgICAgIGxpbms6IGxpbmssXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3VuaXR5LWFuZ3VsYXIvdHJlZS1uYXYvdHJlZS1uYXYuaHRtbCcsXHJcbiAgICAgICAgICAgIHJlcGxhY2U6IHRydWUsXHJcbiAgICAgICAgICAgIHRyYW5zY2x1ZGU6IHRydWUsXHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRScsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XHJcbiAgICAgICAgICAgIGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eSgnZnVsbFdpZHRoJykpXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNzcygnbWF4LXdpZHRoJywgJ25vbmUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7IixudWxsLG51bGxdfQ==