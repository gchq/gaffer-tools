import { Injectable } from '@angular/core';
import { QueryService } from './query.service';
import { Observable, Observer } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigService } from '../config/config.service';
import { ErrorService } from '../dynamic-input/error.service';
import { CommonService } from '../dynamic-input/common.service';
import { Router } from '@angular/router';
import { ResultsService } from './results.service';

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
              private http: HttpClient,
              private router: Router,
              private results: ResultsService) {}

  /** Store the chosen analytic */
  setAnalytic(analytic) {
    this.selectedAnalytic = analytic;
  }

  /** Get the chosen analytic on load of parameters page */
  getAnalytic() {
    return this.selectedAnalytic;
  }

  /** Update the analytic operation on change of parameters */
  updateAnalytic = function(parameters, newValue, parameterName) {
    //Convert to an integer
    newValue = parseInt(newValue);
    //Look for the parameter in the list of parameters and set the new current value
    for (let i = 0; i < parameters.length; i++) {
      let parameterPair = parameters[i];
      if (parameterPair[0] === parameterName) {
        this.analyticOperation.parameters[i][1].currentValue = newValue;
        return;
      }
    }
    return;
  }

  /** Create and initialise the analytic operation with default parameters */
  createAnalytic = function(parameters) {
      //Add a new key and value in parameters to store the current value of that parameter
      if (parameters) {
        for (let i = 0; i < parameters.length; i++) {
          parameters[i][1].currentValue = parameters[i][1].defaultValue;
        }
      }
      //Create the analytic operation from these parameters if any
      this.analyticOperation = {
        class: this.ANALYTIC_CLASS,
        operationName: this.selectedAnalytic.operationName,
        parameters: parameters
      };
  }

  /** Execute the analytic operation */
  executeAnalytic = function() {
    //Convert parameters from an array to a key value map 
    //so the parameters are in the correct form when they reach the server
    if (this.analyticOperation.parameters != null) {
      let parametersMap = {};
      for (let param of this.analyticOperation.parameters) {
        parametersMap[param[0]] = param[1].currentValue;
      }
      this.analyticOperation.parameters = parametersMap
    }

    //Clear the current results
    this.results.clear();

    //Execute the analytic and then navigate when finished loading
    this.query.executeQuery(this.analyticOperation, () => {
      this.router.navigate(['/results'])});
  };

  /** Get the analytics from the server */
  reloadAnalytics = function(loud) {
    var observable = Observable.create((observer: Observer<String>) => {
      var operation = {
        "class": "uk.gov.gchq.gaffer.operation.analytic.GetAllAnalyticOperations"
      }
      //Configure the http headers
      let headers = new HttpHeaders();
      headers = headers.set('Content-Type', 'application/json; charset=utf-8');
      //Get the config
      this.config.get().subscribe(
          //On success
          (conf) => {
            //Make the http request
            var queryUrl = this.common.parseUrl(conf.restEndpoint + "/graph/operations/execute");
            this.http.post(queryUrl, operation, { headers: headers} ).subscribe(
                //On success
                (data) => {
                  observer.next(data)
                },
                //On error
                (err) => {
                  if (loud) {
                  this.error.handle("Failed to load analytics", null, err);
                  observer.error(err);
                  } else {
                    observer.next(err)
                  }
                }
            )
          },
          //On error
          (err) => {
            if (loud) {
            this.error.handle("Failed to load config", null, err);
            observer.error(err);
            } else {
              observer.next(err)
            }
          }
      )
    })
  return observable;
  }
}
