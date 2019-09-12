/*
 * Copyright 2019 Crown Copyright
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
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-parameter-input',
  templateUrl: './parameter-input.component.html'
})
@Injectable()
export class ParameterInputComponent implements OnInit {
  analytic; // The chosen analytic
  Analytic; // The analytic operation to execute
  color = 'primary'; // Spinner color
  mode = 'indeterminate'; // mode of the progress spinner
  loading: boolean; // Used to determine whether or not to show spinner

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {
    // Get the analytic from the analyticsService
    this.analytic = this.analyticsService.getAnalytic();
  }

  /** Start executing the analytic and load the data */
  executeAnalytic = function() {
    this.analyticsService.executeAnalytic();
    this.loading = true;
  };
}
