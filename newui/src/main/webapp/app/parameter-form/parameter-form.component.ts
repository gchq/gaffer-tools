import { Component, OnInit, Input } from "@angular/core";
import { AnalyticsService } from '../gaffer/analytics.service';

@Component({
  selector: "app-parameter-form",
  templateUrl: "./parameter-form.component.html"
})
export class ParameterFormComponent implements OnInit {
  @Input("parameters") parameters;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {}

  /** Update the analytic operation whenever a parameter changes */
  onChange = function(parameter, parameterName) {
    this.analyticsService.updateAnalytic(
      this.parameters,
      parameter,
      parameterName
    );
  };
}
