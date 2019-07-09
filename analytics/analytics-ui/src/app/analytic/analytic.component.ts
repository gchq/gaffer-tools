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

    // Set the default icon if an icon is not specified
    let defaultIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M0 0h24v24H0z' fill='none'/><path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'/><path d='M0 0h24v24H0z' fill='none'/></svg>";
    let icon = defaultIcon;
    if (this.model.metaData.iconURL) {
      icon = this.model.metaData.iconURL;
    }

    // Make sure the icon is scaled to the correct size
    let widthString: string = icon.split('width')[1].split('=')[1].trim().split(' ')[0].trim();
    let width = Number(widthString.slice(1,widthString.length-1));
    let heightString: string = icon.split('height')[1].split('=')[1].trim().split(' ')[0].trim();
    let height = Number(heightString.slice(1,heightString.length-1));

    let desiredWidth = 120;
    let desiredHeight = 120;
    let widthScale = desiredWidth/width;
    let heightScale = desiredHeight/height;

    // Add the icon and scale it to the correct size
    let svgContainer = <HTMLElement> document.getElementById(this.model.operationName.toString() + '-svgContainer');
    svgContainer.innerHTML = icon;
    svgContainer.style.transform = 'scale(' + widthScale.toString() + ',' + heightScale.toString() + ')';
  }

  /** Save the chosen analytic in the analytics service */
  execute(analytic) {
    this.analyticsService.createArrayAnalytic(analytic);
    this.router.navigate(['/parameters']);
  }
}
