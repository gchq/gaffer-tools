import os

import unittest
from unittest.mock import patch, MagicMock

from gafferpy_core import gaffer_graph, gaffer_session, gaffer, gaffer_utils

class JavaIterator:

    name_string = "uk.gov.gchq.gaffer.python.data.PythonIterator"

    def getClass(self):
        return self
    
    def getCanonicalName(self):
        return self.name_string

class gaffer_graph_test(unittest.TestCase):

    __graph = gaffer_graph.Graph()

    @classmethod
    def setUpClass(self):
        dirName = os.path.dirname(__file__)
        self._dataFilePath = os.path.join(dirName, './resources/data.csv')
        self._schemaFilePath = os.path.join(dirName, './resources/simple-schema.json')
        self._configFilePath = os.path.join(dirName, './resources/graphconfig.json')
        self._propertiesFilePath = os.path.join(dirName, './resources/pyspark-mock-accumulo.properties')

    def setUp(self):
        self.__graph._java_python_graph = MagicMock()

    def test_gaffer_graph_execute_is_callable(self):
        # Test code
        edges = []
        with open(self._dataFilePath, "r") as f:
            for line in f:
                t = line.rstrip().split(",")
                edges.append(gaffer.Edge(source=str(t[0]), destination=str(t[1]), directed=True, group="BasicEdge", properties={"count": {"java.lang.Long" : 1}}))
        add_op = gaffer.AddElements(input=edges)
        self.__graph.execute(operation=add_op)

        # Assert code ran correctly
        self.__graph._java_python_graph.execute.assert_called_once_with(self.__graph._encode(add_op))
        
    def test_gaffer_graph_execute_can_return_iterators(self):
        self.__graph._java_python_graph.execute = MagicMock(return_value=JavaIterator())

        result = self.__graph.execute(operation=gaffer.GetAllElements())

        self.assertIsInstance(result, gaffer_utils.ElementIterator)
    
    def test_gaffer_graph_execute_can_return_dict(self):
        self.__graph._java_python_graph.execute = MagicMock(return_value={"class": "dict", "test": "something"})

        result = self.__graph.execute(operation=gaffer.GetAllElements())

        self.assertIsInstance(result, dict)

    def test_gaffer_graph_execute_can_error_correctly(self):
        self.__graph._java_python_graph.execute = MagicMock(return_value="Couldn't preform operation")

        with self.assertRaises(TypeError):
            self.__graph.execute(operation=gaffer.GetAllElements())

if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(gaffer_graph_test)
    unittest.TextTestRunner(verbosity=2).run(suite)