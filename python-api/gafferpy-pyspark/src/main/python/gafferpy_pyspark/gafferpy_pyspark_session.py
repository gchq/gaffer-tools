import logging
from py4j.java_gateway import JavaGateway, CallbackServerParameters, GatewayParameters
import subprocess as sp
import signal
import time
from gafferpy_core import gaffer_utils as u
from gafferpy_core import gaffer_session as gs
from gafferpy_pyspark import gaffer_pyspark as gp
from gafferpy_pyspark import pyspark_utils as pu

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
class GafferPysparkSession():
    """

    """

    #general things
    _java_gaffer_session = None
    _java_gateway = None
    _java_server_process = None

    #pyspark things
    _spark_context = None

    def create_session(self):

        """
        A public method for creating a python gaffer session.
        """

        global gaffer_session
        self._start_session()
        gaffer_session = self


    def _start_session(self):

        """
        A private method used for instantiating a java Gaffer session
        """

        from pyspark.context import SparkContext
        self._spark_context = SparkContext.getOrCreate()
        self._java_gaffer_session = self._spark_context._jvm.uk.gov.gchq.gaffer.python.session.GafferSession.getInstance()
        if self._java_gaffer_session.getStatusCode() == 1:
            logger.info("In a pyspark environment. Using SparkSession as the Gaffer Session")
        else:
            msg = "failed to create gaffer session from a pyspark context"
            logger.error(msg)
            raise ValueError(msg)

    def sparkContext(self):
        return self._spark_context



class Graph(gs.Graph):
    """

    """

    _python_serialisers = {
        'uk.gov.gchq.gaffer.data.element.Element' : 'uk.gov.gchq.gaffer.python.pyspark.serialiser.impl.PysparkElementMapSerialiser',
        'uk.gov.gchq.gaffer.operation.data.ElementSeed' : 'uk.gov.gchq.gaffer.python.pyspark.serialiser.impl.PysparkElementSeedMapSerialiser'
    }

    def __init__(self):
        super(gs.Graph,self)

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

    def execute(self, operation, user):
        logger.info("executing operation " + operation.CLASS)
        if operation.CLASS == "getPySparkRDDOfAllElements":
            if self._gaffer_session._spark_context == None:
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
            hadoop_conf = self._get_hadoop_conf(operation, user)
            logger.info("using key converter class " + keyConverterClass)
            return self._get_rdd(hadoop_conf, keyConverterClass)

        elif operation.CLASS == "getPysparkDataFrameOfElements":
            view = operation.view
            if self._gaffer_session._spark_context == None:
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
            df_conf = self._get_hadoop_conf(operation, user)
            logger.info("using key converter class " + keyConverterClass)
            return self._get_dataframe(df_conf,keyConverterClass, view, operation.sampleRatio)

        elif operation.CLASS == "uk.gov.gchq.gaffer.python.pyspark.operation.GetPythonRDDConfiguration":
            java_conf = self._java_python_graph.execute(self._encode(operation), self._encode(user))
            rdd_conf = self._convert_java_conf(java_conf)
            return rdd_conf

        elif operation.CLASS == "AddElementsFromPysparkRDD" :

            get_conf_op = gp.GetPythonRDDConfiguration()
            conf = self.execute(get_conf_op, user)
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
            import_op = gp.ImportAccumuloKeyValueFiles(inputPath=output_path, failurePath=operation.outputDirectory + "/failure")
            logger.info("importing accumulo files from " + output_path)
            self.execute(import_op, user)

        else:
            result = self._java_python_graph.execute(self._encode(operation), self._encode(user))
            if isinstance(result, int):
                return result
            resultClass = result.getClass().getCanonicalName()
            if resultClass == "uk.gov.gchq.gaffer.python.data.PythonIterator":
                iterator = u.ElementIterator(result)
                return iterator
            return result

    def _get_hadoop_conf(self, operation, user):

        if operation.view == None:
            get_conf_op = gp.GetPythonRDDConfiguration()
        else:
            get_conf_op = gp.GetPythonRDDConfiguration(view=operation.view)

        return self.execute(get_conf_op, user)


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

        rdd = self._gaffer_session._spark_context.newAPIHadoopRDD(inputformatclass, keyclass, valueclass, keyConverter=keyConverter, conf=conf)
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
        mergedSchemaDict = pu.mergeRowSchemasAsDict(rowSchemas)
        for key in mergedSchemaDict.keys():
            mergedSchemaAsList.append(key)
        mergedSchemaAsList.sort()
        rdd = self._gaffer_session._spark_context.newAPIHadoopRDD(inputformatclass, keyclass, valueclass, keyConverter=keyConverter, conf=conf)
        return rdd.map(lambda x : pu.toRow(x, rowSchemas)).toDF(mergedSchemaAsList,sampleRatio=sampleRatio)

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