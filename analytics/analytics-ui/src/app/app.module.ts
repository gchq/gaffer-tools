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

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule } from '@angular/upgrade/static';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import {
  MatToolbarModule,
  MatButtonModule,
  MatIconModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AnalyticsModule } from './analytics/analytics.module';
import { ParametersModule } from './parameters/parameters.module';
import { ResultsModule } from './results/results.module';

import { AnalyticsService } from './analytics/analytics.service';
import { ErrorService } from './services/error.service';
import { EndpointService } from './services/endpoint-service';
import { QueryService } from './services/query.service';
import { ResultsService } from './services/results.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    UpgradeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FlexLayoutModule,
    ResultsModule,
    AnalyticsModule,
    ParametersModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule
  ],
  providers: [
    AnalyticsService,
    ErrorService,
    EndpointService,
    QueryService,
    ResultsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) { }
  ngDoBootstrap() {
    this.upgrade.bootstrap(document.body, ['myApp'], { strictDi: true });
  }
}
