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

from gafferpy.gaffer_binaryoperators import AbstractBinaryOperator


class ReservoirLongsUnionAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.sampling.binaryoperator.ReservoirLongsUnionAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class UnionAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.theta.binaryoperator.UnionAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class AggregatorUtilIngestElementBinaryOperator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.store.util.AggregatorUtil$IngestElementBinaryOperator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class FreqMapAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.types.function.FreqMapAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ElementAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.data.element.function.ElementAggregator"

    def __init__(self, operators=None):
        super().__init__(_class_name=self.CLASS)
        self.operators = operators

    def to_json(self):
        function_json = super().to_json()
        if self.operators is not None:
            function_json["operators"] = self.operators
        return function_json


class BinaryOperatorMap(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.binaryoperator.BinaryOperatorMap"

    def __init__(self, binary_operator=None):
        super().__init__(_class_name=self.CLASS)
        self.binary_operator = binary_operator

    def to_json(self):
        function_json = super().to_json()
        if self.binary_operator is not None:
            function_json["binaryOperator"] = self.binary_operator
        return function_json


class AggregatorUtilQueryPropertiesBinaryOperator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.store.util.AggregatorUtil$QueryPropertiesBinaryOperator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ReservoirItemsUnionAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.sampling.binaryoperator.ReservoirItemsUnionAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class RBMBackedTimestampSetAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.time.binaryoperator.RBMBackedTimestampSetAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ReservoirLongsSketchAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.sampling.binaryoperator.ReservoirLongsSketchAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Last(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.impl.binaryoperator.Last"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class StringDeduplicateConcat(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.impl.binaryoperator.StringDeduplicateConcat"

    def __init__(self, separator=None):
        super().__init__(_class_name=self.CLASS)
        self.separator = separator

    def to_json(self):
        function_json = super().to_json()
        if self.separator is not None:
            function_json["separator"] = self.separator
        return function_json


class And(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.impl.binaryoperator.And"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class StringsSketchAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.quantiles.binaryoperator.StringsSketchAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class CustomMapAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.types.binaryoperator.CustomMapAggregator"

    def __init__(self, binary_operator=None):
        super().__init__(_class_name=self.CLASS)
        self.binary_operator = binary_operator

    def to_json(self):
        function_json = super().to_json()
        if self.binary_operator is not None:
            function_json["binaryOperator"] = self.binary_operator
        return function_json


class AggregatorUtilQueryElementBinaryOperator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.store.util.AggregatorUtil$QueryElementBinaryOperator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class HllUnionAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.cardinality.binaryoperator.HllUnionAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class HyperLogLogPlusAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.clearspring.cardinality.binaryoperator.HyperLogLogPlusAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class TupleAdaptedBinaryOperatorComposite(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.tuple.binaryoperator.TupleAdaptedBinaryOperatorComposite"

    def __init__(self, operators=None):
        super().__init__(_class_name=self.CLASS)
        self.operators = operators

    def to_json(self):
        function_json = super().to_json()
        if self.operators is not None:
            function_json["operators"] = self.operators
        return function_json


class ReservoirItemsSketchAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.sampling.binaryoperator.ReservoirItemsSketchAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class StringsUnionAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.quantiles.binaryoperator.StringsUnionAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class DoublesUnionAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.quantiles.binaryoperator.DoublesUnionAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Min(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.impl.binaryoperator.Min"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Sum(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.impl.binaryoperator.Sum"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class AggregatorUtilIngestPropertiesBinaryOperator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.store.util.AggregatorUtil$IngestPropertiesBinaryOperator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class TupleAdaptedBinaryOperator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.tuple.binaryoperator.TupleAdaptedBinaryOperator"

    def __init__(
            self,
            input_adapter=None,
            selection=None,
            binary_operator=None,
            output_adapter=None):
        super().__init__(_class_name=self.CLASS)
        self.input_adapter = input_adapter
        self.selection = selection
        self.binary_operator = binary_operator
        self.output_adapter = output_adapter

    def to_json(self):
        function_json = super().to_json()
        if self.input_adapter is not None:
            function_json["inputAdapter"] = self.input_adapter
        if self.selection is not None:
            function_json["selection"] = self.selection
        if self.binary_operator is not None:
            function_json["binaryOperator"] = self.binary_operator
        if self.output_adapter is not None:
            function_json["outputAdapter"] = self.output_adapter
        return function_json


class RoaringBitmapAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.bitmap.function.aggregate.RoaringBitmapAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Product(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.impl.binaryoperator.Product"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Max(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.impl.binaryoperator.Max"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class KllFloatsSketchAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.quantiles.binaryoperator.KllFloatsSketchAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class LongTimeSeriesAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.time.binaryoperator.LongTimeSeriesAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class HllSketchAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.cardinality.binaryoperator.HllSketchAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class LongsSketchAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.frequencies.binaryoperator.LongsSketchAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class StringConcat(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.impl.binaryoperator.StringConcat"

    def __init__(self, separator=None):
        super().__init__(_class_name=self.CLASS)
        self.separator = separator

    def to_json(self):
        function_json = super().to_json()
        if self.separator is not None:
            function_json["separator"] = self.separator
        return function_json


class DoublesSketchAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.quantiles.binaryoperator.DoublesSketchAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class AdaptedBinaryOperator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.binaryoperator.AdaptedBinaryOperator"

    def __init__(
            self,
            input_adapter=None,
            binary_operator=None,
            output_adapter=None):
        super().__init__(_class_name=self.CLASS)
        self.input_adapter = input_adapter
        self.binary_operator = binary_operator
        self.output_adapter = output_adapter

    def to_json(self):
        function_json = super().to_json()
        if self.input_adapter is not None:
            function_json["inputAdapter"] = self.input_adapter
        if self.binary_operator is not None:
            function_json["binaryOperator"] = self.binary_operator
        if self.output_adapter is not None:
            function_json["outputAdapter"] = self.output_adapter
        return function_json


class BinaryOperatorComposite(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.binaryoperator.BinaryOperatorComposite"

    def __init__(self, operators=None):
        super().__init__(_class_name=self.CLASS)
        self.operators = operators

    def to_json(self):
        function_json = super().to_json()
        if self.operators is not None:
            function_json["operators"] = self.operators
        return function_json


class Or(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.impl.binaryoperator.Or"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class SketchAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.theta.binaryoperator.SketchAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class CollectionConcat(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.impl.binaryoperator.CollectionConcat"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class CollectionIntersect(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.impl.binaryoperator.CollectionIntersect"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class First(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.impl.binaryoperator.First"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class StringsSketchAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.frequencies.binaryoperator.StringsSketchAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class BoundedTimestampSetAggregator(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.gaffer.time.binaryoperator.BoundedTimestampSetAggregator"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()
