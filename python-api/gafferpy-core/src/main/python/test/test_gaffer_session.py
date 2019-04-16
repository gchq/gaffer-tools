import unittest
from unittest.mock import Mock

import gafferpy_core
import gafferpy_core.gaffer_session as sesh

from py4j.tests.java_gateway_test import start_example_server

"""
Will require an active gaffer session to be running (somewhere)
"""

class gaffer_session_test(unittest.TestCase):
    
    @classmethod
    def setUpClass(self):
        # start_example_server()
        pass

    def test_session_can_be_created(self):
        # sesh.GafferPythonSession().connect_to_session("localhost",25332)
        # self.assertEqual(1,sesh.GafferPythonSession()._java_gaffer_session.getStatusCode())
        pass

    def test_session_can_create_graph_integration_test(self):
        # sesh.GafferPythonSession().connect_to_session("0.0.0.0", 25332)
        # schemaPath = './resources/simple-schema.json'
        # configPath = './resources/graphconfig.json'
        # propertiesPath = './resources/pyspark-mock-accumulo.properties'

        # graph = (sesh.Graph().Builder().schema(schemaPath).config(configPath).storeProperties(propertiesPath).build())

        # schema = "Schema[{\"edges\" : { \"BasicEdge\" : {\"source\" : \"vertex\",\"destination\" : \"vertex\",\"directed\" : \"true\",\"properties\" : {\"count\" : \"count\"}}},\"entities\" : {\"BasicEntity\" : {\"vertex\" : \"vertex\",\"properties\" : {\"count\" : \"count\"}}},\"types\" : {\"vertex\" : {\"class\" : \"java.lang.String\"},\"count\" : {\"class\" : \"java.lang.Long\",\"aggregateFunction\" : {\"class\" : \"uk.gov.gchq.koryphe.impl.binaryoperator.Sum\"},\"serialiser\" : {\"class\" : \"uk.gov.gchq.gaffer.serialisation.implementation.ordered.OrderedLongSerialiser\"}},\"true\" : {\"description\" : \"A simple boolean that must always be true.\",\"class\" : \"java.lang.Boolean\",\"validateFunctions\" : [ {\"class\" : \"uk.gov.gchq.koryphe.impl.predicate.IsTrue\"} ]}},\"vertexSerialiser\" : {\"class\" : \"uk.gov.gchq.gaffer.serialisation.implementation.StringSerialiser\",\"charset\" : \"UTF-8\"}}], keyConverter = uk.gov.gchq.gaffer.accumulostore.key.core.impl.byteEntity.ByteEntityAccumuloElementConverter@2ea59385"

        # self.assertEqual(schema,graph.getSchema())
        pass

if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(gaffer_session_test)
    unittest.TextTestRunner(verbosity=2).run(suite)