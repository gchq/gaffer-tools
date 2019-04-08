import { Component, OnInit, Input } from "@angular/core";
import { Router } from '@angular/router';
import { AnalyticsService } from '../analytics.service';

@Component({
  selector: "app-analytic",
  templateUrl: "./analytic.component.html",
  styleUrls: ["./analytic.component.css"]
})
export class AnalyticComponent implements OnInit {
  navigation;
  operationChain;
  @Input('model') model;

  constructor(private router: Router, private analyticsService: AnalyticsService) {};

  // Save the chosen analytic in the analytics service
  execute(analytic) {
    console.log(analytic);
    this.analyticsService.setAnalytic(analytic);
    this.router.navigate(['/parameters']);
  }

  ngOnInit() {
  }
}
