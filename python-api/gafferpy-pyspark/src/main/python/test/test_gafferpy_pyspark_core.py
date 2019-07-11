import os
import sys

dirname = os.path.dirname(__file__)
gafferpy_core = os.path.join(dirname, '../../../../../gafferpy-core/src/main/python/')

if sys.path.count(gafferpy_core) is 0:
    sys.path.append(gafferpy_core)


import unittest
from unittest.mock import MagicMock

from gafferpy_pyspark import gafferpy_pyspark_core as core

class gaffer_pyspark_core_test(unittest.TestCase):

    def test_example(self):
        pass


if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(gaffer_pyspark_core_test)
    unittest.TextTestRunner(verbosity=2).run(suite)
