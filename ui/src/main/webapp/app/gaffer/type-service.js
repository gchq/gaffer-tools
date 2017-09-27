(function() {

    'use strict'

    angular.module('app').factory('typeService', typeService)

    function typeService(configService) {

        return {
            getType: getType
        }

        function defaultShortValue(value) {
            return JSON.stringify(value);
        }

        var unknownTypeDefault =
        {
           types: [
             {
               label: "Value",
               type: "text",
               class: "java.lang.String"
             }
           ],
           getShortValue: defaultShortValue
         }


        function getType(typeClass) {
            var types = configService.getConfig().types
            var type = types[typeClass];
            if(!type) {
                type = unknownTypeDefault;
            }


            type.createValue = function(typeClass, parts) {
                if(type.wrapInJson || Object.keys(parts).length > 1) {
                    return parts;
                }

                return parts[Object.keys(parts)[0]];
            }



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



            type.createParts = function(typeClass, value) {
                if(value[typeClass]) {
                    return value[typeClass];
                }

                var parts = {};
                parts[type.key] = value;
                return parts;
            }



            type.getShortValue = function(value) {
                if(typeof value === 'string' || value instanceof String || typeof value === 'number') {
                    return value;
                }

                if(Object.keys(value).length != 1) {
                    return defaultShortValue(value);
                }

                var typeClass = Object.keys(value)[0]
                var parts = value[typeClass];
                return Object.keys(parts).map(function(key){return parts[key]}).join("|");
            }



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


            return type;
        }


    }

})()