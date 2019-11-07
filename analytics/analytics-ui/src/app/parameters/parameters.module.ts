import { CommonModule } from '@angular/common';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatOptionModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatTooltipModule
} from '@angular/material';

import { ParameterInputComponent } from './parameter-page/parameter-page.component';
import { ParameterFormComponent } from './parameter-form/parameter-form.component';
import { OperationComponent } from './operation/operation.component';

@NgModule({
  declarations: [ParameterInputComponent, ParameterFormComponent, OperationComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: navigator.language },
  ]
})
export class ParametersModule { }
