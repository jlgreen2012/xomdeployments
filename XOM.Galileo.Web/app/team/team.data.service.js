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