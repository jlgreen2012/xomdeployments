(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emDatePicker', datePicker);

    datePicker.$inject = ['emFieldService'];

    function datePicker(emFieldService) {
        var directive = {
            scope: {
                name: '@',
                model: '=',
                minDate: '@',
                maxDate: '@',
                dateFormat: '@',
                showIcon: '@',
                onSelect: '&'
            },
            restrict: 'E',
            require: '^^?emField',
            link: link,
            templateUrl: 'app/unity-angular/date-picker/date-picker.html',
            controller: emDatePicker,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        //////////////////////
        function emDatePicker($scope) {

        }
        function link(scope, element, attrs, fieldCtrl) {           

            emFieldService.setIconWatch(scope, attrs, fieldCtrl);

            // Show calendar icon only when not showing another
            //scope.vm.showIcon = !fieldCtrl.error
            //                 && !fieldCtrl.readonly
            //                 && !fieldCtrl.disabled;

            scope.vm.showIcon = scope.showIcon || true;

        }
    }
})();