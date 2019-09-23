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

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-parameter-form',
  templateUrl: './parameter-form.component.html'
})
export class ParameterFormComponent implements OnInit {
  @Input() parameters;

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {}

  /** Update the analytic operation whenever a parameter changes */
  onChange = function(parameter, parameterName) {
    // Convert date parameters into the right form
    if (parameter instanceof Date) {
      parameter = parameter.getFullYear() + '-'
        + ('0' + (parameter.getMonth() + 1)).slice(-2) + '-'
        + ('0' + parameter.getDate()).slice(-2);
    }

    this.analyticsService.updateAnalytic(parameter, parameterName);
    const analytic = this.analyticsService.getAnalytic();
    this.parameters = analytic.uiMapping;
  };
}
