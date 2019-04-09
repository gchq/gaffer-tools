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

import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html"
})
export class AboutComponent implements OnInit {
  title = "About";
  DESCRIPTION_PROPERTY = "gaffer.properties.app.description";
  DOCS_PROPERTY = "gaffer.properties.app.doc.url";
  description;
  docs;
  restApi;
  properitesLoaded = false;

  constructor() {}

  sendFeedback = function(emailId, subject, message) {
    // if (!emailId || emailId.length === 0) {
    //   throw new Error(
    //     "The UI config should contain email recipients to receive feedback from users. No recipients were specified"
    //   );
    //   return;
    // } else if (!(emailId instanceof Array)) {
    //   var type = typeof emailId;
    //   throw new Error(
    //     'The UI configuration property "feedback.recipients" should contain an array, not a ' +
    //       type
    //   );
    //   return;
    // }
    window.open(
      "mailto:" + emailId + "?subject=" + subject + "&body=" + message,
      "_self"
    );
  };

  OnInit(properties, config) {
    properties.get().then(function(props) {
      this.docs = props[this.DOCS_PROPERTY];
      this.description =
        props[this.DESCRIPTION_PROPERTY] || "no description provided";
      this.propertiesLoaded = true;
    });

    config.get().then(function(conf) {
      var endpoint = conf.restEndpoint.replace(/\/$/, "");

      this.restApi = endpoint.substring(0, endpoint.lastIndexOf("/"));
      if (conf.feedback) {
        this.emailRecipients = conf.feedback.recipients;
        this.emailSubject = conf.feedback.subject || "Gaffer feedback";
      }
    });
  }

  ngOnInit() {}
}
