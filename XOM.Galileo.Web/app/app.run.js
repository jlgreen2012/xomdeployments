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