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


class GafferPredicatesIntegrationTest(unittest.TestCase):
    def test_all_predicates_have_classes(self):
        gc = gaffer_connector.GafferConnector(
            'http://localhost:8080/rest/latest')
        predicates = gc.execute_get(
            g.GetFilterFunctions()
        )
        predicates = json.loads(predicates)

        ignore_predicates = [
            'uk.gov.gchq.koryphe.predicate.AdaptedPredicate',
            'uk.gov.gchq.koryphe.predicate.AdaptedPredicate',
            'uk.gov.gchq.koryphe.predicate.PredicateComposite',
            'uk.gov.gchq.gaffer.rest.example.ExampleFilterFunction',
            'uk.gov.gchq.koryphe.tuple.predicate.TupleAdaptedPredicate',
            'uk.gov.gchq.gaffer.data.element.function.ElementFilter',
            'uk.gov.gchq.koryphe.tuple.predicate.TupleAdaptedPredicateComposite',
            'uk.gov.gchq.gaffer.store.util.AggregatorUtil$IsElementAggregated',
            'uk.gov.gchq.gaffer.graph.hook.migrate.predicate.TransformAndFilter'
        ]

        for i in ignore_predicates:
            if i in predicates: predicates.remove(i)

        for op in predicates:
            self.assertTrue(op in g.JsonConverter.GENERIC_JSON_CONVERTERS,
                            'Missing predicate class: ' + op)


if __name__ == "__main__":
    unittest.main()
