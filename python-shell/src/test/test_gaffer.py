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

import unittest

from gafferpy import gaffer as g


class GafferTest(unittest.TestCase):
    def test_create_edge_seed(self):
        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
                'source': 'src',
                'destination': 'dest',
                'directed': 'DIRECTED'
            },
            g.EdgeSeed("src", "dest", g.DirectedType.DIRECTED).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
                'source': 'src',
                'destination': 'dest',
                'directed': 'UNDIRECTED'
            },
            g.EdgeSeed("src", "dest", g.DirectedType.UNDIRECTED).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
                'source': 'src',
                'destination': 'dest',
                'directed': 'EITHER'
            },
            g.EdgeSeed("src", "dest", g.DirectedType.EITHER).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
                'source': 1,
                'destination': 2,
                'directed': 'DIRECTED'
            },
            g.EdgeSeed(1, 2, True).to_json()
        )

        self.assertEqual(
            {
                'class': 'uk.gov.gchq.gaffer.operation.data.EdgeSeed',
                'source': 1,
                'destination': 2,
                'directed': 'UNDIRECTED'
            },
            g.EdgeSeed(1, 2, False).to_json()
        )


if __name__ == "__main__":
    unittest.main()
