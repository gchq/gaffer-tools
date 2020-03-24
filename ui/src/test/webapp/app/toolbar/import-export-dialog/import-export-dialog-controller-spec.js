'use strict';

describe('The import/export dialog controller', function() {

    beforeEach(module('app'));
    
    var $controller;
    var $mdDialog;
    var results;
    var error;

    beforeEach(inject(function($injector){
        $controller = $injector.get('$controller');
        $mdDialog = $injector.get('$mdDialog');
        results = $injector.get('results');
        error = $injector.get('error');
    }));

    it('should init with Import File Name as empty string', function() {
        var $scope = {};
        
        $controller('ImportExportDialogController', { $scope: $scope });
        
        expect($scope.importFilename).toBe("");
    });

    it('should hide the dialog when scope is cancelled', function() {
        var $scope = {};
        spyOn($mdDialog, 'hide');
        $controller('ImportExportDialogController', { $scope: $scope, $mdDialog: $mdDialog });
        
        expect($mdDialog.hide).not.toHaveBeenCalled();

        $scope.cancel();

        expect($mdDialog.hide).toHaveBeenCalled();
    });

    /**
     * TODO: test export() function
     * Trying to mock return results.get() to return empty
     * Then test that error.handle() is called with the error message as an arg
     * 
     */
    it('should call back errors when there are no results to export', function() {
        var $scope = {};
        spyOn($mdDialog, 'hide');
        spyOn(results, 'get').and.returnValue({edges: [], entities: []});
        spyOn(error, 'handle');

        $controller('ImportExportDialogController', { $scope: $scope, $mdDialog: $mdDialog, results: results, error: error });
        
        $scope.export();

        expect(error).toEqual('')
        expect(error.handle).toEqual('')
        expect(error.handle.args).toBe("There are no results to export.")

        expect($mdDialog.hide).toHaveBeenCalled();
    });

});
