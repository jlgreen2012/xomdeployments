(function () {
    'use strict';

    angular
        .module('app')
        .factory('AppLog', AppLogModel);

    AppLogModel.$inject = [];

    /**
     * Js object representing an Application Log.
     * @returns {Object}
     */
    function AppLogModel() {
        return AppLog;

        /**
         * Create a new app log object based on another object.
         * @param {Object} baseObj
         * @returns {Object}
         */
        function AppLog(baseObj) {
            let instance = this;

            if (!angular.isObject(baseObj))
                baseObj = {};

            angular.extend(instance, {
                Id: baseObj.Id,
                EventId: baseObj.EventId,
                Timestamp: baseObj.Timestamp,
                Source: baseObj.Source,
                SessionDetails: baseObj.SessionDetails,
                Message: baseObj.Message,
                Level: baseObj.Level,
                ExceptionMessage: baseObj.ExceptionMessage
            });

            return instance;
        }
    }
})();