import { Injectable } from '@angular/core';
import { QueryService } from './query.service';

//Used to store and get the selected analytic
@Injectable()
export class AnalyticsService {
  selectedAnalytic; //The selected analytic
  analyticOperation; //The analytic Operation to execute

  constructor(private query: QueryService) {}

  //Set the chosen analytic
  setAnalytic(analytic) {
    console.log("setting analytic:", analytic);
    this.selectedAnalytic = analytic;
    console.log("set analytic:", this.selectedAnalytic);
  }

  //Get the chosen analytic
  getAnalytic() {
    console.log("getting analytic:", this.selectedAnalytic);
    return this.selectedAnalytic;
  }

  //Update the analytic operation on change of parameters
  updateAnalytic = function(parameters) {
    this.analyticOperation.parameters = {parameters}
  }

  //Create and initialise the analytic operation with default parameters
  createAnalytic = function() {
      this.analyticOperation = {
        class: this.ANALYTIC_CLASS,
        operationName: this.selectedAnalytic.operationName,
        parameters: {}
      };
  }

  //Execute the analytic operation
  executeAnalytic = function() {
    // this.events.broadcast("onPreExecute", []);
    // if (!this.canExecute()) {
    //   return;
    // }

    // if (this.operations.length === 0) {
    //   this.error.handle("Unable to run operation chain with no operations");
    //   return;
    // }

    // for (var i in this.operations) {
    //   chain.operations.push(this.createOperationForQuery(this.operations[i]));
    // }

    //this.query.addOperation(this.angular.copy(chain));

    //var finalOperation = this.operations[this.operations.length - 1];
    // if (
    //   this.common.arrayContainsValue(
    //     finalOperation.selectedOperation.next,
    //     "uk.gov.gchq.gaffer.operation.impl.Limit"
    //   )
    // ) {
    //   var options = finalOperation.fields
    //     ? this.operationOptions.extractOperationOptions(
    //         finalOperation.fields.options
    //       )
    //     : undefined;
    //   chain.operations.push(
    //     this.operationService.createLimitOperation(options)
    //   );
    //   chain.operations.push(
    //     this.operationService.createDeduplicateOperation(options)
    //   );
    // }

    // this.previousQueries.addQuery({
    //   name: "Operation Chain",
    //   lastRun: this.moment().format("HH:mm"),
    //   operations: this.operations
    // });

    this.query.executeQuery(this.analyticOperation);
  };
}
