(function () {
    'use strict';

    angular
        .module('app.playbook')
        .directive('pbCommitment', Commmitment);

    Commmitment.$inject = ['$log', 'playbookDataService', '$timeout'];

    /**
     * Directive for status/progress visualization within wizard.
     * @param {$log} $log
     * @param {playbookDataService} playbookDataService
     * @param {$timeout} $timeout
     * @returns {Object}
     */
    function Commmitment($log, playbookDataService, $timeout) {
        var directive = {
            link: link,
            templateUrl: function (element, attrs) {
                return attrs.templateUrl || 'app/playbook/commitment/partials/list.table.html';
            },
            restrict: 'A',
            scope: {
                commitment: '=',
                playbookId: '@'
            },
            require: '^ngController'
        };
        return directive;

        /**
         * Link function
         * @param {Object} scope
         * @param {Array} element
         * @param {Array} attrs
         * @param {Object} ctrl
         */
        function link(scope, element, attrs, ctrl) {
            // Methods.
            scope.showDeleteModal = false;
            scope.remove = remove;
            scope.cancelRemove = cancelRemove;
            scope.confirmRemove = confirmRemove;
            scope.edit = edit;
            scope.getStatusDisplayName = getStatusDisplayName;

            scope.canEdit = ctrl.canEditPlaybook;

            /**
             * Gets the display name for the status given the status value.
             * @param {String} status
             * @returns {String}
             */
            function getStatusDisplayName(status) {
                var statusObj = ctrl.statuses.find(function (s) {
                    return s.value === status;
                });
                return statusObj.display;
            }

            /**
             * Show confirmation modal.
             */
            function remove() {
                scope.showDeleteModal = true;
            };

            /**
             * Closes the delete modal.
             */
            function cancelRemove() {
                scope.showDeleteModal = false;
            };

            /**
             * Deletes this commitment.
             */
            function confirmRemove() {
                ctrl.remove(scope.commitment)
                    .then(function (response) {
                        scope.commitment = null;
                    })
                    .finally(function () {
                        scope.showDeleteModal = false;
                    });
            };

            /**
             * Make the fields editable.
             */
            function edit() {
                // Update view.
                ctrl.showEditCommitmentForm(scope.commitment);
            };
        }
    }
})();