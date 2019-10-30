import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { AppRoutingModule } from '../app-routing.module';

import { HtmlComponent } from './html/html.component';
import { ResultsComponent } from './results.component';
import { TableComponent } from './table/table.component';

@NgModule({
  declarations: [ResultsComponent, HtmlComponent, TableComponent],
  imports: [
    AppRoutingModule,
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule
  ]
})
export class ResultsModule { }
