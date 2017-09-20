(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('select', select);

    select.$inject = ['emFieldService'];
    
    function select(emFieldService) {
        var directive = {
            link: link,
            restrict: 'E',
            require: '^^?emField'
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, fieldCtrl) {
            element.addClass('em-c-select');

            if (fieldCtrl !== null) {
                fieldCtrl.hasIcon = true;
            }

            // Watch for each attribute change on emField if undefined on select
            emFieldService.setInputWatch(scope, element, attrs, fieldCtrl);
        }
    }
})();