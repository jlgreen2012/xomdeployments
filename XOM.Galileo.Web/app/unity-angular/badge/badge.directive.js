(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emBadge', badge);

    //badge.$inject = [];

    function badge() {
        var directive = {
            scope: {
                //
            },
            transclude: true,
            replace: true,
            restrict: 'E',
            link: link,
            templateUrl: 'app/unity-angular/badge/badge.html'
        };
        return directive;

        //////////////////////

        function link(scope, element, attrs) {
            scope.vm = {
                positive: attrs.hasOwnProperty('positive'),
                negative: attrs.hasOwnProperty('negative'),
                caution: attrs.hasOwnProperty('caution')
            };
        }
    }
})();