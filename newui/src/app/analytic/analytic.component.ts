import { Component, OnInit, Input } from "@angular/core";
import { Router } from '@angular/router';

@Component({
  selector: "app-analytic",
  templateUrl: "./analytic.component.html",
  styleUrls: ["./analytic.component.css"]
})
export class AnalyticComponent implements OnInit {
  navigation;
  operationChain;
  @Input('model') model;

  constructor(private router: Router) {};

  // Save the chosen analytic in the operationChain service (should change to use analyticsService)
  execute(analytic) {
    //this.operationChain.setOperation(operation);
    // this.navigation.goTo("parameters");s
    this.router.navigate(['/parameters'], {queryParams: analytic});
  }

  ngOnInit() {
    console.log(this.model);
  }
}
