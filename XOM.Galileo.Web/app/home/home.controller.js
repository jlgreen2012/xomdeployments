(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = [];

    /**
     * Controller responsible for all home page interactions.
     */
    function HomeController() {
        var vm = this;

        // Supporting links.
        vm.links = [];

        activate();

        /////////////////////

        /**
         * Initializes controller.
         */
        function activate() {
            vm.links = [];
        }
    }
})();