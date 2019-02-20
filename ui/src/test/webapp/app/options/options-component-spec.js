describe('The options component', function() {

    var ctrl, operationOptions;
    var scope;
    var $httpBackend;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('schema', function($q) {
            return {
                get: function() {
                    return $q.when({});
                },
                getSchemaVertices: function() {
                    return []
                }
            }
        });
    }));

    beforeEach(inject(function(_$rootScope_, _$componentController_, _$httpBackend_, _operationOptions_) {
        scope = _$rootScope_.$new();
        $componentController = _$componentController_;
        $httpBackend = _$httpBackend_;
        operationOptions = _operationOptions_;

        ctrl = _$componentController_('options', {$scope: scope})
    }));

    describe('ctrl.$onInit()', function() {

        var defaultConfiguration = null;

        beforeEach(function() {
            ctrl.model = null;
        });

        beforeEach(function() {
            $httpBackend.whenGET('config/defaultConfig.json').respond(200, {});
        });

        beforeEach(function() {
            defaultConfiguration = null;
        });

        beforeEach(function() {
            spyOn(operationOptions, 'getDefaultConfiguration').and.callFake(function() {
                return defaultConfiguration;
            });
        });

        it('should keep a model if already set', function() {
            ctrl.model = 'test';

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.model).toEqual('test');
        });

        it('should first look to the operation options service', function() {
            defaultConfiguration = {};

            ctrl.$onInit();
            scope.$digest();

            expect(operationOptions.getDefaultConfiguration).toHaveBeenCalled();

            expect(ctrl.model).toEqual({});

        });

        it('should set the model to the value in the operations options service if not null', function() {
            defaultConfiguration = {
                visible: [
                    {
                        label: 'test',
                        key: 'testkey'
                    }
                ],
                hidden: []
            }

            ctrl.$onInit();
            scope.$digest();

            expect(ctrl.model).toEqual(defaultConfiguration);
        });

        it('should otherwise look to the UI configuration for the operationOptions value', function() {
            var conf = {
                operationOptions: {
                    visible: [
                        {
                            label: 'test',
                            key: 'testkey'
                        }
                    ],
                    hidden: []
                }
            }

            $httpBackend.whenGET('config/config.json').respond(200, conf);

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.model.visible[0].key).toEqual('testkey');

        });

        it('should use the old config layout to create a model', function() {
            var conf = {
                "operationOptionKeys": {
                    "opLabel": "opKey"
                }
            };

            $httpBackend.whenGET('config/config.json').respond(200, conf);

            ctrl.$onInit();
            $httpBackend.flush();

            var expectedModel = {
                visible: [
                    {
                        key: 'opKey',
                        label: 'opLabel'
                    }
                ],
                hidden: []
            }

            expect(ctrl.model).toEqual(expectedModel);

        });

        it('should log a warning to the console informing the admin that the old configuration is deprecated', function() {
            var conf = {
                "operationOptionKeys": {
                    "opLabel": "opKey"
                }
            };

            $httpBackend.whenGET('config/config.json').respond(200, conf);

            spyOn(console, 'warn');

            ctrl.$onInit();
            $httpBackend.flush();

            expect(console.warn).toHaveBeenCalledWith('UI "operationOptionKeys" config is deprecated. See the docs for the new options configuration.')
        });

        it('should pass an undefined operation options configuration to the model', function() {
            $httpBackend.whenGET('config/config.json').respond(200, {});

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.model).toBeUndefined();
        });

        it('should set the visible value to an empty array if not defined', function() {
            var conf = {
                operationOptions: {
                    hidden: []
                }
            }

            $httpBackend.whenGET('config/config.json').respond(200, conf);

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.model.visible).toEqual([]);
        });

        it('should set the hidden value to an empty array if not defined', function() {
            var conf = {
                operationOptions: {
                    visible: []
                }
            }

            $httpBackend.whenGET('config/config.json').respond(200, conf);

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.model.hidden).toEqual([]);
        });

        it('should set the default value to an empty array if option is multiple but value is undefined', function() {
            var conf = {
                operationOptions: {
                    visible: [
                        {
                            "multiple": true
                        }
                    ],
                    hidden: [
                        {
                            "multiple": true
                        }
                    ]
                }
            }

            $httpBackend.whenGET('config/config.json').respond(200, conf);

            ctrl.$onInit();
            $httpBackend.flush();


            expect(ctrl.model.visible[0].value).toEqual([]);
            expect(ctrl.model.hidden[0].value).toEqual([]);
        });

        it('should wrap a non array value in an array if the option takes multiple values', function() {
            var conf = {
                operationOptions: {
                    visible: [
                        {
                            "value": "test",
                            "multiple": true
                        }
                    ]
                }
            }

            $httpBackend.whenGET('config/config.json').respond(200, conf);

            ctrl.$onInit();
            $httpBackend.flush();


            expect(ctrl.model.visible[0].value).toEqual([ 'test' ]);
        })

        it('should temporarily set the autocomplete presets to an array containing the value if defined but is not an array', function() {
            var conf = {
                operationOptions: {
                    visible: [
                        {
                            "key": "testKey",
                            "value": "test",
                            "multiple": true,
                            "autocomplete": {
                                "optionsAsync": {}
                            }
                        }
                    ]
                }
            }

            $httpBackend.whenGET('config/config.json').respond(200, conf);

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.presets["testKey"]).toEqual([ "test" ]);
        });

        it('should set the autocomplete presets to the value if options are not defined but value is defined as an array', function() {
            var conf = {
                operationOptions: {
                    visible: [
                        {
                            "key": "testKey",
                            "value": [ "test" ],
                            "multiple": true,
                            "autocomplete": {
                                "optionsAsync": {}
                            }
                        }
                    ]
                }
            }

            $httpBackend.whenGET('config/config.json').respond(200, conf);

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.presets["testKey"]).toEqual([ "test" ]);
        })

        it('should leave the array of autocomplete options undefined if the value is undefined', function() {
            var conf = {
                operationOptions: {
                    visible: [
                        {
                            "key": "testKey",
                            "multiple": true,
                            "autocomplete": {
                                "optionsAsync": {}
                            }
                        }
                    ]
                }
            }

            $httpBackend.whenGET('config/config.json').respond(200, conf);

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.presets["testKey"]).toBeUndefined();
        });

        it('should not mutate the value if multiple is set to false', function() {
            var conf = {
                operationOptions: {
                    visible: [
                        {
                            "key": "testKey",
                            "value": "test",
                            "multiple": false
                        }
                    ]
                }
            }

            $httpBackend.whenGET('config/config.json').respond(200, conf);

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.model.visible[0].value).toEqual("test");
        });

        it('should not manipulate the value if multiple is undefined', function() {
            var conf = {
                operationOptions: {
                    visible: [
                        {
                            "key": "testKey"
                        }
                    ]
                }
            }

            $httpBackend.whenGET('config/config.json').respond(200, conf);

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.model.visible[0].value).toEqual(undefined);
        });
    });

    describe('ctrl.$onDestroy', function() {
        var events;
        beforeEach(inject(function(_events_) {
            events = _events_;
        }));

        beforeEach(function() {
            spyOn(events, 'unsubscribe');
            spyOn(operationOptions, 'setDefaultConfiguration')
        });

        it('should unsubscribe from the events service', function() {
            ctrl.$onDestroy();

            expect(events.unsubscribe).toHaveBeenCalledWith('onPreExecute', jasmine.any(Function));
        });

        it('should push the model to the operationOptions service if the component is the master', function() {
            ctrl.master = true;
            
            ctrl.model = 'test';
            ctrl.$onDestroy();

            expect(operationOptions.setDefaultConfiguration).toHaveBeenCalledWith('test');

        });

        it('should not push the model to the operationOptions service if the component is not the master', function() {
            ctrl.master = false;
            
            ctrl.model = 'test';
            ctrl.$onDestroy();

            expect(operationOptions.setDefaultConfiguration).not.toHaveBeenCalled();
        });
    });

    describe('When an "onPreExecute" is called', function() {
        var events;

        beforeEach(inject(function(_events_) {
            events = _events_;
        }));

        beforeEach(function() {
            ctrl.$onInit();
        });

        beforeEach(function() {
            spyOn(operationOptions, 'setDefaultConfiguration');
        })

        it('should update the operation options if the component is the master', function() {
            ctrl.master = true;
            ctrl.model = 'new model'

            events.broadcast('onPreExecute', []);

            expect(operationOptions.setDefaultConfiguration).toHaveBeenCalledWith('new model');
        });

        it('should not update the operation options if the component is not the master', function() {
            ctrl.master = false;
            ctrl.model = 'new model'

            events.broadcast('onPreExecute', []);

            expect(operationOptions.setDefaultConfiguration).not.toHaveBeenCalled();
        });
    });

    describe('ctrl.addOption()', function() {

        beforeEach(function() {
            ctrl.model = {
                visible: [
                    {
                        key: 'marco',
                        label: 'Marco'
                    },
                    {
                        key: 'polo',
                        label: 'Polo'
                    }
                ],
                hidden: [
                    {
                        key: 'key1',
                        label: 'Key one',
                        value: 2
                    },
                    {
                        key: 'foo',
                        label: 'Foo but more readable'
                    },
                    {
                        key: 'bar',
                        label: 'bar'
                    }
                ]
            }
        });

        it('should remove the option from the hidden list', function() {
            ctrl.selectedOption = {
                key: 'foo',
                label: 'Foo but more readable'
            };

            ctrl.addOption();

            var expectedHiddenList = [
                {
                    key: 'key1',
                    label: 'Key one',
                    value: 2
                },
                {
                    key: 'bar',
                    label: 'bar'
                }
            ];


            expect(ctrl.model.hidden).toEqual(expectedHiddenList);
        });

        it('should add the option to the visible list', function() {
            ctrl.selectedOption = {
                key: 'key1',
                label: 'Key one',
                value: 2
            };

            ctrl.addOption();

            var expectedVisible = [
                {
                    key: 'marco',
                    label: 'Marco'
                },
                {
                    key: 'polo',
                    label: 'Polo'
                },
                {
                    key: 'key1',
                    label: 'Key one',
                    value: 2
                }
            ];

            expect(ctrl.model.visible).toEqual(expectedVisible);
        });
    });

    describe('ctrl.clearValue()', function() {
        beforeEach(function() {
            ctrl.model = {
                visible: [
                    {
                        key: 'marco',
                        label: 'Marco',
                        value: 'Mark'
                    }
                ],
                hidden: [
                    {
                        key: 'key1',
                        label: 'Key one',
                        value: 2
                    }
                ]
            }
        });

        it('should set the value to undefined', function() {
            ctrl.clearValue(0);

            expect(ctrl.model.visible[0].value).toBeUndefined();
            expect(ctrl.model.hidden[0].value).toEqual(2);
        });
    });

    describe('ctrl.hideOption()', function() {

        beforeEach(function() {
            ctrl.model = {
                visible: [
                    {
                        key: 'marco',
                        label: 'Marco'
                    },
                    {
                        key: 'polo',
                        label: 'Polo'
                    }
                ],
                hidden: [
                    {
                        key: 'key1',
                        label: 'Key one',
                        value: 2
                    },
                    {
                        key: 'foo',
                        label: 'Foo but more readable'
                    },
                    {
                        key: 'bar',
                        label: 'bar'
                    }
                ]
            }
        });

        it('should remove the option from the visible list', function() {
            ctrl.hideOption(1);

            var expectedVisible = [
                {
                    key: 'marco',
                    label: 'Marco'
                }
            ];

            expect(ctrl.model.visible).toEqual(expectedVisible);
        });

        it('should add the option to the hidden list', function() {
            ctrl.hideOption(0);

            var expectedHidden = [
                {
                    key: 'key1',
                    label: 'Key one',
                    value: 2
                },
                {
                    key: 'foo',
                    label: 'Foo but more readable'
                },
                {
                    key: 'bar',
                    label: 'bar'
                },
                {
                    key: 'marco',
                    label: 'Marco'
                }
            ]

            expect(ctrl.model.hidden).toEqual(expectedHidden);
        });
    });

    describe('ctrl.getValues()', function() {
        var option;

        describe('When using options from a server', function() {
            
            var query;

            beforeEach(inject(function(_query_) {
                query = _query_;
            }))

            beforeEach(function() {
                var config = {
                    "restEndpoint": "http://gaffer:8080/rest"
                }

                $httpBackend.whenGET('config/config.json').respond(200, config);
                $httpBackend.whenGET('config/defaultConfig.json').respond(200, {});
            });
        
            beforeEach(function() {
                option = {
                    "key": "testKey",
                    "autocomplete": {
                        "asyncOptions": {
                            "class": "uk.gov.gchq.gaffer.some.Operation"
                        }
                    }
                }
            });

            it('should return a promise', function() {
                expect(ctrl.getValues(option).then).toEqual(jasmine.any(Function));
            });

            it('should execute the operation', function() {
                spyOn(query, 'execute');

                ctrl.getValues(option);
                expect(query.execute).toHaveBeenCalledWith({ "class": "uk.gov.gchq.gaffer.some.Operation"}, jasmine.any(Function), jasmine.any(Function));
            });

            it('should resolve the promise with no values if the operation fails', function() {

                $httpBackend.whenPOST("http://gaffer:8080/rest/graph/operations/execute").respond(500, "something bad happened")
                
                ctrl.getValues(option).then(function(values) {
                    expect(values).toEqual([]);
                });

                $httpBackend.flush();
            });

            it('should call out to the error service to explain went wrong if the operation fails', inject(function(error) {
                spyOn(error, 'handle');

                $httpBackend.whenPOST("http://gaffer:8080/rest/graph/operations/execute").respond(500, "something bad happened")
                
                ctrl.getValues(option);

                $httpBackend.flush();

                expect(error.handle).toHaveBeenCalledWith("Failed to retrieve prepopulated options", "something bad happened");

            }));

            it('should resolve the promise with filtered results if a search term is specified', function() {
                ctrl.searchTerms = {
                    "testKey": "test"
                };

                $httpBackend.whenPOST("http://gaffer:8080/rest/graph/operations/execute").respond(200, [ "containsTestCaseInsensite", "test", "banana"])
                
                ctrl.getValues(option).then(function(values) {
                    expect(values).toEqual([
                        "containsTestCaseInsensite",
                        "test"
                    ]);
                });

                $httpBackend.flush();

            });

            it('should resolve the promise with all the results if no search term is specified', function() {
                $httpBackend.whenPOST("http://gaffer:8080/rest/graph/operations/execute").respond(200, [ "containsTestCaseInsensite", "test", "banana"])
                
                ctrl.getValues(option).then(function(values) {
                    expect(values).toEqual([
                        "containsTestCaseInsensite",
                        "test",
                        "banana"
                    ]);
                });

                $httpBackend.flush();
            });
        });

        describe('When using a static array of options', function() {
            
            beforeEach(function() {
                option = {
                    "key": "testKey",
                    "autocomplete": {
                        "options": [
                            "test",
                            "true",
                            "FALSE",
                            "Falsy"
                        ]
                    }
                }
            });

            it('should return the autocomplete options array if no search term is specified', function() {
                expect(ctrl.getValues(option)).toEqual([
                    "test",
                    "true",
                    "FALSE",
                    "Falsy"
                ]);
            });

            it('should return a filtered array if a search term is specified', function() {
                ctrl.searchTerms = {
                    "testKey": "ls"
                }

                expect(ctrl.getValues(option)).toEqual([
                    "FALSE",
                    "Falsy"
                ]);

            });
        });
    });

});
