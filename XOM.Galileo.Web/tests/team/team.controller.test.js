(function () {
    describe('TeamController', function () {
        var $controller, vm, mockTeamDataService, $log, $location, $q, $rootScope, $routeParams

        beforeEach(module('app.team'));
        beforeEach(module('mock.teamDataService'));

        beforeEach(
            inject(function (_$controller_, _teamDataService_, _$log_, _$location_, _$q_, _$rootScope_) {
                $controller = _$controller_;
                mockTeamDataService = _teamDataService_;
                $log = _$log_;
                $location = _$location_;
                $q = _$q_;
                $rootScope = _$rootScope_.$new();
                $routeParams = { assessmentId: 1 };
            })
        );

        beforeEach(function () {
            // Create the controller.
            vm = $controller('TeamController', {
                teamDataService: mockTeamDataService,
                $log: $log,
                $location: $location,
                $routeParams: $routeParams
            });

            vm.form = {};
        });

        it('should be defined', function () {
            expect($controller).toBeDefined();
        });

        describe('.saveTeam()', function () {
            describe('create', function () {
                it('should send team to the data service', function () {
                    // arrange
                    mockTeamDataService.createTeam.calls.reset();
                    var team = {
                        name: 'new team name'
                    };
                    vm.team = team;

                    // act
                    vm.saveTeam();

                    // assert
                    expect(mockTeamDataService.createTeam).toHaveBeenCalled();
                    expect(mockTeamDataService.createTeam).toHaveBeenCalledWith(team);
                });

                it('should set the form state as submitted', function () {
                    // arrange
                    vm.form.submitted = false;

                    // act
                    vm.saveTeam();

                    // assert
                    expect(vm.form.submitted).toBeTruthy();
                });

                it('should not call service if the form is invalid', function () {
                    // arrange
                    mockTeamDataService.createTeam.calls.reset();
                    vm.form.$invalid = true;

                    // act
                    vm.saveTeam();

                    // assert
                    expect(mockTeamDataService.createTeam).not.toHaveBeenCalled();
                });

                it('should redirect if team was added successfully', function () {
                    // arrange
                    mockTeamDataService.createTeam.calls.reset();
                    vm.form.$invalid = false;
                    spyOn($location, 'path').and.returnValue('fake location');

                    // act
                    vm.saveTeam();
                    $rootScope.$digest();

                    // assert
                    expect($location.path).toHaveBeenCalled();
                });

                it('should redirect to take assessment page for assessment and team', function () {
                    // arrange
                    vm.form.$invalid = false;
                    spyOn($location, 'path');
                    vm.assessmentId = 5;
                    vm.teamId = 1;

                    // act
                    vm.saveTeam();
                    $rootScope.$digest();

                    // assert
                    expect($location.path).toHaveBeenCalledWith('/assessments/5/team/1/edit');
                });

                it('should not redirect if team is not saved', function () {
                    // arrange
                    vm.form.$invalid = false;
                    spyOn($location, 'path');
                    mockTeamDataService.createTeam = jasmine.createSpy('createTeam() spy')
                        .and
                        .callFake(function (teamId) {
                            var mockResult = {
                                id: 0,
                                name: 'team name',
                                info: 'team info'
                            };
                            var d = $q.defer();
                            d.resolve(mockResult);
                            return d.promise;
                        });

                    // act
                    vm.saveTeam();
                    $rootScope.$digest();

                    // assert
                    expect($location.path).not.toHaveBeenCalled();
                });

                it('should not redirect if service errored', function () {
                    // arrange
                    vm.form.$invalid = false;
                    spyOn($location, 'path');
                    mockTeamDataService.createTeam = jasmine.createSpy('createTeam() spy')
                        .and
                        .callFake(function (teamId) {
                            var exception = new Error();
                            var d = $q.defer();
                            d.reject(exception);
                            return d.promise;
                        });

                    // act
                    vm.saveTeam();
                    $rootScope.$digest();

                    // assert
                    expect($location.path).not.toHaveBeenCalled();
                });

                it('should set a default message if service errored without an error message', function () {
                    // arrange
                    vm.form.$invalid = false;
                    mockTeamDataService.createTeam = jasmine.createSpy('createTeam() spy')
                        .and
                        .callFake(function (teamId) {
                            var d = $q.defer();
                            d.reject();
                            return d.promise;
                        });

                    // act
                    vm.saveTeam();
                    $rootScope.$digest();

                    // assert
                    expect(vm.message).toEqual('An error occurred while trying to save your team. Please try again.');
                });

                it('should set a default message if service returned an empty response', function () {
                    // arrange
                    vm.form.$invalid = false;
                    mockTeamDataService.createTeam = jasmine.createSpy('createTeam() spy')
                        .and
                        .callFake(function (teamId) {
                            var d = $q.defer();
                            d.resolve();
                            return d.promise;
                        });

                    // act
                    vm.saveTeam();
                    $rootScope.$digest();

                    // assert
                    expect(vm.message).toEqual('An error occurred while trying to save your team. Please try again.');
                });
            });

            describe('update', function () {
                beforeEach(function () {
                    // Create the controller.
                    vm = $controller('TeamController', {
                        teamDataService: mockTeamDataService,
                        $log: $log,
                        $location: $location,
                        $routeParams: { assessmentId: 2, teamId: 1 }
                    });
                    vm.form = {};
                });

                it('should send team to the data service', function () {
                    // arrange
                    mockTeamDataService.updateTeam.calls.reset();
                    var team = {
                        id: 1,
                        name: 'new team name'
                    };
                    vm.team = team;

                    // act
                    vm.saveTeam();

                    // assert
                    expect(mockTeamDataService.updateTeam).toHaveBeenCalled();
                    expect(mockTeamDataService.updateTeam).toHaveBeenCalledWith(team);
                });

                it('should set the form state as submitted', function () {
                    // arrange
                    vm.form.submitted = false;
                    vm.team = {
                        id: 1
                    };

                    // act
                    vm.saveTeam();

                    // assert
                    expect(vm.form.submitted).toBeTruthy();
                });

                it('should not call service if the form is invalid', function () {
                    // arrange
                    mockTeamDataService.updateTeam.calls.reset();
                    vm.form.$invalid = true;
                    vm.team = {
                        id: 1
                    };

                    // act
                    vm.saveTeam();

                    // assert
                    expect(mockTeamDataService.updateTeam).not.toHaveBeenCalled();
                });

                it('should redirect if team was added successfully', function () {
                    // arrange
                    mockTeamDataService.updateTeam.calls.reset();
                    vm.form.$invalid = false;
                    spyOn($location, 'path').and.returnValue('fake location');

                    // act
                    vm.saveTeam();
                    $rootScope.$digest();

                    // assert
                    expect($location.path).toHaveBeenCalled();
                });

                it('should redirect to take assessment page for assessment and team', function () {
                    // arrange
                    vm.form.$invalid = false;
                    spyOn($location, 'path');

                    // act
                    vm.saveTeam();
                    $rootScope.$digest();

                    // assert
                    expect($location.path).toHaveBeenCalledWith('/assessments/2/team/1/edit');
                });

                it('should not redirect if team is not saved', function () {
                    // arrange
                    vm.form.$invalid = false;
                    spyOn($location, 'path');
                    mockTeamDataService.updateTeam = jasmine.createSpy('createteam() spy')
                        .and
                        .callFake(function (teamid) {
                            var mockresult = {
                                id: 0,
                                name: 'team name',
                                info: 'team info'
                            };
                            var d = $q.defer();
                            d.resolve(mockresult);
                            return d.promise;
                        });

                    // act
                    vm.saveTeam();
                    $rootScope.$digest();

                    // assert
                    expect($location.path).not.toHaveBeenCalled();
                });

                it('should not redirect if service errored', function () {
                    // arrange
                    vm.form.$invalid = false;
                    spyOn($location, 'path');
                    mockTeamDataService.updateTeam = jasmine.createSpy('updateTeam() spy')
                        .and
                        .callFake(function (teamid) {
                            var exception = new Error();
                            var d = $q.defer();
                            d.reject(exception);
                            return d.promise;
                        });

                    // act
                    vm.saveTeam();
                    $rootScope.$digest();

                    // assert
                    expect($location.path).not.toHaveBeenCalled();
                });

                it('should set a default message if service errored without an error message', function () {
                    // arrange
                    vm.form.$invalid = false;
                    mockTeamDataService.updateTeam = jasmine.createSpy('updateTeam() spy')
                        .and
                        .callFake(function (teamid) {
                            var d = $q.defer();
                            d.reject();
                            return d.promise;
                        });

                    // act
                    vm.saveTeam();
                    $rootScope.$digest();

                    // assert
                    expect(vm.message).toEqual('An error occurred while trying to save your team. Please try again.');
                });

                it('should set a default message if service returned an empty response', function () {
                    // arrange
                    vm.form.$invalid = false;
                    mockTeamDataService.updateTeam = jasmine.createSpy('updateTeam() spy')
                        .and
                        .callFake(function (teamid) {
                            var d = $q.defer();
                            d.resolve();
                            return d.promise;
                        });

                    // act
                    vm.saveTeam();
                    $rootScope.$digest();

                    // assert
                    expect(vm.message).toEqual('An error occurred while trying to save your team. Please try again.');
                });
            });
        });

        describe('.getTeam()', function () {
        });

        describe('.activate()', function () {
            it('should set the assessment id from the route param', function () {
                // arrange

                // act

                // assert
                expect(vm.assessmentId).toEqual(1);
            });

            it('should set the team id to zero if not included in the route params', function () {
                // arrange

                // act

                // assert
                expect(vm.team.id).toEqual(0);
            });

            describe('update', function () {
                beforeEach(function () {
                    // Create the controller. Set the route to be editing the team.
                    vm = $controller('TeamController', {
                        teamDataService: mockTeamDataService,
                        $log: $log,
                        $location: $location,
                        $routeParams: { assessmentId: 2, teamId: 1 }
                    });
                    vm.form = {};
                });

                it('should set the team id from the route param', function () {
                    // arrange

                    // act

                    // assert
                    expect(vm.team.id).toEqual(1);
                });

                it('should load the team details if the team id is provided in the url', function () {
                    // arrange

                    // act

                    // assert
                    expect(mockTeamDataService.getTeam).toHaveBeenCalled();
                });
            });
        });

        describe('.cancel()', function () {
            it('should go back', function () {
                // arrange
                spyOn($location, 'path');
                $location.path.calls.reset();

                // act
                vm.cancel();

                // assert
                expect($location.path).toHaveBeenCalledWith('/assessments');
            });
        });

        describe('.searchByName()', function () {
            it('should get team list from the data service', function () {
                // arrange
                mockTeamDataService.searchTeamsByName.calls.reset();
                var teamName = "some search term";

                // act
                vm.search(teamName);

                // assert
                expect(mockTeamDataService.searchTeamsByName).toHaveBeenCalled();
                expect(mockTeamDataService.searchTeamsByName).toHaveBeenCalledWith(teamName);
            });

            it('should not search if name is undefined', function () {
                // arrange
                mockTeamDataService.searchTeamsByName.calls.reset();
                var teamName;

                // act
                vm.search(teamName);

                // assert
                expect(mockTeamDataService.searchTeamsByName).not.toHaveBeenCalled();
            });

            it('should not search if name is null', function () {
                // arrange
                mockTeamDataService.searchTeamsByName.calls.reset();
                var teamName = null;

                // act
                vm.search(teamName);

                // assert
                expect(mockTeamDataService.searchTeamsByName).not.toHaveBeenCalled();
            });

            it('should not search if name is empty', function () {
                // arrange
                mockTeamDataService.searchTeamsByName.calls.reset();
                var teamName = ' ';

                // act
                vm.search(teamName);

                // assert
                expect(mockTeamDataService.searchTeamsByName).not.toHaveBeenCalled();
            });

            it('should set isLoadingTeams to true until returned from the service', function () {
                // arrange
                var teamName = 'search term';

                // act
                vm.search(teamName);

                // assert
                expect(vm.isLoadingTeams).toBeTruthy();
                $rootScope.$apply();
                expect(vm.isLoadingTeams).toBeFalsy();
            });

            it('should set team list', function () {
                // arrange
                var teamName = 'search term';

                // act
                vm.search(teamName);
                $rootScope.$apply();

                // assert
                expect(vm.teams.length > 0).toBeTruthy();
            });

            it('should return the team list', function (done) {
                // arrange
                var teamName = 'search term';

                // act
                vm.search(teamName)
                    .then(function (result) {
                        // assert
                        expect(result.length > 0).toBeTruthy();
                        done();
                    });
                $rootScope.$apply();
            });

            it('should resolve an empty array if data from the service is undefined ', function (done) {
                // arrange
                var teamName = 'search term';
                mockTeamDataService.searchTeamsByName = jasmine.createSpy('searchTeamsByName() spy')
                    .and
                    .callFake(function (teamId) {
                        var mockResult;
                        var d = $q.defer();
                        d.resolve(mockResult);
                        return d.promise;
                    });

                // act
                vm.search(teamName)
                    .then(function (result) {
                        // assert
                        expect(result.length == 0).toBeTruthy();
                        expect(vm.teams.length == 0).toBeTruthy();
                        done();
                    });
                $rootScope.$apply();
            });

            describe('failed', function () {
                it('should set the default error message if one is not returned', function () {
                    // arrange
                    var teamName = 'search term';
                    mockTeamDataService.searchTeamsByName = jasmine.createSpy('searchTeamsByName() spy')
                        .and
                        .callFake(function (teamId) {
                            var mockResult;
                            var d = $q.defer();
                            d.reject(mockResult);
                            return d.promise;
                        });

                    // act
                    vm.search(teamName)
                        .then(function (result) {
                            expect(result).not.toBeDefined();
                        })
                        .catch(function (error) {
                            expect(error).toBeDefined();
                        });
                    $rootScope.$apply();

                    // assert
                    expect(vm.message).toEqual('An error occurred while searching for teams. Please try again later.');
                });

                it('should set the error message if one is returned', function () {
                    // arrange
                    var teamName = 'search term';
                    mockTeamDataService.searchTeamsByName = jasmine.createSpy('searchTeamsByName() spy')
                        .and
                        .callFake(function (teamId) {
                            var mockResult = "an error occurred";
                            var d = $q.defer();
                            d.reject(mockResult);
                            return d.promise;
                        });

                    // act
                    vm.search(teamName)
                        .then(function (result) {
                            expect(result).not.toBeDefined();
                        })
                        .catch(function (error) {
                            expect(error).toBeDefined();
                        });
                    $rootScope.$apply();

                    // assert
                    expect(vm.message).toEqual('An error occurred while searching for teams. an error occurred');
                });

                it('should set isLoading indicator to true when rejected', function () {
                    // arrange
                    var teamName = 'search term';
                    mockTeamDataService.searchTeamsByName = jasmine.createSpy('searchTeamsByName() spy')
                        .and
                        .callFake(function (teamId) {
                            var mockResult = "an error occurred";
                            var d = $q.defer();
                            d.reject(mockResult);
                            return d.promise;
                        });

                    // act
                    vm.search(teamName)
                        .then(function (result) {
                            expect(result).not.toBeDefined();
                        })
                        .catch(function (error) {
                            expect(error).toBeDefined();
                        });
                    $rootScope.$apply();

                    // assert
                    expect(vm.isLoadingTeams).toBeFalsy();
                });
            });
        });

        describe('.selectTeam()', function () {
            it('should set the current team', function () {
                // arrange
                var team = { id: 43, name: "some name" };

                // act
                vm.selectTeam(team);

                // assert
                expect(vm.team).toEqual(team);
            });

            it('should reset the warning message', function () {
                // arrange
                var team = { id: 43, name: "some name" };
                vm.warning = "some message";

                // act
                vm.selectTeam(team);

                // assert
                expect(vm.warning).toEqual(null);
            });
        });

        describe('.editTeamProperty()', function () {
            it('should do nothing if this is a new team', function () {
                // arrange
                var property = "new name";
                vm.team = {
                    id: 0,
                    name: null,
                    info: null
                }
                vm.warning = null;

                // act
                vm.editTeamProperty(property);

                // assert
                expect(vm.warning).toEqual(null);
            });

            it('should set the warning message when editing saved teams', function () {
                // arrange
                var property = "new name";
                vm.team = {
                    id: 5,
                    name: "old name",
                    info: "old info"
                }
                vm.warning = null;

                // act
                vm.editTeamProperty(property);

                // assert
                expect(vm.warning).not.toEqual(null);
            });
        });

        describe('.validateTeamName()', function () {
            it('should invalidate if team name is indefined', function () {
                // arrange
                var teamName;
                vm.form = {
                    name: {
                        $invalid: false,
                        $setValidity: function () { this.$invalid = true; }
                    }
                };
                vm.form.name.$invalid = false;

                // act
                vm.validateTeamName(teamName);

                // assert
                expect(vm.form.name.$invalid).toBeTruthy();
            });

            it('should invalidate if team name is null', function () {
                // arrange
                var teamName = null;
                vm.form = {
                    name: {
                        $invalid: false,
                        $setValidity: function () { this.$invalid = true; }
                    }
                };
                vm.form.name.$invalid = false;

                // act
                vm.validateTeamName(teamName);

                // assert
                expect(vm.form.name.$invalid).toBeTruthy();
            });

            it('should invalidate if team name is empty', function () {
                // arrange
                var teamName = '  ';
                vm.form = {
                    name: {
                        $invalid: false,
                        $setValidity: function () { this.$invalid = true; }
                    }
                };
                vm.form.name.$invalid = false;

                // act
                vm.validateTeamName(teamName);

                // assert
                expect(vm.form.name.$invalid).toBeTruthy();
            });

            it('should not invalidate if team name is provided', function () {
                // arrange
                var teamName = 'name';
                vm.form = {
                    name: {}
                };
                vm.form.name.$invalid = false;

                // act
                vm.validateTeamName(teamName);

                // assert
                expect(vm.form.name.$invalid).toBeFalsy();
            });
        });
    });
})();