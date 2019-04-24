import { Component, OnInit, Injectable, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { AnalyticsService } from "../analytics/analytics.service";
import { ConfigService } from "../config/config.service";
import { QueryService } from '../gaffer/query.service';

@Component({
  selector: "app-parameter-input",
  templateUrl: "./parameter-input.component.html",
  styleUrls: ["./parameter-input.component.css"]
})
@Injectable()
export class ParameterInputComponent implements OnInit {
  analytic;
  timeConfig;
  @ViewChild("operationChainForm") operationChainForm;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private analyticsService: AnalyticsService,
    private config: ConfigService,
    private query: QueryService
  ) {}

  ngOnInit() {
    //Get the analytic from the analyticsService
    this.analytic = this.analyticsService.getAnalytic();
    console.log(this.analytic);

    this.config.get().subscribe(function(conf) {
      this.timeConfig = conf.time;
    });
  }

  NAMED_VIEW_CLASS = "uk.gov.gchq.gaffer.data.elementdefinition.view.NamedView";
  OPERATION_CHAIN_CLASS = "uk.gov.gchq.gaffer.operation.OperationChain";
  ANALYTIC_CLASS = 'uk.gov.gchq.gaffer.operation.analytic.AnalyticOperation'
  ENTITY_SEED_CLASS = "uk.gov.gchq.gaffer.operation.data.EntitySeed";
  PAIR_ARRAY_CLASS =
    "uk.gov.gchq.gaffer.commonutil.pair.Pair<uk.gov.gchq.gaffer.data.element.id.ElementId,uk.gov.gchq.gaffer.data.element.id.ElementId>[]";
  PAIR_CLASS = "uk.gov.gchq.gaffer.commonutil.pair.Pair";

  addOperation = function() {
    for (var i in this.operations) {
      this.operations[i].expanded = false; // close all open tabs
    }
    this.operationChain.add(false);
  };

  $onDestroy = function() {
    this.operationChain.setOperationChain(this.operations);
  };

  deleteOperation = function(index) {
    this.operations.splice(index, 1);
    if (index === 0 && this.operations[0].fields.input === null) {
      this.operations[0].fields.input = [];
      this.operations[0].fields.inputPairs = [];
    }
    this.events.broadcast("onOperationUpdate", []);
  };

  resetOperation = function(index) {
    var inputFlag = index === 0;
    this.operations[index] = this.operationChain.createBlankOperation(inputFlag

    );
  };

  isNotLast = function(index) {
    return index !== this.operations.length - 1;
  };

  canExecute = function() {
    return this.operationChainForm.$valid && !this.loading.isLoading();
  };

  executeAnalytic = function() {
    // this.events.broadcast("onPreExecute", []);
    // if (!this.canExecute()) {
    //   return;
    // }

    // if (this.operations.length === 0) {
    //   this.error.handle("Unable to run operation chain with no operations");
    //   return;
    // }

    //Create the analytic operation to be executed
    var analyticOperation = {
      class: this.ANALYTIC_CLASS,
      operationName: this.analytic.operationName,
      parameters: {}
    };

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

    this.query.executeQuery(analyticOperation);
  };

  resetChain = function(ev) {
    var confirm = this.$mdDialog
      .confirm()
      .title("Are your sure you want to reset the chain?")
      .textContent("Once you reset the chain, all your progress will be lost")
      .ariaLabel("clear operations")
      .targetEvent(ev)
      .ok("Reset chain")
      .cancel("Cancel");

    this.$mdDialog.show(confirm).then(
      function() {
        this.operationChain.reset();
        this.operations = this.operationChain.getOperationChain();
      },
      function() {
        // do nothing if they don't want to reset
      }
    );
  };

  /**
   * First checks fires an event so that all watchers may do last minute changes.
   * Once done, it does a final check to make sure the operation can execute. If so
   * it executes it.
   */
  execute = function(op) {
    this.events.broadcast("onPreExecute", []);
    if (!this.canExecute()) {
      return;
    }
    var operation = this.createOperationForQuery(op);
    this.query.addOperation(operation);

    var operations = [operation];
    if (op.selectedOperation.iterableOutput) {
      operations.push(
        this.operationService.createLimitOperation(operation["options"])
      );
      operations.push(
        this.operationService.createDeduplicateOperation(operation["options"])
      );
    }
    this.runQuery(operations);
  };

  canAddOperation = function() {
    if (this.operations.length == 0) {
      return true;
    }

    return (
      this.operations[this.operations.length - 1].selectedOperation !==
      undefined
    );
  };

  runQuery = function(operations) {
    this.loading.load();
    this.query.executeQuery(
      {
        class: this.OPERATION_CHAIN_CLASS,
        operations: operations
      },
      function(data) {
        this.submitResults(data);
      }
    );
  };

  /**
   * Deselects all elements in the graph and resets all query related services
   * @param {Array} data the data returned by the rest service
   */
  submitResults(data) {
    // this.graph.deselectAll();
    this.router.navigate(["/results"]);

    // Remove the input query param
    // delete this.$routeParams["input"];
    // this.$location.search("input", null);
  }

  /**
   * Uses seeds uploaded to the input service to build an input array to the query.
   * @param seeds the input array
   */
  createOpInput = function(seeds, inputType) {
    if (seeds === null || seeds === undefined || !inputType) {
      return undefined;
    }

    var inputTypeName;
    if (typeof inputType === "object" && "className" in inputType) {
      inputTypeName = inputType.className;
    } else {
      inputTypeName = "java.lang.Object[]";
    }
    var isArray = this.common.endsWith(inputTypeName, "[]");
    var opInput;
    if (isArray) {
      opInput = [];
      var inputItemType = inputTypeName.substring(0, inputTypeName.length - 2);

      // Assume the input type is EntityId if it is just Object or unknown.
      if (inputItemType === "" || inputItemType === "java.lang.Object") {
        inputItemType = "uk.gov.gchq.gaffer.data.element.id.EntityId";
      }

      var seedToJson = function(seed) {
        return this.types.createJsonValue(seed.valueClass, seeds[i].parts);
      };
      var formatSeed;
      if (inputItemType === "uk.gov.gchq.gaffer.data.element.id.EntityId") {
        formatSeed = function(seed) {
          return {
            class: this.ENTITY_SEED_CLASS,
            vertex: seedToJson(seed)
          };
        };
      } else {
        formatSeed = function(seed) {
          return seedToJson(seed);
        };
      }
      for (var i in seeds) {
        opInput.push(formatSeed(seeds[i]));
      }
    } else {
      opInput = seeds;
    }

    return opInput;
  };

  /**
   * Create an array of JSON serialisable Pair objects from the values created by the input component
   * @param {any[]} pairs
   */
  createPairInput = function(pairs) {
    if (pairs === null || pairs === undefined) {
      return undefined;
    }
    var opInput = [];

    for (var i in pairs) {
      opInput.push({
        class: this.PAIR_CLASS,
        first: {
          "uk.gov.gchq.gaffer.operation.data.EntitySeed": {
            vertex: this.types.createJsonValue(
              pairs[i].first.valueClass,
              pairs[i].first.parts
            )
          }
        },
        second: {
          "uk.gov.gchq.gaffer.operation.data.EntitySeed": {
            vertex: this.types.createJsonValue(
              pairs[i].second.valueClass,
              pairs[i].second.parts
            )
          }
        }
      });
    }

    return opInput;
  };

  /**
   * Creates a Gaffer Filter based on parameters supplied by the user.
   * @param {Object} filter A filter created by the user
   */
  generateFilterFunction = function(filter) {
    var functionJson = {
      predicate: {
        class: filter.predicate
      },
      selection: [filter.property]
    };

    for (var paramName in filter.availableFunctionParameters) {
      if (filter.parameters[paramName] !== undefined) {
        if (this.types.isKnown(filter.availableFunctionParameters[paramName])) {
          functionJson["predicate"][paramName] = this.types.createValue(
            filter.parameters[paramName].valueClass,
            filter.parameters[paramName].parts
          );
        } else {
          functionJson["predicate"][paramName] = this.types.createJsonValue(
            filter.parameters[paramName].valueClass,
            filter.parameters[paramName].parts
          );
        }
      }
    }

    return functionJson;
  };

  /**
   * Builds part of a gaffer view with an array of element groups to include, along with the filters to apply
   * @param {Array} groupArray The array of groups for a given element, included in the view
   * @param {Object} filters A key value list of group -> array of filters
   * @param {Object} destination Where to add the filters
   */
  createElementView = function(groupArray, filters, destination) {
    for (var i in groupArray) {
      var group = groupArray[i];
      destination[group] = {};

      for (var i in filters[group]) {
        var filter = filters[group][i];
        if (filter.preAggregation) {
          if (!destination[group].preAggregationFilterFunctions) {
            destination[group].preAggregationFilterFunctions = [];
          }
          destination[group].preAggregationFilterFunctions.push(
            this.generateFilterFunction(filter)
          );
        } else {
          if (!destination[group].postAggregationFilterFunctions) {
            destination[group].postAggregationFilterFunctions = [];
          }
          destination[group].postAggregationFilterFunctions.push(
            this.generateFilterFunction(filter)
          );
        }
      }
    }
  };

  /**
   * Builds a Gaffer operation based on the UI operation given to it
   * @param {object} operation The UI operation
   */
  createOperationForQuery = function(operation) {
    var selectedOp = operation.selectedOperation;
    var op = {
      class: selectedOp.class
    };

    if (selectedOp.namedOp) {
      this.op.operationName = selectedOp.name;
    }

    for (var name in selectedOp.fields) {
      var field = operation.fields[name];
      if (field && field.parts && Object.keys(field.parts).length > 0) {
        op[name] = this.types.createJsonValue(field.valueClass, field.parts);
      }
    }

    if (selectedOp.fields.input) {
      if (selectedOp.fields.input.className === this.PAIR_ARRAY_CLASS) {
        this.op.input = this.createPairInput(operation.fields.inputPairs);
      } else {
        this.op.input = this.createOpInput(
          operation.fields.input,
          selectedOp.fields.input
        );
      }
    }

    if (selectedOp.fields.inputB && !selectedOp.namedOp) {
      this.op.inputB = this.createOpInput(
        operation.fields.inputB,
        selectedOp.fields.inputB
      );
    }

    if (selectedOp.parameters) {
      var opParams = {};
      for (name in selectedOp.parameters) {
        var valueClass = selectedOp.parameters[name].valueClass;
        var value = this.types.createValue(
          valueClass,
          selectedOp.parameters[name].parts
        );
        if (
          selectedOp.parameters[name].required ||
          (value !== "" && value !== null)
        ) {
          opParams[name] = value;
        }
      }
      this.op.parameters = opParams;
    }

    if (selectedOp.fields.inputB && selectedOp.namedOp) {
      if (!this.op.parameters) {
        this.op.parameters = {};
      }
      this.op.parameters["inputB"] = this.createOpInput(
        operation.fields.inputB,
        selectedOp.fields.inputB
      );
    }

    if (selectedOp.fields.view) {
      var namedViews = operation.fields.view.namedViews;
      var viewEdges = operation.fields.view.viewEdges;
      var viewEntities = operation.fields.view.viewEntities;
      var edgeFilters = operation.fields.view.edgeFilters;
      var entityFilters = operation.fields.view.entityFilters;

      this.op.view = {
        entities: {},
        edges: {},
        globalElements: []
      };

      if (operation.fields.view.summarise) {
        this.op.view.globalElements.push({
          groupBy: []
        });
      }

      this.createElementView(
        viewEntities,
        entityFilters,
        this.op.view.entities
      );
      this.createElementView(viewEdges, edgeFilters, this.op.view.edges);

      if (
        operation.dates.startDate !== undefined &&
        operation.dates.startDate !== null
      ) {
        this.op.view.globalElements.push({
          preAggregationFilterFunctions: [
            {
              predicate: {
                class: "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                orEqualTo: true,
                value: this.types.createJsonValue(
                  this.timeConfig.filter.class,
                  operation.dates.startDate
                )
              },
              selection: [this.timeConfig.filter.startProperty]
            }
          ]
        });
      }

      if (
        operation.dates.endDate !== undefined &&
        operation.dates.endDate !== null
      ) {
        this.op.view.globalElements.push({
          preAggregationFilterFunctions: [
            {
              predicate: {
                class: "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
                orEqualTo: true,
                value: this.types.createJsonValue(
                  this.timeConfig.filter.class,
                  operation.dates.endDate
                )
              },
              selection: [this.timeConfig.filter.endProperty]
            }
          ]
        });
      }
    }

    if (namedViews && namedViews.length > 0) {
      this.op.views = [];
      for (var i in namedViews) {
        var viewParams = {};
        for (name in namedViews[i].parameters) {
          var valueClass = namedViews[i].parameters[name].valueClass;
          var value = this.types.createValue(
            valueClass,
            namedViews[i].parameters[name].parts
          );
          if (
            namedViews[i].parameters[name].required ||
            (value !== "" && value !== null)
          ) {
            viewParams[name] = value;
          }
        }
        this.op.views.push({
          class: this.NAMED_VIEW_CLASS,
          name: namedViews[i].name,
          parameters: viewParams
        });
      }
      if (this.op.view) {
        this.op.views.push(this.op.view);
        delete op["view"];
      }
    }

    if (operation.fields && operation.fields.options) {
      this.op.options = this.operationOptions.extractOperationOptions(
        operation.fields.options
      );
    }

    return op;
  };
}
