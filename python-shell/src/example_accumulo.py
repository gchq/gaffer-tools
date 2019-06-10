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

from gafferpy import gaffer as g
from gafferpy import gaffer_connector


def run(host, verbose=False):
    return run_with_connector(create_connector(host, verbose))


def run_with_connector(gc):
    print()
    print('Running Accumulo operations')
    print('--------------------------')
    print()

    get_elements_between_sets(gc)
    get_elements_within_set(gc)
    get_elements_in_ranges(gc)


def create_connector(host, verbose=False):
    return gaffer_connector.GafferConnector(host, verbose)


def get_elements_between_sets(gc):
    # Get Elements
    elements = gc.execute_operation(
        g.GetElementsBetweenSets(
            input=[g.EntitySeed('M5')],
            input_b=[g.EntitySeed('M5:10'), g.EntitySeed('M5:11')],
            view=g.View(
                edges=[
                    g.ElementDefinition(
                        group='RoadUse',
                        group_by=[]
                    ),
                    g.ElementDefinition(
                        group='RoadHasJunction',
                        group_by=[]
                    )
                ]
            )
        )
    )
    print('Elements between sets')
    print(elements)
    print()


def get_elements_within_set(gc):
    # Get Elements within set
    elements = gc.execute_operation(
        g.GetElementsWithinSet(
            input=[
                g.EntitySeed('M5'),
                g.EntitySeed('M5:10'),
                g.EntitySeed('M5:11')
            ],
            view=g.View(
                edges=[
                    g.ElementDefinition(
                        group='RoadUse',
                        group_by=[]
                    ),
                    g.ElementDefinition(
                        group='RoadHasJunction',
                        group_by=[]
                    )
                ]
            )
        )
    )
    print('Elements within set')
    print(elements)
    print()


def get_elements_in_ranges(gc):
    # Get Elements in ranges
    elements = gc.execute_operation(
        g.GetElementsInRanges(
            input=[
                g.SeedPair(g.EntitySeed('M5:10'), g.EntitySeed('M5:12'))
            ],
            view=g.View(
                edges=[
                    g.ElementDefinition(
                        group='RoadUse',
                        group_by=[]
                    )
                ]
            )
        )
    )
    print('Elements in ranges')
    print(elements)
    print()


if __name__ == "__main__":
    run('http://localhost:8080/rest/latest', False)
