(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('input', input);

    input.$inject = ['emFieldService'];
    
    function input(emFieldService) {
        var directive = {
            link: link,
            restrict: 'E',
            require: ['^^?emField', '^^?emToggle', '^^?emDatePicker']
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, ctrls) {
            let fieldCtrl = ctrls[0];
            let toggleCtrl = ctrls[1];
            let datePickerCtrl = ctrls[2];

            element.addClass('em-c-input');

            // Classes depending on inherited controller
            if (toggleCtrl)
                element.addClass('em-c-toggle__input em-u-is-vishidden');
            else if (datePickerCtrl)
                new Pikaday({
                    field: element[0],
                    format: datePickerCtrl.dateFormat || 'MM-DD-YYYY',
                    minDate: datePickerCtrl.minDate || new Date(),
                    maxDate: datePickerCtrl.maxDate || new Date().setYear(new Date().getYear() + 2),
                    
                    onSelect: datePickerCtrl.onSelect
                });

            // Watch for each attribute change on emField if undefined on input
            emFieldService.setInputWatch(scope, element, attrs, fieldCtrl);
        }
    }
})();