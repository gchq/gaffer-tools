import unittest

from gafferpy_core import gaffer_predicates as pre

class gaffer_predicates_test(unittest.TestSuite):

    def something(self):
        pass

if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(gaffer_predicates_test)
    unittest.TextTestRunner(verbosity=2).run(suite)