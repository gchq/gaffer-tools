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
        if element_aggregator is not None and not isinstance(element_aggregator,
                                                             ElementAggregateDefinition):
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

        self.options = options

    def to_json(self):
        operation = {'class': self._class_name}
        if self.options is not None:
            operation['options'] = self.options
        if self.view is not None:
            operation['view'] = self.view.to_json()
        if self.views is not None:
            operation['views'] = []
            for view in self.views:
                operation['views'].append(view.to_json())

        return operation

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
            self.first_key_function = JsonConverter.from_json(first_key_function, class_obj=gaffer_functions.Function)
        else:
            self.first_key_function = first_key_function

        if not isinstance(second_key_function, gaffer_functions.Function):
            self.second_key_function = JsonConverter.from_json(second_key_function, class_obj=gaffer_functions.Function)
        else:
            self.second_key_function = second_key_function

    def to_json(self):
        match_json = super().to_json()
        if self.first_key_function is not None:
            match_json['firstKeyFunction'] = self.first_key_function.to_json()
        if self.second_key_function is not None:
            match_json['secondKeyFunction'] = self.second_key_function.to_json()

        return match_json

class OperationChain(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.OperationChain"

    def __init__(self, operations, options=None):
        super().__init__(
            _class_name=self.CLASS,
            options=options)
        self._class_name = self.CLASS
        self.operations = operations

    def to_json(self):
        operation_chain_json = super().to_json()
        operations_json = []
        for operation in self.operations:
            if isinstance(operation, ToJson):
                operations_json.append(operation.to_json())
            else:
                operations_json.append(operation)
        operation_chain_json['operations'] = operations_json
        return operation_chain_json


class OperationChainDAO(OperationChain):
    CLASS = "uk.gov.gchq.gaffer.operation.OperationChainDAO"

    def __init__(self, operations,
                 options=None):
        super().__init__(operations=operations, options=options)

    def to_json(self):
        operation_chain_json = super().to_json()
        operation_chain_json.pop('class', None)
        return operation_chain_json


class GetTraits(Operation):
    CLASS = 'uk.gov.gchq.gaffer.store.operation.GetTraits'

    def __init__(self,
                 current_traits,
                 options=None):
        super().__init__(
            _class_name=self.CLASS, options=options)

        self.current_traits = current_traits

    def to_json(self):
        operation = super().to_json()

        operation['currentTraits'] = self.current_traits
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
        if not isinstance(element_generator, gaffer_functions.ElementGenerator):
            element_generator = gaffer_functions.ElementGenerator(
                element_generator['class'],
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
        if not isinstance(element_generator, gaffer_functions.ElementGenerator):
            element_generator = gaffer_functions.ElementGenerator(
                element_generator['class'],
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
                 skip_invalid_elements=True,
                 options=None):
        super().__init__(
            _class_name=self.CLASS, options=options)

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


class CancelScheduledJob(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.job.CancelScheduledJob"

    def __init__(self, job_id):
        super().__init__(_class_name=self.CLASS)
        self.job_id = job_id

    def to_json(self):
        operation_json = super().to_json()
        if self.job_id is not None:
            operation_json['jobId'] = self.job_id
        return operation_json


class SplitStoreFromFile(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.SplitStoreFromFile'

    def __init__(self, input_path, options=None):
        super().__init__(
            _class_name=self.CLASS,
            view=None,
            options=options)
        self.input_path = input_path

    def to_json(self):
        operation = super().to_json()
        operation['inputPath'] = self.input_path
        return operation


class SplitStoreFromIterable(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.SplitStoreFromIterable'

    def __init__(self, input=None, options=None):
        super().__init__(
            _class_name=self.CLASS,
            view=None,
            options=options)
        self.input = input

    def to_json(self):
        operation = super().to_json()
        if self.input is not None:
            operation['input'] = self.input
        return operation


class SampleElementsForSplitPoints(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.SampleElementsForSplitPoints'

    def __init__(self, input=None, num_splits=None, proportion_to_sample=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            view=None,
            options=options)
        self.input = input
        self.num_splits = num_splits
        self.proportion_to_sample = proportion_to_sample

    def to_json(self):
        operation = super().to_json()
        if self.input is not None:
            elements_json = []
            for element in self.input:
                elements_json.append(element.to_json())
            operation['input'] = elements_json
        if self.num_splits is not None:
            operation['numSplits'] = self.num_splits
        if self.proportion_to_sample is not None:
            operation['proportionToSample'] = self.proportion_to_sample
        return operation


class GetOperation(Operation):
    def __init__(self,
                 _class_name,
                 input=None,
                 view=None,
                 directed_type=None,
                 include_incoming_out_going=None,
                 # deprecated, use seed_matching instead
                 seed_matching_type=None,
                 seed_matching=None,
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
        self.seed_matching = seed_matching_type
        if seed_matching is not None:
            self.seed_matching = seed_matching

    def to_json(self):
        operation = super().to_json()

        if self.input is not None:
            json_seeds = []
            if isinstance(self.input, list):
                for seed in self.input:
                    if isinstance(seed, ElementSeed):
                        json_seeds.append(seed.to_json())
                    else:
                        json_seeds.append(EntitySeed(seed).to_json())
            else:
                if isinstance(self.input, ElementSeed):
                    json_seeds.append(self.input.to_json())
                else:
                    json_seeds.append(EntitySeed(self.input).to_json())
            operation['input'] = json_seeds

        if self.seed_matching is not None:
            operation['seedMatching'] = self.seed_matching
        if self.include_incoming_out_going is not None:
            if self.directed_type is not None:
                operation['directedType'] = self.directed_type
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
                 # deprecated, use seed_matching instead
                 seed_matching=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            input=input,
            view=view,
            directed_type=directed_type,
            include_incoming_out_going=include_incoming_out_going,
            seed_matching_type=seed_matching_type,
            seed_matching=seed_matching,
            options=options)

class GetFromEndpoint(Operation):
    CLASS = "uk.gov.gchq.gaffer.operation.impl.get.GetFromEndpoint"

    def __init__(self, endpoint, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.endpoint = endpoint

    def to_json(self):
        operation_json = super().to_json()
        if self.endpoint is not None:
            operation_json['endpoint'] = self.endpoint

        return operation_json


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
            seed_matching=None,
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
            seed_matching=None,
            options=options)
        self.operation_name = operation_name
        self.parameters = parameters

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
                 options=None,
                 score=None):
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
        self.score = score

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
        if self.score is not None:
            operation['score'] = self.score
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


class AddNamedView(Operation):
    CLASS = 'uk.gov.gchq.gaffer.named.view.AddNamedView'

    def __init__(self,
                 view,
                 name,
                 description=None,
                 overwrite_flag=None,
                 parameters=None,
                 write_access_roles=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            options=options)
        if not isinstance(view, View):
            view = JsonConverter.from_json(view, View)
        self.view = view

        self.name = name
        self.description = description
        self.overwrite_flag = overwrite_flag
        self.write_access_roles = write_access_roles
        self.parameters = None
        if parameters is not None:
            self.parameters = []
            if isinstance(parameters, list):
                for param in parameters:
                    if not isinstance(param, NamedViewParameter):
                        param = JsonConverter.from_json(param,
                                                        NamedViewParameter)
                    self.parameters.append(param)
            else:
                for name, param in parameters.items():
                    param = dict(param)
                    param['name'] = name
                    param = JsonConverter.from_json(param,
                                                    NamedViewParameter)
                    self.parameters.append(param)

    def to_json(self):
        operation = super().to_json()
        if isinstance(self.view, View):
            operation['view'] = self.view.to_json()
        else:
            operation['view'] = self.view
        operation['name'] = self.name
        if self.overwrite_flag is not None:
            operation['overwriteFlag'] = self.overwrite_flag
        if self.description is not None:
            operation['description'] = self.description
        if self.parameters is not None:
            operation['parameters'] = {}
            for param in self.parameters:
                operation['parameters'][param.name] = param.get_detail()
        if self.write_access_roles is not None:
            operation['writeAccessRoles'] = self.write_access_roles
        return operation


class DeleteNamedView(Operation):
    CLASS = 'uk.gov.gchq.gaffer.named.view.DeleteNamedView'

    def __init__(self, name, options=None):
        super().__init__(
            _class_name=self.CLASS,
            options=options)
        self.name = name

    def to_json(self):
        operation = super().to_json()
        operation['name'] = self.name
        return operation


class GetAllNamedViews(Operation):
    CLASS = 'uk.gov.gchq.gaffer.named.view.GetAllNamedViews'

    def __init__(self, options=None):
        super().__init__(
            _class_name=self.CLASS,
            options=options)


class DiscardOutput(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.DiscardOutput'

    def __init__(self, options=None):
        super().__init__(
            _class_name=self.CLASS, options=options)


class Count(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.Count'

    def __init__(self, options=None):
        super().__init__(
            _class_name=self.CLASS, options=options
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

    def __init__(self, result_limit, truncate=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
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

    def __init__(self, options=None):
        super().__init__(
            _class_name=self.CLASS, options=options)


class ToArray(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToArray'

    def __init__(self, options=None):
        super().__init__(
            _class_name=self.CLASS, options=options)


class ToEntitySeeds(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToEntitySeeds'

    def __init__(self, options=None):
        super().__init__(
            _class_name=self.CLASS, options=options)


class ToList(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToList'

    def __init__(self, options=None):
        super().__init__(
            _class_name=self.CLASS, options=options)


class ToStream(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToStream'

    def __init__(self, options=None):
        super().__init__(
            _class_name=self.CLASS, options=options)


class ToVertices(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToVertices'

    def __init__(self, edge_vertices=None, use_matched_vertex=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS, options=options)
        self.edge_vertices = edge_vertices
        self.use_matched_vertex = use_matched_vertex

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
                 include_header=True, options=None):
        super().__init__(
            _class_name=self.CLASS, options=options
        )
        if not isinstance(element_generator, gaffer_functions.CsvGenerator):
            element_generator = JsonConverter.from_json(
                element_generator, gaffer_functions.CsvGenerator)
        self.element_generator = element_generator
        self.include_header = include_header

    def to_json(self):
        operation = super().to_json()

        operation['elementGenerator'] = self.element_generator.to_json()
        operation['includeHeader'] = self.include_header

        return operation


class ToMap(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToMap'

    def __init__(self,
                 element_generator, options=None):
        super().__init__(
            _class_name=self.CLASS, options=options
        )

        if not isinstance(element_generator, gaffer_functions.MapGenerator):
            element_generator = JsonConverter.from_json(
                element_generator, gaffer_functions.MapGenerator)
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
                 deduplicate=None, options=None):
        super().__init__(
            _class_name=self.CLASS, options=options
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

    def __init__(self, comparators, input=None, options=None):
        super().__init__(
            _class_name=self.CLASS, options=options
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

    def __init__(self, comparators, input=None, options=None):
        super().__init__(
            _class_name=self.CLASS, options=options
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
                 store_properties=None, options=None):
        super().__init__(
            self.CLASS, options=options
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
                 parent_store_properties_id=None, options=None):
        super().__init__(
            self.CLASS, options=options
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
                 # deprecated, use seed_matching instead
                 seed_matching_type=None,
                 seed_matching=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            input=input,
            view=view,
            directed_type=directed_type,
            include_incoming_out_going=include_incoming_out_going,
            seed_matching_type=seed_matching_type,
            seed_matching=seed_matching,
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
                 # deprecated, use seed_matching instead
                 seed_matching_type=None,
                 seed_matching=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            input=None,
            view=view,
            directed_type=directed_type,
            include_incoming_out_going=include_incoming_out_going,
            seed_matching_type=seed_matching_type,
            seed_matching=seed_matching,
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


class Filter(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.function.Filter'

    def __init__(self,
                 input=None,
                 entities=None,
                 edges=None,
                 global_elements=None,
                 global_entities=None,
                 global_edges=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            options=options
        )
        self.input = input
        self.entities = None
        self.edges = None
        self.global_elements = None
        self.global_entities = None
        self.global_edges = None

        if entities is not None:
            self.entities = []
            if isinstance(entities, list):
                for el_def in entities:
                    if not isinstance(el_def, ElementFilterDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, ElementFilterDefinition)
                    self.entities.append(el_def)
            else:
                for group, el_def in entities.items():
                    if not isinstance(el_def, ElementFilterDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, ElementFilterDefinition)
                    el_def.group = group
                    self.entities.append(el_def)

        if edges is not None:
            self.edges = []
            if isinstance(edges, list):
                for el_def in edges:
                    if not isinstance(el_def, ElementFilterDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, ElementFilterDefinition)
                    self.edges.append(el_def)
            else:
                for group, el_def in edges.items():
                    if not isinstance(el_def, ElementFilterDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, ElementFilterDefinition)
                    el_def.group = group
                    self.edges.append(el_def)

        if global_elements is not None:
            if not isinstance(global_elements, GlobalElementFilterDefinition):
                global_elements = JsonConverter.from_json(
                    global_elements, GlobalElementFilterDefinition)
            self.global_elements = global_elements

        if global_entities is not None:
            if not isinstance(global_entities, GlobalElementFilterDefinition):
                global_entities = JsonConverter.from_json(
                    global_entities, GlobalElementFilterDefinition)
            self.global_entities = global_entities

        if global_edges is not None:
            if not isinstance(global_edges, GlobalElementFilterDefinition):
                global_edges = JsonConverter.from_json(
                    global_edges, GlobalElementFilterDefinition)
            self.global_edges = global_edges

    def to_json(self):
        operation = super().to_json()
        if self.input is not None:
            elements_json = []
            for element in self.input:
                elements_json.append(element.to_json())
            operation['input'] = elements_json

        if self.entities is not None:
            el_defs = {}
            for el_def in self.entities:
                el_defs[el_def.group] = el_def.to_json()
            operation['entities'] = el_defs
        if self.edges is not None:
            el_defs = {}
            for el_def in self.edges:
                el_defs[el_def.group] = el_def.to_json()
            operation['edges'] = el_defs

        if self.global_elements is not None:
            operation['globalElements'] = self.global_elements.to_json()

        if self.global_entities is not None:
            operation['globalEntities'] = self.global_entities.to_json()

        if self.global_edges is not None:
            operation['globalEdges'] = self.global_edges.to_json()

        return operation


class Aggregate(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.function.Aggregate'

    def __init__(self,
                 input=None,
                 entities=None,
                 edges=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            options=options
        )
        self.input = input
        self.entities = None
        self.edges = None

        if entities is not None:
            self.entities = []
            if isinstance(entities, list):
                for el_def in entities:
                    if not isinstance(el_def, AggregatePair):
                        el_def = JsonConverter.from_json(
                            el_def, AggregatePair)
                    self.entities.append(el_def)
            else:
                for group, el_def in entities.items():
                    if not isinstance(el_def, AggregatePair):
                        el_def = JsonConverter.from_json(
                            el_def, AggregatePair)
                    el_def.group = group
                    self.entities.append(el_def)

        if edges is not None:
            self.edges = []
            if isinstance(edges, list):
                for el_def in edges:
                    if not isinstance(el_def, AggregatePair):
                        el_def = JsonConverter.from_json(
                            el_def, AggregatePair)
                    self.edges.append(el_def)
            else:
                for group, el_def in edges.items():
                    if not isinstance(el_def, AggregatePair):
                        el_def = JsonConverter.from_json(
                            el_def, AggregatePair)
                    el_def.group = group
                    self.edges.append(el_def)

    def to_json(self):
        operation = super().to_json()
        if self.input is not None:
            elements_json = []
            for element in self.input:
                elements_json.append(element.to_json())
            operation['input'] = elements_json
        if self.entities is not None:
            el_defs = {}
            for el_def in self.entities:
                el_defs[el_def.group] = el_def.to_json()
            operation['entities'] = el_defs
        if self.edges is not None:
            el_defs = {}
            for el_def in self.edges:
                el_defs[el_def.group] = el_def.to_json()
            operation['edges'] = el_defs

        return operation


class Transform(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.function.Transform'

    def __init__(self,
                 input=None,
                 entities=None,
                 edges=None,
                 options=None):
        super().__init__(
            _class_name=self.CLASS,
            options=options
        )
        self.input = input
        self.entities = None
        self.edges = None

        if entities is not None:
            self.entities = []
            if isinstance(entities, list):
                for el_def in entities:
                    if not isinstance(el_def, ElementTransformDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, ElementTransformDefinition)
                    self.entities.append(el_def)
            else:
                for group, el_def in entities.items():
                    if not isinstance(el_def, ElementTransformDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, ElementTransformDefinition)
                    el_def.group = group
                    self.entities.append(el_def)

        if edges is not None:
            self.edges = []
            if isinstance(edges, list):
                for el_def in edges:
                    if not isinstance(el_def, ElementTransformDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, ElementTransformDefinition)
                    self.edges.append(el_def)
            else:
                for group, el_def in edges.items():
                    if not isinstance(el_def, ElementTransformDefinition):
                        el_def = JsonConverter.from_json(
                            el_def, ElementTransformDefinition)
                    el_def.group = group
                    self.edges.append(el_def)

    def to_json(self):
        operation = super().to_json()
        if self.input is not None:
            elements_json = []
            for element in self.input:
                elements_json.append(element.to_json())
            operation['input'] = elements_json
        if self.entities is not None:
            el_defs = {}
            for el_def in self.entities:
                el_defs[el_def.group] = el_def.to_json()
            operation['entities'] = el_defs
        if self.edges is not None:
            el_defs = {}
            for el_def in self.edges:
                el_defs[el_def.group] = el_def.to_json()
            operation['edges'] = el_defs

        return operation


class ScoreOperationChain(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.ScoreOperationChain'

    def __init__(self, operation_chain, options=None):
        super().__init__(_class_name=self.CLASS,
                         options=options)
        if operation_chain is None:
            raise TypeError('Operation Chain is required')

        if not isinstance(operation_chain, OperationChain):
            operation_chain = JsonConverter.from_json(operation_chain,
                                                      OperationChain)

        self.operation_chain = operation_chain

    def to_json(self):
        operation = super().to_json()
        operation['operationChain'] = self.operation_chain.to_json()

        return operation


class GetWalks(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.GetWalks'

    def __init__(self,
                 input=None,
                 operations=None,
                 results_limit=None,
                 options=None):
        super().__init__(_class_name=self.CLASS,
                         options=options)
        self.input = input
        self.operations = None
        self.results_limit = results_limit

        if operations is not None:
            self.operations = []
            for op in operations:
                if not isinstance(op, GetElements) and not isinstance(op,
                                                                      OperationChain):
                    op = JsonConverter.from_json(op)
                self.operations.append(op)

    def to_json(self):
        operation = super().to_json()
        if self.results_limit is not None:
            operation['resultsLimit'] = self.results_limit

        if self.input is not None:
            entity_seed_json = []
            for entity_seed in self.input:
                entity_seed_json.append(entity_seed.to_json())
            operation['input'] = entity_seed_json

        if self.operations is not None:
            operations_json = []
            for op in self.operations:
                operations_json.append(op.to_json())
            operation['operations'] = operations_json

        return operation


class Map(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.Map'

    def __init__(self,
                 functions,
                 input=None,
                 options=None):
        super().__init__(_class_name=self.CLASS,
                         options=options)

        self.input = input

        if functions is not None:
            self.functions = []
            for func in functions:
                if not isinstance(func, gaffer_functions.Function):
                    func = JsonConverter.from_json(
                        func, gaffer_functions.Function)
                self.functions.append(func)

    def to_json(self):
        operation = super().to_json()
        if self.input is not None:
            operation['input'] = self.input

        if self.functions is not None:
            functions_json = []
            for function in self.functions:
                functions_json.append(function.to_json())
            operation['functions'] = functions_json

        return operation


class If(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.If'

    def __init__(self, input=None, condition=None, conditional=None,
                 then=None, otherwise=None, options=None):
        super().__init__(_class_name=self.CLASS,
                         options=options)

        self.input = input
        self.condition = condition

        if conditional is not None:
            if not isinstance(conditional, Conditional):
                self.conditional = JsonConverter.from_json(conditional,
                                                           Conditional)
            else:
                self.conditional = conditional
        else:
            self.conditional = None

        if then is not None:
            if not isinstance(then, Operation):
                self.then = JsonConverter.from_json(then, Operation)
            else:
                self.then = then
        else:
            self.then = None

        if otherwise is not None:
            if not isinstance(otherwise, Operation):
                self.otherwise = JsonConverter.from_json(otherwise, Operation)
            else:
                self.otherwise = otherwise
        else:
            self.otherwise = None

    def to_json(self):
        operation = super().to_json()

        if self.input is not None:
            json_seeds = []
            if isinstance(self.input, list):
                for seed in self.input:
                    if isinstance(seed, ToJson):
                        json_seeds.append(seed.to_json())
                    else:
                        json_seeds.append(seed)
            else:
                if isinstance(self.input, ToJson):
                    json_seeds.append(self.input.to_json())
                else:
                    json_seeds.append(self.input.to_json())
            operation['input'] = json_seeds

        if self.condition is not None:
            operation['condition'] = self.condition

        if self.conditional is not None:
            operation['conditional'] = self.conditional.to_json()

        if self.then is not None:
            operation['then'] = self.then.to_json()

        if self.otherwise is not None:
            operation['otherwise'] = self.otherwise.to_json()

        return operation


class While(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.While'

    def __init__(self, max_repeats=1000, input=None, operation=None,
                 condition=None, conditional=None, options=None):

        super().__init__(_class_name=self.CLASS,
                         options=options)

        self.max_repeats = max_repeats
        self.input = input
        self.condition = condition

        if operation is not None:
            if not isinstance(operation, Operation):
                self.operation = JsonConverter.from_json(operation, Operation)
            else:
                self.operation = operation

        if conditional is not None:
            if not isinstance(conditional, Conditional):
                self.conditional = JsonConverter.from_json(conditional,
                                                           Conditional)
            else:
                self.conditional = conditional
        else:
            self.conditional = conditional

    def to_json(self):
        operation = super().to_json()

        operation['maxRepeats'] = self.max_repeats

        if self.input is not None:
            json_seeds = []
            if isinstance(self.input, list):
                for seed in self.input:
                    if isinstance(seed, ToJson):
                        json_seeds.append(seed.to_json())
                    else:
                        json_seeds.append(seed)
            else:
                if isinstance(self.input, ToJson):
                    json_seeds.append(self.input.to_json())
                else:
                    json_seeds.append(self.input.to_json())
            operation['input'] = json_seeds

        if self.operation is not None:
            operation['operation'] = self.operation.to_json()

        if self.condition is not None:
            operation['condition'] = self.condition

        if self.conditional is not None:
            operation['conditional'] = self.conditional.to_json()

        return operation


class Reduce(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.Reduce'

    def __init__(self, input=None, identity=None,
                 aggregate_function=None, options=None):

        super().__init__(_class_name=self.CLASS,
                         options=options)

        self.input = input
        self.identity = identity

        if aggregate_function is None:
            raise ValueError('aggregate_function is required')
        if isinstance(aggregate_function, dict):
            aggregate_function = JsonConverter.from_json(
                aggregate_function, gaffer_binaryoperators.BinaryOperator)
        self.aggregate_function = aggregate_function

    def to_json(self):
        operation = super().to_json()

        if self.input is not None:
            json_seeds = []
            if isinstance(self.input, list):
                for seed in self.input:
                    if isinstance(seed, ToJson):
                        json_seeds.append(seed.to_json())
                    else:
                        json_seeds.append(seed)
            else:
                if isinstance(self.input, ToJson):
                    json_seeds.append(self.input.to_json())
                else:
                    json_seeds.append(self.input.to_json())
            operation['input'] = json_seeds

        operation['aggregateFunction'] = self.aggregate_function.to_json()

        if self.identity is not None:
            if isinstance(self.identity, ToJson):
                operation['identity'] = self.identity.to_json()
            else:
                operation['identity'] = self.identity

        return operation


class ForEach(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.ForEach'

    def __init__(self, input=None, operation=None, options=None):

        super().__init__(_class_name=self.CLASS,
                         options=options)

        self.input = input

        if operation is not None:
            if not isinstance(operation, Operation):
                self.operation = JsonConverter.from_json(operation, Operation)
            else:
                self.operation = operation

    def to_json(self):
        operation = super().to_json()

        if self.input is not None:
            json_seeds = []
            if isinstance(self.input, list):
                for seed in self.input:
                    if isinstance(seed, ToJson):
                        json_seeds.append(seed.to_json())
                    else:
                        json_seeds.append(seed)
            else:
                if isinstance(self.input, ToJson):
                    json_seeds.append(self.input.to_json())
                else:
                    json_seeds.append(self.input.to_json())
            operation['input'] = json_seeds

        if self.operation is not None:
            operation['operation'] = self.operation.to_json()

        return operation


class ToSingletonList(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.output.ToSingletonList'

    def __init__(self, input=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input

    def to_json(self):
        operation = super().to_json()

        if self.input is not None:
            json_seeds = []
            if isinstance(self.input, list):
                for seed in self.input:
                    if isinstance(seed, ToJson):
                        json_seeds.append(seed.to_json())
                    else:
                        json_seeds.append(seed)
            else:
                if isinstance(self.input, ToJson):
                    json_seeds.append(self.input.to_json())
                else:
                    json_seeds.append(self.input.to_json())
            operation['input'] = json_seeds

        return operation


class ValidateOperationChain(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.ValidateOperationChain'

    def __init__(self, operation_chain=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        if operation_chain is None:
            raise ValueError('operation_chain is required')

        if not isinstance(operation_chain, OperationChain):
            self.operation_chain = JsonConverter.from_json(
                operation_chain, OperationChain)
        else:
            self.operation_chain = operation_chain

    def to_json(self):
        operation_json = super().to_json()
        operation_json['operationChain'] = self.operation_chain.to_json()
        return operation_json


class Conditional(ToJson, ToCodeString):
    CLASS = 'uk.gov.gchq.gaffer.operation.util.Conditional'

    def __init__(self, predicate=None, transform=None):

        if predicate is not None:
            if not isinstance(predicate, gaffer_predicates.Predicate):
                self.predicate = JsonConverter.from_json(predicate,
                                                         gaffer_predicates.Predicate)
            else:
                self.predicate = predicate

        if transform is not None:
            if not isinstance(transform, Operation):
                self.transform = JsonConverter.from_json(transform, Operation)
            else:
                self.transform = transform

    def to_json(self):
        conditional_json = {}
        if self.predicate is not None:
            conditional_json["predicate"] = self.predicate.to_json()

        if self.transform is not None:
            conditional_json["transform"] = self.transform.to_json()

        return conditional_json


class Join(Operation):
    
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.join.Join'

    def __init__(self, input=None, operation=None, match_method=None, match_key=None, flatten=None, join_type=None, collection_limit=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        
        if operation is not None:
            if not isinstance(operation, Operation):
                self.operation = JsonConverter.from_json(operation)
            else:
                self.operation = operation

        if match_method is not None:
            if not isinstance(match_method, Match):
                self.match_method = JsonConverter.from_json(match_method)
            else:
                self.match_method = match_method

        self.input = input
        self.flatten = flatten
        self.match_key = match_key
        self.collection_limit = collection_limit
        self.join_type = join_type

    def to_json(self):
        operation_json = super().to_json()

        if self.input is not None:
            json_input = []
            for input in self.input:
                if isinstance(input, ToJson):
                    json_input.append(input.to_json())
                else:
                    json_input.append(input)
                
            operation_json['input'] = json_input
        if self.operation is not None:
            operation_json['operation'] = self.operation.to_json()
        if self.match_method is not None:
            operation_json['matchMethod'] = self.match_method.to_json()
        if self.match_key is not None:
            operation_json['matchKey'] = self.match_key
        if self.flatten is not None:
            operation_json['flatten'] = self.flatten
        if self.join_type is not None:
            operation_json['joinType'] = self.join_type
        if self.collection_limit is not None:
            operation_json['collectionLimit'] = self.collection_limit

        return operation_json


class GetAllGraphIds(Operation):
    CLASS = 'uk.gov.gchq.gaffer.federatedstore.operation.GetAllGraphIds'

    def __init__(self, options=None):
        super().__init__(_class_name=self.CLASS, options=options)


class FederatedOperationChain(Operation):
    CLASS = 'uk.gov.gchq.gaffer.federatedstore.operation.FederatedOperationChain'

    def __init__(self,operation_chain=None,options=None):
        super().__init__(_class_name=self.CLASS, options=options)

        if operation_chain is None:
            raise ValueError('operation_chain is required')

        if operation_chain is not None:
            if isinstance(operation_chain,OperationChain):
                self.operation_chain = operation_chain
            elif isinstance(operation_chain,list):
                allOperations = True
                if (len(allOperations) == 0):
                    allOperations = False
                for op in operation_chain:
                    if not isinstance(op,Operation):
                        allOperations = False
                if allOperations:
                    self.operation_chain = OperationChain(operation_chain)
            elif isinstance(operation_chain,Operation):
                self.operation_chain = OperationChain(operation_chain)
            else:
                self.operation_chain = JsonConverter.from_json(operation_chain, OperationChain)
        
    def to_json(self):
        operation = super().to_json()
        operation['operationChain'] = self.operation_chain.to_json()

        return operation


class RemoveGraph(Operation):
    CLASS = 'uk.gov.gchq.gaffer.federatedstore.operation.RemoveGraph'

    def __init__(self, graph_id, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.graph_id = graph_id

    def to_json(self):
        operation = super().to_json()
        operation['graphId'] = self.graph_id
        return operation


class AddGraph(Operation):
    CLASS = 'uk.gov.gchq.gaffer.federatedstore.operation.AddGraph'

    def __init__(self, graph_id,
                 store_properties=None,
                 parent_properties_id=None,
                 schema=None,
                 parent_schema_ids=None,
                 graph_auths=None,
                 is_public=None,
                 disabled_by_default=None,
                 options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.graph_id = graph_id
        self.store_properties = store_properties
        self.parent_properties_id = parent_properties_id
        self.schema = schema
        self.parent_properties_id = parent_properties_id
        self.parent_schema_ids = parent_schema_ids
        self.graph_auths = graph_auths
        self.is_public = is_public
        self.disabled_by_default = disabled_by_default

    def to_json(self):
        operation = super().to_json()
        operation['graphId'] = self.graph_id
        if self.store_properties is not None:
            operation['storeProperties'] = self.store_properties

        if self.parent_properties_id is not None:
            operation['parentPropertiesId'] = self.parent_properties_id

        if self.schema is not None:
            operation['schema'] = self.schema

        if self.parent_schema_ids is not None:
            operation['parentSchemaIds'] = self.parent_schema_ids

        if self.graph_auths is not None:
            operation['graphAuths'] = self.graph_auths

        if self.is_public is not None:
            operation['isPublic'] = self.is_public

        if self.disabled_by_default is not None:
            operation['disabledByDefault'] = self.disabled_by_default

        return operation


class AddGraphWithHooks(Operation):
    CLASS = 'uk.gov.gchq.gaffer.federatedstore.operation.AddGraphWithHooks'

    def __init__(self, graph_id,
                 store_properties=None,
                 parent_properties_id=None,
                 schema=None,
                 parent_schema_ids=None,
                 graph_auths=None,
                 is_public=None,
                 disabled_by_default=None,
                 hooks=None,
                 options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.graph_id = graph_id
        self.store_properties = store_properties
        self.parent_properties_id = parent_properties_id
        self.schema = schema
        self.parent_properties_id = parent_properties_id
        self.parent_schema_ids = parent_schema_ids
        self.graph_auths = graph_auths
        self.is_public = is_public
        self.disabled_by_default = disabled_by_default
        self.hooks = hooks

    def to_json(self):
        operation = super().to_json()
        operation['graphId'] = self.graph_id
        if self.store_properties is not None:
            operation['storeProperties'] = self.store_properties

        if self.parent_properties_id is not None:
            operation['parentPropertiesId'] = self.parent_properties_id

        if self.schema is not None:
            operation['schema'] = self.schema

        if self.parent_schema_ids is not None:
            operation['parentSchemaIds'] = self.parent_schema_ids

        if self.graph_auths is not None:
            operation['graphAuths'] = self.graph_auths

        if self.is_public is not None:
            operation['isPublic'] = self.is_public

        if self.disabled_by_default is not None:
            operation['disabledByDefault'] = self.disabled_by_default

        if self.hooks is not None:
            operation['hooks'] = self.hooks

        return operation


class GetVariable(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.GetVariable'

    def __init__(self, variable_name=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.variable_name = variable_name

    def to_json(self):
        operation = super().to_json()

        if self.variable_name is not None:
            operation['variableName'] = self.variable_name

        return operation


class GetVariables(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.GetVariables'

    def __init__(self, variable_names=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.variable_names = variable_names

    def to_json(self):
        operation = super().to_json()

        if self.variable_names is not None:
            operation['variableNames'] = self.variable_names

        return operation


class SetVariable(Operation):
    CLASS = 'uk.gov.gchq.gaffer.operation.impl.SetVariable'

    def __init__(self, input=None, variable_name=None, options=None):
        super().__init__(_class_name=self.CLASS, options=options)
        self.input = input
        self.variable_name = variable_name

    def to_json(self):
        operation = super().to_json()

        if self.variable_name is not None:
            operation['variableName'] = self.variable_name

        if self.input is not None:
            operation['input'] = self.input

        return operation


def load_operation_json_map():
    for name, class_obj in inspect.getmembers(
            sys.modules[__name__], inspect.isclass):
        if hasattr(class_obj, 'CLASS'):
            JsonConverter.GENERIC_JSON_CONVERTERS[class_obj.CLASS] = \
                lambda obj, class_obj=class_obj: class_obj(**obj)


load_operation_json_map()
