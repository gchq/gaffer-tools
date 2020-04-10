/*
 * Copyright 2020 Crown Copyright
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

angular.module('app').controller('ImportExportDialogController', ['$scope', '$mdDialog', 'results', 'error', '$mdToast', function($scope, $mdDialog, results, error, $mdToast) {

    var downloadData = function(fileName, data, mimeType, callback) {
        var downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(new Blob([data], {type: mimeType}));
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
    }

    $scope.importFilename = "";

    $scope.cancel = function() {
        $mdDialog.hide();
    }

    $scope.export = function() {
        var mimeType = 'data:application/json;charset=utf-8';
        var rawResults = results.get();
        var rawResultsArray = rawResults.edges.concat(rawResults.entities).concat(rawResults.other)
        if(rawResultsArray.length == 0) {
            error.handle("There are no results to export.");
        } else {
            var data = JSON.stringify(rawResultsArray);
            var fileName = 'gaffer_results_' + Date.now() + '.json'
            downloadData(fileName, data, mimeType);
            $mdDialog.hide();
        }
    }

    $scope.import = function() {
        var files = document.getElementById('import-results-file').files;
        if(files && files.length == 1 && files[0] != "") {
            var file = files[0];
            var reader = new FileReader();
            reader.onloadend = function(e) {
                $scope.importJsonFile(e);
            };
            reader.readAsBinaryString(file);
        } else {
            error.handle("Please choose a file before clicking import.");
        }
    }

    $scope.importJsonFile = function(e) {
        try {
            var json = JSON.parse(e.target.result);
            results.update(json);
            $mdToast.show(
                $mdToast.simple().textContent("Results imported").position('top right')
            );
            $mdDialog.hide();
        } catch(e) {
            error.handle("Failed to parse import file. Only JSON import files are supported.");
        }
    };
}]);
