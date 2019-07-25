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
Gaffer Graph Class
"""

import configparser
import logging

from py4j.java_collections import MapConverter, JavaIterator

from gafferpy_core import gaffer_session as Session
from gafferpy_core import gaffer_utils as u

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
logger.addHandler(ch)


class Graph():

    """
    A class that wraps the Java class uk.gov.gchq.gaffer.python.graph.Grapper
    Enables users in python to able to access all of the functionality of the 
    Graph, with simple interfaces like the Builder() and execute() functions
    """

    _gaffer_session = None

    _java_python_graph = None
    _python_serialisers = {
        'uk.gov.gchq.gaffer.data.element.Element' : 'uk.gov.gchq.gaffer.python.data.serialiser.PythonElementMapSerialiser',
        'uk.gov.gchq.gaffer.operation.data.ElementSeed' : 'uk.gov.gchq.gaffer.python.data.serialiser.PythonElementSeedMapSerialiser'
    }

    schemaPath = None
    graphConfigPath = None
    storePropertiesPath = None

    def __init__(self):
        self._gaffer_session = Session.GafferPythonSession().getSession()

    def _convertFileToBytes(self, file):
        with open(file, "rb") as f:
            ba = f.read()
            c = bytearray(ba)
            return c

    def _setSchema(self, schemaPath):
        self.schemaPath = schemaPath

    def _setConfig(self, graphConfigPath):
        self.graphConfigPath = graphConfigPath

    def _setStoreProperties(self, storePropertiesPath):
        self.storePropertiesPath = storePropertiesPath

    def getGraph(self, graphId=None):
        if self.schemaPath is None and self.graphConfigPath is None and self.storePropertiesPath is None:
            if graphId is not None and isinstance(graphId, str):
                self._java_python_graph = self._gaffer_session.getGraphById(graphId)
            else:
                self._java_python_graph = self._gaffer_session.getPythonGraph()
        return self

    def _getGraph(self):
        self._java_python_graph = self._gaffer_session.getPythonGraph(self._convertFileToBytes(self.schemaPath), self._convertFileToBytes(self.graphConfigPath), self._convertFileToBytes(self.storePropertiesPath))
        self._set_element_serialisers(store_properties_path=self.storePropertiesPath)
        return self

    def getPythonSerialisers(self):
        serialisers = self._java_python_graph.getPythonSerialisers().getSerialisers()
        python_serialisers = {}
        for serialiser in serialisers:
            class_name = serialiser.getCanonicalName()
            python_serialisers[class_name] = serialisers.get(serialiser).getCanonicalName()
        return python_serialisers

    def getSchema(self):
        return self._java_python_graph.getGraph().getSchema()

    def getVertexSerialiserClass(self):
        return self._java_python_graph.getVertexSerialiserClassName()

    def getKeyPackageClassName(self):
        return self._java_python_graph.getKeyPackageClassName()

    def setPythonSerialisers(self, serialisers):
        m_map = MapConverter().convert(serialisers, self._gaffer_session._gateway_client)
        self._java_python_graph.setPythonSerialisers(m_map)
        self._python_serialisers = serialisers

    def _set_element_serialisers(self, store_properties_path):
        props = open(store_properties_path, "r")
        f = props.readlines()
        filepath = None
        for line in f:
            t = line.split("=")
            if(t[0] == "pythonserialiser.declarations"):
                filepath = t[1]
        props.close()
        if filepath != None:
            path = filepath.strip('\n')
            import json
            data_file = open(path, "r")
            data = json.load(data_file)
            data_file.close()
            self._python_serialisers = data["serialisers"]
        else:
            self.setPythonSerialisers(self._python_serialisers)

    def execute(self, operation):
        justification = input("What is your reason for this operation?")
        result = self._java_python_graph.execute(self._encode(operation), justification)
        if isinstance(result, int):
            return result
        elif isinstance(result, JavaIterator):
            return result
        elif hasattr(result, 'getClass'):
            resultClass = result.getClass().getCanonicalName()
            if resultClass == "uk.gov.gchq.gaffer.python.data.PythonIterator":
                return u.ElementIterator(result)
        elif isinstance(result, str):
            raise TypeError(result)
        return result

    def _encode(self, input):
        return str(input.to_json()).replace("'", '"').replace("True", "true")

    class Builder():
        """
        implements a builder pattern on the graph object to give it more of a Gaffer feel
        """

        def __init__(self):
            self.graph = Graph()

        def schema(self, schemaPath):
            self.graph._setSchema(schemaPath)
            return self

        def config(self, graphConfigPath):
            self.graph._setConfig(graphConfigPath)
            return self

        def storeProperties(self, storePropertiesPath):
            self.graph._setStoreProperties(storePropertiesPath)
            return self

        def build(self):
            return self.graph._getGraph()
