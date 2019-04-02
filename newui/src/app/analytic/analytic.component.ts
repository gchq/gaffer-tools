import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-analytic",
  templateUrl: "./analytic.component.html",
  styleUrls: ["./analytic.component.css"]
})
export class AnalyticComponent implements OnInit {
  navigation;
  operationChain;

  // Save the chosen analytic in the operationChain service (should change to use analyticsService)
  execute(operation) {
    this.operationChain.setOperation(operation);
    this.navigation.goTo("parameters");
  }

  constructor() {}

  ngOnInit() {}
}
