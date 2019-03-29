import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-analytic",
  templateUrl: "./analytic.component.html",
  styleUrls: ["./analytic.component.css"]
})
export class AnalyticComponent implements OnInit {
  constructor() {
    function analytic() {
      return {
        controller: AnalyticController,
        controllerAs: "ctrl",
        bindings: {
          model: "<"
        }
      };
    }

    function AnalyticController(navigation, operationChain) {
      var vm = this;

      vm.$onInit = function() {};

      // Save the chosen analytic in the operationChain service (should change to use analyticsService)
      vm.execute = function(operation) {
        operationChain.setOperation(operation);
        navigation.goTo("parameters");
      };
    }
  }

  ngOnInit() {}
}
