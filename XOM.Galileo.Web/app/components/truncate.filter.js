(function () {
    'use strict';

    angular
        .module('app')
        .filter('truncate', Truncate);

    Truncate.$inject = [];

    /**
     * Filter to display text as truncated if it's too long.
     * @returns {String}
     */
    function Truncate() {
        return function (text, length, end) {
            if (isNaN(length))
                length = 10;

            if (typeof end === "undefined")
                end = "...";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            } else {
                return String(text).substring(0, length - end.length) + end;
            }
        };
    }
})();