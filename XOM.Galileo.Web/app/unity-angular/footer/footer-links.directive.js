(function() {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emFooterLinks', footerLinks);

    //footerLinks.$inject = [];
    
    function footerLinks() {
        var directive = {
            link: link,
            templateUrl: 'app/unity-angular/footer/footer-links.html',
            replace: true,
            transclude: true,
            restrict: 'E',
            scope: {
                type: '@'
            },
            controller: emFooterLinks,
            controllerAs: 'vm',
            bindToController: true
        };
        return directive;

        //////////////////////////////////

        function emFooterLinks() {
            //
        }

        function link(scope, element, attrs) {
            //
        }
    }
})();