/*
 * Copyright 2018-2019 Crown Copyright
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
        "Line graph": {
            "type": "line",
            "description": "Great for showing the relationship between two sets of continuous data. Data is aggregated together if no series property is specified. If correlating time, put the time property on the x axis.",
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
                    "label": "how to group the data (series property)"
                }
            }
        },
        "Bar chart from frequency map": {
            "type": "bar",
            "description": "Allows you to visually explore frequency maps in your data. Select the property containing your frequency map. Then use the series property to split your data (optional).",
            "fields": {
                "frequencyMapProperty": {
                    "label": "frequency map property",
                    "required": true
                },
                "series": {
                    "label": "how to split the data (series property)"
                }
            }
        },
        "Bar chart": {
            "type": "bar",
            "description": "Useful for comparing continuous data on the y axis with categoric data on the x axis. Optionally you can split up the bars using the series property.",
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
                    "label": "How to split up the bars (series property)"
                }
            }
        },
        "Horizontal bar chart": {
            "type": "horizontalBar",
            "description": "A bar chart - but turned on it's side. Be careful not to get your x's and y's muddled up.",
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
        "Polar area chart": {
            "type": "polarArea",
            "description": "Similar to a pie chart but better at comparing the scale of values. Select the property you want to measure and how to group the data.",
            "fields": {
                "data": {
                    "label": "property to measure",
                    "required": true
                },
                "labels": {
                    "label": "how to group the data",
                    "required": true
                }
            }
        },
        "Pie chart": {
            "type": "pie",
            "description": "For showing proportion of values against each other. Select what you want to measure and how you want the data to be grouped.",
            "fields": {
                "data": {
                    "label": "property to measure",
                    "required": true
                },
                "labels": {
                    "label": "how to group the data",
                    "required": true
                }
            },
        },
        "Doughnut chart": {
            "type": "doughnut",
            "description": "Essentially a funky pie chart. Select the property you want to measure and how to group the data.",
            "fields": {
                "data": {
                    "label": "property to measure",
                    "required": true
                },
                "labels": {
                    "label": "how to group the data",
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

            $scope.data.forEach(function(row) {
                var stringFrequencyMap = row[frequencyMapProperty];
                if (stringFrequencyMap) {    // skip empty rows
                    var keyValues = stringFrequencyMap.split(', ');   // creates a list of key value pairs eg. key1: 5
                    keyValues.forEach(function(keyValue) {
                        var kv = keyValue.split(': ') // creates [key, value] array
                        if (aggregatedFrequencyMap[kv[0]]) {
                            aggregatedFrequencyMap[kv[0]] += Number(kv[1]); // add to current value if it exists
                        } else {
                            aggregatedFrequencyMap[kv[0]] = Number(kv[1]);  // else set the value
                        }
                    })
                }
            });

            var labels = [];
            var values = [];

            for (var key in aggregatedFrequencyMap) {
                labels.push(key);
                values.push(aggregatedFrequencyMap[key]);
            }
            
            $scope.labels = labels;
            $scope.chartData = values;
            $scope.series = undefined;
        } else {
            // iterate through data
            var groupedFrequencyMaps = {};
            $scope.data.forEach(function(row) {
                var stringFrequencyMap = row[frequencyMapProperty];
                var series = row[seriesProperty];

                if (stringFrequencyMap && series !== null && series !== undefined) {    // skip empty frequency maps and series
                    if (!groupedFrequencyMaps[series]) { // if no frequency exists for this series, create one
                        groupedFrequencyMaps[series] = {};
                    }
                    var keyValues = stringFrequencyMap.split(', ');    // iterate through frequency map
                    keyValues.forEach(function(keyValue) {
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

        $scope.data.forEach(function(row) {
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
            
            $scope.data.forEach(function(row) {
                var labelIndex = uniqueLabels.indexOf(row[labelsProperty]);
                if (labelIndex !== -1) {
                    data[labelIndex] = data[labelIndex] === undefined ? row[dataProperty] : data[labelIndex] + row[dataProperty];
                }
            });
        } else {
            var uniqueSeries = [];
            $scope.data.forEach(function(row) {
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

        options.legend = {
            display: $scope.showLegend
        }

        options.title = {
            display: true 
        }

        var chartFields = Object.keys(chartSettings.fields);

        switch(chartSettings.type) {
            case 'bar'  :
                if (chartFields.length === 2) {
                    options.title.text = chartSettings.fields[chartFields[0]].value;
                    break
                }
            case 'line' :
            case 'horizontalBar':  
                options.title.text = chartSettings.fields[chartFields[0]].value  + ' vs ' + chartSettings.fields[chartFields[1]].value;
                break;
            default: 
                options.title.text = chartSettings.fields[chartFields[0]].value + ' per ' + chartSettings.fields[chartFields[1]].value;
        
        }

        for (var field in chartSettings.fields) {
            var fieldData = chartSettings.fields[field];
            if (fieldData.axis) {
                if (!options.scales) {
                    options.scales = {};
                }
                options.scales[axisToOptionName[fieldData.axis]] = [{
                    scaleLabel: {
                        display: true,
                        labelString: fieldData.value
                    }
                }]
                if (time.isTimeProperty(fieldData.value)) {
                    options.scales[axisToOptionName[fieldData.axis]][0]['type'] = 'time';
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
}]);
