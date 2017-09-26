#
# Copyright 2016 Crown Copyright
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


class GafferPredicatesTest(unittest.TestCase):
    examples = [
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.AgeOff",
              "ageOffTime" : 100000
            }
            ''',
            g.AgeOff(
                age_off_time=100000
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.And",
              "predicates" : [ {
                "class" : "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
                "orEqualTo" : false,
                "value" : 3
              }, {
                "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                "orEqualTo" : false,
                "value" : 0
              } ]
            }
            ''',
            g.And(
                predicates=[
                    g.IsLessThan(
                        value=3,
                        or_equal_to=False
                    ),
                    g.IsMoreThan(
                        value=0,
                        or_equal_to=False
                    )
                ]
            )
        ],
        [
            '''
            {
                "class" : "uk.gov.gchq.koryphe.impl.predicate.And",
                "predicates" : [ {
                  "class" : "uk.gov.gchq.koryphe.tuple.predicate.IntegerTupleAdaptedPredicate",
                  "predicate" : {
                    "class" : "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
                    "orEqualTo" : false,
                    "value" : 2
                  },
                  "selection" : [ 0 ]
                }, {
                  "class" : "uk.gov.gchq.koryphe.tuple.predicate.IntegerTupleAdaptedPredicate",
                  "predicate" : {
                    "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                    "orEqualTo" : false,
                    "value" : 5
                  },
                  "selection" : [ 1 ]
                } ]
              }
            ''',
            g.And(
                predicates=[
                    g.NestedPredicate(
                        selection=[
                            0
                        ],
                        predicate=g.IsLessThan(
                            value=2,
                            or_equal_to=False
                        )
                    ),
                    g.NestedPredicate(
                        selection=[
                            1
                        ],
                        predicate=g.IsMoreThan(
                            value=5,
                            or_equal_to=False
                        )
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.AreIn",
              "values" : [ 1, 2, 3 ]
            }
            ''',
            g.AreIn(
                values=[
                    1,
                    2,
                    3
                ]
            )

        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.CollectionContains",
              "value" : 1
            }
            ''',
            g.CollectionContains(
                value=1
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.Exists"
            }
            ''',
            g.Exists()
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.gaffer.sketches.clearspring.cardinality.predicate.HyperLogLogPlusIsLessThan",
              "orEqualTo" : false,
              "value" : 2
            }
            ''',
            g.HyperLogLogPlusIsLessThan(
                value=2,
                or_equal_to=False
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.IsA",
              "type" : "java.lang.String"
            }
            ''',
            g.IsA(
                type="java.lang.String"
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.IsEqual",
              "value" : 5
            }
            ''',
            g.IsEqual(
                value=5
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.IsFalse"
            }
            ''',
            g.IsFalse()
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.IsIn",
              "values" : [ 5, {
                "java.lang.Long" : 5
              }, "5", {
                "java.lang.Character" : "5"
              } ]
            }
            ''',
            g.IsIn(
                values=[
                    5,
                    {'java.lang.Long': 5},
                    "5",
                    {'java.lang.Character': '5'}
                ]
            )

        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
              "orEqualTo" : false,
              "value" : 5
            }
            ''',
            g.IsLessThan(
                value=5,
                or_equal_to=False
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
              "orEqualTo" : true,
              "value" : 5
            }
            ''',
            g.IsLessThan(
                value=5,
                or_equal_to=True
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
              "orEqualTo" : false,
              "value" : 5
            }
            ''',
            g.IsMoreThan(
                value=5,
                or_equal_to=False
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.IsShorterThan",
              "maxLength" : 4,
              "orEqualTo" : false
            }
            ''',
            g.IsShorterThan(
                or_equal_to=False,
                max_length=4
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.IsTrue"
            }
            ''',
            g.IsTrue()
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.IsXLessThanY"
            }
            ''',
            g.IsXLessThanY()
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.IsXMoreThanY"
            }
            ''',
            g.IsXMoreThanY()
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.MapContains",
              "key" : "a"
            }
            ''',
            g.MapContains(
                key="a"
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.MapContainsPredicate",
              "keyPredicate" : {
                "class" : "uk.gov.gchq.koryphe.impl.predicate.Regex",
                "value" : {
                  "java.util.regex.Pattern" : "a.*"
                }
              }
            }
            ''',
            g.MapContainsPredicate(
                key_predicate=g.Regex(
                    value={'java.util.regex.Pattern': 'a.*'}
                )
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.MultiRegex",
              "value" : [ {
                "java.util.regex.Pattern" : "[a-d]"
              }, {
                "java.util.regex.Pattern" : "[0-4]"
              } ]
            }
            ''',
            g.MultiRegex(
                value=[
                    {'java.util.regex.Pattern': '[a-d]'},
                    {'java.util.regex.Pattern': '[0-4]'}
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.Not",
              "predicate" : {
                "class" : "uk.gov.gchq.koryphe.impl.predicate.Exists"
              }
            }
            ''',
            g.Not(
                predicate=g.Exists()
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.Or",
              "predicates" : [ {
                "class" : "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
                "orEqualTo" : false,
                "value" : 2
              }, {
                "class" : "uk.gov.gchq.koryphe.impl.predicate.IsEqual",
                "value" : 5
              }, {
                "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                "orEqualTo" : false,
                "value" : 10
              } ]
            }
            ''',
            g.Or(
                predicates=[
                    g.IsLessThan(
                        value=2,
                        or_equal_to=False
                    ),
                    g.IsEqual(
                        value=5
                    ),
                    g.IsMoreThan(
                        value=10,
                        or_equal_to=False
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.Or",
              "predicates" : [ {
                "class" : "uk.gov.gchq.koryphe.tuple.predicate.IntegerTupleAdaptedPredicate",
                "predicate" : {
                  "class" : "uk.gov.gchq.koryphe.impl.predicate.IsLessThan",
                  "orEqualTo" : false,
                  "value" : 2
                },
                "selection" : [ 0 ]
              }, {
                "class" : "uk.gov.gchq.koryphe.tuple.predicate.IntegerTupleAdaptedPredicate",
                "predicate" : {
                  "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                  "orEqualTo" : false,
                  "value" : 10
                },
                "selection" : [ 1 ]
              } ]
            }
            ''',
            g.Or(
                predicates=[
                    g.NestedPredicate(
                        selection=[
                            0
                        ],
                        predicate=g.IsLessThan(
                            value=2,
                            or_equal_to=False
                        )
                    ),
                    g.NestedPredicate(
                        selection=[
                            1
                        ],
                        predicate=g.IsMoreThan(
                            value=10,
                            or_equal_to=False
                        )
                    )
                ]
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.predicate.PredicateMap",
              "predicate" : {
                "class" : "uk.gov.gchq.koryphe.impl.predicate.IsMoreThan",
                "orEqualTo" : false,
                "value" : {
                  "java.lang.Long" : 2
                }
              },
              "key" : "key1"
            }
            ''',
            g.PredicateMap(
                key="key1",
                predicate=g.IsMoreThan(
                    or_equal_to=False,
                    value={'java.lang.Long': 2}
                )
            )
        ],
        [
            '''
            {
              "class" : "uk.gov.gchq.koryphe.impl.predicate.Regex",
              "value" : {
                "java.util.regex.Pattern" : "[a-d0-4]"
              }
            }
            ''',
            g.Regex(
                value={'java.util.regex.Pattern': '[a-d0-4]'}
            )
        ],
        [
            '''
            {
                "class":"uk.gov.gchq.koryphe.impl.predicate.StringContains",
                "value":"someValue",
                "ignoreCase":false
            }
            ''',
            g.StringContains(
                value='someValue',
                ignore_case=False
            )
        ]
    ]

    def test_examples(self):
        for example in self.examples:
            self.assertEqual(
                json.loads(example[0]),
                example[1].to_json(),
                "json failed: \n" + example[0]
            )


if __name__ == "__main__":
    unittest.main()
