import unittest

# from gafferpy_core import gaffer as g

class gaffer_core_test(unittest.TestCase):
    
    def test(self):
        self.assertTrue(True)

    def test_split(self):
        s = 'hello world'
        self.assertEqual(s.split(), ['hello', 'world'])


if(__name__ == '__main__'):
    suite = unittest.TestLoader().loadTestsFromTestCase(gaffer_core_test)
    unittest.TextTestRunner(verbosity=2).run(suite)