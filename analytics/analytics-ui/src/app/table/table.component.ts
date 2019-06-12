/*
 * Copyright 2019 Crown Copyright
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

import { Component, OnInit, Injectable, ViewChild } from "@angular/core";
import { MatSort, MatTableDataSource } from "@angular/material";
import { cloneDeep, union } from "lodash";

import { ResultsService } from "../gaffer/results.service";
import { TypeService } from "../gaffer/type.service";
import { TimeService } from "../gaffer/time.service";
import { SchemaService } from "../gaffer/schema.service";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html"
})
@Injectable()
export class TableComponent implements OnInit {
  data = {
    results: new MatTableDataSource([])
  };
  @ViewChild(MatSort) sort: MatSort;
  schema = { edges: {}, entities: {}, types: {} };
  columnsToDisplay: Set<any>;

  constructor(
    private results: ResultsService,
    private types: TypeService,
    private time: TimeService,
    private schemaService: SchemaService
  ) {}

  /**
   * Fetches the results. It first loads the latest types from the config and the latest schema.
   */
  ngOnInit() {
    this.types.get().subscribe(() => {
      this.schemaService.get().subscribe(schema => {
        this.schema = schema;
      });
      const sortedResults = {
        edges: [],
        entities: [],
        other: []
      };
      let results = this.results.get();
      for (let i in results) {
        if (results[i]["class"].split(".").pop() === "Entity") {
          sortedResults.entities.push(results[i]);
        } else if (results[i]["class"].split(".").pop() === "Edge") {
          sortedResults.edges.push(results[i]);
        } else {
          sortedResults.other.push(results[i]);
        }
      }

      this.processResults(sortedResults);
    });
  }

  private processResults = function(resultsData) {
    this.ids = [];
    this.groupByProperties = [];
    this.properties = [];
    this.resultsByType = {};
    this.data.tooltips = {};

    //Transform the edges into a displayable form
    this.processElements(
      "Edge",
      "edges",
      ["result type", "GROUP", "SOURCE", "DESTINATION", "DIRECTED"],
      resultsData
    );
    //Transform the entities into a displayable form
    this.processElements(
      "Entity",
      "entities",
      ["result type", "GROUP", "SOURCE"],
      resultsData
    );
    //Transform the other types into a displayable form
    this.processOtherTypes(resultsData);

    this.data.allColumns = union(union(this.ids, this.groupByProperties), this.properties);

    if (!this.data.columns || this.data.columns.length === 0) {
      this.data.columns = cloneDeep(this.data.allColumns);
    }
    this.data.allTypes = [];
    this.data.allGroups = [];
    for (var type in this.resultsByType) {
      this.data.allTypes.push(type);
      for (var group in this.resultsByType[type]) {
        this.data.allGroups = union([group], this.data.allGroups);
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
    //Set the results to be displayed in the table
    this.data.results = new MatTableDataSource(this.data.results);
    this.columnsToDisplay = this.data.columns;
  };

  private processElements = function(
    type,
    typePlural,
    idKeys,
    resultsData
  ) {
    //If there are elements of this type
    if (
      resultsData[typePlural] &&
      Object.keys(resultsData[typePlural]).length > 0
    ) {
      this.resultsByType[type] = [];
      this.ids = union(idKeys, this.ids);
      //For each element
      for (var i in resultsData[typePlural]) {
        var element = resultsData[typePlural][i];
        if (element) {
          //Convert the ids (i.e. result type, GROUP and SOURCE) into a displayable form for the table
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

          //Get all of the properties to show in the table
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
                    this.groupByProperties = union([propName], this.groupByProperties);
                  }
                }
                for (var propertyName in elementDef.properties) {
                  var typeDef = this.schema.types[
                    elementDef.properties[propertyName]
                  ];
                  if (
                    typeDef &&
                    typeDef.description &&
                    !(propertyName in this.data.tooltips)
                  ) {
                    this.data.tooltips[propertyName] = typeDef.description;
                  }
                  this.properties = union([propertyName], this.properties);
                }
              }
            }
            for (var prop in element.properties) {
              this.properties = union([prop], this.properties);
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

  private processOtherTypes = function(resultsData) {
    for (var i in resultsData.other) {
      var item = resultsData.other[i];
      if (item) {
        var result = { GROUP: "" };
        for (var key in item) {
          var value = this.convertValue(key, item[key]);
          if ("class" === key) {
            result["result type"] = item[key].split(".").pop();
            this.ids = union(["result type"], this.ids);
          } else if ("vertex" === key) {
            result["SOURCE"] = value;
            this.ids = union(["SOURCE"], this.ids);
          } else if (
            "source" === key ||
            "destination" === key ||
            "directed" === key ||
            "group" === key
          ) {
            var parsedKey = key.toUpperCase();
            result[parsedKey] = value;
            this.ids = union([parsedKey], this.ids);
          } else if ("value" === key) {
            result[key] = value;
            this.ids = union([key], this.ids);
          } else {
            result[key] = value;
            this.properties = union([key], this.properties);
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

  private convertValue = function(name, value) {
    var parsedValue = value;
    if (parsedValue) {
      parsedValue = this.types.getShortValue(parsedValue);
      if (this.time.isTimeProperty(name)) {
        parsedValue = this.time.getDateString(name, parsedValue);
      }
    }
    return parsedValue;
  };
}
