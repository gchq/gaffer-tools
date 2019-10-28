import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HtmlComponent } from './html/html.component';
import { TableComponent } from './table/table.component';
import {
  MatTableModule,
  MatSelectModule,
  MatSortModule,
  MatPaginatorModule,
  MatCardModule,
  MatListModule,
  MatFormFieldModule,
  MatButtonModule,
  MatInputModule,
} from '@angular/material';

@NgModule({
  declarations: [ResultsComponent, HtmlComponent, TableComponent],
  imports: [
    CommonModule, FlexLayoutModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatTableModule
  ]
})
export class ResultsModule { }
