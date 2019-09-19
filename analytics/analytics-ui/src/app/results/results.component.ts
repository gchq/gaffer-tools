/*
 * Copyright 2019 Crown Copyright
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
import { Location } from '@angular/common';
import { Component, OnInit, Injectable, AfterViewInit } from '@angular/core';

import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
@Injectable()
export class ResultsComponent implements OnInit {
  outputType;
  selected;

  constructor(
    private analyticsService: AnalyticsService,
    private location: Location
  ) { }

  goback() {
    this.location.back();
  }

  ngOnInit() {
    this.outputType = this.analyticsService.getOutputVisualisationType();
  }
}
