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

import json


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


class ResultConverter:
    @staticmethod
    def to_elements(result):
        elements = []
        if result is not None and isinstance(result, list):
            for result_item in result:
                if 'class' in result_item:
                    if result_item['class'] == 'gaffer.data.element.Entity':
                        element = Entity(result_item['group'],
                                         result_item['vertex'])
                    elif result_item['class'] == 'gaffer.data.element.Edge':
                        element = Edge(result_item['group'],
                                       result_item['source'],
                                       result_item['destination'],
                                       result_item['directed'])
                    else:
                        raise TypeError(
                            'Element type is not recognised: ' + str(
                                result_item))

                    if 'properties' in result_item:
                        element.properties = result_item['properties']
                    elements.append(element)
                else:
                    raise TypeError(
                        'Element type is not recognised: ' + str(result_item))

        # Return the elements
        return elements

    @staticmethod
    def to_entity_seeds(result):
        entities_seeds = []
        if result is not None and isinstance(result, list):
            for result_item in result:
                entities_seeds.append(EntitySeed(result_item['vertex']))
        return entities_seeds


class ElementSeed(ToJson):
    def __repr__(self):
        return json.dumps(self.to_json())

    def to_json(self):
        raise NotImplementedError('Use either EntitySeed or EdgeSeed')


class EntitySeed(ElementSeed):
    def __init__(self, vertex):
        super().__init__()
        self.vertex = vertex

    def to_json(self):
        return {'class': 'gaffer.operation.data.EntitySeed',
                'vertex': self.vertex}


class EdgeSeed(ElementSeed):
    def __init__(self, source, destination, directed):
        super().__init__()
        self.source = source
        self.destination = destination
        self.directed = directed

    def to_json(self):
        return {
            'class': 'gaffer.operation.data.EdgeSeed',
            'source': self.source,
            'destination': self.destination,
            'directed': self.directed}


class Element(ToJson):
    def __init__(self, class_name, group, properties=None):
        super().__init__()
        if not isinstance(class_name, str):
            raise TypeError('ClassName must be a class name string')
        if not isinstance(group, str):
            raise TypeError('Group must be a string')
        if not isinstance(properties, dict) and properties is not None:
            raise TypeError('properties must be a dictionary or None')
        self.class_name = class_name
        self.group = group
        self.properties = properties

    def to_json(self):
        element = {'class': self.class_name, 'group': self.group}
        if self.properties is not None:
            element['properties'] = self.properties
        return element


class Entity(Element):
    def __init__(self, group, vertex, properties=None):
        super().__init__('gaffer.data.element.Entity', group, properties)
        self.vertex = vertex

    def to_json(self):
        entity = super().to_json()
        entity['vertex'] = self.vertex
        return entity


class Edge(Element):
    def __init__(self, group, source, destination, directed, properties=None):
        super().__init__('gaffer.data.element.Edge', group, properties)
        # Validate the arguments
        if not isinstance(directed, bool):
            raise TypeError('Directed must be a boolean')
        self.source = source
        self.destination = destination
        self.directed = directed

    def to_json(self):
        edge = super().to_json()
        edge['source'] = self.source
        edge['destination'] = self.destination
        edge['directed'] = self.directed
        return edge


class View(ToJson):
    def __init__(self, entities=None, edges=None):
        super().__init__()
        self.entities = entities
        self.edges = edges

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

        return view

class ElementDefinition(ToJson):
    def __init__(self, group, transient_properties=None, filter_functions=None,
                 transform_functions=None, group_by=None):
        super().__init__()
        self.group = group
        self.transient_properties = transient_properties
        self.pre_aggregation_filter_functions = filter_functions
        self.transform_functions = transform_functions
        if group_by is None:
            group_by = []
        self.group_by = group_by

    def to_json(self):
        element_def = {}
        if self.transient_properties is not None:
            props = {}
            for prop in self.transient_properties:
                props[prop.name] = prop.class_name
            element_def['transientProperties'] = props
        if self.pre_aggregation_filter_functions is not None:
            funcs = []
            for func in self.pre_aggregation_filter_functions:
                funcs.append(func.to_json())
            element_def['preAggregationFilterFunctions'] = funcs
        if self.transform_functions is not None:
            funcs = []
            for func in self.transform_functions:
                funcs.append(func.to_json())
            element_def['transformFunctions'] = funcs
        element_def['groupBy'] = self.group_by
        return element_def


class Property(ToJson):
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


class GafferFunction(ToJson):
    def __init__(self, class_name, function_fields=None):
        super().__init__()
        self.class_name = class_name
        self.function_fields = function_fields

    def to_json(self):
        function_context = {}
        function = {'class': self.class_name}
        if self.function_fields is not None:
            for key in self.function_fields:
                function[key] = self.function_fields[key]
        function_context['function'] = function

        return function_context


class FilterFunction(GafferFunction):
    def __init__(self, class_name, selection, function_fields=None):
        super().__init__(class_name, function_fields)
        self.selection = selection

    def to_json(self):
        function_context = super().to_json()
        function_context['selection'] = self.selection

        return function_context


class TransformFunction(GafferFunction):
    def __init__(self, class_name, selection, projection, function_fields=None):
        super().__init__(class_name, function_fields)
        self.selection = selection
        self.projection = projection

    def to_json(self):
        function_context = super().to_json()
        function_context['selection'] = self.selection
        function_context['projection'] = self.projection

        return function_context


class IncludeEdges:
    ALL = 'ALL'
    DIRECTED = 'DIRECTED'
    UNDIRECTED = 'UNDIRECTED'
    NONE = 'NONE'


class InOutType:
    BOTH = 'BOTH'
    IN = 'INCOMING'
    OUT = 'OUTGOING'


class OperationChain(ToJson):
    def __init__(self, operations):
        self.operations = operations

    def to_json(self):
        operations_json = []
        for operation in self.operations:
            operations_json.append(operation.to_json())
        return {'operations': operations_json}


class Operation(ToJson):
    def __init__(self, class_name, view=None, result_limit=None, options=None):
        self.class_name = class_name
        self.view = view
        self.options = options
        self.result_limit = result_limit

    def convert_result(self, result):
        raise NotImplementedError('Use an implementation of Operation instead')

    def to_json(self):
        operation = {'class': self.class_name}
        if self.options is not None:
            operation['options'] = self.options
        if self.view is not None:
            operation['view'] = self.view.to_json()

        return operation


class AddElements(Operation):
    """
    This class defines a Gaffer Add Operation.
    """

    def __init__(self, elements=None, skip_invalid_elements=False,
                 validate=True,
                 view=None, options=None):
        super().__init__('gaffer.operation.impl.add.AddElements', view, options)
        self.elements = elements
        self.skip_invalid_elements = skip_invalid_elements
        self.validate = validate

    def to_json(self):
        operation = super().to_json()
        operation['skipInvalidElements'] = self.skip_invalid_elements
        operation['validate'] = self.validate
        if self.elements is not None:
            elements_json = []
            for element in self.elements:
                elements_json.append(element.to_json())
            operation['elements'] = elements_json
        return operation

    def convert_result(self, result):
        return None


class GenerateElements(Operation):
    def __init__(self, generator_class_name, element_generator_fields=None,
                 objects=None, view=None, options=None):
        super().__init__('gaffer.operation.impl.generate.GenerateElements',
                         view, options)
        self.generator_class_name = generator_class_name
        self.element_generator_fields = element_generator_fields
        self.objects = objects

    def to_json(self):
        operation = super().to_json()

        if self.objects is not None:
            operation['objects'] = self.objects

        element_generator = {'class': self.generator_class_name}
        if self.element_generator_fields is not None:
            for field in self.element_generator_fields:
                element_generator[field.key] = field.value
        operation['elementGenerator'] = element_generator
        return operation

    def convert_result(self, result):
        return ResultConverter.to_elements(result)


class GenerateObjects(Operation):
    def __init__(self, generator_class_name, element_generator_fields=None,
                 elements=None, view=None, options=None):
        super().__init__('gaffer.operation.impl.generate.GenerateObjects', view,
                         options)
        self.generator_class_name = generator_class_name
        self.element_generator_fields = element_generator_fields
        self.elements = elements

    def to_json(self):
        operation = super().to_json()

        if self.elements is not None:
            elements_json = []
            for element in self.elements:
                elements_json.append(element.to_json())
            operation['elements'] = elements_json

        element_generator = {'class': self.generator_class_name}
        if self.element_generator_fields is not None:
            for field in self.element_generator_fields:
                element_generator[field.key] = field.value
        operation['elementGenerator'] = element_generator
        return operation

    def convert_result(self, result):
        return result


class InitialiseSetExport(Operation):
    def __init__(self, key=None, options=None):
        super().__init__(
            'gaffer.operation.impl.export.initialise.InitialiseSetExport',
            None,
            options)
        if not isinstance(key, str) and key is not None:
            raise TypeError('key must be a string')
        self.key = key

    def to_json(self):
        operation = super().to_json()

        if self.key is not None:
            operation['key'] = self.key

        return operation

    def convert_result(self, result):
        return None


class UpdateExport(Operation):
    def __init__(self, key=None, options=None):
        super().__init__('gaffer.operation.impl.export.UpdateExport', None,
                         options)
        if not isinstance(key, str) and key is not None:
            raise TypeError('key must be a string')
        self.key = key

    def to_json(self):
        operation = super().to_json()

        if self.key is not None:
            operation['key'] = self.key

        return operation

    def convert_result(self, result):
        return None


class FetchExporter(Operation):
    def __init__(self, options=None):
        super().__init__('gaffer.operation.impl.export.FetchExporter', None,
                         options)

    def convert_result(self, result):
        return result


class FetchExport(Operation):
    def __init__(self, key=None, options=None):
        super().__init__('gaffer.operation.impl.export.FetchExport', None,
                         options)
        if not isinstance(key, str) and key is not None:
            raise TypeError('key must be a string')
        self.key = key

    def to_json(self):
        operation = super().to_json()

        if self.key is not None:
            operation['key'] = self.key

        return operation

    def convert_result(self, result):
        return result


class GetOperation(Operation):
    def __init__(self, class_name, seeds=None, view=None, result_limit=None,
                 include_entities=True, include_edges=IncludeEdges.ALL,
                 in_out_type=InOutType.BOTH, deduplicate=None, options=None):
        super().__init__(class_name, view, result_limit, options)
        if not isinstance(class_name, str):
            raise TypeError(
                'ClassName must be the operation class name as a string')

        self.seeds = seeds
        self.include_entities = include_entities
        self.include_edges = include_edges
        self.in_out_type = in_out_type
        self.deduplicate = deduplicate

    def convert_result(self, result):
        return ResultConverter.to_elements(result)

    def to_json(self):
        operation = super().to_json()

        if self.seeds is not None:
            json_seeds = []
            for seed in self.seeds:
                if isinstance(seed, ElementSeed):
                    json_seeds.append(seed.to_json())
                elif isinstance(seed, str):
                    json_seeds.append(EntitySeed(seed).to_json())
                else:
                    raise TypeError(
                        'Seeds argument must contain ElementSeed objects')
            operation['seeds'] = json_seeds
        operation['includeEntities'] = self.include_entities
        operation['includeEdges'] = self.include_edges
        operation['includeIncomingOutGoing'] = self.in_out_type

        if self.deduplicate is not None:
            operation['deduplicate'] = self.deduplicate
        return operation


class GetRelatedElements(GetOperation):
    def __init__(self, seeds=None, view=None, result_limit=None,
                 include_entities=True, include_edges=IncludeEdges.ALL,
                 in_out_type=InOutType.BOTH, deduplicate=None, options=None):
        super().__init__('gaffer.operation.impl.get.GetRelatedElements', seeds,
                         view, result_limit, include_entities, include_edges,
                         in_out_type, deduplicate, options)


class GetRelatedEntities(GetOperation):
    def __init__(self, seeds=None, view=None, result_limit=None,
                 in_out_type=InOutType.BOTH, deduplicate=None, options=None):
        super().__init__('gaffer.operation.impl.get.GetRelatedEntities', seeds,
                         view, result_limit, True, IncludeEdges.NONE,
                         in_out_type, deduplicate, options)


class GetRelatedEdges(GetOperation):
    def __init__(self, seeds=None, view=None, result_limit=None,
                 include_edges=IncludeEdges.ALL,
                 in_out_type=InOutType.BOTH, deduplicate=None, options=None):
        super().__init__('gaffer.operation.impl.get.GetRelatedEdges', seeds,
                         view, result_limit, False, include_edges,
                         in_out_type, deduplicate, options)


class GetElementsBySeed(GetOperation):
    def __init__(self, seeds=None, view=None, result_limit=None,
                 include_entities=True, include_edges=IncludeEdges.ALL,
                 in_out_type=InOutType.BOTH, deduplicate=None, options=None):
        super().__init__('gaffer.operation.impl.get.GetElementsBySeed', seeds,
                         view, result_limit, include_entities, include_edges,
                         in_out_type, deduplicate, options)


class GetEntitiesBySeed(GetOperation):
    def __init__(self, seeds=None, view=None, result_limit=None,
                 in_out_type=InOutType.BOTH, deduplicate=None, options=None):
        super().__init__('gaffer.operation.impl.get.GetEntitiesBySeed', seeds,
                         view, result_limit, True, IncludeEdges.NONE,
                         in_out_type, deduplicate, options)


class GetEdgesBySeed(GetOperation):
    def __init__(self, seeds=None, view=None, result_limit=None,
                 include_edges=IncludeEdges.ALL,
                 in_out_type=InOutType.BOTH, deduplicate=None, options=None):
        super().__init__('gaffer.operation.impl.get.GetEntitiesBySeed', seeds,
                         view, result_limit, False, include_edges,
                         in_out_type, deduplicate, options)


class GetAdjacentEntitySeeds(GetOperation):
    def __init__(self, seeds=None, view=None, result_limit=None,
                 in_out_type=InOutType.BOTH, deduplicate=None, options=None):
        super().__init__('gaffer.operation.impl.get.GetAdjacentEntitySeeds',
                         seeds, result_limit, view, True, IncludeEdges.ALL,
                         in_out_type, deduplicate, options)

    def convert_result(self, result):
        return ResultConverter.to_entity_seeds(result)


class GetAllElements(GetOperation):
    def __init__(self, view=None, include_entities=True, result_limit=None,
                 include_edges=IncludeEdges.ALL, deduplicate=None,
                 options=None):
        super().__init__('gaffer.operation.impl.get.GetAllElements',
                         None, view, result_limit, include_entities,
                         include_edges,
                         InOutType.OUT, deduplicate, options)

    def convert_result(self, result):
        return ResultConverter.to_elements(result)


class GetAllEntities(GetOperation):
    def __init__(self, view=None, result_limit=None, deduplicate=None,
                 options=None):
        super().__init__('gaffer.operation.impl.get.GetAllEntities',
                         None, view, result_limit, True, IncludeEdges.NONE,
                         InOutType.OUT, deduplicate, options)

    def convert_result(self, result):
        return ResultConverter.to_elements(result)


class GetAllEdges(GetOperation):
    def __init__(self, result_limit=None, view=None,
                 include_edges=IncludeEdges.ALL, deduplicate=None,
                 options=None):
        super().__init__('gaffer.operation.impl.get.GetAllEdges',
                         None, view, result_limit, False, include_edges,
                         InOutType.OUT, deduplicate, options)

    def convert_result(self, result):
        return ResultConverter.to_elements(result)


class CountGroups(Operation):
    def __init__(self, limit=None, options=None):
        super().__init__('gaffer.operation.impl.CountGroups',
                         None, options)
        self.limit = limit

    def to_json(self):
        operation = super().to_json()

        if self.limit is not None:
            operation['limit'] = self.limit

        return operation

    def convert_result(self, result):
        return result


class GetGraph:
    def get_url(self):
        return self.url


class GetSchema(GetGraph):
    def __init__(self, url=None):
        self.url = '/graph/schema'


class GetFilterFunctions(GetGraph):
    def __init__(self, url=None):
        self.url = '/graph/filterFunctions'


class GetClassFilterFunctions(GetGraph):
    def __init__(self, class_name=None, url=None):
        self.url = '/graph/filterFunctions/' + class_name


class GetGenerators(GetGraph):
    def __init__(self, url=None):
        self.url = '/graph/generators'


class GetOperations(GetGraph):
    def __init__(self, url=None):
        self.url = '/graph/operations'


class GetSerialisedFields(GetGraph):
    def __init__(self, class_name=None, url=None):
        self.url = '/graph/serialisedFields/' + class_name


class GetStoreTraits(GetGraph):
    def __init__(self, url=None):
        self.url = '/graph/storeTraits'


class IsOperationSupported:
    def __init__(self, operation=None):
        self.operation = operation

    def get_operation(self):
        return self.operation
