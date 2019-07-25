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

import logging

from py4j.java_collections import JavaIterator

from gafferpy_core import gaffer_utils as u
from gafferpy_core import gaffer_graph as gs

from gafferpy_pyspark import gafferpy_pyspark_core as gps_core 
from gafferpy_pyspark import pyspark_utils as gps_utils

from gafferpy_pyspark import gafferpy_pyspark_session as Session

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
logger.addHandler(ch)

class Graph(gs.Graph):
    """

    """

    _java_python_graph = None

    _python_serialisers = {
        'uk.gov.gchq.gaffer.data.element.Element' : 'uk.gov.gchq.gaffer.python.pyspark.serialiser.impl.PysparkElementMapSerialiser',
        'uk.gov.gchq.gaffer.operation.data.ElementSeed' : 'uk.gov.gchq.gaffer.python.pyspark.serialiser.impl.PysparkElementSeedMapSerialiser'
    }

    def __init__(self):
        super(gs.Graph, self)
        self._gaffer_session = Session.GafferPysparkSession().getSession()

    def _getGraph(self):
        self._java_python_graph = self._gaffer_session.getPythonGraph(
                                                                    self._convertFileToBytes(self.schemaPath), 
                                                                    self._convertFileToBytes(self.graphConfigPath), 
                                                                    self._convertFileToBytes(self.storePropertiesPath)
                                                                )
        self._set_element_serialisers(store_properties_path=self.storePropertiesPath)
        return self

    def getGraph(self, graphId=None):
        if self.schemaPath is None and self.graphConfigPath is None and self.storePropertiesPath is None:
            if graphId is not None and isinstance(graphId, str):
                self._java_python_graph = self._gaffer_session.getGraphById(graphId)
            else:
                self._java_python_graph = self._gaffer_session.getPythonGraph()
        return self

    def execute(self, operation):
        justification = input("What is your reason for this operation?")
        logger.info("executing operation " + operation.CLASS)
        if operation.CLASS == "getPySparkRDDOfAllElements":
            if Session.GafferPysparkSession().getSparkContext() == None:
                msg = "No spark context: pyspark operations not available"
                logger.info(msg)
                return None
            if operation.pythonSerialiserClass == None:
                #if self._python_serialisers == None:
                #    keyConverterClass = "uk.gov.gchq.gaffer.python.pyspark.serialiser.impl.PysparkElementMapSerialiser"
                if "uk.gov.gchq.gaffer.data.element.Element" in self._python_serialisers:
                    serialiser_class_name = self._python_serialisers.get("uk.gov.gchq.gaffer.data.element.Element")
                    keyConverterClass = serialiser_class_name
                else:
                    msg = "No serialiser for Element"
                    logger.info(msg)
                    raise ValueError(msg)
            else:
                keyConverterClass = operation.pythonSerialiserClass
            hadoop_conf = self._get_hadoop_conf(operation)
            logger.info("using key converter class " + keyConverterClass)
            return self._get_rdd(hadoop_conf, keyConverterClass)

        elif operation.CLASS == "getPysparkDataFrameOfElements":
            view = operation.view
            if Session.GafferPysparkSession().getSparkContext() == None:
                msg = "No spark context: pyspark operations not available"
                logger.info(msg)
                return None
            if operation.pythonSerialiserClass == None:
                #if self._python_serialisers == None:
                #    logger.info("python serialisers = None")
                #    keyConverterClass = "uk.gov.gchq.gaffer.python.pyspark.serialiser.PysparkDataframeSerialiser"
                if "uk.gov.gchq.gaffer.data.element.Element" in self._python_serialisers:
                    serialiser_class_name = self._python_serialisers.get("uk.gov.gchq.gaffer.data.element.Element")
                    keyConverterClass = serialiser_class_name
                else:
                    msg = "No serialiser for Element"
                    logger.info(msg)
                    raise ValueError(msg)
            else:
                keyConverterClass = operation.pythonSerialiserClass
            df_conf = self._get_hadoop_conf(operation)
            logger.info("using key converter class " + keyConverterClass)
            return self._get_dataframe(df_conf,keyConverterClass, view, operation.sampleRatio)

        elif operation.CLASS == "uk.gov.gchq.gaffer.python.pyspark.operation.GetPythonRDDConfiguration":
            java_conf = self._java_python_graph.execute(self._encode(operation), justification)
            rdd_conf = self._convert_java_conf(java_conf)
            return rdd_conf

        elif operation.CLASS == "AddElementsFromPysparkRDD" :

            get_conf_op = gps_core.GetPythonRDDConfiguration()
            conf = self.execute(get_conf_op)
            schema = conf.get("Schema")
            key_package = self._java_python_graph.getKeyPackageClassName()
            output_path = operation.outputDirectory + "/rfiles"
            converted_rdd = operation.rdd.map(lambda x : addSchemaAndKeyPackageToElement(element=x,schema=schema,keyPackage=key_package))
            converted_rdd.saveAsNewAPIHadoopFile(conf=conf,
                                                  path=output_path,
                                                  outputFormatClass="org.apache.accumulo.core.client.mapreduce.AccumuloFileOutputFormat",
                                                  keyClass="org.apache.accumulo.core.data.Key",
                                                  valueClass="org.apache.accumulo.core.data.Value",
                                                  keyConverter="uk.gov.gchq.gaffer.python.pyspark.accumulo.converter.PysparkElementToAccumuloKeyConverter",
                                                  valueConverter="uk.gov.gchq.gaffer.python.pyspark.accumulo.converter.PysparkElementToAccumuloValueConverter"
                                                  )
            logger.info("rfiles written to " + output_path)
            import_op = gps_core.ImportAccumuloKeyValueFiles(inputPath=output_path, failurePath=operation.outputDirectory + "/failure")
            logger.info("importing accumulo files from " + output_path)
            self.execute(import_op)

        else:
            result = self._java_python_graph.execute(self._encode(operation), justification)
            if isinstance(result, int):
                return result
            if isinstance(result, JavaIterator):
                return result
            resultClass = result.getClass().getCanonicalName()
            if resultClass == "uk.gov.gchq.gaffer.python.data.PythonIterator":
                iterator = u.ElementIterator(result)
                return iterator
            return result

    def _get_hadoop_conf(self, operation):

        if operation.view == None:
            get_conf_op = gps_core.GetPythonRDDConfiguration()
        else:
            get_conf_op = gps_core.GetPythonRDDConfiguration(view=operation.view)

        return self.execute(get_conf_op)


    def _convert_java_conf(self, java_conf):
        pyspark_conf = {}
        it = java_conf.iterator()
        while it.hasNext():
            line = str(it.next())
            tokens = self._parse_java_conf_entry(line)
            pyspark_conf[tokens[0]] = tokens[1]
        return pyspark_conf


    def _get_rdd(self, conf, keyConverter):
        inputformatclass = "uk.gov.gchq.gaffer.accumulostore.inputformat.ElementInputFormat"
        keyclass = "uk.gov.gchq.gaffer.data.element.Element"
        valueclass = "org.apache.hadoop.io.NullWritable"

        rdd = Session.GafferPysparkSession().getSparkContext().newAPIHadoopRDD(inputformatclass, keyclass, valueclass, keyConverter=keyConverter, conf=conf)
        return rdd.map(u.convertElement)

    def _getRowSchemas(self, schema, view=None):
        groupSchemas = {}
        groupNames = {}
        if view != None:
            groupNames = self._getGroupsFromView(view)
        else:
            groupNames = self._getGroupsFromSchema(schema)

        baseEdgeSchema = ['source', 'destination', 'directed', 'group', 'type']
        baseEntitySchema = ['vertex', 'group', 'type']

        if 'edges' in groupNames.keys():
            for groupName in groupNames['edges']:
                rowSchema = baseEdgeSchema
                for prop in schema['edges'][groupName]['properties']:
                    rowSchema.append(prop)
                    groupSchemas[groupName] = rowSchema

        if 'entities' in groupNames.keys():
            for groupName in groupNames['entities']:
                rowSchema = baseEntitySchema
                for prop in schema['entities'][groupName]['properties']:
                    rowSchema.append(prop)
                    groupSchemas[groupName] = rowSchema

        return groupSchemas


    def _getGroupsFromView(self, view):
        groupNames = {}
        if view.edges != None:
            edgeGroups = []
            for edge in view.edges:
                edgeGroups.append(edge.group)
            groupNames['edges'] = edgeGroups
        if view.entities != None:
            entityGroups = []
            for entity in view.entities:
                entityGroups.append(entity.group)
            groupNames['entities'] = entityGroups

        return groupNames


    def _getGroupsFromSchema(self, schema):
        groupNames = {}

        if schema['edges'] != None:
            edgeGroupNames = []
            for group in schema['edges']:
                edgeGroupNames.append(group)
            groupNames['edges'] = edgeGroupNames

        if schema['entities'] != None:
            entityGroupNames = []
            for group in schema['entities']:
                entityGroupNames.append(group)
            groupNames['entities'] = entityGroupNames

        return groupNames

    def _get_dataframe(self, conf, keyConverter, view, sampleRatio):
        inputformatclass = "uk.gov.gchq.gaffer.accumulostore.inputformat.ElementInputFormat"
        keyclass = "uk.gov.gchq.gaffer.data.element.Element"
        valueclass = "org.apache.hadoop.io.NullWritable"
        gaffer_schema_json = conf["Schema"]
        import json
        gaffer_schema_dict = json.loads(gaffer_schema_json)
        rowSchemas = self._getRowSchemas(gaffer_schema_dict, view)
        mergedSchemaAsList = []
        mergedSchemaDict = gps_utils.mergeRowSchemasAsDict(rowSchemas)
        for key in mergedSchemaDict.keys():
            mergedSchemaAsList.append(key)
        mergedSchemaAsList.sort()
        rdd = Session.GafferPysparkSession().getSparkContext().newAPIHadoopRDD(inputformatclass, keyclass, valueclass, keyConverter=keyConverter, conf=conf)
        return rdd.map(lambda x : gps_utils.toRow(x, rowSchemas)).toDF(mergedSchemaAsList,sampleRatio=sampleRatio)

    def _parse_java_conf_entry(self,entry):
        #return only the first substring up to "=" as the key and the rest as the value
        i = 0
        for c in entry:
            if c == "=":
                break
            else:
                i += 1
        key = entry[:i]
        val = entry[i+1:]
        return [key, val]



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

def addSchemaAndKeyPackageToElement(element,schema,keyPackage):
    delim = ";"
    elementJson = element.to_json_str()
    s = elementJson + delim + schema + delim + keyPackage
    return (s,s)