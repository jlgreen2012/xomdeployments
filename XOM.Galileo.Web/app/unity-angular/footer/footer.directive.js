(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emFooter', footer);

    //footer.$inject = [];
    
    function footer() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/footer/footer.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                //
            }
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs) {
            //
        }
    }
})();