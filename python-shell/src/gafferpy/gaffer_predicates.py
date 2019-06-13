#
# Copyright 2016-2019 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

"""
This module contains Python copies of Gaffer predicate java classes
"""

from gafferpy.gaffer_core import *


class PredicateContext(ToJson, ToCodeString):
    CLASS = "gaffer.PredicateContext"

    def __init__(self, selection=None, predicate=None):
        if isinstance(selection, list):
            self.selection = selection
        else:
            self.selection = [selection]
        self.predicate = predicate

    def to_json(self):
        predicate_json = {}
        if self.selection is not None:
            predicate_json['selection'] = self.selection
        if self.predicate is not None:
            predicate_json['predicate'] = self.predicate.to_json()

        return predicate_json


class Predicate(ToJson, ToCodeString):
    CLASS = "java.util.function.Predicate"

    def __init__(self, class_name=None, fields=None):
        self.class_name = class_name
        self.fields = fields

    def to_json(self):
        if self.fields is not None:
            predicate_json = dict(self.fields)
        else:
            predicate_json = {}

        if self.class_name is not None:
            predicate_json['class'] = self.class_name

        return predicate_json


class AbstractPredicate(Predicate):
    def __init__(self, _class_name=None):
        super().__init__()
        self._class_name = _class_name

    def to_json(self):
        predicate_json = {}

        if self._class_name is not None:
            predicate_json['class'] = self._class_name

        return predicate_json


class And(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.And"

    def __init__(self, predicates=None):
        super().__init__(_class_name=self.CLASS)
        self.predicates = []
        if predicates is not None:
            for p in predicates:
                if not isinstance(p, Predicate):
                    p_class = p.get('class')
                    p_fields = dict(p)
                    p_fields.pop('class', None)
                    p = Predicate(class_name=p_class, fields=p_fields)
                self.predicates.append(p)

    def to_json(self):
        predicate_json = super().to_json()
        if self.predicates is not None:
            predicates_json = []
            for p in self.predicates:
                if isinstance(p, Predicate):
                    predicates_json.append(p.to_json())
                else:
                    predicates_json.append(p)
            predicate_json['predicates'] = predicates_json

        return predicate_json


class Or(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.Or"

    def __init__(self, predicates=None):
        super().__init__(_class_name=self.CLASS)
        self.predicates = []
        if predicates is not None:
            for p in predicates:
                if not isinstance(p, Predicate):
                    p_class = p.get('class')
                    p_fields = dict(p)
                    p_fields.pop('class', None)
                    p = Predicate(class_name=p_class, fields=p_fields)
                self.predicates.append(p)

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['class'] = self.CLASS
        if self.predicates is not None:
            predicates_json = []
            for p in self.predicates:
                if isinstance(p, Predicate):
                    predicates_json.append(p.to_json())
                else:
                    predicates_json.append(p)
            predicate_json['predicates'] = predicates_json

        return predicate_json


class Not(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.Not"

    def __init__(self, predicate=None):
        super().__init__(_class_name=self.CLASS)
        if predicate is not None:
            if not isinstance(predicate, Predicate):
                p_class = predicate.get('class')
                p_fields = dict(predicate)
                p_fields.pop('class', None)
                predicate = Predicate(class_name=p_class, fields=p_fields)
        self.predicate = predicate

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['class'] = self.CLASS
        if self.predicate is not None:
            if isinstance(self.predicate, Predicate):
                nested_predicate_json = self.predicate.to_json()
            else:
                nested_predicate_json = self.predicate
            predicate_json['predicate'] = nested_predicate_json

        return predicate_json


class NestedPredicate(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.tuple.predicate.IntegerTupleAdaptedPredicate"

    def __init__(self, selection=None, predicate=None):
        super().__init__(_class_name=self.CLASS)
        self.selection = selection
        if predicate is not None:
            if not isinstance(predicate, Predicate):
                p_class = predicate.get('class')
                p_fields = dict(predicate)
                p_fields.pop('class', None)
                predicate = Predicate(class_name=p_class, fields=p_fields)
        self.predicate = predicate

    def to_json(self):
        predicate_json = super().to_json()
        if self.selection is not None:
            predicate_json['selection'] = self.selection
        if self.predicate is not None:
            predicate_json['predicate'] = self.predicate.to_json()

        return predicate_json


class AgeOff(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.AgeOff"

    def __init__(self, age_off_time):
        super().__init__(_class_name=self.CLASS)
        self.age_off_time = age_off_time

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['ageOffTime'] = self.age_off_time
        return predicate_json


class AgeOffFromDays(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.AgeOffFromDays"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)


class AreEqual(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.AreEqual"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)


class AreIn(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.AreIn"

    def __init__(self, values):
        super().__init__(_class_name=self.CLASS)
        self.values = values

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['values'] = self.values
        return predicate_json


class CollectionContains(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.CollectionContains"

    def __init__(self, value):
        super().__init__(_class_name=self.CLASS)
        self.value = value

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['value'] = self.value
        return predicate_json


class Exists(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.Exists"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)


class HyperLogLogPlusIsLessThan(AbstractPredicate):
    CLASS = "uk.gov.gchq.gaffer.sketches.clearspring.cardinality.predicate.HyperLogLogPlusIsLessThan"

    def __init__(self, value, or_equal_to=None):
        super().__init__(_class_name=self.CLASS)
        self.value = value
        self.or_equal_to = or_equal_to

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['value'] = self.value
        if self.or_equal_to is not None:
            predicate_json['orEqualTo'] = self.or_equal_to
        return predicate_json


class HllSketchIsLessThan(AbstractPredicate):
    CLASS = "uk.gov.gchq.gaffer.sketches.datasketches.cardinality.predicate.HllSketchIsLessThan"

    def __init__(self, value, or_equal_to=None):
        super().__init__(_class_name=self.CLASS)
        self.value = value
        self.or_equal_to = or_equal_to

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['value'] = self.value
        if self.or_equal_to is not None:
            predicate_json['orEqualTo'] = self.or_equal_to
        return predicate_json


class If(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.If"

    def __init__(self, condition=None, predicate=None,
                 then=None, otherwise=None):
        super().__init__(_class_name=self.CLASS)

        self.condition = condition
        self.predicate = predicate_converter(predicate)
        self.then = predicate_converter(then)
        self.otherwise = predicate_converter(otherwise)

    def to_json(self):
        predicate_json = super().to_json()
        if self.condition is not None:
            predicate_json['condition'] = self.condition
        if self.predicate is not None:
            predicate_json['predicate'] = self.predicate.to_json()
        if self.then is not None:
            predicate_json['then'] = self.then.to_json()
        if self.otherwise is not None:
            predicate_json['otherwise'] = self.otherwise.to_json()

        return predicate_json


class IsA(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.IsA"

    def __init__(self, type):
        super().__init__(_class_name=self.CLASS)
        self.type = type

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['type'] = self.type
        return predicate_json


class IsEqual(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.IsEqual"

    def __init__(self, value):
        super().__init__(_class_name=self.CLASS)
        self.value = value

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['value'] = self.value
        return predicate_json


class IsFalse(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.IsFalse"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)


class IsTrue(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.IsTrue"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)


class IsIn(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.IsIn"

    def __init__(self, values):
        super().__init__(_class_name=self.CLASS)
        self.values = values

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['values'] = self.values
        return predicate_json


class IsLessThan(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.IsLessThan"

    def __init__(self, value, or_equal_to=None):
        super().__init__(_class_name=self.CLASS)
        self.value = value
        self.or_equal_to = or_equal_to

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['value'] = self.value
        if self.or_equal_to is not None:
            predicate_json['orEqualTo'] = self.or_equal_to
        return predicate_json


class IsLongerThan(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.IsLongerThan"

    def __init__(self, min_length, or_equal_to=None):
        super().__init__(_class_name=self.CLASS)

        self.min_length = min_length
        self.or_equal_to = or_equal_to

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['minLength'] = self.min_length

        if self.or_equal_to is not None:
            predicate_json['orEqualTo'] = self.or_equal_to
        return predicate_json


class IsMoreThan(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan"

    def __init__(self, value, or_equal_to=None):
        super().__init__(_class_name=self.CLASS)
        self.value = value
        self.or_equal_to = or_equal_to

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['value'] = self.value
        if self.or_equal_to is not None:
            predicate_json['orEqualTo'] = self.or_equal_to
        return predicate_json


class IsShorterThan(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.IsShorterThan"

    def __init__(self, max_length, or_equal_to=None):
        super().__init__(_class_name=self.CLASS)
        self.max_length = max_length
        self.or_equal_to = or_equal_to

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['maxLength'] = self.max_length
        if self.or_equal_to is not None:
            predicate_json['orEqualTo'] = self.or_equal_to
        return predicate_json


class IsXLessThanY(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.IsXLessThanY"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)


class IsXMoreThanY(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.IsXMoreThanY"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)


class MapContains(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.MapContains"

    def __init__(self, key=None):
        super().__init__(_class_name=self.CLASS)
        self.key = key

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['class'] = self.CLASS
        predicate_json['key'] = self.key

        return predicate_json


class MapContainsPredicate(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.MapContainsPredicate"

    def __init__(self, key_predicate=None):
        super().__init__(_class_name=self.CLASS)
        self.key_predicate = None
        if key_predicate is not None:
            if not isinstance(key_predicate, Predicate):
                p_class = key_predicate.get('class')
                p_fields = dict(key_predicate)
                p_fields.pop('class', None)
                key_predicate = Predicate(class_name=p_class,
                                          fields=p_fields)
        self.key_predicate = key_predicate

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['class'] = self.CLASS
        if self.key_predicate is not None:
            if isinstance(self.key_predicate, Predicate):
                nested_predicate_json = self.key_predicate.to_json()
            else:
                nested_predicate_json = self.key_predicate
            predicate_json['keyPredicate'] = nested_predicate_json

        return predicate_json


class MultiRegex(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.MultiRegex"

    def __init__(self, value):
        super().__init__(_class_name=self.CLASS)
        self.value = value

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['value'] = self.value
        return predicate_json


class PredicateMap(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.predicate.PredicateMap"

    def __init__(self, predicate, key):
        super().__init__(_class_name=self.CLASS)
        self.key = key
        if not isinstance(predicate, Predicate):
            p_class = predicate.get('class')
            p_fields = dict(predicate)
            p_fields.pop('class', None)
            predicate = Predicate(class_name=p_class,
                                  fields=p_fields)
        self.predicate = predicate

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['class'] = self.CLASS
        predicate_json['key'] = self.key
        if isinstance(self.predicate, Predicate):
            nested_predicate_json = self.predicate.to_json()
        else:
            nested_predicate_json = self.predicate
        predicate_json['predicate'] = nested_predicate_json

        return predicate_json


class Regex(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.Regex"

    def __init__(self, value):
        super().__init__(_class_name=self.CLASS)
        self.value = value

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['value'] = self.value
        return predicate_json


class StringContains(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.StringContains"

    def __init__(self, value, ignore_case):
        super().__init__(_class_name=self.CLASS)
        self.value = value
        self.ignore_case = ignore_case

    def to_json(self):
        predicate_json = super().to_json()
        predicate_json['value'] = self.value
        if self.ignore_case is not None:
            predicate_json['ignoreCase'] = self.ignore_case
        return predicate_json


class InRange(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.range.InRange"

    def __init__(self, start=None, end=None, start_inclusive=None,
                 end_inclusive=None):
        super().__init__(_class_name=self.CLASS)
        self.start = start
        self.end = end
        self.start_inclusive = start_inclusive
        self.end_inclusive = end_inclusive

    def to_json(self):
        predicate_json = super().to_json()
        if self.start is not None:
            predicate_json['start'] = self.start
        if self.end is not None:
            predicate_json['end'] = self.end
        if self.start_inclusive is not None:
            predicate_json['startInclusive'] = self.start_inclusive
        if self.end_inclusive is not None:
            predicate_json['endInclusive'] = self.end_inclusive
        return predicate_json


class InRangeDual(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.range.InRangeDual"

    def __init__(self, start=None, end=None, start_inclusive=None,
                 end_inclusive=None,
                 start_fully_contained=None,
                 end_fully_contained=None):
        super().__init__(_class_name=self.CLASS)
        self.start = start
        self.end = end
        self.start_inclusive = start_inclusive
        self.end_inclusive = end_inclusive
        self.start_fully_contained = start_fully_contained
        self.end_fully_contained = end_fully_contained

    def to_json(self):
        predicate_json = super().to_json()
        if self.start is not None:
            predicate_json['start'] = self.start
        if self.end is not None:
            predicate_json['end'] = self.end
        if self.start_inclusive is not None:
            predicate_json['startInclusive'] = self.start_inclusive
        if self.end_inclusive is not None:
            predicate_json['endInclusive'] = self.end_inclusive
        if self.start_fully_contained is not None:
            predicate_json['startFullyContained'] = self.start_fully_contained
        if self.end_fully_contained is not None:
            predicate_json['endFullyContained'] = self.end_fully_contained

        return predicate_json


class TimeUnit:
    DAY = 'DAY'
    HOUR = 'HOUR'
    MINUTE = 'MINUTE'
    SECOND = 'SECOND'
    MILLISECOND = 'MILLISECOND'
    MICROSECOND = 'MICROSECOND'


class InTimeRange(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.range.InTimeRange"

    def __init__(self, start=None, start_offset=None, end=None, end_offset=None,
                 offset_unit=None, start_inclusive=None, end_inclusive=None,
                 time_unit=None, time_zone=None):
        super().__init__(_class_name=self.CLASS)
        self.start = start
        self.start_offset = start_offset
        self.end = end
        self.end_offset = end_offset
        self.offset_unit = offset_unit
        self.start_inclusive = start_inclusive
        self.end_inclusive = end_inclusive
        self.time_unit = time_unit
        self.time_zone = time_zone

    def to_json(self):
        predicate_json = super().to_json()
        if self.start is not None:
            predicate_json['start'] = self.start
        if self.start_offset is not None:
            predicate_json['startOffset'] = self.start_offset
        if self.end is not None:
            predicate_json['end'] = self.end
        if self.end_offset is not None:
            predicate_json['endOffset'] = self.end_offset
        if self.offset_unit is not None:
            predicate_json['offsetUnit'] = self.offset_unit
        if self.start_inclusive is not None:
            predicate_json['startInclusive'] = self.start_inclusive
        if self.end_inclusive is not None:
            predicate_json['endInclusive'] = self.end_inclusive
        if self.time_unit is not None:
            predicate_json['timeUnit'] = self.time_unit
        if self.time_zone is not None:
            predicate_json['timeZone'] = self.time_zone
        return predicate_json


class InTimeRangeDual(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.range.InTimeRangeDual"

    def __init__(self, start=None, start_offset=None, end=None, end_offset=None,
                 offset_unit=None, start_inclusive=None, end_inclusive=None,
                 time_unit=None,
                 start_fully_contained=None,
                 end_fully_contained=None,
                 time_zone=None):
        super().__init__(_class_name=self.CLASS)
        self.start = start
        self.start_offset = start_offset
        self.end = end
        self.end_offset = end_offset
        self.offset_unit = offset_unit
        self.start_inclusive = start_inclusive
        self.end_inclusive = end_inclusive
        self.time_unit = time_unit
        self.start_fully_contained = start_fully_contained
        self.end_fully_contained = end_fully_contained
        self.time_zone = time_zone

    def to_json(self):
        predicate_json = super().to_json()
        if self.start is not None:
            predicate_json['start'] = self.start
        if self.start_offset is not None:
            predicate_json['startOffset'] = self.start_offset
        if self.end is not None:
            predicate_json['end'] = self.end
        if self.end_offset is not None:
            predicate_json['endOffset'] = self.end_offset
        if self.offset_unit is not None:
            predicate_json['offsetUnit'] = self.offset_unit
        if self.start_inclusive is not None:
            predicate_json['startInclusive'] = self.start_inclusive
        if self.end_inclusive is not None:
            predicate_json['endInclusive'] = self.end_inclusive
        if self.time_unit is not None:
            predicate_json['timeUnit'] = self.time_unit
        if self.start_fully_contained is not None:
            predicate_json['startFullyContained'] = self.start_fully_contained
        if self.end_fully_contained is not None:
            predicate_json['endFullyContained'] = self.end_fully_contained
        if self.time_zone is not None:
            predicate_json['timeZone'] = self.time_zone

        return predicate_json


class InDateRange(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.range.InDateRange"

    def __init__(self, start=None, start_offset=None, end=None, end_offset=None,
                 offset_unit=None, start_inclusive=None, end_inclusive=None,
                 time_zone=None):
        super().__init__(_class_name=self.CLASS)
        self.start = start
        self.start_offset = start_offset
        self.end = end
        self.end_offset = end_offset
        self.offset_unit = offset_unit
        self.start_inclusive = start_inclusive
        self.end_inclusive = end_inclusive
        self.time_zone = time_zone

    def to_json(self):
        predicate_json = super().to_json()
        if self.start is not None:
            predicate_json['start'] = self.start
        if self.start_offset is not None:
            predicate_json['startOffset'] = self.start_offset
        if self.end is not None:
            predicate_json['end'] = self.end
        if self.end_offset is not None:
            predicate_json['endOffset'] = self.end_offset
        if self.offset_unit is not None:
            predicate_json['offsetUnit'] = self.offset_unit
        if self.start_inclusive is not None:
            predicate_json['startInclusive'] = self.start_inclusive
        if self.end_inclusive is not None:
            predicate_json['endInclusive'] = self.end_inclusive
        if self.time_zone is not None:
            predicate_json['timeZone'] = self.time_zone
        return predicate_json


class InDateRangeDual(AbstractPredicate):
    CLASS = "uk.gov.gchq.koryphe.impl.predicate.range.InDateRangeDual"

    def __init__(self, start=None, start_offset=None, end=None, end_offset=None,
                 offset_unit=None, start_inclusive=None, end_inclusive=None,
                 start_fully_contained=None,
                 end_fully_contained=None,
                 time_zone=None):
        super().__init__(_class_name=self.CLASS)
        self.start = start
        self.start_offset = start_offset
        self.end = end
        self.end_offset = end_offset
        self.offset_unit = offset_unit
        self.start_inclusive = start_inclusive
        self.end_inclusive = end_inclusive
        self.start_fully_contained = start_fully_contained
        self.end_fully_contained = end_fully_contained
        self.time_zone = time_zone

    def to_json(self):
        predicate_json = super().to_json()
        if self.start is not None:
            predicate_json['start'] = self.start
        if self.start_offset is not None:
            predicate_json['startOffset'] = self.start_offset
        if self.end is not None:
            predicate_json['end'] = self.end
        if self.end_offset is not None:
            predicate_json['endOffset'] = self.end_offset
        if self.offset_unit is not None:
            predicate_json['offsetUnit'] = self.offset_unit
        if self.start_inclusive is not None:
            predicate_json['startInclusive'] = self.start_inclusive
        if self.end_inclusive is not None:
            predicate_json['endInclusive'] = self.end_inclusive
        if self.start_fully_contained is not None:
            predicate_json['startFullyContained'] = self.start_fully_contained
        if self.end_fully_contained is not None:
            predicate_json['endFullyContained'] = self.end_fully_contained
        if self.time_zone is not None:
            predicate_json['timeZone'] = self.time_zone
        return predicate_json

class ElementJoinComparator(AbstractPredicate):

    CLASS = "uk.gov.gchq.gaffer.data.element.comparison.ElementJoinComparator"

    def __init__(self, group_by_properties=None):
        super().__init__(_class_name=self.CLASS)

        self.group_by_properties = group_by_properties

    def to_json(self):
        predicate_json = super().to_json()
        if self.group_by_properties is not None:
            predicate_json['groupByProperties'] = self.group_by_properties

        return predicate_json

        
def predicate_context_converter(obj):
    if obj is None:
        return None

    if 'class' in obj:
        predicate = dict(obj)
    else:
        predicate = obj['predicate']
        if isinstance(predicate, dict):
            predicate = dict(predicate)

    if not isinstance(predicate, Predicate):
        predicate = JsonConverter.from_json(predicate)
        if not isinstance(predicate, Predicate):
            class_name = predicate.get('class')
            predicate.pop('class', None)
            predicate = Predicate(
                class_name=class_name,
                fields=predicate
            )

    return PredicateContext(
        selection=obj.get('selection'),
        predicate=predicate
    )


def predicate_converter(obj):
    if obj is None:
        return None

    if isinstance(obj, dict):
        predicate = dict(obj)
    else:
        predicate = obj

    if not isinstance(predicate, Predicate):
        predicate = JsonConverter.from_json(predicate)
        if not isinstance(predicate, Predicate):
            class_name = predicate.get('class')
            predicate.pop('class', None)
            predicate = Predicate(
                class_name=class_name,
                fields=predicate
            )

    return predicate


def load_predicate_json_map():
    for name, class_obj in inspect.getmembers(
            sys.modules[__name__], inspect.isclass):
        if hasattr(class_obj, 'CLASS'):
            JsonConverter.GENERIC_JSON_CONVERTERS[class_obj.CLASS] = \
                lambda obj, class_obj=class_obj: class_obj(**obj)
    JsonConverter.CUSTOM_JSON_CONVERTERS[
        PredicateContext.CLASS] = predicate_context_converter
    JsonConverter.CUSTOM_JSON_CONVERTERS[Predicate.CLASS] = predicate_converter


load_predicate_json_map()
