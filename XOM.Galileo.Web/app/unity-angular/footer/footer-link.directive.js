(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emFooterLink', footerLink);

    //footerLink.$inject = [];
    
    function footerLink() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/footer/footer-link.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                href: '@'
            }
        };
        return directive;

        //////////////////////////////////

        function link(scope, element, attrs) {
            //
        }
    }
})();