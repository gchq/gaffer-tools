/*
 * Copyright 2019-2020 Crown Copyright
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

import { Component, OnInit, Injectable } from '@angular/core';
import { AnalyticsService } from '../../analytics/analytics.service';
import { AnalyticStoreService } from '../../analytics/analytic-store.service';
import { Analytic } from 'src/app/analytics/interfaces/analytic.interface';

@Component({
  selector: 'app-parameter-page',
  templateUrl: './parameter-page.component.html',
  styleUrls: ['./parameter-page.component.css']
})
@Injectable()
export class ParameterInputComponent implements OnInit {
  analytic; // The chosen analytic
  Analytic; // The analytic operation to execute
  color = 'primary'; // Spinner color
  mode = 'indeterminate'; // mode of the progress spinner
  loading: boolean; // Used to determine whether or not to show spinner

  constructor(
    private analyticStoreService: AnalyticStoreService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    // Get the analytic from the analyticsService
    this.analytic = this.analyticStoreService.getAnalytic();
  }

  /** Start executing the analytic and load the data */
  executeAnalytic = function(analytic) {
    this.analyticsService.executeAnalytic(analytic);
    this.loading = true;
  };
}
