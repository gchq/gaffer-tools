#
# Copyright 2021 Crown Copyright
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
    print('Running Map operations')
    print('--------------------------')
    print()

    count_all_elements_default_view(gc)


def create_connector(host, verbose=False):
    return gaffer_connector.GafferConnector(host, verbose)


def count_all_elements_default_view(gc):
    # Get Elements
    elements = gc.execute_operation(
        g.CountAllElementsDefaultView()
    )
    print('Count of all Elements in default View')
    print(elements)
    print()

if __name__ == "__main__":
    run('http://localhost:8080/rest/latest', False)
