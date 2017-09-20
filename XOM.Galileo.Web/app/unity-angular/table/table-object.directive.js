(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTable', tableObject);

    //tableObject.$inject = [];

    function tableObject() {
        var directive = {
            scope: {
                //
            },
            transclude: true,
            replace: true,
            restrict: 'E',
            link: link,
            templateUrl: 'app/unity-angular/table/table-object.html',
            controller: emTable,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        //////////////////////

        function emTable() {
            //
        }

        function link(scope, element, attrs) {
            //
        }
    }
})();