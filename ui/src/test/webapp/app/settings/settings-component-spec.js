describe('The Settings Component', function() {
    beforeEach(module('app'));

    describe('The Controller', function() {

        var $componentController
        var scope;
        var ctrl;
        var schema, operationService;

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
                    },
                    update: function() {
                        return $q.when({});
                    }
                }
            });
        }));

        beforeEach(inject(function(_$componentController_, _$rootScope_, _schema_, _operationService_) {
            $componentController = _$componentController_;
            scope = _$rootScope_.$new();
            schema = _schema_;
            operationService = _operationService_;
        }));

        beforeEach(function() {
            ctrl = $componentController('settingsView', {$scope: scope});
        });


        it('should exist', function() {
            expect(ctrl).toBeDefined();
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
