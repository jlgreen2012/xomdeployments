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