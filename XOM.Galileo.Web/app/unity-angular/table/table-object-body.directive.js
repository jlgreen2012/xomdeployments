(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTableBody', tableObjectBody);

    //tableObjectBody.$inject = [];

    function tableObjectBody() {
        var directive = {
            transclude: true,
            replace: true,
            restrict: 'E',
            link: link,
            templateUrl: 'app/unity-angular/table/table-object-body.html',
        };
        return directive;

        //////////////////////

        function link(scope, element, attrs) {
            //
        }
    }
})();