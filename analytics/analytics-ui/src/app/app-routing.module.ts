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

import { AnalyticsComponent } from './analytics/analytics.component';
import { TableComponent } from './table/table.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParameterInputComponent } from './parameter-input/parameter-input.component';

const routes: Routes = [
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'parameters', component: ParameterInputComponent },
  { path: 'parameters/:operation', component: ParameterInputComponent },
  { path: 'results', component: TableComponent },
  { path: '**', redirectTo: 'analytics' }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
