#
# Copyright 2016-2022 Crown Copyright
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


class TimeUnit:
    DAY = 'DAY'
    HOUR = 'HOUR'
    MINUTE = 'MINUTE'
    SECOND = 'SECOND'
    MILLISECOND = 'MILLISECOND'
    MICROSECOND = 'MICROSECOND'


# Import generated predicate implementations from fishbowl
from gafferpy.generated_api.predicates import *

# Add an alternative name for IntegerTupleAdaptedPredicate


class NestedPredicate(IntegerTupleAdaptedPredicate):
    pass


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
