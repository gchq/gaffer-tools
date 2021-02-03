from fishbowl.core import *


class FromEntityId(Base):
    CLASS = "uk.gov.gchq.gaffer.operation.function.FromEntityId"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToFreqMap(Base):
    CLASS = "uk.gov.gchq.gaffer.types.function.ToFreqMap"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Divide(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Divide"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class StringRegexReplace(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringRegexReplace"

    def __init__(self, regex=None, replacement=None):
        super().__init__(_class_name=self.CLASS)
        self.regex = regex
        self.replacement = replacement

    def to_json(self):
        function_json = super().to_json()
        if self.regex is not None:
            function_json["regex"] = self.regex
        if self.replacement is not None:
            function_json["replacement"] = self.replacement
        return function_json


class IterableFilter(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.IterableFilter"

    def __init__(self, predicate=None):
        super().__init__(_class_name=self.CLASS)
        self.predicate = predicate

    def to_json(self):
        function_json = super().to_json()
        if self.predicate is not None:
            function_json["predicate"] = self.predicate
        return function_json


class CurrentDate(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.CurrentDate"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class FunctionChain(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.FunctionChain"

    def __init__(self, functions=None):
        super().__init__(_class_name=self.CLASS)
        self.functions = functions

    def to_json(self):
        function_json = super().to_json()
        if self.functions is not None:
            function_json["functions"] = self.functions
        return function_json


class ToTypeValue(Base):
    CLASS = "uk.gov.gchq.gaffer.types.function.ToTypeValue"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class IterableLongest(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.IterableLongest"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToLowerCase(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToLowerCase"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToUpperCase(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToUpperCase"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToPropertiesTuple(Base):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.ToPropertiesTuple"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class CsvToMaps(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.CsvToMaps"

    def __init__(self, quoted=None, quote_char=None, first_row=None, delimiter=None, header=None):
        super().__init__(_class_name=self.CLASS)
        self.quoted = quoted
        self.quote_char = quote_char
        self.first_row = first_row
        self.delimiter = delimiter
        self.header = header

    def to_json(self):
        function_json = super().to_json()
        if self.quoted is not None:
            function_json["quoted"] = self.quoted
        if self.quote_char is not None:
            function_json["quoteChar"] = self.quote_char
        if self.first_row is not None:
            function_json["firstRow"] = self.first_row
        if self.delimiter is not None:
            function_json["delimiter"] = self.delimiter
        if self.header is not None:
            function_json["header"] = self.header
        return function_json


class TupleInputAdapter(Base):
    CLASS = "uk.gov.gchq.koryphe.tuple.TupleInputAdapter"

    def __init__(self, selection=None):
        super().__init__(_class_name=self.CLASS)
        self.selection = selection

    def to_json(self):
        function_json = super().to_json()
        if self.selection is not None:
            function_json["selection"] = self.selection
        return function_json


class FirstValid(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.FirstValid"

    def __init__(self, predicate=None):
        super().__init__(_class_name=self.CLASS)
        self.predicate = predicate

    def to_json(self):
        function_json = super().to_json()
        if self.predicate is not None:
            function_json["predicate"] = self.predicate
        return function_json


class JsonToElementGenerator(Base):
    CLASS = "uk.gov.gchq.gaffer.data.generator.JsonToElementGenerator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class NthItem(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.NthItem"

    def __init__(self, selection=None):
        super().__init__(_class_name=self.CLASS)
        self.selection = selection

    def to_json(self):
        function_json = super().to_json()
        if self.selection is not None:
            function_json["selection"] = self.selection
        return function_json


class FromElementId(Base):
    CLASS = "uk.gov.gchq.gaffer.operation.function.FromElementId"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class DictionaryLookup(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.DictionaryLookup"

    def __init__(self, dictionary=None):
        super().__init__(_class_name=self.CLASS)
        self.dictionary = dictionary

    def to_json(self):
        function_json = super().to_json()
        if self.dictionary is not None:
            function_json["dictionary"] = self.dictionary
        return function_json


class Multiply(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Multiply"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExtractWalkEntitiesFromHop(Base):
    CLASS = "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEntitiesFromHop"

    def __init__(self, hop=None):
        super().__init__(_class_name=self.CLASS)
        self.hop = hop

    def to_json(self):
        function_json = super().to_json()
        if self.hop is not None:
            function_json["hop"] = self.hop
        return function_json


class StringSplit(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringSplit"

    def __init__(self, delimiter=None):
        super().__init__(_class_name=self.CLASS)
        self.delimiter = delimiter

    def to_json(self):
        function_json = super().to_json()
        if self.delimiter is not None:
            function_json["delimiter"] = self.delimiter
        return function_json


class DescriptionTransform(Base):
    CLASS = "uk.gov.gchq.gaffer.traffic.transform.DescriptionTransform"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class DeserialiseJson(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.DeserialiseJson"

    def __init__(self, output_class=None):
        super().__init__(_class_name=self.CLASS)
        self.output_class = output_class

    def to_json(self):
        function_json = super().to_json()
        if self.output_class is not None:
            function_json["outputClass"] = self.output_class
        return function_json


class SetValue(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.SetValue"

    def __init__(self, value=None):
        super().__init__(_class_name=self.CLASS)
        self.value = value

    def to_json(self):
        function_json = super().to_json()
        if self.value is not None:
            function_json["value"] = self.value
        return function_json


class IterableFunction(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.IterableFunction"

    def __init__(self, functions=None):
        super().__init__(_class_name=self.CLASS)
        self.functions = functions

    def to_json(self):
        function_json = super().to_json()
        if self.functions is not None:
            function_json["functions"] = self.functions
        return function_json


class ToLong(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToLong"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class MapFilter(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.MapFilter"

    def __init__(self, key_predicate=None, key_value_predicate=None, value_predicate=None):
        super().__init__(_class_name=self.CLASS)
        self.key_predicate = key_predicate
        self.key_value_predicate = key_value_predicate
        self.value_predicate = value_predicate

    def to_json(self):
        function_json = super().to_json()
        if self.key_predicate is not None:
            function_json["keyPredicate"] = self.key_predicate
        if self.key_value_predicate is not None:
            function_json["keyValuePredicate"] = self.key_value_predicate
        if self.value_predicate is not None:
            function_json["valuePredicate"] = self.value_predicate
        return function_json


class FunctionMap(Base):
    CLASS = "uk.gov.gchq.koryphe.function.FunctionMap"

    def __init__(self, function=None):
        super().__init__(_class_name=self.CLASS)
        self.function = function

    def to_json(self):
        function_json = super().to_json()
        if self.function is not None:
            function_json["function"] = self.function
        return function_json


class ToInteger(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToInteger"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class CurrentTime(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.CurrentTime"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class AggregatorUtilToQueryElementKey(Base):
    CLASS = "uk.gov.gchq.gaffer.store.util.AggregatorUtil$ToQueryElementKey"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class TupleAdaptedFunctionComposite(Base):
    CLASS = "uk.gov.gchq.koryphe.tuple.function.TupleAdaptedFunctionComposite"

    def __init__(self, functions=None):
        super().__init__(_class_name=self.CLASS)
        self.functions = functions

    def to_json(self):
        function_json = super().to_json()
        if self.functions is not None:
            function_json["functions"] = self.functions
        return function_json


class StringPrepend(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringPrepend"

    def __init__(self, prefix=None):
        super().__init__(_class_name=self.CLASS)
        self.prefix = prefix

    def to_json(self):
        function_json = super().to_json()
        if self.prefix is not None:
            function_json["prefix"] = self.prefix
        return function_json


class StringAppend(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringAppend"

    def __init__(self, suffix=None):
        super().__init__(_class_name=self.CLASS)
        self.suffix = suffix

    def to_json(self):
        function_json = super().to_json()
        if self.suffix is not None:
            function_json["suffix"] = self.suffix
        return function_json


class ReverseString(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ReverseString"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class MapGenerator(Base):
    CLASS = "uk.gov.gchq.gaffer.data.generator.MapGenerator"

    def __init__(self, constants=None, fields=None):
        super().__init__(_class_name=self.CLASS)
        self.constants = constants
        self.fields = fields

    def to_json(self):
        function_json = super().to_json()
        if self.constants is not None:
            function_json["constants"] = self.constants
        if self.fields is not None:
            function_json["fields"] = self.fields
        return function_json


class If(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.If"

    def __init__(self, otherwise=None, predicate=None, condition=None, then=None):
        super().__init__(_class_name=self.CLASS)
        self.otherwise = otherwise
        self.predicate = predicate
        self.condition = condition
        self.then = then

    def to_json(self):
        function_json = super().to_json()
        if self.otherwise is not None:
            function_json["otherwise"] = self.otherwise
        if self.predicate is not None:
            function_json["predicate"] = self.predicate
        if self.condition is not None:
            function_json["condition"] = self.condition
        if self.then is not None:
            function_json["then"] = self.then
        return function_json


class TupleAdaptedFunction(Base):
    CLASS = "uk.gov.gchq.koryphe.tuple.function.TupleAdaptedFunction"

    def __init__(self, selection=None, function=None, output_adapter=None, projection=None):
        super().__init__(_class_name=self.CLASS)
        self.selection = selection
        self.function = function
        self.output_adapter = output_adapter
        self.projection = projection

    def to_json(self):
        function_json = super().to_json()
        if self.selection is not None:
            function_json["selection"] = self.selection
        if self.function is not None:
            function_json["function"] = self.function
        if self.output_adapter is not None:
            function_json["outputAdapter"] = self.output_adapter
        if self.projection is not None:
            function_json["projection"] = self.projection
        return function_json


class DefaultIfNull(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.DefaultIfNull"

    def __init__(self, default_value=None):
        super().__init__(_class_name=self.CLASS)
        self.default_value = default_value

    def to_json(self):
        function_json = super().to_json()
        if self.default_value is not None:
            function_json["defaultValue"] = self.default_value
        return function_json


class ParseTime(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ParseTime"

    def __init__(self, format=None, time_zone=None, time_unit=None):
        super().__init__(_class_name=self.CLASS)
        self.format = format
        self.time_zone = time_zone
        self.time_unit = time_unit

    def to_json(self):
        function_json = super().to_json()
        if self.format is not None:
            function_json["format"] = self.format
        if self.time_zone is not None:
            function_json["timeZone"] = self.time_zone
        if self.time_unit is not None:
            function_json["timeUnit"] = self.time_unit
        return function_json


class IterableConcat(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.IterableConcat"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExtractId(Base):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.ExtractId"

    def __init__(self, id=None):
        super().__init__(_class_name=self.CLASS)
        self.id = id

    def to_json(self):
        function_json = super().to_json()
        if self.id is not None:
            function_json["id"] = self.id
        return function_json


class Cast(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Cast"

    def __init__(self, output_class=None):
        super().__init__(_class_name=self.CLASS)
        self.output_class = output_class

    def to_json(self):
        function_json = super().to_json()
        if self.output_class is not None:
            function_json["outputClass"] = self.output_class
        return function_json


class ExtractKeys(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ExtractKeys"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Length(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Length"

    def __init__(self, max_length=None):
        super().__init__(_class_name=self.CLASS)
        self.max_length = max_length

    def to_json(self):
        function_json = super().to_json()
        if self.max_length is not None:
            function_json["maxLength"] = self.max_length
        return function_json


class Gunzip(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Gunzip"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Increment(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Increment"

    def __init__(self, increment=None):
        super().__init__(_class_name=self.CLASS)
        self.increment = increment

    def to_json(self):
        function_json = super().to_json()
        if self.increment is not None:
            function_json["increment"] = self.increment
        return function_json


class ElementTransformer(Base):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.ElementTransformer"

    def __init__(self, functions=None):
        super().__init__(_class_name=self.CLASS)
        self.functions = functions

    def to_json(self):
        function_json = super().to_json()
        if self.functions is not None:
            function_json["functions"] = self.functions
        return function_json


class ExtractValue(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ExtractValue"

    def __init__(self, key=None):
        super().__init__(_class_name=self.CLASS)
        self.key = key

    def to_json(self):
        function_json = super().to_json()
        if self.key is not None:
            function_json["key"] = self.key
        return function_json


class FreqMapPredicator(Base):
    CLASS = "uk.gov.gchq.gaffer.types.function.FreqMapPredicator"

    def __init__(self, predicate=None):
        super().__init__(_class_name=self.CLASS)
        self.predicate = predicate

    def to_json(self):
        function_json = super().to_json()
        if self.predicate is not None:
            function_json["predicate"] = self.predicate
        return function_json


class ToTuple(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToTuple"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExampleTransformFunction(Base):
    CLASS = "uk.gov.gchq.gaffer.rest.example.ExampleTransformFunction"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class DeserialiseXml(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.DeserialiseXml"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToArray(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToArray"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class EdgeIdExtractor(Base):
    CLASS = "uk.gov.gchq.gaffer.operation.data.generator.EdgeIdExtractor"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Longest(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Longest"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class IterableFlatten(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.IterableFlatten"

    def __init__(self, operator=None):
        super().__init__(_class_name=self.CLASS)
        self.operator = operator

    def to_json(self):
        function_json = super().to_json()
        if self.operator is not None:
            function_json["operator"] = self.operator
        return function_json


class Size(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Size"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Base64Decode(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Base64Decode"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToDateString(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToDateString"

    def __init__(self, format=None):
        super().__init__(_class_name=self.CLASS)
        self.format = format

    def to_json(self):
        function_json = super().to_json()
        if self.format is not None:
            function_json["format"] = self.format
        return function_json


class Concat(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Concat"

    def __init__(self, separator=None):
        super().__init__(_class_name=self.CLASS)
        self.separator = separator

    def to_json(self):
        function_json = super().to_json()
        if self.separator is not None:
            function_json["separator"] = self.separator
        return function_json


class ExtractGroup(Base):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.ExtractGroup"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class RoadTrafficCsvElementGenerator(Base):
    CLASS = "uk.gov.gchq.gaffer.traffic.generator.RoadTrafficCsvElementGenerator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExampleElementGenerator(Base):
    CLASS = "uk.gov.gchq.gaffer.rest.example.ExampleElementGenerator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class MapToTuple(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.MapToTuple"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class FunctionComposite(Base):
    CLASS = "uk.gov.gchq.koryphe.function.FunctionComposite"

    def __init__(self, functions=None):
        super().__init__(_class_name=self.CLASS)
        self.functions = functions

    def to_json(self):
        function_json = super().to_json()
        if self.functions is not None:
            function_json["functions"] = self.functions
        return function_json


class IsEmpty(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.IsEmpty"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class FirstItem(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.FirstItem"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class StringRegexSplit(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringRegexSplit"

    def __init__(self, regex=None):
        super().__init__(_class_name=self.CLASS)
        self.regex = regex

    def to_json(self):
        function_json = super().to_json()
        if self.regex is not None:
            function_json["regex"] = self.regex
        return function_json


class StringTrim(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringTrim"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class AggregatorUtilToIngestElementKey(Base):
    CLASS = "uk.gov.gchq.gaffer.store.util.AggregatorUtil$ToIngestElementKey"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class RoadTrafficStringElementGenerator(Base):
    CLASS = "uk.gov.gchq.gaffer.traffic.generator.RoadTrafficStringElementGenerator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class LastItem(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.LastItem"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExtractWalkVertex(Base):
    CLASS = "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkVertex"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToElementId(Base):
    CLASS = "uk.gov.gchq.gaffer.operation.function.ToElementId"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToNull(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToNull"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToBytes(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToBytes"

    def __init__(self, charset=None):
        super().__init__(_class_name=self.CLASS)
        self.charset = charset

    def to_json(self):
        function_json = super().to_json()
        if self.charset is not None:
            function_json["charset"] = self.charset
        return function_json


class ToList(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToList"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class UnwrapEntityId(Base):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.UnwrapEntityId"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Identity(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Identity"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExampleDomainObjectGenerator(Base):
    CLASS = "uk.gov.gchq.gaffer.rest.example.ExampleDomainObjectGenerator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToSet(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToSet"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExtractWalkEntities(Base):
    CLASS = "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEntities"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class MultiplyLongBy(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.MultiplyLongBy"

    def __init__(self, by=None):
        super().__init__(_class_name=self.CLASS)
        self.by = by

    def to_json(self):
        function_json = super().to_json()
        if self.by is not None:
            function_json["by"] = self.by
        return function_json


class CsvGenerator(Base):
    CLASS = "uk.gov.gchq.gaffer.data.generator.CsvGenerator"

    def __init__(self, quoted=None, comma_replacement=None, constants=None, fields=None):
        super().__init__(_class_name=self.CLASS)
        self.quoted = quoted
        self.comma_replacement = comma_replacement
        self.constants = constants
        self.fields = fields

    def to_json(self):
        function_json = super().to_json()
        if self.quoted is not None:
            function_json["quoted"] = self.quoted
        if self.comma_replacement is not None:
            function_json["commaReplacement"] = self.comma_replacement
        if self.constants is not None:
            function_json["constants"] = self.constants
        if self.fields is not None:
            function_json["fields"] = self.fields
        return function_json


class ExtractProperty(Base):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.ExtractProperty"

    def __init__(self, name=None):
        super().__init__(_class_name=self.CLASS)
        self.name = name

    def to_json(self):
        function_json = super().to_json()
        if self.name is not None:
            function_json["name"] = self.name
        return function_json


class ToElementTuple(Base):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.ToElementTuple"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ParseDate(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ParseDate"

    def __init__(self, format=None, time_zone=None):
        super().__init__(_class_name=self.CLASS)
        self.format = format
        self.time_zone = time_zone

    def to_json(self):
        function_json = super().to_json()
        if self.format is not None:
            function_json["format"] = self.format
        if self.time_zone is not None:
            function_json["timeZone"] = self.time_zone
        return function_json


class StringTruncate(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringTruncate"

    def __init__(self, length=None, ellipses=None):
        super().__init__(_class_name=self.CLASS)
        self.length = length
        self.ellipses = ellipses

    def to_json(self):
        function_json = super().to_json()
        if self.length is not None:
            function_json["length"] = self.length
        if self.ellipses is not None:
            function_json["ellipses"] = self.ellipses
        return function_json


class ToString(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToString"

    def __init__(self, charset=None):
        super().__init__(_class_name=self.CLASS)
        self.charset = charset

    def to_json(self):
        function_json = super().to_json()
        if self.charset is not None:
            function_json["charset"] = self.charset
        return function_json


class CallMethod(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.CallMethod"

    def __init__(self, method=None):
        super().__init__(_class_name=self.CLASS)
        self.method = method

    def to_json(self):
        function_json = super().to_json()
        if self.method is not None:
            function_json["method"] = self.method
        return function_json


class CsvLinesToMaps(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.CsvLinesToMaps"

    def __init__(self, quoted=None, quote_char=None, first_row=None, delimiter=None, header=None):
        super().__init__(_class_name=self.CLASS)
        self.quoted = quoted
        self.quote_char = quote_char
        self.first_row = first_row
        self.delimiter = delimiter
        self.header = header

    def to_json(self):
        function_json = super().to_json()
        if self.quoted is not None:
            function_json["quoted"] = self.quoted
        if self.quote_char is not None:
            function_json["quoteChar"] = self.quote_char
        if self.first_row is not None:
            function_json["firstRow"] = self.first_row
        if self.delimiter is not None:
            function_json["delimiter"] = self.delimiter
        if self.header is not None:
            function_json["header"] = self.header
        return function_json


class CreateObject(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.CreateObject"

    def __init__(self, object_class=None):
        super().__init__(_class_name=self.CLASS)
        self.object_class = object_class

    def to_json(self):
        function_json = super().to_json()
        if self.object_class is not None:
            function_json["objectClass"] = self.object_class
        return function_json


class EntityIdExtractor(Base):
    CLASS = "uk.gov.gchq.gaffer.operation.data.generator.EntityIdExtractor"

    def __init__(self, edge_identifier_to_extract=None):
        super().__init__(_class_name=self.CLASS)
        self.edge_identifier_to_extract = edge_identifier_to_extract

    def to_json(self):
        function_json = super().to_json()
        if self.edge_identifier_to_extract is not None:
            function_json["edgeIdentifierToExtract"] = self.edge_identifier_to_extract
        return function_json


class AggregatorUtilToElementKey(Base):
    CLASS = "uk.gov.gchq.gaffer.store.util.AggregatorUtil$ToElementKey"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class FreqMapExtractor(Base):
    CLASS = "uk.gov.gchq.gaffer.types.function.FreqMapExtractor"

    def __init__(self, key=None):
        super().__init__(_class_name=self.CLASS)
        self.key = key

    def to_json(self):
        function_json = super().to_json()
        if self.key is not None:
            function_json["key"] = self.key
        return function_json


class ExtractValues(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ExtractValues"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToEntityId(Base):
    CLASS = "uk.gov.gchq.gaffer.operation.function.ToEntityId"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class StringReplace(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringReplace"

    def __init__(self, search_string=None, replacement=None):
        super().__init__(_class_name=self.CLASS)
        self.search_string = search_string
        self.replacement = replacement

    def to_json(self):
        function_json = super().to_json()
        if self.search_string is not None:
            function_json["searchString"] = self.search_string
        if self.replacement is not None:
            function_json["replacement"] = self.replacement
        return function_json


class ToTypeSubTypeValue(Base):
    CLASS = "uk.gov.gchq.gaffer.types.function.ToTypeSubTypeValue"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExtractWalkEdgesFromHop(Base):
    CLASS = "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEdgesFromHop"

    def __init__(self, hop=None):
        super().__init__(_class_name=self.CLASS)
        self.hop = hop

    def to_json(self):
        function_json = super().to_json()
        if self.hop is not None:
            function_json["hop"] = self.hop
        return function_json


class DivideBy(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.DivideBy"

    def __init__(self, by=None):
        super().__init__(_class_name=self.CLASS)
        self.by = by

    def to_json(self):
        function_json = super().to_json()
        if self.by is not None:
            function_json["by"] = self.by
        return function_json


class MultiplyBy(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.MultiplyBy"

    def __init__(self, by=None):
        super().__init__(_class_name=self.CLASS)
        self.by = by

    def to_json(self):
        function_json = super().to_json()
        if self.by is not None:
            function_json["by"] = self.by
        return function_json


class StringJoin(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringJoin"

    def __init__(self, delimiter=None):
        super().__init__(_class_name=self.CLASS)
        self.delimiter = delimiter

    def to_json(self):
        function_json = super().to_json()
        if self.delimiter is not None:
            function_json["delimiter"] = self.delimiter
        return function_json


class DefaultIfEmpty(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.DefaultIfEmpty"

    def __init__(self, default_value=None):
        super().__init__(_class_name=self.CLASS)
        self.default_value = default_value

    def to_json(self):
        function_json = super().to_json()
        if self.default_value is not None:
            function_json["defaultValue"] = self.default_value
        return function_json


class ExtractWalkEdges(Base):
    CLASS = "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEdges"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ApplyBiFunction(Base):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ApplyBiFunction"

    def __init__(self, function=None):
        super().__init__(_class_name=self.CLASS)
        self.function = function

    def to_json(self):
        function_json = super().to_json()
        if self.function is not None:
            function_json["function"] = self.function
        return function_json

