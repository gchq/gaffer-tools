import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.css"]
})
export class AnalyticsComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    //this.analytics = analytics.reloadAnalytics();
    this.reloadOperations(); // Load the operations
  }

  analytics = [
    "Get Adjacent Ids",
    "Get All Elements",
    "frequent-vehicles-in-region"
  ];
  availableOperations;
  analytics2 = [[], []];

  //delete most of this left over from operation chain
  populateOperations = function(availableOperations) {
    this.availableOperations = [];

    for (var i in availableOperations) {
      var operation = availableOperations[i];

      if (
        !this.previous ||
        !this.previous.selectedOperation ||
        !this.previous.selectedOperation.next ||
        this.previous.selectedOperation.next.indexOf(operation.class) > -1
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
          this.placeholder = "Search for an operation (e.g Get Elements)";
        }
        this.availableOperations.push(operation);
      }
    }

    this.availableOperations.sort(function(a, b) {
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
    var _i = 0;
    for (_i = 0; _i < 2; _i++) {
      this.analytics[i].operation = availableOperations[i];
      this.analytics[i].icon = icons[i];
      this.analytics[i].name = analyticNames[i];
      this.analytics[i].outputType = outputTypes[i];
      this.analytics[i].backgroundColor = backgroundColors[i];
    }
  };

  // Delete this?
  getOperations = function() {
    return this.operationService
      .getAvailableOperations(true)
      .then(function(ops) {
        this.populateOperations(ops);
        return this.availableOperations;
      });
  };

  // load the operations
  reloadOperations = function() {
    this.operationService.reloadOperations(true).then(this.populateOperations);
  };
}
