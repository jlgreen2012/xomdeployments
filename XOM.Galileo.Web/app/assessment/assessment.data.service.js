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
            addSharedTeamAssessment: addSharedTeamAssessment
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
    }
})();