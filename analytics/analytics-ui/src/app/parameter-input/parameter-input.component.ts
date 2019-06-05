import { Component, OnInit, Injectable, ViewChild } from "@angular/core";
import { AnalyticsService } from "../gaffer/analytics.service";

@Component({
  selector: "app-parameter-input",
  templateUrl: "./parameter-input.component.html"
})
@Injectable()
export class ParameterInputComponent implements OnInit {
  analytic; //The chosen analytic
  Analytic; //The analytic operation to execute
  color = "primary"; //Spinner color
  mode = "indeterminate"; //mode of the progress spinner
  loading: boolean; //Used to determine whether or not to show spinner

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    //Get the analytic from the analyticsService
    this.analytic = this.analyticsService.getAnalytic();
  }

  /** Start executing the analytic and load the data */
  executeAnalytic = function() {
    this.analyticsService.executeAnalytic();
    this.loading = true;
  };
}
