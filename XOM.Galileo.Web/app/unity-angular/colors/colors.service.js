(function () {
    'use strict';

    angular
        .module('unityAngular')
        .factory('emColors', emColorsService);

    //emColorsService.$inject = [];

    function emColorsService() {
        let service = {
            amber:          '#f2ac33',
            blue:           '#0c69b0',
            burgundy:       '#ad1723',
            cerise:         '#a71065',
            curiousBlue:    '#3190d9',
            cyan:           '#00a3e0',
            darkBlue:       '#233190',
            deepBlue:       '#111122',
            green:          '#00af53',
            indigo:         '#002f6c',
            lime:           '#b4d405',
            mediumGray:     '#545459',
            orange:         '#ed8b00',
            plum:           '#890c58',
            purple:         '#7a4183',
            red:            '#d82424',
            ruby:           '#b10040',
            seaBlue:        '#005f7f',
            turquoise:      '#00aca8',
            vermilion:      '#d93900',
            violet:         '#3a397b',
            yellow:         '#ffd700'
        };

        return service;
    };
})();