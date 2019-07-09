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

  ngOnInit() {}

  ngAfterViewInit() {
    // Make sure the icon is scaled to the correct size
    var width = this.model.metaData.iconURL.split('width')[1].split('=')[1].trim().split(' ')[0].trim();
    var width = width.slice(1,width.length-1);
    var height = this.model.metaData.iconURL.split('height')[1].split('=')[1].trim().split(' ')[0].trim();
    var height = height.slice(1,height.length-1);

    var desiredWidth = 120;
    var desiredHeight = 120;
    var widthScale = desiredWidth/width;
    var heightScale = desiredHeight/height;

    let svgContainer = <HTMLElement> document.getElementById(this.model.operationName.toString() + '-svgContainer');
    svgContainer.innerHTML = this.model.metaData.iconURL;
    svgContainer.style.transform = 'scale(' + widthScale.toString() + ',' + heightScale.toString() + ')';
  }

  /** Save the chosen analytic in the analytics service */
  execute(analytic) {
    this.analyticsService.createArrayAnalytic(analytic);
    this.router.navigate(['/parameters']);
  }
}
