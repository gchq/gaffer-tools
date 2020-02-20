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

import { ErrorService } from '../services/error.service';
import { AnalyticsService } from './analytics.service';
import { Analytic } from './interfaces/analytic.interface';
import { UIMappingDetail } from './interfaces/uiMappingDetail.interface';
import { MetaData } from './interfaces/metaData.interface';
import { OutputVisualisation } from './interfaces/outputVisualisation.interface';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
@Injectable()
export class AnalyticsComponent implements OnInit {
  analytics;
  searchText;
  constructor(
    private analyticsService: AnalyticsService,
    private error: ErrorService
  ) { }

  ngOnInit() {
    this.getAnalytics();
  }

  /** Load the analytics */
  getAnalytics = function(): void {
    this.analyticsService.getAnalytics().subscribe(
      // On success
      analytics => {
        this.analytics = analytics;
      },
      // On error
      err => {
        this.error.handle(
          'Failed to load the analytics, see the console for details',
          null,
          err
        );
      }
    );
  };
}
