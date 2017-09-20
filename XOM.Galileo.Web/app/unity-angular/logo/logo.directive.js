(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emLogo', logo);

    //logo.$inject = [];
    
    function logo() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/logo/logo.html',
            restrict: 'E',
            replace: true,
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