(function () {
    describe('AssessmentDataService', function () {
        var dataService, $service, $httpBackend, $q, configs, mockAuthService, $log, $window, $rootScope;

        beforeEach(module('mock.configs'));
        beforeEach(module('app.assessment'));
        beforeEach(module('mock.authService'));

        beforeEach(
            inject(function (_assessmentDataService_, _$httpBackend_, _$q_, configs, _$log_, _$window_, _$rootScope_) {
                $service = _assessmentDataService_;
                $httpBackend = _$httpBackend_;
                $log = _$log_
                $q = _$q_;
                configs = { apiUrl: 'http://localhost:13547/api/' };
                $window = _$window_;
                $rootScope = _$rootScope_.$new();
            })
        );

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should be registered', function () {
            expect($service).toBeDefined();
        });

        describe('.getAssessments()', function () {
            it('should get all assessments if team id is not provided', function (done) {
                // arrange

                // act
                $service.getAssessments(null)
                .then(function (response) {
                    expect(response).toBeDefined();
                    done();
                });

                // assert
                $httpBackend.expectGET('http://localhost:13547/api/assessments').respond(200, {});
                expect($httpBackend.flush).not.toThrow();
            });

            it('should log if the http call failed', function (done) {
                // arrange
                $httpBackend.whenGET('http://localhost:13547/api/assessments').respond(500, { Message: 'an error occurred' });
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.getAssessments()
                .then(function (response) {
                    expect(response).not.toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalledWith('XHR failed for getAssessments. an error occurred');
                    done();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should log default error message if message is not provided', function (done) {
                // arrange
                $httpBackend.whenGET('http://localhost:13547/api/assessments').respond(500);
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.getAssessments()
                .then(function (response) {
                    expect(response).not.toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalledWith('XHR failed for getAssessments. ');
                    done();
                });

                expect($httpBackend.flush).not.toThrow();
            });
        });

        describe('.getTeamAssessments()', function () {
            it('should get all team assessments', function (done) {
                // arrange
                var assessmentId = 1;

                // act
                $service.getTeamAssessments(assessmentId)
                .then(function (response) {
                    expect(response).toBeDefined();
                    done();
                });

                // assert
                $httpBackend.expectGET('http://localhost:13547/api/assessments/1/teamAssessments').respond(200, {});
                expect($httpBackend.flush).not.toThrow();
            });

            it('should log if the http call failed', function (done) {
                // arrange
                var assessmentId = 1;
                $httpBackend.expectGET('http://localhost:13547/api/assessments/1/teamAssessments').respond(500, { Message: 'an error occurred' });
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.getTeamAssessments(assessmentId)
                .then(function (response) {
                    expect(response).toEqual([]);

                    // assert
                    expect($log.error).toHaveBeenCalledWith('XHR failed for getTeamAssessments. an error occurred');
                    done();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should log default message if one is not returned from the server', function (done) {
                // arrange
                var assessmentId = 1;
                $httpBackend.expectGET('http://localhost:13547/api/assessments/1/teamAssessments').respond(500);
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.getTeamAssessments(assessmentId)
                .then(function (response) {
                    expect(response).toEqual([]);

                    // assert
                    expect($log.error).toHaveBeenCalledWith('XHR failed for getTeamAssessments. ');
                    done();
                });

                expect($httpBackend.flush).not.toThrow();
            });
        });

        describe('.getTeamAssessmentDetailsById()', function () {
            it('should get team assessment details', function (done) {
                // arrange
                var assessmentId = 1,
                    teamAssessmentId = 1;

                // act
                $service.getTeamAssessmentDetailsById(assessmentId, teamAssessmentId)
                .then(function (response) {
                    expect(response).toBeDefined();
                    done();
                });

                // assert
                $httpBackend.expectGET('http://localhost:13547/api/assessments/1/teamassessments/1').respond(200, {});
                expect($httpBackend.flush).not.toThrow();
            });

            it('should log if the http call failed', function (done) {
                // arrange
                var assessmentId = 1,
                    teamAssessmentId = 1;
                $httpBackend.expectGET('http://localhost:13547/api/assessments/1/teamassessments/1').respond(500, { Message: 'an error occurred' });
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.getTeamAssessmentDetailsById(assessmentId, teamAssessmentId)
                .then(function (response) {
                    expect(response).not.toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalledWith('XHR failed for getTeamAssessmentDetailsById. an error occurred');
                    done();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should log default message if one is not returned from the server', function (done) {
                // arrange
                var assessmentId = 1,
                    teamAssessmentId = 1;
                $httpBackend.expectGET('http://localhost:13547/api/assessments/1/teamassessments/1').respond(500);
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.getTeamAssessmentDetailsById(assessmentId, teamAssessmentId)
                .then(function (response) {
                    expect(response).not.toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalledWith('XHR failed for getTeamAssessmentDetailsById. ');
                    done();
                });

                expect($httpBackend.flush).not.toThrow();
            });
        });

        describe('.startAssessment()', function () {
            it('should make http call with assessment and team ids', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;

                // act
                $service.startAssessment(assessmentId, teamId)
                .then(function (response) {
                    expect(response).toBeDefined();
                    done();
                });

                // assert
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/start').respond(200, { data: {} });
                expect($httpBackend.flush).not.toThrow();
            });

            it('should log if the http call failed', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/start').respond(500, { Message: 'an error occurred' });
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.startAssessment(assessmentId, teamId)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalled();
                    done();
                });;

                expect($httpBackend.flush).not.toThrow();
                expect($log.error).toHaveBeenCalled();
            });

            it('should get error message to log if provided', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/start').respond(500, 'an error occurred');
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.startAssessment(assessmentId, teamId)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalledWith('XHR failed for startTeamAssessment. an error occurred');
                    done();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should log default error message if no message is provided', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/start').respond(500);
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.startAssessment(assessmentId, teamId)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalledWith('XHR failed for startTeamAssessment. ');
                    done();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should reject the promise if the http call failed', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/start').respond(500, 'an error occurred');
                spyOn($q, 'reject').and.callThrough();;
                $q.reject.calls.reset();

                // act
                $service.startAssessment(assessmentId, teamId)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();
                    // assert
                    expect($q.reject).toHaveBeenCalledWith('an error occurred');
                    done();
                });

                expect($httpBackend.flush).not.toThrow();
            });
        });

        describe('.saveAssessment()', function () {
            it('should make http call ids and responses', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                var teamAssessment = {};

                // act
                $service.saveAssessment(assessmentId, teamId, teamAssessment)
                .then(function (response) {
                    expect(response).toBeDefined();
                    done();
                });

                // assert
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/save', teamAssessment).respond(200, { data: {} });
                expect($httpBackend.flush).not.toThrow();
            });

            it('should log if the http call failed', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                var teamAssessment = {};
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/save').respond(500, { Message: 'an error occurred' });
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.saveAssessment(assessmentId, teamId, teamAssessment)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalled();
                    done();
                });;

                expect($httpBackend.flush).not.toThrow();
                expect($log.error).toHaveBeenCalled();
            });

            it('should get error message to log if provided', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                var teamAssessment = {};
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/save').respond(500, 'an error occurred');
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.saveAssessment(assessmentId, teamId, teamAssessment)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalledWith('XHR failed for saveTeamAssessment. an error occurred');
                    done();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should log default error message if message is not provided', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                var teamAssessment = {};
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/save').respond(500);
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.saveAssessment(assessmentId, teamId, teamAssessment)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalledWith('XHR failed for saveTeamAssessment. ');
                    done();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should reject the promise if the http call failed', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                var teamAssessment = {};
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/save').respond(500, 'an error occurred');
                spyOn($q, 'reject').and.callThrough();;
                $q.reject.calls.reset();

                // act
                $service.saveAssessment(assessmentId, teamId, teamAssessment)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();
                    // assert
                    expect($q.reject).toHaveBeenCalledWith('an error occurred');
                    done();
                });

                expect($httpBackend.flush).not.toThrow();
            });
        });

        describe('.submitAssessment()', function () {
            it('should make http call ids and responses', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                var teamAssessment = {};

                // act
                $service.submitAssessment(assessmentId, teamId, teamAssessment)
                .then(function (response) {
                    expect(response).toBeDefined();
                    done();
                });

                // assert
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/submit', teamAssessment).respond(200, { data: {} });
                expect($httpBackend.flush).not.toThrow();
            });

            it('should log if the http call failed', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                var teamAssessment = {};
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/submit').respond(500, { Message: 'an error occurred' });
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.submitAssessment(assessmentId, teamId, teamAssessment)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalled();
                    done();
                });;

                expect($httpBackend.flush).not.toThrow();
                expect($log.error).toHaveBeenCalled();
            });

            it('should get error message to log if provided', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                var teamAssessment = {};
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/submit', teamAssessment).respond(500, 'an error occurred');
                spyOn($log, 'error').and.callThrough();
                $log.error.calls.reset();

                // act
                $service.submitAssessment(assessmentId, teamId, teamAssessment)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalledWith('XHR failed for submitTeamAssessment. an error occurred');
                    done();
                });
                $rootScope.$digest();
                expect($httpBackend.flush).not.toThrow();
            });

            it('should log default error message if message is not provided', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                var teamAssessment = {};
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/submit', teamAssessment).respond(500);
                spyOn($log, 'error').and.callThrough();
                $log.error.calls.reset();

                // act
                $service.submitAssessment(assessmentId, teamId, teamAssessment)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalledWith('XHR failed for submitTeamAssessment. ');
                    done();
                });
                $rootScope.$digest();
                expect($httpBackend.flush).not.toThrow();
            });

            it('should reject the promise if the http call failed', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                var teamAssessment = {};
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/submit').respond(500, 'an error occurred');
                spyOn($q, 'reject').and.callThrough();;
                $q.reject.calls.reset();

                // act
                $service.submitAssessment(assessmentId, teamId, teamAssessment)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();
                    // assert
                    expect($q.reject).toHaveBeenCalledWith('an error occurred');
                    done();
                });
                expect($httpBackend.flush).not.toThrow();
            });
        });

        describe('getTeamAssessmentShareLink', function () {
            it('should get the base url using the window service', function () {
                // arrange
                spyOn($window, 'URL').and.callFake(function () { return 'http://someurl.com:9090/' });

                // act
                $service.getTeamAssessmentShareLink(1, 2);

                // assert
                expect($window.URL).toHaveBeenCalled();
            });
        });

        describe('.addSharedTeamAssessment()', function () {
            it('should make http call ids and responses', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                $httpBackend.expectPOST('http://localhost:13547/api/teams/2/assessments/1/share').respond(200, {});

                // act
                $service.addSharedTeamAssessment(assessmentId, teamId)
                .then(function (response) {
                    expect(response).toBeDefined();
                    // assert
                    done();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should log if the http call failed', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                var teamAssessment = {};
                $httpBackend.whenPOST('http://localhost:13547/api/teams/2/assessments/1/share').respond(500, { Message: 'an error occurred' });
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.addSharedTeamAssessment(assessmentId, teamId)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalled();
                    done();
                });
                $rootScope.$digest();
                expect($httpBackend.flush).not.toThrow();
            });

            it('should get error message to log if provided', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                var teamAssessment = {};
                $httpBackend.whenPOST('http://localhost:13547/api/teams/2/assessments/1/share').respond(500, 'an error occurred');
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.addSharedTeamAssessment(assessmentId, teamId)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalledWith('XHR failed for addSharedTeamAssessment. an error occurred');
                    done();
                });
                $rootScope.$digest();
                expect($httpBackend.flush).not.toThrow();
            });

            it('should log default error message if one is not provided', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                var teamAssessment = {};
                $httpBackend.whenPOST('http://localhost:13547/api/teams/2/assessments/1/share').respond(500);
                spyOn($log, 'error');
                $log.error.calls.reset();

                // act
                $service.addSharedTeamAssessment(assessmentId, teamId)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();

                    // assert
                    expect($log.error).toHaveBeenCalledWith('XHR failed for addSharedTeamAssessment. ');
                    done();
                });
                $rootScope.$digest();
                expect($httpBackend.flush).not.toThrow();
            });

            it('should reject the promise if the http call failed', function (done) {
                // arrange
                var assessmentId = 1;
                var teamId = 2;
                var teamAssessment = {};
                $httpBackend.whenPOST('http://localhost:13547/api/teams/2/assessments/1/share').respond(500, 'an error occurred');
                spyOn($log, 'error');
                $log.error.calls.reset();
                spyOn($q, 'reject').and.callThrough();
                $q.reject.calls.reset();

                // act
                $service.addSharedTeamAssessment(assessmentId, teamId)
                .then(function (response) {
                    expect(response).not.toBeDefined();
                })
                .catch(function (error) {
                    expect(error).toBeDefined();
                    // assert
                    expect($q.reject).toHaveBeenCalledWith('an error occurred');
                    done();
                });
                $rootScope.$digest();
                expect($httpBackend.flush).not.toThrow();
            });
        });

        describe('.getTeamAssessmentsForAssessments()', function () {
            it('should make an http request per assessment', function (done) {
                // arrange
                var assessments = [
                    { id: 1, teamAssessments: [] },
                    { id: 2, teamAssessments: [] }
                ];
                $httpBackend.expectGET('http://localhost:13547/api/assessments/1/teamAssessments').respond(200, {});
                $httpBackend.expectGET('http://localhost:13547/api/assessments/2/teamAssessments').respond(200, {});

                // act
                $service.getTeamAssessmentsForAssessments(assessments)
                .then(function (response) {
                    expect(response).toBeDefined();
                    // assert
                    done();
                });

                expect($httpBackend.flush).not.toThrow();
            });

            it('should add team assessment list to correct assessment object', function (done) {
                // arrange
                var assessments = [
                    { id: 1, teamAssessments: [] },
                    { id: 2, teamAssessments: [] }
                ];
                $httpBackend.expectGET('http://localhost:13547/api/assessments/1/teamAssessments').respond(200, [{ teamAssessmentId: 345 }]);
                $httpBackend.expectGET('http://localhost:13547/api/assessments/2/teamAssessments').respond(200, [{ teamAssessmentId: 678 }]);

                // act
                $service.getTeamAssessmentsForAssessments(assessments)
                .then(function (response) {
                    expect(response).toBeDefined();
                    // assert
                    expect(response[0].teamAssessments[0].teamAssessmentId).toEqual(345);
                    expect(response[1].teamAssessments[0].teamAssessmentId).toEqual(678);
                    done();
                });
                $rootScope.$apply();

                expect($httpBackend.flush).not.toThrow();
            });

            it('should set an empty list if an error occurred retrieving the data', function (done) {
                // arrange
                var assessments = [
                    { id: 1, teamAssessments: [] },
                    { id: 2, teamAssessments: [] }
                ];
                $httpBackend.expectGET('http://localhost:13547/api/assessments/1/teamAssessments').respond(500, {});
                $httpBackend.expectGET('http://localhost:13547/api/assessments/2/teamAssessments').respond(200, [{ teamAssessmentId: 678 }]);

                // act
                $service.getTeamAssessmentsForAssessments(assessments)
                .then(function (response) {
                    expect(response).toBeDefined();
                    // assert
                    expect(response[0].teamAssessments).toEqual([]);
                    done();
                });
                $rootScope.$apply();

                expect($httpBackend.flush).not.toThrow();
            });
        });

        describe('.getMostRecentAttemptForTeam()', function () {
            it('should get the latest team assessment by started date when completed date is null', function () {
                // arrange
                let groupedTeamAssessments = [
                            {
                                id: 345,
                                assessmentId: 2,
                                teamId: 3,
                                teamName: 'team two',
                                started: '2017-06-09T11:30:15.457Z',
                                completed: null
                            },
                            {
                                id: 456,
                                assessmentId: 2,
                                teamId: 3,
                                teamName: 'team two',
                                started: '2017-06-12T11:30:15.457Z',
                                completed: null // in progress
                            },
                            {
                                id: 789,
                                assessmentId: 2,
                                teamId: 3,
                                teamName: 'team two',
                                started: '2017-06-11T11:30:15.457Z',
                                completed: '2017-06-11T10:43:15.457Z'
                            }
                ];

                // act
                let result = $service.getMostRecentAttemptForTeam(groupedTeamAssessments);

                // assert
                expect(result.latest.id).toEqual(456);
            });

            it('should get the latest team assessment by completed date', function () {
                // arrange
                let groupedTeamAssessments = [
                            {
                                id: 123,
                                assessmentId: 2,
                                teamId: 2,
                                teamName: 'team one',
                                started: '2017-06-09T11:30:15.457Z',
                                completed: '2017-06-13T10:43:15.457Z'
                            },
                            {
                                id: 345,
                                assessmentId: 2,
                                teamId: 3,
                                teamName: 'team two',
                                started: '2017-09-01T16:30:15.457Z',
                                completed: '2017-09-03T10:30:15.457Z'
                            },
                            {
                                id: 456,
                                assessmentId: 2,
                                teamId: 3,
                                teamName: 'team two',
                                started: '2017-06-12T11:30:15.457Z',
                                completed: null // in progress
                            },
                            {
                                id: 789,
                                assessmentId: 2,
                                teamId: 3,
                                teamName: 'team two',
                                started: '2017-06-11T11:30:15.457Z',
                                completed: '2017-06-11T10:43:15.457Z'
                            }
                ];

                // act
                let result = $service.getMostRecentAttemptForTeam(groupedTeamAssessments);

                // assert
                expect(result.latest.id).toEqual(345);
            });

            it('should auto set the latest if only one team assessment is provided', function () {
                // arrange
                let groupedTeamAssessments = [
                            {
                                id: 123,
                                assessmentId: 2,
                                teamId: 2,
                                teamName: 'team one',
                                started: '2017-06-09T11:30:15.457Z',
                                completed: '2017-06-13T10:43:15.457Z'
                            }
                ];

                // act
                let result = $service.getMostRecentAttemptForTeam(groupedTeamAssessments);

                // assert
                expect(result.latest.id).toEqual(123);
            });
        });

        describe('.getTeamAssessmentByIdFromGroupedList()', function () {
            it('should return undefined if the list of team assessments is empty', function () {
                // arrange
                var teamAssessments = [],
                    id = 123;

                // act
                var result = $service.getTeamAssessmentByIdFromGroupedList(teamAssessments, id);

                // assert
                expect(result).not.toBeDefined();
            });

            it('should return undefined if the list does not contain the provided id', function () {
                // arrange
                var teamAssessments = [{
                    latest: {
                        id: 123,
                        assessmentId: 1,
                        teamId: 2,
                        teamName: 'team one',
                        started: '2017-09-01T16:30:15.457Z',
                        completed: '2017-09-03T10:30:15.457Z'
                    },
                    list: [{
                        id: 123,
                        assessmentId: 1,
                        teamId: 2,
                        teamName: 'team one',
                        started: '2017-09-01T16:30:15.457Z',
                        completed: '2017-09-03T10:30:15.457Z'
                    },
                    {
                        id: 345,
                        assessmentId: 2,
                        teamId: 3,
                        teamName: 'team two',
                        started: '2017-06-09T11:30:15.457Z',
                        completed: '2017-06-13T10:43:15.457Z'
                    }]
                }],
                id = 12345;

                // act
                var result = $service.getTeamAssessmentByIdFromGroupedList(teamAssessments, id);

                // assert
                expect(result).not.toBeDefined();
            });

            it('should return the team assessment with the matching id', function () {
                // arrange
                var teamAssessments = [{
                    latest: {
                        id: 123,
                        assessmentId: 1,
                        teamId: 2,
                        teamName: 'team one',
                        started: '2017-09-01T16:30:15.457Z',
                        completed: '2017-09-03T10:30:15.457Z'
                    },
                    list: [{
                        id: 123,
                        assessmentId: 1,
                        teamId: 2,
                        teamName: 'team one',
                        started: '2017-09-01T16:30:15.457Z',
                        completed: '2017-09-03T10:30:15.457Z'
                    },
                    {
                        id: 345,
                        assessmentId: 2,
                        teamId: 3,
                        teamName: 'team two',
                        started: '2017-06-09T11:30:15.457Z',
                        completed: '2017-06-13T10:43:15.457Z'
                    }]
                }, {
                    latest: {
                        id: 321,
                        assessmentId: 1,
                        teamId: 2,
                        teamName: 'team one',
                        started: '2017-09-01T16:30:15.457Z',
                        completed: '2017-09-03T10:30:15.457Z'
                    },
                    list: [{
                        id: 321,
                        assessmentId: 1,
                        teamId: 2,
                        teamName: 'team one',
                        started: '2017-09-01T16:30:15.457Z',
                        completed: '2017-09-03T10:30:15.457Z'
                    },
                    {
                        id: 543,
                        assessmentId: 2,
                        teamId: 3,
                        teamName: 'team two',
                        started: '2017-06-09T11:30:15.457Z',
                        completed: '2017-06-13T10:43:15.457Z'
                    }]
                }],
                id = 543;

                // act
                var result = $service.getTeamAssessmentByIdFromGroupedList(teamAssessments, id);

                // assert
                expect(result).toBeDefined();
                expect(result.id).toEqual(id);
            });
        });
    });
})();