(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserController', UserController);

    UserController.$inject = ['$routeParams', 'userService'];

    /**
     * Controller to manage users.
     * @param {$routeParams} $routeParams
     * @param {factory} userService
     */
    function UserController($routeParams, userService) {
        var vm = this;

        // Field members
        vm.user = {};
        vm.isLoading = true;
        vm.roles = [];
        vm.userNotFound = false;

        // Function mapping
        vm.getPermissions = getPermissions;

        // Initialize launch command
        activate();

        //////////////////

        /**
        * Performs initialization activities during the
        * initial instantiation.
        */
        function activate() {
            getUser($routeParams.username);
        }

        /**
        * Gets the users information for the specified.
        * @param {String} username
        */
        function getUser(username) {
            vm.userNotFound = false;

            userService.getUserByUsername(username || 'me')
                .then(function (user) {
                    vm.user = user;
                    vm.isLoading = false;
                    vm.roles = getRoles();
                }, function (error) {
                    if (error.status === 400)
                        vm.userNotFound = true;
                });
        }

        /**
         * Gets a list of all roles for the user.
         * @returns {Array}
         */
        function getRoles() {
            return filter(vm.user, 'Roles');
        }

        /**
         * Gets a list of roles the user has permission to.
         * @param {String} role
         * @returns {Array}
         */
        function getPermissions(role) {
            return filter(role, 'Can');
        }

        /**
         * Filters the object's properties.
         * @param {Object} obj
         * @param {String} includes
         * @returns {Array}
         */
        function filter(obj, includes) {
            return Object.keys(obj).filter(function (key) {
                return key.includes(includes);
            });
        }
    }
})();