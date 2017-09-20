(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTableFooter', tableObjectFooter);

    //tableObjectFooter.$inject = [];

    function tableObjectFooter() {
        var directive = {
            transclude: true,
            replace: true,
            restrict: 'E',
            link: link,
            templateUrl: 'app/unity-angular/table/table-object-footer.html',
        };
        return directive;

        //////////////////////

        function link(scope, element, attrs) {
            //
        }
    }
})();