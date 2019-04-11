import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-query",
  templateUrl: "./operation.component.html",
  styleUrls: ["./operation.component.css"]
})
export class OperationComponent implements OnInit {
  @Input('model') model;
  @Input('timeConfig') timeConfig;

  constructor() {}

  ngOnInit() {
    console.log(this.model);
    console.log(this.model.parameters);
    console.log(this.model.operations.fields);
    console.log(this.model.operations.fields.view);
  }

  getConfigFields = function() {
    var configFields = {};
    if(this.model.selectedOperation) {
        var fields = this.model.selectedOperation.fields
        for(var name in fields) {
            if(this.coreFields.indexOf(name) === -1) {
                configFields[name] = fields[name];
            }
        }
    }
    return configFields;
}

hasOtherConfig = function() {
    return Object.keys(this.getConfigFields()).length > 0;
}

getField = function(fieldName) {
    var field = this.model.fields[fieldName];
    if(field === undefined) {
        field = {};
        this.model.fields[fieldName] = field;
    }
    return field;
}

/**
 * Checks all subforms are valid and another operation is not in progress
 */
canExecute = function() {
    return this.operationForm.$valid && this.model.fields.input !== null && !this.loading.isLoading();
}

isFirst = function() {
    return this.index === 0;
}

isStandalone = function() {
    return this.chainLength === 1;
}

isLast = function() {
    return this.index === this.chainLength - 1;
}

toggleExpanded = function() {
    this.model.expanded = !this.model.expanded;
}

execute = function() {
    this.onExecute({op: this.model});
}

reset = function() {
    this.onReset({index: this.index});
}

delete = function() {
    this.onDelete({index: this.index});
}
}
