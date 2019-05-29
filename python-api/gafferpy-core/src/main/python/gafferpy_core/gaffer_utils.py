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

from gafferpy_core import gaffer as g
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
logger.addHandler(ch)

class ElementIterator():
    """
    A class that wraps the Java class uk.gov.gchq.gaffer.pyspark.data.PythonIterator
    Calling next pulls the next element-map off the java iterator and converts it to a python element
    using the preferred serialiser
    """
    _java_iterator = None

    def __iter__(self):
        return self

    def __init__(self, javaElementMapIterator):
        self._java_iterator = javaElementMapIterator

    def __next__(self):
        try:
            result = convertElement(self._java_iterator.next())
        except IndexError:
            raise StopIteration

        return result

    #make this closeable; add a new method 'close' like the java ones

    def next(self):
        return self.__next__()

    def has_next(self):
        return self._java_iterator.hasNext()



def convertElement(input):
    """

    :param input:
    :return:
    """

    if isinstance(input, tuple):
    #pyspark rdd returns a 2-tuple where the first entry is a Gaffer element and the second is a Nullwritable
        map = input[0]
        if "json" in map:
            result = g.JsonConverter.from_json(map.get("json"))
            return result
        if (map.get("type") == "entity" or map.get("type") == "edge"):
            properties = map.get("properties")
    else:
    #python
        map = input
        if "json" in map:
            result = g.JsonConverter.from_json(map.get("json"))
            return result
        if (map.get("type") == "entity" or map.get("type") == "edge"):
            java_properties = map.get("properties")
            properties = {}
            for prop_name in java_properties.keySet():
                properties[prop_name] = java_properties.get(prop_name)

    if map.get("type") == "entity":
        entity = g.Entity(map.get("group"), map.get("vertex"), properties=properties)
        return entity
    elif map.get("type") == "edge":
        directed = True
        if map.get("directed") == 0:
            directed = False
        if "matched_vertex" in map:
            edge = g.Edge(map.get("group"), map.get("source"), map.get("destination"), directed, properties, matched_vertex=map.get("matched_vertex"))
        else:
            edge = g.Edge(map.get("group"), map.get("source"), map.get("destination"), directed, properties)
        return edge
    elif map.get("type") == "entity_seed":
        seed = g.EntitySeed(vertex=input.get("vertex"))
        return seed
    elif map.get("type") == "edge_seed":
        seed = g.EdgeSeed(source="source", destination="destination",directed_type="directed", matched_vertex="matched_vertex")
        return seed
