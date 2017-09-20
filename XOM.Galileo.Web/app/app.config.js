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