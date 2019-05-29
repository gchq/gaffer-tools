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
This module contains Python copies of common Gaffer java types.
"""


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
