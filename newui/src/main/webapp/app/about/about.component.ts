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
import { ConfigService } from "../config/config.service";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html"
})
/** The about page, where the user can get more help and information through links to documentation and can send an email to give feedback */
export class AboutComponent implements OnInit {
  title = "About";
  DESCRIPTION_PROPERTY = "gaffer.properties.app.description";
  DOCS_PROPERTY = "gaffer.properties.app.doc.url";
  description;
  docs;
  restApi;
  properitesLoaded = false;
  properties;

  constructor(private config: ConfigService) {}

  /** Opens the users default email client so they can send feedback by email */
  sendFeedback = function(emailId, subject, message) {
    window.open(
      "mailto:" + emailId + "?subject=" + subject + "&body=" + message,
      "_self"
    );
  };

  ngOnInit() {
    this.properties.get().subscribe(function(props) {
      this.docs = props[this.DOCS_PROPERTY];
      this.description =
        props[this.DESCRIPTION_PROPERTY] || "no description provided";
      this.propertiesLoaded = true;
    });

    this.config.get().subscribe(function(conf) {
      let endpoint = conf.restEndpoint.replace(/\/$/, "");

      this.restApi = endpoint.substring(0, endpoint.lastIndexOf("/"));
      if (conf.feedback) {
        this.emailRecipients = conf.feedback.recipients;
        this.emailSubject = conf.feedback.subject || "Gaffer feedback";
      }
    });
  }
}
