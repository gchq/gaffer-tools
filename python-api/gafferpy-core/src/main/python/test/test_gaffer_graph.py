import unittest
from unittest.mock import Mock

from gafferpy_core.gaffer_graph import Graph
import gafferpy_core.gaffer_session as Session

class gaffer_graph_test(unittest.TestCase):

    @classmethod
    def setUpClass(self):
        Session.GafferPythonSession().connect_to_session("localhost", 25332)

    @classmethod
    def tearDownClass(self):
        Session.GafferPythonSession().disconnect()

    def test_gaffer_graph_creatable(self):
        newGraph = Graph()
        self.assertIsNotNone(newGraph)
    
    def test_gaffer_graph_getSerialisers_returns_dict(self):
        serialisers = Graph().getPythonSerialisers()
        self.assertIsInstance(dict, serialisers)
        pass
    
    def test_gaffer_graph_getSerialisers_fails_successfully(self):
        pass

    def test_gaffer_graph_getSchema_returns_schema(self):
        pass
    
    def test_gaffer_graph_getVertexSerialiserClass_returns_correct(self):
        pass

    def test_gaffer_graph_getKeyPackageClassName_returns_correct(self):
        pass

    def test_gaffer_graph_setPythonSerialisers_can_be_set(self):
        pass 

    def test_gaffer_graph_execute_can_execute_operations(self):
        pass

    def test_gaffer_graph_execute_can_error_correctly(self):
        pass

    def test_gaffer_graph_builder_can_build(self):
        pass

    def test_gaffer_graph_builder_can_error(self):
        pass

if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(gaffer_graph_test)
    unittest.TextTestRunner(verbosity=2).run(suite)