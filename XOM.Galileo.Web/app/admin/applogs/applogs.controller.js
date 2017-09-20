(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('ApplicationLogsController', ApplicationLogsController);

    ApplicationLogsController.$inject = ['$q', 'applicationLogsService', '$log'];

    /**
     * Controller to manage application logs.
     * @param {$q} $q
     * @param {factory} applicationLogsService
     * @param {$log} $log
     */
    function ApplicationLogsController($q, applicationLogsService, $log) {
        var vm = this;
        vm.logs = [];
        vm.error = false;
        vm.loading = false;

        activate();

        /**
         * Initialize controller.
         */
        function activate() {
            // Retrieves all production lines with their CPRs for the current year then updates locks
            applicationLogsService
                .get()
                .then(function (logs) {
                    vm.logs = logs;

                    for (var i = 0; i < logs.length; i++) {
                        var sessionDetails = vm.logs[i].SessionDetails || '{}';

                        sessionDetails = replaceAll(sessionDetails, "''", "\"");
                        sessionDetails = sessionDetails.replace(/\\/g, "\\\\");
                        sessionDetails = sessionDetails.replace("Username", "\"Username\"");
                        sessionDetails = sessionDetails.replace("Session", "\"Session\"");

                        vm.logs[i].SessionDetails = JSON.parse(sessionDetails);
                    }

                    vm.loading = false;
                })
                .catch(function (error) {
                    vm.error = true;
                    $log.info(error);
                });
        };
    }

    /**
     * Replaces all instances of a string.
     * @param {String} str
     * @param {String} find
     * @param {String} replace
     * @returns {String}
     */
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
})();