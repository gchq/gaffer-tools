import { Component, OnInit, Injectable } from "@angular/core";
import { ErrorService } from "../dynamic-input/error.service";
import { AnalyticsService } from "../gaffer/analytics.service";

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html"
})
@Injectable()
export class AnalyticsComponent implements OnInit {
  analytics: any;
  constructor(
    private analyticsService: AnalyticsService,
    private error: ErrorService
  ) {}

  ngOnInit() {
    this.reloadAnalytics();
  }

  /** Load the analytics */
  reloadAnalytics = function() {
    this.analyticsService.reloadAnalytics(true).subscribe(
      (availableAnalytics) => {
        this.analytics = availableAnalytics;
      },
      (err) => {
        this.error.handle(
          "Error loading operations, see the console for details",
          null,
          err
        );
      }
    );
  };
}
