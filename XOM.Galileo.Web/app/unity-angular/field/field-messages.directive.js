(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emFieldMessages', fieldMessages);

    //fieldMessages.$inject = [];
    
    function fieldMessages() {
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                'for': '@'
            },
            require: ['^^form', '^^?emField'],
            replace: true,
            templateUrl: 'app/unity-angular/field/field-messages.html'
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, ctrls) {
            let formCtrl = ctrls[0];
            let fieldCtrl = ctrls[1];

            if (!attrs.for)
                throw new Error('em-field-messages: attribute "for" is required');

            let vm = scope.vm = {
                // Expose the form.name model
                model: formCtrl[attrs.for],
                // Expose the emField Controller
                field: fieldCtrl,
                // Set the attributes existance as booleans for the vm
                required:   attrs.messages.includes('required'),
                number:     attrs.messages.includes('number'),
                min:        attrs.messages.includes('min'),
                minlength:  attrs.messages.includes('minlength'),
                maxlength:  attrs.messages.includes('maxlength'),
                unique:     attrs.messages.includes('unique')
            };
        }
    }
})();