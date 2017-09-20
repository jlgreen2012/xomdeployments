(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTableHeader', tableObjectHeader);

    //tableObjectHeader.$inject = [];

    function tableObjectHeader() {
        var directive = {
            transclude: true,
            replace: true,
            restrict: 'E',
            link: link,
            templateUrl: 'app/unity-angular/table/table-object-header.html',
        };
        return directive;

        //////////////////////

        function link(scope, element, attrs) {
            //
        }
    }
})();