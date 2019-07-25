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

from gafferpy import gaffer as g
from gafferpy import gaffer_connector


class GafferConnectorTest(unittest.TestCase):
    def test_execute_operation(self):
        gc = gaffer_connector.GafferConnector('http://localhost:8080/rest/latest')
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


if __name__ == "__main__":
    unittest.main()
