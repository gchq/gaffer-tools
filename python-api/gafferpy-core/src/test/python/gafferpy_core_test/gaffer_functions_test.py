import unittest

# from gafferpy_core import gaffer

class gaffer_functions_test(unittest.TestCase):

    def testFunctionContext(self):
        print("test")
        self.assertTrue(True)


if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(gaffer_functions_test)
    unittest.TextTestRunner(verbosity=2).run(suite)