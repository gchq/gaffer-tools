import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParameterInputComponent } from './parameter-input/parameter-input.component';
import { ParameterFormComponent } from './parameter-form/parameter-form.component';
import { OperationComponent } from './operation/operation.component';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [ParameterInputComponent, ParameterFormComponent, OperationComponent],
  imports: [
    CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, FlexLayoutModule
  ]
})
export class ParametersModule { }