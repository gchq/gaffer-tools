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
 
var app = angular.module('app', []);

app.config(['$locationProvider', function AppConfig($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.factory('elementsGraph', [ '$q', function( $q ){
  var cy;
  var elementsGraph = function(vertices, edges){
    var deferred = $q.defer();

    var eles = [];
    $(function(){ // on dom ready
      
      cy = cytoscape({
        container: $('#cy')[0],
        style: [
            {
                selector: 'node',
                style: {
                  'content': 'data(label)',
                  'text-valign': 'center',
                  'background-color': '#337ab7',
                  'font-size': 14,
                  'color': '#fff',
                  'text-outline-width':1,
                  'width': '60',
                  'height': '60',
                }
            },
            {
                selector: 'edge',
                style: {
                  'curve-style': 'bezier',
                  'label': 'data(group)',
                  'line-color': '#73AD21',
                  'target-arrow-color': '#73AD21',
                  'target-arrow-shape': 'triangle',
                  'font-size': 14,
                  'color': '#fff',
                  'text-outline-width':1,
                  'width': 5
                }
            },
            {
                selector: ':selected',
                css: {
                    'background-color': '#b92c28',
                    'line-color': '#b92c28',
                    'target-arrow-color': '#b92c28'
                }
            },
            {
                selector: '.edgehandles-preview, .edgehandles-ghost-edge',
                css: {
                    'label': 'data(group)',
                    'line-color': '#73AD21',
                    'target-arrow-color': '#73AD21'
                }
            }
        ],
        layout: {
           name: 'preset'
        },
        elements: eles,
        ready: function(){
          deferred.resolve( this );
        }
      });

      cy.on('select', function(evt){
        fire('onElementSelect', [evt.cyTarget.id()]);
      });

      cy.on('unselect', function(evt){
        fire('onElementUnselect');
      });

      // add edgehandles
      var edgehandlesConfig = {
        complete: function( sourceNode, targetNodes, addedEntities ) {
            var edge = {
               id:  addedEntities.data().id,
               source:  addedEntities.data().source,
               destination:  addedEntities.data().target,
               sourcePrev:  addedEntities.data().source,
               destinationPrev:  addedEntities.data().target,
               directed: true
            };
            cy.$('#' + edge.id).data('group', '');
            fire('onEdgeAdded', [edge]);
        },
        handleColor: '#73AD21'
      };
      cy.edgehandles( edgehandlesConfig );

    }); // on dom ready
    
    return deferred.promise;
  };
  
  elementsGraph.listeners = {};
  
  function fire(e, args){
    var listeners = elementsGraph.listeners[e];
    
    for( var i = 0; listeners && i < listeners.length; i++ ){
      var fn = listeners[i];
      
      fn.apply( fn, args );
    }
  }
  
  function listen(e, fn){
    var listeners = elementsGraph.listeners[e] = elementsGraph.listeners[e] || [];
    
    listeners.push(fn);
  }

  elementsGraph.addVertex = function(vertex) {
    var borderTop = 80;
    var borderRight = 150;
    var borderLeft = 150;
    var borderBottom = 150;
    var width = window.innerWidth - borderLeft - borderRight;
    var height = window.innerHeight - borderTop - borderBottom;
    cy.add({
        group: 'nodes',
        data: {
          id: vertex._id,
          label: vertex.id
       },
        position: {
          x: Math.floor((Math.random()*width + borderLeft)),
          y: Math.floor((Math.random()*height + borderTop))
        }
    });
  }

  elementsGraph.addEdge = function(edge) {
      cy.add({
          group: 'edges',
          data: {
            id: edge.id,
            source: edge.source,
            target: edge.destination,
            group: edge.group.name
          }
      });
    }

  elementsGraph.setVertexId = function(_id, id){
      cy.$('#' + _id).data('label', id);
    };

  elementsGraph.setEdgeSource = function(id, source){
    cy.$('#' + id).data('source', name);
  };

  elementsGraph.setEdgeDestination = function(id, destination){
      cy.$('#' + id).data('target', destination);
    };

    elementsGraph.onElementSelect = function(fn){
      listen('onElementSelect', fn);
    };

    elementsGraph.onElementUnselect = function(fn){
      listen('onElementUnselect', fn);
    };

    elementsGraph.setEdgeGroup = function(id, groupName){
      cy.$('#' + id).data('group', groupName);
    };

    elementsGraph.onEdgeAdded = function(fn){
    listen('onEdgeAdded', fn);
  };

  elementsGraph.removeElement = function(id){
        cy.$('#' + id).remove(id);
      };

  elementsGraph.clear = function(){
      while(cy.elements().length > 0) {
        cy.remove(cy.elements()[0]);
      }
    };

  elementsGraph.redraw = function() {
      cy.layout({name: 'circle'});
    }

  return elementsGraph;
} ]);

app.controller('ElementsCtrl', [ '$scope', '$http', '$location', 'elementsGraph', function($scope, $http, $location, elementsGraph){
  var cy
  $scope.showGraph = true;

  $scope.verticesById = {};
  $scope.edgesById = {};

  $scope.dataSchema = "{}";
  $scope.dataTypes = "{}";
  $scope.storeTypes = "{}";

  var vertexIndex = 0;
  var edgeIndex = 0;

  var entityGroupIndex = 0;
  var edgeGroupIndex = 0;

  $scope.types = {};
  $scope.positions = [{key: '', value: ''}, {key: 'key', value: 'KEY'}, {key: 'value', value: 'VALUE'}];

  $scope.showTypes = false;
  $scope.showSchema = false;
  $scope.validSchema = true;

  $scope.addType = function(typeName, typeDef) {
      if(!typeName) {
        typeName = 'type' + (Object.keys($scope.types).length + 1);
      }

      if(!typeDef) {
         typeDef = {aggregateFunction: {class: ''}, serialiser: '', position: 'VALUE'};
      }
      $scope.types[typeName] = typeDef;
      $scope.onTypeClassChange(typeName);
  }

  $scope.onTypeNameChange = function(newTypeName, prevTypeName) {
    var newTypes = {};
    for (var typeName in $scope.types) {
        if(typeName === prevTypeName) {
            newTypes[newTypeName] = $scope.types[typeName];
        } else {
            newTypes[typeName] = $scope.types[typeName];
        }
    };

    $scope.types = newTypes;
  }

  $scope.deleteType = function(typeName) {
    delete $scope.types[typeName];
  }

  $scope.addNewVertex = function(vertexId) {
       vertexIndex = vertexIndex + 1;
       if(!vertexId) {
            vertexId = 'vertex' + vertexIndex;
       }
       var vertex = {id: vertexId, _id: vertexId, prevId: vertexId, groups: []};
       $scope.verticesById[vertex._id] = vertex;
       elementsGraph.addVertex(vertex);
       $scope.openGraph();
  }

   $scope.addEntityGroup = function(vertex) {
       entityGroupIndex = entityGroupIndex + 1;
       vertex.groups.push({name: 'entity' + entityGroupIndex, properties: []});
       if(!$scope.types[vertex.id]) {
          $scope.addType(vertex.id, {class: 'java.lang.String', aggregateFunction: {class: ''}, serialiser: '', position: '', locked: true});
       }
    }

   $scope.addProperty = function(properties) {
       var name = "property" + (properties.length + 1);
       properties.push({name: name, type: Object.keys($scope.types)[0]});
    }

  $scope.onVertexIdChange = function(vertex) {
    if(vertex && vertex.id != vertex.prevId) {
        $scope.deleteVertex(vertex);
        $scope.verticesById[vertex._id] = vertex;
        elementsGraph.addVertex(vertex);
        var count = 0;
        for (var id in $scope.verticesById) {
            if($scope.verticesById[id].id == vertex.id) {
                count = count + 1;
            }
        };

        if (count > 1) {
            alert('Vertex ID ' + vertex.id + ' already exists: ');
            vertex.id = vertex.prevId;
        } else {
            for (var id in $scope.edgesById) {
                var edge = $scope.edgesById[id];
                if(vertex.prevId === edge.source) {
                    edge.source = vertex.id;
                }

                if(vertex.prevId === edge.destination) {
                    edge.destination = vertex.id;
                }
            };
            $scope.onTypeNameChange(vertex.id, vertex.prevId);
            vertex.prevId = vertex.id;
            elementsGraph.setVertexId(vertex._id, vertex.id);
        }
    }
  };

  var isDuplicateEdge = function(edge) {
       var count = 0;
       for (var id in $scope.edgesById) {
       var edgeToCheck = $scope.edgesById[id];
           if(edgeToCheck.source == edge.source
            && edgeToCheck.destination == edge.destination
            && edgeToCheck.directed == edge.directed
            && edgeToCheck.group == edge.group) {
               count = count + 1;
               if(count > 1) {
                 return true;
               }
           }
       };

       return false;
  }

  $scope.onSourceChange = function(edge) {
     if (isDuplicateEdge(edge)) {
         alert('Edge already exists');
         edge.source = edge.sourcePrev;
     } else {
         $scope.deleteEdge(edge);
         edge.sourcePrev = edge.source;
         elementsGraph.addEdge(edge);
         $scope.onEdgeAdded(edge);
         if(!$scope.types[edge.source]) {
            $scope.addType(edge.source, {class: 'java.lang.String', aggregateFunction: {class: ''}, serialiser: '', position: '', locked: true});
          }
     }
  };

   $scope.onDestinationChange = function(edge) {
      if (isDuplicateEdge(edge)) {
          alert('Edge already exists');
          edge.destination = edge.destinationPrev;
      } else {
          $scope.deleteEdge(edge);
          edge.destinationPrev = edge.destination;
          elementsGraph.addEdge(edge);
          $scope.onEdgeAdded(edge);
          if(!$scope.types[edge.destination]) {
              $scope.addType(edge.destination, {class: 'java.lang.String', aggregateFunction: {class: ''}, serialiser: '', position: '', locked: true});
          }
      }
   };

   $scope.onDirectedChange = function(edge) {
   };

   $scope.onEdgeGroupChange = function(edge) {
      elementsGraph.setEdgeGroup(edge.id, edge.group.name);
   };

   $scope.onEdgeAdded = function(edge) {
      $scope.edgesById[edge.id] = edge;
      edgeGroupIndex = edgeGroupIndex + 1;
      edge.group = {name: 'edge' + edgeGroupIndex, properties: []};
      $scope.onEdgeGroupChange(edge);
      if(!$scope.types[edge.source]) {
          $scope.addType(edge.source, {class: 'java.lang.String', aggregateFunction: {class: ''}, serialiser: '', position: '', locked: true});
       }

       if(!$scope.types[edge.destination]) {
         $scope.addType(edge.destination, {class: 'java.lang.String', aggregateFunction: {class: ''}, serialiser: '', position: '', locked: true});
      }
   };

    $scope.deleteVertex = function(vertex) {
       $scope.selectedVertex = undefined;
       delete $scope.verticesById[vertex._id];
       elementsGraph.removeElement(vertex._id);
       $scope.deleteType(vertex.id);
       for (var id in $scope.edgesById) {
           var edge = $scope.edgesById[id];
           if(vertex._id === edge.source || vertex._id === edge.destination) {
               $scope.deleteEdge(edge);
           }
       };
    };

    $scope.deleteEdge = function(element) {
       $scope.selectedEdge = undefined;
       delete $scope.edgesById[element.id];
       elementsGraph.removeElement(element.id);
    };

    $scope.deleteGroup = function(groups, group) {
        groups.splice(groups.indexOf(group), 1)
    };

    $scope.redraw = function() {
        $scope.selectedVertex = undefined;
        $scope.selectedEdge = undefined;
        $scope.openGraph();

        setTimeout(function() {
            elementsGraph.redraw();
        }, 200);
    };

    $scope.clear = function() {
        vertexIndex = 0;
        edgeIndex = 0;
        entityGroupIndex = 0;
        edgeGroupIndex = 0;
        $scope.editSchema = false;

        $scope.verticesById = {};
        $scope.edgesById = {};
        $scope.types = {};

        elementsGraph.clear();
        $scope.openGraph();
    }

    var loadSchemaFromUrl = function(url) {
        $http.get(url)
         .success(function(data){
            loadSchema(data);
         });
    }
    $scope.initialise = function() {
        $scope.openGraph();
        loadSchema({});
        loadSchemaFromUrl('rest/commonSchema');
        if($location.search().dataSchema) {
            loadSchemaFromUrl($location.search().dataSchema);
        }
        if($location.search().dataTypes) {
            loadSchemaFromUrl($location.search().dataTypes);
        }
        if($location.search().storeTypes) {
            loadSchemaFromUrl($location.search().storeTypes);
        }
        if($location.search().schema) {
            loadSchemaFromUrl($location.search().schema);
        }

        $scope.redraw();
    };

    $scope.openTypes = function() {
       $scope.showSchema = false;
       $scope.showGraph = false;
       $scope.showTypes = true;
       $scope.selectedVertex = undefined;
       $scope.selectedEdge = undefined;
    };

    $scope.onTypeClassChange = function(typeName) {
        $http.post('rest/functions',
              {typeName: typeName,  typeClass: $scope.types[typeName].class})
             .success(function(data){
                var typeDefClone = $.extend(true, {}, $scope.types[typeName]);
                var typeDef = $scope.types[typeName];
                typeDef.validateMsg = data.message;
                typeDef.valid = data.valid;
                typeDef.availableValidateFunctions = [''].concat(data.validateClasses);
                typeDef.availableAggregateFunctions = [''].concat(data.aggregateClasses);
                typeDef.availableSerialisers = [''].concat(data.serialiserClasses);
                typeDef.validateFunctions = typeDefClone.validateFunctions;
                typeDef.aggregateFunction = typeDefClone.aggregateFunction;
                typeDef.serialiserClass = typeDefClone.serialiserClass;
             })
             .error(function(data){
                 var typeDef = $scope.types[typeName];
                 $scope.validateMsg = "The type is invalid.";
                 $scope.valid = false;
                 typeDef.availableValidateFunctions = [];
                 typeDef.availableAggregateFunctions = [];
                 typeDef.availableSerialisers = [];
              });
    }

    $scope.addValidateFunction = function(typeDef) {
        if(typeDef.validateFunctions === undefined) {
            typeDef.validateFunctions = [];
        }

        typeDef.validateFunctions.push({class:'', fields:""});
    };

    $scope.updateSchema = function() {
        var dataSchema = {};

        var entities = {};
        for (var id in $scope.verticesById) {
            var vertex = $scope.verticesById[id];
            for (var i in vertex.groups) {
                var group = vertex.groups[i];
                var properties = {};
                for (var i in group.properties) {
                  properties[group.properties[i].name] = group.properties[i].type;
                }
                entities[group.name] = {vertex: vertex.id, properties: properties};
                if(group.validateFunctions) {
                    entities[group.name].validateFunctions = group.validateFunctions;
                }
            }
        };
        if(Object.keys(entities).length > 0) {
            dataSchema.entities = entities;
        }

        var edges = {};
        for (var id in $scope.edgesById) {
            var edge = $scope.edgesById[id];
            var properties = {};
            for (var i in edge.group.properties) {
              properties[edge.group.properties[i].name] = edge.group.properties[i].type;
            }
            edges[edge.group.name] = {source: $scope.verticesById[edge.source].id, destination: $scope.verticesById[edge.destination].id, directed: edge.directed.toString(), properties: properties};
            if(edge.validateFunctions) {
                edges[edge.group.name].validateFunctions = group.validateFunctions;
            }
        };
        if(Object.keys(edges).length > 0) {
            dataSchema.edges = edges;
        }

        $scope.dataSchema = dataSchema;

        var dataTypes = {types: {}};
        var storeTypes = {types: {}};
        for (var typeName in $scope.types) {
            var type = $scope.types[typeName];
            var dataType = {class: type.class};
            if(type.validateFunctions && type.validateFunctions.length > 0) {
                dataType.validateFunctions = []
                for (var i in type.validateFunctions) {
                    if(type.validateFunctions[i].class != '') {
                        var validateFunction;
                        if(type.validateFunctions[i].fields) {
                            validateFunction = JSON.parse(type.validateFunctions[i].fields);
                        } else {
                            validateFunction = {};
                        }
                        validateFunction['class'] = type.validateFunctions[i].class;
                        dataType.validateFunctions.push({'function': validateFunction});
                    }
                }
            }
            if(Object.keys(dataType).length > 0) {
                dataTypes.types[typeName] = dataType;
            }

            var storeType = {};
            if(type.position && type.position !== '') {
                storeType.position = type.position;
            }
            if(type.aggregateFunction && type.aggregateFunction.class && type.aggregateFunction.class !== '') {
                if(type.aggregateFunction.fields) {
                    storeType.aggregateFunction = JSON.parse(type.aggregateFunction.fields);
                } else {
                    storeType.aggregateFunction = {};
                }
                storeType.aggregateFunction['class'] = type.aggregateFunction.class;
            }
            if(type.serialiser && type.serialiser !== '') {
                storeType.serialiserClass = type.serialiser;
            }
            if(Object.keys(storeType).length > 0) {
                storeTypes.types[typeName] = storeType;
            }
        };

        $scope.dataTypes = dataTypes;
        $scope.storeTypes = storeTypes;

        $http.post('rest/validate',
        [$scope.dataSchema, $scope.dataTypes, $scope.storeTypes])
             .success(function(data){
                $scope.validateMsg = data.message;
                $scope.validSchema = data.valid;
             })
             .error(function(data){
                 $scope.validateMsg = "The schema is invalid.";
                 $scope.validSchema = false;
              });
    }

    var loadSchema = function(jsonSchema) {
        if(jsonSchema.types){
            for (var typeName in jsonSchema.types) {
                var jsonType = jsonSchema.types[typeName];
                var type = $scope.types[typeName];
                if(!type) {
                  type = {};
                  $scope.types[typeName] = type;
                }
                if(jsonType.validateFunctions) {
                    type.validateFunctions = jsonType.validateFunctions;

                    type.validateFunctions = []

                    var newAvailableValidateFunctions = [];
                    for (var i in jsonType.validateFunctions) {
                        var validateFunctionJson = $.extend(true, {}, jsonType.validateFunctions[i]["function"]);
                        validateFunction = {class: validateFunctionJson.class};
                        newAvailableValidateFunctions.push(validateFunctionJson.class);
                        delete validateFunctionJson['class'];
                        if(validateFunctionJson && Object.keys(validateFunctionJson).length > 0) {
                            validateFunction.fields = JSON.stringify(validateFunctionJson);
                        }
                        type.validateFunctions.push(validateFunction);
                    }

                    if(!type.availableValidateFunctions) {
                        type.availableValidateFunctions = newAvailableValidateFunctions;
                    }
                }
                if(jsonType.position) {
                    type.position = jsonType.position;
                } else if(!type.position) {
                    type.position = '';
                }
                if(jsonType.aggregateFunction && jsonType.aggregateFunction.class) {
                    var aggregateFunctionJson = $.extend(true, {}, jsonType.aggregateFunction);
                    if(!type.availableAggregateFunctions) {
                        type.availableAggregateFunctions = [aggregateFunctionJson.class];
                    }
                    type.aggregateFunction = {class: aggregateFunctionJson.class};
                    delete aggregateFunctionJson['class'];
                    if(aggregateFunctionJson && Object.keys(aggregateFunctionJson).length > 0) {
                        type.aggregateFunction.fields = JSON.stringify(aggregateFunctionJson);
                    }
                } else if(!type.aggregateFunction) {
                    type.aggregateFunction = {class: ''};
                }
                if(jsonType.serialiserClass) {
                    if(!type.availableSerialisers) {
                        type.availableSerialisers = [jsonType.serialiserClass];
                    }
                    type.serialiser = jsonType.serialiserClass;
                } else if(!type.serialiser) {
                    type.serialiser = ''
                }

                if(jsonType.class) {
                    type.class = jsonType.class;
                    $scope.onTypeClassChange(typeName)
                }
            };
        }

        if(jsonSchema.entities) {
            for (var groupName in jsonSchema.entities) {
                var jsonEntity = jsonSchema.entities[groupName];
                var vertex = $scope.verticesById[jsonEntity.vertex];
                if(!vertex) {
                    vertexIndex = vertexIndex + 1;
                    vertex = {id: jsonEntity.vertex, _id: jsonEntity.vertex, prevId: jsonEntity.vertex, groups: []};
                    $scope.verticesById[vertex._id] = vertex;
                    elementsGraph.addVertex(vertex);
                }

                var properties = [];
                for (var name in jsonEntity.properties) {
                  properties.push({name: name, type: jsonEntity.properties[name]});
                }

                var group = {name: groupName, properties: properties};
                if(jsonEntity.validateFunctions) {
                    group.validateFunctions = jsonEntity.validateFunctions;
                }
                vertex.groups.push(group);

                for (var name in vertex.properties) {
                    var typeName = vertex.properties[name];
                    if(!$scope.types[typeName]) {
                        $scope.types[typeName] = {};
                    }
                }
            };
        }

        if(jsonSchema.edges) {
            for (var groupName in jsonSchema.edges) {
                var jsonEdge = jsonSchema.edges[groupName];
                edgeIndex = edgeIndex + 1;

                var properties = [];
                for (var name in jsonEdge.properties) {
                  properties.push({name: name, type: jsonEdge.properties[name]});
                }

                var edge = {id: groupName, source: jsonEdge.source, destination: jsonEdge.destination, directed: ('true' == jsonEdge.directed), group: {name: groupName, properties: properties}};

                if(jsonEdge.validateFunctions) {
                    group.validateFunctions = jsonEdge.validateFunctions;
                }

                for (var name in jsonEdge.properties) {
                    var typeName = jsonEdge.properties[name];
                    if(!$scope.types[typeName]) {
                        $scope.types[typeName] = {};
                    }
                }
                if(!$scope.verticesById[edge.source]){
                    $scope.addNewVertex(edge.source);
                }
                if(!$scope.verticesById[edge.destination]){
                    $scope.addNewVertex(edge.destination);
                }
                $scope.edgesById[edge.id] = edge;
                elementsGraph.addEdge(edge);
            }
        }
    }

    $scope.saveSchema = function() {
        $scope.clear();

        $scope.dataSchema = JSON.parse($scope.dataSchemaJson);
        $scope.dataTypes = JSON.parse($scope.dataTypesJson);
        $scope.storeTypes = JSON.parse($scope.storeTypesJson);

        loadSchema($scope.dataSchema);
        loadSchema($scope.dataTypes);
        loadSchema($scope.storeTypes);
        $scope.redraw();
     };

    $scope.openSchema = function() {
       $scope.updateSchema();
       $scope.showGraph = false;
       $scope.showTypes = false;
       $scope.selectedVertex = undefined;
       $scope.selectedEdge = undefined;
       $scope.showSchema = true;
       $scope.editSchema = false;
    };

    $scope.openEditSchema = function() {
        $scope.dataSchemaJson = angular.toJson($scope.dataSchema);
        $scope.dataTypesJson = angular.toJson($scope.dataTypes);
        $scope.storeTypesJson = angular.toJson($scope.storeTypes);
        $scope.editSchema = true;
    };

    $scope.openGraph = function() {
       $scope.showTypes = false;
       $scope.showSchema = false;
       $scope.editSchema = false;
       $scope.showGraph = true;
    };

    // you would probably want some ui to prevent use of elementsCtrl until cy is loaded
     elementsGraph(Object.keys($scope.verticesById), Object.keys($scope.edgesById))
     .then(function( elementsCy ){
       $scope.cyLoaded = true;
     });

    elementsGraph.onEdgeAdded(function(edge){
         $scope.onEdgeAdded(edge);
         $scope.$apply();
       });

  elementsGraph.onElementSelect(function(_id){
      $scope.showTypes = false;
      $scope.showSchema = false;
      for (var id in $scope.verticesById) {
            if(id == _id) {
                $scope.selectedEdge = undefined;
                $scope.selectedVertex = $scope.verticesById[id];
                $scope.$apply();
                return;
            }
        };
      for (var id in $scope.edgesById) {
          if(id == _id) {
              $scope.selectedVertex = undefined;
              $scope.selectedEdge = $scope.edgesById[id];
              $scope.$apply();
              return;
          }
      };
  });

  elementsGraph.onElementUnselect(function(){
          $scope.selectedVertex = undefined;
          $scope.selectedEdge = undefined;
          $scope.$apply();
    });

  $scope.initialise();
} ]);