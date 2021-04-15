describe('The My Queries component', function() {

    var ctrl;
    var $componentController;
    var previousQueries;
    var $mdDialog;

    beforeEach(module('app'));

    beforeEach(inject(function(_$componentController_, _previousQueries_, _$mdDialog_) {
        $componentController =_$componentController_;
        previousQueries = _previousQueries_;
        $mdDialog = _$mdDialog_;
    }));

    beforeEach(function() {
        ctrl = $componentController('myQueries');
    });


    describe('ctrl.$onInit()', function() {
        it('should get the previously run queries from the service', function() {
            spyOn(previousQueries, 'getQueries').and.returnValue('test');
            
            ctrl.$onInit();

            expect(ctrl.queries).toEqual('test');
        });
    });

    describe('ctrl.createNew()', function() {
        var navigation, operationChain;

        beforeEach(inject(function(_navigation_, _operationChain_) {
            navigation = _navigation_;
            operationChain = _operationChain_;
        }));

        it('should reset the operation chain', function() {
            spyOn(operationChain, 'reset');

            ctrl.createNew();

            expect(operationChain.reset).toHaveBeenCalled();
        });

        it('should navigate to the query page', function() {
            spyOn(navigation, 'goToQuery');

            ctrl.createNew();

            expect(navigation.goToQuery).toHaveBeenCalled();
        });
    });

    // describe('ctrl.queriesList()', function() {

    //     it('should return updated queries to child', function() {

    //         spyOn(ctrl, 'queriesList').and.callThrough();

    //     });
    // });
ß
    describe('ctrl.getUpdatedOperations()', function() {
        
        it('should update name and description inputs', function() {
            ctrl.updatedQuery = {
                name: 'test',
                description: 'test' 
            }
            spyOn(ctrl, 'getUpdatedOperations');

            ctrl.getUpdatedOperations('test data');

            expect(ctrl.updatedQuery).toEqual({name: 'test', description: 'test'});

        });
    });

    describe('ctrl.saveUpdatedDetails()', function() {
        var previousQueries;

        beforeEach(inject(function( _previousQueries_) {
            previousQueries = _previousQueries_;
        }));

        beforeEach(function() {
            spyOn(previousQueries, 'updateQuery');
            ctrl.queries = [{
                name: 'Operation Chain',
                operations: [{
                    selectedOperation: { name: 'Get All Elements', description: 'Some description' }
                }]
            }];
        });
      
        it('should get updated name and description', function() {
            spyOn(previousQueries, 'getCurrentChain').and.returnValue({ chain: 0, operationIndex: 0 });

            ctrl.saveUpdatedDetails();

            expect(previousQueries.getCurrentChain).toHaveBeenCalled();
        });

        it('should show error message dialog if name is "null" ', function() {
            ctrl.updatedQuery = {
                name: null,
                description: 'test'
            }
            var invalidName = $mdDialog.confirm()
            .title('Invalid Data!')
            .textContent('Please enter a valid Name and Description')
            .ok('Ok')
            .cancel('Cancel')

            spyOn($mdDialog, 'show');

            ctrl.saveUpdatedDetails();
            
            expect(ctrl.updatedQuery.name).toEqual(null);
            expect($mdDialog.show).toHaveBeenCalledWith(invalidName);
        });

        it('should show error message dialog if name is empty string ', function() {
            ctrl.updatedQuery = {
                name: '',
                description: 'test'
            }
            var invalidName = $mdDialog.confirm()
            .title('Invalid Data!')
            .textContent('Please enter a valid Name and Description')
            .ok('Ok')
            .cancel('Cancel')

            spyOn($mdDialog, 'show');

            ctrl.saveUpdatedDetails();
            
            expect(ctrl.updatedQuery.name).toEqual('');
            expect($mdDialog.show).toHaveBeenCalledWith(invalidName);
        });

        it('should confirm with user to edit name and description', function(){
            var returnMock = {
                then: jasmine.createSpy()
            };
            ctrl.updatedQuery.name = 'test';
            var confirm = $mdDialog.confirm()
            .title('Are you sure you want to change the Name and Description?')
            .ok('Ok')
            .cancel('Cancel')
            
            spyOn($mdDialog, 'show').and.returnValue(returnMock);

            ctrl.saveUpdatedDetails();
            expect(ctrl.updatedQuery.name).toEqual('test');
            expect($mdDialog.show).toHaveBeenCalledWith(confirm);
        });
        
        it('should update the name and description in (1st) operation in (1st) chain', function() {
            // given
            var query = {
                name: 'Operation Chain 0',
                operations: [{
                    selectedOperation: { name: 'Get Elements', description: 'Gets elements related to provided seeds' }
                },
                {
                    selectedOperation: { name: 'Get Elements', description: 'Gets elements related to provided seeds' }
                }],
            }

             // when
            var updatedQuery = {
                name: 'test updated name', description: 'test updated description'
            };
             
            ctrl.saveUpdatedDetails();

            // then
            query = {
                name: 'Operation Chain 0',
                operations: [{
                    selectedOperation: { name: 'test updated name', description: 'test updated description' }
                }]
            };
       
            expect(updatedQuery.name).toEqual(query.operations[0].selectedOperation.name);
        });

        it('should update the name and description in (2nd) operation in (1st) chain', function() {
            // given
            var query = {
                name: 'Operation Chain 0',
                operations: [{
                    selectedOperation: { name: 'Get Elements', description: 'Gets elements related to provided seeds' }
                },
                {
                    selectedOperation: { name: 'Get Elements', description: 'Gets elements related to provided seeds' }
                }],
            }

             // when
            var updatedQuery = {
                name: 'test updated name', description: 'test updated description'
            };
             
            ctrl.saveUpdatedDetails();

            // then
            query = {
                name: 'Operation Chain 0',
                operations: [{
                    selectedOperation: { name: 'Get Elements', description: 'Gets elements related to provided seeds' }
                },
                {
                    selectedOperation: { name: 'test updated name', description: 'test updated description' }
                }]
            };
       
            expect(updatedQuery.name).toEqual(query.operations[1].selectedOperation.name);
        });

        it('should update the name and description in (1st) operation in (2nd) chain', function() {

            // given
            var query = {
                name: 'Operation Chain 1',
                operations: [{
                    selectedOperation: { name: 'Get Elements', description: 'Gets elements related to provided seeds' }
                }]
            }

             // when
             var updatedQuery = {
                name: 'test updated name', description: 'test updated description'
            };
             
            ctrl.saveUpdatedDetails();

            // then
            query = {
                name: 'Operation Chain 1',
                operations: [{
                    selectedOperation: { name: 'test updated name', description: 'test updated description' }
                }]
            };
       
            expect(updatedQuery.name).toEqual(query.operations[0].selectedOperation.name);
        });

        it('should call the updatedQuery function', function() {
            ctrl.updatedQuery = {
                name: 'test',
                description: 'test'
            };
            var chainToUpdate = {
                chain: 0,
                operationIndex: 0
            };

            ctrl.saveUpdatedDetails();
          
            expect(previousQueries.updateQuery).toHaveBeenCalledWith(chainToUpdate.chain,chainToUpdate.operationIndex,ctrl.updatedQuery);
        });
    });
});
