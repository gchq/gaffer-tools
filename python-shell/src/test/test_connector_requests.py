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

import unittest
import json

from gafferpy import gaffer as g
from gafferpy import gaffer_connector_requests


class GafferConnectorTest(unittest.TestCase):
    def test_execute_operation(self):
        gc = gaffer_connector_requests.GafferConnector('http://localhost:8080/rest/latest')
        elements = gc.execute_operation(
            g.GetElements(
                input=[
                    g.EntitySeed('M5:10')
                ],
                view=g.View(
                    edges=[
                        g.ElementDefinition(
                            group='JunctionLocatedAt'
                        )
                    ]
                )
            )
        )

        self.assertEqual(
            [g.Edge("JunctionLocatedAt", "M5:10", "390466,225615", True, {},
                    "SOURCE")],
            elements)

    def test_is_operation_supported(self):
        gc = gaffer_connector_requests.GafferConnector('http://localhost:8080/rest/latest')

        response_text = gc.is_operation_supported(
            g.IsOperationSupported(
                operation='uk.gov.gchq.gaffer.operation.impl.get.GetAllElements'
            )
        )

        expected_response_text = '''
        {
          "name": "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements",
          "summary": "Gets all elements compatible with a provided View",
          "fields": [
            {
              "name": "view",
              "className": "uk.gov.gchq.gaffer.data.elementdefinition.view.View",
              "required": false
            },
            {
              "name": "options",
              "className": "java.util.Map<java.lang.String,java.lang.String>",
              "required": false
            },
            {
              "name": "directedType",
              "summary": "Is the Edge directed?",
              "className": "java.lang.String",
              "options": [
                "DIRECTED",
                "UNDIRECTED",
                "EITHER"
              ],
              "required": false
            },
            {
              "name": "views",
              "className": "java.util.List<uk.gov.gchq.gaffer.data.elementdefinition.view.View>",
              "required": false
            }
          ],
          "next": [
            "uk.gov.gchq.gaffer.operation.impl.add.AddElements",
            "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
            "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
            "uk.gov.gchq.gaffer.operation.impl.export.set.ExportToSet",
            "uk.gov.gchq.gaffer.operation.impl.output.ToArray",
            "uk.gov.gchq.gaffer.operation.impl.output.ToEntitySeeds",
            "uk.gov.gchq.gaffer.operation.impl.output.ToList",
            "uk.gov.gchq.gaffer.operation.impl.output.ToMap",
            "uk.gov.gchq.gaffer.operation.impl.output.ToCsv",
            "uk.gov.gchq.gaffer.operation.impl.output.ToSet",
            "uk.gov.gchq.gaffer.operation.impl.output.ToStream",
            "uk.gov.gchq.gaffer.operation.impl.output.ToVertices",
            "uk.gov.gchq.gaffer.named.operation.NamedOperation",
            "uk.gov.gchq.gaffer.operation.impl.compare.Max",
            "uk.gov.gchq.gaffer.operation.impl.compare.Min",
            "uk.gov.gchq.gaffer.operation.impl.compare.Sort",
            "uk.gov.gchq.gaffer.operation.impl.GetWalks",
            "uk.gov.gchq.gaffer.operation.impl.generate.GenerateElements",
            "uk.gov.gchq.gaffer.operation.impl.generate.GenerateObjects",
            "uk.gov.gchq.gaffer.operation.impl.Validate",
            "uk.gov.gchq.gaffer.operation.impl.Count",
            "uk.gov.gchq.gaffer.operation.impl.CountGroups",
            "uk.gov.gchq.gaffer.operation.impl.Limit",
            "uk.gov.gchq.gaffer.operation.impl.DiscardOutput",
            "uk.gov.gchq.gaffer.operation.impl.Map",
            "uk.gov.gchq.gaffer.operation.impl.If",
            "uk.gov.gchq.gaffer.operation.impl.While",
            "uk.gov.gchq.gaffer.operation.impl.ForEach",
            "uk.gov.gchq.gaffer.operation.impl.output.ToSingletonList",
            "uk.gov.gchq.gaffer.operation.impl.Reduce",
            "uk.gov.gchq.gaffer.operation.impl.join.Join",
            "uk.gov.gchq.gaffer.operation.impl.SetVariable",
            "uk.gov.gchq.gaffer.operation.impl.function.Filter",
            "uk.gov.gchq.gaffer.operation.impl.function.Transform",
            "uk.gov.gchq.gaffer.operation.impl.function.Aggregate",
            "uk.gov.gchq.gaffer.mapstore.operation.CountAllElementsDefaultView",
            "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherAuthorisedGraph",
            "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherGraph",
            "uk.gov.gchq.gaffer.operation.impl.export.resultcache.ExportToGafferResultCache"
          ],
          "exampleJson": {
            "class": "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
          },
          "outputClassName": "uk.gov.gchq.gaffer.commonutil.iterable.CloseableIterable<uk.gov.gchq.gaffer.data.element.Element>"
        }
            '''

        self.assertEqual(
            json.loads(expected_response_text),
            json.loads(response_text)
        )

    def test_execute_get(self):
        self.maxDiff = None
        gc = gaffer_connector_requests.GafferConnector('http://localhost:8080/rest/latest')

        response_text = gc.execute_get(
            g.GetOperations()
        )

        expected_response_text = '''
        [
            "uk.gov.gchq.gaffer.operation.impl.add.AddElements",
            "uk.gov.gchq.gaffer.operation.impl.get.GetElements",
            "uk.gov.gchq.gaffer.operation.impl.get.GetAdjacentIds",
            "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements",
            "uk.gov.gchq.gaffer.operation.impl.export.set.ExportToSet",
            "uk.gov.gchq.gaffer.operation.impl.export.set.GetSetExport",
            "uk.gov.gchq.gaffer.operation.impl.export.GetExports",
            "uk.gov.gchq.gaffer.operation.impl.job.GetJobDetails",
            "uk.gov.gchq.gaffer.operation.impl.job.GetAllJobDetails",
            "uk.gov.gchq.gaffer.operation.impl.job.GetJobResults",
            "uk.gov.gchq.gaffer.operation.impl.output.ToArray",
            "uk.gov.gchq.gaffer.operation.impl.output.ToEntitySeeds",
            "uk.gov.gchq.gaffer.operation.impl.output.ToList",
            "uk.gov.gchq.gaffer.operation.impl.output.ToMap",
            "uk.gov.gchq.gaffer.operation.impl.output.ToCsv",
            "uk.gov.gchq.gaffer.operation.impl.output.ToSet",
            "uk.gov.gchq.gaffer.operation.impl.output.ToStream",
            "uk.gov.gchq.gaffer.operation.impl.output.ToVertices",
            "uk.gov.gchq.gaffer.named.operation.NamedOperation",
            "uk.gov.gchq.gaffer.named.operation.AddNamedOperation",
            "uk.gov.gchq.gaffer.named.operation.GetAllNamedOperations",
            "uk.gov.gchq.gaffer.named.operation.DeleteNamedOperation",
            "uk.gov.gchq.gaffer.named.view.AddNamedView",
            "uk.gov.gchq.gaffer.named.view.GetAllNamedViews",
            "uk.gov.gchq.gaffer.named.view.DeleteNamedView",
            "uk.gov.gchq.gaffer.operation.impl.compare.Max",
            "uk.gov.gchq.gaffer.operation.impl.compare.Min",
            "uk.gov.gchq.gaffer.operation.impl.compare.Sort",
            "uk.gov.gchq.gaffer.operation.OperationChain",
            "uk.gov.gchq.gaffer.operation.OperationChainDAO",
            "uk.gov.gchq.gaffer.operation.impl.ValidateOperationChain",
            "uk.gov.gchq.gaffer.operation.impl.GetWalks",
            "uk.gov.gchq.gaffer.operation.impl.generate.GenerateElements",
            "uk.gov.gchq.gaffer.operation.impl.generate.GenerateObjects",
            "uk.gov.gchq.gaffer.operation.impl.Validate",
            "uk.gov.gchq.gaffer.operation.impl.Count",
            "uk.gov.gchq.gaffer.operation.impl.CountGroups",
            "uk.gov.gchq.gaffer.operation.impl.Limit",
            "uk.gov.gchq.gaffer.operation.impl.DiscardOutput",
            "uk.gov.gchq.gaffer.store.operation.GetSchema",
            "uk.gov.gchq.gaffer.operation.impl.Map",
            "uk.gov.gchq.gaffer.operation.impl.If",
            "uk.gov.gchq.gaffer.operation.impl.While",
            "uk.gov.gchq.gaffer.operation.impl.ForEach",
            "uk.gov.gchq.gaffer.operation.impl.output.ToSingletonList",
            "uk.gov.gchq.gaffer.operation.impl.Reduce",
            "uk.gov.gchq.gaffer.operation.impl.join.Join",
            "uk.gov.gchq.gaffer.operation.impl.job.CancelScheduledJob",
            "uk.gov.gchq.gaffer.operation.impl.SetVariable",
            "uk.gov.gchq.gaffer.operation.impl.GetVariable",
            "uk.gov.gchq.gaffer.operation.impl.GetVariables",
            "uk.gov.gchq.gaffer.operation.impl.function.Filter",
            "uk.gov.gchq.gaffer.operation.impl.function.Transform",
            "uk.gov.gchq.gaffer.operation.impl.function.Aggregate",
            "uk.gov.gchq.gaffer.store.operation.GetTraits",
            "uk.gov.gchq.gaffer.mapstore.operation.CountAllElementsDefaultView",
            "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherAuthorisedGraph",
            "uk.gov.gchq.gaffer.operation.export.graph.ExportToOtherGraph",
            "uk.gov.gchq.gaffer.operation.impl.export.resultcache.ExportToGafferResultCache",
            "uk.gov.gchq.gaffer.operation.impl.export.resultcache.GetGafferResultCacheExport"
        ]
        '''

        self.assertEqual(
            json.loads(expected_response_text),
            json.loads(response_text)
        )

    def test_dummy_header(self):
        """Test that the addition of a dummy header does not effect the standard test"""
        gc = gaffer_connector_requests.GafferConnector('http://localhost:8080/rest/latest', headers={"dummy_Header": "value"})
        elements = gc.execute_operation(
            g.GetElements(
                input=[
                    g.EntitySeed('M5:10')
                ],
                view=g.View(
                    edges=[
                        g.ElementDefinition(
                            group='JunctionLocatedAt'
                        )
                    ]
                )
            )
        )

        self.assertEqual(
            [g.Edge("JunctionLocatedAt", "M5:10", "390466,225615", True, {},
                    "SOURCE")],
            elements)

    def test_class_initilisation(self):
        """Test that the gaffer_connector class is correctly initialised with instance attributes"""
        host = 'http://localhost:8080/rest/latest'
        verbose = False
        headers = {'User-Agent': 'python-requests/2.25.1', 'Accept-Encoding': 'gzip, deflate', 'Accept': '*/*', 'Connection': 'keep-alive', 'dummy_Header': 'value'}
        gc = gaffer_connector_requests.GafferConnector(host, verbose, headers)

        actuals = [gc._host, gc._verbose, gc._session.headers]
        expecteds = [host, verbose, headers]

        for actual, expected in zip(actuals, expecteds):
            self.assertEqual(actual, expected)

    def test_raise_connection_error(self):
        """Test that a ConnectionError is correctly raised when a HTTP 404 error is caught"""
        # Define a host that has an invalid endpoint in order to get a HTTP 404 error
        host_with_bad_endpoint = "http://localhost:8080/badEndPoint"
        gc = gaffer_connector_requests.GafferConnector(host_with_bad_endpoint)

        # Check that a ConnectionError is raised (which is catching the underlying HTTP 404)
        with self.assertRaises(ConnectionError):
            gc.execute_get(g.GetOperations())

if __name__ == "__main__":
    unittest.main()
