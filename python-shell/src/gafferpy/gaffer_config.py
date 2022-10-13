#
# Copyright 2016-2022 Crown Copyright
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

"""
This module contains Python copies of Gaffer config java classes
"""
import inspect
import sys

from gafferpy.gaffer_core import JsonConverter


class GetGraph:
    def __init__(self, _url=''):
        self._url = _url

    def get_url(self):
        return self._url


# Import generated config implementations from fishbowl
from gafferpy.generated_api.config import *

# Add an alternative name for GetFilterFunctions


class GetClassFilterFunctions(GetFilterFunctions):
    def __init__(self, class_name=''):
        super().__init__(class_name)


class IsOperationSupported:
    def __init__(self, operation=None):
        self.operation = operation

    def get_operation(self):
        return self.operation


def load_config_json_map():
    for name, class_obj in inspect.getmembers(
            sys.modules[__name__], inspect.isclass):
        if hasattr(class_obj, 'CLASS'):
            JsonConverter.GENERIC_JSON_CONVERTERS[class_obj.CLASS] = \
                lambda obj, class_obj=class_obj: class_obj(**obj)


load_config_json_map()
