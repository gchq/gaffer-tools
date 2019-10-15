describe('The operation chain component', function() {

    var ctrl, scope;
    var $componentController

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {
            var get = function() {
                return $q.when({});
            }

            return {
                get: get
            }
        });

        $provide.factory('schema', function($q) {
            return {
                get: function() {
                    return $q.when({});
                }
            }
        });
    }));

    beforeEach(inject(function(_$rootScope_, _$componentController_, _operationChain_) {
        scope = _$rootScope_.$new();
        $componentController = _$componentController_;
        ctrl = $componentController('operationChain', {$scope: scope});
        operationChain = _operationChain_;
    }));

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    it('should populate the operations from the operation chain service', function() {
        spyOn(operationChain, 'getOperationChain').and.returnValue('test');
        ctrl = $componentController('operationChain');
        expect(operationChain.getOperationChain).toHaveBeenCalled();
        expect(ctrl.operations).toEqual('test');
    });

    describe('ctrl.$onInit()', function() {
        var $q
        var config;

        beforeEach(inject(function(_$q_, _config_) {
            config = _config_;
            $q = _$q_;
        }));

        it('should inject set the time config', function() {
            spyOn(config, 'get').and.returnValue($q.when({
                time: {
                    'foo': 'bar'
                }
            }));

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.timeConfig).toEqual({
                'foo': 'bar'
            });
        });
    });

    describe('ctrl.addOperation()', function() {

        beforeEach(function() {
            ctrl.operations = [ { expanded: true }, { expanded: false }, {expanded: true} ];
        });

        it('should shrink every existing operation in the chain', function() {
            ctrl.addOperation();
            for (var i = 0; i < 2; i++) {
                expect(ctrl.operations[i].expanded).toBeFalsy();
            }
        });

        it('should add an operation to the operation chain service', function() {
            spyOn(operationChain, 'add');
            ctrl.addOperation();
            expect(operationChain.add).toHaveBeenCalled();
        });

        it('should set the input flag by default so that an operations input is disabled by default', function() {
            spyOn(operationChain, 'add');
            ctrl.addOperation();
            expect(operationChain.add).toHaveBeenCalledWith(false);
        });
    });

    describe('ctrl.$onDestroy()', function() {
        it('should update the operation chain service', function() {
            spyOn(operationChain, 'setOperationChain');
            ctrl.$onDestroy();
            expect(operationChain.setOperationChain).toHaveBeenCalled();
            expect(operationChain.setOperationChain).toHaveBeenCalledWith(ctrl.operations);
        });
    });

    describe('ctrl.deleteOperation()', function() {

        var events;

        beforeEach(inject(function(_events_) {
            events = _events_;
        }));

        beforeEach(function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        name: 'test1',
                        fields: {}
                    },
                    fields: {
                        input: [],
                        inputPairs: []
                    }
                },
                {
                    selectedOperation: {
                        name: 'test2',
                        fields: {}
                    },
                    fields: {
                        input: null,
                        inputPairs: null
                    }
                },
                {
                    selectedOperation: {
                        name: 'test3',
                        fields: {}
                    },
                    fields: {
                        input: null,
                        inputPairs: null
                    }
                }
            ]
        });

        it('should delete the operation at the given index', function() {
            ctrl.deleteOperation(1); // remove the middle one
            expect(ctrl.operations.length).toEqual(2);
            expect(ctrl.operations[0].selectedOperation.name).toEqual('test1')
            expect(ctrl.operations[1].selectedOperation.name).toEqual('test3')
        });

        it('should broadcast an event', function() {
            spyOn(events, 'broadcast');
            ctrl.deleteOperation(2);
            expect(events.broadcast).toHaveBeenCalled();
        });

        it('should set the inputs to empty arrays if the input is null', function() {
            ctrl.deleteOperation(0);
            expect(ctrl.operations[0]).toEqual({
                selectedOperation: {
                    name: 'test2',
                    fields: {}
                },
                fields: {
                    input: [],
                    inputPairs: []
                }
            })
        });

        it('should leave the inputs as they are if the input is not null', function() {
            ctrl.operations.splice(1, 0, {
                fields: {
                    input: [ 1, 2 ],
                    inputB: []
                }
            });

            ctrl.deleteOperation(0);

            expect(ctrl.operations[0].fields.input).toEqual([1, 2]);
        });
    });

    describe('ctrl.resetOperation()', function() {
        beforeEach(function() {
            spyOn(operationChain, 'createBlankOperation').and.callFake(function(inputFlag) {
                return 'resetted operation with ' + (inputFlag ? "input" : "no input");
            });
        });

        beforeEach(function() {
            ctrl.operations = [ 'a', 'b', 'c' ]
        });

        it('should reset the first operation with input when the index is 0', function() {
            ctrl.resetOperation(0);
            expect(ctrl.operations[0]).toEqual('resetted operation with input')
        });

        it('should reset any other operation with no input', function() {
            ctrl.resetOperation(1);
            expect(ctrl.operations[1]).toEqual('resetted operation with no input')
        });
    });

    describe('ctrl.isNotLast()', function() {

        beforeEach(function() {
            ctrl.operations = [ 'a', 'b', 'c' ]
        })
        it('should return false if the operation is the only one in the chain', function() {
            ctrl.operations = ['a'];
            expect(ctrl.isNotLast(0)).toBeFalsy();
        });

        it('should return false if the index is that of the last operation in the chain', function() {
            expect(ctrl.isNotLast(2)).toBeFalsy();
        });

        it('should return true when the index is not that of the final operation', function() {
            expect(ctrl.isNotLast(1)).toBeTruthy();
        });
    });

    describe('ctrl.canExecute()', function() {
        var loading;
        var isLoading;

        beforeEach(inject(function(_loading_) {
            loading = _loading_;
        }));

        beforeEach(function() {
            spyOn(loading, 'isLoading').and.callFake(function() {
                return isLoading;
            });
        });

        beforeEach(function() {
            isLoading = false;
            ctrl.operationChainForm = {
                $valid: true
            }
        })

        it('should return false if the form is invalid', function() {
            ctrl.operationChainForm = {
                $valid: false
            }

            expect(ctrl.canExecute()).toBeFalsy();
        });

        it('should return false if there is a query currently loading', function() {
            isLoading = true;
            expect(ctrl.canExecute()).toBeFalsy();
        });

        it('should return true if the form is valid and no query results are pending', function() {
            expect(ctrl.canExecute()).toBeTruthy();
        });
    });

    describe('ctrl.saveChain()', function() {

        var query, error, $mdDialog, operationService;

        var valid;

        beforeEach(inject(function(_query_, _error_, _$mdDialog_, _operationService_) {
            query = _query_;
            error = _error_;
            $mdDialog = _$mdDialog_;
            operationService = _operationService_;
        }));

        beforeEach(function() {
            valid = true;

            spyOn(ctrl, 'canExecute').and.callFake(function() {
                return valid;
            });
        });

        beforeEach(function() {
            spyOn(query, 'executeQuery').and.callFake(function(query,onSuccess) {
                onSuccess();
            });
            spyOn(error, 'handle').and.stub();
            spyOn($mdDialog, 'show').and.stub();

            ctrl.operations = [];
        });

        it('should not save if canExecute() returns false', function() {
            valid = false;

            ctrl.saveChain();

            expect(query.executeQuery).not.toHaveBeenCalled();
        });

        it('should broadcast an error if the length of the chain is 0', function() {
            ctrl.saveChain();
            expect(error.handle).toHaveBeenCalledWith("Unable to save operation chain with no operations");
        });

        it('should not save the chain if the length of the chain is 0', function() {
            ctrl.saveChain();
            expect(query.executeQuery).not.toHaveBeenCalled();
        })

        it('should set the class of the operation to operation chain', function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {}
                    }
                }
            ]
            ctrl.executeChain();
            expect(query.executeQuery).toHaveBeenCalled();
            var json = query.executeQuery.calls.first().args[0];

            expect(json.class).toEqual("uk.gov.gchq.gaffer.operation.OperationChain");
        });
        
        it('should not save if a name has not been entered', function() {
            ctrl.namedOperationName = '';
            ctrl.namedOperationDescription = 'test description';

            ctrl.saveChain();

            expect(query.executeQuery).not.toHaveBeenCalled();
        });

        it('should show an error dialog if the name is invalid', function() {
            ctrl.namedOperationName = '';
            ctrl.namedOperationDescription = 'test description';
            ctrl.operations.length = 1;

            var invalidName = $mdDialog.confirm()
            .title('Operation chain name is invalid!')
            .textContent('You must provide a name for the operation')
            .ok('Ok')

            ctrl.saveChain();

            expect($mdDialog.show).toHaveBeenCalledWith(invalidName);
        });

        it('should save using an add named operation query', function() {
            var testName = 'test name';
            var testDescription = 'test description';
            var OPERATION_CHAIN_CLASS = "uk.gov.gchq.gaffer.operation.OperationChain";    
            var chain = {
                    class: OPERATION_CHAIN_CLASS,
                    operations: []
            }
            const ADD_NAMED_OPERATION_CLASS = "uk.gov.gchq.gaffer.named.operation.AddNamedOperation";

            ctrl.operations.length = 1;
            ctrl.namedOperation.name = testName;
            ctrl.namedOperation.description = testDescription;

            var expectedQuery = {
                class: ADD_NAMED_OPERATION_CLASS,
                operationName: testName,
                operationChain: chain,
                description: testDescription,
                options: {},
                score: 1,
                overwriteFlag: true,
            }
            
            ctrl.saveChain();

            expect(query.executeQuery).toHaveBeenCalledWith(expectedQuery, jasmine.any(Function));    
        })

        it('should show a confirmation dialog', function() {
            ctrl.namedOperation.name = 'test name';
            ctrl.namedOperation.description = 'test description';
            ctrl.operations.length = 1;

            var confirm = $mdDialog.confirm()
            .title('Operation chain saved as named operation!')
            .textContent('You can now see your saved operation in the list of operations')
            .ok('Ok')

            ctrl.saveChain();

            expect($mdDialog.show).toHaveBeenCalledWith(confirm);
        })

        it('should close the sidenav on success', function() {
            spyOn(ctrl, 'toggleSideNav').and.stub();
            ctrl.namedOperation.name = 'test name';
            ctrl.namedOperation.description = 'test description';
            ctrl.operations.length = 1;

            ctrl.saveChain();

            expect(ctrl.toggleSideNav).toHaveBeenCalled();
        })

        it('should reload the operations on success', function() {
            spyOn(operationService, 'reloadOperations').and.stub();
            ctrl.namedOperation.name = 'test name';
            ctrl.namedOperation.description = 'test description';
            ctrl.operations.length = 1;

            ctrl.saveChain();

            expect(operationService.reloadOperations).toHaveBeenCalled();
        })
    })

    describe('ctrl.execute()', function() {

        var query, types;

        beforeEach(inject(function(_query_, _types_) {
            query = _query_;
            types = _types_;
        }));

        beforeEach(function() {
            spyOn(query, 'execute').and.stub();
        });

        beforeEach(function() {
            ctrl.operationChainForm = {
                $valid: true
            }
        })

        describe('when building up the operation', function() {

            describe('when adding views', function() {

                var selectedOperation = {
                    name: 'test',
                    fields: {
                        view: {}
                    }
                }

                it('should create a basic view from the view edges and entities', function() {

                    var op = {
                        selectedOperation: selectedOperation,
                        fields: {
                            view: {
                                viewEntities: ['elementGroup1','elementGroup2','elementGroup3'],
                                viewEdges: ['edge1','edge2'],
                                entityFilters: {},
                                edgeFilters: {}
                            }
                        },
                        dates: {}
                    }

                    ctrl.execute(op);

                    var entities =  {
                        'elementGroup1': {},
                        'elementGroup2': {},
                        'elementGroup3': {}
                    }

                    var edges = {
                        'edge1': {},
                        'edge2': {}
                    }

                    expect(JSON.stringify(query.execute.calls.argsFor(0)[0])).toContain(JSON.stringify(entities));
                    expect(JSON.stringify(query.execute.calls.argsFor(0)[0])).toContain(JSON.stringify(edges));

                });

                it('should create gaffer filters from the elementFilters', function() {

                    spyOn(types, 'isKnown').and.callFake(function(clazz) {
                        if (clazz === 'java.lang.Comparable') {
                            return false;
                        } else if (clazz === 'boolean') {
                            return true;
                        } else {
                            throw Error('Unexpected class' + clazz);
                        }
                    });

                    spyOn(types, 'createJsonValue').and.callFake(function(valueClass, parts) {
                        var value = {};

                        value[valueClass] = parts[undefined];
                        return value;
                    });

                    var op = {
                        selectedOperation: selectedOperation,
                        fields: {
                            view: {
                                viewEdges: ['a'],
                                edgeFilters: {
                                    'a': [
                                        {
                                            preAggregation: true,
                                            predicate: 'some.koryphe.Predicate',
                                            property: 'b',
                                            parameters: {
                                                'value': {
                                                    'valueClass': 'java.lang.Long',
                                                    'parts': {
                                                        undefined: 205
                                                    }
                                                }
                                            },
                                            availableFunctionParameters: {'value': 'java.lang.Comparable', 'orEqualTo': 'boolean'}
                                        }
                                    ]
                                }
                            }
                        },
                        dates: {}
                    }

                    var expectedView = {
                        'a': {
                            preAggregationFilterFunctions: [
                                {
                                    'predicate': {
                                        class: 'some.koryphe.Predicate',
                                        value: {
                                            'java.lang.Long': 205
                                        }
                                    },
                                    'selection': [ 'b' ]
                                }
                            ]
                        }
                    }

                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.argsFor(0)[0])).toContain(JSON.stringify(expectedView));
                });

                it('should add the group-by to the operation if summarise is set to true', function() {
                    var op = {
                        selectedOperation: selectedOperation,
                        fields: {
                            view: {
                                summarise: true
                            }
                        },
                        dates: {}
                    }

                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain('"groupBy":[]');
                });
                it('should not add the group-by to the operation if summarise is set to false', function() {
                    var op = {
                        selectedOperation: selectedOperation,
                        fields: {
                            view: {
                                summarise: false
                            }
                        },
                        dates: {}
                    }
    
                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('"groupBy":[]');
                });
            });


            describe('When adding Named views', function() {

                var op;

                beforeEach(function() {
                    op = {
                        selectedOperation: {
                            class: 'some.operation.with.View',
                            fields: {
                                view: {}
                            }
                        },
                        fields: {
                            view: {
                                viewEntities: ['elementGroup1','elementGroup2','elementGroup3'],
                                viewEdges: ['edge1','edge2'],
                                entityFilters: {},
                                edgeFilters: {}
                            }
                        },
                        dates: {}
                    }
                });

                it('should do nothing if the named views are undefined', function() {
                    op.fields.view.namedViews = undefined;
                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('views');
                });

                it('should do nothing if the named views are undefined', function() {
                    op.fields.view.namedViews = null;
                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('views');
                });

                it('should do nothing if the named views are an empty array', function() {
                    op.fields.view.namedViews = [];
                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('views');
                });

                it('should add the preExisting view to the views array', function() {
                    op.fields.view.namedViews = [{name: "test"}];
                    ctrl.execute(op);

                    var entities =  {
                        'elementGroup1': {},
                        'elementGroup2': {},
                        'elementGroup3': {}
                    }

                    var edges = {
                        'edge1': {},
                        'edge2': {}
                    }

                    expect(JSON.stringify(query.execute.calls.argsFor(0)[0])).toContain(JSON.stringify(entities));
                    expect(JSON.stringify(query.execute.calls.argsFor(0)[0])).toContain(JSON.stringify(edges));


                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain('views');
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('view:');
                });

                it('should add named views with parameters', function() {

                    op.fields.view.namedViews = [{"name": "namedView1", "parameters":{ "testParam": { "parts": { "value": 42}}}}];

                    ctrl.execute(op);


                    var namedView = JSON.stringify({
                        "class": "uk.gov.gchq.gaffer.data.elementdefinition.view.NamedView",
                        "name": "namedView1",
                        "parameters": {
                            "testParam": 42
                        }
                    });

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(namedView)

                });

                it('should not add blank parameters in named views left blank if they are not required', function() {

                    op.fields.view.namedViews = [{
                        name: 'test',
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: false,
                                parts: {
                                    "value": ""
                                }
                            }
                        }
                    }];

                    var unExpected = JSON.stringify({"testParam": "" });

                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain(unExpected);
                });

                it('should add blank parameters into named views if the parameter is marked required', function() {
                    op.fields.view.namedViews = [{
                        name: 'test',
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: true,
                                parts: {
                                    "value": ""
                                }
                            }
                        }
                    }];

                    var expected = JSON.stringify({"testParam": "" });

                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expected);
                });

                it('should not allow null parameters in named views if they are not required', function() {
                    op.fields.view.namedViews = [{
                        name: 'test',
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: false,
                                parts: {
                                    "value": null
                                }
                            }
                        }
                    }];

                    var unExpected = JSON.stringify({"testParam": null });

                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain(unExpected);
                });

                it('should add null parameters if the parameter is marked required', function() {
                    op.fields.view.namedViews = [{
                        name: 'test',
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: true,
                                parts: {
                                    "value": null
                                }
                            }
                        }
                    }];

                    var expected = JSON.stringify({"testParam": null });

                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expected);
                });
            });

            describe('When adding date ranges', function() {

                var op;

                beforeEach(function() {
                    op = {
                        selectedOperation: {
                            name: 'an.operation.Name',
                            fields: { view: {} }
                        },
                        fields: {
                            view: {}
                        },
                        dates: {}
                    }
                });

                beforeEach(function() {
                    spyOn(types, 'createJsonValue').and.callFake(function(valueClass, value) {
                        var json = {};
                        json[valueClass] = value;

                        return json;
                    });
                })

                it('should add no date range if neither start or end date is specified', function() {
                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('startDate');
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('endDate');
                });

                it('should add no date filter if the start and end date is null', function() {
                    op.dates.startDate = null;
                    op.dates.endDate = null;
                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('startDate');
                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain('endDate');
                });

                it('should add a start date with an IsMoreThan filter', function() {
                    op.dates.startDate = 1234567890;
                    ctrl.timeConfig = {
                        filter: {
                            class: "startDateClass",
                            startProperty: "startDateProperty"
                        }
                    };


                    ctrl.execute(op);

                    var expectedFilterFunctions = {
                        "preAggregationFilterFunctions": [
                            {
                                predicate: {
                                    class: 'uk.gov.gchq.koryphe.impl.predicate.IsMoreThan',
                                    orEqualTo: true,
                                    value: { "startDateClass": 1234567890 }
                                },
                                selection: [
                                    'startDateProperty'
                                ]
                            }
                        ]
                    }
                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(JSON.stringify(expectedFilterFunctions));

                });

                it('should add an endDate with an IsLessThan filter', function() {
                    op.dates.endDate = 1234567890;
                    ctrl.timeConfig = {
                        filter: {
                            class: "endDateClass",
                            endProperty: "endDateProperty"
                        }
                    };

                    ctrl.execute(op);

                    var expectedFilterFunctions = {
                        "preAggregationFilterFunctions": [
                            {
                                predicate: {
                                    class: 'uk.gov.gchq.koryphe.impl.predicate.IsLessThan',
                                    orEqualTo: true,
                                    value: { "endDateClass": 1234567890 }
                                },
                                selection: [
                                    'endDateProperty'
                                ]
                            }
                        ]
                    }

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(JSON.stringify(expectedFilterFunctions));

                });
            });

            describe('When adding parameters', function() {

                var op;

                beforeEach(function() {
                    op = {
                        selectedOperation: null,
                        fields: { view: {} },
                        dates: {}
                    }
                });


                it('should add parameters to named operations', function() {
                    op.selectedOperation = {
                        class: 'named.operation.class.Name',
                        name: 'test',
                        namedOp: true,
                        fields: {},
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                parts: {
                                    "value": 42
                                }
                            }
                        }
                    };

                    ctrl.execute(op);

                    var expectedParameters = JSON.stringify({
                        "testParam": 42
                    });

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedParameters)

                });

                it('should not add parameters left blank if they are not required', function() {
                    op.selectedOperation = {
                        class: 'named.operation.class.Name',
                        name: 'test',
                        namedOp: true,
                        fields: {},
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: false,
                                parts: {
                                    "value": ""
                                }
                            }
                        }
                    };

                    ctrl.execute(op);

                    var expectedParameters = JSON.stringify({
                        "testParam": ""
                    });

                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain(expectedParameters)
                });

                it('should add blank parameters if the parameter is marked required', function() {

                    op.selectedOperation = {
                        class: 'named.operation.class.Name',
                        name: 'test',
                        namedOp: true,
                        fields: {},
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: true,
                                parts: {
                                    "value": ""
                                }
                            }
                        }
                    };

                    ctrl.execute(op);


                    var expectedParameters = JSON.stringify({
                        "testParam": ""
                    });

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedParameters)
                });

                it('should not allow null parameters if they are not required', function() {
                    op.selectedOperation = {
                        class: 'named.operation.class.Name',
                        name: 'test',
                        namedOp: true,
                        fields: {},
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: false,
                                parts: {
                                    "value": null
                                }
                            }
                        }
                    };

                    ctrl.execute(op);

                    var expectedParameters = JSON.stringify({
                        "testParam": null
                    });

                    expect(JSON.stringify(query.execute.calls.first().args[0])).not.toContain(expectedParameters)
                });

                it('should add null parameters if the parameter is marked required', function() {
                    op.selectedOperation = {
                        class: 'named.operation.class.Name',
                        name: 'test',
                        namedOp: true,
                        fields: {},
                        parameters: { "testParam": {
                                valueClass: "java.lang.Long",
                                required: true,
                                parts: {
                                    "value": null
                                }
                            }
                        }
                    };

                    ctrl.execute(op);

                    var expectedParameters = JSON.stringify({
                        "testParam": null
                    });

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedParameters)
                });
            });

            describe('When adding seed pairs', function() {

                var op;

                beforeEach(function() {
                    op = {
                        selectedOperation: {
                            fields: {
                                input: {className: 'uk.gov.gchq.gaffer.commonutil.pair.Pair<uk.gov.gchq.gaffer.data.element.id.ElementId,uk.gov.gchq.gaffer.data.element.id.ElementId>[]'}
                            }
                        },
                        fields: {
                            input: [],
                            inputPairs: []
                        }
                    }
                });


                it('should add string seed pairs from the input service to the operation', function() {
                    op.fields.inputPairs = [
                        {first: {valueClass: 'java.lang.String', parts: {undefined: 'test1'} }, second: {valueClass: 'java.lang.String', parts: {undefined: 'test2'} }},
                        {first: {valueClass: 'java.lang.String', parts: {undefined: 'test2'} }, second: {valueClass: 'java.lang.String', parts: {undefined: 'test4'} }}
                    ];

                    var expectedInput = JSON.stringify([
                        { "class": "uk.gov.gchq.gaffer.commonutil.pair.Pair", "first": {"uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": "test1"}}, "second": { "uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": "test2"}}},
                        { "class": "uk.gov.gchq.gaffer.commonutil.pair.Pair", "first": {"uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": "test2"}}, "second": { "uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": "test4"}}}
                    ]);

                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedInput);
                });

                it('should add complex seed pairs from the input service to the operation', function() {
                    op.fields.inputPairs = [
                        { first: { valueClass: "my.complex.Type", parts: { "type": "thing1", "value": "myVal1", "someField": "test1"}}, second: { valueClass: "my.complex.Type", parts: { "type": "thing2", "value": "myVal2", "someField": "test2"}}},
                        { first: { valueClass: "my.complex.Type", parts: { "type": "thing2", "value": "myVal2", "someField": "test2"}}, second: { valueClass: "my.complex.Type", parts: { "type": "thing6", "value": "myVal6", "someField": "test6"}}},
                    ];

                    spyOn(types, 'createJsonValue').and.callFake(function(clazz, parts) {
                        var obj = {};
                        obj[clazz] = parts;
                        return obj;
                    });

                    ctrl.execute(op);

                    var expectedInput = JSON.stringify([
                        {
                            class: "uk.gov.gchq.gaffer.commonutil.pair.Pair",
                            first: {
                                'uk.gov.gchq.gaffer.operation.data.EntitySeed': {
                                    'vertex': { "my.complex.Type": { "type": "thing1", "value": "myVal1", "someField": "test1"}}
                                }
                            },
                            second: {
                                'uk.gov.gchq.gaffer.operation.data.EntitySeed': {
                                    'vertex': { "my.complex.Type": { "type": "thing2", "value": "myVal2", "someField": "test2"}}
                                }
                            }
                        },
                        {
                            class: "uk.gov.gchq.gaffer.commonutil.pair.Pair",
                            first: {
                                'uk.gov.gchq.gaffer.operation.data.EntitySeed': {
                                    'vertex': { "my.complex.Type": { "type": "thing2", "value": "myVal2", "someField": "test2"}}
                                }
                            },
                            second: {
                                'uk.gov.gchq.gaffer.operation.data.EntitySeed': {
                                    'vertex': { "my.complex.Type": { "type": "thing6", "value": "myVal6", "someField": "test6"}}
                                }
                            }
                        }]);

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedInput);
                });

                it('should add numerical seed pairs from the input service to the operation', function() {
                    op.fields.inputPairs = [
                        {first: {valueClass: 'int', parts: {undefined: 35} }, second: {valueClass: 'int', parts: {undefined: 3} }},
                        {first: {valueClass: 'int', parts: {undefined: 1} }, second: {valueClass: 'int', parts: {undefined: 42} }}
                    ];

                    var expectedInput = JSON.stringify([
                        { "class": "uk.gov.gchq.gaffer.commonutil.pair.Pair", "first": {"uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": 35}}, "second": { "uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": 3}}},
                        { "class": "uk.gov.gchq.gaffer.commonutil.pair.Pair", "first": {"uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": 1}}, "second": { "uk.gov.gchq.gaffer.operation.data.EntitySeed": {"vertex": 42}}}
                    ]);

                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedInput);
                });

            });

            describe('When adding seeds', function() {

                var op;

                beforeEach(function() {
                    op = {
                        selectedOperation: {
                            fields: {
                                input: {}
                            }
                        },
                        fields: {
                            input: [],
                            inputPairs: []
                        }
                    }
                });

                it('should add string seeds from the input service to the operation', function() {
                    op.fields.input = [
                        {valueClass: 'java.lang.String', parts: {undefined: 'test1'} },
                        {valueClass: 'java.lang.String', parts: {undefined: 'test2'} },
                        {valueClass: 'java.lang.String', parts: {undefined: 'test3'} }
                    ];

                    var expectedInput = JSON.stringify([
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 'test1'},
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 'test2'},
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 'test3'}]);

                    ctrl.execute(op);
                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedInput);
                });

                it('should add complex seeds from the input service to the operation', function() {
                    op.fields.input = [
                        { valueClass: "my.complex.Type", parts: { "type": "thing1", "value": "myVal1", "someField": "test1"}},
                        { valueClass: "my.complex.Type", parts: { "type": "thing2", "value": "myVal2", "someField": "test2"}},
                        { valueClass: "my.complex.Type", parts: { "type": "thing3", "value": "myVal3", "someField": "test3"}}
                    ];

                    spyOn(types, 'createJsonValue').and.callFake(function(clazz, parts) {
                        var obj = {};
                        obj[clazz] = parts;
                        return obj;
                    });

                    ctrl.execute(op);

                    var expectedInput = JSON.stringify([
                        {
                            'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                            'vertex': { "my.complex.Type": { "type": "thing1", "value": "myVal1", "someField": "test1"}
                            }
                        },
                        {
                            'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                            'vertex': { "my.complex.Type": { "type": "thing2", "value": "myVal2", "someField": "test2"}
                            }
                        },
                        {
                            'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                            'vertex': { "my.complex.Type": { "type": "thing3", "value": "myVal3", "someField": "test3"}
                            }
                        }]);

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedInput);
                });

                it('should add numerical seeds from the input service to the operation', function() {
                    op.fields.input = [
                        {valueClass: "int", parts: {undefined: 1}},
                        {valueClass: "int", parts: {undefined: 2}},
                        {valueClass: "int", parts: {undefined: 3}}
                    ];

                    ctrl.execute(op);

                    var expectedInput = JSON.stringify([
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 1},
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 2},
                        { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 3}])

                    expect(JSON.stringify(query.execute.calls.first().args[0])).toContain(expectedInput);

                });

                describe('When adding a second input', function() {

                    beforeEach(function() {
                        op.selectedOperation.fields.inputB = {};
                        op.selectedOperation.namedOp = false;
                    });

                    it('should add a second input if the operation is not a named operation', function() {
                        op.fields.inputB = [
                            { valueClass: "my.complex.Type", parts: { "type": "thing1", "value": "myVal1", "someField": "test1"}},
                            { valueClass: "my.complex.Type", parts: { "type": "thing2", "value": "myVal2", "someField": "test2"}},
                            { valueClass: "my.complex.Type", parts: { "type": "thing3", "value": "myVal3", "someField": "test3"}}
                        ];

                        spyOn(types, 'createJsonValue').and.callFake(function(clazz, parts) {
                            var obj = {};
                            obj[clazz] = parts;
                            return obj;
                        });

                        var expectedInput = JSON.stringify([
                            {
                                'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                                'vertex': { "my.complex.Type": { "type": "thing1", "value": "myVal1", "someField": "test1"}
                                }
                            },
                            {
                                'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                                'vertex': { "my.complex.Type": { "type": "thing2", "value": "myVal2", "someField": "test2"}
                                }
                            },
                            {
                                'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed',
                                'vertex': { "my.complex.Type": { "type": "thing3", "value": "myVal3", "someField": "test3"}
                                }
                            }
                        ]);

                        ctrl.execute(op);
                        var json = query.execute.calls.first().args[0];

                        expect(JSON.stringify(json.operations[0].inputB)).toEqual(expectedInput);
                    });

                    it('should not add a second input if the operation is a named operation', function() {
                        op.fields.inputB = [
                            {valueClass: 'java.lang.String', parts: {undefined: 'test1'} },
                            {valueClass: 'java.lang.String', parts: {undefined: 'test2'} },
                            {valueClass: 'java.lang.String', parts: {undefined: 'test3'} }
                        ];

                        op.selectedOperation.namedOp = true;

                        ctrl.execute(op);
                        var json = query.execute.calls.first().args[0];

                        expect(JSON.stringify(json.operations[0].inputB)).toBeUndefined();
                    });

                    it('should add an inputB parameter if the operation is a named operation', function() {
                        op.fields.inputB = [
                            {valueClass: "int", parts: {undefined: 1}},
                            {valueClass: "int", parts: {undefined: 2}},
                            {valueClass: "int", parts: {undefined: 3}}
                        ];

                        op.selectedOperation.namedOp = true;

                        ctrl.execute(op);

                        var expectedInput = JSON.stringify([
                            { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 1},
                            { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 2},
                            { 'class': 'uk.gov.gchq.gaffer.operation.data.EntitySeed', 'vertex': 3}
                        ]);

                        var json = query.execute.calls.first().args[0];

                        expect(JSON.stringify(json.operations[0].parameters.inputB)).toEqual(expectedInput);
                    });


                })
            });
        });


        it('should add the selected operation to the list of operations', function() {
            var op = {
                selectedOperation: {
                    fields: {}
                },
                fields: {}
            }

            spyOn(query, 'addOperation');

            ctrl.execute(op);

            expect(query.addOperation).toHaveBeenCalledTimes(1);
        });

        describe('when the results returned number the same as the result limit', function() {
            var scope;
            var navigation, results, settings, graph;
            var $mdDialog, $q;

            var returnValue;

            var op;

            beforeEach(inject(function(_navigation_, _$rootScope_, _$mdDialog_, _$q_, _results_, _settings_, _graph_) {
                navigation = _navigation_;
                scope = _$rootScope_.$new();
                $mdDialog = _$mdDialog_;
                $q = _$q_;
                results = _results_;
                settings = _settings_;
                graph = _graph_;
            }));

            beforeEach(function() {
                op = {
                    selectedOperation: {
                        fields: {}
                    },
                    fields: {}
                }

                spyOn(settings, 'getResultLimit').and.returnValue(2);
                query.execute.and.callFake(function(opChain, callback) {
                    if (callback) {
                        callback([1, 2]);
                    }
                });

                spyOn(graph, 'deselectAll');
                spyOn(results, 'update');

                spyOn($mdDialog, 'show').and.callFake(function() {
                    return $q.when(returnValue);
                });

                spyOn(navigation, 'goTo');
            });

            beforeEach(function() {
                returnValue = 'results';
            });

            beforeEach(function() {
                ctrl.queryForm = {
                    $valid : true
                }
            });

            beforeEach(function() {
                ctrl.execute(op);
                scope.$digest();
            })

            it('should display a dialog if the results numbered the same as the result limit', function() {
                expect($mdDialog.show).toHaveBeenCalledTimes(1);
            });

            it('should navigate to the table if the dialog returns "results"', function() {
                expect(navigation.goTo).toHaveBeenCalledTimes(1);
                expect(navigation.goTo).toHaveBeenCalledWith('results');

                navigation.goTo.calls.reset();

                returnValue = 'not results';
                ctrl.execute(op);
                expect(navigation.goTo).not.toHaveBeenCalled();
            });

            it('should submit the results if the dialog returns "results"', function() {
                expect(results.update).toHaveBeenCalledTimes(1);
                expect(results.update).toHaveBeenCalledWith([1, 2]);

                results.update.calls.reset();

                returnValue = 'query';
                ctrl.execute(op);
                scope.$digest();
                expect(results.update).not.toHaveBeenCalled();
            });

            it('should deselect all elements if the dialog returns "results"', function() {
                expect(graph.deselectAll).toHaveBeenCalledTimes(1);

                graph.deselectAll.calls.reset();

                returnValue = 'query';
                ctrl.execute(op);
                scope.$digest();
                expect(graph.deselectAll).not.toHaveBeenCalled();
            });
        });
    });

    describe('ctrl.executeChain()', function() {

        var events, query, operationService, error, previousQueries, settings, operationChain;

        var valid;

        beforeEach(inject(function(_events_, _query_, _operationService_, _error_, _previousQueries_, _settings_, _operationChain_) {
            events = _events_;
            query = _query_;
            operationService = _operationService_;
            error = _error_;
            previousQueries = _previousQueries_;
            settings = _settings_;
            operationChain = _operationChain_;
        }));

        beforeEach(function() {
            valid = true;

            spyOn(ctrl, 'canExecute').and.callFake(function() {
                return valid;
            });
        });

        beforeEach(function() {
            spyOn(query, 'execute').and.stub();
            spyOn(error, 'handle').and.stub();
            spyOn(previousQueries, 'addQuery').and.stub();
        });

        beforeEach(function() {
            ctrl.operations = [];
        })

        it('should broadcast an onPreExecute event', function() {
            spyOn(events, 'broadcast').and.stub();
            ctrl.executeChain();
            expect(events.broadcast).toHaveBeenCalled();
        });

        it('should not add an operation if canExecute() returns false', function() {
            valid = false;

            spyOn(query, 'addOperation').and.stub();

            ctrl.executeChain();

            expect(query.addOperation).not.toHaveBeenCalled();
        });

        it('should not execute an operation if canExecute() returns false', function() {
            valid = false;

            ctrl.executeChain();

            expect(query.execute).not.toHaveBeenCalled();
        });

        it('should broadcast an error if the length of the chain is 0', function() {
            ctrl.executeChain();
            expect(error.handle).toHaveBeenCalledWith("Unable to run operation chain with no operations");
        });

        it('should not execute the chain if the length of the chain is 0', function() {
            ctrl.executeChain();
            expect(query.execute).not.toHaveBeenCalled();
        })

        it('should set the class of the operation to operation chain', function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {}
                    }
                }
            ]
            ctrl.executeChain();
            expect(query.execute).toHaveBeenCalled();
            var json = query.execute.calls.first().args[0];

            expect(json.class).toEqual("uk.gov.gchq.gaffer.operation.OperationChain");
        });

        it('should not add the options to the operation chain', function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {
                        }
                    },
                    fields: {
                        options: {
                            'visible': [
                                {
                                    'key': 'option1',
                                    'value': 'value1'
                                }
                            ]
                        }
                    }
                },
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {
                        }
                    },
                    fields: {
                        options: {
                            'visible': [
                                {
                                    'key': 'option1',
                                    'value': 'value2'
                                }
                            ]
                        }
                    }
                }
            ];
            ctrl.executeChain();
            expect(query.execute).toHaveBeenCalled();
            var operation = query.execute.calls.first().args[0];

            expect(operation.options).toBeUndefined();
        });

        it('should create operations from the operations field and add them to the chain', function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {}
                    }
                }
            ]
            ctrl.executeChain();
            expect(query.execute).toHaveBeenCalled();
            var operation = query.execute.calls.first().args[0];

            var expectedOperation = {
                class: 'test'
            }

            expect(operation.operations[0]).toEqual(expectedOperation);
        });

        it('should add the operation to the query service', function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {}
                    }
                }
            ]
            spyOn(query, 'addOperation').and.stub();
            ctrl.executeChain();

            expect(query.addOperation).toHaveBeenCalled();

            var expectedOperation = {
                class: "uk.gov.gchq.gaffer.operation.OperationChain",
                operations: [
                    {
                        class: 'test'
                    }
                ]
            }

            expect(query.addOperation).toHaveBeenCalledWith(expectedOperation);
        });

        it('should add limits and deduplicate operations to the chain if the limit operation appears in the next available operations', function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        next: ['uk.gov.gchq.gaffer.operation.impl.Limit'],
                        fields: {}
                    }
                }
            ]

            var limit = {
                class: 'limit class'
            }

            var dedupe = {
                class: 'deduplicate class'
            }

            spyOn(operationService, 'createLimitOperation').and.returnValue(limit);
            spyOn(operationService, 'createDeduplicateOperation').and.returnValue(dedupe);


            ctrl.executeChain();
            expect(query.execute).toHaveBeenCalled();
            var operation = query.execute.calls.first().args[0];

            expect(operation.operations[1]).toEqual(limit);
            expect(operation.operations[2]).toEqual(dedupe);

        });

        it('should not add the deduplicate and limit operations if the limit operation does not appear in the list of next available operations', function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {},
                    },
                    fields: {
                        options: {
                            'option1': 'value1'
                        }
                    }
                }
            ];

            ctrl.executeChain();

            expect(query.execute).toHaveBeenCalled();
            var chain = query.execute.calls.first().args[0];

            expect(chain.operations.length).toEqual(1);

        })

        it('should add the final operation options to the limit and dedupe operations if the limit operation appears in the next available operations', function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {},
                    },
                    fields: {
                        options: {
                            'option1': 'value1'
                        }
                    }
                },
                {
                    selectedOperation: {
                        class: 'test',
                        next: ['uk.gov.gchq.gaffer.operation.impl.Limit'],
                        fields: {}
                    },
                    fields: {
                        options: {
                            visible: [
                                {
                                    key: 'option2',
                                    value: 'value2'
                                }
                            ]
                        }
                    }
                }
            ]

            ctrl.executeChain();

            expect(query.execute).toHaveBeenCalled();
            var operation = query.execute.calls.first().args[0];

            expect(operation.operations[2].options).toEqual({'option2': 'value2'});
            expect(operation.operations[3].options).toEqual({'option2': 'value2'});

        });

        it('should add the operation chain to the previous Query service', function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {},
                    },
                    fields: {
                        options: {
                            'option1': 'value1'
                        }
                    }
                },
                {
                    selectedOperation: {
                        class: 'test',
                        next: ['uk.gov.gchq.gaffer.operation.impl.Limit'],
                        fields: {}
                    },
                    fields: {
                        options: {
                            'option2': 'value2'
                        }
                    }
                }
            ];
            spyOn(settings, 'getClearChainAfterExecution').and.returnValue(false);

            ctrl.executeChain();

            expect(previousQueries.addQuery.calls.argsFor(0)[0].operations).toEqual(ctrl.operations);
        });

        it('should add the current time to the previous Query service', function() {
            var now = moment('2018-10-15 14:30:23').toDate();
            jasmine.clock().mockDate(now);

            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {},
                    },
                    fields: {
                        options: {
                            'option1': 'value1'
                        }
                    }
                },
                {
                    selectedOperation: {
                        class: 'test',
                        next: ['uk.gov.gchq.gaffer.operation.impl.Limit'],
                        fields: {}
                    },
                    fields: {
                        options: {
                            'option2': 'value2'
                        }
                    }
                }
            ];

            ctrl.executeChain();

            expect(previousQueries.addQuery.calls.argsFor(0)[0].lastRun).toEqual("14:30");
        });

        it('should set the name of the query to "Operation chain" when sending it to the query service', function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {},
                    },
                    fields: {
                        options: {
                            'option1': 'value1'
                        }
                    }
                },
                {
                    selectedOperation: {
                        class: 'test',
                        next: ['uk.gov.gchq.gaffer.operation.impl.Limit'],
                        fields: {}
                    },
                    fields: {
                        options: {
                            'option2': 'value2'
                        }
                    }
                }
            ];

            ctrl.executeChain();

            expect(previousQueries.addQuery.calls.argsFor(0)[0].name).toEqual('Operation Chain');
        });

        it('should run the query', function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {}
                    },
                    opOptions: {
                        'option1': 'value1'
                    }
                }
            ];

            ctrl.executeChain();
            expect(query.execute).toHaveBeenCalled();
        });

        it('should reset the chain if the clear chain checkbox has been checked', function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {}
                    },
                    opOptions: {
                        'option1': 'value1'
                    }
                }
            ];
            spyOn(settings, 'getClearChainAfterExecution').and.returnValue(true);
            spyOn(operationChain, 'reset').and.stub();
            spyOn(query, 'executeQuery').and.callFake(function(data, onSuccess, onFailure) {
                onSuccess();
            });

            ctrl.executeChain();

            expect(operationChain.reset).toHaveBeenCalledTimes(1);
        });

        it('should not reset the chain if the clear chain checkbox has not been checked', function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {}
                    },
                    opOptions: {
                        'option1': 'value1'
                    }
                }
            ];
            spyOn(settings, 'getClearChainAfterExecution').and.returnValue(false);
            spyOn(operationChain, 'reset').and.stub();

            ctrl.executeChain();

            expect(operationChain.reset).not.toHaveBeenCalled();
        });

        it('should reload the operations if the chain is reset', function() {
            ctrl.operations = [
                {
                    selectedOperation: {
                        class: 'test',
                        fields: {}
                    },
                    opOptions: {
                        'option1': 'value1'
                    }
                }
            ];
            spyOn(settings, 'getClearChainAfterExecution').and.returnValue(true);
            spyOn(operationChain, 'getOperationChain').and.stub();
            spyOn(operationChain, 'reset').and.stub();
            spyOn(query, 'executeQuery').and.callFake(function(data, onSuccess, onFailure) {
                onSuccess();
            });

            ctrl.executeChain();

            expect(operationChain.getOperationChain).toHaveBeenCalledTimes(1);            
        });
    });

    describe('ctrl.resetChain()', function() {

        var $mdDialog, $q;

        beforeEach(inject(function(_$mdDialog_, _$q_) {
            $mdDialog = _$mdDialog_;
            $q = _$q_;
        }));

        describe('When the user confirms they want to reset', function() {
            beforeEach(function() {
                spyOn($mdDialog, 'show').and.returnValue($q.when());
            });

            it('should reset the operation chain service', function() {
                spyOn(operationChain, 'reset').and.stub();
                ctrl.resetChain();
                scope.$digest();
                expect(operationChain.reset).toHaveBeenCalled();
            });

            it('should reset the local model', function() {
                var operations = [ 1, 2, 3];
                spyOn(operationChain, 'reset').and.callFake(function() {
                    operations = [1];
                });
                spyOn(operationChain, 'getOperationChain').and.callFake(function() {
                    return operations;
                });

                ctrl.resetChain();
                scope.$digest();
                expect(ctrl.operations).toEqual([1]);
            });
        });

        describe('when the user reverses their decision to reset the chain', function() {
            beforeEach(function() {
                spyOn($mdDialog, 'show').and.callFake(function() {
                    var defer = $q.defer();
                    defer.reject(); // simulating the cancel option.
                    return defer.promise;
                });
            });

            it('should not reset the operation chain service', function() {
                spyOn(operationChain, 'reset').and.stub();
                ctrl.resetChain();
                scope.$digest();
                expect(operationChain.reset).not.toHaveBeenCalled();
            });

            it('should not reset the local model', function() {
                ctrl.operations = [ 1, 2, 3];
                spyOn(operationChain, 'reset').and.callFake(function() {
                    operations = [1];
                });
                spyOn(operationChain, 'getOperationChain').and.callFake(function() {
                    return operations;
                });

                ctrl.resetChain();
                scope.$digest();

                expect(ctrl.operations).toEqual([1, 2 , 3]);
            });

        })
    });
});
