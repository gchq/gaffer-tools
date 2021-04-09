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
This module contains Python copies of Gaffer core java classes
"""

import json
import re

import inspect
import sys


class ToJson:
    """
    Enables implementations to be converted to json via a to_json method
    """

    def __repr__(self):
        return json.dumps(self.to_json())

    def to_json(self):
        """
        Converts an object to a simple json dictionary
        """
        raise NotImplementedError('Use an implementation')

    def to_json_str(self):
        return json.dumps(self.to_json())

    def to_json_pretty_str(self):
        return json.dumps(self.to_json(), indent=4, separators=(',', ': '))

    def pretty_print(self):
        print(self.to_json_pretty_str())

    def __str__(self):
        return str(self.to_json())

    def __eq__(self, other):
        other_json = other
        if isinstance(other_json, ToJson):
            other_json = other.to_json()
        return self.to_json() == other_json


class ToCodeString:
    """
   Enables implementations to return a string of the code used to construct the
   python object.
   """

    @staticmethod
    def obj_to_code_string(obj, indent=''):
        if obj is None:
            return ''

        new_line = ' \n' + indent
        new_line_indent = new_line + '  '

        if isinstance(obj, ToCodeString):
            obj_str = obj.to_code_string(indent=indent + '  ')
        elif isinstance(obj, list):
            obj_str = '['
            for item in obj:
                obj_item_str = ToCodeString.obj_to_code_string(item,
                                                               indent=indent + '  ')
                if obj_str is '[':
                    obj_str = obj_str + new_line_indent + '  ' + obj_item_str
                else:
                    obj_str = obj_str + ',' + new_line_indent + '  ' + obj_item_str
            obj_str = obj_str + new_line_indent + ']'
        elif isinstance(obj, str):
            obj_str = '"' + obj + '"'
        else:
            obj_str = str(obj)
        return obj_str

    def to_code_string(self, header=False, indent=''):
        new_line = ' \n' + indent
        new_line_indent = new_line + '  '
        fields = dict(self.__dict__)

        field_code_str = ''

        for name, val in fields.items():
            if (not name.startswith('_')) and val is not None:
                val_str = ToCodeString.obj_to_code_string(val, indent)
                if field_code_str is '':
                    field_code_str = name + '=' + val_str
                else:
                    field_code_str = field_code_str + ',' + new_line_indent + name + '=' + val_str

        if header:
            header_str = 'from gafferpy import gaffer as g\n' + new_line
        else:
            header_str = ''

        if field_code_str is '':
            return header_str + 'g.' + type(self).__name__ + '()'

        return header_str + 'g.' + type(self).__name__ + '(' + new_line_indent \
               + field_code_str \
               + new_line + ')'


class DirectedType:
    EITHER = 'EITHER'
    DIRECTED = 'DIRECTED'
    UNDIRECTED = 'UNDIRECTED'


class InOutType:
    EITHER = 'EITHER'
    IN = 'INCOMING'
    OUT = 'OUTGOING'


class SeedMatchingType:
    RELATED = 'RELATED'
    EQUAL = 'EQUAL'


class EdgeVertices:
    NONE = 'NONE'
    SOURCE = 'SOURCE'
    DESTINATION = 'DESTINATION'
    BOTH = 'BOTH'


class UseMatchedVertex:
    IGNORE = 'IGNORE'
    EQUAL = 'EQUAL'
    OPPOSITE = 'OPPOSITE'


class MatchKey:
    LEFT = 'LEFT'
    RIGHT = 'RIGHT'

class JoinType:
    FULL = 'FULL'
    OUTER = 'OUTER'
    INNER = 'INNER'

class ElementSeed(ToJson, ToCodeString):
    def __repr__(self):
        return json.dumps(self.to_json())

    def to_json(self):
        raise NotImplementedError('Use either EntitySeed or EdgeSeed')

    def to_json_wrapped(self):
        raise NotImplementedError('Use either EntitySeed or EdgeSeed')


class EntitySeed(ElementSeed):
    CLASS = 'uk.gov.gchq.gaffer.operation.data.EntitySeed'

    def __init__(self, vertex):
        super().__init__()
        self.vertex = vertex

    def to_json(self):
        return {'class': self.CLASS,
                'vertex': self.vertex}

    def to_json_wrapped(self):
        return {
            self.CLASS: {
                'vertex': self.vertex,
                'class': self.CLASS
            }
        }


class EdgeSeed(ElementSeed):
    CLASS = 'uk.gov.gchq.gaffer.operation.data.EdgeSeed'

    def __init__(self, source, destination, directed_type, matched_vertex=None):
        super().__init__()
        self.source = source
        self.destination = destination
        if isinstance(directed_type, str):
            self.directed_type = directed_type
        elif directed_type:
            self.directed_type = DirectedType.DIRECTED
        else:
            self.directed_type = DirectedType.UNDIRECTED
        self.matched_vertex = matched_vertex

    def to_json(self):
        seed = {
            'class': self.CLASS,
            'source': self.source,
            'destination': self.destination,
            'directedType': self.directed_type
        }

        if self.matched_vertex is not None:
            seed['matchedVertex'] = self.matched_vertex

        return seed

    def to_json_wrapped(self):
        seed = {
            'source': self.source,
            'destination': self.destination,
            'directedType': self.directed_type,
            'class': self.CLASS
        }

        if self.matched_vertex is not None:
            seed['matchedVertex'] = self.matched_vertex

        return {
            self.CLASS: seed
        }


class Comparator(ToJson, ToCodeString):
    def __init__(self, class_name, fields=None):
        super().__init__()

        self.class_name = class_name
        self.fields = fields

    def to_json(self):
        tmp_json = {
            'class': self.class_name
        }

        if self.fields is not None:
            for key in self.fields:
                tmp_json[key] = self.fields[key]

        return tmp_json


class ElementPropertyComparator(Comparator):
    CLASS = 'uk.gov.gchq.gaffer.data.element.comparison.ElementPropertyComparator'

    def __init__(self, groups, property, reversed=False):
        super().__init__(class_name=None)
        self.groups = groups
        self.property = property
        self.reversed = reversed

    def to_json(self):
        tmp_json = super().to_json()
        tmp_json["class"] = self.CLASS
        tmp_json['groups'] = self.groups
        tmp_json['property'] = self.property
        tmp_json['reversed'] = self.reversed
        return tmp_json


class SeedPair(ToJson, ToCodeString):
    CLASS = 'uk.gov.gchq.gaffer.commonutil.pair.Pair'

    def __init__(self, first, second):
        super().__init__()

        if isinstance(first, ElementSeed):
            self.first = first
        elif isinstance(first, dict) and 'class' in first:
            self.first = JsonConverter.from_json(first)
        elif isinstance(first, dict) and EntitySeed.CLASS in first:
            self.first = first[EntitySeed.CLASS]
            if isinstance(self.first, dict):
                self.first = JsonConverter.from_json(self.first, EntitySeed)
        elif isinstance(first, dict) and EdgeSeed.CLASS in first:
            self.first = first[EdgeSeed.CLASS]
            if isinstance(self.first, dict):
                self.first = JsonConverter.from_json(self.first, EdgeSeed)
        else:
            self.first = EntitySeed(first)

        if isinstance(second, ElementSeed):
            self.second = second
        elif isinstance(second, dict) and 'class' in second:
            self.second = JsonConverter.from_json(second)
        elif isinstance(second, dict) and EntitySeed.CLASS in second:
            self.second = second[EntitySeed.CLASS]
            if isinstance(self.second, dict):
                self.second = JsonConverter.from_json(self.second, EntitySeed)
        elif isinstance(second, dict) and EdgeSeed.CLASS in second:
            self.second = second[EdgeSeed.CLASS]
            if isinstance(self.second, dict):
                self.second = JsonConverter.from_json(self.second, EdgeSeed)
        else:
            self.second = EntitySeed(second)

    def to_json(self):
        return {
            'class': self.CLASS,
            'first': self.first.to_json_wrapped(),
            'second': self.second.to_json_wrapped()
        }


class Element(ToJson, ToCodeString):
    def __init__(self, _class_name, group, properties=None):
        super().__init__()
        if not isinstance(_class_name, str):
            raise TypeError('ClassName must be a class name string')
        if not isinstance(group, str):
            raise TypeError('Group must be a string')
        if not isinstance(properties, dict) and properties is not None:
            raise TypeError('properties must be a dictionary or None')
        self._class_name = _class_name
        self.group = group
        self.properties = properties

    def to_json(self):
        element = {'class': self._class_name, 'group': self.group}
        if self.properties is not None:
            element['properties'] = self.properties
        return element


class Entity(Element):
    CLASS = 'uk.gov.gchq.gaffer.data.element.Entity'

    def __init__(self, group, vertex, properties=None):
        super().__init__(self.CLASS, group,
                         properties)
        self.vertex = vertex

    def to_json(self):
        entity = super().to_json()
        entity['vertex'] = self.vertex
        return entity


class Edge(Element):
    CLASS = 'uk.gov.gchq.gaffer.data.element.Edge'

    def __init__(self, group, source, destination, directed, properties=None,
                 matched_vertex=None):
        super().__init__(self.CLASS, group,
                         properties)
        # Validate the arguments
        if not isinstance(directed, bool):
            raise TypeError('Directed must be a boolean')
        self.source = source
        self.destination = destination
        self.directed = directed
        self.matched_vertex = matched_vertex

    def to_json(self):
        edge = super().to_json()
        edge['source'] = self.source
        edge['destination'] = self.destination
        edge['directed'] = self.directed
        if self.matched_vertex is not None:
            edge['matchedVertex'] = self.matched_vertex

        return edge


class JsonConverter:
    GENERIC_JSON_CONVERTERS = {}
    CUSTOM_JSON_CONVERTERS = {}

    @staticmethod
    def to_snake_case(name):
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

    @staticmethod
    def object_decoder(obj, class_name=None):
        if class_name is None:
            if 'class' in obj:
                class_name = obj.get('class')
            else:
                return obj

        custom_json_converter = JsonConverter.CUSTOM_JSON_CONVERTERS.get(
            class_name)
        generic_json_converter = JsonConverter.GENERIC_JSON_CONVERTERS.get(
            class_name)
        if custom_json_converter is not None or generic_json_converter is not None:
            mapped_obj = {}
            for key, value in obj.items():
                mapped_obj[JsonConverter.to_snake_case(key)] = value
            if custom_json_converter is not None:
                obj = custom_json_converter(mapped_obj)
            else:
                mapped_obj.pop('class', None)
                obj = generic_json_converter(mapped_obj)

        return obj

    @staticmethod
    def from_json(json_obj, class_obj=None, class_name=None, validate=False):
        if json_obj is None:
            return None

        if class_obj is not None:
            if hasattr(class_obj, 'CLASS'):
                class_name = class_obj.CLASS

        if class_name is not None:
            if isinstance(json_obj, str):
                json_obj = json.loads(json_obj)
            if isinstance(json_obj, list):
                obj = []
                for item in json_obj:
                    if class_obj is None or \
                            (not isinstance(item, class_obj)):
                        item = JsonConverter.object_decoder(
                            item, class_name)
                    obj.append(item)
            else:
                obj = JsonConverter.object_decoder(
                    json_obj, class_name)
        else:
            json_obj_str = json_obj
            if not isinstance(json_obj_str, str):
                json_obj_str = json.dumps(json_obj_str)
            obj = json.loads(json_obj_str,
                             object_hook=JsonConverter.object_decoder)

        if validate:
            if isinstance(obj, ToJson):
                if isinstance(json_obj, str):
                    json_obj = json.loads(json_obj)
                elif isinstance(json_obj, ToJson):
                    json_obj = json_obj.to_json()

                if not isinstance(obj, ToJson):
                    if not isinstance(json_obj, str):
                        json_obj = json.dumps(json_obj)
                    raise TypeError(
                        'Json object could not be deserialised correctly: \n' + json_obj)
                if json_obj != obj.to_json():
                    raise TypeError(
                        'Json object could not be deserialised correctly: \n'
                        'Original: \n'
                        + json.dumps(json_obj)
                        + " \nConverted:\n"
                        + json.dumps(obj.to_json()))
            else:
                if not isinstance(json_obj, str):
                    json_obj = json.dumps(json_obj)
                raise TypeError(
                    'Json object could not be deserialised correctly: \n' + json_obj)

        return obj


def load_core_json_map():
    for name, class_obj in inspect.getmembers(
            sys.modules[__name__], inspect.isclass):
        if hasattr(class_obj, 'CLASS'):
            JsonConverter.GENERIC_JSON_CONVERTERS[class_obj.CLASS] = \
                lambda obj, class_obj=class_obj: class_obj(**obj)


load_core_json_map()
