import unittest

import gafferpy_core

from . __init__ import __version__ as TestVersion

class gaffer_core_test(unittest.TestCase):

    def test_versionIsCorrect(self):
        self.assertEqual(TestVersion, gafferpy_core.__version__)
        
if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(gaffer_core_test)
    unittest.TextTestRunner(verbosity=2).run(suite)