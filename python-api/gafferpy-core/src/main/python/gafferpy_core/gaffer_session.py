#
# Copyright 2016-2018 Crown Copyright
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

"""


import logging
from py4j.java_gateway import JavaGateway, CallbackServerParameters, GatewayParameters
import subprocess as sp
import signal
import time
from gafferpy_core import gaffer_utils as u

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
logger.addHandler(ch)


def singleton(cls):
    instances = {}
    def getinstance(*args,**kwargs):
        if cls not in instances:
            instances[cls] = cls(*args,**kwargs)
        return instances[cls]
    return getinstance



@singleton
class GafferPythonSession():

    """

    """

    #general things
    _java_gaffer_session = None
    _java_gateway = None
    _java_server_process = None
    _java_gaffer_session_class = "uk.gov.gchq.gaffer.python.session.GafferSession"

    #python things
    _jar = None
    _lib_jars = None
    _this_session_pid = None

    def create_session(self,jar=None, lib_jars=None, kill_existing_sessions=False):

        """
        A public method for creating a python gaffer session.
        """
        global gaffer_session
        if 'gaffer_session' in globals():
            pid = globals().get('gaffer_session').get_session_pid()
            logger.info("already a gaffer session at pid " + str(pid))
        else:
            logger.info("no gaffer session available, creating one")
            self._jar = jar
            self._lib_jars = lib_jars
            self._check_running_processes(kill_existing_sessions)
            self._start_session()
            gaffer_session = self

    def _start_session(self):

        """
        A private method used for instantiating a java Gaffer session
        """

        if self._lib_jars == None:
            libs = ""
        else:
            libs = self._lib_jars.replace(",",":")
            libs = ":" + libs
        start_command = "java -cp " + self._jar + libs + " " + self._java_gaffer_session_class
        self._java_server_process = self._run_shell_command(start_command)
        self._this_session_pid = self._java_server_process.pid
        logger.info("starting gaffer session : {} \n".format(start_command))
        logger.info("starting python gateway\n")
        logger.info("waiting for gateway...\n")
        gateway = JavaGateway()
        java_session = JavaGateway().entry_point
        if java_session.serverRunning():
            self._java_gateway = gateway
            self._java_gaffer_session = java_session
            logger.info("Server ready, pid = " + str(self._this_session_pid))
        else:
            msg = "server failed to start"
            logger.error(msg)
            raise RuntimeError(msg)



    def stop_session(self):
        if(self._java_gateway == None):
            logger.info("no session to stop")
        else:
            logger.info("shutting down python gateway\n")
            self._java_gateway.shutdown()
            logger.info("stopping gaffer session")
            self._java_server_process.send_signal(signal.SIGTERM)
            self._java_gateway = None
            globals().pop('gaffer_session',None)
            logger.info("session stopped")


    def get_session_pid(self):
        return self._this_session_pid


    def _check_running_processes(self, kill):

        """
        Checks to see if there are any java gaffer sessions already running.
        If there are:
            if 'kill' set to true, the existing processes are terminated and a new one is started
            if 'kill' set to false, this method returns the list of pid of the existing sessions and throws an exception
        """
        fail = True
        if self._jar == None:
            msg = "Need a jar"
            logger.error(msg)
            raise ValueError(msg)
        grep_command = "ps -ef | grep " + self._jar
        pids = []
        process_check = self._run_shell_command(grep_command)
        for line in process_check.stdout.readlines():
            if ("java -cp" in str(line)) & (self._jar in str(line)) & (self._java_gaffer_session_class in str(line)):
                t = str(line).split()
                pid = t[2]
                pids.append(pid)
                logger.debug("found existing session with pid " + pid + ", will terminate it")
        if len(pids) == 0:
            fail = False
        elif kill:
            for pid in pids:
                self._kill_process(pid)
            fail = False
        if fail:
            msg = "found gaffer session already running that I didn't start on pids " + str(pids)
            logger.error(msg)
            raise ValueError(msg)


    def _run_shell_command(self,command):
        return sp.Popen(command, shell=True,
                        stderr=sp.PIPE,
                        stdout=sp.PIPE)

    def _kill_process(self, pid):
        kill_command = "kill -9 " + pid
        res = self._run_shell_command(kill_command)
        logger.info("killed process " + pid)


class Graph():

    """
    A class that wraps the Java class uk.gov.gchq.gaffer.python.graph.PythonGraph
    Enables users in python to able to access all of the functionality of the 
    Graph, with simple interfaces like the Builder() and execute() functions
    """

    _java_python_graph = None
    _gaffer_session = None
    _python_serialisers={
        'uk.gov.gchq.gaffer.data.element.Element' : 'uk.gov.gchq.gaffer.python.data.serialiser.PythonElementMapSerialiser',
        'uk.gov.gchq.gaffer.operation.data.ElementSeed' : 'uk.gov.gchq.gaffer.python.data.serialiser.PythonElementSeedMapSerialiser'
    }

    def _setSchema(self, schemaPath):
        self.schemaPath = schemaPath

    def _setConfig(self, graphConfigPath):
        self.graphConfigPath = graphConfigPath

    def _setStoreProperties(self, storePropertiesPath):
        self.storePropertiesPath = storePropertiesPath

    def _getGraph(self):
        if "gaffer_session" in globals():
            self._gaffer_session = globals().get("gaffer_session")
        else:
            msg = "No gaffer session"
            logger.error(msg)
            raise ValueError(msg)
        self._java_python_graph = self._gaffer_session._java_gaffer_session.getPythonGraph(self.schemaPath, self.graphConfigPath, self.storePropertiesPath)
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
        self._java_python_graph.setPythonSerialisers(serialisers)
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

    def execute(self, operation, user):
            result = self._java_python_graph.execute(self._encode(operation), self._encode(user))
            if isinstance(result, int):
                return result
            resultClass = result.getClass().getCanonicalName()
            if resultClass == "uk.gov.gchq.gaffer.python.data.PythonIterator":
                iterator = u.ElementIterator(result)
                return iterator
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

