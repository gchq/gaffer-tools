/*
 * Copyright 2018 Crown Copyright
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

function AboutController(properties, config, $sce) {
    var vm = this;

    var DESCRIPTION_PROPERTY = 'gaffer.properties.app.description';
    var DOCS_PROPERTY = 'gaffer.properties.app.doc.url';

    vm.description;
    vm.docs;
    vm.restApi;

    vm.emailRecipients;
    vm.emailSubject;

    vm.$onInit = function() {
        properties.get().then(function(props) {
            vm.docs = props[DOCS_PROPERTY];
            vm.description = props[DESCRIPTION_PROPERTY] || 'no description provided';
        });

        config.get().then(function(conf) {
            vm.restApi = conf.restEndpoint.substring(0, conf.restEndpoint.lastIndexOf('/'));
            if (conf.feedback) {
                vm.emailRecipients = conf.feedback.recipients;
                vm.emailSubject = conf.feedback.subject || "Gaffer feedback";
            }
        });
    }

    vm.sendFeedback = function() {
        window.open('mailto:' + vm.emailRecipients.join('; ') + ';?subject=' + vm.emailSubject);
    }

    vm.renderDescription = function(descriptionHtml) {
        return $sce.trustAsHtml(descriptionHtml);
    }

    
}