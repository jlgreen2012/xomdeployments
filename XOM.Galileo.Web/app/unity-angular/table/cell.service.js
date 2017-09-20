(function () {
    'use strict';

    angular
        .module('unityAngular')
        .factory('cellService', cellService);

    //cellService.$inject = [];

    function cellService() {
        let service = {
            mapAttributes: mapAttributes
        };

        return service;

        ///////////////////////

        function mapAttributes(element, attrs, tableCtrl) {
            // Vertical-align
            if (tableCtrl.middle || attrs.hasOwnProperty('middle'))
                element.css('vertical-align', 'middle');

            // Text-align
            if (tableCtrl.center || attrs.hasOwnProperty('center'))
                element.addClass('em-u-text-align-center');
            else if (tableCtrl.left || attrs.hasOwnProperty('left'))
                element.addClass('em-u-text-align-left');
            else if (tableCtrl.right || attrs.hasOwnProperty('right'))
                element.addClass('em-u-text-align-right');
        }
    };
})();