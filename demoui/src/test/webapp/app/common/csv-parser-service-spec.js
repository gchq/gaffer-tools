describe('The CSV parser service', function() {
    var service;
    var onError = jasmine.createSpy('onError');

    beforeEach(module('app'));

    beforeEach(inject(function(_csv_) {
        service = _csv_;
    }));

    describe('csv.parse()', function() {
        it('should handle empty line and return empty array', function() {
            expect(service.parse("")).toEqual([]);
        });

        it('should call error handler if a quote is unclosed', function() {
            expect(service.parse('"test', onError)).toBeUndefined();
            expect(onError).toHaveBeenCalledWith('Unclosed quote for \'"test\'')
        });

        it('should call error handler if line ends with an escape character', function() {
            expect(service.parse('escape test\\', onError)).toBeUndefined();
            expect(onError).toHaveBeenCalledWith('Illegal escape character at end of input for line: \'escape test\\\'');
        });

        it('should call error handler if an unescaped quote appears in the input', function() {
            expect(service.parse('test with "unexpected quotes"', onError)).toBeUndefined();
            expect(onError).toHaveBeenCalledWith('Unexpected \'"\' character in line \'test with "unexpected quotes"\'. Please escape with \\.');
        });

        it('should be able to escape quotes', function() {
            expect(service.parse('value with \\"escaped quotes\\"')).toEqual(['value with "escaped quotes"']);
        });

        it('should be able to escape commas', function() {
            expect(service.parse('value with \\, inside')).toEqual(['value with , inside']);
        });

        it('should separated values on unescaped commas', function() {
            expect(service.parse('this,is,a,test')).toEqual(['this', 'is', 'a', 'test']);
        });

        it('should treat quoted strings as literals', function() {
            expect(service.parse('this,"is, a",test')).toEqual(['this', 'is, a', 'test']);
        });

        it('should be able to add unclosed quotes if escaped', function() {
            expect(service.parse('quote \\" test')).toEqual(['quote " test']);
        });

        it('should be able to add backslashes by escaping them', function() {
            expect(service.parse('test \\\\')).toEqual(['test \\']);
        });

        it('should not convert boolean values', function() {
            expect(service.parse('true')).toEqual(['true']);
        });

        it('should not convert quoted boolean values', function() {
            expect(service.parse('"true"')).toEqual(["true"]);
        });

        it('should not convert numerical values', function() {
            expect(service.parse('123')).toEqual(['123']);
        });

        it('should not convert quoted numerical values', function() {
            expect(service.parse('"123"')).toEqual(["123"]);
        });

        it('should add extra undefined part if nothing appears after last separator', function() {
            expect(service.parse('test,')).toEqual(['test', undefined]);
        });

        it('should not add extra undefined part if last separator was escaped', function() {
            expect(service.parse('test\\,')).toEqual(['test,']);
        });

        it('should add extra undefined part if last separator follows quoted string', function() {
            expect(service.parse('"myTest",')).toEqual(['myTest', undefined])
        });
    });

    describe('csv.generate()', function() {
        var error;

        beforeEach(inject(function(_error_) {
            error = _error_;
        }));

        it('should split lines with carriage return and newline', function() {
            var header = ['test'];
            var input = [{'test': 'a'}, {'test': 'b'}];

            var output = service.generate(input, header);

            expect(output).toEqual('test\r\na\r\nb\r\n');

        });

        it('should wrap strings containing commas with quotes', function() {
            var header = ['test'];
            var input = [{'test': 'value, with a comma'}];

            var output = service.generate(input, header);
            expect(output.indexOf('"value, with a comma"')).not.toEqual(-1);
        });

        it('should add an extra quote to escape quotes in values', function() {
            var header = ['test'];
            var input = [{'test': 'value containing " a quote'}];

            var output = service.generate(input, header);
            expect(output.indexOf('"value containing "" a quote"\r\n')).not.toEqual(-1);
        });

        it('should escape multiple quotes within the value', function() {
            var header = ['test'];
            var input = [{'test': 'value "containing " quotes'}];

            var output = service.generate(input, header);
            expect(output.indexOf('"value ""containing "" quotes"\r\n')).not.toEqual(-1);
        });

        it('should handle quotes immediately before a comma', function() {
            var header = ['test'];
            var input = [{'test': 'value containing ", a quote and comma'}];

            var output = service.generate(input, header);
            expect(output.indexOf('"value containing "", a quote and comma"\r\n')).not.toEqual(-1);
        });

        it('should throw an error if no headers are supplied', function() {
            spyOn(error, 'handle').and.stub();

            service.generate([], null);
            expect(error.handle).toHaveBeenCalledTimes(1);
            service.generate([]);
            expect(error.handle).toHaveBeenCalledTimes(2)
        });

        it('should add a comma for null fields', function() {
            var headers = ['a', 'b'];
            var input = [{'a': false, 'b': null}, {'a': null, 'b': 'test'}];

            var output = service.generate(input, headers);

            var expected = 'a,b\r\n' +
            'false,\r\n' +
            ',test\r\n';

            expect(output).toEqual(expected);
        });

        it('should add a comma for undefined fields', function() {
            var headers = ['a', 'b'];
            var input = [{'a': false, 'b': undefined}, {'a': undefined, 'b': 'test'}];

            var output = service.generate(input, headers);

            var expected = 'a,b\r\n' +
            'false,\r\n' +
            ',test\r\n';

            expect(output).toEqual(expected);
        });
    });
})
