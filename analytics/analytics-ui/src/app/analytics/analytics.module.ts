import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticComponent } from './analytic/analytic.component';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FilterPipeModule } from 'ngx-filter-pipe';

@NgModule({
  declarations: [AnalyticsComponent, AnalyticComponent],
  imports: [
    CommonModule, MaterialModule, FlexLayoutModule, FilterPipeModule
  ]
})
export class AnalyticsModule { }
