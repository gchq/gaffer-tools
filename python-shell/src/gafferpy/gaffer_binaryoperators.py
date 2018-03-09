#
# Copyright 2016 Crown Copyright
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

from gafferpy.gaffer_config import *

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
