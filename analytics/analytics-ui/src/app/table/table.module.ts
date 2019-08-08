import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule, MaterialModule, FlexLayoutModule
  ]
})
export class TableModule { }
