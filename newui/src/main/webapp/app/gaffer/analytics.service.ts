import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { QueryService } from './query.service';
import { ConfigService } from '../config/config.service';
import { ErrorService } from '../dynamic-input/error.service';
import { CommonService } from '../dynamic-input/common.service';
import { ResultsService } from './results.service';
import { cloneDeep } from 'lodash';

//Used to store and get the selected analytic
@Injectable()
export class AnalyticsService {
  arrayAnalytic; //The analytic with array parameters

  ANALYTIC_CLASS = "uk.gov.gchq.gaffer.operation.analytic.AnalyticOperation";

  constructor(
    private query: QueryService,
    private config: ConfigService,
    private error: ErrorService,
    private common: CommonService,
    private http: HttpClient,
    private router: Router,
    private results: ResultsService
  ) {}

  /** Get the chosen analytic on load of parameters page */
  getAnalytic() {
    return this.arrayAnalytic;
  }

  /** Update the analytic operation on change of parameters */
  updateAnalytic = function(parameters, newValue, parameterName) {
    //Convert to an integer
    newValue = parseInt(newValue);
    //Look for the parameter in the list of parameters and set the new current value
    for (let i = 0; i < parameters.length; i++) {
      let parameterPair = parameters[i];
      if (parameterPair[0] === parameterName) {
        this.arrayAnalytic.parameters[i][1].currentValue = newValue;
        return;
      }
    }
    return;
  };

  /** Create an analytic with array parameters that can be iterated over */
  createArrayAnalytic = function(analytic) {

      //Convert the key value map of parameters into an iterable array
      let arrayParams = analytic.parameters;
      if (arrayParams != null || arrayParams != undefined) {
        arrayParams = Object.keys(analytic.parameters).map(function(key) {
          return [key, analytic.parameters[key]];
        });

        //Add a new key and value in parameters to store the current value of that parameter
        for (let i = 0; i < arrayParams.length; i++) {
          arrayParams[i][1].currentValue = arrayParams[i][1].defaultValue;
        }
      } else {
        arrayParams = null;
      }

      //Create the analytic operation from these parameters if any
      this.arrayAnalytic = {
        class: this.ANALYTIC_CLASS,
        operationName: analytic.operationName,
        parameters: arrayParams
      };
  }

  /** Execute the analytic operation */
  executeAnalytic = function() {
    let operation = cloneDeep(this.arrayAnalytic);

    //Convert parameters from an array to a key value map 
    //so the parameters are in the correct form when they reach the server
    if (this.arrayAnalytic.parameters != null) {
      let parametersMap = {};
      for (let param of this.arrayAnalytic.parameters) {
        parametersMap[param[0]] = param[1].currentValue;
      }
      operation.parameters = parametersMap;
    }

    //Clear the current results
    this.results.clear();

    //Execute the analytic and then navigate when finished loading
    this.query.executeQuery(operation, () => {
      this.router.navigate(['/results'])});
  };

  /** Get the analytics from the server */
  reloadAnalytics = function(loud) {
    let observable = Observable.create((observer: Observer<String>) => {
      let operation = {
        class: "uk.gov.gchq.gaffer.operation.analytic.GetAllAnalyticOperations"
      };
      //Configure the http headers
      let headers = new HttpHeaders();
      headers = headers.set("Content-Type", "application/json; charset=utf-8");
      //Get the config
      this.config.get().subscribe(
        //On success
        conf => {
          //Make the http request
          let queryUrl = this.common.parseUrl(
            conf.restEndpoint + "/graph/operations/execute"
          );
          this.http.post(queryUrl, operation, { headers: headers }).subscribe(
            //On success
            data => {
              observer.next(data);
            },
            //On error
            err => {
              if (loud) {
                this.error.handle(
                  "Failed to load analytics, see the console for details",
                  null,
                  err
                );
                console.error(err);
                observer.error(err);
              } else {
                observer.next(err);
              }
            }
          );
        },
        //On error
        err => {
          if (loud) {
            this.error.handle(
              "Failed to load config, see the console for details",
              null,
              err
            );
            console.error(err);
            observer.error(err);
          } else {
            observer.next(err);
          }
        }
      );
    });
    return observable;
  };
}
