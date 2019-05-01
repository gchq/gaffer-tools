import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-parameter-form",
  templateUrl: "./parameter-form.component.html",
  styleUrls: ["./parameter-form.component.css"]
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

  getTimeUnit = function(parameterName) {
    var metaData = this.time.getTimeMetaData(parameterName);
    return metaData ? metaData.unit : undefined;
  };

  //Update the analytic operation whenever a parameter changes
  onChange = function(parameter, parameterName) {
    this.analyticsService.updateAnalytic(
      this.parameters,
      parameter,
      parameterName
    );
  };
}
