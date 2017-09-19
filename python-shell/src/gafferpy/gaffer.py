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

import inspect
import json
import re

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

    def __str__(self):
        return str(self.to_json())

    def __eq__(self, other):
        return self.to_json() == other.to_json()


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


class ResultConverter:
    @staticmethod
    def to_gaffer_objects(result):
        objs = result
        if result is not None and isinstance(result, list):
            objs = []
            for result_item in result:
                if 'class' in result_item:
                    if result_item[
                        'class'] == Entity.CLASS:
                        element = Entity(result_item['group'],
                                         result_item['vertex'])
                        if 'properties' in result_item:
                            element.properties = result_item['properties']
                        objs.append(element)
                    elif result_item[
                        'class'] == Edge.CLASS:
                        element = Edge(result_item['group'],
                                       result_item['source'],
                                       result_item['destination'],
                                       result_item['directed'])
                        if 'properties' in result_item:
                            element.properties = result_item['properties']
                        if 'matchedVertex' in result_item:
                            element.matched_vertex = result_item[
                                'matchedVertex']
                        objs.append(element)
                    elif result_item[
                        'class'] == EntitySeed.CLASS:
                        objs.append(EntitySeed(result_item['vertex']))
                    elif result_item[
                        'class'] == EdgeSeed.CLASS:
                        seed = EdgeSeed(result_item['source'],
                                        result_item['destination'],
                                        result_item['directed'])
                        if 'matchedVertex' in result_item:
                            seed.matched_vertex = result_item['matchedVertex']
                        objs.append(seed)
                    else:
                        raise TypeError(
                            'Element type is not recognised: ' + str(
                                result_item))
                elif 'vertex' in result_item:
                    objs.append(EntitySeed(result_item['vertex']))
                else:
                    objs.append(result_item)

        # Return the input
        return objs


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


class View(ToJson, ToCodeString):
    CLASS = 'uk.gov.gchq.gaffer.data.elementdefinition.view.View'

    def __init__(self, entities=None, edges=None, global_elements=None,
                 global_entities=None, global_edges=None):
        super().__init__()
        self.entities = None
        self.edges = None
        self.global_elements = None
        self.global_entities = None
        self.global_edges = None

        if entities is not None:
            self.entities = []
            if isinstance(entities, list):
                for el_def in entities:
                    if not isinstance(el_def, ElementDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, ElementDefinition)
                    self.entities.append(el_def)
            else:
                for group, el_def in entities.items():
                    if not isinstance(el_def, ElementDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, ElementDefinition)
                    el_def.group = group
                    self.entities.append(el_def)

        if edges is not None:
            self.edges = []
            if isinstance(edges, list):
                for el_def in edges:
                    if not isinstance(el_def, ElementDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, ElementDefinition)
                    self.edges.append(el_def)
            else:
                for group, el_def in edges.items():
                    if not isinstance(el_def, ElementDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, ElementDefinition)
                    el_def.group = group
                    self.edges.append(el_def)

        if global_elements is not None:
            self.global_elements = []
            if isinstance(global_elements, list):
                for el_def in global_elements:
                    if not isinstance(el_def, GlobalElementDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, GlobalElementDefinition)
                    self.global_elements.append(el_def)
            else:
                for group, el_def in global_elements.items():
                    if not isinstance(el_def, GlobalElementDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, GlobalElementDefinition)
                    self.global_elements.append(el_def)

        if global_entities is not None:
            self.global_entities = []
            if isinstance(global_entities, list):
                for el_def in global_entities:
                    if not isinstance(el_def, GlobalElementDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, GlobalElementDefinition)
                    self.global_entities.append(el_def)
            else:
                for group, el_def in global_entities.items():
                    if not isinstance(el_def, GlobalElementDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, GlobalElementDefinition)
                    self.global_entities.append(el_def)

        if global_edges is not None:
            self.global_edges = []
            if isinstance(global_edges, list):
                for el_def in global_edges:
                    if not isinstance(el_def, GlobalElementDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, GlobalElementDefinition)
                    self.global_edges.append(el_def)
            else:
                for group, el_def in global_edges.items():
                    if not isinstance(el_def, GlobalElementDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, GlobalElementDefinition)
                    self.global_edges.append(el_def)

    def to_json(self):
        view = {}
        if self.entities is not None:
            el_defs = {}
            for el_def in self.entities:
                el_defs[el_def.group] = el_def.to_json()
            view['entities'] = el_defs
        if self.edges is not None:
            el_defs = {}
            for el_def in self.edges:
                el_defs[el_def.group] = el_def.to_json()
            view['edges'] = el_defs

        if self.global_elements is not None:
            el_defs = []
            for el_def in self.global_elements:
                el_defs.append(el_def.to_json())
            view['globalElements'] = el_defs

        if self.global_entities is not None:
            el_defs = []
            for el_def in self.global_entities:
                el_defs.append(el_def.to_json())
            view['globalEntities'] = el_defs

        if self.global_edges is not None:
            el_defs = []
            for el_def in self.global_edges:
                el_defs.append(el_def.to_json())
            view['globalEdges'] = el_defs

        return view


class ElementDefinition(ToJson, ToCodeString):
    CLASS = 'uk.gov.gchq.gaffer.data.elementdefinition.view.ViewElementDefinition'

    def __init__(self, group='',
                 transient_properties=None,
                 group_by=None,
                 pre_aggregation_filter_functions=None,
                 post_aggregation_filter_functions=None,
                 transform_functions=None,
                 post_transform_filter_functions=None,
                 properties=None,
                 exclude_properties=None):
        super().__init__()
        self.group = group

        if transient_properties is None:
            self.transient_properties = None
        else:
            self.transient_properties = {}
            if isinstance(transient_properties, list):
                for prop in transient_properties:
                    if not isinstance(prop, Property):
                        prop = JsonConverter.from_json(prop, Property)
                    self.transient_properties[prop.name] = prop.class_name
            else:
                for propName, propClass in transient_properties.items():
                    self.transient_properties[propName] = propClass

        self.pre_aggregation_filter_functions = JsonConverter.from_json(
            pre_aggregation_filter_functions, PredicateContext)

        self.post_aggregation_filter_functions = JsonConverter.from_json(
            post_aggregation_filter_functions, PredicateContext)

        self.transform_functions = JsonConverter.from_json(
            transform_functions, FunctionContext)

        self.post_transform_filter_functions = JsonConverter.from_json(
            post_transform_filter_functions, PredicateContext)

        self.group_by = group_by
        self.properties = properties
        self.exclude_properties = exclude_properties

    def to_json(self):
        element_def = {}
        if self.transient_properties is not None:
            element_def['transientProperties'] = self.transient_properties
        if self.pre_aggregation_filter_functions is not None:
            funcs = []
            for func in self.pre_aggregation_filter_functions:
                funcs.append(func.to_json())
            element_def['preAggregationFilterFunctions'] = funcs
        if self.post_aggregation_filter_functions is not None:
            funcs = []
            for func in self.post_aggregation_filter_functions:
                funcs.append(func.to_json())
            element_def['postAggregationFilterFunctions'] = funcs
        if self.transform_functions is not None:
            funcs = []
            for func in self.transform_functions:
                funcs.append(func.to_json())
            element_def['transformFunctions'] = funcs
        if self.post_transform_filter_functions is not None:
            funcs = []
            for func in self.post_transform_filter_functions:
                funcs.append(func.to_json())
            element_def['postTransformFilterFunctions'] = funcs
        if self.group_by is not None:
            element_def['groupBy'] = self.group_by
        if self.properties is not None:
            element_def['properties'] = self.properties
        if self.exclude_properties is not None:
            element_def['excludeProperties'] = self.exclude_properties
        return element_def


class GlobalElementDefinition(ToJson, ToCodeString):
    CLASS = 'uk.gov.gchq.gaffer.data.elementdefinition.view.GlobalViewElementDefinition'

    def __init__(self,
                 transient_properties=None,
                 group_by=None,
                 pre_aggregation_filter_functions=None,
                 post_aggregation_filter_functions=None,
                 transform_functions=None,
                 post_transform_filter_functions=None,
                 properties=None,
                 exclude_properties=None):
        super().__init__()

        if transient_properties is None:
            self.transient_properties = None
        else:
            self.transient_properties = {}
            if isinstance(transient_properties, list):
                for prop in transient_properties:
                    if not isinstance(prop, Property):
                        prop = JsonConverter.from_json(prop, Property)
                    self.transient_properties[prop.name] = prop.class_name
            else:
                for propName, propClass in transient_properties.items():
                    self.transient_properties[propName] = propClass

        self.pre_aggregation_filter_functions = JsonConverter.from_json(
            pre_aggregation_filter_functions, Predicate)

        self.post_aggregation_filter_functions = JsonConverter.from_json(
            post_aggregation_filter_functions, Predicate)

        self.transform_functions = JsonConverter.from_json(
            transform_functions, FunctionContext)

        self.post_transform_filter_functions = JsonConverter.from_json(
            post_transform_filter_functions, Predicate)

        self.group_by = group_by

        self.properties = properties
        self.exclude_properties = exclude_properties

    def to_json(self):
        element_def = {}
        if self.transient_properties is not None:
            element_def['transientProperties'] = self.transient_properties
        if self.pre_aggregation_filter_functions is not None:
            funcs = []
            for func in self.pre_aggregation_filter_functions:
                funcs.append(func.to_json())
            element_def['preAggregationFilterFunctions'] = funcs
        if self.post_aggregation_filter_functions is not None:
            funcs = []
            for func in self.post_aggregation_filter_functions:
                funcs.append(func.to_json())
            element_def['postAggregationFilterFunctions'] = funcs
        if self.transform_functions is not None:
            funcs = []
            for func in self.transform_functions:
                funcs.append(func.to_json())
            element_def['transformFunctions'] = funcs
        if self.post_transform_filter_functions is not None:
            funcs = []
            for func in self.post_transform_filter_functions:
                funcs.append(func.to_json())
            element_def['postTransformFilterFunctions'] = funcs
        if self.group_by is not None:
            element_def['groupBy'] = self.group_by
        if self.properties is not None:
            element_def['properties'] = self.properties
        if self.exclude_properties is not None:
            element_def['excludeProperties'] = self.exclude_properties
        return element_def


class Property(ToJson, ToCodeString):
    CLASS = "uk.gov.gchq.gaffer.data.element.Property"

    def __init__(self, name, class_name):
        super().__init__()
        if not isinstance(name, str):
            raise TypeError('Name must be a string')
        if not isinstance(class_name, str):
            raise TypeError('ClassName must be a class name string')
        self.name = name
        self.class_name = class_name

    def to_json(self):
        return {self.name: self.class_name}


########################################################
#             Predicates and Functions                 #
########################################################


class PredicateContext(ToJson, ToCodeString):
    CLASS = "gaffer.PredicateContext"

    def __init__(self, selection=None, predicate=None):
        self.selection = selection
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


class FunctionContext(ToJson, ToCodeString):
    CLASS = "gaffer.FunctionContext"

    def __init__(self, selection=None, function=None, projection=None):
        self.selection = selection
        self.function = function
        self.projection = projection

    def to_json(self):
        function_json = {}
        if self.selection is not None:
            function_json['selection'] = self.selection
        if self.function is not None:
            function_json['function'] = self.function.to_json()
        if self.projection is not None:
            function_json['projection'] = self.projection

        return function_json


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


class ElementGenerator(ToJson, ToCodeString):
    CLASS = 'uk.gov.gchq.gaffer.data.generator.ElementGenerator'

    def __init__(self,
                 class_name,
                 fields=None):
        super().__init__()
        self.class_name = class_name
        if fields is not None and 'class' in fields:
            fields = dict(fields)
            fields.pop('class', None)
        self.fields = fields

    def to_json(self):
        if self.fields is None:
            json_str = {}
        else:
            json_str = dict(self.fields)
        json_str['class'] = self.class_name
        return json_str


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


class NamedOperationParameter(ToJson, ToCodeString):
    CLASS = 'gaffer.NamedOperationParameter'

    def __init__(self,
                 name,
                 value_class,
                 description=None,
                 default_value=None,
                 required=False):
        self.name = name
        self.value_class = value_class
        self.description = description
        self.default_value = default_value
        self.required = required

    def get_detail(self):
        detail = {
            "valueClass": self.value_class,
            "required": self.required
        }
        if self.description is not None:
            detail['description'] = self.description
        if self.default_value is not None:
            detail['defaultValue'] = self.default_value
        return detail

    def to_json(self):
        return {
            "description": self.description,
            "defaultValue": self.default_value,
            "valueClass": self.value_class,
            "required": self.required
        }


########################################################
#                    Operations                        #
########################################################


class OperationChain(ToJson, ToCodeString):
    CLASS = "uk.gov.gchq.gaffer.operation.OperationChain"

    def __init__(self, operations):
        self._class_name = self.CLASS
        self.operations = operations

    def to_json(self):
        operation_chain_json = {'class': self._class_name}
        operations_json = []
        for operation in self.operations:
            if isinstance(operation, Operation):
                operations_json.append(operation.to_json())
            else:
                operations_json.append(operation)
        operation_chain_json['operations'] = operations_json
        return operation_chain_json


class OperationChainDAO(OperationChain):
    CLASS = "uk.gov.gchq.gaffer.operation.OperationChainDAO"

    def __init__(self, operations):
        super().__init__(operations=operations)

    def to_json(self):
        operation_chain_json = super().to_json()
        operation_chain_json.pop('class', None)
        return operation_chain_json


class Operation(ToJson, ToCodeString):
    def __init__(self,
                 _class_name,
                 view=None,
                 options=None):
        self._class_name = _class_name
        if isinstance(view, dict):
            view = JsonConverter.from_json(view, View)
        self.view = view
        self.options = options

    def to_json(self):
        operation = {'class': self._class_name}
        if self.options is not None:
            operation['options'] = self.options
        if self.view is not None:
            operation['view'] = self.view.to_json()

        return operation


class AddElements(Operation):
    """
    This class defines a Gaffer Add Operation.
    """

    CLASS = 'uk.gov.gchq.gaffer.operation.impl.add.AddElements'

    def __init__(self,
                 input=None,
                 skip_invalid_elements=None,
                 validate=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            options=options)
        self.input = input
        self.skip_invalid_elements = skip_invalid_elements
        self.validate = validate

    def to_json(self):
        operation = super().to_json()
        if self.skip_invalid_elements is not None:
            operation['skipInvalidElements'] = self.skip_invalid_elements
        if self.validate is not None:
            operation['validate'] = self.validate
        if self.input is not None:
            elements_json = []
            for element in self.input:
                elements_json.append(element.to_json())
            operation['input'] = elements_json
        return operation


class GenerateElements(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.generate.GenerateElements'

    def __init__(self,
                 element_generator,
                 input=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            options=options)
        if not isinstance(element_generator, ElementGenerator):
            element_generator = ElementGenerator(element_generator['class'],
                                                 element_generator)
        self.element_generator = element_generator
        self.input = input

    def to_json(self):
        operation = super().to_json()

        if self.input is not None:
            input_json = []
            for item in self.input:
                if isinstance(item, ToJson):
                    input_json.append(item.to_json())
                else:
                    input_json.append(item)
            operation['input'] = input_json

        operation['elementGenerator'] = self.element_generator.to_json()
        return operation


class GenerateObjects(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.generate.GenerateObjects'

    def __init__(self,
                 element_generator,
                 input=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            options=options)
        if not isinstance(element_generator, ElementGenerator):
            element_generator = ElementGenerator(element_generator['class'],
                                                 element_generator)
        self.element_generator = element_generator
        self.input = input

    def to_json(self):
        operation = super().to_json()

        if self.input is not None:
            elements_json = []
            for element in self.input:
                if isinstance(element, ToJson):
                    elements_json.append(element.to_json())
                else:
                    elements_json.append(element)
            operation['input'] = elements_json

        operation['elementGenerator'] = self.element_generator.to_json()
        return operation


class Validate(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.Validate'

    def __init__(self,
                 validate,
                 skip_invalid_elements=True):
        super().__init__(
            _class_name=self.CLASS)

        self.validate = validate
        self.skip_invalid_elements = skip_invalid_elements

    def to_json(self):
        operation = super().to_json()

        operation['validate'] = self.validate
        operation['skipInvalidElements'] = self.skip_invalid_elements
        return operation


class ExportToGafferResultCache(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.export.resultcache.ExportToGafferResultCache'

    def __init__(self,
                 key=None,
                 op_auths=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            view=None,
            options=options)
        if not isinstance(key, str) and key is not None:
            raise TypeError('key must be a string')
        self.key = key
        self.op_auths = op_auths

    def to_json(self):
        operation = super().to_json()

        if self.key is not None:
            operation['key'] = self.key

        if self.op_auths is not None:
            operation['opAuths'] = self.op_auths
        return operation


class GetGafferResultCacheExport(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.export.resultcache.GetGafferResultCacheExport'

    def __init__(self,
                 job_id=None,
                 key=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            view=None,
            options=options)
        self.job_id = job_id
        self.key = key

    def to_json(self):
        operation = super().to_json()

        if self.job_id is not None:
            operation['jobId'] = self.job_id
        if self.key is not None:
            operation['key'] = self.key
        return operation


class ExportToSet(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.export.set.ExportToSet'

    def __init__(self, key=None, options=None):
        super().__init__(
            _class_name=self.CLASS,
            view=None,
            options=options)
        if not isinstance(key, str) and key is not None:
            raise TypeError('key must be a string')
        self.key = key

    def to_json(self):
        operation = super().to_json()

        if self.key is not None:
            operation['key'] = self.key

        return operation


class GetSetExport(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.export.set.GetSetExport'

    def __init__(self,
                 job_id=None,
                 key=None,
                 start=None,
                 end=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            view=None,
            options=options)
        self.job_id = job_id
        self.key = key
        self.start = start
        self.end = end

    def to_json(self):
        operation = super().to_json()

        if self.job_id is not None:
            operation['jobId'] = self.job_id
        if self.key is not None:
            operation['key'] = self.key
        if self.start is not None:
            operation['start'] = self.start
        if self.end is not None:
            operation['end'] = self.end

        return operation


class GetExports(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.export.GetExports'

    def __init__(self,
                 get_exports=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            view=None,
            options=options)
        self.get_exports = []
        for export in get_exports:
            if not isinstance(export, Operation):
                export = JsonConverter.from_json(export)
            self.get_exports.append(export)

    def to_json(self):
        operation = super().to_json()

        if self.get_exports is not None:
            exports = []
            for export in self.get_exports:
                exports.append(export.to_json())
            operation['getExports'] = exports

        return operation


class GetJobDetails(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.job.GetJobDetails'

    def __init__(self,
                 job_id=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            view=None,
            options=options)
        self.job_id = job_id

    def to_json(self):
        operation = super().to_json()

        if self.job_id is not None:
            operation['jobId'] = self.job_id

        return operation


class GetAllJobDetails(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.job.GetAllJobDetails'

    def __init__(self, options=None):
        super().__init__(
            _class_name=self.CLASS,
            view=None,
            options=options)

    def to_json(self):
        operation = super().to_json()

        return operation


class GetJobResults(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.job.GetJobResults'

    def __init__(self, job_id, options=None):
        super().__init__(
            _class_name=self.CLASS,
            view=None,
            options=options)
        self.job_id = job_id

    def to_json(self):
        operation = super().to_json()
        operation['jobId'] = self.job_id
        return operation


class GetOperation(Operation):
    def __init__(self,
                 _class_name,
                 input=None,
                 view=None,
                 directed_type=None,
                 include_incoming_out_going=None,
                 seed_matching_type=None,
                 options=None):
        super().__init__(
            _class_name=_class_name,
            view=view,
            options=options)

        if not isinstance(_class_name, str):
            raise TypeError(
                'ClassName must be the operation class name as a string')

        self.input = input
        self.directed_type = directed_type
        self.include_incoming_out_going = include_incoming_out_going
        self.seed_matching_type = seed_matching_type

    def to_json(self):
        operation = super().to_json()

        if self.input is not None:
            json_seeds = []
            for seed in self.input:
                if isinstance(seed, ElementSeed):
                    json_seeds.append(seed.to_json())
                else:
                    json_seeds.append(EntitySeed(seed).to_json())
            operation['input'] = json_seeds

        if self.seed_matching_type is not None:
            operation['seedMatching'] = self.seed_matching_type
        if self.directed_type is not None:
            operation['directedType'] = self.directed_type
        if self.include_incoming_out_going is not None:
            operation[
                'includeIncomingOutGoing'] = self.include_incoming_out_going
        return operation


class GetElements(GetOperation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.get.GetElements'

    def __init__(self,
                 input=None,
                 view=None,
                 directed_type=None,
                 include_incoming_out_going=None,
                 seed_matching_type=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            input=input,
            view=view,
            directed_type=directed_type,
            include_incoming_out_going=include_incoming_out_going,
            seed_matching_type=seed_matching_type,
            options=options)


class GetAdjacentIds(GetOperation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds'

    def __init__(self,
                 input=None,
                 view=None,
                 include_incoming_out_going=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            input=input,
            view=view,
            directed_type=None,
            include_incoming_out_going=include_incoming_out_going,
            seed_matching_type=None,
            options=options)


class GetAllElements(GetOperation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.get.GetAllElements'

    def __init__(self,
                 view=None,
                 directed_type=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            input=None,
            view=view,
            directed_type=directed_type,
            include_incoming_out_going=None,
            options=options)


class NamedOperation(GetOperation):
    CLASS = 'uk.gov.gchq.gaffer.named.operation.NamedOperation'

    def __init__(self,
                 operation_name,
                 input=None,
                 view=None,
                 parameters=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            input=input,
            view=view,
            directed_type=None,
            include_incoming_out_going=None,
            seed_matching_type=None,
            options=options)
        self.operation_name = operation_name
        self.parameters = parameters;

    def to_json(self):
        operation = super().to_json()
        operation['operationName'] = self.operation_name
        if self.parameters is not None:
            operation['parameters'] = self.parameters
        return operation


class AddNamedOperation(Operation):
    CLASS = 'uk.gov.gchq.gaffer.named.operation.AddNamedOperation'

    def __init__(self,
                 operation_chain,
                 operation_name,
                 description=None,
                 read_access_roles=None,
                 write_access_roles=None,
                 overwrite_flag=None,
                 parameters=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            options=options)
        if isinstance(operation_chain, OperationChain):
            if not isinstance(operation_chain, OperationChainDAO):
                operation_chain = OperationChainDAO(
                    operations=operation_chain.operations)
            self.operation_chain = operation_chain
        else:
            operations = []
            ops = operation_chain
            if isinstance(ops, dict):
                ops = ops['operations']
            if not isinstance(ops, list):
                raise TypeError('Operation chain type was not recognised')
            for op in ops:
                if not isinstance(op, Operation):
                    op = JsonConverter.from_json(op)
                operations.append(op)
            self.operation_chain = OperationChainDAO(operations=operations)
        self.operation_name = operation_name
        self.description = description
        self.read_access_roles = read_access_roles
        self.write_access_roles = write_access_roles
        self.overwrite_flag = overwrite_flag

        self.parameters = None
        if parameters is not None:
            self.parameters = []
            if isinstance(parameters, list):
                for param in parameters:
                    if not isinstance(param, NamedOperationParameter):
                        param = JsonConverter.from_json(param,
                                                        NamedOperationParameter)
                    self.parameters.append(param)
            else:
                for name, param in parameters.items():
                    param = dict(param)
                    param['name'] = name
                    param = JsonConverter.from_json(param,
                                                    NamedOperationParameter)
                    self.parameters.append(param)

    def to_json(self):
        operation = super().to_json()
        if isinstance(self.operation_chain, OperationChain):
            operation['operationChain'] = self.operation_chain.to_json()
        else:
            operation['operationChain'] = self.operation_chain
        operation['operationName'] = self.operation_name
        if self.overwrite_flag is not None:
            operation['overwriteFlag'] = self.overwrite_flag
        if self.description is not None:
            operation['description'] = self.description
        if self.read_access_roles is not None:
            operation['readAccessRoles'] = self.read_access_roles
        if self.write_access_roles is not None:
            operation['writeAccessRoles'] = self.write_access_roles
        if self.parameters is not None:
            operation['parameters'] = {}
            for param in self.parameters:
                operation['parameters'][param.name] = param.get_detail()

        return operation


class DeleteNamedOperation(Operation):
    CLASS = 'uk.gov.gchq.gaffer.named.operation.DeleteNamedOperation'

    def __init__(self, operation_name, options=None):
        super().__init__(
            _class_name=self.CLASS,
            options=options)
        self.operation_name = operation_name

    def to_json(self):
        operation = super().to_json()
        operation['operationName'] = self.operation_name
        return operation


class GetAllNamedOperations(Operation):
    CLASS = 'uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations'

    def __init__(self, options=None):
        super().__init__(
            _class_name=self.CLASS,
            options=options)


class DiscardOutput(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.DiscardOutput'

    def __init__(self):
        super().__init__(
            _class_name=self.CLASS)


class Count(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.Count'

    def __init__(self):
        super().__init__(
            _class_name=self.CLASS
        )


class CountGroups(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.CountGroups'

    def __init__(self, limit=None, options=None):
        super().__init__(
            _class_name=self.CLASS,
            view=None,
            options=options)
        self.limit = limit

    def to_json(self):
        operation = super().to_json()

        if self.limit is not None:
            operation['limit'] = self.limit

        return operation


class Limit(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.Limit'

    def __init__(self, result_limit, truncate=None):
        super().__init__(_class_name=self.CLASS)
        self.result_limit = result_limit
        self.truncate = truncate

    def to_json(self):
        operation = super().to_json()
        operation['resultLimit'] = self.result_limit
        if self.truncate is not None:
            operation['truncate'] = self.truncate

        return operation


class ToSet(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToSet'

    def __init__(self):
        super().__init__(
            _class_name=self.CLASS)


class ToArray(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToArray'

    def __init__(self):
        super().__init__(
            _class_name=self.CLASS)


class ToEntitySeeds(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToEntitySeeds'

    def __init__(self):
        super().__init__(
            _class_name=self.CLASS)


class ToList(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToList'

    def __init__(self):
        super().__init__(
            _class_name=self.CLASS)


class ToStream(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToStream'

    def __init__(self):
        super().__init__(
            _class_name=self.CLASS)


class ToVertices(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToVertices'

    def __init__(self, edge_vertices=None, use_matched_vertex=None):
        super().__init__(
            _class_name=self.CLASS)
        self.edge_vertices = edge_vertices
        self.use_matched_vertex = use_matched_vertex;

    def to_json(self):
        operation = super().to_json()

        if self.edge_vertices is not None:
            operation['edgeVertices'] = self.edge_vertices

        if self.use_matched_vertex is not None:
            operation['useMatchedVertex'] = self.use_matched_vertex

        return operation


class ToCsv(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToCsv'

    def __init__(self,
                 element_generator,
                 include_header=True):
        super().__init__(
            _class_name=self.CLASS
        )
        if not isinstance(element_generator, ElementGenerator):
            element_generator = ElementGenerator(element_generator['class'],
                                                 element_generator)
        self.element_generator = element_generator
        self.include_header = include_header

    def to_json(self):
        operation = super().to_json()

        operation['elementGenerator'] = self.element_generator.to_json()
        operation['includeHeader'] = self.include_header

        return operation


class ToMapCsv(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToMap'

    def __init__(self,
                 element_generator):
        super().__init__(
            _class_name=self.CLASS
        )

        if not isinstance(element_generator, ElementGenerator):
            element_generator = ElementGenerator(element_generator['class'],
                                                 element_generator)
        self.element_generator = element_generator

    def to_json(self):
        operation = super().to_json()

        operation['elementGenerator'] = self.element_generator.to_json()

        return operation


class Sort(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.compare.Sort'

    def __init__(self, comparators,
                 input=None,
                 result_limit=None,
                 deduplicate=None):
        super().__init__(
            _class_name=self.CLASS
        )
        self.comparators = comparators
        self.input = input
        self.result_limit = result_limit
        self.deduplicate = deduplicate

    def to_json(self):
        operation = super().to_json()

        comparators_json = []
        for comparator in self.comparators:
            if not isinstance(comparator, Comparator):
                raise TypeError(
                    'All comparators must be a Gaffer Comparator object')
            comparators_json.append(comparator.to_json())
        operation['comparators'] = comparators_json

        if self.input is not None:
            elements_json = []
            for element in self.input:
                elements_json.append(element.to_json())
            operation['input'] = elements_json

        if self.result_limit is not None:
            operation['resultLimit'] = self.result_limit

        if self.deduplicate is not None:
            operation['deduplicate'] = self.deduplicate

        return operation


class Max(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.compare.Max'

    def __init__(self, comparators, input=None):
        super().__init__(
            _class_name=self.CLASS
        )
        self.comparators = comparators
        self.input = input

    def to_json(self):
        operation = super().to_json()

        comparators_json = []
        for comparator in self.comparators:
            if not isinstance(comparator, Comparator):
                raise TypeError(
                    'All comparators must be a Gaffer Comparator object')
            comparators_json.append(comparator.to_json())
        operation['comparators'] = comparators_json

        if self.input is not None:
            elements_json = []
            for element in self.input:
                elements_json.append(element.to_json())
            operation['input'] = elements_json

        return operation


class Min(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.compare.Min'

    def __init__(self, comparators, input=None):
        super().__init__(
            _class_name=self.CLASS
        )
        self.comparators = comparators
        self.input = input

    def to_json(self):
        operation = super().to_json()

        comparators_json = []
        for comparator in self.comparators:
            if not isinstance(comparator, Comparator):
                raise TypeError(
                    'All comparators must be a Gaffer Comparator object')
            comparators_json.append(comparator.to_json())
        operation['comparators'] = comparators_json

        if self.input is not None:
            elements_json = []
            for element in self.input:
                elements_json.append(element.to_json())
            operation['input'] = elements_json

        return operation


class ExportToOtherGraph(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherGraph'

    def __init__(self, graph_id=None, input=None, parent_schema_ids=None,
                 schema=None, parent_store_properties_id=None,
                 store_properties=None):
        super().__init__(
            self.CLASS
        )

        self.graph_id = graph_id
        self.input = input
        self.parent_schema_ids = parent_schema_ids
        self.schema = schema
        self.parent_store_properties_id = parent_store_properties_id
        self.store_properties = store_properties

    def to_json(self):
        operation = super().to_json()

        if self.graph_id is not None:
            operation['graphId'] = self.graph_id

        if self.input is not None:
            elements_json = []
            for element in self.input:
                elements_json.append(element.to_json())
            operation['input'] = elements_json

        if self.parent_schema_ids is not None:
            operation['parentSchemaIds'] = self.parent_schema_ids

        if self.schema is not None:
            operation['schema'] = self.schema

        if self.parent_store_properties_id is not None:
            operation[
                'parentStorePropertiesId'] = self.parent_store_properties_id

        if self.store_properties is not None:
            operation['storeProperties'] = self.store_properties

        return operation


class ExportToOtherAuthorisedGraph(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherAuthorisedGraph'

    def __init__(self, graph_id=None, input=None, parent_schema_ids=None,
                 parent_store_properties_id=None):
        super().__init__(
            self.CLASS
        )

        self.graph_id = graph_id
        self.input = input
        self.parent_schema_ids = parent_schema_ids
        self.parent_store_properties_id = parent_store_properties_id

    def to_json(self):
        operation = super().to_json()

        if self.graph_id is not None:
            operation['graphId'] = self.graph_id

        if self.input is not None:
            elements_json = []
            for element in self.input:
                elements_json.append(element.to_json())
            operation['input'] = elements_json

        if self.parent_schema_ids is not None:
            operation['parentSchemaIds'] = self.parent_schema_ids

        if self.parent_store_properties_id is not None:
            operation[
                'parentStorePropertiesId'] = self.parent_store_properties_id

        return operation


class AddElementsFromSocket(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.add.AddElementsFromSocket'

    def __init__(self, hostname=None, port=None, element_generator=None,
                 parallelism=None, validate=None, skip_invalid_elements=None,
                 delimiter=None, options=None):
        super().__init__(
            self.CLASS,
            options=options
        )

        self.hostname = hostname
        self.port = port
        if not isinstance(element_generator, str):
            raise TypeError('element_generator must be a java class name (str)')
        self.element_generator = element_generator
        self.parallelism = parallelism
        self.validate = validate
        self.skip_invalid_elements = skip_invalid_elements
        self.delimiter = delimiter

    def to_json(self):
        operation = super().to_json()

        if self.hostname is not None:
            operation['hostname'] = self.hostname

        if self.port is not None:
            operation['port'] = self.port

        if self.element_generator is not None:
            operation['elementGenerator'] = self.element_generator

        if self.parallelism is not None:
            operation['parallelism'] = self.parallelism

        if self.validate is not None:
            operation['validate'] = self.validate

        if self.skip_invalid_elements is not None:
            operation['skipInvalidElements'] = self.skip_invalid_elements

        if self.delimiter is not None:
            operation['delimiter'] = self.delimiter

        return operation


class AddElementsFromKafka(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.add.AddElementsFromKafka'

    def __init__(self, topic, group_id, bootstrap_servers, element_generator,
                 parallelism=None, validate=None, skip_invalid_elements=None,
                 options=None):
        super().__init__(
            self.CLASS,
            options=options
        )

        self.topic = topic
        self.group_id = group_id
        self.bootstrap_servers = bootstrap_servers
        if not isinstance(element_generator, str):
            raise TypeError('element_generator must be a java class name (str)')
        self.element_generator = element_generator
        self.parallelism = parallelism
        self.validate = validate
        self.skip_invalid_elements = skip_invalid_elements

    def to_json(self):
        operation = super().to_json()

        if self.topic is not None:
            operation['topic'] = self.topic

        if self.group_id is not None:
            operation['groupId'] = self.group_id

        if self.bootstrap_servers is not None:
            operation['bootstrapServers'] = self.bootstrap_servers

        if self.element_generator is not None:
            operation['elementGenerator'] = self.element_generator

        if self.parallelism is not None:
            operation['parallelism'] = self.parallelism

        if self.validate is not None:
            operation['validate'] = self.validate

        if self.skip_invalid_elements is not None:
            operation['skipInvalidElements'] = self.skip_invalid_elements

        return operation


class AddElementsFromFile(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.add.AddElementsFromFile'

    def __init__(self, filename=None, element_generator=None,
                 parallelism=None, validate=None, skip_invalid_elements=None,
                 options=None):
        super().__init__(
            self.CLASS,
            options=options
        )

        self.filename = filename
        if not isinstance(element_generator, str):
            raise TypeError('element_generator must be a java class name (str)')
        self.element_generator = element_generator
        self.parallelism = parallelism
        self.validate = validate
        self.skip_invalid_elements = skip_invalid_elements

    def to_json(self):
        operation = super().to_json()

        if self.filename is not None:
            operation['filename'] = self.filename

        if self.element_generator is not None:
            operation['elementGenerator'] = self.element_generator

        if self.parallelism is not None:
            operation['parallelism'] = self.parallelism

        if self.validate is not None:
            operation['validate'] = self.validate

        if self.skip_invalid_elements is not None:
            operation['skipInvalidElements'] = self.skip_invalid_elements

        return operation


class GetElementsBetweenSets(GetOperation):
    CLASS = 'uk.gov.gchq.gaffer.accumulostore.operation.impl.GetElementsBetweenSets'

    def __init__(self,
                 input=None,
                 input_b=None,
                 view=None,
                 directed_type=None,
                 include_incoming_out_going=None,
                 seed_matching_type=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            input=input,
            view=view,
            directed_type=directed_type,
            include_incoming_out_going=include_incoming_out_going,
            seed_matching_type=seed_matching_type,
            options=options)
        self.input_b = input_b

    def to_json(self):
        operation = super().to_json()

        if self.input_b is not None:
            json_seeds_b = []
            for seed_b in self.input_b:
                if isinstance(seed_b, ElementSeed):
                    json_seeds_b.append(seed_b.to_json())
                elif isinstance(seed_b, str):
                    json_seeds_b.append(EntitySeed(seed_b).to_json())
                else:
                    raise TypeError(
                        'SeedsB argument must contain ElementSeed objects')
            operation['inputB'] = json_seeds_b
        return operation


class GetElementsWithinSet(GetOperation):
    CLASS = 'uk.gov.gchq.gaffer.accumulostore.operation.impl.GetElementsWithinSet'

    def __init__(self,
                 input=None,
                 view=None,
                 directed_type=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            input=input,
            view=view,
            directed_type=directed_type,
            include_incoming_out_going=None,
            options=options)


class GetElementsInRanges(GetOperation):
    CLASS = 'uk.gov.gchq.gaffer.accumulostore.operation.impl.GetElementsInRanges'

    def __init__(self,
                 input=None,
                 view=None,
                 directed_type=None,
                 include_incoming_out_going=None,
                 seed_matching_type=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            input=None,
            view=view,
            directed_type=directed_type,
            include_incoming_out_going=include_incoming_out_going,
            seed_matching_type=seed_matching_type,
            options=options)
        self.input = input

    def to_json(self):
        operation = super().to_json()

        if self.input is not None:
            json_seed_pairs = []
            for seed_pair in self.input:
                if isinstance(seed_pair, SeedPair):
                    json_seed_pairs.append(seed_pair.to_json())
                else:
                    raise TypeError(
                        'input argument must contain SeedPair objects')
            operation['input'] = json_seed_pairs
        return operation


class SummariseGroupOverRanges(Operation):
    CLASS = 'uk.gov.gchq.gaffer.accumulostore.operation.impl.SummariseGroupOverRanges'

    def __init__(self, input,
                 view=None,
                 include_incoming_out_going=None,
                 directed_type=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            options=options,
            view=view
        )
        self.input = input
        self.include_incoming_out_going = include_incoming_out_going
        self.directed_type = directed_type

    def to_json(self):
        operation = super().to_json()

        if self.input is not None:
            json_seed_pairs = []
            for seed_pair in self.input:
                if isinstance(seed_pair, SeedPair):
                    json_seed_pairs.append(seed_pair.to_json())
                else:
                    raise TypeError(
                        'input argument must contain SeedPair objects')

            operation['input'] = json_seed_pairs
        if self.include_incoming_out_going is not None:
            operation[
                'includeIncomingOutGoing'] = self.include_incoming_out_going

        if self.directed_type is not None:
            operation['directedType'] = self.directed_type

        return operation


class GetGraph:
    def get_url(self):
        return self.url


class GetSchema(GetGraph):
    def __init__(self, url=None):
        self.url = '/graph/config/schema'


class GetFilterFunctions(GetGraph):
    def __init__(self, url=None):
        self.url = '/graph/config/filterFunctions'


class GetClassFilterFunctions(GetGraph):
    def __init__(self, class_name=None, url=None):
        self.url = '/graph/config/filterFunctions/' + class_name


class GetElementGenerators(GetGraph):
    def __init__(self, url=None):
        self.url = '/graph/config/elementGenerators'


class GetObjectGenerators(GetGraph):
    def __init__(self, url=None):
        self.url = '/graph/config/objectGenerators'


class GetOperations(GetGraph):
    def __init__(self, url=None):
        self.url = '/graph/operations'


class GetSerialisedFields(GetGraph):
    def __init__(self, class_name=None, url=None):
        self.url = '/graph/config/serialisedFields/' + class_name


class GetStoreTraits(GetGraph):
    def __init__(self, url=None):
        self.url = '/graph/config/storeTraits'


class IsOperationSupported:
    def __init__(self, operation=None):
        self.operation = operation

    def get_operation(self):
        return self.operation


class JsonConverter:
    GENERIC_JSON_CONVERTERS = {}
    CUSTOM_JSON_CONVERTERS = {}

    for name, class_obj in inspect.getmembers(
            sys.modules[__name__], inspect.isclass):
        if hasattr(class_obj, 'CLASS'):
            GENERIC_JSON_CONVERTERS[class_obj.CLASS] = \
                lambda obj, class_obj=class_obj: class_obj(**obj)

    def predicate_context_converter(obj):
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

    CUSTOM_JSON_CONVERTERS[PredicateContext.CLASS] = predicate_context_converter

    def predicate_converter(obj):
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

    CUSTOM_JSON_CONVERTERS[Predicate.CLASS] = predicate_converter

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

    CUSTOM_JSON_CONVERTERS[FunctionContext.CLASS] = function_context_converter

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

    CUSTOM_JSON_CONVERTERS[Function.CLASS] = function_converter

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
