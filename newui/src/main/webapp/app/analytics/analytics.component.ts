import { Component, OnInit } from "@angular/core";
import { OperationService } from '../gaffer/operation.service';

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.css"]
})
export class AnalyticsComponent implements OnInit {
  availableOperations;

  constructor(private operationService: OperationService) {}

  ngOnInit() {
    this.reloadOperations(); // Load the operations
  }

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

    this.analytics = this.availableOperations;
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
    this.operationService.reloadOperations(true).subscribe(
      availableOperations => {
        console.log(availableOperations)
        this.populateOperations(availableOperations)},
      err => console.log(err));
    //this.populateOperations()
    //use error service to handle error
  };
}
