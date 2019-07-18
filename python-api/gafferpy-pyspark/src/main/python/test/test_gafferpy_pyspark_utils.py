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

from gafferpy_pyspark.pyspark_utils import flattenElementDict, mergeRowSchemasAsDict
from unittest.mock import patch, MagicMock
import unittest
import os
import sys

dirname = os.path.dirname(__file__)
gafferpy_core = os.path.join(
    dirname, '../../../../../gafferpy-core/src/main/python/')

if sys.path.count(gafferpy_core) is 0:
    sys.path.append(gafferpy_core)


class gaffer_pyspark_utils_test(unittest.TestCase):

    def test_flattenElementDict_returns_a_flat_dict(self):
        result = flattenElementDict(input=[{"class": "uk.gov.gchq.gaffer.data.element.Entity",
                                            "group": "entity",
                                            "vertex": 3,
                                            "properties": {
                                                "count": 2
                                            }}])
        expected_result = {
            "class": "uk.gov.gchq.gaffer.data.element.Entity",
            "group": "entity",
            "vertex": 3,
            "count": 2
        }
        self.assertEqual(result, expected_result)

    def test_flattenElementDict_flattens_an_element_with_properties(self):

        result = flattenElementDict(input=[{"class": "uk.gov.gchq.gaffer.data.element.Edge",
                                            "group": "edge",
                                            "source": 2,
                                            "destination": 5,
                                            "directed": True,
                                            "matchedVertex": "SOURCE",
                                            "properties": {
                                                "count": 1
                                            }
                                            }])

        self.assertEqual(result, {"class": "uk.gov.gchq.gaffer.data.element.Edge",
                                  "group": "edge",
                                  "source": 2,
                                  "destination": 5,
                                  "directed": True,
                                  "matchedVertex": "SOURCE",
                                  "count": 1
                                  })

    def test_flattenElementDict_works_with_schema(self):
        result = flattenElementDict(input=[{"class": "uk.gov.gchq.gaffer.data.element.Edge",
                                            "group": "edge",
                                            "source": 2,
                                            "destination": 5,
                                            "directed": True,
                                            "matchedVertex": "SOURCE"
                                            }],
                                    schema={"class": "",
                                            "group": "",
                                            "source": 0,
                                            "destination": "",
                                            "directed": False,
                                            'matchedVertex': ""
                                            })

        self.assertEqual(result, {"class": "uk.gov.gchq.gaffer.data.element.Edge",
                                  "group": "edge",
                                  "source": 2,
                                  "destination": 5,
                                  "directed": True,
                                  "matchedVertex": "SOURCE"
                                  })

    def test_mergeRowSchemasAsDict_merges_rows_into_dicts(self):

        schema = dict(
            test="test",
            alpha="a",
            beta="b",
            charlie="c"
        )

        result = mergeRowSchemasAsDict(rowSchemas=schema)
        self.assertEqual(result, {"t": None, "e": None, "s": None, "t": None, "a": None, "b": None, "c": None})


    def test_toRow_creates_rows(self):
        pass


if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(gaffer_pyspark_utils_test)
    unittest.TextTestRunner(verbosity=2).run(suite)
