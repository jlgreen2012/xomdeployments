(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('textarea', textarea);

    textarea.$inject = ['emFieldService'];
    
    function textarea(emFieldService) {
        var directive = {
            link: link,
            restrict: 'E',
            require: '^^?emField'
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs, fieldCtrl) {
            element.addClass('em-c-select');

            // Watch for each attribute change on emField if undefined on textarea
            emFieldService.setInputWatch(scope, element, attrs, fieldCtrl);
        }
    }
})();