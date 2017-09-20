(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emLoaderOverlay', loaderOverlay);

    loaderOverlay.$inject = [];

    function loaderOverlay() {
        var directive = {
            link: link,
            restrict: 'C'
        };
        return directive;

        /////////////////

        function link(scope, element, attrs) {
            // prevent clicking on anything.
            //element.bind('click', function ($event) {
            //    $event.preventDefault();
            //});
        }
    }

})();