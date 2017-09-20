(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('label', label);

    //label.$inject = [];
    
    function label() {
        var directive = {
            link: link,
            restrict: 'E',
            require: ['^^?emField', '^^?emToggle'],
            scope: {
                //
            }
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, ctrls) {
            let fieldCtrl = ctrls[0];
            let toggleCtrl = ctrls[1];

            if (toggleCtrl)
                element.addClass('em-c-toggle__label');
            else if (fieldCtrl)
                element.addClass('em-c-field__label');
        }
    }
})();