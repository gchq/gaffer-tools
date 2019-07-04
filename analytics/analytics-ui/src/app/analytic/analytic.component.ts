/*
 * Copyright 2019 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '../gaffer/analytics.service';

@Component({
  selector: 'app-analytic',
  templateUrl: './analytic.component.html'
})
@Injectable()
export class AnalyticComponent implements OnInit {
  @Input() model;

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() { 
    let svg = document.querySelector('#mysvg');

    // Split up the string into the different elements
    let split = this.model.metaData.iconURL.split('>');

    // For each tag
    for (let element of split) {

      // Remove the end tag
      element = element.split('\'');

      // Get the start tag and name of the first attribute
      let start = element[0].split(' ');
      let firstAttribute = start[1].split('=')[0]; // Get the name of the first attribute
      let tag = start[0].split('<')[1]; // Get the tag
      element.shift(); // Remove the tag from the array

      // Get the value of the first attribute
      var firstAttributeValue = element[0];

      // Create a key value pair array of attributes
      let attrs = Object();
      attrs[firstAttribute] = firstAttributeValue
      element.shift(); // Remove the first attribute
      element.pop(); // Remove the slash

      for (let i = 0; i < element.length; i=i+2) {
        attrs[element[i].split('=')[0].split(' ')[1]] = element[i+1];
      }

      let path = this.makeSVGElement(tag, attrs);
      svg.appendChild(path);
    }

  }

  makeSVGElement(tag, attrs) {
    let el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (let k in attrs) {
        el.setAttribute(k, attrs[k]);
    }
    return el;
  };

  /** Save the chosen analytic in the analytics service */
  execute(analytic) {
    this.analyticsService.createArrayAnalytic(analytic);
    this.router.navigate(['/parameters']);
  }
}
