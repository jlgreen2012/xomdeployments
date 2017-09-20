(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('td', td);

    td.$inject = ['cellService'];

    function td(cellService) {
        var directive = {
            restrict: 'E',
            link: link,
            require: ['^^table', '^^?tbody', '^^?tfoot', '^^tr']
        };
        return directive;

        //////////////////////

        function link(scope, element, attrs, ctrls) {
            var tableCtrl = ctrls[0];
            var tbodyCtrl = ctrls[1];
            var tfootCtrl = ctrls[2];
            var trCtrl = ctrls[3];

            // Component class
            if (tbodyCtrl)
                element.addClass('em-c-table__cell');
            else if (tfootCtrl)
                element.addClass('em-c-table__footer-cell');

            // Parent cell
            if (trCtrl.isParent)
                element.addClass('em-c-table__cell--dropdown');

            // Utility attributes
            cellService.mapAttributes(element, attrs, tableCtrl);
        }
    }
})();