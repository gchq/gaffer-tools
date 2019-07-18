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

import pyspark.sql as sql

def flattenElementDict(input, schema=None):
    elementDict = input[0]
    if schema == None:
        res = {}
    else:
        res = schema
    for key in elementDict.keys():
        if key != 'properties':
            res[key] = elementDict[key]
        else:
            for propName in elementDict['properties']:
                res[propName] = elementDict['properties'][propName]
    return res

def mergeRowSchemasAsDict(rowSchemas):
    merged = {}
    for key in rowSchemas.keys():
        for entry in rowSchemas[key]:
            merged[entry] = None
    return merged

def toRow(element,rowSchemas):
    mergedSchemasDict = mergeRowSchemasAsDict(rowSchemas)
    flattened = flattenElementDict(element, mergedSchemasDict)
    return sql.Row(**flattened)
