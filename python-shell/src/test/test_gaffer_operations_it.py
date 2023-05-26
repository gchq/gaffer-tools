#
# Copyright 2016-2022 Crown Copyright
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


class GafferOperationsIntegrationTest(unittest.TestCase):
    def test_all_supported_operations_have_classes(self):
        gc = gaffer_connector.GafferConnector(
            'http://localhost:8080/rest/latest')
        operations = gc.execute_get(
            g.GetOperations()
        )
        operations = json.loads(operations)
        for op in operations:
            self.assertTrue(op in g.JsonConverter.GENERIC_JSON_CONVERTERS,
                            'Missing operation class: ' + op)

    def test_all_supported_operation_examples(self):
        gc = gaffer_connector.GafferConnector(
            'http://localhost:8080/rest/latest')
        operation_details = gc.execute_get(
            g.GetOperationsDetails(), json_result=True
        )
        for detail in operation_details:
            try:
                gc.execute_operation(
                    g.JsonConverter.from_json(
                        detail["exampleJson"],
                        class_name=detail["name"]))
            except ConnectionError as e:
                # Ignore 500 as a lot of operation examples won't run as they have dummy data
                # We just care they are valid operations and don't return 400 error
                if "HTTP error 500" in e.__str__():
                    pass
                else:
                    raise e

    def _get_all_subclasses(self, cls):
        all_subclasses = []

        for subclass in cls.__subclasses__():
            if hasattr(subclass, "CLASS"):
                all_subclasses.append(subclass)
                all_subclasses.extend(self._get_all_subclasses(subclass))

        return all_subclasses

    def test_all_operation_classes_are_valid(self):
        # TODO: This should be in fishbowl tests in the future
        # only the spring-rest has this endpoint
        gc = gaffer_connector.GafferConnector('http://localhost:8080/rest/latest')

        try:
            response = gc.execute_get(
                g.GetOperationsDetailsAll(),
                json_result=True
            )
        except BaseException:
            return

        response = [operation["name"] for operation in response]

        operation_subclasses = self._get_all_subclasses(g.Operation)
        expected_response = set(c.CLASS for c in operation_subclasses)

        self.assertEqual(
            sorted(expected_response),
            sorted(response)
        )


if __name__ == "__main__":
    unittest.main()
