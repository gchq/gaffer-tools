import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results.component';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HtmlComponent } from './html/html.component';
import { TableComponent } from './table/table.component';

@NgModule({
  declarations: [ResultsComponent, HtmlComponent, TableComponent],
  imports: [
    CommonModule, MaterialModule, FlexLayoutModule
  ]
})
export class ResultsModule { }
