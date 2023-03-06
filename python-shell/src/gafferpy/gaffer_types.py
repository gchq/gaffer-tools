#
# Copyright 2016-2023 Crown Copyright
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

anys = "T", "Object", "Object[]", "?", "OBJ", "java.lang.Object", "I", "I_ITEM", "java.lang.Class", "uk.gov.gchq.gaffer.access.predicate.AccessPredicate", "java.util.function.Function"
lists = "java.lang.Iterable", "java.util.List"
dicts = "java.util.Map", "java.util.LinkedHashMap", "java.util.Properties", "uk.gov.gchq.gaffer.store.schema.Schema"
strings = "java.lang.String", "char"
ints = "java.lang.Integer", "java.lang.Long", "int"


def parse_java_type_to_string(java_type: str) -> str:
    python_type = parse_java_type(java_type)
    if isinstance(python_type, type):
        if python_type.__module__ == "builtins":
            return python_type.__name__
        type_name = f"{python_type.__module__}.{python_type.__name__}"
    else:
        type_name = str(python_type)

    type_name = type_name.replace("gafferpy.gaffer_operations.", "")
    type_name = type_name.replace("gafferpy.generated_api.operations.", "")
    return type_name


def parse_java_type(java_type: str) -> type:
    if "[]" in java_type:
        array_type = java_type.split("[]")[0]
        return List[parse_java_type(array_type)]
    if "<" in java_type:
        split = java_type.split("<")
        outter_type = split[0]
        inner_type = ">".join(split[1].split(">")[:-1])
        if outter_type in anys:
            return Any
        if inner_type in anys:
            return parse_java_type(outter_type)
        return parse_java_type(outter_type)[parse_java_type(inner_type)]
    if "," in java_type:
        split = java_type.split(",")
        first_type = split[0]
        remaining_types = ",".join(split[1:])
        return parse_java_type(first_type), parse_java_type(remaining_types)
    if java_type in anys:
        return Any
    if java_type in lists:
        return List
    if java_type in dicts:
        return Dict
    if java_type in strings:
        return str
    if java_type in ints:
        return int
    if java_type == "java.lang.Float":
        return float
    if java_type == "java.lang.Boolean":
        return bool
    if java_type == "java.util.Set":
        return Set
    if java_type == "uk.gov.gchq.gaffer.commonutil.pair.Pair":
        return Tuple
    if java_type == "uk.gov.gchq.gaffer.data.element.id.ElementId":
        return ElementSeed
    if java_type == "uk.gov.gchq.gaffer.data.element.id.EntityId":
        return EntitySeed
    if java_type == "uk.gov.gchq.gaffer.data.element.id.EdgeId":
        return EdgeSeed
    if java_type == "uk.gov.gchq.gaffer.data.element.Element":
        return Element
    if java_type == "uk.gov.gchq.gaffer.operation.Operation":
        return Operation

    if java_type in JsonConverter.CLASS_MAP:
        return JsonConverter.CLASS_MAP[java_type]
    return Any


def long(value: int) -> dict[str, int]:
    return {"java.lang.Long": value}


def date(value: int) -> dict[str, int]:
    return {"java.util.Date": value}


def freq_map(map_value: Dict[Any, int]) -> dict[str, Dict[Any, int]]:
    return {"uk.gov.gchq.gaffer.types.FreqMap": map_value}


def type_value(type: Any = None, value: Any = None) -> dict[str, Dict[str, Any]]:
    map = {}
    if type is not None:
        map["type"] = type
    if value is not None:
        map["value"] = value
    return {"uk.gov.gchq.gaffer.types.TypeSubTypeValue": map}


def type_subtype_value(type: Any = None, subType: Any = None,
                       value: Any = None) -> dict[str, Dict[str, Any]]:
    map = {}
    if type is not None:
        map["type"] = type
    if subType is not None:
        map["subType"] = subType
    if value is not None:
        map["value"] = value
    return {"uk.gov.gchq.gaffer.types.TypeSubTypeValue": map}


def tree_set(set: Set[Any]) -> dict[str, Set[Any]]:
    return {"java.util.TreeSet": set}


def hyper_log_log_plus(offers: List[Any], p: int = 5,
                       sp: int = 5) -> dict[str, dict[str, dict[str, Any]]]:
    return {"com.clearspring.analytics.stream.cardinality.HyperLogLogPlus": {
        "hyperLogLogPlus": {"p": p, "sp": sp, "offers": offers}}}
