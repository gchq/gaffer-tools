#
# Copyright 2022 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

"""
This module has been generated with fishbowl.
To make changes, either extend these classes or change fishbowl.
"""

from gafferpy.gaffer_functions import AbstractFunction


class IterableToHyperLogLogPlus(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.sketches.clearspring.cardinality.function.IterableToHyperLogLogPlus"

    def __init__(self, p=None, sp=None):
        super().__init__(_class_name=self.CLASS)
        self.p = p
        self.sp = sp

    def to_json(self):
        function_json = super().to_json()
        if self.p is not None:
            function_json["p"] = self.p
        if self.sp is not None:
            function_json["sp"] = self.sp
        return function_json


class ToLong(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToLong"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ParseDate(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ParseDate"

    def __init__(self, format=None, time_zone=None, microseconds=None):
        super().__init__(_class_name=self.CLASS)
        self.format = format
        self.time_zone = time_zone
        self.microseconds = microseconds

    def to_json(self):
        function_json = super().to_json()
        if self.format is not None:
            function_json["format"] = self.format
        if self.time_zone is not None:
            function_json["timeZone"] = self.time_zone
        if self.microseconds is not None:
            function_json["microseconds"] = self.microseconds
        return function_json


class ReverseString(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ReverseString"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class DateToTimeBucketEnd(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.time.function.DateToTimeBucketEnd"

    def __init__(self, bucket=None):
        super().__init__(_class_name=self.CLASS)
        self.bucket = bucket

    def to_json(self):
        function_json = super().to_json()
        if self.bucket is not None:
            function_json["bucket"] = self.bucket
        return function_json


class ExtractId(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.ExtractId"

    def __init__(self, id=None):
        super().__init__(_class_name=self.CLASS)
        self.id = id

    def to_json(self):
        function_json = super().to_json()
        if self.id is not None:
            function_json["id"] = self.id
        return function_json


class ExtractWalkEdgesFromHop(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEdgesFromHop"

    def __init__(self, hop=None):
        super().__init__(_class_name=self.CLASS)
        self.hop = hop

    def to_json(self):
        function_json = super().to_json()
        if self.hop is not None:
            function_json["hop"] = self.hop
        return function_json


class HllSketchEntityGenerator(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.cardinality.HllSketchEntityGenerator"

    def __init__(
            self,
            properties_to_copy=None,
            count_property=None,
            cardinality_property_name=None,
            edge_group_property=None,
            vertex_value_converter=None,
            group=None):
        super().__init__(_class_name=self.CLASS)
        self.properties_to_copy = properties_to_copy
        self.count_property = count_property
        self.cardinality_property_name = cardinality_property_name
        self.edge_group_property = edge_group_property
        self.vertex_value_converter = vertex_value_converter
        self.group = group

    def to_json(self):
        function_json = super().to_json()
        if self.properties_to_copy is not None:
            function_json["propertiesToCopy"] = self.properties_to_copy
        if self.count_property is not None:
            function_json["countProperty"] = self.count_property
        if self.cardinality_property_name is not None:
            function_json["cardinalityPropertyName"] = self.cardinality_property_name
        if self.edge_group_property is not None:
            function_json["edgeGroupProperty"] = self.edge_group_property
        if self.vertex_value_converter is not None:
            function_json["vertexValueConverter"] = self.vertex_value_converter
        if self.group is not None:
            function_json["group"] = self.group
        return function_json


class ToFloat(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToFloat"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Size(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Size"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class JsonToElementGenerator(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.generator.JsonToElementGenerator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExtractWalkEdges(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEdges"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Divide(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Divide"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class FunctionChain(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.FunctionChain"

    def __init__(self, functions=None):
        super().__init__(_class_name=self.CLASS)
        self.functions = functions

    def to_json(self):
        function_json = super().to_json()
        if self.functions is not None:
            function_json["functions"] = self.functions
        return function_json


class ToTimeBucketStart(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.time.function.ToTimeBucketStart"

    def __init__(self, bucket=None):
        super().__init__(_class_name=self.CLASS)
        self.bucket = bucket

    def to_json(self):
        function_json = super().to_json()
        if self.bucket is not None:
            function_json["bucket"] = self.bucket
        return function_json


class ExampleElementGenerator(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.rest.example.ExampleElementGenerator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class DictionaryLookup(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.DictionaryLookup"

    def __init__(self, dictionary=None):
        super().__init__(_class_name=self.CLASS)
        self.dictionary = dictionary

    def to_json(self):
        function_json = super().to_json()
        if self.dictionary is not None:
            function_json["dictionary"] = self.dictionary
        return function_json


class TupleToElements(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.TupleToElements"

    def __init__(self, elements=None, use_group_mapping=None):
        super().__init__(_class_name=self.CLASS)
        self.elements = elements
        self.use_group_mapping = use_group_mapping

    def to_json(self):
        function_json = super().to_json()
        if self.elements is not None:
            function_json["elements"] = self.elements
        if self.use_group_mapping is not None:
            function_json["useGroupMapping"] = self.use_group_mapping
        return function_json


class UnwrapEntityId(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.UnwrapEntityId"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class AggregatorUtilToQueryElementKey(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.store.util.AggregatorUtil$ToQueryElementKey"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Longest(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Longest"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class TypeSubTypeValueToTuple(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.TypeSubTypeValueToTuple"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class IterableToFreqMap(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.types.function.IterableToFreqMap"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExtractProperty(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.ExtractProperty"

    def __init__(self, name=None):
        super().__init__(_class_name=self.CLASS)
        self.name = name

    def to_json(self):
        function_json = super().to_json()
        if self.name is not None:
            function_json["name"] = self.name
        return function_json


class ExtractValues(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ExtractValues"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class StringRegexSplit(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringRegexSplit"

    def __init__(self, regex=None):
        super().__init__(_class_name=self.CLASS)
        self.regex = regex

    def to_json(self):
        function_json = super().to_json()
        if self.regex is not None:
            function_json["regex"] = self.regex
        return function_json


class ExtractWalkEntitiesFromHop(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEntitiesFromHop"

    def __init__(self, hop=None):
        super().__init__(_class_name=self.CLASS)
        self.hop = hop

    def to_json(self):
        function_json = super().to_json()
        if self.hop is not None:
            function_json["hop"] = self.hop
        return function_json


class EdgeIdExtractor(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.operation.data.generator.EdgeIdExtractor"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToTimeBucketEnd(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.time.function.ToTimeBucketEnd"

    def __init__(self, bucket=None):
        super().__init__(_class_name=self.CLASS)
        self.bucket = bucket

    def to_json(self):
        function_json = super().to_json()
        if self.bucket is not None:
            function_json["bucket"] = self.bucket
        return function_json


class DateToTimeBucketStart(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.time.function.DateToTimeBucketStart"

    def __init__(self, bucket=None):
        super().__init__(_class_name=self.CLASS)
        self.bucket = bucket

    def to_json(self):
        function_json = super().to_json()
        if self.bucket is not None:
            function_json["bucket"] = self.bucket
        return function_json


class IterableFlatten(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.IterableFlatten"

    def __init__(self, operator=None):
        super().__init__(_class_name=self.CLASS)
        self.operator = operator

    def to_json(self):
        function_json = super().to_json()
        if self.operator is not None:
            function_json["operator"] = self.operator
        return function_json


class ToDateString(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToDateString"

    def __init__(self, format=None):
        super().__init__(_class_name=self.CLASS)
        self.format = format

    def to_json(self):
        function_json = super().to_json()
        if self.format is not None:
            function_json["format"] = self.format
        return function_json


class MapFilter(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.MapFilter"

    def __init__(
            self,
            key_predicate=None,
            key_value_predicate=None,
            value_predicate=None):
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


class FromElementId(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.operation.function.FromElementId"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class DeserialiseJson(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.DeserialiseJson"

    def __init__(self, output_class=None):
        super().__init__(_class_name=self.CLASS)
        self.output_class = output_class

    def to_json(self):
        function_json = super().to_json()
        if self.output_class is not None:
            function_json["outputClass"] = self.output_class
        return function_json


class NthItem(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.NthItem"

    def __init__(self, selection=None):
        super().__init__(_class_name=self.CLASS)
        self.selection = selection

    def to_json(self):
        function_json = super().to_json()
        if self.selection is not None:
            function_json["selection"] = self.selection
        return function_json


class CurrentDate(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.CurrentDate"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ReduceRelatedElements(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.ReduceRelatedElements"

    def __init__(
            self,
            visibility_aggregator=None,
            vertex_aggregator=None,
            related_vertex_groups=None,
            visibility_property=None):
        super().__init__(_class_name=self.CLASS)
        self.visibility_aggregator = visibility_aggregator
        self.vertex_aggregator = vertex_aggregator
        self.related_vertex_groups = related_vertex_groups
        self.visibility_property = visibility_property

    def to_json(self):
        function_json = super().to_json()
        if self.visibility_aggregator is not None:
            function_json["visibilityAggregator"] = self.visibility_aggregator
        if self.vertex_aggregator is not None:
            function_json["vertexAggregator"] = self.vertex_aggregator
        if self.related_vertex_groups is not None:
            function_json["relatedVertexGroups"] = self.related_vertex_groups
        if self.visibility_property is not None:
            function_json["visibilityProperty"] = self.visibility_property
        return function_json


class StringReplace(AbstractFunction):
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


class TypeValueToTuple(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.TypeValueToTuple"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class MapGenerator(AbstractFunction):
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


class FirstValid(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.FirstValid"

    def __init__(self, predicate=None):
        super().__init__(_class_name=self.CLASS)
        self.predicate = predicate

    def to_json(self):
        function_json = super().to_json()
        if self.predicate is not None:
            function_json["predicate"] = self.predicate
        return function_json


class MaskTimestampSetByTimeRange(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.time.function.MaskTimestampSetByTimeRange"

    def __init__(self, start_time=None, end_time=None, time_unit=None):
        super().__init__(_class_name=self.CLASS)
        self.start_time = start_time
        self.end_time = end_time
        self.time_unit = time_unit

    def to_json(self):
        function_json = super().to_json()
        if self.start_time is not None:
            function_json["startTime"] = self.start_time
        if self.end_time is not None:
            function_json["endTime"] = self.end_time
        if self.time_unit is not None:
            function_json["timeUnit"] = self.time_unit
        return function_json


class FreqMapPredicator(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.types.function.FreqMapPredicator"

    def __init__(self, predicate=None):
        super().__init__(_class_name=self.CLASS)
        self.predicate = predicate

    def to_json(self):
        function_json = super().to_json()
        if self.predicate is not None:
            function_json["predicate"] = self.predicate
        return function_json


class DefaultIfNull(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.DefaultIfNull"

    def __init__(self, default_value=None):
        super().__init__(_class_name=self.CLASS)
        self.default_value = default_value

    def to_json(self):
        function_json = super().to_json()
        if self.default_value is not None:
            function_json["defaultValue"] = self.default_value
        return function_json


class FirstItem(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.FirstItem"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Identity(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Identity"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class CsvGenerator(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.generator.CsvGenerator"

    def __init__(
            self,
            quoted=None,
            comma_replacement=None,
            constants=None,
            fields=None):
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


class MultiplyLongBy(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.MultiplyLongBy"

    def __init__(self, by=None):
        super().__init__(_class_name=self.CLASS)
        self.by = by

    def to_json(self):
        function_json = super().to_json()
        if self.by is not None:
            function_json["by"] = self.by
        return function_json


class ExampleDomainObjectGenerator(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.rest.example.ExampleDomainObjectGenerator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToElementTuple(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.ToElementTuple"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class DefaultIfEmpty(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.DefaultIfEmpty"

    def __init__(self, default_value=None):
        super().__init__(_class_name=self.CLASS)
        self.default_value = default_value

    def to_json(self):
        function_json = super().to_json()
        if self.default_value is not None:
            function_json["defaultValue"] = self.default_value
        return function_json


class ExtractKeys(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ExtractKeys"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class IterableFunction(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.IterableFunction"

    def __init__(self, functions=None):
        super().__init__(_class_name=self.CLASS)
        self.functions = functions

    def to_json(self):
        function_json = super().to_json()
        if self.functions is not None:
            function_json["functions"] = self.functions
        return function_json


class LastItem(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.LastItem"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToList(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToList"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExtractWalkVertex(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkVertex"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class CsvToMaps(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.CsvToMaps"

    def __init__(
            self,
            quoted=None,
            quote_char=None,
            first_row=None,
            delimiter=None,
            header=None):
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


class ToElementId(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.operation.function.ToElementId"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class AggregatorUtilToIngestElementKey(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.store.util.AggregatorUtil$ToIngestElementKey"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ApplyBiFunction(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ApplyBiFunction"

    def __init__(self, function=None):
        super().__init__(_class_name=self.CLASS)
        self.function = function

    def to_json(self):
        function_json = super().to_json()
        if self.function is not None:
            function_json["function"] = self.function
        return function_json


class ToFreqMap(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.types.function.ToFreqMap"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToLowerCase(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToLowerCase"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class IterableLongest(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.IterableLongest"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToBoolean(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToBoolean"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToTypeSubTypeValue(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.types.function.ToTypeSubTypeValue"

    def __init__(self, sub_type=None, type=None):
        super().__init__(_class_name=self.CLASS)
        self.sub_type = sub_type
        self.type = type

    def to_json(self):
        function_json = super().to_json()
        if self.sub_type is not None:
            function_json["subType"] = self.sub_type
        if self.type is not None:
            function_json["type"] = self.type
        return function_json


class FunctionComposite(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.function.FunctionComposite"

    def __init__(self, functions=None):
        super().__init__(_class_name=self.CLASS)
        self.functions = functions

    def to_json(self):
        function_json = super().to_json()
        if self.functions is not None:
            function_json["functions"] = self.functions
        return function_json


class ToBytes(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToBytes"

    def __init__(self, charset=None):
        super().__init__(_class_name=self.CLASS)
        self.charset = charset

    def to_json(self):
        function_json = super().to_json()
        if self.charset is not None:
            function_json["charset"] = self.charset
        return function_json


class TupleInputAdapter(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.tuple.TupleInputAdapter"

    def __init__(self, selection=None):
        super().__init__(_class_name=self.CLASS)
        self.selection = selection

    def to_json(self):
        function_json = super().to_json()
        if self.selection is not None:
            function_json["selection"] = self.selection
        return function_json


class Length(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Length"

    def __init__(self, max_length=None):
        super().__init__(_class_name=self.CLASS)
        self.max_length = max_length

    def to_json(self):
        function_json = super().to_json()
        if self.max_length is not None:
            function_json["maxLength"] = self.max_length
        return function_json


class OpenCypherCsvElementGenerator(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.generator.OpenCypherCsvElementGenerator"

    def __init__(
            self,
            first_row=None,
            trim=None,
            delimiter=None,
            null_string=None,
            header=None):
        super().__init__(_class_name=self.CLASS)
        self.first_row = first_row
        self.trim = trim
        self.delimiter = delimiter
        self.null_string = null_string
        self.header = header

    def to_json(self):
        function_json = super().to_json()
        if self.first_row is not None:
            function_json["firstRow"] = self.first_row
        if self.trim is not None:
            function_json["trim"] = self.trim
        if self.delimiter is not None:
            function_json["delimiter"] = self.delimiter
        if self.null_string is not None:
            function_json["nullString"] = self.null_string
        if self.header is not None:
            function_json["header"] = self.header
        return function_json


class StringTrim(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringTrim"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class IterableFilter(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.IterableFilter"

    def __init__(self, predicate=None):
        super().__init__(_class_name=self.CLASS)
        self.predicate = predicate

    def to_json(self):
        function_json = super().to_json()
        if self.predicate is not None:
            function_json["predicate"] = self.predicate
        return function_json


class ToPropertiesTuple(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.ToPropertiesTuple"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToTrailingWildcardPair(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.operation.function.ToTrailingWildcardPair"

    def __init__(self, end_of_range=None):
        super().__init__(_class_name=self.CLASS)
        self.end_of_range = end_of_range

    def to_json(self):
        function_json = super().to_json()
        if self.end_of_range is not None:
            function_json["endOfRange"] = self.end_of_range
        return function_json


class FunctionMap(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.function.FunctionMap"

    def __init__(self, function=None):
        super().__init__(_class_name=self.CLASS)
        self.function = function

    def to_json(self):
        function_json = super().to_json()
        if self.function is not None:
            function_json["function"] = self.function
        return function_json


class IterableConcat(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.IterableConcat"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class SetValue(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.SetValue"

    def __init__(self, value=None):
        super().__init__(_class_name=self.CLASS)
        self.value = value

    def to_json(self):
        function_json = super().to_json()
        if self.value is not None:
            function_json["value"] = self.value
        return function_json


class ToTimeBucket(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.time.function.ToTimeBucket"

    def __init__(self, bucket=None):
        super().__init__(_class_name=self.CLASS)
        self.bucket = bucket

    def to_json(self):
        function_json = super().to_json()
        if self.bucket is not None:
            function_json["bucket"] = self.bucket
        return function_json


class MapToTuple(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.MapToTuple"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToUpperCase(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToUpperCase"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Increment(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Increment"

    def __init__(self, increment=None):
        super().__init__(_class_name=self.CLASS)
        self.increment = increment

    def to_json(self):
        function_json = super().to_json()
        if self.increment is not None:
            function_json["increment"] = self.increment
        return function_json


class IsEmpty(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.IsEmpty"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class CallMethod(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.CallMethod"

    def __init__(self, method=None):
        super().__init__(_class_name=self.CLASS)
        self.method = method

    def to_json(self):
        function_json = super().to_json()
        if self.method is not None:
            function_json["method"] = self.method
        return function_json


class ToInteger(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToInteger"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToTuple(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToTuple"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToHyperLogLogPlus(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.sketches.clearspring.cardinality.function.ToHyperLogLogPlus"

    def __init__(self, p=None, sp=None):
        super().__init__(_class_name=self.CLASS)
        self.p = p
        self.sp = sp

    def to_json(self):
        function_json = super().to_json()
        if self.p is not None:
            function_json["p"] = self.p
        if self.sp is not None:
            function_json["sp"] = self.sp
        return function_json


class ToSet(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToSet"

    def __init__(self, implementation=None):
        super().__init__(_class_name=self.CLASS)
        self.implementation = implementation

    def to_json(self):
        function_json = super().to_json()
        if self.implementation is not None:
            function_json["implementation"] = self.implementation
        return function_json


class StringsToTypeSubTypeValue(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.types.function.StringsToTypeSubTypeValue"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class StringsToTypeValue(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.types.function.StringsToTypeValue"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToDouble(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToDouble"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToString(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToString"

    def __init__(self, charset=None):
        super().__init__(_class_name=self.CLASS)
        self.charset = charset

    def to_json(self):
        function_json = super().to_json()
        if self.charset is not None:
            function_json["charset"] = self.charset
        return function_json


class Multiply(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Multiply"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class CreateObject(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.CreateObject"

    def __init__(self, object_class=None):
        super().__init__(_class_name=self.CLASS)
        self.object_class = object_class

    def to_json(self):
        function_json = super().to_json()
        if self.object_class is not None:
            function_json["objectClass"] = self.object_class
        return function_json


class CsvLinesToMaps(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.CsvLinesToMaps"

    def __init__(
            self,
            quoted=None,
            quote_char=None,
            first_row=None,
            trim=None,
            delimiter=None,
            null_string=None,
            header=None):
        super().__init__(_class_name=self.CLASS)
        self.quoted = quoted
        self.quote_char = quote_char
        self.first_row = first_row
        self.trim = trim
        self.delimiter = delimiter
        self.null_string = null_string
        self.header = header

    def to_json(self):
        function_json = super().to_json()
        if self.quoted is not None:
            function_json["quoted"] = self.quoted
        if self.quote_char is not None:
            function_json["quoteChar"] = self.quote_char
        if self.first_row is not None:
            function_json["firstRow"] = self.first_row
        if self.trim is not None:
            function_json["trim"] = self.trim
        if self.delimiter is not None:
            function_json["delimiter"] = self.delimiter
        if self.null_string is not None:
            function_json["nullString"] = self.null_string
        if self.header is not None:
            function_json["header"] = self.header
        return function_json


class ToSingletonTreeSet(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.time.function.ToSingletonTreeSet"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class FromEntityId(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.operation.function.FromEntityId"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToTypeValue(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.types.function.ToTypeValue"

    def __init__(self, type=None):
        super().__init__(_class_name=self.CLASS)
        self.type = type

    def to_json(self):
        function_json = super().to_json()
        if self.type is not None:
            function_json["type"] = self.type
        return function_json


class StringAppend(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringAppend"

    def __init__(self, suffix=None):
        super().__init__(_class_name=self.CLASS)
        self.suffix = suffix

    def to_json(self):
        function_json = super().to_json()
        if self.suffix is not None:
            function_json["suffix"] = self.suffix
        return function_json


class TupleAdaptedFunctionComposite(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.tuple.function.TupleAdaptedFunctionComposite"

    def __init__(self, functions=None):
        super().__init__(_class_name=self.CLASS)
        self.functions = functions

    def to_json(self):
        function_json = super().to_json()
        if self.functions is not None:
            function_json["functions"] = self.functions
        return function_json


class TuplesToElements(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.TuplesToElements"

    def __init__(self, elements=None, use_group_mapping=None):
        super().__init__(_class_name=self.CLASS)
        self.elements = elements
        self.use_group_mapping = use_group_mapping

    def to_json(self):
        function_json = super().to_json()
        if self.elements is not None:
            function_json["elements"] = self.elements
        if self.use_group_mapping is not None:
            function_json["useGroupMapping"] = self.use_group_mapping
        return function_json


class StringPrepend(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringPrepend"

    def __init__(self, prefix=None):
        super().__init__(_class_name=self.CLASS)
        self.prefix = prefix

    def to_json(self):
        function_json = super().to_json()
        if self.prefix is not None:
            function_json["prefix"] = self.prefix
        return function_json


class CurrentTime(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.CurrentTime"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToEntityId(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.operation.function.ToEntityId"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExampleTransformFunction(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.rest.example.ExampleTransformFunction"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class StringSplit(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringSplit"

    def __init__(self, delimiter=None):
        super().__init__(_class_name=self.CLASS)
        self.delimiter = delimiter

    def to_json(self):
        function_json = super().to_json()
        if self.delimiter is not None:
            function_json["delimiter"] = self.delimiter
        return function_json


class ExtractGroup(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.ExtractGroup"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class IterableToHllSketch(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.cardinality.function.IterableToHllSketch"

    def __init__(self, log_k=None):
        super().__init__(_class_name=self.CLASS)
        self.log_k = log_k

    def to_json(self):
        function_json = super().to_json()
        if self.log_k is not None:
            function_json["logK"] = self.log_k
        return function_json


class ToTimestampSet(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.time.function.ToTimestampSet"

    def __init__(self, bucket=None, max_size=None, millis_correction=None):
        super().__init__(_class_name=self.CLASS)
        self.bucket = bucket
        self.max_size = max_size
        self.millis_correction = millis_correction

    def to_json(self):
        function_json = super().to_json()
        if self.bucket is not None:
            function_json["bucket"] = self.bucket
        if self.max_size is not None:
            function_json["maxSize"] = self.max_size
        if self.millis_correction is not None:
            function_json["millisCorrection"] = self.millis_correction
        return function_json


class Cast(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Cast"

    def __init__(self, output_class=None):
        super().__init__(_class_name=self.CLASS)
        self.output_class = output_class

    def to_json(self):
        function_json = super().to_json()
        if self.output_class is not None:
            function_json["outputClass"] = self.output_class
        return function_json


class StringTruncate(AbstractFunction):
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


class FreqMapExtractor(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.types.function.FreqMapExtractor"

    def __init__(self, key=None):
        super().__init__(_class_name=self.CLASS)
        self.key = key

    def to_json(self):
        function_json = super().to_json()
        if self.key is not None:
            function_json["key"] = self.key
        return function_json


class Concat(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Concat"

    def __init__(self, separator=None):
        super().__init__(_class_name=self.CLASS)
        self.separator = separator

    def to_json(self):
        function_json = super().to_json()
        if self.separator is not None:
            function_json["separator"] = self.separator
        return function_json


class ToArray(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToArray"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExtractValue(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ExtractValue"

    def __init__(self, key=None):
        super().__init__(_class_name=self.CLASS)
        self.key = key

    def to_json(self):
        function_json = super().to_json()
        if self.key is not None:
            function_json["key"] = self.key
        return function_json


class ExtractWalkEntities(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEntities"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class AggregatorUtilToElementKey(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.store.util.AggregatorUtil$ToElementKey"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ElementTransformer(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.ElementTransformer"

    def __init__(self, functions=None):
        super().__init__(_class_name=self.CLASS)
        self.functions = functions

    def to_json(self):
        function_json = super().to_json()
        if self.functions is not None:
            function_json["functions"] = self.functions
        return function_json


class ToHllSketch(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.cardinality.function.ToHllSketch"

    def __init__(self, log_k=None):
        super().__init__(_class_name=self.CLASS)
        self.log_k = log_k

    def to_json(self):
        function_json = super().to_json()
        if self.log_k is not None:
            function_json["logK"] = self.log_k
        return function_json


class StringRegexReplace(AbstractFunction):
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


class ParseTime(AbstractFunction):
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


class StringJoin(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.StringJoin"

    def __init__(self, delimiter=None):
        super().__init__(_class_name=self.CLASS)
        self.delimiter = delimiter

    def to_json(self):
        function_json = super().to_json()
        if self.delimiter is not None:
            function_json["delimiter"] = self.delimiter
        return function_json


class If(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.If"

    def __init__(
            self,
            otherwise=None,
            predicate=None,
            condition=None,
            then=None):
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


class MultiplyBy(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.MultiplyBy"

    def __init__(self, by=None):
        super().__init__(_class_name=self.CLASS)
        self.by = by

    def to_json(self):
        function_json = super().to_json()
        if self.by is not None:
            function_json["by"] = self.by
        return function_json


class Gunzip(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Gunzip"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToNull(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.ToNull"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class TupleAdaptedFunction(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.tuple.function.TupleAdaptedFunction"

    def __init__(
            self,
            input_adapter=None,
            selection=None,
            function=None,
            output_adapter=None,
            projection=None):
        super().__init__(_class_name=self.CLASS)
        self.input_adapter = input_adapter
        self.selection = selection
        self.function = function
        self.output_adapter = output_adapter
        self.projection = projection

    def to_json(self):
        function_json = super().to_json()
        if self.input_adapter is not None:
            function_json["inputAdapter"] = self.input_adapter
        if self.selection is not None:
            function_json["selection"] = self.selection
        if self.function is not None:
            function_json["function"] = self.function
        if self.output_adapter is not None:
            function_json["outputAdapter"] = self.output_adapter
        if self.projection is not None:
            function_json["projection"] = self.projection
        return function_json


class EntityIdExtractor(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.operation.data.generator.EntityIdExtractor"

    def __init__(self, edge_identifier_to_extract=None):
        super().__init__(_class_name=self.CLASS)
        self.edge_identifier_to_extract = edge_identifier_to_extract

    def to_json(self):
        function_json = super().to_json()
        if self.edge_identifier_to_extract is not None:
            function_json["edgeIdentifierToExtract"] = self.edge_identifier_to_extract
        return function_json


class DeserialiseXml(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.DeserialiseXml"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class HyperLogLogPlusEntityGenerator(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.sketches.clearspring.cardinality.HyperLogLogPlusEntityGenerator"

    def __init__(
            self,
            properties_to_copy=None,
            count_property=None,
            cardinality_property_name=None,
            edge_group_property=None,
            vertex_value_converter=None,
            group=None):
        super().__init__(_class_name=self.CLASS)
        self.properties_to_copy = properties_to_copy
        self.count_property = count_property
        self.cardinality_property_name = cardinality_property_name
        self.edge_group_property = edge_group_property
        self.vertex_value_converter = vertex_value_converter
        self.group = group

    def to_json(self):
        function_json = super().to_json()
        if self.properties_to_copy is not None:
            function_json["propertiesToCopy"] = self.properties_to_copy
        if self.count_property is not None:
            function_json["countProperty"] = self.count_property
        if self.cardinality_property_name is not None:
            function_json["cardinalityPropertyName"] = self.cardinality_property_name
        if self.edge_group_property is not None:
            function_json["edgeGroupProperty"] = self.edge_group_property
        if self.vertex_value_converter is not None:
            function_json["vertexValueConverter"] = self.vertex_value_converter
        if self.group is not None:
            function_json["group"] = self.group
        return function_json


class PropertiesTransformer(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.PropertiesTransformer"

    def __init__(self, functions=None):
        super().__init__(_class_name=self.CLASS)
        self.functions = functions

    def to_json(self):
        function_json = super().to_json()
        if self.functions is not None:
            function_json["functions"] = self.functions
        return function_json


class DivideBy(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.DivideBy"

    def __init__(self, by=None):
        super().__init__(_class_name=self.CLASS)
        self.by = by

    def to_json(self):
        function_json = super().to_json()
        if self.by is not None:
            function_json["by"] = self.by
        return function_json


class Base64Decode(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.Base64Decode"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class OpenCypherCsvGenerator(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.data.generator.OpenCypherCsvGenerator"

    def __init__(
            self,
            quoted=None,
            comma_replacement=None,
            neo4j_format=None,
            constants=None,
            fields=None):
        super().__init__(_class_name=self.CLASS)
        self.quoted = quoted
        self.comma_replacement = comma_replacement
        self.neo4j_format = neo4j_format
        self.constants = constants
        self.fields = fields

    def to_json(self):
        function_json = super().to_json()
        if self.quoted is not None:
            function_json["quoted"] = self.quoted
        if self.comma_replacement is not None:
            function_json["commaReplacement"] = self.comma_replacement
        if self.neo4j_format is not None:
            function_json["neo4jFormat"] = self.neo4j_format
        if self.constants is not None:
            function_json["constants"] = self.constants
        if self.fields is not None:
            function_json["fields"] = self.fields
        return function_json
