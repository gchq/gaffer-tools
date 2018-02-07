describe("The Config Service", function() {

    var configService;

    beforeEach(module('app'));

    beforeEach(inject(function(_config_) {
        configService = _config_;
    }));

    describe('when loading', function() {
        var defaultConfig = {
            title: "test title1",
            restEndpoint: "defaultEndpoint",
            types: {
                "test.class1": {
                    "value": 1
                },
                "test.class2": {
                    "value": 1
                }
            },
            operations: {
                "loadNamedOperationsOnStartup": true,
                "defaultAvailable": [
                  {
                    "name": "1",
                    "name": "2"
                  }
                ]
            }
        };

        it('should load default config then custom config and merge the responses', inject(function($httpBackend) {
            $httpBackend.whenGET("config/defaultConfig.json").respond(defaultConfig);
            $httpBackend.whenGET("config/config.json").respond(
            {
                title: "test title2",
                restEndpoint: "customEndpoint",
                types: {
                    "test.class1": {
                        "value": 2
                    },
                    "test.class3": {
                        "value": 2
                    }
                },
                operations: {
                     "loadNamedOperationsOnStartup": false,
                     "defaultAvailable": [
                       {
                         "name": "3"
                       }
                     ]
                 }
            });

            configService.get().then(function(config) {
                expect(config).toEqual({
                    title: "test title2",
                    restEndpoint: "customEndpoint",
                    types: {
                        "test.class1": {
                            "value": 2
                        },
                        "test.class2": {
                            "value": 1
                        },
                        "test.class3": {
                            "value": 2
                        }
                    },
                    operations: {
                      "loadNamedOperationsOnStartup": false,
                      "defaultAvailable": [
                        {
                          "name": "3"
                        }
                      ]
                     }
                });
            });

            $httpBackend.flush();
        }));

        it('should load default config then custom config and merge the responses without overriding values', inject(function($httpBackend) {
            $httpBackend.whenGET("config/defaultConfig.json").respond(defaultConfig);
            $httpBackend.whenGET("config/config.json").respond(
            {
                types: {
                    "test.class1": {
                        "value": 2
                    },
                    "test.class3": {
                        "value": 2
                    }
                },
                operations: {
                     "loadNamedOperationsOnStartup": false
                 }
            });

            configService.get().then(function(config) {
                expect(config).toEqual({
                    title: "test title1",
                    restEndpoint: "defaultEndpoint",
                    types: {
                        "test.class1": {
                            "value": 2
                        },
                        "test.class2": {
                            "value": 1
                        },
                        "test.class3": {
                            "value": 2
                        }
                    },
                    operations: {
                      "loadNamedOperationsOnStartup": false,
                       "defaultAvailable": [
                            {
                              "name": "1",
                              "name": "2"
                            }
                       ]
                     }
                });
            });

            $httpBackend.flush();
        }));

        it('should load custom config and handle case when no default config provided', inject(function($httpBackend) {
            $httpBackend.whenGET("config/defaultConfig.json").respond(undefined);
            $httpBackend.whenGET("config/config.json").respond(
            {
                title: "test title2",
                restEndpoint: "customEndpoint",
                types: {
                    "test.class1": {
                        "value": 2
                    },
                    "test.class3": {
                        "value": 2
                    }
                },
                operations: {
                    "loadNamedOperationsOnStartup": false,
                    "defaultAvailable": [
                      {
                        "name": "3"
                      }
                    ]
                }
            });

            configService.get().then(function(config) {
                expect(config).toEqual({
                   title: "test title2",
                   restEndpoint: "customEndpoint",
                   types: {
                       "test.class1": {
                           "value": 2
                       },
                       "test.class3": {
                           "value": 2
                       }
                   },
                   operations: {
                       "loadNamedOperationsOnStartup": false,
                       "defaultAvailable": [
                         {
                           "name": "3"
                         }
                       ]
                   }
               });
            });

            $httpBackend.flush();
        }));

        it('should load default config and handle case when no custom config provided', inject(function($httpBackend) {
            $httpBackend.whenGET("config/defaultConfig.json").respond(defaultConfig);
            $httpBackend.whenGET("config/config.json").respond(undefined);

            configService.get().then(function(config) {
                expect(config).toEqual({
                   title: "test title1",
                   restEndpoint: "defaultEndpoint",
                   types: {
                       "test.class1": {
                           "value": 1
                       },
                       "test.class2": {
                           "value": 1
                       }
                   },
                   operations: {
                       "loadNamedOperationsOnStartup": true,
                       "defaultAvailable": [
                         {
                           "name": "1",
                           "name": "2"
                         }
                       ]
                   }
               });
            });

            $httpBackend.flush();
        }));
    });
})