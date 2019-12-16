/*
 * Copyright 2018-2019 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('app').component('about', about());

function about() {
    return {
        templateUrl: 'app/about/about.html',
        controller: AboutController,
        controllerAs: 'ctrl'
    }
}

function AboutController(properties, config, error) {
    var vm = this;

    var DESCRIPTION_PROPERTY = 'gaffer.properties.app.description';
    var DOCS_PROPERTY = 'gaffer.properties.app.doc.url';

    vm.description;
    vm.docs;
    vm.restApi;

    vm.propertiesLoaded = false;

    vm.emailRecipients;
    vm.emailSubject;

    vm.$onInit = function() {
        properties.get().then(function(props) {
            vm.docs = props[DOCS_PROPERTY];
            vm.description = props[DESCRIPTION_PROPERTY] || 'no description provided';
            vm.propertiesLoaded = true;

            config.get().then(function(conf) {
                var endpoint = conf.restEndpoint.replace(/\/$/, "");

                vm.restApi = endpoint.substring(0, endpoint.lastIndexOf('/'));
                if (conf.feedback) {
                    vm.emailRecipients = conf.feedback.recipients;
                    vm.emailSubject = conf.feedback.subject || "Gaffer feedback";
                }

                // Override the rest properties description if the description is set in the config
                if (conf.description) {
                    vm.description = conf.description;
                }

                // Override the rest properties docs if the docs is set in the config
                if (conf.docUrl) {
                    vm.docs = conf.docUrl;
                }
            });
        });
    }

    vm.sendFeedback = function() {
        if (!vm.emailRecipients || vm.emailRecipients.length === 0) {
            error.handle('UI is misconfigured', 'The UI config should contain email recipients to receive feedback from users. No recipients were specified');
            return;
        } else if (!(vm.emailRecipients instanceof Array)) {
            var type = typeof vm.emailRecipients;
            error.handle('UI is misconfigured', 'The UI configuration property "feedback.recipients" should contain an array, not a ' + type);
            return;
        }
        window.open('mailto:' + vm.emailRecipients.join('; ') + ';?subject=' + vm.emailSubject);
    }    
}
