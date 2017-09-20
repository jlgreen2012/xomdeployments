(function () {
    'use strict';

    angular
        .module('app')
        .factory('User', UserModel);

    UserModel.$inject = [];

    /**
     * Js representation of a User object.
     * @returns {Object}
     */
    function UserModel() {
        return User;

        /**
         * Creates a new user from the base Obj.
         * @param {Object} baseObj
         * @returns {Object}
         */
        function User(baseObj) {
            let instance = this;

            if (!angular.isObject(baseObj))
                baseObj = {};

            angular.extend(instance, {
                Id: baseObj.Id,
                Username: baseObj.Username,
                FriendlyName: baseObj.FriendlyName,
                EmailAddress: baseObj.EmailAddress,
                IsAppAdmin: baseObj.IsAppAdmin,
                AppRoles: baseObj.AppRoles,
                ProductionLineRoles: baseObj.ProductionLineRoles,
                PlantRoles: baseObj.PlantRoles,
                ProductionUnitRoles: baseObj.ProductionUnitRoles,
                SiteRoles: baseObj.SiteRoles
            });

            return instance;
        }
    }
})();