(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('table', emTable);

    //emTable.$inject = [];

    function emTable() {
        var directive = {
            restrict: 'E',
            link: link,
            controller: table,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        //////////////////////

        table.$inject = ['$attrs'];

        function table($attrs) {
            var vm = this;

            angular.extend(vm, {
                middle: $attrs.hasOwnProperty('middle'),
                center: $attrs.hasOwnProperty('center'),
                left: $attrs.hasOwnProperty('left'),
                right: $attrs.hasOwnProperty('right')
            });
        }

        function link(scope, element, attrs) {
            element.addClass('em-c-table');
            element.toggleClass('em-c-table--condensed', attrs.hasOwnProperty('condensed'));
            element.toggleClass('em-c-table--striped', attrs.hasOwnProperty('striped'));
            element.toggleClass('vertical-striped', attrs.hasOwnProperty('verticalStriped'));
        }
    }
})();