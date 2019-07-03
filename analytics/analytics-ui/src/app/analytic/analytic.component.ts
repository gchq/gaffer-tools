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

    // Change this to work for element with more than one attribute
    console.log(this.model.metaData.iconURL);
    var split = this.model.metaData.iconURL.split('\'');
    split.pop() // Remove the end tag
    var first = split[0].split(' ');
    first = first[1].split('=')[0];
    split.shift();
    split = split[0];
    // split.unshift(first);
    var attrs = Object(); 
    attrs[first] = split //turn into for loop
    console.log(split);
    console.log(first);
    console.log(attrs);
    console.log(attrs.d);
    var svg = document.querySelector('#mysvg');
    var path = this.makeSVGElement('path', attrs);
    console.log(path);
    svg.appendChild(path);
  }

  makeSVGElement(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) {
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
