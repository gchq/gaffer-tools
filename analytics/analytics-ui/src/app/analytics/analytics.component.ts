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
import { ErrorService } from '../services/error.service';
import { AnalyticsService } from '../services/analytics.service';
import { FilterPipe } from 'ngx-filter-pipe';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
@Injectable()
export class AnalyticsComponent implements OnInit {
  analytics: any;
  analyticFilter: any = { analyticName: '' };
  order;
  constructor(
    private filterPipe: FilterPipe,
    private analyticsService: AnalyticsService,
    private error: ErrorService
  ) { }

  ngOnInit() {
    this.reloadAnalytics();
  }

  reverseAnalytics = function() {
    this.reverse = !this.reverse;
  };

  /** Load the analytics */
  reloadAnalytics = function() {
    this.analyticsService.reloadAnalytics(true).subscribe(
      availableAnalytics => {
        this.analytics = availableAnalytics;
      },
      err => {
        this.error.handle(
          'Error loading operations, see the console for details',
          null,
          err
        );
      }
    );
  };
}
