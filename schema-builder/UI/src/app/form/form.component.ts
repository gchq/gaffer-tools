import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from './user';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  registerForm: FormGroup;
  formResult: any;
  events: any[] = [];
  submitted: boolean;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.submitted = false;
    this.registerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      address: this.formBuilder.group({
        street: [],
        postcode: [],
        city: []
      })
    });

    this.subcribeToFormChanges();
  }

  subcribeToFormChanges() {
    const myFormStatusChanges$ = this.registerForm.statusChanges;
    const myFormValueChanges$ = this.registerForm.valueChanges;

    myFormStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
    myFormValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
  }

  save(model: User, isValid: boolean) {
    this.submitted = true;
    this.formResult = model;
    console.log(model, isValid);
  }
}
