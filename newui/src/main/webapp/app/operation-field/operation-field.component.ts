import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-operation-field",
  templateUrl: "./operation-field.component.html"
})
export class OperationFieldComponent implements OnInit {
  @Input("model") model;
  details;
  name;
  param;
  title;
  common;

  constructor() {}

  ngOnInit() {
    if (this.details === null || this.details === undefined) {
      throw "Expected details binding";
    }

    if (this.model === null || this.model === undefined) {
      throw "Expected model binding for: " + this.details.name;
    }

    this.name = this.details.name;
    if (this.name === null) {
      this.name = "";
    }
    this.title = this.common.toTitle(this.name);

    if (
      this.model.fields[this.name] === null ||
      this.model.fields[this.name] === undefined
    ) {
      this.param = {
        parts: {},
        valueClass: this.details.className,
        required: this.details.required,
        description: this.details.summary
      };
      this.model.fields[this.name] = this.param;
    } else {
      this.param = this.model.fields[this.name];
    }
  }
}
