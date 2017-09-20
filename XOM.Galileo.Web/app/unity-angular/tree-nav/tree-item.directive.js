(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTreeItem', treeItem);

    //treeItem.$inject = [];
    
    function treeItem() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/tree-nav/tree-item.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                //
            },
            controller: emTreeItem,
            controllerAs: 'vm',
            bindToController: true,
            require: '^^emTreeList'
        };
        return directive;

        //////////////////////////////////

        function emTreeItem() {
            let vm = this;

            vm.isActive = false;
            vm.children = [];
            vm.hasChildren = false;

            Object.defineProperty(vm, 'hasChildren', {
                get: function () {
                    return !!this.children.length;
                }
            });
        }

        function link(scope, element, attrs, emTreeListCtrl) {
            emTreeListCtrl.treeItems.push(scope.vm);
        }
    }
})();