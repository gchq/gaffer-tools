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

angular.module('app').controller('VisualisationDialogController', ['$scope', 'common', '$mdDialog', 'time', function($scope, common, $mdDialog, time) {
    $scope.title = "Create Visualisation"

    $scope.columns = this.columns;
    $scope.data = this.data;

    $scope.showPreview = false;

    $scope.charts = {
        "line": {
            "type": "line",
            "fields": {
                "labels": {
                    "axis": "x",
                    "label": "x axis property",
                    "required": true
                },
                "data": {
                    "axis": "y",
                    "label": "y axis property",
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
                "labels": {
                    "axis": "x",
                    "label": "x axis property",
                    "required": true
                },
                "data": {
                    "axis": "y",
                    "label": "y axis property",
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
        "radar": {
            "type": "radar",
            "fields": {
                "radarProperties": {
                    "label": "properties",
                    "required": true,
                    "multiple": true
                },
                "series": {
                    "label": "chart series property"
                }
            }
        },
        "bubble": {
            "type": "bubble",
            "fields": {
                "bubbleX": {
                    "axis": "x",
                    "label": "x axis property",
                    "required": true
                },
                "bubbleY": {
                    "axis": "y",
                    "label": "y axis property",
                    "required": true
                },
                "bubbleR": {
                    "axis": "r",
                    "label": "radius property",
                    "required": true
                },
                "series": {
                    "label": "chart series property",
                    "required": false
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

    var extractRadarChartValues = function(chartSettings) {
        // todo
    }

    var extractBubbleChartValues = function(chartSettings) {
        // todo
    }

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

                if (stringFrequencyMap) {    // skip empty values
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

    var extractDefaultChartValues = function(chartSettings) {
        var seriesProperty = chartSettings.fields.series ? chartSettings.fields.series.value : undefined;
        var dataProperty = chartSettings.fields.data.value;
        var labelsProperty = chartSettings.fields.labels.value;

        var uniqueLabels = [];
        var data = [];

        $scope.data.forEach(row => {
            var propertyValue = row[labelsProperty];
            if (propertyValue !== undefined && propertyValue !== null) {
                common.pushValueIfUnique(propertyValue, uniqueLabels);
            }
        });

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
                var propertyValue = row[seriesProperty];
                if (propertyValue !== undefined && propertyValue !== null) {
                    common.pushValueIfUnique(propertyValue, uniqueSeries);

                    // if no value exists in the ouput already for this key
                    var seriesIndex = uniqueSeries.indexOf(propertyValue)
                    if (data.indexOf(seriesIndex) !== -1) {
                        // create one with undefined values for each of the labels
                        Array.apply(data[seriesIndex], Array(uniqueLabels.length)).map(function() {}); // creates empty array with undefined values
                    }
                    // check the label property index
                    var labelIndex = uniqueLabels.indexOf(row[labelsProperty])
                    if (labelIndex !== -1) {
                        // insert the measured data property at the correct index
                        if (!data[seriesIndex]) {
                            data[seriesIndex] = [];
                        }
                        data[seriesIndex][labelIndex] = data[seriesIndex] === undefined || data[seriesIndex][labelIndex] === undefined ? row[dataProperty] : data[seriesIndex][labelIndex] + row[dataProperty];
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

        if (chartSettings.type === 'radar') {
            extractRadarChartValues(chartSettings);
        } else if (chartSettings.type === 'bubble') {
            extractBubbleChartValues(chartSettings);
        } else if (chartSettings.fields.frequencyMapProperty) {
            extractFrequencyMapChartValues(chartSettings);
        } else {
            extractDefaultChartValues(chartSettings);
        }

        $scope.options = extractChartOptions(chartSettings);

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