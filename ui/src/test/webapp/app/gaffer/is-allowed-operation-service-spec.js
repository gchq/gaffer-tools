/*
 * Copyright 2020 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

describe('isAllowedOperation', function() {

    var service;

    beforeEach(module('app'));

    beforeEach(inject(function(_operationService_){
        service = _operationService_;
    }));

    describe('Whitelist should override Blacklist', function() {

        it('should return true, when Operation has a blacklisted and whitelisted labels', function() {
            var operation = {
                name: 'AnyName', labels: ['Whitelist Label', 'Blacklist label']
            };
            var configOperations = {
                whiteList: ['Whitelist Label'], blackList:['Blacklist label']
            };

            expect(service.isAllowedOperation(operation, configOperations)).toBe(true);
        });

        it('should return true, when name blacklisted and label whitelisted', function() {
            var operation = {
                name: 'BlacklistedName', labels: ['OverridingLabel']
            };
            var configOperations = {
                whiteList: ['OverridingLabel'], blackList:['BlacklistedName']
            };

            expect(service.isAllowedOperation(operation, configOperations)).toBe(true);
        });

        it('should return true, when name whitelisted and label blacklisted', function() {
            var operation = {
                name: 'OverridingName', labels: ['BlacklistedLabel']
            };
            var configOperations = {
                whiteList: ['OverridingName'], blackList:['BlacklistedLabel']
            };

            expect(service.isAllowedOperation(operation, configOperations)).toBe(true);
        });
    });

    describe('Blacklist and non-specified combinations should not be allow', function() {

        it('should return false, when Op name & label both blacklisted', function() {
            var operation = {
                name: 'IllegalOperation', labels: ['Illegal Label']
            };
            var configOperations = {
                whiteList: [], blackList:['IllegalOperation', 'Illegal Label']
            };

            expect(service.isAllowedOperation(operation, configOperations)).toBe(false);
        });

        it('should return false, when Op label is blacklisted only', function() {
            var operation = {
                name: 'AnyOperation', labels: ['Illegal Label']
            };
            var configOperations = {
                whiteList: [], blackList:['Illegal Label']
            };

            expect(service.isAllowedOperation(operation, configOperations)).toBe(false);
        });

        it('should return false, when Op name is blacklisted only', function() {
            var operation = {
                name: 'IllegalOperation', labels: []
            };
            var configOperations = {
                whiteList: [], blackList:['IllegalOperation']
            };

            expect(service.isAllowedOperation(operation, configOperations)).toBe(false);
        });
    });

    describe('Whitelist and non-specified combinations should allow', function() {

        it('should return true, when Op name & label both whitelisted', function() {
            var operation = {
                name: 'OkOperation', labels: ['OkLabel']
            };
            var configOperations = { whiteList: ['OkOperation', 'OkLabel'], blackList: [] };

            expect(service.isAllowedOperation(operation, configOperations)).toBe(true);
        });

        it('should return true, when Op name is whitelisted only', function() {
            var operation = {
                name: 'OkOperation', labels: []
            };
            var configOperations = { whiteList: ['OkOperation'], blackList: [] };

            expect(service.isAllowedOperation(operation, configOperations)).toBe(true);
        });

        it('should return true, when Op label is whitelisted only', function() {
            var operation = {
                name: 'OkOperation', labels: ['OkLabel']
            };
            var configOperations = { whiteList: ['OkLabel'], blackList: [] };

            expect(service.isAllowedOperation(operation, configOperations)).toBe(true);
        });
    });

    describe('No specified config should allow', function() {

        it('should return true by default when white/blacklist are empty', function() {
            var operation = {
                name: 'AnyOperation', labels: []
            };
            var configOperations = { whiteList: [], blackList: [] };

            expect(service.isAllowedOperation(operation, configOperations)).toBe(true);
        });

        it('should return true by default when Operation labels is missing', function() {
            var operation = {
                name: 'AnyOperation'
            };
            var configOperations = { whiteList: ['ok'], blackList: ['illegal'] };

            expect(service.isAllowedOperation(operation, configOperations)).toBe(true);
        });

        it('should return true by default when no white/blacklist is defined and op has empty labels', function() {
            var operation = {
                name: 'AnyOperation', labels: ["AnyLabel"]
            };
            var configOperations = {};

            expect(service.isAllowedOperation(operation, configOperations)).toBe(true);
        });

        it('should return true by default when no white/blacklist is defined and op has labels', function() {
            var operation = {
                name: 'AnyOperation', labels: []
            };
            var configOperations = {};

            expect(service.isAllowedOperation(operation, configOperations)).toBe(true);
        });
    });
});
