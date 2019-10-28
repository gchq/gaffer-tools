import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticComponent } from './analytic/analytic.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FilterPipeModule } from 'ngx-filter-pipe';
import {
  MatTooltipModule,
  MatIconModule,
  MatTabsModule,
  MatCardModule,
  MatGridListModule,
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
} from '@angular/material';

@NgModule({
  declarations: [AnalyticsComponent, AnalyticComponent],
  imports: [
    CommonModule, FlexLayoutModule, FilterPipeModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AnalyticsModule { }
