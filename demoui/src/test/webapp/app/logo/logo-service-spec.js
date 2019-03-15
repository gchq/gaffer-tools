describe('The Logo Service', function() {

    var logoService;
    var $rootScope;

    var rest = 'http://localhost:8080/rest/latest';
    var imagePath = 'images/logo.png';

    var propertiesGetFunction;
    var configGetFunction;

    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {
            configGetFunction = jasmine.createSpy('get').and.callFake(function() {
                return $q.when({
                    restEndpoint: rest
                });
            })

            return {
                get: configGetFunction
            }
        });

        $provide.factory('properties', function($q) {
            propertiesGetFunction = jasmine.createSpy('get').and.callFake(function() {
                if (!imagePath) {
                    return $q.when({});
                } else {
                    return $q.when({
                        'gaffer.properties.app.logo.src': imagePath
                    });
                }
            });

            return {
                get: propertiesGetFunction
            }
        });
    }));

    beforeEach(inject(function(_logo_, _$rootScope_) {
        logoService = _logo_;
        $rootScope = _$rootScope_;
    }));

    it('should exist', function() {
        expect(logoService).toBeDefined();
    });

    it('should retrieve the url of the logo', function(done) {
        rest = 'http://localhost:8080/rest/latest';
        imagePath = 'images/logo.png';

        logoService.get().then(function(src) {
            expect(src).toEqual('http://localhost:8080/rest/images/logo.png');
            done();
        });

        $rootScope.$digest();
    });

    it('should return null in the promise when the property is not set', function(done) {
        rest = 'http://localhost:8080/rest/latest';
        imagePath = null;

        logoService.get().then(function(src) {
            expect(src).toBeNull();
            done();
        });

        $rootScope.$digest();
    });

    it('should strip out last route param with trailing slash', function(done) {
        rest = 'http://localhost:8080/rest/latest/';
        imagePath = 'images/logo.png';

        logoService.get().then(function(src) {
            expect(src).toEqual('http://localhost:8080/rest/images/logo.png')
            done();
        });

        $rootScope.$digest();
    });

    it('should not remove leading slashes from image path', function(done) {
        rest = 'http://localhost:8080/rest/latest';
        imagePath = '/images/logo.png';

        logoService.get().then(function(src) {
            expect(src).toEqual('http://localhost:8080/rest//images/logo.png')
            done();
        });

        $rootScope.$digest();
    });

    it('should only query the config and properties once when called twice', function(done) {
        rest = 'http://localhost:8080/rest/latest';
        imagePath = 'images/logo.png';

        logoService.get().then(function(firstSrc) {
            logoService.get().then(function(secondSrc) {
                expect(firstSrc).toEqual(secondSrc);
                expect(secondSrc).toEqual('http://localhost:8080/rest/images/logo.png');
                expect(configGetFunction).toHaveBeenCalledTimes(1);
                expect(propertiesGetFunction).toHaveBeenCalledTimes(1);
                done();
            });
        });

        $rootScope.$digest();

    });

    it('should append http:// if not present on the url', function(done) {
        rest = "localhost:8080/rest/latest";
        imagePath = "images/logo.png";

        logoService.get().then(function(src) {
            expect(src).toEqual("http://localhost:8080/rest/images/logo.png");
            done();
        });

        $rootScope.$digest();
    })

});
