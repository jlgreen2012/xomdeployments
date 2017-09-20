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