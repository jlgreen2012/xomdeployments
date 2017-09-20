(function () {
    'use strict';

    angular
        .module('unityAngular')
        .factory('emFieldService', emFieldService);

    //emFieldService.$inject = [];

    function emFieldService() {
        let service = {
            setFieldWatch: setFieldWatch,
            setInputWatch: setInputWatch,
            setIconWatch: setIconWatch
        };

        return service;

        /////////////

        function setFieldWatch(scope, attrs, fieldGroupCtrl) {
            setWatch(
                scope,
                fieldGroupCtrl,
                'fieldGroupCtrl',
                attrs,
                ['valid', 'error', 'readonly', 'disabled'], // order may matter
                function (val, attr) {
                    scope.vm[attr] = val;
                });
        }

        function setInputWatch(scope, element, attrs, fieldCtrl) {
            setWatch(
                scope,
                fieldCtrl,
                'fieldCtrl',
                attrs,
                ['disabled', 'readonly'], // order may matter
                function (val) {
                    element.attr({
                        disabled: fieldCtrl.disabled || fieldCtrl.readonly
                    });
                });
        }

        function setIconWatch(scope, attrs, fieldCtrl) {
            setWatch(
                scope,
                fieldCtrl,
                'fieldCtrl',
                attrs,
                ['error', 'readonly', 'disabled'], // order may matter
                function (val, attr) {
                    scope.vm.showIcon = !fieldCtrl.error
                                     && !fieldCtrl.readonly
                                     && !fieldCtrl.disabled;
                });
        }

        function setWatch(scope, parentCtrl, parentCtrlName, elementAttributes, watchAttributes, watchCallback) {
            if (!angular.isObject(scope))
                throw new TypeError('emField: scope must be an object');
            if (!(parentCtrl === null || angular.isObject(parentCtrl)))
                throw new TypeError('emField: parentCtrl must be an object');
            if (!angular.isString(parentCtrlName))
                throw new TypeError('emField: parentCtrlName must be a string');
            if (!angular.isObject(elementAttributes))
                throw new TypeError('emField: elementAttributes must be an object');
            if (!angular.isArray(watchAttributes))
                throw new TypeError('emField: watchAttributes must be an array');
            if (!angular.isFunction(watchCallback))
                throw new TypeError('emField: watchCallback must be a function');

            if (parentCtrl) {
                // Store the parent controller
                scope[parentCtrlName] = parentCtrl;

                // Watch for each attribute change on parent required directive's controller
                angular.forEach(watchAttributes, function (attr) {
                    // Only set watch if undefined on emField
                    if (!elementAttributes.hasOwnProperty(attr))
                        scope.$watch(parentCtrlName + '.' + attr, function (val) {
                            watchCallback.call(this, val, attr);
                        });
                });
            }
        }
    };
})();