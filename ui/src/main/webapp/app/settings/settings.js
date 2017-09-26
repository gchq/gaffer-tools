/*
 * Copyright 2016-2017 Crown Copyright
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

angular.module('app').factory('settings', [function(){
  var defaultShortValue = function(value) {
      return JSON.stringify(value);
  };

  var types = {
       "unknownType": {
          types: [
           {
              label: "Value",
              type: "text",
              class: "java.lang.String"
           }
          ],
          getShortValue: defaultShortValue
       },
       "java.lang.Long": {
          types: [
           {
              label: "Value",
              type: "number",
              step: "1",
              class: "java.lang.Long"
           }
          ],
          wrapInJson: true
       },
       "java.lang.Integer": {
          types: [
           {
              label: "Value",
              type: "number",
              step: "1",
              class: "java.lang.Integer"
           }
          ]
       },
       "java.lang.Short": {
          types: [
           {
              label: "Value",
              type: "number",
              step: "1",
              class: "java.lang.Short"
           }
          ],
          wrapInJson: true
       },
       "java.lang.Double": {
          types: [
           {
              label: "Value",
              type: "number",
              step: "0.1",
              class: "java.lang.Double"
           }
          ],
          wrapInJson: true
       },
       "java.lang.Float": {
          types: [
           {
              label: "Value",
              type: "number",
              step: "0.1",
              class: "java.lang.Float"
           }
          ],
          wrapInJson: true
       },
       "java.lang.String": {
          types: [
           {
              label: "Value",
              type: "text",
              class: "java.lang.String",
           }
          ]
       },
       "uk.gov.gchq.gaffer.types.TypeValue": {
          types: [
             {
               label: "Type",
               type: "text",
               key: "type",
               class: "java.lang.String"
             },
             {
               label: "Value",
               type: "text",
               key: "value",
               class: "java.lang.String"
             }
          ],
          wrapInJson: true
       },
       "uk.gov.gchq.gaffer.types.TypeSubTypeValue": {
          types: [
             {
               label: "Type",
               type: "text",
               key: "type",
               class: "java.lang.String"
             },
             {
               label: "Sub Type",
               type: "text",
               key: "subType",
               class: "java.lang.String"
             },
             {
               label: "Value",
               type: "text",
               key: "value",
               class: "java.lang.String"
             }
          ],
          wrapInJson: true
       }
   };

  var getType = function(typeClass) {
     var type = types[typeClass];
     if(!type) {
         type = types.unknownType;
     }

     if(!type.createValue) {
        type.createValue = function(typeClass, parts) {
            if(type.wrapInJson || Object.keys(parts).length > 1) {
                return parts;
            }

            return parts[Object.keys(parts)[0]];
        }
     }

     if(!type.createValueAsJsonWrapperObj) {
         type.createValueAsJsonWrapperObj = function(typeClass, parts, stringify) {
             if(type.wrapInJson || Object.keys(parts).length > 1) {
                 var value = {};
                 value[typeClass] = parts;
                 if(stringify) {
                    value = JSON.stringify(value);
                 }
                 return value;
             }

             return parts[Object.keys(parts)[0]];
         }
      }

     if(!type.createParts) {
         type.createParts = function(typeClass, value) {
             if(value[typeClass]) {
                 return value[typeClass];
             }

             var parts = {};
             parts[type.key] = value;
             return parts;
         }
     }

     if(!type.getShortValue) {
        type.getShortValue = function(value) {
            if(typeof value === 'string'
                || value instanceof String
                || typeof value === 'number') {
                return value;
            }

            if(Object.keys(value).length != 1) {
                return defaultShortValue(value);
            }

            var typeClass = Object.keys(value)[0]
            var parts = value[typeClass];
            return Object.keys(parts).map(function(key){return parts[key]}).join("|");
        }
     }

     if(type.csvHeader === undefined) {
        var partKeys = [];
        for(var i in type.types) {
            if(type.types[i].key === undefined) {
                partKeys.push("");
            } else {
                partKeys.push(type.types[i].key);
            }
        }

        if(partKeys.length == 0) {
            type.csvHeader = "";
        } else {
            if(partKeys.length > 1) {
                console.log('test: ' + partKeys);
            }
            type.csvHeader = partKeys.join(",");
        }
     }

     return type;
  };

  var opWhiteList = undefined;
  var opBlackList = [];

  return {
     resultLimit: 100,
     restUrl: window.location.origin + "/rest/latest",
     getType: getType,
     defaultOp: "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
     defaultAvailableOps: [
       {
           name: "Get Elements",
           class: "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
           description: "Given your selected seeds, it gets related Entities and Edges.",
           input: true,
           view: true,
           inOutFlag: true,
           arrayOutput: true
       }
     ]
   }
} ]);