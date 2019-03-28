import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.css"]
})
export class AnalyticsComponent implements OnInit {
  constructor() {
    function analytics() {
      return {
        templateUrl: "app/analytics/analytics.html",
        controller: AnalyticsController,
        controllerAs: "ctrl",
        bindings: {
          model: "="
        }
      };
    }

    function AnalyticsController(operationService) {
      var vm = this;
      //vm.analytics = ["Get Adjacent Ids","Get All Elements","frequent-vehicles-in-region"];
      vm.availableOperations;
      vm.analytics = [[], []];

      vm.$onInit = function() {
        //vm.analytics = analytics.reloadAnalytics();
        vm.reloadOperations(); // Load the operations
      };

      //delete most of this left over from operation chain
      var populateOperations = function(availableOperations) {
        vm.availableOperations = [];

        for (var i in availableOperations) {
          var operation = availableOperations[i];

          if (
            !vm.previous ||
            !vm.previous.selectedOperation ||
            !vm.previous.selectedOperation.next ||
            vm.previous.selectedOperation.next.indexOf(operation.class) > -1
          ) {
            operation.formattedName =
              operation.name !== undefined
                ? operation.name.toLowerCase().replace(/\s+/g, "")
                : "";
            operation.formattedDescription =
              operation.description !== undefined
                ? operation.description.toLowerCase().replace(/\s+/g, "")
                : "";

            if (operation.formattedName === "getelements") {
              vm.placeholder = "Search for an operation (e.g Get Elements)";
            }
            vm.availableOperations.push(operation);
          }
        }

        vm.availableOperations.sort(function(a, b) {
          if (a.namedOp && !b.namedOp) {
            return -1;
          }
          if (!a.namedOp && b.namedOp) {
            return 1;
          }
          if (a.formattedName > b.formattedName) {
            return 1;
          }
          if (a.formattedName < b.formattedName) {
            return -1;
          }
          if (a.formattedDescription > b.formattedDescription) {
            return 1;
          }
          if (a.formattedDescription < b.formattedDescription) {
            return -1;
          }
          return 0;
        });

        // Hard code the other data I assume we will get when we load up the analytic
        var icons = ["query", "location-search"]; //some names of icons from img folder
        var analyticNames = [
          "Frequent Vehicles In Region",
          "Frequent Vehicles In Region 2"
        ];
        var outputTypes = ["Table", "Table"];
        var backgroundColors = ["Lime", "Cyan", "Red", "Magenta", "Yellow"];

        // Create the analytics from this hard coded data
        for (var _i = 0; _i < analytics.length; _i++) {
          vm.analytics[_i].operation = availableOperations[_i];
          vm.analytics[_i].icon = icons[_i];
          vm.analytics[_i].name = analyticNames[_i];
          vm.analytics[_i].outputType = outputTypes[_i];
          vm.analytics[_i].backgroundColor = backgroundColors[_i];
        }
      };

      // Delete this?
      vm.getOperations = function() {
        return operationService
          .getAvailableOperations(true)
          .then(function(ops) {
            populateOperations(ops);
            return vm.availableOperations;
          });
      };

      // load the operations
      vm.reloadOperations = function() {
        operationService.reloadOperations(true).then(populateOperations);
      };
    }
  }

  ngOnInit() {}
}
