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
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AnalyticsService } from '../../analytics/analytics.service';
import { AnalyticStoreService } from 'src/app/analytics/analytic-store.service';

@Component({
  selector: 'app-parameter-form',
  templateUrl: './parameter-form.component.html'
})
export class ParameterFormComponent implements OnInit {
  @Input() parameters;

  constructor(
    private analyticsService: AnalyticsService,
    private analyticStoreService: AnalyticStoreService
  ) { }

  ngOnInit() { }

  /** Update the analytic operation whenever a parameter changes */
  onChange = function(parameter, parameterName) {
    // Convert date parameters into the right form
    const key = '_d';
    if (parameter[key] instanceof Date) {
      parameter = parameter[key].getFullYear() + '-'
        + ('0' + (parameter[key].getMonth() + 1)).slice(-2) + '-'
        + ('0' + parameter[key].getDate()).slice(-2);
    }

    let analytic = this.analyticStoreService.getAnalytic();
    analytic = this.analyticsService.updateAnalytic(parameter, parameterName, analytic);
    this.analyticStoreService.setAnalytic(analytic);
    this.parameters = analytic.uiMapping;
  };
}
