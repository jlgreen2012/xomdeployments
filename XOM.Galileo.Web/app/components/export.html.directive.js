(function () {
    'use strict';

    angular
        .module('app')
        .directive('pbExportHtml',ExportHtml);

    ExportHtml.$inject = ['$log', '$timeout'];

    /**
     * Exports an html element as a pdf file.
     * @returns {Object} directive definition
     */
    function ExportHtml($log, $timeout) {
        
        var directive = {
            restrict: 'A',
            scope: {
                fileName: '@',
                readyToDownload: '=',
                isLoading: '='
            },
            link: link
        };
        return directive;

        /**
         * Directive link function to be executed on initialization.
         * @param {$scope} scope
         * @param {Object} element
         * @param {Array} attr
         */
        function link (scope, element, attr) {

            /**
             * Watches for changes to the readToDownload indicator. Executes export when ready.
             * @param {Boolean} newValue
             * @param {Boolean} oldValue
             */
            scope.$watch('readyToDownload', function (newValue, oldValue) {
                if (newValue !== oldValue && newValue === true) {
                    $log.debug('ready to download');

                    // add a short delay to allow rendering to finish.
                    $timeout(function () {
                        exportToPdf();
                    }, 1500);
                }
            });

            /**
             * Downloads a pdf file with the content of the element.
             */
            function exportToPdf() {
                scope.isLoading = true;

                $log.debug('benchmark - export to pdf - start');
                html2canvas(element, {
                    onrendered: function (canvas) {
                        $log.debug('benchmark - export to pdf - onrendered');

                        var imgData = canvas.toDataURL('image/png');
                        $log.debug('benchmark - export to pdf - converted canvas');

                        var doc = new jsPDF('p', 'mm');
                        $log.debug('benchmark - export to pdf - created jspdf doc');

                        var imgWidth = doc.internal.pageSize.width; //210;
                        $log.debug('benchmark - export to pdf - imgWidth');

                        var pageHeight = doc.internal.pageSize.height; //295;
                        $log.debug('benchmark - export to pdf - pageHeight');

                        var imgHeight = canvas.height * imgWidth / canvas.width;
                        $log.debug('benchmark - export to pdf - imgHeight');

                        var heightLeft = imgHeight;
                        $log.debug('benchmark - export to pdf - heightLeft');

                        var position = 0;
                        $log.debug('benchmark - export to pdf - position');

                        // addimage(imageData, format, x, y, w, h, alias, compression, rotation)
                        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                        $log.debug('benchmark - export to pdf - added first image');

                        heightLeft -= pageHeight;

                        while (heightLeft >= 0) {
                            $log.debug('benchmark - export to pdf - adding page');

                            position = heightLeft - imgHeight;
                            doc.addPage();
                            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                            heightLeft -= pageHeight;
                        }

                        $log.debug('benchmark - export to pdf - saving');
                        doc.save(scope.fileName);

                        scope.isLoading = false;
                        scope.$apply();
                        $log.debug('benchmark - export to pdf - done');
                    }
                });
            }
        }
    }
})();

