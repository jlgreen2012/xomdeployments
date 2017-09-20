/*
 * This is a mock configs module which is generated via a gulp task for each environment.
 * Because we don't actually care what is in the configs file in our tests, we can fake it and only load
 * this config file for our tests.
 */

angular.module('mock.configs', [])
.constant('configs', {
    'apiUrl': 'http://localhost:13547/api/',
    'enableDebug': true
});