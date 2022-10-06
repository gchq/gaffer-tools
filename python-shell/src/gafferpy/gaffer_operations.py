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
This module contains Python copies of Gaffer operation java classes
"""

import gafferpy.gaffer_binaryoperators as gaffer_binaryoperators
import gafferpy.gaffer_functions as gaffer_functions
import gafferpy.gaffer_predicates as gaffer_predicates
from gafferpy.gaffer_core import *


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


class NamedViewParameter(ToJson, ToCodeString):
    CLASS = 'gaffer.NamedViewParameter'

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


class View(ToJson, ToCodeString):
    CLASS = 'uk.gov.gchq.gaffer.data.elementdefinition.view.View'

    def __init__(self, entities=None, edges=None, global_elements=None,
                 global_entities=None, global_edges=None, all_edges=False,
                 all_entities=False):
        super().__init__()
        self.entities = None
        self.edges = None
        self.global_elements = None
        self.global_entities = None
        self.global_edges = None
        self.all_edges = all_edges
        self.all_entities = all_entities

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
            elif isinstance(global_elements, GlobalElementDefinition):
                self.global_elements.append(global_elements)
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
            elif isinstance(global_entities, GlobalElementDefinition):
                self.global_entities.append(global_entities)
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
            elif isinstance(global_edges, GlobalElementDefinition):
                self.global_edges.append(global_edges)
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

        if self.all_edges is True:
            view['allEdges'] = True

        if self.all_entities is True:
            view['allEntities'] = True

        return view


class NamedView(View):
    CLASS = 'uk.gov.gchq.gaffer.data.elementdefinition.view.NamedView'

    def __init__(self, name, parameters=None, entities=None, edges=None,
                 global_elements=None,
                 global_entities=None, global_edges=None):
        super().__init__(entities, edges, global_elements, global_entities,
                         global_edges)
        self.name = name
        self.parameters = parameters

    def to_json(self):
        view = super().to_json()
        view['class'] = self.CLASS
        view['name'] = self.name
        if self.parameters is not None:
            view['parameters'] = self.parameters
        return view


class ElementDefinition(ToJson, ToCodeString):
    CLASS = 'uk.gov.gchq.gaffer.data.elementdefinition.view.ViewElementDefinition'

    def __init__(self, group='',
                 transient_properties=None,
                 group_by=None,
                 pre_aggregation_filter_functions=None,
                 aggregate_functions=None,
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
            pre_aggregation_filter_functions,
            gaffer_predicates.PredicateContext)

        self.aggregate_functions = JsonConverter.from_json(
            aggregate_functions, gaffer_predicates.PredicateContext)

        self.post_aggregation_filter_functions = JsonConverter.from_json(
            post_aggregation_filter_functions,
            gaffer_predicates.PredicateContext)

        self.transform_functions = JsonConverter.from_json(
            transform_functions, gaffer_functions.FunctionContext)

        self.post_transform_filter_functions = JsonConverter.from_json(
            post_transform_filter_functions, gaffer_predicates.PredicateContext)

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


class ElementTransformDefinition(ToJson, ToCodeString):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.function.ElementTransformDefinition'

    def __init__(self, group='',
                 functions=None):
        super().__init__()
        self.group = group
        self.functions = JsonConverter.from_json(
            functions, gaffer_functions.FunctionContext)

    def to_json(self):
        element_def = {}
        if self.functions is not None:
            funcs = []
            for func in self.functions:
                funcs.append(func.to_json())
            element_def['functions'] = funcs
        return element_def


class AggregatePair(ToJson, ToCodeString):
    CLASS = 'uk.gov.gchq.gaffer.operation.util.AggregatePair'

    def __init__(self,
                 group=None,
                 group_by=None,
                 element_aggregator=None):
        super().__init__()
        self.group = group
        if group_by is not None and not isinstance(group_by, list):
            group_by = [group_by]
        self.group_by = group_by
        if element_aggregator is not None and not isinstance(
                element_aggregator, ElementAggregateDefinition):
            element_aggregator = ElementAggregateDefinition(
                operators=element_aggregator['operators'])
        self.element_aggregator = element_aggregator

    def to_json(self):
        element_def = {}
        if self.group_by is not None:
            element_def['groupBy'] = self.group_by
        if self.element_aggregator is not None:
            element_def['elementAggregator'] = self.element_aggregator.to_json()
        return element_def


class ElementAggregateDefinition(ToJson, ToCodeString):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.function.ElementAggregateDefinition'

    def __init__(self, operators=None):
        super().__init__()
        self.operators = JsonConverter.from_json(
            operators, gaffer_binaryoperators.BinaryOperatorContext)

    def to_json(self):
        element_def = {}
        if self.operators is not None:
            funcs = []
            for function in self.operators:
                funcs.append(function.to_json())
            element_def['operators'] = funcs
        return element_def


class ElementFilterDefinition(ToJson, ToCodeString):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.function.ElementFilterDefinition'

    def __init__(self, group='',
                 predicates=None):
        super().__init__()
        self.group = group
        self.predicates = JsonConverter.from_json(
            predicates, gaffer_predicates.PredicateContext)

    def to_json(self):
        element_def = {}
        if self.predicates is not None:
            funcs = []
            for function in self.predicates:
                funcs.append(function.to_json())
            element_def['predicates'] = funcs
        return element_def


class GlobalElementFilterDefinition(ToJson, ToCodeString):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.function.GlobalElementFilterDefinition'

    def __init__(self, predicates=None):
        super().__init__()
        self.predicates = JsonConverter.from_json(
            predicates, gaffer_predicates.PredicateContext)

    def to_json(self):
        element_def = {}
        if self.predicates is not None:
            funcs = []
            for func in self.predicates:
                funcs.append(func.to_json())
            element_def['predicates'] = funcs
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
            pre_aggregation_filter_functions,
            gaffer_predicates.PredicateContext)

        self.post_aggregation_filter_functions = JsonConverter.from_json(
            post_aggregation_filter_functions,
            gaffer_predicates.PredicateContext)

        self.transform_functions = JsonConverter.from_json(
            transform_functions, gaffer_functions.FunctionContext)

        self.post_transform_filter_functions = JsonConverter.from_json(
            post_transform_filter_functions, gaffer_predicates.PredicateContext)

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


class Operation(ToJson, ToCodeString):
    def __init__(self,
                 _class_name,
                 view=None,
                 options=None,
                 views=None):
        self._class_name = _class_name

        if view is not None and isinstance(view, list):
            views = view
            view = None

        if view is not None and isinstance(view, dict):
            view = JsonConverter.from_json(view, View)
        self.view = view

        self.views = None
        if views is not None and isinstance(views, list):
            self.views = []
            for view in views:
                if not isinstance(view, View):
                    view = JsonConverter.from_json(view, View)
                self.views.append(view)

        # Helper so that lists will be interpreted as federated graphIds
        # e.g. options = ["graph_1", "graph_2"]
        if isinstance(options, list):
            options = {
                "gaffer.federatedstore.operation.graphIds": ','.join(options)
            }
        self.options = options

    def to_json(self):
        operation = {'class': self._class_name}
        if self.options is not None:
            operation['options'] = self.options
        if self.view is not None:
            operation['view'] = ToJson.recursive_to_json(self.view)
        if self.views is not None:
            operation['views'] = []
            for view in self.views:
                operation['views'].append(ToJson.recursive_to_json(view))

        return operation

    def validate_operation_chain(self, operation_chain, allow_none=False):
        if isinstance(operation_chain, list):
            for operation in operation_chain:
                JsonConverter.validate(operation, Operation)
            return OperationChain(operation_chain)
        try:
            return JsonConverter.validate(
                operation_chain, OperationChain, allow_none
            )
        except BaseException:
            return OperationChain([
                JsonConverter.validate(
                    operation_chain, Operation, allow_none
                )
            ])


class Match(ToJson, ToCodeString):
    def __init__(self, _class_name):
        self._class_name = _class_name

    def to_json(self):
        return {
            'class': self._class_name
        }


class ElementMatch(Match):

    CLASS = "uk.gov.gchq.gaffer.store.operation.handler.join.match.ElementMatch"

    def __init__(self, group_by_properties=None):
        super().__init__(_class_name=self.CLASS)
        self.group_by_properties = group_by_properties

    def to_json(self):
        match_json = super().to_json()
        if (self.group_by_properties is not None):
            match_json['groupByProperties'] = self.group_by_properties

        return match_json


class KeyFunctionMatch(Match):
    CLASS = "uk.gov.gchq.gaffer.store.operation.handler.join.match.KeyFunctionMatch"

    def __init__(self, first_key_function=None, second_key_function=None):
        super().__init__(_class_name=self.CLASS)

        if not isinstance(first_key_function, gaffer_functions.Function):
            self.first_key_function = JsonConverter.from_json(
                first_key_function, class_obj=gaffer_functions.Function)
        else:
            self.first_key_function = first_key_function

        if not isinstance(second_key_function, gaffer_functions.Function):
            self.second_key_function = JsonConverter.from_json(
                second_key_function, class_obj=gaffer_functions.Function)
        else:
            self.second_key_function = second_key_function

    def to_json(self):
        match_json = super().to_json()
        if self.first_key_function is not None:
            match_json['firstKeyFunction'] = self.first_key_function.to_json()
        if self.second_key_function is not None:
            match_json['secondKeyFunction'] = self.second_key_function.to_json()

        return match_json


class Conditional(ToJson, ToCodeString):
    CLASS = 'uk.gov.gchq.gaffer.operation.util.Conditional'

    def __init__(self, predicate=None, transform=None):
        self.predicate = JsonConverter.validate(
            predicate, gaffer_predicates.Predicate
        )
        self.transform = JsonConverter.validate(
            transform, Operation
        )

    def to_json(self):
        conditional_json = {}
        if self.predicate is not None:
            conditional_json["predicate"] = self.predicate.to_json()

        if self.transform is not None:
            conditional_json["transform"] = self.transform.to_json()

        return conditional_json


# Import generated operation implementations from fishbowl
from gafferpy.generated_api.operations import *

# Parameters


class AddNamedOperation(AddNamedOperation):
    def to_json(self):
        operation_json = super().to_json()
        if self.parameters is not None:
            if isinstance(self.parameters, list):
                operation_json['parameters'] = {}
                for param in self.parameters:
                    operation_json['parameters'][param.name] = param.get_detail()
        return operation_json


class AddNamedView(AddNamedView):
    def to_json(self):
        operation_json = super().to_json()
        if self.parameters is not None:
            if isinstance(self.parameters, list):
                operation_json['parameters'] = {}
                for param in self.parameters:
                    operation_json['parameters'][param.name] = param.get_detail()
        return operation_json

# Element definitions


class Filter(Filter):
    def to_json(self):
        operation_json = super().to_json()
        if self.edges is not None:
            if isinstance(self.edges, list):
                operation_json['edges'] = {}
                for el_def in self.edges:
                    operation_json['edges'][el_def.group] = el_def.to_json()
        if self.entities is not None:
            if isinstance(self.entities, list):
                operation_json['entities'] = {}
                for el_def in self.entities:
                    operation_json['entities'][el_def.group] = el_def.to_json()
        return operation_json


class Aggregate(Aggregate):
    def to_json(self):
        operation_json = super().to_json()
        if self.edges is not None:
            if isinstance(self.edges, list):
                operation_json['edges'] = {}
                for el_def in self.edges:
                    operation_json['edges'][el_def.group] = el_def.to_json()
        if self.entities is not None:
            if isinstance(self.entities, list):
                operation_json['entities'] = {}
                for el_def in self.entities:
                    operation_json['entities'][el_def.group] = el_def.to_json()
        return operation_json


class Transform(Transform):
    def to_json(self):
        operation_json = super().to_json()
        if self.edges is not None:
            if isinstance(self.edges, list):
                operation_json['edges'] = {}
                for el_def in self.edges:
                    operation_json['edges'][el_def.group] = el_def.to_json()
        if self.entities is not None:
            if isinstance(self.entities, list):
                operation_json['entities'] = {}
                for el_def in self.entities:
                    operation_json['entities'][el_def.group] = el_def.to_json()
        return operation_json

# List Input


class If(If):
    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            if not isinstance(self.input, list):
                operation_json["input"] = [self.input]
        return operation_json

# Element Input


class GetElements(GetElements):
    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            json_seeds = []
            if not isinstance(self.input, list):
                self.input = [self.input]
            for seed in self.input:
                if isinstance(seed, ElementSeed):
                    json_seeds.append(seed.to_json())
                else:
                    json_seeds.append(EntitySeed(seed).to_json())
            operation_json['input'] = json_seeds
        if isinstance(self.view, list):
            operation_json["views"] = operation_json.pop("view")

        return operation_json


class ToVertices(ToVertices):
    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            json_seeds = []
            if not isinstance(self.input, list):
                self.input = [self.input]
            for seed in self.input:
                if isinstance(seed, ElementSeed):
                    json_seeds.append(seed.to_json())
                else:
                    json_seeds.append(EntitySeed(seed).to_json())
            operation_json['input'] = json_seeds
        return operation_json

# Entity Input


class GetWalks(GetWalks):
    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            json_seeds = []
            if not isinstance(self.input, list):
                self.input = [self.input]
            for seed in self.input:
                if isinstance(seed, EntitySeed):
                    json_seeds.append(seed.to_json())
                else:
                    json_seeds.append(EntitySeed(seed).to_json())
            operation_json['input'] = json_seeds
        return operation_json


class GetAdjacentIds(GetAdjacentIds):
    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            json_seeds = []
            if not isinstance(self.input, list):
                self.input = [self.input]
            for seed in self.input:
                if isinstance(seed, EntitySeed):
                    json_seeds.append(seed.to_json())
                else:
                    json_seeds.append(EntitySeed(seed).to_json())
            operation_json['input'] = json_seeds
        return operation_json


class GetElementsWithinSet(GetElementsWithinSet):
    def to_json(self):
        operation_json = super().to_json()
        if self.input is not None:
            json_seeds = []
            if not isinstance(self.input, list):
                self.input = [self.input]
            for seed in self.input:
                if isinstance(seed, EntitySeed):
                    json_seeds.append(seed.to_json())
                else:
                    json_seeds.append(EntitySeed(seed).to_json())
            operation_json['input'] = json_seeds
        return operation_json


def load_operation_json_map():
    for name, class_obj in inspect.getmembers(
            sys.modules[__name__], inspect.isclass):
        if hasattr(class_obj, 'CLASS'):
            JsonConverter.GENERIC_JSON_CONVERTERS[class_obj.CLASS] = \
                lambda obj, class_obj=class_obj: class_obj(**obj)


load_operation_json_map()
