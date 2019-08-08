import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticComponent } from './analytic/analytic.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [AnalyticsComponent, AnalyticComponent],
  imports: [
    CommonModule, MaterialModule
  ]
})
export class AnalyticsModule { }
