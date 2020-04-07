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

describe('The import/export dialog controller', function() {

    beforeEach(module('app'));

    var $controller;
    var $mdDialog;
    var results;
    var error;
    var $mdToast
    var $scope={};
    var mockData = {
        group: "Somedata",
        source: "Somedata",
        destination: "Somedata",
        directed: true,
        class: "Somedata"
    };

    beforeEach(inject(function(_$controller_, _$mdDialog_, _results_, _error_, _$mdToast_){
        $controller = _$controller_;
        $mdDialog = _$mdDialog_;
        results = _results_;
        error = _error_;
        $mdToast = _$mdToast_;

    }));

    it('should exist', function() {
        var controller = $controller('ImportExportDialogController', { $scope: $scope });

        expect(controller).toBeDefined();
    });

    it('should init with Import File Name as empty string', function() {
        $controller('ImportExportDialogController', { $scope: $scope });

        expect($scope.importFilename).toBe("");
    });

    it('should hide the dialog when scope is cancelled', function() {
        spyOn($mdDialog, 'hide');
        $controller('ImportExportDialogController', { $scope: $scope, $mdDialog: $mdDialog });

        $scope.cancel();

        expect($mdDialog.hide).toHaveBeenCalled();
    });

    it('should export file successfully', function(){
        spyOn($mdDialog, 'hide');
        spyOn(results, 'get').and.returnValue({ edges: [mockData], entities: [], other: []});
        $controller('ImportExportDialogController', { $scope: $scope, results: results });

        $scope.export();

        expect(results.get()).toEqual({edges: [mockData], entities: [], other: []});
        expect($mdDialog.hide).toHaveBeenCalled();
    });

    it('should call back errors when there are no results to export', function() {
        spyOn(error, 'handle');
        $controller('ImportExportDialogController', { $scope: $scope,  error: error });

        $scope.export();

        expect(error.handle).toHaveBeenCalledWith("There are no results to export.");
    });

    it('should import file successfully', function() {
        var element = document.createElement('input');
        element.id = 'import-results-file';
        document.body.appendChild(element);

        var reader = new FileReader();
        var toast = $mdToast.simple().textContent("Results imported").position('top right');

        spyOn(results, 'update').and.returnValue(mockData);
        spyOn($mdDialog, 'hide');
        spyOn(error, 'handle');
        spyOn($mdToast, 'simple');

        $controller('ImportExportDialogController', { $scope:$scope, $mdDialog:$mdDialog, results:results, error:error, $mdToast:$mdToast});

        $scope.import();

        reader.addEventListener('onloadend', function(e) {
            expect(e.target.result).toEqual(mockData);
            done();
        });
        expect(results.update()).toEqual(mockData);

        $mdToast.show(toast).then(function() {

            expect($mdToast.simple).toHaveBeenCalled();
            expect($mdDialog.hide).toHaveBeenCalled();
        });
    });

    it('should not parse if file is not in JSON format', function() {
        var mockArg = 'anything';
        var reader = new FileReader();
        spyOn(error, 'handle').and.stub();

        $controller('ImportExportDialogController', { $scope: $scope,  error: error });

        $scope.import();

        expect(function(){reader.onloadend(mockArg)}).toThrow();
        expect(error.handle).toHaveBeenCalled();
    });

    it('should call back with choose file error when no file exists', function() {
        spyOn(error, 'handle');
        $controller('ImportExportDialogController', { $scope: $scope,  error: error });

        $scope.import();

        expect(error.handle).toHaveBeenCalledWith("Please choose a file before clicking import.");
    });
});
