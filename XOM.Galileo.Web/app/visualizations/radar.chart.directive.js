(function () {
    'use strict';

    angular
        .module('app.visualizations')
        .directive('pdRadarChart', RadarChartDirective);

    RadarChartDirective.$inject = ['$log', '$window'];

    /**
     * Directive to build and display a d3.js radar chart.
     * @param {type} $log
     * @param {type} $window
     * @returns {type}
     */
    function RadarChartDirective($log, $window) {
        var directive = {
            link: link,
            templateUrl: '/app/visualizations/radar.chart.html',
            restrict: 'A',
            scope: {
                // 'Some title'
                title: '@',

                // array of array of objects: { axis: 'myName', value: 45.3 }. order array with legend items.
                data: '=',

                // 300
                width: '@',

                // 300
                height: '@',

                // [{name: 'item 1', click: func}, {name:'item 2', click: func}] // func is the click event
                legend: '='
            }
        };
        return directive;

        /**
         * Link function.
         * @param {Object} scope
         * @param {Array} element
         * @param {Array} attrs
         */
        function link(scope, element, attrs) {
            // Changes to questions. Mostly used for initial load.
            scope.$watchCollection(
                function () {
                    return [
                        scope.data
                    ];
                }, function (newValue, oldValue) {
                    // if the data has changed or we need to recreate the graph, do so.
                    if (newValue !== oldValue) {
                        if (typeof scope.data !== "undefined" && scope.data !== null &&
                            typeof scope.data[0] !== "undefined" && scope.data[0].length > 0) {
                            console.log(scope);
                            createGraph();
                        }
                        else {
                            // Clear out the graph.
                            element[0].querySelector('#graph').innerHTML = "";
                            scope.data = null;
                        }
                    }
                });

            // Changes to screen size redraws the chart.
            angular.element($window).bind('resize', function () {
                if (typeof scope.data !== 'undefined' && scope.data !== null &&
                    typeof scope.data[0] !== "undefined" && scope.data[0].length > 0) {
                    createGraph();

                    // manual $digest required as resize event
                    // is outside of angular
                    scope.$digest();
                }
                else {
                    $log.warn('Radar chart data is undefined.');
                }

            });

            /*
             * Chart Configurations.
             *
             * Default configuration:
                var cfg = {
                    radius: 5,
                    w: 600,
                    h: 600,
                    factor: 1,
                    factorLegend: .85,
                    levels: 3,
                    maxValue: 0,
                    radians: 2 * Math.PI,
                    opacityArea: 0.5,
                    ToRight: 5,
                    TranslateX: 80,
                    TranslateY: 30,
                    ExtraWidthX: 100,
                    ExtraWidthY: 100,
                    color: d3.scale.category10()
                };
            */

            // Override config settings.
            // Add to scope as necessary.
            var myCfg = {
                levels: 10,
                maxValue: 1,
                ExtraWidthX: 200,

                // extra width / 2 i think. need to make responsive.
                TranslateX: (200) / 2
            };

            /**
             * Create the graph from our configuration.
             */
            function createGraph() {
                // Set our height and width after we load.
                var windowWidth = element[0].clientWidth;
                if (windowWidth <= 0) {
                    return;
                }
                else if (windowWidth - myCfg.ExtraWidthX < 0) {
                    myCfg.w = windowWidth;
                }
                else if (windowWidth - myCfg.ExtraWidthY < 0) {
                    myCfg.h = windowWidth;
                }
                else {
                    myCfg.w = element[0].clientWidth - myCfg.ExtraWidthX;
                    myCfg.h = element[0].clientWidth - myCfg.ExtraWidthX;
                }

                // Creat the chart.
                RadarChart.draw("#graph", scope.data, myCfg); // eslint-disable-line no-undef

                // Setup our click events.
                if (typeof scope.legend !== "undefined" && scope.legend !== null && scope.legend.length > 0) {
                    // Get all legend text elements.
                    var legendItems = element[0].querySelectorAll("text.legend"),
                        thisItem;

                    // For each legend item found with matching text, set up our click bind.
                    angular.forEach(scope.legend, function (l) {
                        thisItem = [...legendItems].filter(e => e.textContent === l.name || e.textContent === l.name + ' (NA)');
                        angular.forEach(thisItem, function (i) {
                            angular.element(i).bind('click', l.click);
                        });
                    });
                }
            }
        }
    }
})();