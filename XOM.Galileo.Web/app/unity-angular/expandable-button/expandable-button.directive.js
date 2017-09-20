(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emExpandableButton', expandableButton);

    //expandableButton.$inject = [];
    
    function expandableButton() {
        var directive = {
            link: link,
            restrict: 'E',
            require: '^^?emFieldGroup',
            replace: true,
            transclude: true,
            scope: {
                label: '@',
                activeLabel: '@',
                isActive: '=?active'
                // plusIcon
                // small
                // primary
            },
            templateUrl: 'app/unity-angular/expandable-button/expandable-button.html',
            controller: emExpandableButton,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        //////////////////////////////////

        function emExpandableButton() {
            var vm = this;

            // Default isActive
            if (vm.isActive === undefined)
                vm.isActive = false;
        }

        function link(scope, element, attrs) {
            scope.vm.plusIcon = attrs.hasOwnProperty('plusIcon');
            scope.vm.small = attrs.hasOwnProperty('small');
            scope.vm.primary = attrs.hasOwnProperty('primary');
        }
    }
})();