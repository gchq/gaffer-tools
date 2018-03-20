describe('The Schema View Component', function() {

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
                },
                getSchemaVertices: function() {
                    return []
                }
            }
        });
    }));

    describe('The Controller', function() {
        var $componentController, $q;
        var schemaView, schema, scope;
        var gafferSchema = {
            "edges": {"edge1":{}}
        };

        beforeEach(inject(function(_$componentController_, _schemaView_, _$rootScope_, _$q_, _schema_) {
            $componentController = _$componentController_;
            schemaView = _schemaView_;
            scope = _$rootScope_.$new();
            $q = _$q_;
            schema = _schema_;

            spyOn(schema, 'get').and.returnValue($q.when(gafferSchema));
        }));

        it('should exist', function() {
            var ctrl = $componentController('schemaView');
            expect(ctrl).toBeDefined();
        });

        it('should load the schema view graph on startup', function() {
            spyOn(schemaView, 'load').and.returnValue($q.when());
            spyOn(schemaView, 'reload');
            var ctrl = $componentController('schemaView', {$scope: scope});

            ctrl.$onInit();
            scope.$digest();

            expect(schemaView.load).toHaveBeenCalledTimes(1);
            expect(schemaView.reload).toHaveBeenCalledTimes(1);
            expect(schemaView.reload).toHaveBeenCalledWith(gafferSchema);
        });
    });
});
