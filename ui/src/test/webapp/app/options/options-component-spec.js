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

        it('should otherwise look to the UI configuration for the defaultOperationOptions value', function() {
            var conf = {
                defaultOperationOptions: {
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
                    "opKey": "opLabel"
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
                    "opKey": "opLabel"
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
                defaultOperationOptions: {
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
                defaultOperationOptions: {
                    visible: []
                }
            }

            $httpBackend.whenGET('config/config.json').respond(200, conf);

            ctrl.$onInit();
            $httpBackend.flush();

            expect(ctrl.model.hidden).toEqual([]);
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

});