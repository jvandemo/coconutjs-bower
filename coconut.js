/**
 * @license CoconutJS
 * (c) 2013 Jurgen Van de Moere http://coconutjs.org
 * License: MIT
 * @author Jurgen Van de Moere
 */
(function(window, document) {

/* jshint -W097 */ // Prevent jshint complaining about using function form of "use strict"
'use strict';

// Create all modules and define dependencies to make sure they exist
// and are loaded in the correct order to satisfy dependency injection
// before all nested files are concatenated by Grunt

// Config
angular.module('ccnut.config', []);

// Core
angular.module('ccnut.core.directives', []);
angular.module('ccnut.core.filters', []);
angular.module('ccnut.core.services', []);
angular.module('ccnut.core',
    [
        'ccnut.config',
        'ccnut.core.filters',
        'ccnut.core.services',
        'ccnut.core.directives'
    ]);

// Bootstrap
angular.module('ccnut.bootstrap.directives', []);
angular.module('ccnut.bootstrap',
    [
        'ccnut.bootstrap.directives'
    ]);

// jQuery UI
angular.module('ccnut.jquery-ui.directives', []);
angular.module('ccnut.jquery-ui',
    [
        'ccnut.jquery-ui.directives'
    ]);

// Coconut
angular.module('ccnut',
    [
        'ccnut.config',
        'ccnut.core',
        'ccnut.bootstrap',
        'ccnut.jquery-ui'
    ]
);


// Module specific configuration
angular.module('ccnut.config')

    .value('ccnut.config', {
        debug: true
    });

/**
 * @ngdoc directive
 * @name core.directive:ccnutInitTransclude
 *
 * @description
 * Directive to initialize transcluded expression
 *
 * This will result in "code" being executed before the linking functions are
 * called and allows for easier writing of complex expressions than ng-init.
 *
 * Useful for bootstrapping data.
 *
 * @example
 <doc:example>
 <doc:source>
 <script>
 function Ctrl($scope) {
    $scope.doSomething = function() {
        console.log('Do something');
    };
}
 </script>
 <div ng-controller="Ctrl">
 <div ccnut-init-transclude>
 doSomething();
 </div>
 </div>
 </doc:source>
 </doc:example>
 */
angular.module('ccnut.core.directives')
    .directive('ccnutInitTransclude', function () {
        var directiveDefinitionObject = {
            restrict: 'AC',
            compile: function () {
                return {
                    pre: function (scope, iElement, iAttrs) {
                        scope.$eval(iElement.text());
                    }
                };
            }
        };
        return directiveDefinitionObject;
    });/**
 * @ngdoc directive
 * @name core.directive:ccnutReplace
 *
 * @description
 * Replace substrings
 *
 * @param {object=} ccnutReplace Object whose keys are replaced by it's values
 *
 * @example
 <doc:example>
 <doc:source>
 <script>
 function Ctrl($scope) {
    $scope.user = {
        name: 'Jurgen'
    };
}
 </script>
 <div ng-controller="Ctrl">
 <span ccnut-replace="{'%name%': user.name}">Hello %name%</span>
 </div>
 </doc:source>
 </doc:example>
 */

angular.module('ccnut.core.directives')
    .directive('ccnutReplace', ['ccnut.config', 'logger', function (ccnutConfig, logger) {
        return {
            restrict: 'AC',
            link: function (scope, iElement, iAttrs) {

                try {

                    // Evaluate replacements in scope so expressions can be used
                    var replacements = scope.$eval(iAttrs.ccnutReplace);

                    // Handle invalid replacements
                    if (!angular.isObject(replacements)) {
                        return;
                    }

                    // Get original html
                    var html = iElement.html();

                    // Perform replacements
                    angular.forEach(replacements, function (to, from) {
                        if (to) {

                            // Convert to regular expression for global replacement
                            var regex = new RegExp(from, "g");
                            html = html.replace(regex, to);
                        }
                    });

                    // Replace html with new html
                    iElement.html(html);

                } catch (err) {

                    // Do nothing
                    logger.log(err);
                }
            }
        };
    }]);// Module specific configuration
angular.module('ccnut.core.directives');// Module specific configuration
angular.module('ccnut.core.filters');// Module specific configuration
angular.module('ccnut.core');

/**
 * @ngdoc object
 * @name core.service:logger
 * @requires $log
 *
 * @description
 * Simple service for logging. Default implementation writes the message
 * into the browser's console (if present).
 *
 * The main purpose of this service is to simplify debugging and troubleshooting.
 *
 * This service proxies all methods to the AngularJS $log service and offers
 * one extra method: dir.
 *
 * The dir method can be used to hierarchically display object properties.
 *
 * @example
 <example>
 <file name="script.js">
 function LogCtrl($scope, logger) {
         $scope.logger = logger;
         $scope.message = 'Hello World!';
       }
 </file>
 <file name="index.html">
 <div ng-controller="LogCtrl">
 <p>Reload this page with open console, enter text and hit the log button...</p>
 Message:
 <input type="text" ng-model="message"/>
 <button ng-click="logger.log(message)">log</button>
 <button ng-click="logger.warn(message)">warn</button>
 <button ng-click="logger.info(message)">info</button>
 <button ng-click="logger.error(message)">error</button>
 <button ng-click="logger.dir(message)">dir</button>
 </div>
 </file>
 </example>
 */

angular.module('ccnut.core.services')
    .factory('logger', ['$log', 'ccnut.config', function ($log, ccnutConfig) {

        // Create service
        var service = {};

        // Proxy regular methods to $log
        angular.forEach(['log', 'info', 'warn', 'error'], function(method){
            service[method] = function(){
                return $log[method](arguments);
            };
        });


        // Add dir method to hierarchically display objects
        service.dir = function (obj, title) {
            if (window.console) {
                if (angular.isDefined(title)) {
                    $log.info(title + ':');
                }
                window.console.dir(obj);
            }
        };

        return service;
    }]);// Module specific configuration
angular.module('ccnut.core.services');/**
 * @ngdoc object
 * @name core.service:queryStringParser
 *
 * @description
 * Simple service for parsing the query string and getting quary string parameters.
 *
 * @example
 <example>
 <file name="script.js">
 function LogCtrl($scope, queryStringParser) {
         var value = queryStringParser('param');
         console.log(value);
       }
 </file>
 <file name="index.html">
 <div ng-controller="LogCtrl">
 <p>Add a query string parameter e.g. ?param=someValue to the url and view the console...</p>
 </div>
 </file>
 </example>
 */

angular.module('ccnut.core.services')
    .factory('queryStringParser', ['logger', 'ccnut.config', function (logger, ccnutConfig) {

        // Create service
        var service = {};

        service.getQueryString = function () {
            return location.search;
        };

        // Proxy regular methods to $log
        service.getParam = function (name, defaultValue) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(this.getQueryString());
            if (defaultValue === null) {
                defaultValue = "";
            }
            return results === null ? defaultValue : decodeURIComponent(results[1].replace(/\+/g, " "));
        };

        return service;
    }]);/**
 * @ngdoc directive
 * @name bootstrap.directive:ccnutBsTooltip
 *
 * @description
 * Creates a tooltip on an element.
 *
 * Accepts an optional object with keys and values that are passed to the Twitter Bootstrap Tooltip plugin.
 *
 * See [Twitter Bootstrap Tooltip](http://twitter.github.io/bootstrap/javascript.html#tooltips) for a list of supported options.
 *
 * @param {object=} ccnutBsTooltip Object with key value pairs that are conform with Twitter Bootstrap tooltip options
 *
 * Testje
 *
 * @example
 <doc:example>
 <doc:source>
 <script>
 function Ctrl($scope) {}
 </script>
 <div ng-controller="Ctrl">
 <span ccnut-bs-tooltip="{'title': 'Hello world'}">Hover me</span>
 </div>
 </doc:source>
 </doc:example>
 */

angular.module('ccnut.bootstrap.directives')
    .directive('ccnutBsTooltip', ['ccnut.config', 'logger', function (ccnutConfig, logger) {

        var defaultOptions = {
            title: '',
            placement: 'top',
            trigger: 'hover'
        };

        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {

                if (!window.$ || !window.$.fn || !window.$.fn.tooltip) {
                    return logger.warn('ccnutBsTooltip directive skipped: tooltip function from Bootstrap library not available');
                }

                // Assemble options
                var options = angular.extend({}, defaultOptions, scope.$eval(iAttrs.ccnutBsTooltip));

                // Initialize tooltip
                iElement.tooltip(options);

            }
        };

    }]);// Module specific configuration
angular.module('ccnut.bootstrap.directives');// Module specific configuration
angular.module('ccnut.bootstrap');

/**
 * @ngdoc directive
 * @name jquery-ui.directive:ccnutJqueryUiDatepicker
 *
 * @description
 * Creates a jQuery UI datepicker.
 *
 * Accepts an optional object with keys and values that are passed to the jQuery UI datepicker plugin.
 *
 * The value is automatically stored in the model and the slider slides to the
 * corresponding position when the model changes.
 *
 * See [jQuery UI datepicker](http://jqueryui.com/datepicker/) for a list of supported options.
 *
 * @param {object=} ccnutJqueryUiDatepicker Object with key value pairs that are conform with jQuery UI datepicker options
 *
 * @example
 <doc:example>
 <doc:source>
 <script>
 function Ctrl($scope) {}
 </script>
 <div ng-controller="Ctrl">
 <input type="text" ng-model="model" ccnut-jquery-ui-datepicker="{dateFormat:'dd-mm-yy'}" />
 </div>
 </doc:source>
 </doc:example>
 */

angular.module('ccnut.jquery-ui.directives')
    .directive('ccnutJqueryUiDatepicker', ['ccnut.config', 'logger', function (ccnutConfig, logger) {
        var defaultOptions = {
            changeMonth: true,
            changeYear: true,
            maxDate: 0,
            dateFormat: 'dd-mm-yy',
            constrainInput: true
        };

        return {
            restrict: 'AC',
            require: 'ngModel',
            link: function (scope, iElement, iAttrs, ngModelController) {

                if (!window.$ || !window.$.fn || !window.$.fn.datepicker) {
                    return logger.warn('ccnutJqueryUiDatepicker directive skipped: datepicker function from jQuery UI library not available');
                }

                // Get options
                var options = angular.extend({}, defaultOptions, scope.$eval(iAttrs.ccnutJqueryUiDatepicker));

                // Initialize datepicker
                iElement.datepicker(options);

                // Update model on select event
                iElement.datepicker('option', 'onSelect', function (dateText, instance) {
                    ngModelController.$setViewValue(dateText);
                    scope.$apply();
                });

                // Update datepicker when view needs to be updated
                ngModelController.$render = function () {
                    var value = (ngModelController.$viewValue || '');
                    iElement.datepicker('setDate', value);
                };

            }
        };
    }]);/**
 * @ngdoc directive
 * @name jquery-ui.directive:ccnutJqueryUiSlider
 *
 * @description
 * Creates a jQuery UI slider.
 *
 * Accepts an optional object with keys and values that are passed to the jQuery UI slider plugin.
 *
 * The value is automatically stored in the model and the slider slides to the
 * corresponding position when the model changes.
 *
 * See [jQuery UI slider](http://jqueryui.com/slider/) for a list of supported options.
 *
 * @param {object=} ccnutJqueryUiSlider Object with key value pairs that are conform with jQuery UI slider options
 *
 * @example
 <doc:example>
 <doc:source>
 <script>
 function Ctrl($scope) {}
 </script>
 <div ng-controller="Ctrl">
 <div ng-model="model" ccnut-jquery-ui-slider="{min:1, max:5}"></div>
 </div>
 </doc:source>
 </doc:example>
 */

angular.module('ccnut.jquery-ui.directives')
    .directive('ccnutJqueryUiSlider', ['ccnut.config', 'logger', function (ccnutConfig, logger) {
        return {
            restrict: 'AC',
            require: 'ngModel',
            link: function (scope, iElement, iAttrs, ngModelController) {

                if (!window.$ || !window.$.fn || !window.$.fn.datepicker) {
                    return logger.warn('ccnutJqueryUiSlider directive skipped: slider function from jQuery UI library not available');
                }

                // Get options
                var options = angular.extend({}, scope.$eval(iAttrs.ccnutJqueryUiSlider));

                // Initialize slider
                iElement.slider(options);

                // Update model on slide event
                iElement.on('slide', function (event, ui) {
                    ngModelController.$setViewValue(ui.value);
                    scope.$apply();
                });

                // Update slider when view needs to be updated
                ngModelController.$render = function () {
                    var value = (ngModelController.$viewValue || 0);
                    iElement.slider('value', value);
                };

            }
        };
    }]);// Module specific configuration
angular.module('ccnut.jquery-ui.directives');// Module specific configuration
angular.module('ccnut.jquery-ui');



})(window, document);