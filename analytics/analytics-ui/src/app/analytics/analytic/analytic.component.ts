/*
 * Copyright 2019-2020 Crown Copyright
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

import { Component, OnInit, Input, Injectable, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService } from '../analytics.service';
import { HttpClient } from '@angular/common/http';
import { AnalyticStoreService } from '../analytic-store.service';

@Component({
  selector: 'app-analytic',
  templateUrl: './analytic.component.html',
  styleUrls: ['./analytic.component.css']
})
@Injectable()
export class AnalyticComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() model;
  currentIconWidth: number;
  currentIconHeight: number;

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService,
    private analyticStoreService: AnalyticStoreService,
    private http: HttpClient,
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {

    // Load the default icon from file
    this.http.get('../../assets/defaultIcon.svg', { responseType: 'text' }).subscribe(svg => {
      const defaultIcon = svg;

      // Set the default icon if an icon is not specified
      let icon = defaultIcon;
      if (this.model.metaData.icon) {
        icon = this.model.metaData.icon;
      }

      // Get the current width and height of the icon
      const widthString: string = icon.split('width')[1].split('=')[1].trim().split(' ')[0].trim();
      this.currentIconWidth = Number(widthString.slice(1, widthString.length - 1));
      const heightString: string = icon.split('height')[1].split('=')[1].trim().split(' ')[0].trim();
      this.currentIconHeight = Number(heightString.slice(1, heightString.length - 1));

      // Scale the icon
      this.scaleIcon();

      // Display the icon
      const svgContainer: HTMLElement = document.getElementById(this.model.analyticName.toString() + '-svgContainer');
      if (svgContainer) {
        svgContainer.innerHTML = icon;
      }

      // Scale the icon whenever the window resizes
      window.addEventListener('resize', () => this.scaleIcon());
    });
  }

  ngOnDestroy() {
    // Remove all event listeners
    window.removeEventListener('resize', () => this.scaleIcon());
  }

  /** Save the chosen analytic in the analytics service */
  execute(analytic) {
    const name = this.model.analyticName;
    const initialisedAnalytic = this.analyticsService.initialiseAnalytic(analytic);
    this.analyticStoreService.setAnalytic(initialisedAnalytic);
    this.router.navigate([name]);
  }

  /** Scale the icon to fit its container without distorting it */
  scaleIcon() {
    // Get the width and height of the container of the svg
    const svgDiv: HTMLElement = document.getElementById(this.model.analyticName.toString() + '-svgDiv');
    if (svgDiv) {
      const containerWidth = svgDiv.offsetWidth;
      const containerHeight = svgDiv.offsetHeight;

      let desiredHeight;
      let desiredWidth;
      // If the container width is smaller than the height, use the width to determine the size of the icon
      if (containerWidth < containerHeight) {
        desiredHeight = 0.8 * containerWidth;
        desiredWidth = 0.8 * containerWidth;
        // Otherwise use the height to determine the size of the icon
      } else {
        desiredHeight = 0.8 * containerHeight;
        desiredWidth = 0.8 * containerHeight;
      }

      // Scale the icon based on its current size and desired size
      const svgContainer: HTMLElement = document.getElementById(this.model.analyticName.toString() + '-svgContainer');
      const widthScale = desiredWidth / svgContainer.offsetWidth;
      const heightScale = desiredHeight / svgContainer.offsetHeight;
      svgContainer.style.transform = 'scale(' + widthScale.toString() + ',' + heightScale.toString() + ')';
    }
  }
}
