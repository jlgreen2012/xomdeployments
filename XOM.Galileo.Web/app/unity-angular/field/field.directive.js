(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emField', field);

    field.$inject = ['emFieldService'];
    
    function field(emFieldService) {
        var directive = {
            link: link,
            restrict: 'E',
            require: '^^?emFieldGroup',
            replace: true,
            transclude: true,
            scope: {
                valid: '=?',
                error: '=?',
                readonly: '=?',
                disabled: '=?'
            },
            templateUrl: 'app/unity-angular/field/field.html',
            controller: emField,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        //////////////////////////////////

        function emField() {
            //
        }

        function link(scope, element, attrs, fieldGroupCtrl) {
            // Watch for each attribute change on emFieldGroup if undefined on emField
            emFieldService.setFieldWatch(scope, attrs, fieldGroupCtrl);
        }
    }
})();