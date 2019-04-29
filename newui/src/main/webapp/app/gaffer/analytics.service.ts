import { Injectable } from '@angular/core';
import { QueryService } from './query.service';
import { Observable, Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from '../config/config.service';
import { ErrorService } from '../dynamic-input/error.service';
import { CommonService } from '../dynamic-input/common.service';

//Used to store and get the selected analytic
@Injectable()
export class AnalyticsService {
  selectedAnalytic; //The selected analytic
  analyticOperation; //The analytic Operation to execute

  ANALYTIC_CLASS = 'uk.gov.gchq.gaffer.operation.analytic.AnalyticOperation'

  constructor(private query: QueryService,
              private config: ConfigService,
              private error: ErrorService,
              private common: CommonService,
              private http: HttpClient) {}

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
    if (this.analyticOperation.parameters != null) {
      let parametersMap = {};
      for (let param of this.analyticOperation.parameters) {
        parametersMap[param[0]] = param[1];
      }
      this.analyticOperation.parameters = parametersMap
    }

    this.query.executeQuery(this.analyticOperation);
  };

  reloadAnalytics = function(loud) {
    var observable = Observable.create((observer: Observer<String>) => {
      var operation = {
        "class": "uk.gov.gchq.gaffer.operation.analytic.GetAllAnalyticOperations"
      }
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      this.config.get().subscribe((conf) => {
          var queryUrl = this.common.parseUrl(conf.restEndpoint + "/graph/operations/execute");
          this.http.post(queryUrl, operation, { headers: headers} ).subscribe(
            (data) => {
              observer.next(data)
            },
            (err) => {
              if (loud) {
              this.error.handle("Failed to load analytics", null, err);
              observer.error(err);
              } else {
                observer.next(err)
              }
            }
          )
      })
    })
    return observable;
  };
}
