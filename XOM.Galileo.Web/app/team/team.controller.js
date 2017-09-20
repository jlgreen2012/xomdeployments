(function () {
    'use strict';

    angular
        .module('app.team')
        .controller('TeamController', TeamController);

    TeamController.$inject = ['teamDataService', '$log', '$location', '$routeParams', '$q'];

    /**
     * Controller responsible for all CRUD actions surrounding a team.
     * @param {factory} teamDataService
     * @param {$log} $log
     * @param {$location} $location
     * @param {$routeParams} $routeParams
     * @param {$q} $q
     */
    function TeamController(teamDataService, $log, $location, $routeParams, $q) {
        /* jshint validthis:true */
        var vm = this;

        // Existing teams to select.
        vm.teams = [];

        // Team object we're creating.
        vm.team = {
            id: 0,
            name: null,
            info: null
        };

        // Assessment this team is tied to.
        vm.assessmentId = null;

        // Message to display to the user regarding their inputs.
        // ie. Validation messages, saved message, error message, etc.
        vm.message = null;
        vm.warning = null;

        // Loading indicator when searching teams.
        vm.isLoadingTeams = false;

        // Methods for editing the team form.
        vm.saveTeam = saveTeam;
        vm.selectTeam = selectTeam;
        vm.editTeamProperty = editTeamProperty;
        vm.validateTeamName = validateTeamName;

        // Cancel this action.
        vm.cancel = cancel;

        // Search existing teams.
        vm.search = searchByName;

        activate();

        /**
         * Page load actions. Get the route params to determine if we're
         * creating or editting.
         */
        function activate() {
            vm.team.id = +$routeParams.teamId || 0;
            vm.assessmentId = +$routeParams.assessmentId;
            if (vm.team.id > 0) {
                getTeam(vm.team.id);
            }
        }

        /**
         * Gets the details for the team based on the route id.
         */
        function getTeam() {
            teamDataService.getTeam(vm.team.id)
                .then(function (data) {
                    vm.team = data;
                });
        }

        /**
         * Updates or creates the team details.
         */
        function saveTeam() {
            vm.form.submitted = true;

            if (vm.form.$invalid) {
                return;
            }

            // Update or create new team.
            var req;
            if (vm.team.id > 0) {
                req = updateTeam();
            }
            else {
                req = createTeam();
            }
            req
                .then(function (data) {
                    if ("undefined" !== typeof data) {
                        if ("undefined" !== typeof data.id && data.id !== 0) {
                            $log.debug("Team created with id: " + data.id);

                            // Redirect to the Start Assessment page automatically after successful save.
                            // TODO: when we allow for adding of teams/project/apps from separate page, need to
                            // make this a dynamic action.
                            $location.path('/assessments/' + vm.assessmentId + '/team/' + data.id + '/edit')
                        }
                    }
                    else {
                        vm.message = 'An error occurred while trying to save your team. Please try again.';
                    }
                })
                .catch(function (error) {
                    if ("undefined" !== typeof error) {
                        vm.message = 'An error occurred while trying to save your team: ' + error;
                    }
                    else {
                        vm.message = 'An error occurred while trying to save your team. Please try again.';
                    }
                });
        }

        /**
         * Creates a new team.
         * @returns {Promise}
         */
        function createTeam() {
            return teamDataService.createTeam(vm.team);
        }

        /**
         * Updates an existing team.
         * @returns {Promise}
         */
        function updateTeam() {
            return teamDataService.updateTeam(vm.team);
        }

        /**
         * Cancel actions for the form.
         * Returns to the assessments page.
         */
        function cancel() {
            $location.path('/assessments');
        }

        /**
         * Searches existing teams by name. Sets teams list.
         * @param {String} name
         * @returns {Promise}
         */
        function searchByName(name) {
            // TODO: run load tests to determine if it's more appropriate to get list
            // of all teams and just search in javascript.
            var deferred = $q.defer();
            if (typeof name !== 'undefined' && name !== null && name.trim() !== '') {
                vm.isLoadingTeams = true;
                teamDataService.searchTeamsByName(name)
                    .then(function (data) {
                        if (typeof data !== 'undefined') {
                            vm.teams = data;
                            deferred.resolve(data);
                        }
                        else {
                            vm.teams = [];
                            deferred.resolve([]);
                        }
                        vm.isLoadingTeams = false;
                    })
                    .catch(function (error) {
                        if (typeof error !== 'undefined' && error !== null) {
                            vm.message = 'An error occurred while searching for teams. ' + error;
                        }
                        else {
                            vm.message = 'An error occurred while searching for teams. Please try again later.';
                        }
                        vm.isLoadingTeams = false;
                        deferred.reject(vm.message);
                    });
            }
            return deferred.promise;
        }

        /**
         * Select an existing team from the dropdown.
         * @param {Object} team
         */
        function selectTeam(team) {
            // Set the team object so that we retain the id and info.
            vm.team = team;

            // Reset our warning upon selecting a new team.
            vm.warning = null;
        }

        /**
         * When the name or info is changed for a team, display a warning if
         * the user is editing an existing team.
         * @param {String} teamProperty - the name or info for a team
         */
        function editTeamProperty(teamProperty) {
            // Show warning that user is editing existing team.
            if (vm.team.id > 0) {
                vm.warning = 'You are editing data for an existing team/project/application. These changes will apply to all assessments and playbooks that exist for this item.';
            }
        }

        /**
         * Sets the validity for the team name field based on required attributes.
         * Required to use instead of built-in required attribute because of the autocomplete form.
         * @param {type} name
         */
        function validateTeamName(name) {
            if (typeof name === 'undefined' || name === null || name.trim() === '') {
                vm.form.name.$setValidity('required', false);
            }
        }
    }
})();