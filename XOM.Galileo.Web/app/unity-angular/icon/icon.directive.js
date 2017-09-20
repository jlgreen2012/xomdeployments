(function () {
    'use strict';

    angular
        .module('unityAngular')
        .directive('emIcon', icon);

    icon.$inject = ['emIconService'];

    function icon(emIconService) {
        var directive = {
            link: link,
            restrict: 'E',
            replace: true,
            templateUrl: 'app/unity-angular/icon/icon.html',
            scope: {
                src: '@',
                icon: '@is'
            },
            require: ['^^?emField', '^^?emTable']
        };
        return directive;

        /////////////////

        function link(scope, element, attrs, ctrls) {
            var fieldCtrl = ctrls[0];
            var tableCtrl = ctrls[1];

            scope.vm = {
                icon: scope.icon,
                href: (scope.src || 'images') + '/em-icons.svg#icon-' + scope.icon,
                isSmall: attrs.hasOwnProperty('small'),
                isField: !!fieldCtrl,
                isTable: !!tableCtrl
            };

            emIconService.run();
        }
    }

})();