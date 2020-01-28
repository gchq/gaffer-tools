/*
 * Copyright 2019-2020 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, OnInit, Injectable } from '@angular/core';

import { AnalyticsService } from '../analytics/analytics.service';
import { AnalyticStoreService } from '../analytics/analytic-store.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html'
})
@Injectable()
export class ResultsComponent implements OnInit {
  outputType;
  selected;

  constructor(
    private analyticsService: AnalyticsService,
    private analyticStoreService: AnalyticStoreService
  ) { }

  ngOnInit() {
    this.outputType = this.analyticsService.getOutputVisualisationType(this.analyticStoreService.getAnalytic());
  }
}
