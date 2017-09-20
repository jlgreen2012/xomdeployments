(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emLoader', loader);

    loader.$inject = [];

    function loader() {
        var directive = {
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: 'app/unity-angular/loader/loader.html',
            scope: {
                size: '@',
                type: '@',
                // absolute     <--
                // center       <-- those affect css only
                // middle       <--
            }
        };
        return directive;

        /////////////////

        function link(scope, element, attrs) {
            // Default size
            if (!scope.size)
                scope.size = '50px';

            // Apply size
            element.css({
                height: scope.size,
                width: scope.size
            });
        }
    }

})();