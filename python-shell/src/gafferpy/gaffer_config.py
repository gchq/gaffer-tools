#
# Copyright 2016-2019 Crown Copyright
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

from gafferpy.gaffer_core import *
import gafferpy.gaffer_operations as gaffer_operations


class GetGraph:
    def __init__(self, _url=''):
        self._url = _url

    def get_url(self):
        return self._url


class GetSchema(gaffer_operations.Operation, GetGraph):
    CLASS = 'uk.gov.gchq.gaffer.store.operation.GetSchema'

    def __init__(self,
                 compact=None,
                 options=None):
        super().__init__(_class_name=self.CLASS,
                         options=options)

        if compact is not None:
            self.compact = compact
        else:
            self.compact = False

        self._url = '/graph/config/schema'

    def to_json(self):
        operation = super().to_json()

        if self.compact is not None:
            operation['compact'] = self.compact

        return operation


class GetFilterFunctions(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/filterFunctions')


class GetTransformFunctions(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/transformFunctions')


class GetClassFilterFunctions(GetGraph):
    def __init__(self, class_name=None):
        super().__init__('/graph/config/filterFunctions/' + class_name)


class GetElementGenerators(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/elementGenerators')


class GetObjectGenerators(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/objectGenerators')


class GetOperations(GetGraph):
    def __init__(self):
        super().__init__('/graph/operations')


class GetSerialisedFields(GetGraph):
    def __init__(self, class_name=None):
        super().__init__('/graph/config/serialisedFields/' + class_name)


class GetStoreTraits(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/storeTraits')


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
