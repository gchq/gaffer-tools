import { Component, OnInit, Input, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AnalyticsService } from "../gaffer/analytics.service";

@Component({
  selector: "app-analytic",
  templateUrl: "./analytic.component.html"
})
@Injectable()
export class AnalyticComponent implements OnInit {
  @Input("model") model;

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {}

  /** Save the chosen analytic in the analytics service */
  execute(analytic) {
    this.analyticsService.createArrayAnalytic(analytic);
    if (analytic.uiMapping.param1 == null) {
      this.analyticsService.executeAnalytic();
      this.router.navigate(["/results"]);
    } else {
      this.router.navigate(["/parameters"]);
    }
  }
}
