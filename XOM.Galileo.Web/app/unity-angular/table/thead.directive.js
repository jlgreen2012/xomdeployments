(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('thead', emThead);

    //emThead.$inject = [];

    function emThead() {
        var directive = {
            restrict: 'E',
            link: link,
            controller: thead,
            controllerAs: 'vm'
        };
        return directive;

        //////////////////////

        function thead() {
            //
        }

        function link(scope, element, attrs) {
            element.addClass('em-c-table__header');
            element.toggleClass('invert', attrs.hasOwnProperty('invert'));
        }
    }
})();