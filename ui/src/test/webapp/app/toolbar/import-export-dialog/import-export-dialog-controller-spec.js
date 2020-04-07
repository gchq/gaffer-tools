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

    describe('Export', function() {
        it('should call back No Results To Export error when all results are empty', function() {
            spyOn(error, 'handle');
            var emptyResults = { edges: [], entities: [], other: [] };
            spyOn(results, 'get').and.returnValue(emptyResults);
            $controller('ImportExportDialogController', { $scope: $scope, results: results, error: error });

            $scope.export();

            expect(error.handle).toHaveBeenCalledWith("There are no results to export.");
        });

        it('should no show No Results error when at least one edge exists', function() {
            spyOn(error, 'handle');
            var emptyResults = { edges: ["edge"], entities: [], other: [] };
            spyOn(results, 'get').and.returnValue(emptyResults);
            $controller('ImportExportDialogController', { $scope: $scope, results: results, error: error });

            $scope.export();

            expect(error.handle).not.toHaveBeenCalledWith("There are no results to export.");
        });

        it('should no show No Results error when at least one entity exists', function() {
            spyOn(error, 'handle');
            var emptyResults = { edges: [], entities: ["entity"], other: [] };
            spyOn(results, 'get').and.returnValue(emptyResults);
            $controller('ImportExportDialogController', { $scope: $scope, results: results, error: error });

            $scope.export();

            expect(error.handle).not.toHaveBeenCalledWith("There are no results to export.");
        });

        it('should no show No Results error when at least one other result exists', function() {
            spyOn(error, 'handle');
            var emptyResults = { edges: [], entities: [], other: ["other result"] };
            spyOn(results, 'get').and.returnValue(emptyResults);
            $controller('ImportExportDialogController', { $scope: $scope, results: results, error: error });

            $scope.export();

            expect(error.handle).not.toHaveBeenCalledWith("There are no results to export.");
        });

        it('should hide mdDialog and append/remove <a> element when results exist', function() {
            spyOn($mdDialog, 'hide');
            spyOn(URL, 'createObjectURL');
            spyOn(URL, 'revokeObjectURL');
            spyOn(document.body, 'appendChild');
            spyOn(document.body, 'removeChild');
            spyOn(results, 'get').and.returnValue({ edges: ["edge"], entities: ["entity"], other: ["other"]});
            $controller('ImportExportDialogController', { $scope: $scope, results: results });

            $scope.export();

            expect(URL.createObjectURL).toHaveBeenCalledWith(jasmine.any(Blob));
            expect(URL.revokeObjectURL).toHaveBeenCalled();
            expect(document.body.appendChild).toHaveBeenCalledWith(jasmine.any(HTMLElement));
            expect(document.body.removeChild).toHaveBeenCalledWith(jasmine.any(HTMLElement));
            expect($mdDialog.hide).toHaveBeenCalled();
        });
    });

    describe('Import', function() {
        it('should return Please choose file when import-results element has null files', function() {
            spyOn(error, 'handle');
            var emptyDiv = document.createElement('div');
            emptyDiv.id = 'import-results-file';
            document.body.appendChild(emptyDiv);
            $controller('ImportExportDialogController', { $scope: $scope, error: error });

            $scope.import();

            expect(error.handle).toHaveBeenCalledWith("Please choose a file before clicking import.");
        });

        it('should return Please choose file when import-results element has empty files', function() {
            spyOn(error, 'handle');
            var emptyFilesArray = { files: [] };
            spyOn(document, 'getElementById').and.returnValue(emptyFilesArray);
            $controller('ImportExportDialogController', { $scope: $scope, error: error });

            $scope.import();

            expect(error.handle).toHaveBeenCalledWith("Please choose a file before clicking import.");
        });

        it('should return Please choose file when import-results has more than 1 file', function() {
            spyOn(error, 'handle');
            var twoFiles = { files: ["1", "2"] };
            spyOn(document, 'getElementById').and.returnValue(twoFiles);
            $controller('ImportExportDialogController', { $scope: $scope, error: error });

            $scope.import();

            expect(error.handle).toHaveBeenCalledWith("Please choose a file before clicking import.");
        });

        it('should return Please choose file when import-results first file is empty', function() {
            spyOn(error, 'handle');
            var emptyFile = { files: [""] };
            spyOn(document, 'getElementById').and.returnValue(emptyFile);
            $controller('ImportExportDialogController', { $scope: $scope, error: error });

            $scope.import();

            expect(error.handle).toHaveBeenCalledWith("Please choose a file before clicking import.");
        });

        it('should NOT return Please choose file when import-results element has a file', function() {
            spyOn(error, 'handle');
            var oneFile = { files: ['Mock'] };
            spyOn(document, 'getElementById').and.returnValue(oneFile);

            $controller('ImportExportDialogController', { $scope: $scope, error: error });

            $scope.import();

            expect(error.handle).not.toHaveBeenCalledWith("Please choose a file before clicking import.");
        });
    });
});
