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
This module contains Python copies of Gaffer function java classes
"""

from gafferpy.gaffer_core import *
import gafferpy.gaffer_predicates as pred
import gafferpy.gaffer_binaryoperators as bop


class Function(ToJson, ToCodeString):
    CLASS = "java.util.function.Function"

    def __init__(self, class_name=None, fields=None):
        self.class_name = class_name
        self.fields = fields

    def to_json(self):
        if self.fields is not None:
            function_json = dict(self.fields)
        else:
            function_json = {}

        if self.class_name is not None:
            function_json['class'] = self.class_name

        return function_json


class AbstractFunction(Function):
    CLASS = "java.util.function.Function"

    def __init__(self, _class_name=None):
        super().__init__()
        self._class_name = _class_name

    def to_json(self):
        function_json = {}
        if self._class_name is not None:
            function_json['class'] = self._class_name

        return function_json


class ElementGenerator(Function):
    CLASS = 'uk.gov.gchq.gaffer.data.generator.ElementGenerator'

    def __init__(self,
                 class_name,
                 fields=None):
        super().__init__(class_name=class_name, fields=fields)


# Import generated function implementations from fishbowl
from gafferpy.generated_api.functions import *


class FunctionContext(TupleAdaptedFunction):
    CLASS = "gaffer.FunctionContext"

    def __init__(self, selection=None, function=None, projection=None):
        super().__init__(selection=selection, function=function, projection=projection)

    def to_json(self):
        function_json = super().to_json()
        del function_json["class"]

        return function_json


def function_context_converter(obj):
    if 'class' in obj:
        function = dict(obj)
    else:
        function = obj['function']
        if isinstance(function, dict):
            function = dict(function)

    if not isinstance(function, Function):
        function = JsonConverter.from_json(function)
        if not isinstance(function, Function):
            class_name = function.get('class')
            function.pop('class', None)
            function = Function(
                class_name=class_name,
                fields=function
            )

    return FunctionContext(
        selection=obj.get('selection'),
        function=function,
        projection=obj.get('projection')
    )


def function_converter(obj):
    if isinstance(obj, dict):
        function = dict(obj)
    else:
        function = obj

    if not isinstance(function, Function):
        function = JsonConverter.from_json(function)
        if not isinstance(function, Function):
            class_name = function.get('class')
            function.pop('class', None)
            function = Function(
                class_name=class_name,
                fields=function
            )

    return function


def load_function_json_map():
    for name, class_obj in inspect.getmembers(
            sys.modules[__name__], inspect.isclass):
        if hasattr(class_obj, 'CLASS'):
            JsonConverter.GENERIC_JSON_CONVERTERS[class_obj.CLASS] = \
                lambda obj, class_obj=class_obj: class_obj(**obj)
    JsonConverter.CUSTOM_JSON_CONVERTERS[
        FunctionContext.CLASS] = function_context_converter
    JsonConverter.CUSTOM_JSON_CONVERTERS[Function.CLASS] = function_converter


load_function_json_map()
