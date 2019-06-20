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
  ) {}

  ngOnInit() {}

  /** Save the chosen analytic in the analytics service */
  execute(analytic) {
    const name = this.model.analyticName;
    this.analyticsService.createArrayAnalytic(analytic);
    this.router.navigate([name]);
  }
}
