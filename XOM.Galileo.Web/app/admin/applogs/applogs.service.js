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