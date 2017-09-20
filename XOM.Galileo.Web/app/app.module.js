(function () {
    'use strict';

    /*eslint array-element-newline: ["error", "always"]*/

    angular.module('app', [
        // Angular modules
        'ngRoute',
        'ngAnimate',
        'ngMessages',
        'ngResource',
        'ngCookies',
        'ngSanitize',

        // 3rd party modules
        'angular-loading-bar',
        'angular-clipboard',
        'angular-momentjs',

        // Custom modules
		'unityAngular',
        'app.admin',
        'app.assessment',
        'app.team',
        'app.visualizations',
        'app.playbook'
    ]);

    // Group by method.
    Object.defineProperty(Array.prototype, 'group', {
        enumerable: false,
        value: function (key) {
            let map = {};
            this.map(e => ({ k: key(e), d: e })).forEach(e => {
                map[e.k] = map[e.k] || [];
                map[e.k].push(e.d);
            });
            return Object.keys(map).map(k => ({ key: k, data: map[k] }));
        }
    });
})();