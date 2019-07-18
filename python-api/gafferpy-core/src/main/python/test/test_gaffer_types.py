#
# Copyright 2016-2019 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import unittest

from gafferpy_core import gaffer_types as types

class gaffer_types_test(unittest.TestCase):

    def test_long_type_formed_correctly(self):
        expected_long = {"java.lang.Long": 12345} 
        self.assertEqual(expected_long, types.long(12345))
    
    def test_date_type_formed_correctly(self):
        expected_date = {"java.util.Date": "2009-12-31" }
        self.assertEqual(expected_date, types.date("2009-12-31"))

    def test_freq_map_formed_correctly(self):
        test_dict = {}
        test_dict['a'] = "alpha"
        test_dict['b'] = "beta"
        test_dict['c'] = "charlie"

        expected_freq_map = {"uk.gov.gchq.gaffer.types.FreqMap": {"a": "alpha", "b": "beta", "c": "charlie"}}
        self.assertEqual(expected_freq_map, types.freq_map(test_dict))

    def test_type_value_formed_correctly(self):
        expected_type_value = {"uk.gov.gchq.gaffer.types.TypeSubTypeValue": {"type": "test", "value": "test"}}
        self.assertEqual(expected_type_value, types.type_value(type="test", value="test"))

    def test_subtype_value_formed_correctly(self):
        expected_type_value = {"uk.gov.gchq.gaffer.types.TypeSubTypeValue": {"type": "test", "subType": "test", "value": "test"}}
        self.assertEqual(expected_type_value, types.type_subtype_value(type="test", subType="test", value="test"))
    
if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(gaffer_types_test)
    unittest.TextTestRunner(verbosity=2).run(suite)