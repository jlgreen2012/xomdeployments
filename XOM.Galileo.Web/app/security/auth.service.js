(function () {
    'use strict';

    angular
        .module('app')
        .factory('authService', authService);

    authService.$inject = ['$q', 'userService'];

    /**
     * Data service for authentication and authorization.
     * @param {$q} $q
     * @param {factory} userService
     * @returns {Object}
     */
    function authService($q, userService) {
        var service = {
            logout: logout,
            getCurrentUser: getCurrentUser,
            isLoggedIn: isLoggedIn,
            isAdmin: isAdmin,
            hasPermission: hasPermission
        };

        /***
        * Uncomment the following when bearer tokens are
        * implemented.
        **/
        //if($cookies.get("token") && $location.path() !== '/logout') {
        //getCurrentUser();
        //}

        return service;

        //////////////////

        /**
        * Removes all tokens and resets the current user.
        *
        * Note, because this is AD based, we will not actually be logging
        * out, when bearer tokens are added this will occur to remove
        * the token from their cookie representation.
        **/
        function logout() {
            //$cookies.remove('token');
        }

        /**
        * Retrieves the current user from cache when
        * the user has been cached, otherwise retrieves
        * the current user from the UserService and adds
        * it to the cache.
        *
        * @returns {Object} user
        **/
        function getCurrentUser() {
            return userService.getUserByUsername('me');
        }

        /**
        * Provides a value which indicates whether or not
        * the user is currently logged in.
        *
        * @returns {Boolean} true if logged in
        **/
        function isLoggedIn() {
            return getCurrentUser()
                .then(function (user) {
                    return user && user.hasOwnProperty('Username');
                });
        }

        /**
        * Provides a value which indicates whether or not
        * the user is an application administrator.
        *
        * @returns {Boolean} true if admin
        **/
        function isAdmin() {
            return getCurrentUser()
                .then(function (user) {
                    return user && user.IsAppAdmin;
                });
        }

        /**
         * Gets the first permission in the list that matches the permission name.
         * @param {Array} permissions - list of permissions to search
         * @param {Strin} permissionToFind - search criteria, permission name
         */
        function getPermission(permissions, permissionToFind) {
            return permissions.find(function (p) {
                return p.name.toLowerCase() === permissionToFind.toLowerCase();
            });
        }

        /**
         * Determines if the current user has a specific permission and privilege in any of the user's roles.
         * @param {String} permission - name of permission
         * @param {String} privilege - name of privilege
         * @returns {Promise} resolved to true or false 
         */
        function hasPermission(permission, privilege) {
            var deferred = $q.defer();
            getCurrentUser()
                .then(function (data) {
                    // Get all user roles.
                    var roles = data.AppRoles;
                    if (typeof roles !== "undefined" && roles !== null && roles.length > 0) {
                        // Get all permissions from those role with the name provided.
                        let matchedPermissions = roles.map(function (role) {
                            return getPermission(role.permissions, permission);
                        }),

                        // For the permissions that we found, find the first
                        // one that has the privilege level we're looking for.
                        hasAccess = matchedPermissions.find(function (p) {
                            return p.privilege.toLowerCase() === privilege.toLowerCase();
                        }) !== null;

                        deferred.resolve(hasAccess);
                    }
                    deferred.resolve(false)
                });
            return deferred.promise;
        }
    }
})();