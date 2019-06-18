describe('The Settings Component', function() {
    beforeEach(module('app'));

    describe('The Controller', function() {

        var $componentController, $httpBackend;
        var scope;
        var ctrl;
        var schema, operationService;

        beforeEach(module(function($provide) {
            $provide.factory('schema', function($q) {
                return {
                    get: function() {
                        return $q.when({});
                    },
                    update: function() {
                        return $q.when({});
                    }
                }
            });
        }));

        beforeEach(inject(function(_$componentController_, _$rootScope_, _schema_, _operationService_, _$httpBackend_) {
            $componentController = _$componentController_;
            scope = _$rootScope_.$new();
            schema = _schema_;
            operationService = _operationService_;
            $httpBackend = _$httpBackend_;
        }));

        beforeEach(function() {
            ctrl = $componentController('settingsView', {$scope: scope});
        });

        beforeEach(function() {
            $httpBackend.whenGET('config/defaultConfig.json').respond(200, {});
        }); 

        it('should exist', function() {
            expect(ctrl).toBeDefined();
        });

        describe('ctrl.$onInit()', function() {
            var settings

            beforeEach(inject(function(_settings_) {
                settings = _settings_;
            }));

            beforeEach(function() {
                spyOn(settings, 'getClearChainAfterExecution').and.stub();
                spyOn(settings, 'getResultLimit').and.stub();
            });

            it('should set showOptions to true if the config contains an operationOptions section', function() {
                $httpBackend.expectGET('config/config.json').respond(200, { operationOptions: {}});

                ctrl.$onInit();
                $httpBackend.flush();

                expect(ctrl.showOptions).toBeTruthy();
            });

            it('should set showOptions to true if the config contains a operationOptionKeys section', function() {
                $httpBackend.expectGET('config/config.json').respond(200, { operationOptionKeys: {}});

                ctrl.$onInit();
                $httpBackend.flush();

                expect(ctrl.showOptions).toBeTruthy();
            });

            it('should set showOptions to false if the config doesn\'t contain an operationOptions or operationOption keys section', function() {
                $httpBackend.expectGET('config/config.json').respond(200, {});

                ctrl.$onInit();
                $httpBackend.flush();

                expect(ctrl.showOptions).toBeFalsy();
            });

            it('should load the clear chain setting from the settings service', function() {
                ctrl.$onInit();

                expect(settings.getClearChainAfterExecution).toHaveBeenCalledTimes(1);
            });

            it('should load the result limit from the settings service', function() {
                ctrl.$onInit();

                expect(settings.getResultLimit).toHaveBeenCalledTimes(1);
            })
        });

        describe('ctrl.updateResultLimit', function() {

            var settings

            beforeEach(inject(function(_settings_) {
                settings = _settings_;
            }));

            beforeEach(function() {
                spyOn(settings, 'setResultLimit').and.stub();
            });

            it('should update the resultLimit if the querySettings form is valid', function() {
                ctrl.querySettingsForm = {
                    resultLimit: {
                        $valid: true
                    }
                };
                ctrl.resultLimit = 20
                ctrl.updateResultLimit();

                expect(settings.setResultLimit).toHaveBeenCalledWith(20);
            });

            it('should not update the result limit if the querySettings form is invalid', function() {
                ctrl.querySettingsForm = {
                    resultLimit: {
                        $valid: false
                    }
                };
                ctrl.resultLimit = 20
                ctrl.updateResultLimit();

                expect(settings.setResultLimit).not.toHaveBeenCalled();
            });
        });

        describe('ctrl.updateSchema()', function() {

            it('should first broadcast an "onPreExecute" event', inject(function(_events_) {
                var events = _events_;

                spyOn(schema, 'update').and.stub();


                spyOn(events, 'broadcast').and.callFake(function(eventArg) {
                    expect(eventArg).toEqual('onPreExecute');
                    expect(schema.update).not.toHaveBeenCalled(); // because event.Broadcast was called first
                });

                ctrl.updateSchema();

                expect(schema.update).toHaveBeenCalled();

            }));

            it('should call schema.update()', function() {
                spyOn(schema, 'update');

                ctrl.updateSchema();

                expect(schema.update).toHaveBeenCalled();
            });

            it('should update the available operations', function() {
                spyOn(operationService, 'reloadOperations').and.stub();

                ctrl.updateSchema();

                expect(operationService.reloadOperations).toHaveBeenCalled();
            });

            it('should set the loud flag to true in the call to the operation service to broadcast any errors to the user', function() {
                spyOn(operationService, 'reloadOperations').and.stub();

                ctrl.updateSchema();

                expect(operationService.reloadOperations).toHaveBeenCalledWith(true);
            });
        });
       
    });
});
