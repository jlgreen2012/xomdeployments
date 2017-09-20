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
    });
})();