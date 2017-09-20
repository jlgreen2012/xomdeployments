(function () {
    'use strict';

    angular
        .module('app')
        .directive('headerNav', headerNav);

    headerNav.$inject = ['$document', 'authService', ];

    /**
     * Directive to create the application header and navigation.
     * @param {$document} $document
     * @param {factory} authService
     * @returns {Object}
     */
    function headerNav($document, authService) {
        var directive = {
            link: link,
            templateUrl: 'app/components/header-nav.html',
            replace: true,
            restrict: 'E',
            scope: {
                appTitle: '@'
            }
        };
        return directive;

        //////////////////////////////////

        /**
         * Link function.
         * @param {Object} scope
         * @param {Array} element
         * @param {Array} attrs
         */
        function link(scope, element, attrs) {
            scope.navItems = [];
            scope.menu = false;
            scope.userName = null;
            getCurrentUser();

            scope.select = select;
            scope.showMenu = showMenu;
            checkAdminRights();

            ////////////

            var adminSubItems = [
                { title: 'Error Logs', href: '#/admin/errors' }
            ];

            scope.navItems = [
                { title: 'Assessments', href: '/#/assessments' },
                { title: 'Playbooks', href: '/#/playbooks' },
                { title: 'Admin', subItems: adminSubItems }
            ];

            /**
             * Determines if the current user is an administrator.
             * @returns {Boolean} true if admin
             */
            function checkAdminRights() {
                //checking rights
                return authService
                    .isAdmin()
                    .then(function (isAppAdmin) {
                        //admin rights checked
                        for (var item in scope.navItems) {
                            if (scope.navItems[item].title == 'Admin') {
                                scope.navItems[item].hide = !isAppAdmin;
                            }
                        }
                        return isAppAdmin;
                    }, function (error) {
                        //Admin Authentication Error
                        return false;
                    })
            }

            /**
             * Toggles showing the menu.
             * TODO: separate this into it's own directive
             */
            function showMenu() {
                scope.menu = !scope.menu;
                $document.find('body').toggleClass('em-is-disabled-small', scope.menu);
            }

            /**
             * Actions to take when a menu item is selected.
             * TODO: separate this into it's own directive
             * @param {type} navItem
             */
            function select(navItem) {
                let isActive = !navItem.active;

                angular.forEach(scope.navItems, function (item) {
                    item.active = false;
                });

                navItem.active = isActive;

                // Attach document click to hide select
                if (navItem.active)
                    $document.on('click', clickHandler);

                /**
                 * Event handler when menu item is clicked.
                 * @param {type} event
                 */
                function clickHandler(event) {
                    if (event.target.classList.contains('em-c-primary-nav__link'))
                        return;

                    select({ active: true });
                    scope.$apply();

                    $document.off('click', clickHandler);
                }
            }

            /**
             * Sets the user display name based on the current logged in user.
             */
            function getCurrentUser() {
                authService.getCurrentUser()
                    .then(function (data) {
                        scope.userName = data.FullName;
                    });
            }
        }
    }
})();