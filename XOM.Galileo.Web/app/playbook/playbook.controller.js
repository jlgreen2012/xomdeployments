(function () {
    'use strict';

    angular
        .module('app.playbook')
        .controller('PlaybookController', PlaybookController);

    PlaybookController.$inject = ['playbookDataService', 'assessmentDataService', '$log',
                                    '$routeParams', 'action', '$location', '$timeout', '$q', '$rootScope',
                                    'userService', 'authService'];

    /**
     * Controller responsible for all actions related to taking and reviewing an assessment.
     * @param {playbookDataService} playbookDataService
     * @param {assessmentDataService} assessmentDataService
     * @param {$log} $log
     * @param {$routeParams} $routeParams
     * @param {$action} action
     * @param {$location} $location
     * @param {$timeout} $timeout
     * @param {$q} $q
     * @param {$rootScope} $rootScope
     * @param {Object} userService
     * @param {Object} authService
     */
    function PlaybookController(playbookDataService, assessmentDataService, $log, $routeParams,
                                     action, $location, $timeout, $q, $rootScope, userService, authService) {
        var vm = this;

        // Available viewing modes.
        vm.modes = {
            review: 0,
            edit: 1,
            download: 2
        };

        // All playbooks.
        vm.playbooks = [];

        // Current playbook with details.
        vm.current = {
            details: {},
            suggestions: [],
            versions: [],
            mode: vm.modes.edit
        };

        // Available team assessments to create a playbook for.
        //vm.teamAssessments = [];
        // Assessment all of the playbooks are related to.
        vm.assessment = null;

        // New playbook form.
        vm.newPlaybookForm = {
            // Form object with validation.
            form: {},

            // List of unique teams to select from.
            teams: [],

            // Upon team selection, determine if we should show the versions dropdown or select the default team assessment.
            // Show the version dropdown if the most recent attempt is in progress.
            selectTeam: function (team) {
                vm.newPlaybookForm.showVersionSelector = team.selectedTeamAssessmentAttempt.completed === null &&
                    team.allTeamAssessmentAttempts.length > 1;

                vm.current.details.teamAssessment = team.selectedTeamAssessmentAttempt;
            },

            // Upon team assessment selection, validate that the version selected is the most recent completed attempt
            // and set the team assessment.
            selectTeamAssessment: function (ta) {
                var hasAMoreRecentAttempt = vm.newPlaybookForm.selected.allTeamAssessmentAttempts.filter(function (x) {
                    return x.completed !== null
                }).find(function (x) {
                    return x.completed > ta.completed;
                });

                if (typeof hasAMoreRecentAttempt !== "undefined") {
                    vm.newPlaybookForm.form.teamAssessment.$setValidity('latestAttempt', false);
                }
            },

            // Indicator if we should show the version dropdown.
            showVersionSelector: false,

            // Selected team item.
            selected: null,

            // Checks if a team is selected.
            hasSelectedTeam: function() {
                return vm.newPlaybookForm.selected !== null && typeof vm.newPlaybookForm.selected !== "undefined";
            },

            // Cancel action on form.
            cancel: function () {
                $location.path('/assessments/' + $routeParams.assessmentId + '/playbooks');
            }
        };
        vm.ownerForm = {
            form: {},
            onSave: updatePlaybookOwner,
            cancel: null,
            users: []
        };

        // Indication that we have all of the data that the UI needs to display.
        vm.loaded = false;

        // Error or informative message to display instead of the intended content.
        vm.message = null;

        // Error or information message to display in addition to the intended content.
        vm.info = null;

        // Playbook actions.
        vm.getPlaybookList = getPlaybookList;
        vm.getPlaybook = getPlaybook;
        vm.createPlaybook = createPlaybook;
        vm.navigateToPlaybookDetails = navigateToPlaybookDetails;
        vm.getSharePlaybookLink = getSharePlaybookLink;
        vm.addSharedPlaybook = addSharedPlaybook;
        vm.activate = activate;

        activate();

        /**
         * Actions to take upon page load.
         */
        function activate() {
            vm.loaded = false;
            vm.assessment = {
                id: +$routeParams.assessmentId
            };

            // Get the appropriate data based on our desired action.
            switch (action) {
                // Get all playbooks and then load the details for a default playbook.
                case 'LIST_PLAYBOOKS':
                    // Get the list.
                    getPlaybookList(vm.assessment.id)
                        .then(function () {
                            // Then get the details for the first playbook.
                            if (vm.playbooks.length > 0) {
                                var defaultPlaybook = vm.playbooks[0].latest;
                                getPlaybook(defaultPlaybook.id)
                                    .then(function () {
                                        setAssessmentName(vm.current.details.teamAssessment);
                                        vm.loaded = true;
                                    });
                            }
                            else {
                                vm.loaded = true;
                            }
                        });
                    break;

                    // Get the details for a specific playbook.
                case 'PLAYBOOK_DETAILS':
                    // Get the list.
                    getPlaybookList(vm.assessment.id);

                    // Get the details for the specified playbook.
                    getPlaybook(+$routeParams.playbookId)
                        .then(function () {
                            setAssessmentName(vm.current.details.teamAssessment);
                            vm.loaded = true;
                        });
                    break;

                    // Create a new playbook and then load the details.
                case 'CREATE_PLAYBOOK':
                    getLatestTeamAssessmentListByTeam(vm.assessment.id)
                        .then(function (list) {
                            // build team list with team assessments
                            vm.newPlaybookForm.teams = list.map(function (l) {
                                return {
                                    id: l.latest.teamId,
                                    name: l.latest.teamName,
                                    selectedTeamAssessmentAttempt: l.latest,
                                    allTeamAssessmentAttempts: l.list
                                };
                            });
                            
                            // If route params are provided for a teamassessment, pre-select the fields.
                            if (+$routeParams.assessmentId > 0 && +$routeParams.teamAssessmentId > 0) {
                                let team, teamAssessment = null;
                                teamAssessment = assessmentDataService.getTeamAssessmentByIdFromGroupedList(
                                                        list, +$routeParams.teamAssessmentId);

                                if (teamAssessment !== null && typeof teamAssessment !== "undefined") {
                                    team = vm.newPlaybookForm.teams.find(function (x) {
                                        return x.id === teamAssessment.teamId;
                                    });
                                    vm.newPlaybookForm.selected = team;
                                    vm.newPlaybookForm.selectTeam(team);
                                    vm.newPlaybookForm.selectTeamAssessment(teamAssessment);
                                }
                            }

                            vm.loaded = true;
                        });
                    break;

                case 'SHARE_PLAYBOOK':
                    // Populate fields for the create form.
                    getPlaybookList(vm.assessment.id)
                        .then(function () {
                            // Add the playbook to the shared list.
                            vm.addSharedPlaybook(+$routeParams.playbookId);
                        });
                    break;

                case 'EXPORT_PLAYBOOK':
                    // Get the list.
                    getPlaybookList(vm.assessment.id);

                    // Get the details for the specified playbook.
                    getPlaybook(+$routeParams.playbookId)
                        .then(function () {
                            setAssessmentName(vm.current.details.teamAssessment);

                            // Hide irrelevant info from the pages.
                            vm.current.mode = vm.modes.download;

                            // Download the pdf. Add a delay to ensure bindings are all complete.
                            $timeout(function () {
                                // Indicate the page is loaded and ready to download.
                                vm.loaded = true;
                            }, 1250);
                        });

                    break;

                default:
                    getPlaybookList();
                    vm.loaded = true;
                    break;
            }
        }

        /**
         * Sets the assessment name. Used due to source of name being different
         * depending on the
         * @param {object} teamAssessment
         */
        function setAssessmentName(teamAssessment) {
            if (typeof teamAssessment !== "undefined" && teamAssessment !== null) {
                vm.assessment.name = teamAssessment.assessmentName;
            }
        }

        /**
         * Gets all available playbooks for an assessment.
         * Does not include any team assessments.
         * @param {Int} assessmentId
         * @returns {Promise} with list of playbook objects, containing latest and list items.
         */
        function getPlaybookList(assessmentId) {
            var deferred = $q.defer();
            playbookDataService.getPlaybooksForAssessment(assessmentId)
                .then(function (data) {
                    let teamGroup = data.group(playbook => playbook.teamName),
                        playbooks = [],
                        playbookObj = null,
                        mostRecentPlaybook = null;

                    // Get the latest team assessment for each team and add it to the list.
                    angular.forEach(teamGroup, function (groupedData) {
                        playbooks = groupedData.data;
                        if (playbooks.length > 1) {
                            // Get the latest created playbook.
                            mostRecentPlaybook = playbooks.reduce(function (prev, current) {
                                var prevDate, currentDate;
                                prevDate = prev.created;
                                currentDate = current.created;
                                return prevDate > currentDate ? prev : current;
                            });

                            // Add to the list of team assessments.
                            playbookObj = {
                                latest: mostRecentPlaybook,
                                list: playbooks
                            };
                            vm.playbooks.push(playbookObj);
                        }
                        else {
                            // if there's only one attempt, make that the most recent.
                            playbookObj = {
                                latest: playbooks[0],
                                list: playbooks
                            };
                            vm.playbooks.push(playbookObj);
                        }
                    });

                    deferred.resolve(vm.playbooks);
                });

            // Return a promise so that we can chain these together as needed.
            return deferred.promise;
        }

        /**
         * Gets the details for the playbook based on the provided id.
         * @param {Number} playbookId
         * @returns {Promise}
         */
        function getPlaybook(playbookId) {
            var deferred = $q.defer();

            playbookDataService.getPlaybookDetails(playbookId)
                .then(function (data) {
                    if (typeof data !== "undefined") {
                        vm.current.details = data;

                        // Get version info.
                        setPlaybookVersions(vm.playbooks, vm.current.details.teamName);

                        // Prepare user data for owner form.
                        canEditOwner();
                    }
                    else {
                        vm.message = "Unable to retrieve playbook details. Please try again.";
                    }
                    deferred.resolve();
                });

            // Return a promise so that we can chain these together as needed.
            return deferred.promise;
        }

        /**
         * Sets the playbok versions for the current team.
         * @param {Array} playbooks all available playbooks to search through for previous versions.
         * @param {String} teamName name of the team to filter playbooks on.
         */
        function setPlaybookVersions(playbooks, teamName) {
            let versions = {},
                playbook = null;
            playbook = playbooks.find(function (p) {
                return p.latest.teamName === teamName;
            });
            if (playbook !== null && typeof playbook !== "undefined") {
                versions = playbook;
            }

            vm.current.versions = versions;
        }

        /**
         * Redirect url to playbook details.
         * @param {Int} playbookId
         */
        function navigateToPlaybookDetails(playbookId) {
            $location.path('/assessments/' + vm.assessment.id + '/playbooks/' + playbookId);
        }

        /**
         * Creates a new playbook for the selected team assessment.
         */
        function createPlaybook() {
            var teamAssessment = vm.current.details.teamAssessment;
            vm.messaage = null;
            vm.newPlaybookForm.submitted = true;
            if (!vm.newPlaybookForm.form.$valid) {
                return
            }

            playbookDataService.createPlaybookForTeamAssessment(teamAssessment)
                .then(function (data) {
                    vm.info = 'Playbook was saved successfully';
                    $timeout(function () {
                        vm.info = null;
                        vm.newPlaybookForm.submitted = false;
                        vm.navigateToPlaybookDetails(data.id);
                    }, 1500);
                })
                .catch(function (error) {
                    vm.message = 'There was an error saving the playbook. Please try again.';
                });
        }

        /**
         * Updates an existing playbook.
         */
        function updatePlaybook() {
            playbookDataService.updatePlaybook(vm.current.details.id, vm.current.details)
                .then(function (data) {
                    vm.info = 'Playbook was saved successfully';
                    $timeout(function () {
                        vm.info = null;
                        vm.ownerForm.submitted = false;
                    }, 1500);
                    getPlaybook(vm.current.details.id);
                    getPlaybookList(vm.assessment.id);
                })
                .catch(function (error) {
                    vm.message = 'There was an error saving the playbook. Please try again.';
                });
        }

        /**
         * Gets the team assessments to build the new playbook form.
         * @param {Int} assessmentId
         * @returns {Promise} with the flat team assessment list.
         */
        function getTeamAssessmentList(assessmentId) {
            var deferred = $q.defer();

            // Get all assessments.
            assessmentDataService.getTeamAssessments(assessmentId)
                .then(function (data) {
                    if (data.length === 0) {
                        vm.message = 'You do not have any completed assessments to create a playbook for. Please complete an assessment first.';
                    }
                    deferred.resolve(data);
                });
            return deferred.promise;
        }

        /**
         * Gets the latest team assessment for each team.
         * @param {Int} assessmentId
         * @returns {Array} flat list of the latest team assessments only.
         */
        function getLatestTeamAssessmentListByTeam(assessmentId) {
            var deferred = $q.defer();

            getTeamAssessmentList(assessmentId)
                .then(function (data) {
                    let teamGroup = data.group(teamAssessment => teamAssessment.teamName),
                        teamAssessments = [],
                        teamAssessmentObj = null;

                    angular.forEach(teamGroup, function (groupedData) {
                        teamAssessmentObj = assessmentDataService.getMostRecentAttemptForTeam(groupedData.data);
                        teamAssessments.push(teamAssessmentObj);
                    });

                    deferred.resolve(teamAssessments);
                });

            return deferred.promise;
        }

        function getMostRecentCompletedTeamAssessmentForTeam(teamAssessmentsForTeam) {
            mostRecentTeamAssessment = teamAssessmentsForTeam.filter(function (t) {
                return t.completed !== null;
            }).reduce(function (prev, current) {
                return prev.completed > current.completed ? prev : current;
            });
            return mostRecentTeamAssessment;
        }

        /**
         * Gets the link used to share the currently reviewed playbook.
         * @returns {String} full url for a user to click to add the playbook to their shared playbook list.
         */
        function getSharePlaybookLink() {
            if (!angular.equals(vm.current.details, {})) {
                var playbookId = vm.current.details.id,
                    assessmentId = vm.assessment.id;
                return playbookDataService.getPlaybookShareLink(assessmentId, playbookId);
            }
        }

        /**
         * Adds the assessment to the current user's shared assessment list.
         * @param {Int} playbookId
         */
        function addSharedPlaybook(playbookId) {
            // Create link to playbook.
            playbookDataService.addSharedPlaybook(playbookId)
                .then(function (data) {
                    // If it's not already there, add the playbook to the playbook list.
                    // Could go to the server again to get the full list, but trying to save a trip.
                    var exists = vm.playbooks.filter(function (t) { return t.id === data.id; }).length > 0;
                    if (exists === false) {
                        vm.playbooks.push(data);

                        // Show our shared message for a moment if this is a new addition to our list.
                        vm.info = 'The playbook for ' + data.teamName + ' has been successfully added to your shared playbook list.';
                        $timeout(function () {
                            vm.info = null;
                        }, 5 * 1000);
                    }

                    // Load the review data for the shared playbook.
                    vm.getPlaybook(playbookId)
                        .then(function () {
                            setAssessmentName(vm.current.details.teamAssessment);
                        });
                })
                .catch(function (error) {
                    // If failed, show an error message instead of and review details.
                    if (error !== null && typeof error !== "undefined") {
                        vm.message = 'An error occurred while trying to add the shared playbook: ' + error;
                    }
                    else {
                        vm.message = 'An error occurred while trying to add the shared playbook. Please try again.';
                    }
                })
                .finally(function () {
                    vm.loaded = true;
                });
        }

        /**
         * Gets a list of all users within the application, excluding the current user.
         * Sets the user list for the owner form.
         */
        function getUserList() {
            userService.getUsers()
            .then(function (users) {
                var result = users.filter(function (u) {
                    return u.Id !== vm.current.details.ownerId;
                });
                vm.ownerForm.users = result;
            });
        }

        /**
         * Updates the owner of the playbook based on the form values.
         */
        function updatePlaybookOwner() {
            vm.ownerForm.submitted = true;
            if (!vm.ownerForm.form.$valid) {
                return
            }

            updatePlaybook();
        }

        /**
         * Determines if the current user has the permission or ownership required
         * in order to change the owner of a playbook. If the user has the permission, get
         * the list of users prepared.
         */
        function canEditOwner() {
            // If this is an archived playbook, don't allow anyone to edit it.
            if (vm.current.details.isArchived === true) {
                return;
            }

            if (vm.current.details.isOwnedByMe === true) {
                vm.current.details.canEditOwner = true;
                getUserList();
            }
            else {
                authService.hasPermission("PLAYBOOK_OWNER", "Edit")
                    .then(function (data) {
                        vm.current.details.canEditOwner = data || false;

                        if (vm.current.details.canEditOwner === true) {
                            getUserList();
                        }
                    });
            }
        }
    }
})();