(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emFieldBody', fieldBody);

    //fieldBody.$inject = [];
    
    function fieldBody() {
        var directive = {
            link: link,
            restrict: 'E',
            require: '^^emField',
            replace: true,
            scope: {
                //
            },
            transclude: true,
            templateUrl: 'app/unity-angular/field/field-body.html'
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, fieldCtrl) {
            // Inherit controller as 'vm' (but not as prototype so it's the same object)
            scope.vm = fieldCtrl;
        }
    }
})();