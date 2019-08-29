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
This module contains Python copies of Gaffer java classes
"""

from gafferpy.gaffer_core import *

class BinaryOperator(ToJson, ToCodeString):
    CLASS = "java.util.function.BinaryOperator"

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

class AbstractBinaryOperator(BinaryOperator):
    CLASS = "java.util.function.BinaryOperator"

    def __init__(self, _class_name=None):
        super().__init__()
        self._class_name = _class_name

    def to_json(self):
        function_json = {}

        if self._class_name is not None:
            function_json['class'] = self._class_name

        return function_json


class Sum(AbstractBinaryOperator):
    CLASS = "uk.gov.gchq.koryphe.impl.binaryoperator.Sum"

    def __init__(self):
        super().__init__(_class_name=self.CLASS)
    
    def to_json(self):
        return super().to_json()


class BinaryOperatorContext(ToJson, ToCodeString):
    CLASS = "gaffer.AggregatorContext"

    def __init__(self, selection=None, binary_operator=None):
        if isinstance(selection, list):
            self.selection = selection
        else:
            self.selection = [selection]
        self.binary_operator = binary_operator

    def to_json(self):
        function_json = {}
        if self.selection is not None:
            function_json['selection'] = self.selection
        if self.binary_operator is not None:
            function_json['binaryOperator'] = self.binary_operator.to_json()

        return function_json

def binary_operator_context_converter(obj):
    if 'class' in obj:
        binary_operator = dict(obj)
    else:
        binary_operator = obj['binary_operator']
        if isinstance(binary_operator, dict):
            binary_operator = dict(binary_operator)

    if not isinstance(binary_operator, BinaryOperator):
        binary_operator = JsonConverter.from_json(binary_operator)
        if not isinstance(binary_operator, BinaryOperator):
            class_name = binary_operator.get('class')
            binary_operator.pop('class', None)
            binary_operator = BinaryOperator(
                class_name=class_name,
                fields=binary_operator
            )

    return BinaryOperatorContext(
        selection=obj.get('selection'),
        binary_operator=binary_operator
    )


def binary_operator_converter(obj):
    if isinstance(obj, dict):
        binary_operator = dict(obj)
    else:
        binary_operator = obj

    if not isinstance(binary_operator, BinaryOperator):
        binary_operator = JsonConverter.from_json(binary_operator)
        if not isinstance(binary_operator, BinaryOperator):
            class_name = binary_operator.get('class')
            binary_operator.pop('class', None)
            binary_operator = BinaryOperator(
                class_name=class_name,
                fields=binary_operator
            )

    return binary_operator


def load_binaryoperator_json_map():
    for name, class_obj in inspect.getmembers(
            sys.modules[__name__], inspect.isclass):
        if hasattr(class_obj, 'CLASS'):
            JsonConverter.GENERIC_JSON_CONVERTERS[class_obj.CLASS] = \
                lambda obj, class_obj=class_obj: class_obj(**obj)
    JsonConverter.CUSTOM_JSON_CONVERTERS[
        BinaryOperatorContext.CLASS] = binary_operator_context_converter
    JsonConverter.CUSTOM_JSON_CONVERTERS[
        BinaryOperator.CLASS] = binary_operator_converter


load_binaryoperator_json_map()
