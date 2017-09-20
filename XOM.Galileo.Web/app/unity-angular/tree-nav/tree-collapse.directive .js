(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emTreeCollapse', treeCollapse);

    //treeCollapse.$inject = [];
    
    function treeCollapse() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/tree-nav/tree-collapse.html',
            replace: true,
            restrict: 'E',
            scope: {
                //
            },
            require: '^^emTreeList'
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, emTreeListCtrl) {
            scope.vm = {
                collapsed: true
            };

            scope.vm.collapse = collapse;

            ///////////

            function collapse() {
                // Invert and store
                let collapsed = scope.vm.collapsed = !scope.vm.collapsed;

                // Apply to all items (inlcuding nested)
                collapseItems(emTreeListCtrl.treeItems);

                /////////

                function collapseItems(items) {
                    if (items && items.length)
                        angular.forEach(items, function (item) {
                            collapseItem(item);
                        });
                }

                function collapseItem(item) {
                    // Apply to nested items
                    if (item.children && item.children.length){
                        item.isActive = !collapsed;
                        collapseItems(item.children);
                    }
                }
            }
        }
    }
})();