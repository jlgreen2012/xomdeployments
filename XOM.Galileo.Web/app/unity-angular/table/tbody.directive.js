(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('tbody', emTbody);

    //emTbody.$inject = [];

    function emTbody() {
        var directive = {
            restrict: 'E',
            link: link,
            controller: tbody,
            controllerAs: 'vm'
        };
        return directive;

        //////////////////////

        function tbody() {
            var vm = this;

            // Private
            var parent;
            var children = [];
            var open = open;
            var isOpen = false;

            // Public
            vm.parent;
            vm.addChild = addChild;

            // Parent setter
            Object.defineProperty(vm, 'parent', {
                set: function (settingParent) {
                    if (parent)
                        throw new Error('tbody Directive: cannot have more than one <tr [parent]> per <tbody>');

                    parent = settingParent;
                    parent.on('click', open);
                }
            });

            function addChild(child) {
                children.push(child);
                child.addClass('em-c-table__row--secondary');
            }

            function open() {
                // Invert opened
                isOpen = !isOpen;

                // Toggle parent
                parent.toggleClass('em-is-open', isOpen);

                // Toggle each child
                angular.forEach(children, function (child) {
                    child.toggleClass('em-is-visible', isOpen);
                });
            }
        }

        function link(scope, element, attrs) {
            element.addClass('em-c-table__body');
        }
    }
})();