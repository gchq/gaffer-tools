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
from gafferpy import gaffer_connector


class GafferFunctionsIntegrationTest(unittest.TestCase):
    def test_all_functions_have_classes(self):
        gc = gaffer_connector.GafferConnector(
            'http://localhost:8080/rest/latest')
        functions = gc.execute_get(
            g.GetTransformFunctions()
        )
        functions = json.loads(functions)

        ignore_functions = [
            'uk.gov.gchq.gaffer.operation.data.generator.EdgeIdExtractor',
            'uk.gov.gchq.gaffer.store.util.AggregatorUtil$ToIngestElementKey',
            'uk.gov.gchq.gaffer.rest.example.ExampleDomainObjectGenerator',
            'uk.gov.gchq.gaffer.data.element.function.ElementTransformer',
            'uk.gov.gchq.gaffer.traffic.generator.RoadTrafficCsvElementGenerator',
            'uk.gov.gchq.gaffer.store.util.AggregatorUtil$ToElementKey',
            'uk.gov.gchq.koryphe.function.FunctionComposite',
            'uk.gov.gchq.gaffer.rest.example.ExampleTransformFunction',
            'uk.gov.gchq.gaffer.data.graph.function.walk.ExtractWalkEdgesFromHop',
            'uk.gov.gchq.gaffer.traffic.transform.DescriptionTransform',
            'uk.gov.gchq.gaffer.store.util.AggregatorUtil$ToQueryElementKey',
            'uk.gov.gchq.koryphe.tuple.TupleInputAdapter',
            'uk.gov.gchq.gaffer.operation.data.generator.EntityIdExtractor',
            'uk.gov.gchq.gaffer.traffic.generator.RoadTrafficStringElementGenerator',
            'uk.gov.gchq.gaffer.rest.example.ExampleElementGenerator',
        ]

        for i in ignore_functions:
            if i in functions: functions.remove(i)

        for op in functions:
            self.assertTrue(op in g.JsonConverter.GENERIC_JSON_CONVERTERS,
                            'Missing transform function class: ' + op)


if __name__ == "__main__":
    unittest.main()
