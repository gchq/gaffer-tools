import { Component, OnInit, Injectable, ViewChild } from "@angular/core";
import { MatSort, MatTableDataSource } from "@angular/material";
import { cloneDeep } from "lodash";

import { SchemaService } from "../gaffer/schema.service";
import { EventsService } from "../dynamic-input/events.service";
import { ResultsService } from '../gaffer/results.service';
import { TableService } from './table.service';
import { CommonService } from '../dynamic-input/common.service';
import { TypesService } from '../gaffer/type.service';
import { TimeService } from '../gaffer/time.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';

export interface Element {
  junction: string;
  position: number;
  frequency: number;
  vehicle: string;
}

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html"
})
@Injectable()
export class TableComponent implements OnInit {
  groupColumnName = "GROUP";
  typeColumnName = "result type";
  displayedColumns: string[] = [this.groupColumnName,this.typeColumnName, "SOURCE"];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  data: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  schema;

  constructor(private schemaService: SchemaService, 
              private events: EventsService,
              private results: ResultsService,
              private table: TableService,
              private common: CommonService,
              private types: TypesService,
              private time: TimeService) {}

  /**
   * Initialises the controller.
   * Fetches the schema. Fetches the results and processes them.
   * Loads any cached table preferences and subscribes to resultsUpdated events.
   */
  ngOnInit() {
    this.events.subscribe("resultsUpdated", () => this.onResultsUpdated);

    this.schemaService.get().subscribe(
      (gafferSchema) => {
        this.schema = gafferSchema;
        this.loadFromCache();
        this.processResults(this.results.get());
      },
      (err) => {
        this.schema = { types: {}, edges: {}, entities: {} };
        this.loadFromCache();
        this.processResults(this.results.get());
      }
    );

    //this.data = new MatTableDataSource(ELEMENT_DATA)


  }

  ngAfterViewInit() {
    this.data.sort = this.sort;
  }

  /**
   * The controller for the table page.
   * @param {*} schema For looking up information about the different groups and types.
   * @param {*} results For retrieving the results
   * @param {*} table For caching user table view preferences
   * @param {*} events For subscribing to resultsUpdated events
   * @param {*} common For common methods
   * @param {*} types For converting objects based on their types
   * @param {*} time For converting time objects
   * @param {*} csv For downloading results
   * @param {*} $mdDialog For creating chart visualisations
   */

  resultsByType = [];
  filteredResults = [];
  searchTerm = "";

  pagination = { limit: 50, page: 1 };
  sortType = undefined;

  /**
   * Cleans up the controller. Unsubscribes from resultsUpdated events and
   * caches table preferences.
   */
  onDestroy = function() {
    this.events.unsubscribe("resultsUpdated", this.onResultsUpdated);
    this.cacheValues();
  };

  createVisualisation = function(ev) {
    this.$mdDialog
      .show({
        controller: "VisualisationDialogController",
        templateUrl: "app/table/visualisation-dialog/visualisation-dialog.html",
        targetEvent: ev,
        clickOutsideToClose: true,
        // parent: angular.element(document.body),
        locals: {
          columns: this.data.columns,
          data: this.filteredResults
        },
        bindToController: true
      })
      .then(
        function(chart) {
          this.chart = chart;
          this.showVisualisation = true;
        },
        function() {}
      );
  };

  hideVisualisation = function() {
    this.showVisualisation = false;
  };

  hideColumn = function(column) {
    var index = this.data.columns.indexOf(column);
    if (index > -1) {
      this.data.columns.splice(index, 1);
    }
  };

  updateFilteredResults = function() {
    this.data.results = [];
    for (var t in this.data.types) {
      if (this.data.types[t] in this.resultsByType) {
        for (var g in this.data.groups) {
          if (this.data.groups[g] in this.resultsByType[this.data.types[t]]) {
            this.data.results = this.data.results.concat(
              this.resultsByType[this.data.types[t]][this.data.groups[g]]
            );

          }
        }
      }
    }
  };

  /*
   * Text for the select columns component.
   * 'Choose columns' and conditionally shows 'X more' if there are hidden columns.
   */
  selectedColumnsText = function() {
    if (
      this.data.columns &&
      this.data.allColumns &&
      this.data.allColumns.length > this.data.columns.length
    ) {
      return (
        "Choose columns (" +
        (this.data.allColumns.length - this.data.columns.length) +
        " hidden)"
      );
    }
    return "Choose columns";
  };

  onResultsUpdated = function(res) {
    // forcing a cache reload ensures columns are recalculated if they need to be
    this.cacheValues();
    this.loadFromCache();
    this.processResults(res);
  };

  processResults = function(resultsData) {
    var ids = [];
    var groupByProperties = [];
    var properties = [];
    //   resultsByType = {};
    this.data.tooltips = {};

    this.processElements(
      "Edge",
      "edges",
      ["result type", "GROUP", "SOURCE", "DESTINATION", "DIRECTED"],
      ids,
      groupByProperties,
      properties,
      resultsData
    );
    this.processElements(
      "Entity",
      "entities",
      ["result type", "GROUP", "SOURCE"],
      ids,
      groupByProperties,
      properties,
      resultsData
    );
    this.processOtherTypes(ids, properties, resultsData);

    this.data.allColumns = this.common.concatUniqueValues(
      this.common.concatUniqueValues(ids, groupByProperties),
      properties
    );

    if (!this.data.columns || this.data.columns.length === 0) {
      this.data.columns = cloneDeep(this.data.allColumns);
    }
    this.data.allTypes = [];
    this.data.allGroups = [];
    for (var type in this.resultsByType) {
      this.data.allTypes.push(type);
      for (var group in this.resultsByType[type]) {
        this.common.pushValueIfUnique(group, this.data.allGroups);
      }
    }

    if (!this.data.types || this.data.types.length === 0) {
       this.data.types = cloneDeep(this.data.allTypes);
    }
    if (!this.data.groups || this.data.groups.length === 0) {
       this.data.groups = cloneDeep(this.data.allGroups);
    }

    this.updateFilteredResults();
  };

  processElements = function(
    type,
    typePlural,
    idKeys,
    ids,
    groupByProperties,
    properties,
    resultsData
  ) {
    if (
      resultsData[typePlural] &&
      Object.keys(resultsData[typePlural]).length > 0
    ) {
      this.resultsByType[type] = [];
      this.common.pushValuesIfUnique(idKeys, ids);
      for (var i in resultsData[typePlural]) {
        var element = resultsData[typePlural][i];
        if (element) {
          var result = {};
          for (var idIndex in idKeys) {
            var id = idKeys[idIndex];
            if ("SOURCE" === id && element.source === undefined) {
              result[id] = this.convertValue(id, element.vertex);
            } else {
              result[id] = this.convertValue(id, element[id.toLowerCase()]);
            }
          }
          result["result type"] = type;

          if (element.properties) {
            if (!(element.group in this.resultsByType[type])) {
              this.resultsByType[type][element.group] = [];

              var elementDef = this.schema[typePlural][element.group];
              if (elementDef && elementDef.properties) {
                if (elementDef.groupBy) {
                  for (var j in elementDef.groupBy) {
                    var propName = elementDef.groupBy[j];
                    var typeDef = this.schema.types[
                      elementDef.properties[propName]
                    ];
                    if (
                      typeDef &&
                      typeDef.description &&
                      !(propName in this.data.tooltips)
                    ) {
                      this.data.tooltips[propName] = typeDef.description;
                    }
                    this.common.pushValueIfUnique(propName, groupByProperties);
                  }
                }
                for (var propertyName in elementDef.properties) {
                  var typeDef =
                    this.schema.types[elementDef.properties[propertyName]];
                  if (
                    typeDef &&
                    typeDef.description &&
                    !(propertyName in this.data.tooltips)
                  ) {
                    this.data.tooltips[propertyName] = typeDef.description;
                  }
                  this.common.pushValueIfUnique(propertyName, properties);
                }
              }
            }
            for (var prop in element.properties) {
              this.common.pushValueIfUnique(prop, properties);
              result[prop] = this.convertValue(prop, element.properties[prop]);
            }
          }
          if (!(element.group in this.resultsByType[type])) {
            this.resultsByType[type][element.group] = [];
          }
          this.resultsByType[type][element.group].push(result);
        }
      }
    }
  };

  processOtherTypes = function(ids, properties, resultsData) {
    for (var i in resultsData.other) {
      var item = resultsData.other[i];
      if (item) {
        var result = { GROUP: "" };
        for (var key in item) {
          var value = this.convertValue(key, item[key]);
          if ("class" === key) {
            result["result type"] = item[key].split(".").pop();
            this.common.pushValueIfUnique("result type", ids);
          } else if ("vertex" === key) {
            result["SOURCE"] = value;
            this.common.pushValueIfUnique("SOURCE", ids);
          } else if (
            "source" === key ||
            "destination" === key ||
            "directed" === key ||
            "group" === key
          ) {
            var parsedKey = key.toUpperCase();
            result[parsedKey] = value;
            this.common.pushValueIfUnique(parsedKey, ids);
          } else if ("value" === key) {
            result[key] = value;
            this.common.pushValueIfUnique(key, ids);
          } else {
            result[key] = value;
            this.common.pushValueIfUnique(key, properties);
          }
        }
        if (!(result["result type"] in this.resultsByType)) {
          this.resultsByType[result["result type"]] = {};
        }
        if (!(result.GROUP in this.resultsByType[result["result type"]])) {
          this.resultsByType[result["result type"]][result.GROUP] = [];
        }
        this.resultsByType[result["result type"]][result.GROUP].push(result);
      }
    }
  };

  convertValue = function(name, value) {
    var parsedValue = value;
    if (parsedValue) {
      parsedValue = this.types.getShortValue(parsedValue);
      if (this.time.isTimeProperty(name)) {
        parsedValue = this.time.getDateString(name, parsedValue);
      }
    }
    return parsedValue;
  };

  download = function() {
    var mimeType = "data:text/csv;charset=utf-8";
    var data = this.csv.generate(this.filteredResults, this.data.columns);
    var fileName = "gaffer_results_" + Date.now() + ".csv";
    this.downloadData(fileName, data, mimeType);
  };

  downloadData = function(fileName, data, mimeType) {
    var downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(
      new Blob([data], { type: mimeType })
    );
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadLink.href);
  };

  getValue = function() {
    if (!this.sortType) {
      return "";
    }

    if (this.common.startsWith(this.sortType, "-")) {
      return '-"' + this.sortType.substring(1) + '"';
    }

    return '"' + this.sortType + '"';
  };

  loadFromCache = function() {
    var cachedValues = this.table.getCachedValues();
    this.searchTerm = cachedValues.searchTerm;
    this.sortType = cachedValues.sortType;
    this.chart = cachedValues.chart;
    this.showVisualisation = cachedValues.showVisualisation;
    this.data.columns = cachedValues.columns;
    this.data.types = cachedValues.types;
    this.data.groups = cachedValues.groups;

    if (cachedValues.pagination) {
      this.pagination = cachedValues.pagination;
    }
  };

  cacheValues = function() {
    var cachedValues = {
      searchTerm: this.searchTerm,
      sortType: this.sortType,
      pagination: this.pagination,
      chart: this.chart,
      showVisualisation: this.showVisualisation,
      columns : null,
      types: null,
      groups: null,
    };

    if (
      this.data.columns &&
      this.data.allColumns &&
      this.data.columns.length < this.data.allColumns.length
    ) {
      cachedValues.columns = this.data.columns;
    }

    if (
      this.data.types &&
      this.data.allTypes &&
      this.data.types.length < this.data.allTypes.length
    ) {
      cachedValues.types = this.data.types;
    }

    if (
      this.data.groups &&
      this.data.allGroups &&
      this.data.groups.length < this.data.allGroups.length
    ) {
      cachedValues.groups = this.data.groups;
    }

    this.table.setCachedValues(cachedValues);
  };
}
