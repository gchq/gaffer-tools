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

import sys

from gafferpy import gaffer as g

if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise TypeError('JSON str argument is required')

    json_str = sys.argv[1]
    if len(sys.argv) > 2:
        class_name = sys.argv[2]
    else:
        class_name = None

    pythonObj = g.JsonConverter.from_json(json_str,
                                          class_name=class_name)
    if not isinstance(pythonObj, g.ToCodeString):
        raise TypeError('Unable to convert JSON to a Python: ' + json_str)

    print(pythonObj.to_code_string())
