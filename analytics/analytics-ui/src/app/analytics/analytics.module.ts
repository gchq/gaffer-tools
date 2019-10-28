import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatTooltipModule,
} from '@angular/material';

import { FilterPipeModule } from 'ngx-filter-pipe';

import { AnalyticsComponent } from './analytics.component';
import { AnalyticComponent } from './analytic/analytic.component';

@NgModule({
  declarations: [AnalyticsComponent, AnalyticComponent],
  imports: [
    CommonModule,
    FilterPipeModule,
    FlexLayoutModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    ReactiveFormsModule
  ]
})
export class AnalyticsModule { }
