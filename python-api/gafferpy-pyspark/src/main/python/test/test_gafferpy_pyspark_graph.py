import os
import sys

dirname = os.path.dirname(__file__)
gafferpy_core = os.path.join(dirname, '../../../../../gafferpy-core/src/main/python/')

if sys.path.count(gafferpy_core) is 0:
    sys.path.append(gafferpy_core)


import unittest
from unittest.mock import MagicMock

from gafferpy_pyspark.gafferpy_pyspark_graph import Graph


class GafferPySparkGraphTest(unittest.TestCase):

    def test_graph_can_execute(self):
        pass
    
    def test_graph_can_return_RDD(self):
        pass

if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(GafferPySparkGraphTest)
    unittest.TextTestRunner(verbosity=2).run(suite)
