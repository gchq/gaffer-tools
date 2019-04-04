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

'use strict';

angular.module('app').factory('types', ['config', 'common', function(config, common) {

    var service = {};
    var types = {};
    var simpleClassNames = {};

    config.get().then(function(myConfig) {
        if(myConfig) {
            types = myConfig.types;
            for(var className in types) {
                var parts = className.split('.');
                var simpleClassName = parts.pop().replace(/<.*>/, "");
                simpleClassNames[simpleClassName] = className;
            }
        }
    });

    var defaultShortValue = function(value) {
        return angular.toJson(value);
    }

    var mapShortValue = function(value) {
        return Object.keys(value).map(function(key) {
            return key + ": " + service.getShortValue(value[key]);
        }).join(", ");
    }

    var listShortValue = function(values) {
        return values.map(function(value) {
            return service.getShortValue(value);
        }).join(', ');
    }

    var customShortValue = function(fields, parts) {
        var showWithLabel = (fields.length > 1);
        var parsedFields = fields.map(function(field) {
            var layers = field.key.split('.');
            var customValue = parts;
            for (var i in layers) {
                customValue = customValue[layers[i]];
            }

            customValue = service.getShortValue(customValue);

            if (showWithLabel) {
                return field.label + ': ' + customValue;
            }
            return customValue;
        });

        if (showWithLabel) {
            return parsedFields.join(", ");
        } else if (parsedFields.length === 1) {
            return parsedFields[0];
        } else {
            throw 'Expected fields in custom object, received empty!';
        }
        
    }

    service.getFields = function(className) {
        var knownType = types[className];

        if(knownType) {
            return knownType.fields;
        }

        return unknownType.fields;
    }

    service.isKnown = function(className) {
        var knownType = types[className];

        if(knownType) {
            return true;
        }

        return false;
    }

    service.getSimpleClassNames = function() {
        return simpleClassNames;
    }

    service.isKnown = function(typeClass) {
        return typeClass !== undefined && types[typeClass]
    }

    var unknownType =
    {
        fields: [
            {
                label: "Value",
                type: "text",
                class: "java.lang.String"
            }
        ]
    }

    var getType = function(typeClass) {
        if (typeClass !== undefined && types[typeClass]) {
            return types[typeClass];
        }
        return unknownType;
    }

    var createCustomValue = function(type, parts) {
        var val = {};

        for (var i in type.fields) {
            var layers = type.fields[i].key.split('.');
            var previousLayer = val;
            for (var j in layers) {
                var layer = layers[j];
                if (previousLayer[layer] === undefined && (j != (layers.length - 1))) {
                    previousLayer[layer] = {};
                } else {
                    previousLayer[layer] = parts[type.fields[i].key];
                }
                previousLayer = previousLayer[layer];
            }
        }

        return val
    }

    service.createValue = function(typeClass, parts) {
        var type = getType(typeClass);

        if (type.custom) {
            return createCustomValue(type, parts);
        }

        if(typeof parts === 'number' || typeof parts === 'string' || parts instanceof String ) {
            return parts;
        }

        if ((type.wrapInJson && Object.keys(parts)[0] !== 'undefined' && Object.keys(parts).length > 0) || Object.keys(parts).length > 1) {
            return parts;
        }

        var value = parts[Object.keys(parts)[0]];

        if (typeClass === 'JSON') {
            return JSON.parse(value)
        }

        return value;
    }

    service.createJsonValue = function(typeClass, parts, stringify) {
        var value = service.createValue(typeClass, parts);
        var jsonValue = {};
        var type = getType(typeClass);

        if(type.wrapInJson || (typeClass && (common.endsWith(typeClass, 'Map') || common.endsWith(typeClass, 'Set') || common.endsWith(typeClass, 'List')))) {
            jsonValue[typeClass] = value;
        } else {
            jsonValue = value;
        }

        if (!stringify) {
            return jsonValue;
        } else {
            return JSON.stringify(jsonValue);
        }
    }

    var createCustomParts = function(type, value) {
        var parts = {};
        for (var i in type.fields) {
            var layers = type.fields[i].key.split('.');

            var currentLayer = value;
            for (var j in layers) {
                var layer = layers[j];
                currentLayer = currentLayer[layer];
            }

            parts[type.fields[i].key] = currentLayer;
        }

        return parts;
    }

    service.createParts = function(typeClass, value) {
        var strippedValue = value;

        if(value[typeClass]) {
            strippedValue = value[typeClass];
        }

        var type = getType(typeClass);

        if(type === undefined) {
            return strippedValue;
        }

        var parts = {};

        if (type.custom) {
            return createCustomParts(type, strippedValue);
        }

        for(var i in type.fields) {
            var key = type.fields[i].key;

            parts[key] = key ? strippedValue[key] : strippedValue;
        }

        return parts;
    }

    service.getShortValue = function(value) {

        if (typeof value === 'string' || value instanceof String || typeof value === 'number' || typeof value === 'boolean' || value === null || value === undefined) {
            return value;
        }

        if (value.constructor === Array) {
            return listShortValue(value);
        } else if (Object.keys(value).length != 1) {
            return defaultShortValue(value);
        }

        var typeClass = Object.keys(value)[0];
        var parts = value[typeClass]; // the value without the class prepended
        if(parts === undefined) {
            return "";
        }

        var type = getType(typeClass);

        if (type.custom) {
            return customShortValue(type.fields, parts)
        }

        if (!service.isKnown(typeClass)) {
            if (common.endsWith(typeClass, 'Map')) {
                return mapShortValue(parts);
            } else if (common.endsWith(typeClass, 'List') || common.endsWith(typeClass, 'Set')) {
                return listShortValue(parts);
            }
        }

        if (typeof parts === 'object') {
            if(type && type["fields"] && type["fields"].length > 0) {
                var allHaveKeys = true;
                for(var i in type["fields"]) {
                    if(type["fields"][i]["key"] === undefined || type["fields"][i]["key"] == '') {
                        allHaveKeys = false;
                        break;
                    }
                }
                if(allHaveKeys) {
                    return type["fields"].map(function(field){
                        var val = parts[field.key];
                        return service.getShortValue(val);
                    }).join(",");
                }
            }

            return Object.keys(parts).map(function(key){
                var val = parts[key];
                return service.getShortValue(val);
            }).join(",");
        }

        return parts;
    }

    service.getCsvHeader = function(typeClass) {
        var type = getType(typeClass);

        var partKeys = [];
        for(var i in type.fields) {
            var field = type.fields[i];
            if (field.label !== undefined) {
                partKeys.push(field.label);
            } else if (field.key !== undefined) {
                partKeys.push(field.key);
            } else {
                partKeys.push("");
            }
        }

        if(partKeys.length == 0) {
            return "";
        } else {
            return partKeys.join(",");
        }
    }

    return service;
}]);
