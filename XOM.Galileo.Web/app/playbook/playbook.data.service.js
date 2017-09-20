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