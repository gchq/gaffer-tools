/*
 * Copyright 2017-2019 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { OperationOptionsService } from "../options/operation-options.service";
import { Observable, Observer } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { CommonService } from '../dynamic-input/common.service';
import { ErrorService } from '../dynamic-input/error.service';
import { TypesService } from './type.service';
import { QueryService } from './query.service';

@Injectable()
export class OperationService {
  constructor(private operationOptions: OperationOptionsService,
              private http: HttpClient,
              private config: ConfigService,
              private common: CommonService,
              private error: ErrorService,
              private types: TypesService,
              private query: QueryService) {}

  availableOperations;
  namedOpClass = "uk.gov.gchq.gaffer.named.operation.NamedOperation";
  deferredAvailableOperations;

  handledFields = ["input", "inputB", "options", "view", "views"];

  handledFieldClasses = ["uk.gov.gchq.gaffer.data.elementdefinition.view.View"];

  canHandleField = function(field) {
    return (
      this.types.isKnown(field.className) ||
      this.handledFieldClasses.indexOf(field.className) > -1 ||
      this.handledFields.indexOf(field.name) > -1
    );
  };

  canHandleOperation = function(operation) {
    for (var i in operation.fields) {
      if (!this.canHandleField(operation.fields[i])) {
        return false;
      }
    }
    return true;
  };

  getAvailableOperations = function() {
    if (this.availableOperations) {
      return this.$q.when(this.availableOperations);
    } else if (!this.deferredAvailableOperations) {
      this.deferredAvailableOperations = this.$q.defer();
      this.reloadOperations(false).then(function() {
        this.deferredAvailableOperations.resolve(this.availableOperations);
      });
    }

    return this.deferredAvailableOperations.promise;
  };

  private hasInputB = function(first, availableOps) {
    for (var i in availableOps) {
      if (
        availableOps[i].class &&
        this.common.endsWith(availableOps[i].class, first)
      ) {
        return availableOps[i].fields["inputB"];
      }
    }

    return false;
  };

  private getInputType = function(first, availableOps) {
    for (var i in availableOps) {
      if (
        availableOps[i].class &&
        this.common.endsWith(availableOps[i].class, first)
      ) {
        return availableOps[i].fields["input"];
      }
    }

    return undefined;
  };

  private opAllowed = function(opName, configuredOperations) {
    if (!configuredOperations) {
      return true; // allow all by default
    }

    var allowed = true;

    var whiteList = configuredOperations.whiteList;
    var blackList = configuredOperations.blackList;

    if (whiteList) {
      allowed = whiteList.indexOf(opName) > -1;
    }
    if (allowed && blackList) {
      allowed = blackList.indexOf(opName) == -1;
    }
    return allowed;
  };

  private addOperations = function(operations, conf) {
    if (operations) {
      for (var i in operations) {
        var op = operations[i];

        if (
          this.opAllowed(op.name, conf.operations) &&
          this.canHandleOperation(op)
        ) {
          var fields = {};
          for (var j in op.fields) {
            fields[op.fields[j].name] = op.fields[j];
          }
          var availableOp = {
            class: op.name,
            name: this.common.toTitle(op.name),
            description: op.summary,
            fields: fields,
            next: op.next
          };
          this.availableOperations.push(availableOp);
        }
      }
    }
  };

  private addNamedOperations = function(operations) {
    this.config.get().subscribe((conf) => {
      if (operations) {
        for (var i in operations) {
          var op = operations[i];
          if (this.opAllowed(op.operationName, conf.operations)) {
            if (op.parameters) {
              for (var j in op.parameters) {
                op.parameters[j].value = op.parameters[j].defaultValue;
                if (op.parameters[j].defaultValue) {
                  var valueClass = op.parameters[j].valueClass;
                  op.parameters[j].parts = this.types.createParts(
                    valueClass,
                    op.parameters[j].defaultValue
                  );
                } else {
                  op.parameters[j].parts = {};
                }
              }
            }

            var opChain = JSON.parse(op.operations);
            var first = opChain.operations[0].class;

            var inputB = this.hasInputB(first, this.availableOperations);

            if (inputB) {
              if (op.parameters && op.parameters["inputB"]) {
                delete op.parameters["inputB"];
                // to avoid it coming up in the parameters section
                if (Object.keys(op.parameters).length === 0) {
                  op.parameters = undefined;
                }
              } else {
                console.log(
                  "Named operation " +
                    op.operationName +
                    ' starts with a GetElementsBetweenSets operation but does not contain an "inputB" parameter. This is not supported by the UI'
                );
                continue;
              }
            }

            var availableOp = {
              class: this.namedOpClass,
              name: op.operationName,
              parameters: op.parameters,
              description: op.description,
              operations: op.operations,
              fields: {
                input: this.getInputType(first, this.availableOperations),
                inputB: inputB
              },
              namedOp: true
            };
            this.availableOperations.push(availableOp);
          }
        }
      }
    });
  };

  // reloadOperations = function(loud) {
  //   var observable = Observable.create((observer: Observer<String>) => {
  //     this.config.get().subscribe((conf) => {
  //       var queryUrl = this.common.parseUrl(
  //         conf.restEndpoint + "/graph/operations/details"
  //       );
  //       this.http.get(queryUrl).subscribe(
  //         (data) => {
  //           this.availableOperations = [];
  //           this.addOperations(data, conf);
  //           var getAllClass =
  //             "uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations";
  //           if (
  //             this.common.arrayContainsObjectWithValue(
  //               this.availableOperations,
  //               "class",
  //               getAllClass
  //             )
  //           ) {
  //             this.query.execute(
  //               {
  //                 class: getAllClass,
  //                 options: this.operationOptions.getDefaultOperationOptions()
  //               },
  //               (result) => {
  //                 this.addNamedOperations(result, conf);
  //                 observer.next(this.availableOperations);
  //               },
  //               (err) => {
  //                 if (loud) {
  //                   this.error.handle("Failed to load named operations", err);
  //                   observer.error(err);
  //                 }
  //                 observer.next(this.availableOperations);
  //               }
  //             );
  //           } else {
  //             observer.next(this.availableOperations);
  //           }
  //         },
  //         (err) => {
  //           this.error.handle("Unable to load operations", err.data);
  //           observer.next(null); // []
  //         }
  //       );
  //     });
  //   });

  //   return observable;
  // };

  reloadOperations = function(loud) {
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
              this.error.handle("Failed to load analytics", err);
              observer.error(err);
              } else {
                observer.next(err)
              }
            }
          )
      })
    })

    return observable;
  }

  ifOperationSupported = function(operationClass, onSupported, onUnsupported) {
    this.config.get().then(function(conf) {
      var queryUrl = this.common.parseUrl(
        conf.restEndpoint + "/graph/operations"
      );

      this.http.get(queryUrl).then(
        function(response) {
          var ops = response.data;
          if (ops.indexOf(operationClass) !== -1) {
            onSupported();
            return;
          }
          onUnsupported();
        },
        function(err) {
          this.error.handle(
            "Error getting available graph operations",
            err.data
          );
          onUnsupported();
        }
      );
    });
  };

  createGetSchemaOperation = function() {
    var options = this.operationOptions.getDefaultOperationOptions();
    if (!options) {
      options = {};
    }

    return {
      class: "uk.gov.gchq.gaffer.store.operation.GetSchema",
      compact: false,
      options: options
    };
  };

  createLimitOperation = function(opOptions) {
    if (!opOptions) {
      opOptions = {};
    }
    return {
      class: "uk.gov.gchq.gaffer.operation.impl.Limit",
      resultLimit: this.settings.getResultLimit(),
      options: opOptions
    };
  };

  createDeduplicateOperation = function(opOptions) {
    if (!opOptions) {
      opOptions = {};
    }
    return {
      class: "uk.gov.gchq.gaffer.operation.impl.output.ToSet",
      options: opOptions
    };
  };

  createCountOperation = function(opOptions) {
    if (!opOptions) {
      opOptions = {};
    }
    return {
      class: "uk.gov.gchq.gaffer.operation.impl.Count",
      options: opOptions
    };
  };
}
