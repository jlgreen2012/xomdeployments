(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTreeLink', treeLink);

    //treeLink.$inject = [];
    
    function treeLink() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/tree-nav/tree-link.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                //
            },
            require: '^^emTreeItem'
        };
        return directive;
        
        //////////////////////////////////

        function link(scope, element, attrs, emTreeItemCtrl) {
            scope.vm = {
                item: emTreeItemCtrl
            };
        }
    }
})();