describe('The Selected Elements Component', function() {

    beforeEach(module('app'));

    var $componentController
    var ctrl;

    var testModel;

    beforeEach(function() {
        testModel = {
            edges: {},
            entities: {}
        }
    });

    beforeEach(inject(function(_$componentController_) {
        $componentController = _$componentController_;
    }));

    beforeEach(function() {
        ctrl = $componentController('selectedElements', null, {model: testModel})
    });

    it('should exist', function() {
        var ctrl = $componentController('selectedElements');
        expect(ctrl).toBeDefined()
    });

    describe('ctrl.$onInit()', function() {

        var schema;
        var $q;

        beforeEach(inject(function(_schema_, _$q_) {
            schema = _schema_;
            $q = _$q_;
        }));

        beforeEach(function() {
            spyOn(schema, 'get').and.returnValue($q.when({}));
        });

        it('should error if no model is injected into the component', function() {
            var ctrl = $componentController('selectedElements');
            expect(ctrl.$onInit).toThrow();
        });

        it('should get the schema', function() {
            ctrl.$onInit();
            expect(schema.get).toHaveBeenCalled();
        });
    });

    describe('ctrl.resolveVertex()', function() {

        var types;

        beforeEach(inject(function(_types_) {
            types = _types_;
        }));

        beforeEach(function() {
            spyOn(types, 'getShortValue').and.stub();
        })

        it('should call types.getShortValue() with the parsed string', function() {
            ctrl.resolveVertex('"test"');
            expect(types.getShortValue).toHaveBeenCalledWith("test");
        });

        it('should call types.getShortValue with a parsed number', function() {
            ctrl.resolveVertex("2");
            expect(types.getShortValue).toHaveBeenCalledWith(2);
        });

        it('should call types.getShortValue() with an object', function() {
            ctrl.resolveVertex('{"test": true}');
            expect(types.getShortValue).toHaveBeenCalledWith({test: true});
        });
    });

    describe('ctrl.resolve()', function() {
        var time, types;

        var timeProperty

        beforeEach(inject(function(_time_, _types_) {
            time = _time_;
            types = _types_;
        }));

        beforeEach(function() {
            spyOn(time, 'isTimeProperty').and.callFake(function() {
                return timeProperty;
            });
        });

        it('should return the short value if the value is not a time property', function() {

            timeProperty = false;

            spyOn(types, 'getShortValue').and.callFake(function(val) {
                return 'shortValue';
            });

            var result = ctrl.resolve('propName', 'value');

            expect(types.getShortValue).toHaveBeenCalled();
            expect(result).toEqual('shortValue');
        });

        it('should return the time representation if the value is a time property', function() {
            spyOn(types, 'getShortValue').and.callFake(function(val) {
                return val;
            });

            spyOn(time, 'getDateString').and.callFake(function(propName, val) {
                return 'Date representation of ' + val
            });

            timeProperty = true;

            var result = ctrl.resolve('prop', 123456789);

            expect(types.getShortValue).toHaveBeenCalled();
            expect(time.getDateString).toHaveBeenCalled();
            expect(result).toEqual('Date representation of 123456789');
        });
    });
});
