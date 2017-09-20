(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTreeList', treeList);

    //treeList.$inject = [];
    
    function treeList() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/tree-nav/tree-list.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                //
            },
            controller: emTreeList,
            controllerAs: "vm",
            bindToController: true,
            require: "^^?emTreeItem"
        };
        return directive;

        //////////////////////////////////
        function emTreeList() {
            let vm = this;

            let treeItems = [];

            vm.treeItems = [];

            Object.defineProperty(vm, 'treeItems', {
                get: function () {
                    return treeItems;
                }
            });
        }

        function link(scope, element, attrs, emTreeItemCtrl) {
            if (emTreeItemCtrl) {
                emTreeItemCtrl.children = scope.vm.treeItems;
                scope.vm.parent = emTreeItemCtrl;
            }
            else
                scope.vm.isTop = true;
        }
    }
})();