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
This module contains Python copies of Gaffer function java classes
"""

from gafferpy.gaffer_core import *
import gafferpy.gaffer_predicates as pred

class FunctionContext(ToJson, ToCodeString):
    CLASS = "gaffer.FunctionContext"

    def __init__(self, selection=None, function=None, projection=None):
        if isinstance(selection, list):
            self.selection = selection
        else:
            self.selection = [selection]
        self.function = function
        if isinstance(projection, list):
            self.projection = projection
        else:
            self.projection = [projection]

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


class AbstractFunction(Function):
    CLASS = "java.util.function.Function"

    def __init__(self, _class_name=None):
        super().__init__()
        self._class_name = _class_name

    def to_json(self):
        function_json = {}
        if self._class_name is not None:
            function_json['class'] = self._class_name

        return function_json


class ExtractKeys(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.ExtractKeys'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()

class DictionaryLookup(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.DictionaryLookup'

    def __init__(self, dictionary):
        super().__init__(_class_name=self.CLASS)
        self.dictionary = dictionary
    
    def to_json(self):
        function_json = super().to_json()
        function_json["dictionary"] = self.dictionary

        return function_json

class ExtractValue(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.ExtractValue'

    def __init__(self, key=None):
        super().__init__(_class_name=self.CLASS)

        self.key = key

    def to_json(self):
        function = super().to_json()

        if self.key is not None:
            function['key'] = self.key

        return function


class ExtractValues(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.ExtractValues'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExtractId(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.data.element.function.ExtractId'

    def __init__(self, id=None):
        super().__init__(_class_name=self.CLASS)

        self.id = id

    def to_json(self):
        function = super().to_json()

        if self.id is not None:
            function['id'] = self.id

        return function


class ExtractGroup(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.data.element.function.ExtractGroup'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)


class ExtractProperty(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.data.element.function.ExtractProperty'

    def __init__(self, name=None):
        super().__init__(_class_name=self.CLASS)

        self.name = name

    def to_json(self):
        function = super().to_json()

        if self.name is not None:
            function['name'] = self.name

        return function


class UnwrapEntityId(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.data.element.function.UnwrapEntityId'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)


class IsEmpty(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.IsEmpty'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Size(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.Size'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Length(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.Length'

    def __init__(self, max_length=None):
        super().__init__(_class_name=self.CLASS)

        self.max_length = max_length

    def to_json(self):
        function = super().to_json()

        if self.max_length is not None:
            function['maxLength'] = self.max_length

        return function


class FirstItem(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.FirstItem'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class NthItem(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.NthItem'

    def __init__(self, selection):
        super().__init__(_class_name=self.CLASS)

        self.selection = selection

    def to_json(self):
        function = super().to_json()

        if self.selection is not None:
            function['selection'] = self.selection

        return function


class LastItem(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.LastItem'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class IterableConcat(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.IterableConcat'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class IterableFunction(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.IterableFunction'

    def __init__(self, functions):
        super().__init__(_class_name=self.CLASS)

        if functions is None:
            raise TypeError('No function(s) provided')
        else:
            self.functions = []
            for func in functions:
                if not isinstance(func, Function):
                    func = JsonConverter.from_json(
                        func, Function)
                self.functions.append(func)

    def to_json(self):
        function = super().to_json()

        functions_json = []
        for func in self.functions:
            functions_json.append(func.to_json())
        function['functions'] = functions_json

        return function


class ExtractWalkEdges(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEdges'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExtractWalkEdgesFromHop(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEdgesFromHop'

    def __init__(self, hop=None):
        super().__init__(_class_name=self.CLASS)

        self.hop = hop

    def to_json(self):
        function = super().to_json()

        if self.hop is not None:
            function['hop'] = self.hop

        return function


class ExtractWalkEntities(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEntities'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ExtractWalkEntitiesFromHop(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEntitiesFromHop'

    def __init__(self, hop=None):
        super().__init__(_class_name=self.CLASS)

        self.hop = hop

    def to_json(self):
        function = super().to_json()

        if self.hop is not None:
            function['hop'] = self.hop

        return function


class ExtractWalkVertex(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkVertex'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Concat(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.Concat'

    def __init__(self, separator=None):
        super().__init__(_class_name=self.CLASS)

        self.separator = separator

    def to_json(self):
        function = super().to_json()

        if self.separator is not None:
            function['separator'] = self.separator

        return function


class Divide(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.Divide'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class DivideBy(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.DivideBy'

    def __init__(self, by=None):
        super().__init__(_class_name=self.CLASS)

        self.by = by

    def to_json(self):
        function = super().to_json()

        if self.by is not None:
            function['by'] = self.by

        return function


class Identity(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.Identity'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class Multiply(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.Multiply'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class MultiplyBy(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.MultiplyBy'

    def __init__(self, by=None):
        super().__init__(_class_name=self.CLASS)

        self.by = by

    def to_json(self):
        function = super().to_json()

        if self.by is not None:
            function['by'] = self.by

        return function


class ToString(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.ToString'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToEntityId(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.operation.function.ToEntityId'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class FromEntityId(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.operation.function.FromEntityId'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToElementId(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.operation.function.ToElementId'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToUpperCase(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.ToUpperCase'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToLowerCase(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.ToLowerCase'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToNull(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.ToNull'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToLong(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.ToLong'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToInteger(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.ToInteger'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()

class ToTypeSubTypeValue(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.types.function.ToTypeSubTypeValue"
    
    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class ToTypeValue(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.types.function.ToTypeValue'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()
      
class Cast(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.Cast'

    def __init__(self, output_class):
        super().__init__(_class_name=self.CLASS)
        self.output_class = output_class

    def to_json(self):
        json = super().to_json()
        json['outputClass'] = self.output_class
        return json


class SetValue(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.SetValue'

    def __init__(self, value):
        super().__init__(_class_name=self.CLASS)
        self.value = value

    def to_json(self):
        json = super().to_json()
        json['value'] = self.value
        return json


class FromElementId(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.operation.function.FromElementId'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class MapGenerator(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.data.generator.MapGenerator'

    def __init__(self, fields=None, constants=None):
        super().__init__(_class_name=self.CLASS)

        self.fields = fields
        self.constants = constants

    def to_json(self):
        function = super().to_json()

        if self.fields is not None:
            function['fields'] = self.fields

        if self.constants is not None:
            function['constants'] = self.constants

        return function


class CsvGenerator(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.data.generator.CsvGenerator'

    def __init__(self, fields=None, constants=None, quoted=None,
                 comma_replacement=None):
        super().__init__(_class_name=self.CLASS)

        self.fields = fields
        self.constants = constants
        self.quoted = quoted
        self.comma_replacement = comma_replacement

    def to_json(self):
        function = super().to_json()

        if self.fields is not None:
            function['fields'] = self.fields

        if self.constants is not None:
            function['constants'] = self.constants

        if self.quoted is not None:
            function['quoted'] = self.quoted

        if self.comma_replacement is not None:
            function['commaReplacement'] = self.comma_replacement

        return function

class FreqMapExtractor(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.types.function.FreqMapExtractor'

    def __init__(self, key):
        super().__init__(_class_name=self.CLASS)
        self.key = key

    def to_json(self):
        function_json = super().to_json()
        function_json['key'] = self.key
        return function_json


class FunctionMap(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.function.FunctionMap'

    def __init__(self, function):
        super().__init__(_class_name=self.CLASS)
        if not isinstance(function, Function):
            function = JsonConverter.from_json(function, Function)
        self.function = function

    def to_json(self):
        function_json = super().to_json()
        function_json['function'] = self.function.to_json()
        return function_json


class ElementGenerator(Function):
    CLASS = 'uk.gov.gchq.gaffer.data.generator.ElementGenerator'

    def __init__(self,
                 class_name,
                 fields=None):
        super().__init__(class_name=class_name, fields=fields)


class JsonToElementGenerator(ElementGenerator):
    CLASS = "uk.gov.gchq.gaffer.data.generator.JsonToElementGenerator"

    def __init__(self):
        super().__init__(class_name=self.CLASS)
    

class CallMethod(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.CallMethod'

    def __init__(self, method):
        super().__init__(_class_name=self.CLASS)
        self.method = method

    def to_json(self):
        function_json = super().to_json()
        function_json['method'] = self.method
        return function_json



class If(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.If"

    def __init__(self, condition=None, predicate=None,
                 then=None, otherwise=None):
        super().__init__(_class_name=self.CLASS)

        self.condition = condition
        self.predicate = pred.predicate_converter(predicate)
        self.then = function_converter(then)
        self.otherwise = function_converter(otherwise)

    def to_json(self):
        predicate_json = super().to_json()
        if self.condition is not None:
            predicate_json['condition'] = self.condition
        if self.predicate is not None:
            predicate_json['predicate'] = self.predicate.to_json()
        if self.then is not None:
            predicate_json['then'] = self.then.to_json()
        if self.otherwise is not None:
            predicate_json['otherwise'] = self.otherwise.to_json()

        return predicate_json

class ToFreqMap(AbstractFunction):
    CLASS = 'uk.gov.gchq.gaffer.types.function.ToFreqMap'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()


class FreqMapPredicator(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.types.function.FreqMapPredicator"

    def __init__(self, predicate=None):
        super().__init__(_class_name=self.CLASS)

        if not isinstance(predicate, pred.Predicate):
            self.predicate = JsonConverter.from_json(predicate, pred.Predicate)
        else:
            self.predicate = predicate
    
    def to_json(self):
        predicate_json = super().to_json()
        if self.predicate is not None:
            predicate_json['predicate'] = self.predicate.to_json()

        return predicate_json
      
      
class MapFilter(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.MapFilter"    

    def __init__(self, key_predicate=None, value_predicate=None, key_value_predicate=None):
        super().__init__(_class_name=self.CLASS)
        self.key_predicate = pred.predicate_converter(key_predicate) if key_predicate is not None else None 
        self.value_predicate = pred.predicate_converter(value_predicate) if value_predicate is not None else None
        self.key_value_predicate = pred.predicate_converter(key_value_predicate) if key_value_predicate is not None else None

    def to_json(self):
        predicate_json = super().to_json()
        if self.key_predicate is not None:
            predicate_json["keyPredicate"] = self.key_predicate.to_json()
        if self.value_predicate is not None:
            predicate_json["valuePredicate"] = self.value_predicate.to_json()
        if self.key_value_predicate is not None:
            predicate_json["keyValuePredicate"] = self.key_value_predicate.to_json()
            
        return predicate_json

      
class IterableFilter(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.IterableFilter"

    def __init__(self, predicate=None):
        super().__init__(_class_name=self.CLASS)
        
        if not isinstance(predicate, pred.Predicate):
            self.predicate = JsonConverter.from_json(predicate, pred.Predicate)
        else:
            self.predicate = predicate

    def to_json(self):
        predicate_json = super().to_json()

        if self.predicate is not None:
            predicate_json['predicate'] = self.predicate.to_json()

        return predicate_json

class MaskTimestampSetByTimeRange(AbstractFunction):
    CLASS = "uk.gov.gchq.gaffer.time.function.MaskTimestampSetByTimeRange"

    def __init__(self, start_time=None, end_time=None, time_unit=None):
        super().__init__(_class_name=self.CLASS)
        self.start_time = start_time
        self.end_time = end_time
        self.time_unit = time_unit

    def to_json(self):
        function_json = super().to_json()
        function_json['startTime'] = self.start_time
        function_json['endTime'] = self.end_time

        if (self.time_unit is not None):
            function_json["timeUnit"] = self.time_unit

        return function_json

class ToList(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.ToList'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()
      

      
class ToSet(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.ToSet'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()

      
class ToArray(AbstractFunction):
    CLASS = 'uk.gov.gchq.koryphe.impl.function.ToArray'

    def __init__(self):
        super().__init__(_class_name=self.CLASS)

    def to_json(self):
        return super().to_json()
      
class CreateObject(AbstractFunction):
    CLASS = "uk.gov.gchq.koryphe.impl.function.CreateObject"

    def __init__(self, object_class=None):
        super().__init__(self.CLASS)

        self.object_class = object_class

    def to_json(self):
        function_json = super().to_json()

        if self.object_class is not None:
            function_json['objectClass'] = self.object_class

        return function_json

      
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


def load_function_json_map():
    for name, class_obj in inspect.getmembers(
            sys.modules[__name__], inspect.isclass):
        if hasattr(class_obj, 'CLASS'):
            JsonConverter.GENERIC_JSON_CONVERTERS[class_obj.CLASS] = \
                lambda obj, class_obj=class_obj: class_obj(**obj)
    JsonConverter.CUSTOM_JSON_CONVERTERS[
        FunctionContext.CLASS] = function_context_converter
    JsonConverter.CUSTOM_JSON_CONVERTERS[Function.CLASS] = function_converter


load_function_json_map()
