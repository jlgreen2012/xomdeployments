(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('tr', emTr);

    //emTr.$inject = [];

    function emTr() {
        var directive = {
            restrict: 'E',
            link: link,
            require: ['^^?thead', '^^?tbody', '^^?tfoot'],
            controller: tr,
            controllerAs: 'vm'
        };
        return directive;

        //////////////////////

        tr.$inject = ['$scope', '$element', '$attrs'];

        function tr($scope, $element, $attrs) {
            var vm = this;

            vm.isParent = $attrs.hasOwnProperty('parent');
        }

        function link(scope, element, attrs, ctrls) {
            var theadCtrl = ctrls[0];
            var tbodyCtrl = ctrls[1];
            var tfootCtrl = ctrls[2];

            // Component class
            if (theadCtrl)
                element.addClass('em-c-table__header-row');
            else if (tbodyCtrl)
                element.addClass('em-c-table__row');
            else if (tfootCtrl)
                element.addClass('em-c-table__footer-row');

            // Group utility
            if (tbodyCtrl)
                if (attrs.hasOwnProperty('parent'))
                    tbodyCtrl.parent = element;
                else if (attrs.hasOwnProperty('children'))
                    tbodyCtrl.addChild(element);
        }
    }
})();