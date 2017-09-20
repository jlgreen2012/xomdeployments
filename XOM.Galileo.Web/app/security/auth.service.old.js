(function () {
    'use strict';

    angular
        .module('app')
        .factory('authServiceOld', authService);

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

            getRoles: getRoles,
            getRole: getRole,
            hasAppRoles: hasAppRoles,
            hasRoles: hasRoles,
            hasRole: hasRole,
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
        * Gets the current user specified set of roles
        * @param {Array} roleSet
        * @returns {Array}
        **/
        function getRoles(roleSet) {
            return getCurrentUser()
                .then(function (user) {
                    return user && user[roleSet + 'Roles'];
                });
        }

        /**
        * Gets the current user specified role from a specified set of roles
        * @param {Array} roleSet
        * @param {String} role
        * @returns {Object}
        **/
        function getRole(roleSet, role) {
            return getRoles(roleSet)
                .then(function (roles) {
                    return roles && roles[role];
                });
        }

        /**
        * Checks if the current user has the specified set of roles
        * @param {Array} roleSet
        * @returns {Array}
        **/
        function hasRoles(roleSet) {
            return getRoles(roleSet)
                .then(function (roles) {
                    return roles && Object.keys(roles).length > 0;
                });
        }

        /**
        * Checks if the current user has app roles
        * @returns {Boolean}
        **/
        function hasAppRoles() {
            return getRoles('App')
                .then(function (roles) {
                    return roles !== null && Object.keys(roles).length > 0;
                });
        }

        /**
        * Checks if the current user has the specified role on a specified set of roles
        * @param {Array} roleSet
        * @param {String} rolename
        * @returns {Boolean}
        **/
        function hasRole(roleSet, rolename) {
            return getRole(roleSet, rolename)
                .then(function (role) {
                    return !!role;
                });
        }

        /**
        * Determinies whether or not the specified role
        * on a specified set contains the specified permission
        * @param {Array} roleSet
        * @param {String} roleName
        * @param {String} permission
        * @returns {Boolean}
        **/
        function hasPermission(roleSet, roleName, permission) {
            if (!angular.isString(permission))
                return $q.when(false);

            getRole(roleSet, roleName)
                .then(function (role) {
                    if (!role)
                        return false;

                    switch (permission) {
                        case 'Create':
                            return role.CanCreate;
                        case 'Read':
                            return role.CanRead;
                        case 'Edit':
                            return role.CanEdit;
                        case 'Submit':
                            return role.CanSubmit;
                        case 'Delete':
                            return role.CanDelete;
                        case 'Full':
                            return role.CanCreate &&
                                    role.CanRead &&
                                    role.CanEdit &&
                                    role.CanSubmit &&
                                    role.CanDelete;
                        default:
                            return false;
                    }
                });
        }
    }
})();