(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emFieldNote', fieldNote);

    //fieldNote.$inject = [];
    
    function fieldNote() {
        var directive = {
            link: link,
            restrict: 'E',
            require: '^^?emField',
            replace: true,
            scope: {
                //
            }
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs) {
            element.addClass('em-c-field__note');
        }
    }
})();