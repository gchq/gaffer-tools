/*
 * Copyright 2018 Crown Copyright
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

angular.module('app').controller('VisualisationDialogController', ['$scope', 'common', '$mdDialog', 'time', 'error', function($scope, common, $mdDialog, time, error) {
    $scope.title = "Create Visualisation"

    $scope.columns = this.columns;
    $scope.data = this.data;

    $scope.showPreview = false;

    $scope.charts = {
        "line": {
            "type": "line",
            "fields": {
                "data": {
                    "axis": "y",
                    "label": "y axis property",
                    "required": true
                },
                "labels": {
                    "axis": "x",
                    "label": "x axis property",
                    "required": true
                },
                "series": {
                    "label": "chart series property"
                }
            }
        },
        "bar chart from frequency map": {
            "type": "bar",
            "fields": {
                "frequencyMapProperty": {
                    "label": "frequency map property",
                    "required": true
                },
                "series": {
                    "label": "chart series"
                }
            }
        },
        "bar": {
            "type": "bar",
            "fields": {
                "data": {
                    "axis": "y",
                    "label": "y axis property",
                    "required": true
                },
                "labels": {
                    "axis": "x",
                    "label": "x axis property",
                    "required": true
                },
                "series": {
                    "label": "chart series property"
                }
            }
        },
        "horizontal bar": {
            "type": "horizontalBar",
            "fields": {
                "data": {
                    "axis": "x",
                    "label": "x axis property",
                    "required": true
                },
                "labels": {
                    "axis": "y",
                    "label": "y axis property",
                    "required": true
                },
                "series": {
                    "label": "chart series property"
                }
            }
        },
        "polar area": {
            "type": "polarArea",
            "fields": {
                "data": {
                    "label": "property to measure",
                    "required": true
                },
                "labels": {
                    "label": "chart series property",
                    "required": true
                }
            }
        },
        "pie": {
            "type": "pie",
            "fields": {
                "data": {
                    "label": "property to measure",
                    "required": true
                },
                "labels": {
                    "label": "chart series property",
                    "required": true
                }
            },
        },
        "doughnut": {
            "type": "doughnut",
            "fields": {
                "data": {
                    "label": "property to measure",
                    "required": true
                },
                "labels": {
                    "label": "chart series property",
                    "required": true
                }
            }
        }
    };

    var extractFrequencyMapChartValues = function(chartSettings) {
        // work out aggregation
        var seriesProperty = chartSettings.fields.series ? chartSettings.fields.series.value : undefined;
        var frequencyMapProperty = chartSettings.fields.frequencyMapProperty.value;

        // build up big frequency map for each series or aggregate it all together.

        if (seriesProperty === undefined || seriesProperty === null) {
            var aggregatedFrequencyMap = {};

            $scope.data.forEach(row => {
                var stringFrequencyMap = row[frequencyMapProperty];
                if (stringFrequencyMap) {    // skip empty rows
                    var keyValues = stringFrequencyMap.split(', ');   // creates a list of key value pairs eg. key1: 5
                    keyValues.forEach(keyValue => {
                        var kv = keyValue.split(': ') // creates [key, value] array
                        if (aggregatedFrequencyMap[kv[0]]) {
                            aggregatedFrequencyMap[kv[0]] += Number(kv[1]); // add to current value if it exists
                        } else {
                            aggregatedFrequencyMap[kv[0]] = Number(kv[1]);  // else set the value
                        }
                    })
                }
            });

            $scope.labels = Object.keys(aggregatedFrequencyMap);
            $scope.chartData = Object.values(aggregatedFrequencyMap);
            $scope.series = undefined;
        } else {
            // iterate through data
            var groupedFrequencyMaps = {};
            $scope.data.forEach(row => {
                var stringFrequencyMap = row[frequencyMapProperty];
                var series = row[seriesProperty];

                if (stringFrequencyMap && series !== null && series !== undefined) {    // skip empty frequency maps and series
                    if (!groupedFrequencyMaps[series]) { // if no frequency exists for this series, create one
                        groupedFrequencyMaps[series] = {};
                    }
                    var keyValues = stringFrequencyMap.split(', ');    // iterate through frequency map
                    keyValues.forEach(keyValue => {
                        var kv = keyValue.split(': ') // creates [key, value] array
                        // either create new values or add to existing values
                        if (groupedFrequencyMaps[series][kv[0]]) {
                            groupedFrequencyMaps[series][kv[0]] += Number(kv[1]); // add to current value if it exists
                        } else {
                            groupedFrequencyMaps[series][kv[0]] = Number(kv[1]);  // else set the value
                        }
                    });
                }
            })

            // series are then given by Object.keys 
            $scope.series = Object.keys(groupedFrequencyMaps);
            var uniqueLabels = [];

            // calculate unique set of labels
            for (var series in groupedFrequencyMaps) {
                common.pushValuesIfUnique(Object.keys(groupedFrequencyMaps[series]), uniqueLabels);
            }

            $scope.labels = uniqueLabels;

            var data = [];

            // for each frequency map calculate the data values based on this unique list
            for (var series in groupedFrequencyMaps) {
                var freqMap = groupedFrequencyMaps[series];
                var flatMapValues = [];

                for (var i in uniqueLabels) {
                    var label = uniqueLabels[i];
                    flatMapValues[i] = freqMap[label];
                }

                data.push(flatMapValues);
            }
            
            // set the data values
            $scope.chartData = data;
        }

    }

    var comparator = function(first, second) {  // compares strings, numbers and booleans
        if (typeof first === 'string') {
            var uppercaseFirst = first.toUpperCase();
            var uppercaseSecond = second.toUpperCase();

            if (uppercaseFirst < uppercaseSecond) {
                return -1;
            } else if (uppercaseFirst > uppercaseSecond) {
                return 1
            } else {
                return 0
            }
        } else if (typeof first === 'number') {
            return first - second;
        } else {
            if (first === true && second === false) {
                return -1
            } else if (first === false && second === true) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    var extractDefaultChartValues = function(chartSettings) {
        var seriesProperty = chartSettings.fields.series ? chartSettings.fields.series.value : undefined;
        var dataProperty = chartSettings.fields.data.value;
        var labelsProperty = chartSettings.fields.labels.value;

        var uniqueLabels = [];
        var data = [];

        $scope.data.forEach(row => {
            var propertyValue = row[labelsProperty];
            var dataValue = row[dataProperty];
            if (propertyValue !== undefined && propertyValue !== null && dataValue !== undefined && dataValue !== null) {
                if (!seriesProperty || (row[seriesProperty] !== null && row[seriesProperty] !== undefined)) {
                    common.pushValueIfUnique(propertyValue, uniqueLabels);
                }
            }
        });

        uniqueLabels.sort(comparator);

        if  (seriesProperty === undefined || seriesProperty === null) {
            Array.apply(data, Array(uniqueLabels.length)).map(function() {}); // creates empty array with values all set to undefined
            
            $scope.data.forEach(row => {
                var labelIndex = uniqueLabels.indexOf(row[labelsProperty]);
                if (labelIndex !== -1) {
                    data[labelIndex] = data[labelIndex] === undefined ? row[dataProperty] : data[labelIndex] + row[dataProperty];
                }
            });
        } else {
            var uniqueSeries = [];
            $scope.data.forEach(row => {
                var series = row[seriesProperty];
                var label = row[labelsProperty];
                var value = row[dataProperty];
                if (series !== undefined && series !== null && label !== undefined && label !== null && value !== undefined && value !== null) {
                    common.pushValueIfUnique(series, uniqueSeries);
                    var seriesIndex = uniqueSeries.indexOf(series);
                    var propertyIndex = uniqueLabels.indexOf(label);
                    if (data[seriesIndex]) {   // if series already exists
                        data[seriesIndex][propertyIndex] = data[seriesIndex][propertyIndex] === undefined ? value : data[seriesIndex][propertyIndex] + value;
                    } else {
                        data[seriesIndex] = [];
                        for (var i in uniqueLabels) {
                            data[seriesIndex][i] = undefined;
                        }
                        data[seriesIndex][propertyIndex] = value;
                    }
                    
                    
                }
            });
        }

        $scope.labels = uniqueLabels;
        $scope.series = uniqueSeries;
        $scope.chartData = data;

        
    }

    var extractChartOptions = function(chartSettings) {
        var options = {};

        var axisToOptionName = {
            "x": "xAxes",
            "y": "yAxes"
        }

        for (var field in chartSettings.fields) {
            var fieldData = chartSettings.fields[field];
            if (fieldData.axis) {
                if (time.isTimeProperty(fieldData.value)) {
                    if (!options.scales) {
                        options.scales = {};
                    }
                    options.scales[axisToOptionName[fieldData.axis]] = [{
                        type: "time"
                    }];
                }
            }
        }
        
        return options;
    }

    $scope.preview = function() {
        var chartSettings = angular.copy($scope.selectedChart);

        try {
            if (chartSettings.fields.frequencyMapProperty) {
                extractFrequencyMapChartValues(chartSettings);
            } else {
                extractDefaultChartValues(chartSettings);
            }
    
            $scope.options = extractChartOptions(chartSettings);
        } catch(e) {
            error.handle('Unable to create chart with parameters specified');
            return;
        }

        $scope.showPreview = true;
    }

    $scope.goBack = function() {
        $scope.showPreview = false;
    }

    $scope.confirm = function() {
        var toReturn = {
            type: $scope.selectedChart.type,
            labels: $scope.labels,
            data: $scope.chartData,
            series: $scope.series,
            options: $scope.options
        }

        $mdDialog.hide(toReturn);
    }
}])