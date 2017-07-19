/*
 * Copyright 2016 Crown Copyright
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

angular.module('app').factory('raw', ['$http', 'settings', function($http, settings){
    var raw = {};
    raw.results = {entities: [], edges: [], entitySeeds: [], other: []};
    raw.namedOpClass = "uk.gov.gchq.gaffer.named.operation.NamedOperation";
    raw.availableOps = [];

    var updateResultsListener;
    var updateScope;

    raw.initialise = function(newUpdateResultsListener, newUpdateScope) {
        raw.loadSchema();
        updateResultsListener = newUpdateResultsListener;
        updateScope = newUpdateScope;

        raw.loadNamedOps();
    };

    raw.loadSchema = function() {
        var schema;
        raw.schema = {};
        updateSchemaVertices();
        $http.get(settings.restUrl + "/graph/schema")
             .success(function(data){
                raw.schema = data;
                updateSchemaVertices();
             })
             .error(function(arg) {
                console.log("Unable to load schema: " + arg);
             });
    };

    raw.execute = function(operationChain, onSuccess) {
        var queryUrl = settings.restUrl + "/graph/doOperation";
        if(!queryUrl.startsWith("http")) {
            queryUrl = "http://" + queryUrl;
        }

        if(!onSuccess) {
            onSuccess = raw.updateResults;
        }

        raw.loading = true;
        $.ajax({
            url: queryUrl,
            type: "POST",
            data: operationChain,
            dataType: "json",
            contentType: "application/json",
            accept: "application/json",
            success: function(results){
                raw.loading = false;
                onSuccess(results);
                updateScope();
            },
            error: function(xhr, status, err) {
                console.log(queryUrl, status, err);
                alert("Error: " + xhr.statusCode().responseText);
                raw.loading = false;
                updateScope();
            }
       });
    }

    raw.clearResults = function() {
        raw.results = {entities: [], edges: [], entitySeeds: [], other: []};
    }

    raw.entityProperties = function(entity) {
        if(Object.keys(raw.schema.entities[entity].properties).length) {
            return raw.schema.entities[entity].properties;
        }

        return undefined;
    }

    raw.edgeProperties = function(edge) {
        if(Object.keys(raw.schema.edges[edge].properties).length) {
            return raw.schema.edges[edge].properties;
        }

        return undefined;
    }

    raw.functions = function(group, property, onSuccess) {
        var type;
        if(raw.schema.entities[group]) {
            type = raw.schema.entities[group].properties[property];
        } else if(raw.schema.edges[group]) {
           type = raw.schema.edges[group].properties[property];
       }

       var className = "";
       if(type) {
         className = raw.schema.types[type].class;
       }

       var queryUrl = settings.restUrl + "/graph/filterFunctions/" + className;
       if(!queryUrl.startsWith("http")) {
           queryUrl = "http://" + queryUrl;
       }

       $.ajax({
           url: queryUrl,
           type: "GET",
           accept: "application/json",
           success: onSuccess,
           error: function(xhr, status, err) {
               console.log(queryUrl, status, err);
           }
      });

       return [];
    }

    raw.functionParameters = function(functionClassName, onSuccess) {
          var queryUrl = settings.restUrl + "/graph/serialisedFields/" + functionClassName;
          if(!queryUrl.startsWith("http")) {
              queryUrl = "http://" + queryUrl;
          }


          $.ajax({
              url: queryUrl,
              type: "GET",
              accept: "application/json",
              success: onSuccess,
              error: function(xhr, status, err) {
                  console.log(queryUrl, status, err);
              }
         });
    }

    raw.loadNamedOps = function() {
          raw.execute(JSON.stringify({
              operations: [
                {
                    class: "uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations"
                }
              ]
          }), updateNamedOperations);
    }

    var opAllowed = function(opName) {
        var allowed = true;
        if(settings.whiteList) {
            allowed = settings.whiteList.indexOf(opName) > -1;
        }
        if(allowed && settings.blackList) {
            allowed = settings.backList.indexOf(opName) == -1;
        }
        return allowed;
    }
    var updateNamedOperations = function(results) {
        raw.availableOps = [];
        for(var i in settings.defaultAvailableOps) {
            if(opAllowed(settings.defaultAvailableOps[i].name)) {
                raw.availableOps.push(settings.defaultAvailableOps[i]);
            }
        }

        if(results) {
            for (var i in results) {
                if(opAllowed(results[i].operationName)) {
                    if(results[i].parameters) {
                        for(j in results[i].parameters) {
                            results[i].parameters[j].value = results[i].parameters[j].defaultValue;
                            if(results[i].parameters[j].defaultValue) {
                                var valueClass = results[i].parameters[j].valueClass;
                                results[i].parameters[j].parts = settings.getType(valueClass).createParts(valueClass, results[i].parameters[j].defaultValue);
                            } else {
                                results[i].parameters[j].parts = {};
                            }
                        }
                    }
                    raw.availableOps.push({
                        class: raw.namedOpClass,
                        name: results[i].operationName,
                        parameters: results[i].parameters,
                        description: results[i].description,
                        operations: results[i].operations,
                        view: false,
                        input: true,
                        namedOp: true,
                        inOutFlag: false
                    });
                }
            }
        }
    }

    raw.updateResults = function(results) {
        if(results) {
            for (var i in results) {
                var result = results[i];

                if(result.class === "uk.gov.gchq.gaffer.data.element.Entity") {
                    if(result.vertex !== undefined && result.vertex !== '') {
                        raw.results.entities.push(result);
                        if(raw.results.entitySeeds.indexOf(result.vertex) == -1) {
                            raw.results.entitySeeds.push(result.vertex);
                        }
                    }
                } else if(result.class === "uk.gov.gchq.gaffer.operation.data.EntitySeed") {
                   if(result.vertex !== undefined && result.vertex !== '') {
                       if(raw.results.entitySeeds.indexOf(result.vertex) == -1) {
                           raw.results.entitySeeds.push(result.vertex);
                       }
                   }
                } else if(result.class === "uk.gov.gchq.gaffer.data.element.Edge") {
                    if(result.source !== undefined && result.source !== ''
                         && result.destination !== undefined && result.destination !== '') {
                       raw.results.edges.push(result);

                       if(raw.results.entitySeeds.indexOf(result.source) == -1) {
                           raw.results.entitySeeds.push(result.source);
                       }
                       if(raw.results.entitySeeds.indexOf(result.destination) == -1) {
                           raw.results.entitySeeds.push(result.destination);
                       }
                    }
                } else {
                    raw.results.other.push(result);
                }
            }
        }

        updateResultsListener();
    }

    var updateSchemaVertices = function() {
        var vertices = [];
        if(raw.schema) {
            for(var i in raw.schema.entities) {
                if(vertices.indexOf(raw.schema.entities[i].vertex) == -1) {
                    vertices.push(raw.schema.entities[i].vertex);
                }
            }
            for(var i in raw.schema.edges) {
                if(vertices.indexOf(raw.schema.edges[i].source) == -1) {
                    vertices.push(raw.schema.edges[i].source);
                }
                if(vertices.indexOf(raw.schema.edges[i].destination) == -1) {
                    vertices.push(raw.schema.edges[i].destination);
                }
            }
        }

        raw.schemaVertices = vertices;
    }

    return raw;
} ]);