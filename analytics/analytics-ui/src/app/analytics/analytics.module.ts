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

import { FilterPipe } from '../services/filter.pipe';

import { AnalyticsComponent } from './analytics.component';
import { AnalyticComponent } from './analytic/analytic.component';

@NgModule({
  declarations: [AnalyticsComponent, AnalyticComponent, FilterPipe],
  imports: [
    CommonModule,
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
