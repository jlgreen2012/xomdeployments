(function () {
    describe('AssessmentController', function () {
        var $controller, vm, mockAssessmentDataService, $log, $routeParams,
            action, $q, $rootScope, $location, $thisRootScope, $timeout;

        beforeEach(module('app.assessment'));
        beforeEach(module('mock.assessmentDataService'));

        beforeEach(
            inject(function (_$controller_, _assessmentDataService_, _$log_, _$q_, _$rootScope_, _$location_, _$timeout_) {
                $controller = _$controller_;
                mockAssessmentDataService = _assessmentDataService_;
                $log = _$log_;
                $routeParams = { assessmentId: 1, teamId: 2 };
                action = null;
                $q = _$q_;
                $rootScope = _$rootScope_.$new();
                $location = _$location_;
                $timeout = _$timeout_
            })
        );

        beforeEach(function () {
            // Create the controller.
            vm = $controller('AssessmentController', {
                assessmentDataService: mockAssessmentDataService,
                $log: $log,
                $routeParams: $routeParams,
                action: '',
                $location: $location,
                $q: $q,
                $rootScope: $rootScope,
                $timeout: $timeout
            });
        });

        describe('.activate()', function () {
            describe('', function () {
                beforeEach(function () {
                    // Create the controller.
                    vm = $controller('AssessmentController', {
                        assessmentDataService: mockAssessmentDataService,
                        $log: $log,
                        $routeParams: $routeParams,
                        action: '',
                        $location: $location,
                        $q: $q,
                        $rootScope: $rootScope,
                        $timeout: $timeout
                    });
                });

                it('should get all assessments', function () {
                    // arrange
                    spyOn(vm, 'getAssessmentList').and.callThrough();
                    vm.getAssessmentList.calls.reset();

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    // assert
                    expect(vm.getAssessmentList).toHaveBeenCalled();
                });

                it('should get all team assessments for selected assessment', function () {
                    // arrange
                    spyOn(vm, 'getTeamAssessmentListForAssessment').and.callThrough();
                    vm.getTeamAssessmentListForAssessment.calls.reset();

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    // assert
                    expect(vm.getTeamAssessmentListForAssessment).toHaveBeenCalled();
                });

                it('should not attempt to get all team assessments if assessment has not been selected', function () {
                    // arrange
                    vm = $controller('AssessmentController', {
                        assessmentDataService: mockAssessmentDataService,
                        $log: $log,
                        $routeParams: {},
                        action: '',
                        $location: $location,
                        $q: $q,
                        $rootScope: $rootScope,
                        $timeout: $timeout
                    });
                    spyOn(vm, 'getTeamAssessmentListForAssessment').and.callThrough();
                    vm.getTeamAssessmentListForAssessment.calls.reset();

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    // assert
                    expect(vm.getTeamAssessmentListForAssessment).not.toHaveBeenCalled();
                });

                it('should indicate the page has laoded when an action is not provided', function () {
                    // arrange
                    spyOn(vm, 'getTeamAssessmentList').and.callThrough();
                    vm.getTeamAssessmentList.calls.reset();

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    // assert
                    expect(vm.loaded).toBeTruthy();
                });
            });

            describe('(action = TAKE_ASSESSMENT)', function () {
                beforeEach(function () {
                    // Create the controller.
                    vm = $controller('AssessmentController', {
                        assessmentDataService: mockAssessmentDataService,
                        $log: $log,
                        $routeParams: $routeParams,
                        action: 'TAKE_ASSESSMENT',
                        $location: $location,
                        $q: $q,
                        $rootScope: $rootScope,
                        $timeout: $timeout
                    });
                });

                it('should be registered', function () {
                    expect($controller).toBeDefined();
                });

                it('should start the assessment', function () {
                    // arrange
                    spyOn(vm, 'takeAssessment').and.callThrough();
                    vm.takeAssessment.calls.reset();

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.takeAssessment).toHaveBeenCalled();
                });

                it('should set the current mode', function () {
                    // arrange
                    vm.current.mode = vm.modes.review;

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.current.mode).toEqual(vm.modes.edit);
                });

                describe('without route param value', function () {
                    beforeEach(function () {
                        // Create the controller.
                        vm = $controller('AssessmentController', {
                            assessmentDataService: mockAssessmentDataService,
                            $log: $log,
                            $routeParams: {},
                            action: 'TAKE_ASSESSMENT',
                            $location: $location,
                            $q: $q,
                            $rootScope: $rootScope
                        });
                    });

                    it('should leave loaded set to false', function () {
                        // arrange

                        // act
                        vm.activate();

                        // assert
                        expect(vm.loaded).toBeFalsy();
                    });

                    it('should not set the current details', function () {
                        // arrange
                        vm.current = {
                            details: {}
                        };

                        // act
                        vm.activate();

                        // assert
                        expect(vm.current.details).toEqual({});
                    });
                });
            });

            describe('(action = REVIEW_ASSESSMENT)', function () {
                beforeEach(function () {
                    // Create the controller.
                    vm = $controller('AssessmentController', {
                        assessmentDataService: mockAssessmentDataService,
                        $log: $log,
                        $routeParams: $routeParams,
                        action: 'REVIEW_ASSESSMENT',
                        $location: $location,
                        $q: $q,
                        $rootScope: $rootScope,
                        $timeout: $timeout
                    });
                });

                it('should be registered', function () {
                    expect($controller).toBeDefined();
                });

                it('should set the current mode', function () {
                    // arrange
                    spyOn(vm, 'reviewTeamAssessment').and.callThrough();
                    vm.reviewTeamAssessment.calls.reset();
                    vm.current.mode = vm.modes.edit;

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.current.mode).toEqual(vm.modes.review);
                });

                it('should review the first team assessment in the list', function () {
                    // arrange
                    spyOn(vm, 'reviewTeamAssessment').and.callThrough();
                    vm.reviewTeamAssessment.calls.reset();
                    var expectedTAid = 123;

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.reviewTeamAssessment.calls.mostRecent().args[0].id).toEqual(expectedTAid);
                });

                it('should call method to review the team assessment', function () {
                    // arrange
                    spyOn(vm, 'reviewTeamAssessment').and.callThrough();
                    vm.reviewTeamAssessment.calls.reset();

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.reviewTeamAssessment).toHaveBeenCalled();
                });

                it('should not call method to review the team assessment if there are no team assessments', function () {
                    // arrange
                    spyOn(vm, 'getTeamAssessmentDetailsById');
                    vm.getTeamAssessmentDetailsById.calls.reset();
                    vm.assessment = {
                        teamAssessments: []
                    };
                    mockAssessmentDataService.getTeamAssessments = jasmine.createSpy('getTeamAssessments() spy')
                        .and
                        .callFake(function (assessmentId, teamId, teamAssessment) {
                            var mockResult = [];
                            var d = $q.defer();
                            d.resolve(mockResult);
                            return d.promise;
                        });

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.getTeamAssessmentDetailsById).not.toHaveBeenCalled();
                });

                it('should indicate the page has loaded', function () {
                    // arrange
                    spyOn(vm, 'reviewTeamAssessment').and.callThrough();
                    vm.reviewTeamAssessment.calls.reset();

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.loaded).toBeTruthy();
                });
            });

            describe('(action = SHARE_ASSESSMENT)', function () {
                beforeEach(function () {
                    // Create the controller.
                    vm = $controller('AssessmentController', {
                        assessmentDataService: mockAssessmentDataService,
                        $log: $log,
                        $routeParams: $routeParams,
                        action: 'SHARE_ASSESSMENT',
                        $location: $location,
                        $q: $q,
                        $rootScope: $rootScope,
                        $timeout: $timeout
                    });
                });

                it('should be registered', function () {
                    expect($controller).toBeDefined();
                });

                it('should set the current assessment', function () {
                    // arrange
                    var mockResult = [
                                {
                                    id: 1,
                                    name: 'assessment name',
                                    instructions: 'some instructions'
                                },
                                {
                                    id: 2,
                                    name: 'assessment name 2',
                                    instructions: 'some instructions 2'
                                }
                    ];
                    mockAssessmentDataService.getAssessments = jasmine.createSpy('getAssessments() spy')
                        .and
                        .callFake(function (teamId) {
                            var d = $q.defer();
                            d.resolve(mockResult);
                            return d.promise;
                        });

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.assessment).toEqual(mockResult[0]);
                });

                it('should call method to share the team assessment', function () {
                    // arrange
                    spyOn(vm, 'addSharedAssessment'); // causes the contents of reviewTeamAssessment to not be called.
                    vm.addSharedAssessment.calls.reset();

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.addSharedAssessment).toHaveBeenCalled();
                });
            });

            describe('(action = EXPORT_ASSESSMENT', function () {
                beforeEach(function () {
                    // Create the controller.
                    vm = $controller('AssessmentController', {
                        assessmentDataService: mockAssessmentDataService,
                        $log: $log,
                        $routeParams: { assessmentId: 1, teamAssessmentId: 123 },
                        action: 'EXPORT_ASSESSMENT',
                        $location: $location,
                        $q: $q,
                        $rootScope: $rootScope,
                        $timeout: $timeout
                    });
                });

                it('should be registered', function () {
                    expect($controller).toBeDefined();
                });

                it('should set the current mode', function () {
                    // arrange
                    spyOn(vm, 'reviewTeamAssessment').and.callThrough();
                    vm.reviewTeamAssessment.calls.reset();

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.current.mode).toEqual(vm.modes.download);
                });

                it('should set the current assessment from the route param', function () {
                    // arrange                    
                    vm.assessment = {};

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    // assert
                    expect(vm.assessment.id).toEqual(1); // 1 = route param
                });
                it('should set the current team assessment from the route param', function () {
                    // arrange
                    spyOn(vm, 'reviewTeamAssessment').and.callThrough();;
                    vm.reviewTeamAssessment.calls.reset();

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.reviewTeamAssessment.calls.mostRecent().args[0].id).toEqual(123);
                });
                it('should not try to get the team assessment if the assessment has no team assessments', function () {
                    // arrange
                    spyOn(vm, 'getTeamAssessmentDetailsById');
                    vm.getTeamAssessmentDetailsById.calls.reset();
                    mockAssessmentDataService.getTeamAssessments = jasmine.createSpy('getTeamAssessments() spy')
                    .and
                    .callFake(function (assessmentId, teamId, teamAssessment) {
                        var mockResult = [];
                        var d = $q.defer();
                        d.resolve(mockResult);
                        return d.promise;
                    });

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.getTeamAssessmentDetailsById).not.toHaveBeenCalled();
                });
                it('should not try to review if the team assessment id is invalid', function () {
                    // arrange
                    spyOn(vm, 'getTeamAssessmentDetailsById');
                    vm.getTeamAssessmentDetailsById.calls.reset();
                    mockAssessmentDataService.getTeamAssessments = jasmine.createSpy('getTeamAssessments() spy')
                    .and
                    .callFake(function (assessmentId, teamId, teamAssessment) {
                        var mockResult = [
                        {
                            id: 12345,
                            assessmentId: 1,
                            teamId: 2,
                            teamName: 'team one',
                            started: '2017-09-01T16:30:15.457Z',
                            completed: '2017-09-03T10:30:15.457Z'
                        }];
                        var d = $q.defer();
                        d.resolve(mockResult);
                        return d.promise;
                    });

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.getTeamAssessmentDetailsById).not.toHaveBeenCalled();
                });
                it('should get the review data for the team assessment', function () {
                    // arrange
                    spyOn(vm, 'reviewTeamAssessment').and.callThrough();
                    vm.reviewTeamAssessment.calls.reset();

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.reviewTeamAssessment).toHaveBeenCalled();
                });
                it('should indicate the export is loaded and ready to download', function () { 
                    // arrange
                    spyOn(vm, 'reviewTeamAssessment').and.callThrough();
                    vm.reviewTeamAssessment.calls.reset();

                    // act
                    vm.activate();
                    $rootScope.$apply();

                    //assert
                    expect(vm.loaded).toBeTruthy();
                });
            });
        });

        describe('.getAssessmentList()', function () {
            it('should set the assessment list', function (done) {
                // arrange
                vm.assessments = [];
                var deferred = $q.defer();

                // act
                vm.getAssessmentList()
                .then(function (data) {
                    // assert
                    expect(vm.assessments.length > 0).toBeTruthy();
                    done();
                });
                $rootScope.$digest();
            });

            it('should return a promise', function (done) {
                // arrange
                vm.assessments = [];

                // act
                vm.getAssessmentList()
                    .then(function () {
                        // assert
                        done();
                    });

                $rootScope.$digest();
            });
        });

        describe('.getTeamAssessmentList()', function () {
            it('should set the assessments team assessment list', function (done) {
                // arrange
                vm.assessments = [
                                    {
                                        id: 1,
                                        name: 'assessment name',
                                        instructions: 'some instructions'
                                    }
                ];

                // act
                vm.getTeamAssessmentList()
                .then(function () {
                    // assert
                    expect(vm.assessments[0].teamAssessments.length > 0).toBeTruthy();
                    done();
                });
                $rootScope.$digest();
            });

            it('should call the data service once for each assessment', function (done) {
                // arrange
                vm.assessments = [
                    {
                        id: 1,
                        name: 'assessment name',
                        instructions: 'some instructions'
                    }
                ];
                mockAssessmentDataService.getTeamAssessments.calls.reset();

                // act
                vm.getTeamAssessmentList()
                .then(function () {
                    // assert
                    expect(mockAssessmentDataService.getTeamAssessments.calls.count()).toEqual(2);
                    done();
                });
                $rootScope.$digest();
            });
        });

        describe('.getTeamAssessmentListForAssessment()', function () {
            it('should set the assessments team assessment list', function (done) {
                // arrange
                vm.assessments = [
                    {
                        id: 1,
                        teamAssessment: []
                    },
                    {
                        id: 2,
                        teamAssessment: []
                    }
                ];
                var assessmentId = 1;

                // act
                vm.getTeamAssessmentListForAssessment(assessmentId)
                .then(function () {
                    // assert
                    expect(vm.assessments[0].teamAssessments.length > 0).toBeTruthy();
                    done();
                });
                $rootScope.$digest();
            });

            it('should call the data service once for each assessment', function (done) {
                // arrange
                vm.assessments = [
                    {
                        id: 1,
                        teamAssessment: []
                    },
                    {
                        id: 2,
                        teamAssessment: []
                    }
                ];
                var assessmentId = 1;
                mockAssessmentDataService.getTeamAssessments.calls.reset();

                // act
                vm.getTeamAssessmentListForAssessment(assessmentId)
                .then(function () {
                    // assert
                    expect(mockAssessmentDataService.getTeamAssessments.calls.count()).toEqual(2);
                    done();
                });
                $rootScope.$digest();
            });

            it('should set the assessments team assessment list by matching the assessment id', function (done) {
                // arrange
                $rootScope.$digest(); // digest activate method.
                vm.assessments = [
                    {
                        id: 1,
                        name: 'assessment name',
                        instructions: 'some instructions'
                    },
                    {
                        id: 2,
                        name: 'assessment name 2 ',
                        instructions: 'some instructions 2'
                    }
                ];

                // act
                vm.getTeamAssessmentListForAssessment(2)
                .then(function () {
                    // assert
                    expect(vm.assessments[1].teamAssessments.length > 0).toBeTruthy();
                    expect(vm.assessments[0].teamAssessments.length > 0).toBeFalsy();
                    done();
                });
                $rootScope.$digest();
            });

            it('should group the team assessments by team name', function (done) {
                // arrange
                $rootScope.$digest(); // digest activate method.
                vm.assessments = [
                    {
                        id: 1,
                        name: 'assessment name',
                        instructions: 'some instructions'
                    },
                    {
                        id: 2,
                        name: 'assessment name 2 ',
                        instructions: 'some instructions 2'
                    }
                ];
                mockAssessmentDataService.getTeamAssessments = jasmine.createSpy('getTeamAssessments() spy')
                    .and
                    .callFake(function (assessmentId, teamId, teamAssessment) {
                        var mockResult = [
                            {
                                id: 123,
                                assessmentId: 2,
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
                        var d = $q.defer();
                        d.resolve(mockResult);
                        return d.promise;
                    });

                // act
                vm.getTeamAssessmentListForAssessment(2)
                .then(function () {
                    // assert
                    expect(vm.assessments[1].teamAssessments.length).toEqual(2);

                    done();
                });
                $rootScope.$digest();
            });

            it('should get the latest team assessment by completed date', function (done) {
                // arrange
                $rootScope.$digest(); // digest activate method.
                vm.assessments = [
                    {
                        id: 1,
                        name: 'assessment name',
                        instructions: 'some instructions'
                    },
                    {
                        id: 2,
                        name: 'assessment name 2 ',
                        instructions: 'some instructions 2'
                    }
                ];
                mockAssessmentDataService.getTeamAssessments = jasmine.createSpy('getTeamAssessments() spy')
                    .and
                    .callFake(function (assessmentId, teamId, teamAssessment) {
                        var mockResult = [
                            {
                                id: 123,
                                assessmentId: 2,
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
                        var d = $q.defer();
                        d.resolve(mockResult);
                        return d.promise;
                    });

                // act
                vm.getTeamAssessmentListForAssessment(2)
                .then(function () {
                    // assert
                    expect(vm.assessments[1].teamAssessments[1].latest.id).toEqual(345);

                    done();
                });
                $rootScope.$digest();
            });

            it('should get the latest team assessment by started date when completed date is null', function (done) {
                // arrange
                $rootScope.$digest(); // digest activate method.
                vm.assessments = [
                    {
                        id: 1,
                        name: 'assessment name',
                        instructions: 'some instructions'
                    },
                    {
                        id: 2,
                        name: 'assessment name 2 ',
                        instructions: 'some instructions 2'
                    }
                ];
                mockAssessmentDataService.getTeamAssessments = jasmine.createSpy('getTeamAssessments() spy')
                    .and
                    .callFake(function (assessmentId, teamId, teamAssessment) {
                        var mockResult = [
                            {
                                id: 123,
                                assessmentId: 2,
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
                        var d = $q.defer();
                        d.resolve(mockResult);
                        return d.promise;
                    });

                // act
                vm.getTeamAssessmentListForAssessment(2)
                .then(function () {
                    // assert
                    expect(vm.assessments[1].teamAssessments[1].latest.id).toEqual(456);

                    done();
                });
                $rootScope.$digest();
            });
        });

        describe('.getTeamAssessmentDetailsById()', function () {
            it('should set the current details', function () {
                // arrange
                vm.assessments = [
                    {
                        id: 1,
                        teamAssessments: [
                            {
                                id: 123,
                                assessmentId: 1,
                                teamId: 3,
                                questions: null
                            }
                        ]
                    }
                ];

                // act
                vm.getTeamAssessmentDetailsById(1, 123);
                $rootScope.$digest();

                // assert
                expect(vm.current.details.questions.length > 0);
            });

            it('should get the details from the service', function () {
                // arrange
                mockAssessmentDataService.getTeamAssessmentDetailsById.calls.reset();
                vm.assessments = [
                    {
                        id: 1,
                        teamAssessments: [
                            {
                                id: 123,
                                assessmentId: 1,
                                teamId: 3,
                                questions: null
                            }
                        ]
                    }
                ];

                // act
                vm.getTeamAssessmentDetailsById(1, 123);
                $rootScope.$digest();

                // assert
                expect(mockAssessmentDataService.getTeamAssessmentDetailsById).toHaveBeenCalled();
            });

            it('should show an error message if the data returned is bad', function () {
                // arrange
                mockAssessmentDataService.getTeamAssessmentDetailsById = jasmine.createSpy('getTeamAssessmentDetailsById() spy')
                   .and
                   .callFake(function (assessmentId, teamId, teamAssessment) {
                       var d = $q.defer();
                       d.resolve();
                       return d.promise;
                   });
                vm.assessments = [
                   {
                       id: 1,
                       teamAssessments: [
                           {
                               id: 123,
                               assessmentId: 1,
                               teamId: 3,
                               questions: null
                           }
                       ]
                   }
                ];

                // act
                vm.getTeamAssessmentDetailsById(1, 123);
                $rootScope.$digest();

                // assert
                expect(vm.message).not.toEqual(null);
            });
        });

        describe('.takeAssessment()', function () {
            beforeEach(function () {
                // Create the controller.
                vm = $controller('AssessmentController', {
                    assessmentDataService: mockAssessmentDataService,
                    $log: $log,
                    $routeParams: $routeParams,
                    action: '',
                    $location: $location,
                    $q: $q,
                    $rootScope: $rootScope,
                    $timeout: $timeout
                });
            });

            it('should call service to start assessment', function () {
                // arrange
                mockAssessmentDataService.startAssessment.calls.reset();

                // act
                vm.takeAssessment();

                // assert
                expect(mockAssessmentDataService.startAssessment).toHaveBeenCalledWith(1, 2);
            });

            it('should set the current assessment ', function () {
                // arrange
                vm.current = {};
                var mockResult = {
                    id: 1,
                    name: 'assessment name',
                    instructions: 'some instructions'
                };
                mockAssessmentDataService.startAssessment = jasmine.createSpy('startAssessment() spy')
                   .and
                   .callFake(function (assessmentId, teamId) {
                       var d = $q.defer();
                       d.resolve(mockResult);
                       return d.promise;
                   });

                // act
                vm.takeAssessment();
                $rootScope.$digest();

                // assert
                expect(vm.current.details).toEqual(mockResult);
            });

            it('should show a failure message when service rejects ', function () {
                // arrange
                vm.current = {};
                mockAssessmentDataService.startAssessment = jasmine.createSpy('startAssessment() spy')
                   .and
                   .callFake(function (assessmentId, teamId) {
                       var error = new Error('some error');
                       var d = $q.defer();
                       d.reject(error.message);
                       return d.promise;
                   });

                // act
                vm.takeAssessment();
                $rootScope.$digest();

                // assert
                expect(vm.message).toEqual('some error');
            });

            it('should show a default failure message when service rejects with an emtpy message', function () {
                // arrange
                vm.current = {};
                mockAssessmentDataService.startAssessment = jasmine.createSpy('startAssessment() spy')
                   .and
                   .callFake(function (assessmentId, teamId) {
                       var error = new Error();
                       var d = $q.defer();
                       d.reject(error.message);
                       return d.promise;
                   });

                // act
                vm.takeAssessment();
                $rootScope.$digest();

                // assert
                expect(vm.message).toEqual('An unknown error occurred while trying to start this assessment. Please try again.');
            });

            it('should set loaded on success', function () {
                // arrange
                vm.current = {};

                // act
                vm.takeAssessment();
                $rootScope.$digest();

                // assert
                expect(vm.loaded).toBeTruthy();
            });

            it('should set loaded on failure', function () {
                // arrange
                vm.current = {};
                mockAssessmentDataService.startAssessment = jasmine.createSpy('startAssessment() spy')
                   .and
                   .callFake(function (assessmentId, teamId) {
                       var error = new Error();
                       var d = $q.defer();
                       d.reject(error.message);
                       return d.promise;
                   });

                // act
                vm.takeAssessment();
                $rootScope.$digest();

                // assert
                expect(vm.loaded).toBeTruthy();
            });

            describe('invalid route params', function () {
                beforeEach(function () {
                    // Create the controller.
                    vm = $controller('AssessmentController', {
                        assessmentDataService: mockAssessmentDataService,
                        $log: $log,
                        $routeParams: {},
                        action: '',
                        $location: $location,
                        $q: $q,
                        $rootScope: $rootScope,
                        $timeout: $timeout
                    });
                });

                it('should not attempt to start an assessment', function () {
                    // arrange
                    mockAssessmentDataService.startAssessment.calls.reset();

                    // act
                    vm.takeAssessment();

                    // assert
                    expect(mockAssessmentDataService.startAssessment).not.toHaveBeenCalled();
                });
            });
        });

        describe('.reviewTeamAssessment()', function () {
            it('should set the mode to review', function () {
                // arrange
                vm.current.state = '';
                vm.current.mode = vm.modes.edit;

                // act
                vm.reviewTeamAssessment({ id: 5});

                // assert
                expect(vm.current.mode).toEqual(vm.modes.review);
            });

            it('should return immediately if the assessment is already set as the current assessment', function () {
                // arrange
                vm.current.state = 'review';
                vm.current.details = { id: 123 };
                mockAssessmentDataService.getTeamAssessmentDetailsById.calls.reset();

                // act
                vm.reviewTeamAssessment({ id: 123 });

                // assert
                expect(vm.current.state).toEqual('review');
                expect(mockAssessmentDataService.getTeamAssessmentDetailsById).not.toHaveBeenCalled();
            });

            it('should set the current details', function () {
                // arrange
                vm.current.details = {};
                vm.assessments = [
                    {
                        id: 1
                    },
                    {
                        id: 2
                    }
                ];

                // act
                vm.reviewTeamAssessment(vm.assessments[1]);

                // assert
                expect(vm.current.details.id).toEqual(2);
            });

            it('should get the team assessment details', function () {
                // arrange
                vm.current.details = {};
                vm.assessments = [
                    {
                        id: 1
                    },
                    {
                        id: 2
                    }
                ];
                spyOn(vm, 'getTeamAssessmentDetailsById').and.callThrough();
                vm.getTeamAssessmentDetailsById.calls.reset();

                // act
                vm.reviewTeamAssessment(vm.assessments[1]);
                $rootScope.$apply();

                // assert
                expect(vm.getTeamAssessmentDetailsById).toHaveBeenCalled();
            });

            it('should set the team assessment details', function () {
                // arrange
                vm.current.details = {};
                vm.assessments = [
                    {
                        id: 1
                    },
                    {
                        id: 2
                    }
                ];
                mockAssessmentDataService.getTeamAssessmentDetailsById = jasmine.createSpy('getTeamAssessmentDetailsById() spy')
                   .and
                   .callFake(function (assessmentId, teamAssessmentId) {
                       var mockResult = {
                           id: 123,
                           assessmentId: 1,
                           teamId: 2,
                           questions: [
                               {
                                   answers: [
                                       {
                                           id: 1,
                                           text: 'answer 1'
                                       },
                                       {
                                           id: 2,
                                           text: 'answer 2'
                                       }
                                   ],
                                   selectedAnswerId: 1,
                                   categoryName: 'cat A'
                               }
                           ],
                           categoryResults: [
                               {
                                   name: 'cat A',
                                   score: .43
                               },
                               {
                                   name: 'cat B',
                                   score: .95
                               }
                           ]
                       };
                       var d = $q.defer();
                       d.resolve(mockResult);
                       return d.promise;
                   });

                // act
                vm.reviewTeamAssessment(vm.assessments[1]);
                $rootScope.$apply();

                // assert
                expect(vm.current.details.categoryResults.length > 0).toBeTruthy();
            });

            it('should set the loading message to true while waiting on the server call', function () {
                // arrange
                vm.current.details = {
                    assessmentId: 1,
                    teamId: 2
                };
                vm.assessments = [
                    {
                        id: 1
                    },
                    {
                        id: 2
                    }
                ];

                // act
                vm.reviewTeamAssessment(vm.assessments[1]);

                // assert
                expect(vm.isTeamAssessmentDetailLoading).toBeTruthy();
                $rootScope.$apply();

                expect(vm.isTeamAssessmentDetailLoading).toBeFalsy();
            });

            describe('radar chart', function () {
                beforeEach(function () {
                    mockAssessmentDataService.getTeamAssessmentDetailsById = jasmine.createSpy('getTeamAssessmentDetailsById() spy')
                   .and
                   .callFake(function (assessmentId, teamAssessmentId) {
                       var mockResult = {
                           id: 123,
                           assessmentId: 1,
                           teamId: 2,
                           questions: [
                               {
                                   answers: [
                                       {
                                           id: 1,
                                           text: 'answer 1'
                                       },
                                       {
                                           id: 2,
                                           text: 'answer 2'
                                       }
                                   ],
                                   selectedAnswerId: 1,
                                   categoryName: 'cat A'
                               },
                               {
                                   answers: [
                                       {
                                           id: 1,
                                           text: 'answer 1'
                                       },
                                       {
                                           id: 2,
                                           text: 'answer 2'
                                       }
                                   ],
                                   selectedAnswerId: 1,
                                   categoryName: 'cat A'
                               },
                               {
                                   answers: [
                                       {
                                           id: 1,
                                           text: 'answer 1'
                                       },
                                       {
                                           id: 2,
                                           text: 'answer 2'
                                       }
                                   ],
                                   selectedAnswerId: 1,
                                   categoryName: 'cat B'
                               }
                           ],
                           categoryResults: [
                               {
                                   name: 'cat A',
                                   score: .43
                               },
                               {
                                   name: 'cat B',
                                   score: .95
                               }
                           ]
                       };
                       var d = $q.defer();
                       d.resolve(mockResult);
                       return d.promise;
                   });
                });

                it('should transform category data into axis and value objects', function () {
                    // arrange
                    vm.current.details = { id: 987 };
                    var assessment = {
                        assessmentId: 1,
                        teamId: 2
                    };
                    var expected = [[
                        {
                            axis: 'cat A',
                            value: .43
                        },
                        {
                            axis: 'cat B',
                            value: .95
                        }
                    ]];

                    // act
                    vm.reviewTeamAssessment(assessment);
                    $rootScope.$digest();

                    // assert
                    expect(vm.current.radarChartData.data).toEqual(expected);
                });

                it('should account for categories with all NA questions', function () {
                    // arrange
                    vm.current.details = { id: 987 };
                    mockAssessmentDataService.getTeamAssessmentDetailsById = jasmine.createSpy('getTeamAssessmentDetailsById() spy')
                   .and
                   .callFake(function (assessmentId, teamAssessmentId) {
                       var mockResult = {
                           id: 123,
                           assessmentId: 1,
                           teamId: 2,
                           questions: [
                               {
                                   answers: [
                                       {
                                           id: 1,
                                           text: 'Not Applicable'
                                       },
                                       {
                                           id: 2,
                                           text: 'answer 2'
                                       }
                                   ],
                                   selectedAnswerId: 1,
                                   categoryName: 'cat A'
                               },
                               {
                                   answers: [
                                       {
                                           id: 1,
                                           text: 'Not Applicable'
                                       },
                                       {
                                           id: 2,
                                           text: 'answer 2'
                                       }
                                   ],
                                   selectedAnswerId: 1,
                                   categoryName: 'cat A'
                               },
                               {
                                   answers: [
                                       {
                                           id: 1,
                                           text: 'answer 1'
                                       },
                                       {
                                           id: 2,
                                           text: 'answer 2'
                                       }
                                   ],
                                   selectedAnswerId: 1,
                                   categoryName: 'cat B'
                               }
                           ],
                           categoryResults: [
                               {
                                   name: 'cat A',
                                   score: NaN
                               },
                               {
                                   name: 'cat B',
                                   score: .95
                               }
                           ]
                       };
                       var d = $q.defer();
                       d.resolve(mockResult);
                       return d.promise;
                   });
                    var assessment = {
                        assessmentId: 1,
                        teamId: 2
                    };
                    var expected = [[
                        {
                            axis: 'cat A (NA)',
                            value: 0
                        },
                        {
                            axis: 'cat B',
                            value: .95
                        }
                    ]];

                    // act
                    vm.reviewTeamAssessment(assessment);
                    $rootScope.$digest();

                    // assert
                    expect(vm.current.radarChartData.data).toEqual(expected);
                });

                it('should create a click event for each category', function () {
                    // arrange
                    vm.current.details = { id: 987 };
                    var assessment = {
                        assessmentId: 1,
                        teamId: 2
                    };

                    // act
                    vm.reviewTeamAssessment(assessment);
                    $rootScope.$digest();

                    // assert
                    expect(vm.current.radarChartData.legend.length).toEqual(2);
                    expect(vm.current.radarChartData.legend[0].name).toEqual('cat A');
                    expect(vm.current.radarChartData.legend[1].name).toEqual('cat B');
                });

                it('should reset radar chart data while waiting for assessment details', function () {
                    // arrange
                    vm.current.details = { id: 987 };
                    vm.current.radarChartData = {};
                    var assessment = {
                        assessmentId: 1,
                        teamId: 2
                    };

                    // act
                    vm.reviewTeamAssessment(assessment);

                    // assert
                    expect(vm.current.radarChartData).toEqual(null);
                    $rootScope.$digest();
                    expect(vm.current.radarChartData).not.toEqual(null);
                });

                describe('.click()', function () {
                    it('should build the category details data', function () {
                        // arrange
                        vm.current.details = { id: 987 };
                        var assessment = {
                            assessmentId: 1,
                            teamId: 2
                        };
                        var expected = [{
                            categoryName: 'cat A',
                            questions: [
                               {
                                   answers: [
                                       {
                                           id: 1,
                                           text: 'answer 1'
                                       },
                                       {
                                           id: 2,
                                           text: 'answer 2'
                                       }
                                   ],
                                   selectedAnswerId: 1,
                                   categoryName: 'cat A'
                               },
                               {
                                   answers: [
                                       {
                                           id: 1,
                                           text: 'answer 1'
                                       },
                                       {
                                           id: 2,
                                           text: 'answer 2'
                                       }
                                   ],
                                   selectedAnswerId: 1,
                                   categoryName: 'cat A'
                               }
                            ],
                            score: .43
                        }, {
                            categoryName: 'cat B',
                            questions: [
                               {
                                   answers: [
                                       {
                                           id: 1,
                                           text: 'answer 1'
                                       },
                                       {
                                           id: 2,
                                           text: 'answer 2'
                                       }
                                   ],
                                   selectedAnswerId: 1,
                                   categoryName: 'cat B'
                               }
                            ],
                            score: .95
                        }];

                        // act
                        vm.reviewTeamAssessment(assessment);
                        $rootScope.$digest();
                        vm.current.radarChartData.legend[0].click();

                        // assert
                        expect(vm.current.questionResponsesByCategory).toEqual(expected);
                    });

                    it('should not change the mode if the current mode is download', function () {
                        // arrange
                        vm.current.details = { id: 987 };
                        var assessment = {
                            assessmentId: 1,
                            teamId: 2
                        };

                        // act
                        vm.reviewTeamAssessment(assessment);
                        $rootScope.$digest();
                        vm.current.mode = vm.modes.download;
                        vm.current.radarChartData.legend[0].click();

                        // assert
                        expect(vm.current.mode).toEqual(vm.modes.download);
                    });
                });
            });

            describe('getTeamAssessmentAttempts()', function () {
                beforeEach(function () {
                    vm.assessment = {
                        teamAssessments: [
                            {
                                list: [{
                                    assessmentId: 1,
                                    teamId: 2,
                                    id: 123,
                                    isarchived: false
                                },
                                {
                                    assessmentId: 1,
                                    teamId: 2,
                                    id: 123,
                                    isarchived: true
                                },
                                {
                                    assessmentId: 1,
                                    teamId: 2,
                                    id: 123,
                                    isarchived: true
                                }],
                                latest: {
                                    assessmentId: 1,
                                    teamId: 2,
                                    id: 123,
                                    isarchived: false
                                }
                            }
                        ]
                    }
                });

                it('should return the full list', function () {
                    // arrange
                    vm.current.attempts = [];
                    vm.assessments = [
                        {
                            id: 1
                        },
                        {
                            id: 2,
                            assessmentId: 1,
                            teamId: 2
                        }
                    ];

                    // act
                    vm.reviewTeamAssessment(vm.assessments[1]);

                    // assert
                    expect(vm.isTeamAssessmentDetailLoading).toBeTruthy();
                    $rootScope.$apply();

                    expect(vm.current.attempts.list.length).toEqual(3);
                });

                it('should return an empty object if no match is found on assessment id and team id', function () {
                    // arrange
                    vm.current.attempts = [];
                    vm.assessments = [
                        {
                            id: 1
                        },
                        {
                            id: 2,
                            assessmentId: 13243,
                            teamId: 223423
                        }
                    ];

                    // act
                    vm.reviewTeamAssessment(vm.assessments[1]);

                    // assert
                    expect(vm.isTeamAssessmentDetailLoading).toBeTruthy();
                    $rootScope.$apply();

                    expect(vm.current.attempts).toEqual({});
                });
            });
        });

        describe('vm.current.save()', function () {
            beforeEach(function () {
                // Create the controller.
                vm = $controller('AssessmentController', {
                    assessmentDataService: mockAssessmentDataService,
                    $log: $log,
                    $routeParams: $routeParams,
                    action: '',
                    $location: $location,
                    $q: $q
                });
            });

            it('should call service to save the users progress', function () {
                // arrange
                vm.current.details = {};
                mockAssessmentDataService.saveAssessment.calls.reset();

                // act
                vm.current.save();
                $rootScope.$apply();

                // assert
                expect(mockAssessmentDataService.saveAssessment).toHaveBeenCalledWith(1, 2, {});
            });

            it('should redirect to the review page on success', function () {
                // arrange
                vm.current.details = {};
                spyOn(vm.current, 'review');

                // act
                vm.current.save();
                $rootScope.$apply();

                // assert
                expect(vm.current.review).toHaveBeenCalled();
            });

            it('should reject the promise and chain on failure', function () {
                // arrange
                vm.current.details = {};
                mockAssessmentDataService.saveAssessment = jasmine.createSpy('saveAssessment() spy')
               .and
               .callFake(function (assessmentId, teamId, teamAssessment) {
                   var mockResult = new Error('An error!');
                   var d = $q.defer();
                   d.reject(mockResult);
                   return d.promise;
               });
                spyOn($q, 'reject');
                $q.reject.calls.reset();

                // act
                var result = vm.current.save();
                $rootScope.$apply();

                // assert
                expect($q.reject).toHaveBeenCalledWith(new Error('An error!'));
            });
        });

        describe('vm.current.submit()', function () {
            beforeEach(function () {
                // Create the controller.
                vm = $controller('AssessmentController', {
                    assessmentDataService: mockAssessmentDataService,
                    $log: $log,
                    $routeParams: $routeParams,
                    action: '',
                    $location: $location,
                    $q: $q
                });
            });

            it('should call service to submit the users progress', function () {
                // arrange
                vm.current.details = {};
                mockAssessmentDataService.submitAssessment.calls.reset();

                // act
                vm.current.submit();
                $rootScope.$apply();

                // assert
                expect(mockAssessmentDataService.submitAssessment).toHaveBeenCalledWith(1, 2, {});
            });

            it('should return the promise on success', function () {
                // arrange
                vm.current.details = {};
                spyOn($location, 'path');

                // act
                vm.current.submit()
                .then(function (data) {
                    expect(data).not.toBeDefined();
                    // in this case, we aren't returning anything on success. Just the fact that it's getting here means we succeeded.
                })
                .catch(function (error) {
                    expect(error).not.toBeDefined();
                })
                $rootScope.$apply();

                // assert
            });

            it('should reject the promise and chain on failure', function () {
                // arrange
                vm.current.details = {};
                mockAssessmentDataService.submitAssessment = jasmine.createSpy('submitAssessment() spy')
               .and
               .callFake(function (assessmentId, teamId, teamAssessment) {
                   var mockResult = new Error('An error!');
                   var d = $q.defer();
                   d.reject(mockResult);
                   return d.promise;
               });
                spyOn($q, 'reject');
                $q.reject.calls.reset();

                // act
                var result = vm.current.submit();
                $rootScope.$apply();

                // assert
                expect($q.reject).toHaveBeenCalledWith(new Error('An error!'));
            });
        });

        describe('vm.current.cancel()', function () {
            beforeEach(function () {
                // Create the controller.
                vm = $controller('AssessmentController', {
                    assessmentDataService: mockAssessmentDataService,
                    $log: $log,
                    $routeParams: $routeParams,
                    action: '',
                    $location: $location,
                    $q: $q
                });
            });

            it('should redirect to the assessment list', function () {
                // arrange
                vm.current.details = {};
                spyOn($location, 'path');

                // act
                vm.current.cancel();
                $rootScope.$apply();

                // assert
                expect($location.path).toHaveBeenCalledWith('/assessments');
            });
        });

        describe('vm.current.review()', function () {
            beforeEach(function () {
                // Create the controller.
                vm = $controller('AssessmentController', {
                    assessmentDataService: mockAssessmentDataService,
                    $log: $log,
                    $routeParams: $routeParams,
                    action: '',
                    $location: $location,
                    $q: $q
                });
            });

            it('should redirect to the assessment review', function () {
                // arrange
                vm.current.details = {
                    assessmentId: 5
                };
                spyOn($location, 'path');

                // act
                vm.current.review();
                $rootScope.$apply();

                // assert
                expect($location.path).toHaveBeenCalledWith('/assessments/5');
            });
        });

        describe('.getShareAssessmentLink()', function () {
            it('should not run if the current team assessment is not set', function () {
                // arrange
                $rootScope.$digest();
                vm.current.details = {};

                // act
                var result = vm.getShareAssessmentLink();

                // assert
                expect(result).not.toBeDefined();
            });

            it('should call the service to get the url', function () {
                // arrange
                vm.current.details = {
                    assessmentId: 5,
                    teamId: 12
                };
                mockAssessmentDataService.getTeamAssessmentShareLink.calls.reset();

                // act
                var result = vm.getShareAssessmentLink();

                // assert
                expect(mockAssessmentDataService.getTeamAssessmentShareLink).toHaveBeenCalledWith(5, 12);
            });
        });

        describe('.addSharedAssessment()', function () {
            beforeEach(function () {
                vm.assessment = {
                    id: 1,
                    teamAssessments: [{
                        list: [],
                        latest: {
                            teamId: 2
                        }
                    }]
                };
            });

            it('should set loaded to true on success', function () {
                // arrange
                var assessmentId = 1,
                    teamId = 2;
                $rootScope.$digest();
                vm.loaded = false;

                // act
                vm.addSharedAssessment(assessmentId, teamId);
                $rootScope.$apply();

                // assert
                expect(vm.loaded).toBeTruthy();
            });

            it('should set loaded to true on failure', function () {
                // arrange
                var assessmentId = 1,
                    teamId = 2;
                $rootScope.$digest();
                vm.loaded = false;
                mockAssessmentDataService.addSharedTeamAssessment = jasmine.createSpy('addSharedTeamAssessment() spy')
                    .and
                    .callFake(function (assessmentId, teamId) {
                        var d = $q.defer();
                        d.reject(new Error());
                        return d.promise;
                    });

                // act
                vm.addSharedAssessment(assessmentId, teamId);
                $rootScope.$apply();

                // assert
                expect(vm.loaded).toBeTruthy();
            });

            it('should call the service to add the link', function () {
                // arrange
                var assessmentId = 5,
                    teamId = 12;
                mockAssessmentDataService.addSharedTeamAssessment.calls.reset();

                // act
                vm.addSharedAssessment(assessmentId, teamId);

                // assert
                expect(mockAssessmentDataService.addSharedTeamAssessment).toHaveBeenCalledWith(5, 12);
            });

            it('should set the message if an error is returned', function () {
                // arrange
                var assessmentId = 1,
                    teamId = 2;
                $rootScope.$digest();
                vm.loaded = false;
                mockAssessmentDataService.addSharedTeamAssessment = jasmine.createSpy('addSharedTeamAssessment() spy')
                    .and
                    .callFake(function (assessmentId, teamId) {
                        var d = $q.defer();
                        d.reject('some error');
                        return d.promise;
                    });

                // act
                vm.addSharedAssessment(assessmentId, teamId);
                $rootScope.$apply();

                // assert
                expect(vm.message).toEqual('An error occurred while trying to add the shared assessment: some error');
            });

            it('should set the default error message if the service call is rejected with a null error', function () {
                // arrange
                var assessmentId = 1,
                    teamId = 2;
                $rootScope.$digest();
                vm.loaded = false;
                mockAssessmentDataService.addSharedTeamAssessment = jasmine.createSpy('addSharedTeamAssessment() spy')
                    .and
                    .callFake(function (assessmentId, teamId) {
                        var message = null;
                        var d = $q.defer();
                        d.reject(message);
                        return d.promise;
                    });

                // act
                vm.addSharedAssessment(assessmentId, teamId);
                $rootScope.$apply();

                // assert
                expect(vm.message).toEqual('An error occurred while trying to add the shared assessment. Please try again.');
            });

            it('should set the default error message if the service call is rejected with an undefined error', function () {
                // arrange
                var assessmentId = 1,
                    teamId = 2;
                $rootScope.$digest();
                vm.loaded = false;
                mockAssessmentDataService.addSharedTeamAssessment = jasmine.createSpy('addSharedTeamAssessment() spy')
                    .and
                    .callFake(function (assessmentId, teamId) {
                        var d = $q.defer();
                        d.reject();
                        return d.promise;
                    });

                // act
                vm.addSharedAssessment(assessmentId, teamId);
                $rootScope.$apply();

                // assert
                expect(vm.message).toEqual('An error occurred while trying to add the shared assessment. Please try again.');
            });

            it('should refresh the team assessment list if it does not exist', function () {
                // arrange
                var assessmentId = 1,
                    teamId = 2;
                spyOn(vm, 'getTeamAssessmentListForAssessment').and.callThrough();
                vm.getTeamAssessmentListForAssessment.calls.reset();

                // act
                vm.addSharedAssessment(assessmentId, teamId);
                expect(vm.getTeamAssessmentListForAssessment.calls.count()).toEqual(0);
                $rootScope.$apply(); // causes spy to be called in activate method PLUS our intended one.

                // assert
                expect(vm.getTeamAssessmentListForAssessment.calls.count()).toEqual(2);
            });

            it('should set the informative message when the shared assessment has been added to our list', function () {
                // arrange
                var assessmentId = 1,
                    teamId = 2;

                // act
                vm.addSharedAssessment(assessmentId, teamId);
                $rootScope.$apply();

                // assert
                expect(vm.info).toEqual('The assessment for Team A has been successfully added to your shared assessment list.');
            });

            it('should hide the informative message after a few seconds', function () {
                // arrange
                var assessmentId = 1,
                    teamId = 2;
                vm.assessment = {
                    id: 1,
                    teamAssessments: [{
                        list: [],
                        latest: {
                            teamId: 2
                        }
                    }]
                };

                // act
                vm.addSharedAssessment(assessmentId, teamId);
                $rootScope.$apply();
                $timeout.flush();

                // assert
                expect(vm.info).toEqual(null);
            });

            it('should not duplicate the new team assessment to the list if it already exist', function () {
                // arrange
                var assessmentId = 1,
                    teamId = 2;
                vm.assessment = {
                    teamAssessments: [{
                        list: [{
                            id: 123 // same id.
                        }],
                        latest: {
                            teamId: 2
                        }
                    }]
                };
                spyOn(vm, 'getTeamAssessmentListForAssessment').and.callThrough();
                vm.getTeamAssessmentListForAssessment.calls.reset();

                // act
                vm.addSharedAssessment(assessmentId, teamId);
                $rootScope.$apply(); // causes spy to be called in activate method only.

                // assert
                expect(vm.getTeamAssessmentListForAssessment.calls.count()).toEqual(1);
            });

            it('should not set the informative message when the shared assessment is already in our list', function () {
                // arrange
                var assessmentId = 1,
                    teamId = 2;
                vm.assessment = {
                    teamAssessments: [{
                        list: [{
                            id: 123 // same id.
                        }],
                        latest: {
                            teamId: 2
                        }
                    }]
                };

                // act
                vm.addSharedAssessment(assessmentId, teamId);
                $rootScope.$apply();

                // assert
                expect(vm.info).toEqual(null);
            });

            it('should set the current mode to review', function () {
                // arrange
                var assessmentId = 1,
                    teamId = 2;
                vm.current.mode = vm.modes.edit;

                // act
                vm.addSharedAssessment(assessmentId, teamId);
                $rootScope.$apply();

                // assert
                expect(vm.current.mode).toEqual(vm.modes.review);
            });

            it('should review the team assessment after adding it to this list', function () {
                // arrange
                var assessmentId = 1,
                    teamId = 2;
                spyOn(vm, 'reviewTeamAssessment');

                // act
                vm.addSharedAssessment(assessmentId, teamId);
                $rootScope.$apply();

                // assert
                expect(vm.reviewTeamAssessment).toHaveBeenCalled();
                expect(vm.reviewTeamAssessment.calls.mostRecent().args[0].id).toEqual(123);
            });
        });
    });
})();