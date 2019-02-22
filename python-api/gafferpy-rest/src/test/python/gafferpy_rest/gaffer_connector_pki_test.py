import unittest

class gaffer_connector_pki_test(unittest.TestCase):
    def default_test(self):
        self.assertTrue(True)


if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(gaffer_connector_pki_test)
    unittest.TextTestRunner(verbosity=2).run(suite)