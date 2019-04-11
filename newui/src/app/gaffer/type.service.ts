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
import { ConfigService } from "../config/config.service";

@Injectable()
export class TypesService {
  types = {};
  simpleClassNames = {};
  unknownType = {};

  constructor(private config: ConfigService) {
    config.get().subscribe(function(myConfig) {
      if (myConfig) {
        this.types = myConfig.types;
        for (var className in this.types) {
          var parts = className.split(".");
          var simpleClassName = parts.pop().replace(/<.*>/, "");
          this.simpleClassNames[simpleClassName] = className;
        }
      }
    });

    this.unknownType = {
      fields: [
        {
          label: "Value",
          type: "text",
          class: "java.lang.String"
        }
      ]
    };
  }

  private defaultShortValue = function(value) {
    return this.angular.toJson(value);
  };

  private mapShortValue = function(value) {
    return Object.keys(value)
      .map(function(key) {
        return key + ": " + this.getShortValue(value[key]);
      })
      .join(", ");
  };

  private listShortValue = function(values) {
    return values
      .map(function(value) {
        return this.getShortValue(value);
      })
      .join(", ");
  };

  private customShortValue = function(fields, parts) {
    var showWithLabel = fields.length !== 1;

    return fields
      .map(function(field) {
        var layers = field.key.split(".");
        var customValue = parts;
        for (var i in layers) {
          customValue = customValue[layers[i]];
        }

        customValue = this.getShortValue(customValue);

        if (showWithLabel) {
          return field.label + ": " + customValue;
        }
        return customValue;
      })
      .join(", ");
  };

  getFields = function(className) {
    var knownType = this.types[className];

    if (knownType) {
      return knownType.fields;
    }

    return this.unknownType.fields;
  };

  // isKnown = function(className) {
  //     var knownType = this.types[className];

  //     if(knownType) {
  //         return true;
  //     }

  //     return false;
  // }

  getSimpleClassNames = function() {
    return this.simpleClassNames;
  };

  isKnown = function(typeClass) {
    return typeClass !== undefined && this.types[typeClass];
  };

  private getType = function(typeClass) {
    if (typeClass !== undefined && this.types[typeClass]) {
      return this.types[typeClass];
    }
    return this.unknownType;
  };

  private createCustomValue = function(type, parts) {
    var val = {};

    for (var i in type.fields) {
      var layers = type.fields[i].key.split(".");
      var previousLayer = val;
      let j: any;
      for (j in layers) {
        var layer = layers[j];
        if (previousLayer[layer] === undefined && j != layers.length - 1) {
          previousLayer[layer] = {};
        } else {
          previousLayer[layer] = parts[type.fields[i].key];
        }
        previousLayer = previousLayer[layer];
      }
    }

    return val;
  };

  createValue = function(typeClass, parts) {
    var type = this.getType(typeClass);

    if (type.custom) {
      return this.createCustomValue(type, parts);
    }

    if (
      typeof parts === "number" ||
      typeof parts === "string" ||
      parts instanceof String
    ) {
      return parts;
    }

    if (
      (type.wrapInJson &&
        Object.keys(parts)[0] !== "undefined" &&
        Object.keys(parts).length > 0) ||
      Object.keys(parts).length > 1
    ) {
      return parts;
    }

    var value = parts[Object.keys(parts)[0]];

    if (typeClass === "JSON") {
      return JSON.parse(value);
    }

    return value;
  };

  createJsonValue = function(typeClass, parts, stringify) {
    var value = this.createValue(typeClass, parts);
    var jsonValue = {};
    var type = this.getType(typeClass);

    if (
      type.wrapInJson ||
      (typeClass &&
        (this.common.endsWith(typeClass, "Map") ||
          this.common.endsWith(typeClass, "Set") ||
          this.common.endsWith(typeClass, "List")))
    ) {
      jsonValue[typeClass] = value;
    } else {
      jsonValue = value;
    }

    if (!stringify) {
      return jsonValue;
    } else {
      return JSON.stringify(jsonValue);
    }
  };

  private createCustomParts = function(type, value) {
    var parts = {};
    for (var i in type.fields) {
      var layers = type.fields[i].key.split(".");

      var currentLayer = value;
      for (var j in layers) {
        var layer = layers[j];
        currentLayer = currentLayer[layer];
      }

      parts[type.fields[i].key] = currentLayer;
    }

    return parts;
  };

  createParts = function(typeClass, value) {
    var strippedValue = value;

    if (value[typeClass]) {
      strippedValue = value[typeClass];
    }

    var type = this.getType(typeClass);

    if (type === undefined) {
      return strippedValue;
    }

    var parts = {};

    if (type.custom) {
      return this.createCustomParts(type, strippedValue);
    }

    for (var i in type.fields) {
      var key = type.fields[i].key;

      parts[key] = key ? strippedValue[key] : strippedValue;
    }

    return parts;
  };

  getShortValue = function(value) {
    if (
      typeof value === "string" ||
      value instanceof String ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null ||
      value === undefined
    ) {
      return value;
    }

    if (value.constructor === Array) {
      return this.listShortValue(value);
    } else if (Object.keys(value).length != 1) {
      return this.defaultShortValue(value);
    }

    var typeClass = Object.keys(value)[0];
    var parts = value[typeClass]; // the value without the class prepended
    if (parts === undefined) {
      return "";
    }

    var type = this.getType(typeClass);

    if (type.custom) {
      return this.customShortValue(type.fields, parts);
    }

    if (!this.isKnown(typeClass)) {
      if (this.common.endsWith(typeClass, "Map")) {
        return this.mapShortValue(parts);
      } else if (
        this.common.endsWith(typeClass, "List") ||
        this.common.endsWith(typeClass, "Set")
      ) {
        return this.listShortValue(parts);
      }
    }

    if (typeof parts === "object") {
      return Object.keys(parts)
        .map(function(key) {
          var val = parts[key];
          return this.getShortValue(val);
        })
        .join("|");
    }

    return parts;
  };

  getCsvHeader = function(typeClass) {
    var type = this.getType(typeClass);

    var partKeys = [];
    for (var i in type.fields) {
      var field = type.fields[i];
      if (field.label !== undefined) {
        partKeys.push(field.label);
      } else if (field.key !== undefined) {
        partKeys.push(field.key);
      } else {
        partKeys.push("");
      }
    }

    if (partKeys.length == 0) {
      return "";
    } else {
      return partKeys.join(",");
    }
  };
}
