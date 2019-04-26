import { Injectable } from '@angular/core';
import { QueryService } from './query.service';

//Used to store and get the selected analytic
@Injectable()
export class AnalyticsService {
  selectedAnalytic; //The selected analytic
  analyticOperation; //The analytic Operation to execute

  ANALYTIC_CLASS = 'uk.gov.gchq.gaffer.operation.analytic.AnalyticOperation'

  constructor(private query: QueryService) {}

  /** Set the chosen analytic */
  setAnalytic(analytic) {
    console.log("setting analytic:", analytic);
    this.selectedAnalytic = analytic;
    console.log("set analytic:", this.selectedAnalytic);
  }

  /** Get the chosen analytic */
  getAnalytic() {
    console.log("getting analytic:", this.selectedAnalytic);
    return this.selectedAnalytic;
  }

  /** Update the analytic operation on change of parameters */
  updateAnalytic = function(parameters, parameter, parameterName) {
    parameter = parseInt(parameter);
    for (let i = 0; i < parameters.length; i++) {
      let parameterPair = parameters[i];
      if (parameterPair[0] === parameterName) {
        this.analyticOperation.parameters[i][1] = parameter;
        return;
      }
    }
    return;
  }

  /** Create and initialise the analytic operation with default parameters */
  createAnalytic = function(parameters) {
      this.analyticOperation = {
        class: this.ANALYTIC_CLASS,
        operationName: this.selectedAnalytic.operationName,
        parameters: parameters
      };
  }

  /** Execute the analytic operation */
  executeAnalytic = function() {
    //Convert parameters from an array to a key value map
    let parametersMap = {};
    for (let param of this.analyticOperation.parameters) {
      parametersMap[param[0]] = param[1];
    }
    this.analyticOperation.parameters = parametersMap

    this.query.executeQuery(this.analyticOperation);
  };
}
