describe('The about component', function() {

    var ctrl;
    var $componentController, scope;

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
    
    beforeEach(inject(function(_$componentController_, _$rootScope_) {
        scope = _$rootScope_.$new();
        $componentController = _$componentController_;
    }));

    beforeEach(function() {
        ctrl = $componentController('about', {$scope: scope});
    });

    describe('ctrl.$onInit()', function() {

        var propsValue = {}, confValue = {
            restEndpoint: 'test'
        };

        var config, properties, $q;

        beforeEach(inject(function(_config_, _properties_, _$q_) {
            config = _config_;
            properties = _properties_;
            $q = _$q_;
        }));

        beforeEach(function() {
            spyOn(config, 'get').and.callFake(function() {
                return $q.when(confValue);
            });

            spyOn(properties, 'get').and.callFake(function() {
                return $q.when(propsValue);
            });
        });

        it('should load the properties', function() {
            ctrl.$onInit();
            expect(properties.get).toHaveBeenCalled();
        });

        it('should extract the documentation url from the properties', function() {
            // Given
            propsValue['gaffer.properties.app.doc.url'] = 'test'
            
            // When
            ctrl.$onInit();
            scope.$digest();

            // Then
            expect(ctrl.docs).toEqual('test')

        });

        it('should extract the description from the properties', function() {
            // Given
            propsValue['gaffer.properties.app.description'] = 'foo';

            // When
            ctrl.$onInit();
            scope.$digest();

            // Then
            expect(ctrl.description).toEqual('foo');

        });

        it('should create a default value if the description is not provided', function() {
            // Given
            delete propsValue['gaffer.properties.app.description'];

            // When
            ctrl.$onInit();
            scope.$digest();

            // Then
            expect(ctrl.description).toEqual('no description provided');
        })

        it('should update the properties loaded flag', function() {
            // Given
            ctrl.$onInit();
            expect(ctrl.propertiesLoaded).toBeFalsy();

            // When
            scope.$digest();

            // Then
            expect(ctrl.propertiesLoaded).toBeTruthy();
        });

        it('should load the config', function() {
            // Given
            ctrl.$onInit();

            // When
            scope.$digest();

            // Then
            expect(config.get).toHaveBeenCalled();
        });

        it('should extract the description from the config when set', function() {
            // Given
            propsValue['gaffer.properties.app.description'] = 'description in props';
            confValue['description'] = 'description in config';

            // When
            ctrl.$onInit();
            scope.$digest();

            // Then
            expect(ctrl.description).toEqual('description in config');
        });

        it('should extract the documentation url from the config when set', function() {
            // Given
            propsValue['gaffer.properties.app.doc.url'] = 'doc url in props';
            confValue['docUrl'] = 'doc url in config';

            // When
            ctrl.$onInit();
            scope.$digest();

            // Then
            expect(ctrl.docs).toEqual('doc url in config')

        });

        it('should trim the REST API to remove the version', function() {
            // Given
            confValue['restEndpoint'] = 'http://gaffer-rest-api:8080/rest/latest';

            // When
            ctrl.$onInit();
            scope.$digest();

            // Then
            expect(ctrl.restApi).toEqual('http://gaffer-rest-api:8080/rest');
        });

        it('should trim trailing slashes before removing the version', function() {
             // Given
             confValue['restEndpoint'] = 'http://gaffer-rest-api:8080/rest/latest/';

             // When
             ctrl.$onInit();
             scope.$digest();
 
             // Then
             expect(ctrl.restApi).toEqual('http://gaffer-rest-api:8080/rest');
        })

        it('should leave the feedback recipients and subject undefined if feedback is not configured', function() {
            // Given
            ctrl.$onInit();
            
            // When
            scope.$digest();

            // Then
            expect(ctrl.emailRecipients).toBeUndefined();
            expect(ctrl.emailSubject).toBeUndefined();
        })

        it('should get the list of feedback email addresses', function() {
            // Given
            confValue['feedback'] = {
                'recipients': [
                    'foo@bar.com',
                    'person@company.com'
                ]
            };

            // When
            ctrl.$onInit();
            scope.$digest();

            // Then
            expect(ctrl.emailRecipients).toEqual([
                'foo@bar.com', 'person@company.com'
            ]);
        });

        it('should get a feedback email subject', function() {
            // Given 
            confValue['feedback'] = {
                'subject': 'test'
            }

            // When
            ctrl.$onInit();
            scope.$digest();

            // Then
            expect(ctrl.emailSubject).toEqual('test');
        });

        it('should set a default email subject if none is specified', function() {
            // Given
            confValue['feedback'] = {};

            // When
            ctrl.$onInit();
            scope.$digest();

            // Then
            expect(ctrl.emailSubject).toEqual('Gaffer feedback');
        })
    });

    describe('ctrl.sendFeedback()', function() {
        var error;

        beforeEach(inject(function(_error_) {
            error = _error_;
        }));

        beforeEach(function() {
            spyOn(error, 'handle').and.stub();
        });

        beforeEach(function() {
            ctrl.emailSubject = 'Gaffer feedback' // The default value
        });

        it('should throw an error if the recipients are undefined', function() {
            ctrl.emailRecipients = undefined;
            ctrl.sendFeedback();

            expect(error.handle).toHaveBeenCalledWith('UI is misconfigured', 'The UI config should contain email recipients to receive feedback from users. No recipients were specified')
        });

        it('should throw an error if the recipients are not an array', function() {
            ctrl.emailRecipients = 'test';
            ctrl.sendFeedback();

            expect(error.handle).toHaveBeenCalledWith('UI is misconfigured', 'The UI configuration property "feedback.recipients" should contain an array, not a string');
        });

        it('should throw an error if the array does not contain at least one entry', function() {
            ctrl.emailRecipients = [];
            ctrl.sendFeedback();

            expect(error.handle).toHaveBeenCalledWith('UI is misconfigured', 'The UI config should contain email recipients to receive feedback from users. No recipients were specified')

        });

        it('should open the users default email client with the subject and recipients prepopulated', function() {
            spyOn(window, 'open').and.stub();

            ctrl.emailRecipients = [ 'foo@bar.com', 'developer@company.name'];

            ctrl.sendFeedback();

            expect(window.open).toHaveBeenCalledWith('mailto:foo@bar.com; developer@company.name;?subject=Gaffer feedback')
        });
    });

});
