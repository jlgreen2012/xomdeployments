(function () {
    'use strict';

    angular
        .module('app.assessment')
        .controller('AssessmentController', AssessmentController);

    AssessmentController.$inject = ['assessmentDataService', '$log',
                                    '$routeParams', 'action', '$location', '$q', '$rootScope', '$timeout'];

    /**
     * Controller responsible for all actions related to taking and reviewing an assessment.
     * @param {AssessmentDataService} assessmentDataService
     * @param {$log} $log
     * @param {$routeParams} $routeParams
     * @param {$action} action
     * @param {$location} $location
     * @param {$q} $q
     * @param {$rootScope} $rootScope
     * @param {$timeout} $timeout
     */
    function AssessmentController(assessmentDataService, $log, $routeParams,
                                     action, $location, $q, $rootScope, $timeout) {
        var vm = this,
            routeAssessmentId = null,
            routeTeamId = null,
            routeTeamAssessmentId = null;

        // Available viewing modes.
        vm.modes = {
            review: 0,
            reviewDetails: 1,
            edit: 2,
            download: 3
        };

        // All assessments. Team Assessments are objects within these assessments.
        vm.assessments = [];

        // Current assessment.
        vm.assessment = {
            teamAssessments: []
        };

        // Current TEAM assessment that the user is either taking or reviewing.
        vm.current = {
            details: {},
            radarChartData: {},
            questionResponsesByCategory: [],
            mode: vm.modes.review,
            cancel: function () { $location.path('/assessments'); },
            save: saveAssessment,
            submit: submitAssessment,
            review: function () { $location.path('/assessments/' + this.details.assessmentId); },
        };

        // Indication that we have all of the data that the UI needs to display.
        vm.loaded = false;

        // Error or informative message to display instead of the intended content.
        vm.message = null;

        // Error or information message to display in addition to the intended content.
        vm.info = null;

        // Assessment actions.
        vm.getAssessmentList = getAssessmentList;
        vm.getTeamAssessmentList = getTeamAssessmentList;
        vm.getTeamAssessmentListForAssessment = getTeamAssessmentListForAssessment;
        vm.getTeamAssessmentDetailsById = getTeamAssessmentDetailsById;
        vm.takeAssessment = takeAssessment;
        vm.reviewTeamAssessment = reviewTeamAssessment;
        vm.addSharedAssessment = addSharedAssessment;
        vm.getShareAssessmentLink = getShareAssessmentLink;
        vm.activate = activate;

        activate();

        /**
         * Actions to take upon page load.
         */
        function activate() {
            vm.loaded = false;

            // Get route params.
            routeAssessmentId = +$routeParams.assessmentId;
            routeTeamId = +$routeParams.teamId;
            routeTeamAssessmentId = +$routeParams.teamAssessmentId;

            // always get all assessments and their team assessment info. Top level only.
            vm.getAssessmentList()
                .then(function () {
                    if (!isNaN(routeAssessmentId)) {
                        vm.getTeamAssessmentListForAssessment(routeAssessmentId)
                            .then(function () {
                                // Set the current assessment based on route params.
                                selectCurrentAssessmentById(routeAssessmentId);

                                switch (action) {
                                    case 'TAKE_ASSESSMENT':
                                        // Start the assessment.
                                        setCurrentMode(vm.modes.edit);
                                        vm.takeAssessment();
                                        break;

                                    case 'REVIEW_ASSESSMENT':
                                        // Get the team assessment details.
                                        setCurrentMode(vm.modes.review);
                                        var toReview = getDefaultTeamAssessmentForCurrentAssessment();
                                        vm.reviewTeamAssessment(toReview)
                                            .catch(function (error) {
                                                vm.message = 'Unable to review assessment.';
                                            })
                                            .finally(function () {
                                                vm.loaded = true;
                                            });
                                        break;

                                    case 'SHARE_ASSESSMENT':
                                        // Add the assessment to the shared list.
                                        vm.addSharedAssessment(routeAssessmentId, routeTeamId);
                                        break;

                                    case 'EXPORT_ASSESSMENT':
                                        // Get the review data and indicate that it's loaded and read to download.
                                        var toReview = getTeamAssessmentById(routeTeamAssessmentId);
                                        vm.reviewTeamAssessment(toReview)
                                            .catch(function (error) {
                                                vm.message = 'Unable to export assessment.';
                                            })
                                            .finally(function () {
                                                setCurrentMode(vm.modes.download);
                                                vm.loaded = true;
                                            });
                                        break;

                                    default:
                                        // Indicate we've loaded all that we've been told to.
                                        vm.loaded = true;
                                        break;
                                }
                            });
                    }
                });
        }

        /**
         * Sets the current viewing mode.
         * @param {Int} mode - from vm.modes enum
         */
        function setCurrentMode(mode) {
            vm.current.mode = mode;
        }

        /**
         * Sets the current assessment based on the provided id.
         * @param {Int} assessmentId
         */
        function selectCurrentAssessmentById(assessmentId) {
            vm.assessment = vm.assessments.find(function (a) {
                return a.id === assessmentId;
            });
        }

        /**
         * Gets the default team assessment for the current assessment.
         * @returns {Object} team assessment details. Returns undefined if not found. 
         */
        function getDefaultTeamAssessmentForCurrentAssessment() {
            var teamAssessment;
            if (vm.assessment.teamAssessments.length > 0) {
                teamAssessment = vm.assessment.teamAssessments[0].latest;
            }
            return teamAssessment;
        }

        /**
         * Gets the team assessment matching the provided id on the current assessment.
         * @param {Int} teamAssessmentId
         * @returns {Object} the team assessment details. Returns undefined if not found. 
         */
        function getTeamAssessmentById(teamAssessmentId) {
            var teamAssessment;
            if (vm.assessment.teamAssessments.length > 0) {
                teamAssessment = vm.assessment.teamAssessments
                            .map(function (t) {
                                return t.list;
                            })
                            .reduce(function (flat, toFlatten) {
                                return flat.concat(toFlatten);
                            }, [])
                            .find(function (t) {
                                return t.id === routeTeamAssessmentId;
                            });
            }
            return teamAssessment;
        }

        /**
         * Gets all available assessments.
         * Does not include any team assessments.
         * @returns {Promise}
         */
        function getAssessmentList() {
            var deferred = $q.defer();
            assessmentDataService.getAssessments()
                .then(function (data) {
                    vm.assessments = data;
                    deferred.resolve(vm.assessments);
                });

            // Return a promise so that we can chain these together as needed.
            return deferred.promise;
        }

        /**
         * Gets all team assessments for all assessments.
         * @returns {Promise}
         */
        function getTeamAssessmentList() {
            var deferred = $q.defer(),
                detailsPromises = [];

            // Get all team assessments for each assessment.
            detailsPromises = vm.assessments.map(function (assessment, index) {
                // add a new promise to our list.
                // this promise includes adding the team assessments to our array.
                return assessmentDataService.getTeamAssessments(assessment.id)
                        .then(function (data) {
                            vm.assessments[index].teamAssessments = data;
                            return $q.resolve();
                        });
            });

            // send all of our promises at the same time to get all of our details for all assessments.
            $q.all(detailsPromises)
                .then(function (data) {
                    deferred.resolve();
                });

            // Return a promise so that we can chain these together as needed.
            return deferred.promise;
        }

        /**
         * Gets all team assessments for the given assessment.
         * @param {Number} assessmentId
         * @returns {Promise}
         */
        function getTeamAssessmentListForAssessment(assessmentId) {
            var deferred = $q.defer();
            assessmentDataService.getTeamAssessments(assessmentId)
                .then(function (data) {
                    vm.assessments.forEach(function (a) {
                        a.teamAssessments = [];

                        // Match up to the desired assessment.
                        if (a.id === assessmentId) {
                            let teamGroup = data.group(teamAssessment => teamAssessment.teamName),
                                teamAssessments = [],
                                teamAssessmentObj = null;
                            // Get the latest team assessment for each team and add it to the list.
                            angular.forEach(teamGroup, function (groupedData) {
                                teamAssessments = groupedData.data;
                                teamAssessmentObj = getMostRecentAttemptForTeam(teamAssessments);
                                a.teamAssessments.push(teamAssessmentObj);
                            });
                        }
                    });
                    deferred.resolve();
                });
            // Return a promise so that we can chain these together as needed.
            return deferred.promise;
        }

        /**
         * Creates the team assessment object containing the most recent team assessment
         * AND the list of all team assessments for a particular team.
         * @param {Array} groupedTeamAssessments - flat list of team assessments for a given team
         * @returns {Object} in the form of { latest: {}, list: [] }
         */
        function getMostRecentAttemptForTeam(groupedTeamAssessments) {
            let mostRecentTeamAssessment = null,
                teamAssessmentObj = null;

            if (groupedTeamAssessments.length > 1) {
                // Get the latest completed OR started team assessment.
                mostRecentTeamAssessment = groupedTeamAssessments.reduce(function (prev, current) {
                    var prevDate, currentDate;
                    prevDate = prev.completed !== null ? prev.completed : prev.started;
                    currentDate = current.completed !== null ? current.completed : current.started;
                    return prevDate > currentDate ? prev : current;
                });

                // Add to the list of team assessments.
                teamAssessmentObj = {
                    latest: mostRecentTeamAssessment,
                    list: groupedTeamAssessments
                };
            }
            else {
                // if there's only one attempt, make that the most recent.
                teamAssessmentObj = {
                    latest: groupedTeamAssessments[0],
                    list: groupedTeamAssessments
                };
            }
            return teamAssessmentObj;
        }

        /**
         * Get the Team Assessment object detailed responses.
         * @param {Int} assessmentId
         * @param {Int} teamAssessmentId
         * @returns {Promise} returns empty promise when completed
         */
        function getTeamAssessmentDetailsById(assessmentId, teamAssessmentId) {
            var deferred = $q.defer();

            assessmentDataService.getTeamAssessmentDetailsById(assessmentId, teamAssessmentId)
                .then(function (data) {
                    if (typeof data !== "undefined") {
                        vm.current.details = data;
                    }
                    else {
                        vm.message = "Unable to retrieve team assessment details. Please try again.";
                    }
                    deferred.resolve();
                });

            // Return a promise so that we can chain these together as needed.
            return deferred.promise;
        }

        /**
         * Starts the assessment and loads the questions.
         */
        function takeAssessment() {
            vm.loaded = false;

            if (routeAssessmentId > 0 && routeTeamId > 0) {
                $log.debug("Starting assessment for id: " +
                    routeAssessmentId +
                    " and team id: " +
                    routeTeamId);

                // Create team assessment object.
                assessmentDataService.startAssessment(routeAssessmentId, routeTeamId)
                    .then(function (data) {
                        vm.current.details = data;
                    })
                    .catch(function (error) {
                        if (typeof error !== "undefined" && error !== null && error !== "") {
                            vm.message = error.toString();
                        }
                        else {
                            vm.message = "An unknown error occurred while trying to start this assessment. Please try again.";
                        }
                    })
                    .finally(function () {
                        vm.loaded = true;
                    });
            }
        }

        /**
         * Gets the team assessment details to review.
         * Builds the radar chart data for the current assessment.
         * @param {Object} assessment - team assessment object
         */
        function reviewTeamAssessment(assessment) {
            var deferred = $q.defer();
            if (typeof assessment === "undefined") {
                deferred.reject("Assessment is undefined");
            }
            else if (typeof vm.current.details !== "undefined" && vm.current.details.id === assessment.id) {
                deferred.resolve();
            }
            else {

                vm.current.mode = vm.modes.review;
                vm.current.details = assessment;
                vm.current.radarChartData = null;
                vm.isTeamAssessmentDetailLoading = true;

                // Get other attempt info.
                vm.current.attempts = getTeamAssessmentAttempts(vm.assessment.teamAssessments,
                                                                vm.current.details.assessmentId,
                                                                vm.current.details.teamId);

                // Get the assessment details, like questions and answers.
                vm.getTeamAssessmentDetailsById(vm.current.details.assessmentId, vm.current.details.id)
                    .then(function () {
                        // Setup the radar chart data.
                        vm.current.radarChartData = {
                            data: [],
                            legend: []
                        };
                        if (typeof vm.current.details !== "undefined" && vm.current.details !== null &&
                            vm.current.details.categoryResults !== null && typeof vm.current.details.categoryResults !== "undefined" && vm.current.details.categoryResults.length > 0) {
                            buildRadarChartDataForCurrentTeamAssessment();
                        }

                        // Indicate to UI that we have the data we need.
                        vm.isTeamAssessmentDetailLoading = false;
                        deferred.resolve();
                    });
            }

            return deferred.promise;
        }

        /**
         * Adds the grouped question and radar data to the current team assessment.
         */
        function buildRadarChartDataForCurrentTeamAssessment() {
            // Setup the grouped question responses by category.
            vm.current.questionResponsesByCategory = getQuestionReviewDataForCategories();

            // Setup the data in the structure thee radar chart wants.
            // Handle the case where all questions within a category were answered with NA.
            vm.current.radarChartData.data.push(
                vm.current.details.categoryResults.map(function (category) {
                    return {
                        axis: isNaN(parseFloat(category.score)) ? category.name + ' (NA)' : category.name,
                        value: isNaN(parseFloat(category.score)) ? 0 : category.score
                    }
                }
            ));

            // Create our spike labels and their click functions.
            vm.current.radarChartData.legend =
                vm.current.details.categoryResults.map(function (category) {
                    return {
                        name: category.name,
                        click: function () {
                            if (vm.current.mode === vm.modes.review) {
                                vm.current.mode = vm.modes.reviewDetails;

                                // Filter down to just this category.
                                vm.current.radarChartData.reviewQuestionData = vm.current.questionResponsesByCategory.filter(function (categoryGroup) {
                                    return categoryGroup.categoryName === category.name;
                                });

                                // Update scope manually since we're manipulating it from within this external click function.
                                $rootScope.$apply();
                            }
                        }
                    };
                });
        }

        /**
         * Builds the grouped question response list by category name.
         * @returns {Array} Each object includes
         * category name, questions, and score.
         */
        function getQuestionReviewDataForCategories() {
            let groupdQuestionsByCategory = vm.current.details.questions
                .group(q => q.categoryName)

                .map(function (g) {
                    return {
                        categoryName: g.key,
                        questions: g.data,
                        score: vm.current.details.categoryResults.find(function (c) {
                            return c.name === g.key;
                        }).score
                    }
                });
            return groupdQuestionsByCategory;
        }

        /**
         * Gets the list of team assessment attempts.
         * @param {Array} teamAssessments all team assessments with its list and latest items.
         * @param {Int} assessmentId id of the assessment to filter on
         * @param {Int} teamId id of the team to filter on
         * @returns {Object} team assessment object with list and latest attempts.
         */
        function getTeamAssessmentAttempts(teamAssessments, assessmentId, teamId) {
            let attempts = {},
                teamAssessment = null;
            teamAssessment = teamAssessments.find(function (teamAssessment) {
                var listItem = teamAssessment.latest;
                return listItem.assessmentId === assessmentId && listItem.teamId === teamId;
            });
            if (typeof teamAssessment !== "undefined") {
                attempts = teamAssessment;
            }

            return attempts;
        }

        /**
         * Saves the current assessment but does not submit it.
         * @returns {Promise}
         */
        function saveAssessment() {
            return assessmentDataService
                .saveAssessment(routeAssessmentId, routeTeamId, vm.current.details)
                    .then(function (data) {
                        $log.debug("Assessment saved! Redirecting...");
                        vm.current.review();
                    })
                   .catch(function (error) {
                       // return error to wizard.
                       return $q.reject(error);
                   });
        }

        /**
         * Submits the current assessment
         * @returns {Promise}
         */
        function submitAssessment() {
            return assessmentDataService
                .submitAssessment(routeAssessmentId, routeTeamId, vm.current.details)
                    .then(function (data) {
                        $log.debug("Assessment submitted!");
                    })
                    .catch(function (error) {
                        return $q.reject(error);
                    });
        }

        /**
         * Adds the assessment to the current user's shared assessment list.
         * @param {Number} assessmentId
         * @param {Number} teamId
         */
        function addSharedAssessment(assessmentId, teamId) {
            // Create link to assessment.
            assessmentDataService.addSharedTeamAssessment(assessmentId, teamId)
                .then(function (data) {
                    // If it's not already there, add the assessment to the team assessment list.
                    // Could go to the server again to get the full list, but trying to save a trip.
                    let teamAssessmentObj = vm.assessment.teamAssessments.find(function (t) {
                        return t.latest.teamId === teamId;
                    }),
                    exists = teamAssessmentObj.list.findIndex(function (t) { return t.id === data.id; }) >= 0;

                    if (exists === false) {
                        vm.getTeamAssessmentListForAssessment(vm.assessment.id)
                        .then(function () {
                            // Show our shared message for a moment if this is a new addition to our list.
                            vm.info = 'The assessment for ' + data.teamName + ' has been successfully added to your shared assessment list.';
                            $timeout(function () {
                                vm.info = null;
                            }, 5 * 1000);
                        });
                    }

                    // Review that assessment.
                    vm.current.mode = vm.modes.review;

                    // Load the review data for the shared assessment.
                    vm.reviewTeamAssessment(data);
                })
                .catch(function (error) {
                    // If failed, show an error message instead of and review details.
                    if (error !== null && typeof error !== "undefined") {
                        vm.message = 'An error occurred while trying to add the shared assessment: ' + error;
                    }
                    else {
                        vm.message = 'An error occurred while trying to add the shared assessment. Please try again.';
                    }
                })
                .finally(function () {
                    vm.loaded = true;
                });
        }

        /**
         * Gets the link used to share the currently reviewed assessment.
         * @returns {String} full url for a user to click to add the assessment to their shared assessment list.
         */
        function getShareAssessmentLink() {
            if (!angular.equals(vm.current.details, {})) {
                var assessmentId = vm.current.details.assessmentId,
                    teamId = vm.current.details.teamId;
                return assessmentDataService.getTeamAssessmentShareLink(assessmentId, teamId);
            }
        }
    }
})();