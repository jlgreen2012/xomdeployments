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