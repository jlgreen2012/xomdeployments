(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emFieldGroup', fieldGroup);

    //fieldGroup.$inject = [];
    
    function fieldGroup() {
        var directive = {
            link: link,
            controller: emFieldGroup,
            controllerAs: 'vm',
            bindToController: true,
            restrict: 'E',
            scope: {
                valid: '=?',
                error: '=?',
                readonly: '=?',
                disabled: '=?'
            }
        };
        return directive;

        //////////////////////////////////

        function emFieldGroup() {
            let vm = this;
        }

        function link(scope, element, attrs) {
            //
        }
    }
})();