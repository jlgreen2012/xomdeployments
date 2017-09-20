'use-strict';

angular.module('mock.teamDataService', [])
.factory('teamDataService', mockTeamDataService);

mockTeamDataService.$inject = ['$q'];

function mockTeamDataService($q) {
    var dataService = {};

    // Create team.
    dataService.createTeam = jasmine.createSpy('createTeam() spy')
    .and
    .callFake(function (team) {
        var mockResult = {
            id: 1,
            name: 'team name',
            info: 'team info'
        };
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // Update team.
    dataService.updateTeam = jasmine.createSpy('updateTeam() spy')
    .and
    .callFake(function (team) {
        var mockResult = {
            id: 1,
            name: 'team name',
            info: 'team info'
        };
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // Get team.
    dataService.getTeam = jasmine.createSpy('getTeam() spy')
    .and
    .callFake(function (teamId) {
        var mockResult = {
            id: 1,
            name: 'team name',
            info: 'team info'
        };
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // Get teams.
    dataService.getTeams = jasmine.createSpy('getTeams() spy')
    .and
    .callFake(function (teamId) {
        var mockResult = [{
            id: 1,
            name: 'team name',
            info: 'team info'
        }];
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // Get team.
    dataService.searchTeamsByName = jasmine.createSpy('searchTeamsByName() spy')
    .and
    .callFake(function (teamId) {
        var mockResult = [{
            id: 1,
            name: 'team name',
            info: 'team info'
        }, {
            id: 2,
            name: 'team other name',
            info: 'team other info'
        }];
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    return dataService;
}