#
# Copyright 2022 Crown Copyright
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

"""
This module has been generated with fishbowl.
To make changes, either extend these classes or change fishbowl.
"""

from gafferpy.gaffer_config import GetGraph


class GetJobs(GetGraph):
    def __init__(self):
        super().__init__('/graph/jobs')


class GetStatus(GetGraph):
    def __init__(self):
        super().__init__('/graph/status')


class GetOperations(GetGraph):
    def __init__(self):
        super().__init__('/graph/operations')


class GetOperations(GetGraph):
    def __init__(self, class_name=''):
        super().__init__(
            '/graph/operations/{className}'.format(className=class_name))


class GetOperationsNext(GetGraph):
    def __init__(self, class_name=''):
        super().__init__(
            '/graph/operations/{className}/next'.format(className=class_name))


class GetOperationsExample(GetGraph):
    def __init__(self, class_name=''):
        super().__init__(
            '/graph/operations/{className}/example'.format(className=class_name))


class GetOperationsDetails(GetGraph):
    def __init__(self):
        super().__init__('/graph/operations/details')


class GetOperationsDetailsAll(GetGraph):
    def __init__(self):
        super().__init__('/graph/operations/details/all')


class GetJobs(GetGraph):
    def __init__(self, id=''):
        super().__init__('/graph/jobs/{id}'.format(id=id))


class GetJobsResults(GetGraph):
    def __init__(self, id=''):
        super().__init__('/graph/jobs/{id}/results'.format(id=id))


class GetTransformFunctions(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/transformFunctions')


class GetStoreTraits(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/storeTraits')


class GetSerialisedFields(GetGraph):
    def __init__(self, class_name=''):
        super().__init__(
            '/graph/config/serialisedFields/{className}'.format(className=class_name))


class GetSerialisedFieldsClasses(GetGraph):
    def __init__(self, class_name=''):
        super().__init__(
            '/graph/config/serialisedFields/{className}/classes'.format(className=class_name))


class GetSchema(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/schema')


class GetObjectGenerators(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/objectGenerators')


class GetId(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/graphId')


class GetFilterFunctions(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/filterFunctions')


class GetFilterFunctions(GetGraph):
    def __init__(self, input_class=''):
        super().__init__(
            '/graph/config/filterFunctions/{inputClass}'.format(inputClass=input_class))


class GetElementGenerators(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/elementGenerators')


class GetDescription(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/description')


class GetAggregationFunctions(GetGraph):
    def __init__(self):
        super().__init__('/graph/config/aggregationFunctions')
