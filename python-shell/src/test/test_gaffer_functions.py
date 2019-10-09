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
                "class" : "uk.gov.gchq.koryphe.impl.function.ToString",
                "charset": "UTF-16"
            }
            ''',
            g.ToString(charset="UTF-16")
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
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.Base64Decode"
            }
            ''',
            g.func.Base64Decode()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.CsvLinesToMaps",
                "delimiter": "|",
                "header": ["my", "csv", "file"],
                "firstRow": 1,
                "quoted": true,
                "quoteChar": "'"
            }
            ''',
            g.func.CsvLinesToMaps(delimiter='|', header=["my", "csv", "file"], first_row=1, quoted=True,
                                  quote_char='\'')
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.CsvToMaps",
                "delimiter": "|",
                "header": ["my", "csv", "file"],
                "firstRow": 1,
                "quoted": true,
                "quoteChar": "'"
            }
            ''',
            g.func.CsvToMaps(delimiter='|', header=["my", "csv", "file"], first_row=1, quoted=True, quote_char='\'')
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.CurrentDate"
            }
            ''',
            g.func.CurrentDate()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.CurrentTime"
            }
            ''',
            g.func.CurrentTime()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.DeserialiseJson",
                "outputClass": "uk.gov.gchq.gaffer.data.element.Edge"
            }
            ''',
            g.func.DeserialiseJson(output_class=g.Edge.CLASS)
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.DeserialiseJson"
            }
            ''',
            g.func.DeserialiseJson()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.DeserialiseXml"
            }
            ''',
            g.func.DeserialiseXml()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.Gunzip"
            }
            ''',
            g.func.Gunzip()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.Increment",
                "increment": {
                    "java.lang.Long": 1000000
                }
            }
            ''',
            g.Increment(increment=g.long(1000000))
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.MapToTuple"
            }
            ''',
            g.func.MapToTuple()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.ParseDate",
                "timeZone": "BST",
                "format": "DD-MM-YYYY"
            }
            ''',
            g.func.ParseDate(time_zone="BST", format="DD-MM-YYYY")
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.ParseTime",
                "timeZone": "EST",
                "format": "MM-DD-YYYY HH:mm:ss.SSS",
                "timeUnit": "MICROSECOND"
            }
            ''',
            g.func.ParseTime(time_zone="EST", format="MM-DD-YYYY HH:mm:ss.SSS", time_unit=g.TimeUnit.MICROSECOND)
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.ToDateString",
                "format": "YYYY-MMM-dd"
            }
            ''',
            g.func.ToDateString(format="YYYY-MMM-dd")
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.ToBytes",
                "charset": "UTF-8"
            }
            ''',
            g.func.ToBytes(charset="UTF-8")
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.ApplyBiFunction",
                "function": {
                    "class": "uk.gov.gchq.koryphe.impl.binaryoperator.Sum"
                }
            }
            ''',
            g.func.ApplyBiFunction(function=g.gaffer_binaryoperators.Sum())
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.ApplyBiFunction",
                "function": {
                    "class": "uk.gov.gchq.koryphe.impl.binaryoperator.Product"
                }
            }
            ''',
            g.func.ApplyBiFunction(function={
                "class": "uk.gov.gchq.koryphe.impl.binaryoperator.Product"
            })
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.ToTuple"
            }
            ''',
            g.func.ToTuple()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.data.element.function.ToPropertiesTuple"
            }
            ''',
            g.func.ToPropertiesTuple()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.gaffer.data.element.function.ToElementTuple"
            }
            ''',
            g.func.ToElementTuple()
        ],
        [
            '''
            {
                "class": "uk.gov.gchq.koryphe.impl.function.FunctionChain",
                "functions": [
                    {
                        "class": "uk.gov.gchq.koryphe.impl.function.Base64Decode"
                    },
                    {
                        "class": "uk.gov.gchq.koryphe.impl.function.CsvLinesToMaps",
                        "delimiter": "|",
                        "quoted": true
                    }
                ]
            }
            ''',
            g.FunctionChain(functions=[
                g.Base64Decode(),
                g.CsvLinesToMaps(delimiter="|", quoted=True)
            ])
        ],
        [
            '''
            {
                "class":"uk.gov.gchq.koryphe.tuple.function.TupleAdaptedFunction",
                "selection":[0],
                "function": {
                    "class": "uk.gov.gchq.gaffer.operation.function.ToEntityId"
                },
                "projection": [1]
            }
            ''',
            g.TupleAdaptedFunction(selection=[0], function=g.ToEntityId(), projection=[1])
        ],
        [
            '''
            {
                "class":"uk.gov.gchq.koryphe.impl.function.FunctionChain",
                "functions": [
                    {
                        "class":"uk.gov.gchq.koryphe.tuple.function.TupleAdaptedFunction",
                        "selection":[0],
                        "function": {
                            "class": "uk.gov.gchq.koryphe.impl.function.ToUpperCase"
                        },
                        "projection": [1]
                    },
                    {
                        "class":"uk.gov.gchq.koryphe.tuple.function.TupleAdaptedFunction",
                        "selection": [1],
                        "function": {
                            "class": "uk.gov.gchq.koryphe.impl.function.ToSet"
                        },
                        "projection": [2]
                    }
                ]
            }
            ''',
            g.FunctionChain(functions=[
                g.TupleAdaptedFunction(selection=[0], function=g.ToUpperCase(), projection=[1]),
                g.TupleAdaptedFunction(selection=[1], function=g.gaffer_functions.ToSet(), projection=[2])
            ])
        ],
        [
            '''
            { 
                 "class": "uk.gov.gchq.koryphe.tuple.function.TupleAdaptedFunctionComposite",
                 "functions": [ 
                    { 
                       "selection": [ "something" ],
                       "function": { 
                          "class":"uk.gov.gchq.koryphe.impl.function.ToUpperCase"
                       },
                       "projection": [1]
                    }
                 ]
              }
            ''',
            g.TupleAdaptedFunctionComposite(
                functions=[g.FunctionContext(selection=["something"],
                                             function=g.ToUpperCase(),
                                             projection=[1]
                                             )
                           ]
            ),

        ],
        [
            '''
            { 
               "class": "uk.gov.gchq.koryphe.impl.function.FunctionChain",
               "functions": [ 
                  { 
                     "class": "uk.gov.gchq.koryphe.tuple.function.TupleAdaptedFunctionComposite",
                     "functions": [ 
                        { 
                           "selection": [0],
                           "function": { 
                              "class":"uk.gov.gchq.koryphe.impl.function.ToUpperCase"
                           },
                           "projection": [1]
                        }
                     ]
                  },
                  { 
                     "class": "uk.gov.gchq.koryphe.tuple.function.TupleAdaptedFunctionComposite",
                     "functions": [ 
                        { 
                           "selection": [1],
                           "function": { 
                              "class":"uk.gov.gchq.koryphe.impl.function.ToSet"
                           },
                           "projection": [2]
                        }
                     ]
                  }
               ]
            }
            ''',
            g.FunctionChain(functions=[
                g.TupleAdaptedFunctionComposite(
                    functions=[g.FunctionContext(selection=[0], function=g.ToUpperCase(), projection=[1])]),
                g.TupleAdaptedFunctionComposite(
                    functions=[g.FunctionContext(selection=[1], function=g.gaffer_functions.ToSet(), projection=[2])])
            ])
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
