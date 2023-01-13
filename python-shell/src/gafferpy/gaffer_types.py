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
This module contains Python copies of common Gaffer java types.
"""

from typing import List, Dict, Any, Tuple, Set

from gafferpy.gaffer_core import ElementSeed, EntitySeed, EdgeSeed, Element, JsonConverter
from gafferpy.gaffer_operations import Operation

def parse_java_type_to_string(java_type: str) -> str:
    python_type = parse_java_type(java_type)
    if isinstance(python_type, type):
        if python_type.__module__ == "builtins":
            return python_type.__name__
        type_name = f"{python_type.__module__}.{python_type.__name__}"
    else:
        type_name = str(python_type)

    type_name = type_name.replace("gafferpy.gaffer_operations.","")
    type_name = type_name.replace("gafferpy.generated_api.operations.", "")
    return type_name

def parse_java_type(java_type: str) -> type:
    match java_type.split("["):
        case array_type, "]":
            return List[parse_java_type(array_type)]
    match java_type.split("<"):
        case "java.lang.Class", *_:
            return Any
        case "java.util.function.Function", *_:
            return Any
        case type1, "T>":
            return parse_java_type(type1)
        case type1, parameter:
            parameter = parameter.strip(">")
            return parse_java_type(type1)[parse_java_type(parameter)]
    match java_type.split(","):
        case type1, type2:
            return parse_java_type(type1), parse_java_type(type2)
    match java_type:
        case "java.lang.String" | "char":
            return str
        case "java.lang.Integer" | "java.lang.Long" | "int":
            return int
        case "java.lang.Float":
            return float
        case "java.lang.Boolean":
            return bool
        case "T" | "Object" | "?" | "OBJ" | "java.lang.Object" | "I" | "I_ITEM" | "java.lang.Class" | "uk.gov.gchq.gaffer.access.predicate.AccessPredicate":
            return Any
        case "java.lang.Iterable" | "java.util.List":
            return List
        case "java.util.Set":
            return Set
        case "java.util.Map" | "java.util.LinkedHashMap" | "java.util.Properties" | "uk.gov.gchq.gaffer.store.schema.Schema":
            return Dict
        case "uk.gov.gchq.gaffer.commonutil.pair.Pair":
            return Tuple
        case "uk.gov.gchq.gaffer.data.element.id.ElementId":
            return ElementSeed
        case "uk.gov.gchq.gaffer.data.element.id.EntityId":
            return EntitySeed
        case "uk.gov.gchq.gaffer.data.element.id.EdgeId":
            return EdgeSeed
        case "uk.gov.gchq.gaffer.data.element.Element":
            return Element
        case "uk.gov.gchq.gaffer.operation.Operation":
            return Operation

    if java_type in JsonConverter.CLASS_MAP:
        return JsonConverter.CLASS_MAP[java_type]

    return Any

def long(value):
    return {"java.lang.Long": value}


def date(value):
    return {"java.util.Date": value}


def freq_map(map_value):
    return {"uk.gov.gchq.gaffer.types.FreqMap": map_value}


def type_value(type=None, value=None):
    map = {}
    if type is not None:
        map['type'] = type
    if value is not None:
        map['value'] = value
    return {"uk.gov.gchq.gaffer.types.TypeSubTypeValue": map}


def type_subtype_value(type=None, subType=None, value=None):
    map = {}
    if type is not None:
        map['type'] = type
    if subType is not None:
        map['subType'] = subType
    if value is not None:
        map['value'] = value
    return {"uk.gov.gchq.gaffer.types.TypeSubTypeValue": map}
