(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('th', th);

    th.$inject = ['cellService'];

    function th(cellService) {
        var directive = {
            restrict: 'E',
            link: link,
            require: '^^table'
        };
        return directive;

        //////////////////////

        function link(scope, element, attrs, tableCtrl) {
            // Component class
            element.addClass('em-c-table__header-cell');

            // Utility attributes
            cellService.mapAttributes(element, attrs, tableCtrl);
        }
    }
})();