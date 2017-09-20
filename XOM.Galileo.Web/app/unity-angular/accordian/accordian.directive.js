(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emAccordian', accordianItem);

    function accordianItem() {
        var directive = {
            scope: {
                title: '@',
                isOpen: '='
            },
            transclude: true,
            replace: true,
            restrict: 'A',
            templateUrl: 'app/unity-angular/accordian/accordian.item.html',
            link: link
        };
        return directive;

        //////////////////////

        function link(scope, element, attrs) {
        }
    }
})();