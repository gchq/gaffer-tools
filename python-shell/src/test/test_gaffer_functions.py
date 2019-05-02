#
# Copyright 2016-2019 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import json
import unittest

from gafferpy import gaffer as g


class GafferFunctionsTest(unittest.TestCase):
    examples = [
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.Concat",
                "separator" : "\u0020"
            }
            ''',
            g.Concat(
                separator=" "
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.Divide"
            }
            ''',
            g.Divide()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.DivideBy",
                "by" : 3
            }
            ''',
            g.DivideBy(
                by=3
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.ExtractKeys"
            }
            ''',
            g.ExtractKeys()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.DictionaryLookup",
                "dictionary": {
                    "One": 1,
                    "Two": 2,
                    "Three": 3
                }
            }
            ''',
            g.DictionaryLookup(dictionary=dict(One=1, Two=2, Three=3))
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.ExtractValue",
                "key" : "blueKey"
            }
            ''',
            g.ExtractValue(
                key="blueKey"
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.ExtractValues"
            }
            ''',
            g.ExtractValues()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.Identity"
            }
            ''',
            g.Identity()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.IsEmpty"
            }
            ''',
            g.IsEmpty()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.IterableConcat"
            }
            ''',
            g.IterableConcat()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.Multiply"
            }
            ''',
            g.Multiply()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.MultiplyBy",
                "by" : 4
            }
            ''',
            g.MultiplyBy(
                by=4
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.Size"
            }
            ''',
            g.Size()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.ToString"
            }
            ''',
            g.ToString()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.function.ToEntityId"
            }
            ''',
            g.ToEntityId()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.function.FromEntityId"
            }
            ''',
            g.FromEntityId()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.function.ToElementId"
            }
            ''',
            g.ToElementId()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.operation.function.FromElementId"
            }
            ''',
            g.FromElementId()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.types.function.ToTypeValue"
            }
            ''',
            g.ToTypeValue()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.types.function.ToTypeSubTypeValue"
            }
            ''',
            g.ToTypeSubTypeValue()
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.data.generator.MapGenerator",
              "fields" : {
                "GROUP" : "Group Label",
                "VERTEX" : "Vertex Label",
                "SOURCE" : "Source Label",
                "count" : "Count Label"
              },
              "constants" : {
                "A Constant" : "Some constant value"
              }
            }
            ''',
            g.MapGenerator(
                fields={
                    'VERTEX': 'Vertex Label',
                    'count': 'Count Label',
                    'GROUP': 'Group Label',
                    'SOURCE': 'Source Label'
                },
                constants={
                    'A Constant': 'Some constant value'
                }
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.data.generator.CsvGenerator",
              "fields" : {
                "GROUP" : "Group Label",
                "VERTEX" : "Vertex Label",
                "SOURCE" : "Source Label",
                "count" : "Count Label"
              },
              "constants" : {
                "A Constant" : "Some constant value"
              },
              "quoted" : true,
              "commaReplacement": "-"
            }
            ''',
            g.CsvGenerator(
                fields={
                    'VERTEX': 'Vertex Label',
                    'count': 'Count Label',
                    'GROUP': 'Group Label',
                    'SOURCE': 'Source Label'
                },
                constants={
                    'A Constant': 'Some constant value'
                },
                quoted=True,
                comma_replacement="-"
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.data.generator.JsonToElementGenerator"
            }
            ''',
            g.JsonToElementGenerator()
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.types.function.FreqMapExtractor",
              "key" : "key1"
            }
            ''',
            g.FreqMapExtractor(key="key1")
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.function.FunctionMap",
              "function" : {
                "class" : "uk.gov.gchq.koryphe.impl.function.MultiplyBy",
                "by" : 10
              }
            }
            ''',
            g.FunctionMap(
                function=g.MultiplyBy(by=10)
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEdges"
            }
            ''',
            g.ExtractWalkEdges()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEdgesFromHop",
                "hop" : 2
            }
            ''',
            g.ExtractWalkEdgesFromHop(
                hop=2
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEntities"
            }
            ''',
            g.ExtractWalkEntities()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEntitiesFromHop",
                "hop" : 1
            }
            ''',
            g.ExtractWalkEntitiesFromHop(
                hop=1
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkVertex"
            }
            ''',
            g.ExtractWalkVertex()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.Length",
                "maxLength" : 100000
            }
            ''',
            g.Length(
                max_length=100000
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.data.element.function.ExtractId",
                "id" : "VERTEX"
            }
            ''',
            g.ExtractId(
                id='VERTEX'
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.data.element.function.ExtractProperty",
                "name" : "countByVehicleType"
            }
            ''',
            g.ExtractProperty(
                name="countByVehicleType"
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.data.element.function.ExtractGroup"
            }
            ''',
            g.ExtractGroup()
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.CallMethod",
                "method": "someMethod"
            }
            ''',
            g.CallMethod(method="someMethod")
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.gaffer.data.element.function.UnwrapEntityId"
            }
            ''',
            g.UnwrapEntityId()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.SetValue",
                "value": "value2"
            }
            ''',
            g.SetValue(value="value2")
        ],
        [
            '''
            {
                "class":"uk.gov.gchq.koryphe.impl.function.If",
                "predicate":{"class":"uk.gov.gchq.koryphe.impl.predicate.IsA","type":"java.lang.Integer"},
                "then":{"class":"uk.gov.gchq.koryphe.impl.function.SetValue","value":"value2"},
                "otherwise":{"class":"uk.gov.gchq.koryphe.impl.function.SetValue","value":"value3"}
            }
            ''',
            g.func.If(
                predicate=g.IsA(type="java.lang.Integer"),
                then=g.SetValue(value="value2"),
                otherwise=g.SetValue(value="value3")
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.ToArray"
            }
            ''',
            g.func.ToArray()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.ToList"
            }
            ''',
            g.func.ToList()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.ToSet"
            }
            ''',
            g.func.ToSet()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.types.function.ToFreqMap"
            }
            ''',
            g.func.ToFreqMap()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.types.function.FreqMapPredicator",
                "predicate": {
                    "class": "uk.gov.gchq.koryphe.impl.predicate.IsA",
                    "type": "java.lang.String"
                }
            }
            ''',
            g.FreqMapPredicator(
                predicate=g.IsA(
                    type="java.lang.String"
                )
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.IterableFilter",
                "predicate": {
                    "class": "uk.gov.gchq.koryphe.impl.predicate.IsA",
                    "type": "java.lang.String"
                }
            }
            ''',
            g.func.IterableFilter(
                predicate=g.IsA(type="java.lang.String")
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.MapFilter"
            }
            ''',
            g.func.MapFilter()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.MapFilter",
                "keyPredicate": {
                    "class":"uk.gov.gchq.koryphe.impl.predicate.StringContains",
                    "value":"someValue",
                    "ignoreCase":false
                }
            }
            ''',
            g.func.MapFilter(
                key_predicate=g.pred.StringContains(
                    value="someValue",
                    ignore_case=False
                )
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.MapFilter",
                "keyPredicate": {
                    "class":"uk.gov.gchq.koryphe.impl.predicate.StringContains",
                    "value":"someValue",
                    "ignoreCase":false
                },
                "valuePredicate": {
                    "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                    "orEqualTo" : false,
                    "value" : 0
                }
            }
            ''',
            g.func.MapFilter(
                key_predicate=g.pred.StringContains(
                    value="someValue",
                    ignore_case=False
                ),
                value_predicate=g.pred.IsMoreThan(
                    value=0,
                    or_equal_to=False
                )
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.MapFilter",
                "keyValuePredicate": {
                    "class": "uk.gov.gchq.koryphe.impl.predicate.AreEqual"
                }
            }
            ''',
            g.func.MapFilter(
                key_value_predicate=g.pred.AreEqual()
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.function.CreateObject",
                "objectClass" : "java.lang.Long"
            }
            ''',
            g.func.CreateObject(
                object_class="java.lang.Long"
            )
        ],     
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.time.function.MaskTimestampSetByTimeRange",
                "startTime": {
                    "java.lang.Long": 15300000000000
                },
                "endTime": {
                    "java.lang.Long": 15400000000000
                }
            }
            ''',
            g.func.MaskTimestampSetByTimeRange(
                start_time=g.long(15300000000000),
                end_time=g.long(15400000000000)
            )
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.time.function.MaskTimestampSetByTimeRange",
                "startTime": {
                    "java.lang.Long": 15300000000000
                },
                "endTime": {
                    "java.lang.Long": 15400000000000
                },
                "timeUnit": "SECOND"
            }
            ''',
            g.func.MaskTimestampSetByTimeRange(
                start_time=g.long(15300000000000),
                end_time=g.long(15400000000000),
                time_unit=g.TimeUnit.SECOND
            )
        ]
    ]

    def test_examples(self):
        for example in self.examples:
            self.assertEqual(
                json.loads(example[0]),
                example[1].to_json(),
                "json failed: \n" + example[0] + "\n"
                + g.JsonConverter.from_json(example[0]).to_code_string()
            )
            g.JsonConverter.from_json(example[0], validate=True)


if __name__ == "__main__":
    unittest.main()
