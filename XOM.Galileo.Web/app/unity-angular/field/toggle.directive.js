(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emToggle', toggle);

    //toggle.$inject = [];
    
    function toggle() {
        var directive = {
            link: link,
            restrict: 'E',
            require: '^^?emField',
            scope: {
                //
            },
            controller: emToggle,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        //////////////////////////////////

        function emToggle() {
            //
        }

        function link(scope, element, attrs, fieldCtrl) {
            element.addClass('em-c-toggle');
            fieldCtrl.hasIcon = true;
        }
    }
})();