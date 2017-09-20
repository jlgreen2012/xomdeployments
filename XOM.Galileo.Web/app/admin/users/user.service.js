(function () {
    'use strict';

    angular
        .module('app')
        .factory('userService', userService);

    userService.$inject = ['$http', '$log', 'configs', 'User'];

    /**
     * Data service for users.
     * @param {$http} $http
     * @param {$log} $log
     * @param {Object} configs
     * @param {Object} User
     * @returns {Object}
     */
    function userService($http, $log, configs, User) {
        var service = {
            getUsers: getUsers,
            getUserById: getUserById,
            getUserByUsername: getUserByUsername,
            saveUser: saveUser,
            deleteUser: deleteUser
        };

        return service;

        //////////////////

        /**
         * Get all users
         * @returns {Array}
         */
        function getUsers() {
            var req = {
                method: 'GET',
                url: configs.apiUrl + "auth/users"
            }

            return $http(req)
                    .then(
                        function successCallback(res) {
                            return res.data;
                        },

                        function errorCallback(res) {
                            $log.debug('There was an error retrieving users. Please try again later.');
                        }
                    );
        }

        /**
         * Get a specific user by the id.
         * @param {Int} id
         * @returns {Object}
         */
        function getUserById(id) {
            var req = {
                method: 'GET',
                url: configs.apiUrl + "auth/users/" + id
            }

            return $http(req)
                    .then(
                        function successCallback(res) {
                            return res.data;
                        },

                        function errorCallback(res) {
                            $log.debug('There was an error retrieving the user. Please try again later.');
                        }
                    );
        }

        /**
         * Get a specific user by the username.
         * @param {String} username
         * @returns {Object}
         */
        function getUserByUsername(username) {
            var req = {
                method: 'GET',
                url: configs.apiUrl + "auth/users/" + username
            }

            return $http(req)
                    .then(
                        function successCallback(res) {
                            //$log.debug('User retrieved successfully.');
                            //$log.debug(res.data);

                            return res.data;
                        },

                        function errorCallback(res) {
                            $log.debug('There was an error retrieving the user. Please try again later.');
                        }
                    );
        }

        /**
         * Create or Update a user.
         * @param {Object} user
         * @returns {Object}
         */
        function saveUser(user) {
            var request = {
                method: 'POST',
                url: configs.apiUrl + "auth/users",
                data: {
                    Username: user.Username,
                    FriendlyName: user.FriendlyName,
                    EmailAddress: user.EmailAddress,
                    IsAppAdmin: user.IsAppAdmin,
                    AppRoles: user.AppRoles,
                    ProductionLineRoles: user.ProductionLineRoles,
                    PlantRoles: user.PlantRoles,
                    ProductionUnitRoles: user.ProductionUnitRoles,
                    SiteRoles: user.SiteRoles
                }
            }

            if (user && user.Id > 0) {
                request.method = 'PUT';
                request.url = request.url + "/" + user.Id;
                request.data.Id = user.Id;
            }

            return $http(request)
                    .then(
                        function successCallback(res) {
                            return res.data;
                        },

                        function errorCallback(res) {
                            $log.debug('There was an error saving the user. Please try again later.');
                        }
                    );
        }

        /**
         * Delete a user by the id.
         * @param {Int} id
         * @returns {Boolean}
         */
        function deleteUser(id) {
            var req = {
                method: 'DELETE',
                url: configs.apiUrl + "auth/users/" + id
            }

            return $http(req)
                    .then(
                        function successCallback(res) {
                            return true;
                        },

                        function errorCallback(res) {
                            $log.debug('There was an error retrieving the user. Please try again later.');
                            return false;
                        }
                    );
        }
    }
})();