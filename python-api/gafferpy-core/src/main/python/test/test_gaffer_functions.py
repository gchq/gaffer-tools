import unittest

from gafferpy_core import gaffer_functions as func

class gaffer_functions_test(unittest.TestCase):

    def testFunctionContext(self):
        self.assertTrue(True)


if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(gaffer_functions_test)
    unittest.TextTestRunner(verbosity=2).run(suite)