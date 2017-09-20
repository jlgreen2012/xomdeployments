'use-strict';

angular.module('mock.assessmentDataService', [])
.factory('assessmentDataService', DataService);

DataService.$inject = ['$q'];

function DataService($q) {
    var dataService = {};

    // Get Assessments
    dataService.getAssessments = jasmine.createSpy('getAssessments() spy')
    .and
    .callFake(function (teamId) {
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
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // Start Assessment
    dataService.startAssessment = jasmine.createSpy('startAssessment() spy')
    .and
    .callFake(function (assessmentId, teamId) {
        var mockResult = {};
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // Save Assessment
    dataService.saveAssessment = jasmine.createSpy('saveAssessment() spy')
    .and
    .callFake(function (assessmentId, teamId, teamAssessment) {
        var mockResult = {};
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // Submit Assessment
    dataService.submitAssessment = jasmine.createSpy('submitAssessment() spy')
    .and
    .callFake(function (assessmentId, teamId, teamAssessment) {
        var mockResult = {};
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // getTeamAssessmentDetails
    dataService.getTeamAssessmentDetailsById = jasmine.createSpy('getTeamAssessmentDetails() spy')
    .and
    .callFake(function (assessmentId, teamAssessmentId) {
        var mockResult = {
            id: 123,
            assessmentId: 1,
            teamId: 2,
            started: '2017-09-01T16:30:15.457Z',
            completed: '2017-09-03T10:30:15.457Z',
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
                    selectedAnswerId: 1
                }
            ]
        };
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // Submit Assessment
    dataService.getTeamAssessments = jasmine.createSpy('getTeamAssessments() spy')
    .and
    .callFake(function (assessmentId, teamId, teamAssessment) {
        var mockResult = [
            {
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
            }
        ];
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // Get Share Link
    dataService.getTeamAssessmentShareLink = jasmine.createSpy('getTeamAssessmentShareLink() spy')
    .and
    .callFake(function (assessmentId, teamId) {
        return 'http://someurl.com/share';
    });

    // Submit Assessment
    dataService.addSharedTeamAssessment = jasmine.createSpy('addSharedTeamAssessment() spy')
    .and
    .callFake(function (assessmentId, teamId) {
        var mockResult = {
            id: 123,
            assessmentId: 1,
            teamId: 2,
            teamName: 'Team A',
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
                    selectedAnswerId: 1
                }
            ]
        };
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // getMostRecentAttemptForTeam
    dataService.getMostRecentAttemptForTeam = jasmine.createSpy('getMostRecentAttemptForTeam() spy')
    .and
    .callFake(function (groupedTeamAssessments) {
        var mockResult = {
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
        };
        return mockResult;
    });

    // getTeamAssessmentByIdFromGroupedList
    dataService.getTeamAssessmentByIdFromGroupedList = jasmine.createSpy('getTeamAssessmentByIdFromGroupedList() spy')
    .and
    .callFake(function (teamAssessmentGroupedList, teamAssessmentId) {
        var mockResult = {
            id: 123,
            assessmentId: 1,
            teamId: 2,
            started: '2017-09-01T16:30:15.457Z',
            completed: '2017-09-03T10:30:15.457Z',
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
                    selectedAnswerId: 1
                }
            ]
        };
        return mockResult;
    });

    return dataService;
}