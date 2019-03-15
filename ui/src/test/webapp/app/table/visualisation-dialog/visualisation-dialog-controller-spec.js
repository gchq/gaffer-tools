describe('Visualisation Dialog Controller', function() {
    var ctrl, scope;
    var $controller;

    beforeEach(module('app'));

    beforeEach(inject(function(_$controller_, _$rootScope_) {
        $controller = _$controller_;
        var $rootScope = _$rootScope_;

        scope = $rootScope.$new()
    }));

    var createController = function() {
        return $controller('VisualisationDialogController', { $scope: scope});
    }

    beforeEach(function() {
        ctrl = createController();
    });

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('preview()', function() {

        beforeEach(function() {

            scope.selectedChart = {
                "type": "bar",
                "fields": {
                    "labels": {
                        "axis": "x",
                        "label": "x axis property",
                        "required": true,
                        "value": "a"
                    },
                    "data": {
                        "axis": "y",
                        "label": "y axis property",
                        "required": true,
                        "value": "b"
                    },
                    "series": {
                        "label": "chart series property"
                    }
                }
            }

            scope.columns = ['a', 'b', 'c']

        });

        it('should remove null labels and values from the chart data', function() {
            scope.data = [
                {'a': 1, 'b': 2, 'c': 3}, 
                {'a': null, 'b': 3, 'c': 4},
                {'a': 3, 'b': null, 'c': 5}
            ]

            scope.preview();

            expect(scope.labels).toEqual([1]);
            expect(scope.chartData).toEqual([2]);
        });

        it('should remove undefined labels and values from the chart', function() {
            scope.data = [
                {'a': 1, 'b': 2, 'c': 3}, 
                {'b': 3, 'c': 4},
                {'a': 3, 'c': 5}
            ]

            scope.preview();

            expect(scope.labels).toEqual([1]);
            expect(scope.chartData).toEqual([2]);
        });

        it('should sort string labels', function() {
            scope.data = [
                {'a': 'jkl', 'b': 1},
                {'a': 'ghi', 'b': 2},
                {'a': 'def', 'b': 3},
                {'a': 'abc', 'b': 4}
            ];

            scope.preview();

            expect(scope.labels).toEqual(['abc', 'def', 'ghi', 'jkl']);
            expect(scope.chartData).toEqual([4, 3, 2, 1])
        });

        it('should sort numeric labels', function() {
            scope.data = [
                {'b': 'ghi', 'a': 2},
                {'b': 'jkl', 'a': 1},
                {'b': 'def', 'a': 3},
                {'b': 'abc', 'a': 14}
            ];

            scope.preview();

            expect(scope.chartData).toEqual(['jkl', 'ghi', 'def', 'abc']);
            expect(scope.labels).toEqual([1, 2, 3, 14]);
        });

        it('should sort boolean values', function() {
            scope.data = [
                {'a': false, 'b': 1},
                {'a': true, 'b': 2}
            ];

            scope.preview();

            expect(scope.labels).toEqual([true, false]);
            expect(scope.chartData).toEqual([2, 1])
        });

        it('should aggregate numeric data together by adding values together', function() {
            scope.data = [
                {'a': 'abc', 'b': 11},
                {'a': 'def', 'b': 2},
                {'a': 'def', 'b': 33},
                {'a': 'abc', 'b': 4}
            ];

            scope.preview();

            expect(scope.labels).toEqual(['abc', 'def']);
            expect(scope.chartData).toEqual([15, 35])
        })

        it('should be able to create line charts with no series defined', function() {
            scope.selectedChart = scope.charts['Line graph'];
            scope.selectedChart.fields['labels'].value = 'a';
            scope.selectedChart.fields['data'].value = 'b';

            scope.data = [
                {
                    'a': 3,
                    'b': 20
                },
                {
                    'a': 0,
                    'b': 25
                },
                {
                    'a': 100,
                    'b': -2
                }
            ];

            scope.preview();

            expect(scope.labels).toEqual([0, 3, 100]);
            expect(scope.chartData).toEqual([25, 20, -2]);
        });

        it('should be able to create line charts with a series defined', function() {
            scope.selectedChart = scope.charts['Line graph'];
            scope.selectedChart.fields['labels'].value = 'a';
            scope.selectedChart.fields['data'].value = 'b';
            scope.selectedChart.fields['series'].value = 'c';

            scope.data = [
                {
                    'a': 3,
                    'b': 20,
                    'c': 'test'
                },
                {
                    'a': 0,
                    'b': 25,
                    'c': 'test'
                },
                {
                    'a': 100,
                    'b': -2,
                    'c': 'not test'
                }
            ];

            scope.preview();

            expect(scope.series).toEqual(['test', 'not test']);
            expect(scope.labels).toEqual([0, 3, 100]);
            expect(scope.chartData[0]).toEqual([25, 20, undefined]);
            expect(scope.chartData[1].length).toEqual(3);
            expect(scope.chartData[1][0]).toBeUndefined();
            expect(scope.chartData[1][1]).toBeUndefined();
            expect(scope.chartData[1][2]).toEqual(-2);
        });

        it('should be able to create bar charts with no series defined', function() {
            scope.selectedChart = scope.charts['Bar chart'];
            scope.selectedChart.fields['labels'].value = 'a';
            scope.selectedChart.fields['data'].value = 'b';

            scope.data = [
                {
                    'a': 3,
                    'b': 20
                },
                {
                    'a': 0,
                    'b': 25
                },
                {
                    'a': 100,
                    'b': -2
                }
            ];

            scope.preview();

            expect(scope.labels).toEqual([0, 3, 100]);
            expect(scope.chartData).toEqual([25, 20, -2]);
        });

        it('should be able to create bar charts with a series defined', function() {
            scope.selectedChart = scope.charts['Bar chart'];
            scope.selectedChart.fields['labels'].value = 'a';
            scope.selectedChart.fields['data'].value = 'b';
            scope.selectedChart.fields['series'].value = 'c';

            scope.data = [
                {
                    'a': 3,
                    'b': 20,
                    'c': 'test'
                },
                {
                    'a': 0,
                    'b': 25,
                    'c': 'test'
                },
                {
                    'a': 100,
                    'b': -2,
                    'c': 'not test'
                }
            ];

            scope.preview();

            expect(scope.series).toEqual(['test', 'not test']);
            expect(scope.labels).toEqual([0, 3, 100]);
            expect(scope.chartData[0]).toEqual([25, 20, undefined]);
            expect(scope.chartData[1].length).toEqual(3);
            expect(scope.chartData[1][0]).toBeUndefined();
            expect(scope.chartData[1][1]).toBeUndefined();
            expect(scope.chartData[1][2]).toEqual(-2);
        });

        it('should be able to create bar charts from frequency maps with no series defined', function() {
            scope.selectedChart = scope.charts['Bar chart from frequency map'];
            scope.selectedChart.fields['frequencyMapProperty'].value = 'a';
            scope.selectedChart.fields['series'] = undefined; 
            scope.data = [
                {
                    'a': 'foo: 23, bar: 50'
                },
                {
                    'a': 'abc: 123'
                },
                {
                    'a': 'foo: 27'
                }

            ];

            scope.preview();

            expect(scope.labels).toEqual(['foo', 'bar', 'abc']);
            expect(scope.chartData).toEqual([50, 50, 123]);
        });

        it('should be able to create bar charts from frequency maps with a series defined', function() {
            scope.selectedChart = scope.charts['Bar chart from frequency map'];
            scope.selectedChart.fields['frequencyMapProperty'].value = 'a';
            scope.selectedChart.fields['series'].value = 'b';

            scope.data = [
                {
                    'a': 'foo: 23, bar: 50',
                    'b': true
                },
                {
                    'a': 'foo: 1, bar: 2',
                    'b': true
                },
                {
                    'a': 'abc: 123',
                    'b': false
                },
                {
                    'a': 'foo: 27'
                }

            ];

            scope.preview();

            expect(scope.labels).toEqual(['foo', 'bar', 'abc']);
            expect(scope.series).toEqual(['true', 'false']);

            expect(scope.chartData[0].length).toEqual(3)
            expect(scope.chartData[0][0]).toEqual(24);
            expect(scope.chartData[0][1]).toEqual(52);
            expect(scope.chartData[0][2]).toBeUndefined();


            expect(scope.chartData[1].length).toEqual(3)
            expect(scope.chartData[1][0]).toBeUndefined()
            expect(scope.chartData[1][1]).toBeUndefined()
            expect(scope.chartData[1][2]).toEqual(123)
        });

        it('should be able to create a polar area chart', function() {
            scope.selectedChart = scope.charts['Polar area chart'];
            scope.selectedChart.fields['labels'].value = 'a';
            scope.selectedChart.fields['data'].value = 'b';
            
            scope.data = [
                {
                    'a': 'prop1',
                    'b': 31
                },
                {
                    'a': 'prop2',
                    'b': 42
                },
                {
                    'a': 'prop1',
                    'b': 9
                }
            ];

            scope.preview();

            expect(scope.labels).toEqual(['prop1', 'prop2']);
            expect(scope.chartData).toEqual([40, 42]);
        });

        it('should be able to create a doughnut chart', function() {
            scope.selectedChart = scope.charts['Doughnut chart'];
            scope.selectedChart.fields['labels'].value = 'a';
            scope.selectedChart.fields['data'].value = 'b';
            
            scope.data = [
                {
                    'a': 'prop1',
                    'b': 31
                },
                {
                    'a': 'prop2',
                    'b': 42
                },
                {
                    'a': 'prop1',
                    'b': 9
                }
            ];

            scope.preview();

            expect(scope.labels).toEqual(['prop1', 'prop2']);
            expect(scope.chartData).toEqual([40, 42]);
        });

        it('should be able to create a pie chart', function() {
            scope.selectedChart = scope.charts['Pie chart'];
            scope.selectedChart.fields['labels'].value = 'a';
            scope.selectedChart.fields['data'].value = 'b';
            
            scope.data = [
                {
                    'a': 'prop1',
                    'b': 31
                },
                {
                    'a': 'prop2',
                    'b': 42
                },
                {
                    'a': 'prop1',
                    'b': 9
                }
            ];

            scope.preview();

            expect(scope.labels).toEqual(['prop1', 'prop2']);
            expect(scope.chartData).toEqual([40, 42]);
        });

        it('should set showPreview to true', function() {
            scope.data = [
                {'a': 'jkl', 'b': 1}
            ];

            expect(scope.showPreview).toBeFalsy();

            scope.preview();

            expect(scope.showPreview).toBeTruthy()
        })

        it('should send a message to the error service if a chart cannot be created', inject(function(_error_) {
            var error = _error_;
            
            spyOn(error, 'handle').and.stub();

            scope.preview();

            expect(error.handle).toHaveBeenCalled();
        }))

    });

    describe('goBack()', function() {
        it('should set showPreview to false', function() {
            scope.showPreview = true;

            scope.goBack();

            expect(scope.showPreview).toBeFalsy();
        })
    });

    describe('confirm()', function() {

        var $mdDialog;

        beforeEach(inject(function(_$mdDialog_) {
            $mdDialog = _$mdDialog_;
        }));

        beforeEach(function() {
            spyOn($mdDialog, 'hide').and.stub();
        });

        beforeEach(function() {
            scope.labels = ['this', 'is', 'a', 'test'];
            scope.chartData = [10, 20, 30, 40];
            
            scope.selectedChart = {
                type: 'bar'
            }

            scope.options = {}
        })


        it('should close the dialog using the chart parameters', function() {
            scope.confirm();

            var expectedObject = {
                labels: ['this', 'is', 'a', 'test'],
                data: [10, 20, 30, 40],
                type: 'bar',
                options: {},
                series: undefined
            }


            expect($mdDialog.hide).toHaveBeenCalledWith(expectedObject);
        })
    })
});
