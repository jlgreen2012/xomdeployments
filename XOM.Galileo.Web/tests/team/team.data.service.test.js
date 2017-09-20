(function () {
    describe('teamDataService', function () {
        var dataService, $service, $httpBackend, $log, $q, configs, $rootScope;

        beforeEach(module('mock.configs'));
        beforeEach(module('app.team'));

        beforeEach(function () {
            inject(function (_teamDataService_, _$httpBackend_, _$log_, _$q_, _configs_, _$rootScope_) {
                $service = _teamDataService_;
                $httpBackend = _$httpBackend_;
                $log = _$log_;
                $q = _$q_;
                configs = { apiUrl: 'http://localhost:13547/api/' };
                $rootScope = _$rootScope_.$new();
            });
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should be defined', function () {
            expect($service).toBeDefined();
        });

        describe('.getTeam()', function () {
            it('should get team details', function () {
                // arrange
                var teamId = 1;
                $httpBackend.expectGET(configs.apiUrl + 'teams/1').respond(200, {});

                // act
                $service.getTeam(teamId)
                    .then(function (response) {
                        expect(response).toBeDefined();
                    });
                $rootScope.$apply();

                // assert
                expect($httpBackend.flush).not.toThrow();
            });

            it('should log if the http call failed', function () {
                // arrange
                var teamId = 1;
                spyOn($log, 'error');
                $log.error.calls.reset();
                $httpBackend.expectGET(configs.apiUrl + 'teams/1').respond(500, 'an error occurred');

                // act
                $service.getTeam(teamId)
                    .then(function (response) {
                        expect(response).not.toBeDefined();
                        expect($log.error).toHaveBeenCalled();
                    });

                // assert
                expect($httpBackend.flush).not.toThrow();
            });
        });

        describe('.createTeam()', function () {
            it('should reject if the team name is undefined', function () {
                // arrange
                var team = {};

                // act
                $service.createTeam(team)
                .then(function (response) {
                    expect(1).toEqual(2);
                    expect(response).not.toBeNull();
                })
                .catch(function (error) {
                    // assert
                    expect(error).toEqual("The team name is required");
                });

                expect($httpBackend.flush).toThrow();
            });

            it('should reject if the team name is empty', function () {
                // arrange
                var team = {
                    Name: ''
                };

                // act
                $service.createTeam(team)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    // assert
                    expect(error).toEqual("The team name is required");
                });

                expect($httpBackend.flush).toThrow();
            });

            it('should add the team if validated', function () {
                // arrange
                var team = {
                    name: 'my team'
                };
                $httpBackend.expectPOST(configs.apiUrl + 'teams').respond(200);

                // act
                $service.createTeam(team)
                .then(function (response) {
                    // assert
                    expect(response).not.toBeNull();
                })
                .catch(function (error) {
                    expect(error).not.toBeDefined();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should log if the http call failed', function () {
                // arrange
                var team = {
                    name: 'my team'
                };
                $httpBackend.expectPOST(configs.apiUrl + 'teams').respond(500, 'an error occurred');
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.createTeam(team)
                .then(function (response) {
                    // assert
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect($log.error).toHaveBeenCalled();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should log detailed message if provided', function () {
                // arrange
                var team = {
                    name: 'my team'
                };
                $httpBackend.expectPOST(configs.apiUrl + 'teams').respond(500, { Message: 'an error occurred' });
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.createTeam(team)
                .then(function (response) {
                    // assert
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect($log.error).toHaveBeenCalled();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should log default message if no message is returned from server', function () {
                // arrange
                var team = {
                    name: 'my team'
                };
                $httpBackend.expectPOST(configs.apiUrl + 'teams').respond(500);
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.createTeam(team)
                .then(function (response) {
                    // assert
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect($log.error).toHaveBeenCalledWith('XHR failed for createTeam. ');
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should log if team validation failed', function () {
                // arrange
                var team = {};
                spyOn($log, 'info');
                $log.info.calls.reset();

                // act
                $service.createTeam(team)
                .then(function (response) {
                    // assert
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();
                    expect($log.info).toHaveBeenCalled();
                });

                expect($httpBackend.flush).toThrow();
            });
        });

        describe('.updateTeam()', function () {
            it('should reject if the team name is undefined', function () {
                // arrange
                var team = {};

                // act
                $service.updateTeam(team)
                .then(function (response) {
                    expect(1).toEqual(2);
                    expect(response).not.toBeNull();
                })
                .catch(function (error) {
                    // assert
                    expect(error).toEqual("The team name is required");
                });

                expect($httpBackend.flush).toThrow();
            });

            it('should reject if the team name is empty', function () {
                // arrange
                var team = {
                    Name: ''
                };

                // act
                $service.updateTeam(team)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    // assert
                    expect(error).toEqual("The team name is required");
                });

                expect($httpBackend.flush).toThrow();
            });

            it('should update the team if validated', function () {
                // arrange
                var team = {
                    id: 1,
                    name: 'my team'
                };
                $httpBackend.expectPUT(configs.apiUrl + 'teams/1').respond(200);

                // act
                $service.updateTeam(team)
                .then(function (response) {
                    // assert
                    expect(response).not.toBeNull();
                })
                .catch(function (error) {
                    expect(error).not.toBeDefined();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should log if the http call failed', function () {
                // arrange
                var team = {
                    id: 1,
                    name: 'my team'
                };
                $httpBackend.expectPUT(configs.apiUrl + 'teams/1').respond(500, 'an error occurred');
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.updateTeam(team)
                .then(function (response) {
                    // assert
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect($log.error).toHaveBeenCalled();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should log detailed message if provided', function () {
                // arrange
                var team = {
                    id: 1,
                    name: 'my team'
                };
                $httpBackend.expectPUT(configs.apiUrl + 'teams/1').respond(500, { Message: 'an error occurred' });
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.updateTeam(team)
                .then(function (response) {
                    // assert
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect($log.error).toHaveBeenCalled();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should log default message if no message is returned from server', function () {
                // arrange
                var team = {
                    id: 1,
                    name: 'my team'
                };
                $httpBackend.expectPUT(configs.apiUrl + 'teams/1').respond(500);
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.updateTeam(team)
                .then(function (response) {
                    // assert
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect($log.error).toHaveBeenCalledWith('XHR failed for updateTeam. ');
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should log if team validation failed', function () {
                // arrange
                var team = {};
                spyOn($log, 'info');
                $log.info.calls.reset();

                // act
                $service.updateTeam(team)
                .then(function (response) {
                    // assert
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();
                    expect($log.info).toHaveBeenCalled();
                });

                expect($httpBackend.flush).toThrow();
            });
        });

        describe('.getTeams()', function () {
            it('should get team list', function (done) {
                // arrange
                $httpBackend.expectGET(configs.apiUrl + 'teams').respond(200, {});

                // act
                $service.getTeams()
                    .then(function (response) {
                        expect(response).toBeDefined();
                        done();
                    });
                $rootScope.$apply();

                // assert
                expect($httpBackend.flush).not.toThrow();
            });

            it('should log if the http call failed', function (done) {
                // arrange
                spyOn($log, 'error');
                $log.error.calls.reset();
                $httpBackend.expectGET(configs.apiUrl + 'teams').respond(500, 'an error occurred');

                // act
                $service.getTeams()
                    .then(function (response) {
                        expect(response).not.toBeDefined();
                        expect($log.error).toHaveBeenCalled();
                        done();
                    })
                    .catch(function (error) {
                    });
                $rootScope.$apply;

                // assert
                expect($httpBackend.flush).not.toThrow();
            });
        });

        describe('.searchTeamsByName()', function () {
            it('should get team list', function (done) {
                // arrange
                var searchTerm = "some string";
                $httpBackend.expectGET(configs.apiUrl + 'teams/search/?name=' + searchTerm).respond(200, {});

                // act
                $service.searchTeamsByName(searchTerm)
                    .then(function (response) {
                        expect(response).toBeDefined();
                        done();
                    });
                $rootScope.$apply();

                // assert
                expect($httpBackend.flush).not.toThrow();
            });

            it('should log if the http call failed', function (done) {
                // arrange
                var searchTerm = "some string";
                spyOn($log, 'error');
                $log.error.calls.reset();
                $httpBackend.expectGET(configs.apiUrl + 'teams/search/?name=' + searchTerm).respond(500, 'an error occurred');

                // act
                $service.searchTeamsByName(searchTerm)
                    .then(function (response) {
                        expect(response).not.toBeDefined();
                    })
                    .catch(function (error) {
                        expect($log.error).toHaveBeenCalled();
                        done();
                    });

                // assert
                expect($httpBackend.flush).not.toThrow();
            });

            it('should reject the http call failed', function (done) {
                // arrange
                var searchTerm = "some string";
                $httpBackend.expectGET(configs.apiUrl + 'teams/search/?name=' + searchTerm).respond(500, 'an error occurred');

                // act
                $service.searchTeamsByName(searchTerm)
                    .then(function (response) {
                        expect(response).not.toBeDefined();
                    })
                    .catch(function (error) {
                        expect(error).toBeDefined();
                        done();
                    });

                // assert
                expect($httpBackend.flush).not.toThrow();
            });
        });
    });
})();