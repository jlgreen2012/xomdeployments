(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['productionLinesService', 'userService', 'authService'];

    /**
     * Controller to manage users.
     * @param {factory} productionLinesService
     * @param {factory} userService
     * @param {factory} authService
     */
    function UsersController(productionLinesService, userService, authService) {
        let vm = this;

        vm.error = false;
        vm.users = [];
        vm.form = {};

        vm.input = {};

        vm.loading = false;

        activate();

        /**
         * Initialize controller.
         */
        function activate() {
            vm.loading = true;

            userService
                .get()
                .then(function (users) {
                    vm.users = (users || [])
                                .filter(function (user) {
                                    return user.IsAppAdmin
                                        || isEditor(user);
                                });
                })
                .catch(function (error) {
                    vm.error = true;
                });
        };

        /**
         * Determine if you have the appropriate role to edit users.
         * @param {type} user
         * @returns {type}
         */
        function isEditor(user) {
            return user
                && user.AppRoles
                && user.AppRoles["ChemApps-Editor"];
        }
    }
})();