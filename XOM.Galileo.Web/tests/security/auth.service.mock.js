'use-strict';

angular.module('mock.authService', [])
.factory('authService', authService);

authService.$inject = ['$q'];

function authService($q) {
    var dataService = {};

    // Login
    dataService.login = jasmine.createSpy('login() spy')
    .and
    .callFake(function (callback) {
        var mockResult = {};
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // Logout
    dataService.logout = jasmine.createSpy('logout() spy')
    .and
    .callFake(function () {
        var mockResult = {};
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // Get current user
    dataService.getCurrentUser = jasmine.createSpy('getCurrentUser() spy')
    .and
    .callFake(function () {
        var mockResult = {};
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // isLoggedIn
    dataService.isLoggedIn = jasmine.createSpy('isLoggedIn() spy')
    .and
    .callFake(function () {
        var mockResult = {};
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // isAdmin
    dataService.isAdmin = jasmine.createSpy('isAdmin() spy')
    .and
    .callFake(function () {
        var mockResult = {};
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // getToken
    dataService.getToken = jasmine.createSpy('getToken() spy')
    .and
    .callFake(function () {
        var mockResult = {};
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // getRoles
    dataService.getRoles = jasmine.createSpy('getRoles() spy')
    .and
    .callFake(function (roleSet) {
        var mockResult = {};
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // getRole
    dataService.getRole = jasmine.createSpy('getRole() spy')
    .and
    .callFake(function (roleSet, role) {
        var mockResult = {};
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // hasRoles
    dataService.hasRoles = jasmine.createSpy('hasRoles() spy')
    .and
    .callFake(function (roleSet) {
        var mockResult = {};
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // hasRole
    dataService.hasRole = jasmine.createSpy('hasRole() spy')
    .and
    .callFake(function (roleSet, roleName) {
        var mockResult = {};
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    // hasPermission
    dataService.hasPermission = jasmine.createSpy('hasPermission() spy')
    .and
    .callFake(function (roleSet, roleName, permission) {
        var mockResult = {};
        var d = $q.defer();
        d.resolve(mockResult);
        return d.promise;
    });

    return dataService;
}