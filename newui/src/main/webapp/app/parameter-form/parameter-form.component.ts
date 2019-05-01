import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-parameter-form",
  templateUrl: "./parameter-form.component.html"
})
export class ParameterFormComponent implements OnInit {
  @Input("parameters") parameters;
  title;

  constructor() {}

  ngOnInit() {
    if (this.parameters === null || this.parameters === undefined) {
      throw "Expected defined, non-null value for parameters. Got " +
        this.parameters;
    }
    if (!this.title) {
      this.title = "Parameters";
    }
  }

  //Update the analytic operation whenever a parameter changes
  onChange = function(parameter, parameterName) {
    this.analyticsService.updateAnalytic(
      this.parameters,
      parameter,
      parameterName
    );
  };
}
