import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-query",
  templateUrl: "./operation.component.html"
})
export class OperationComponent implements OnInit {
  @Input("model") model;

  constructor() {}

  ngOnInit() {}

  // getConfigFields = function() {
  //   let configFields = {};
  //   if (this.model.selectedOperation) {
  //     let fields = this.model.selectedOperation.fields;
  //     for (let name in fields) {
  //       if (this.coreFields.indexOf(name) === -1) {
  //         configFields[name] = fields[name];
  //       }
  //     }
  //   }
  //   return configFields;
  // };

  // getField = function(fieldName) {
  //   let field = this.model.fields[fieldName];
  //   if (field === undefined) {
  //     field = {};
  //     this.model.fields[fieldName] = field;
  //   }
  //   return field;
  // };
}
