(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTreeNav', treeNav);

    //treeNav.$inject = [];
    
    function treeNav() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/tree-nav/tree-nav.html',
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
            if (attrs.hasOwnProperty('fullWidth'))
                element.css('max-width', 'none');
        }
    }
})();