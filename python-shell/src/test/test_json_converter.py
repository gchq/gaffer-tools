#
# Copyright 2016-2019 Crown Copyright
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import unittest
import json

from gafferpy import gaffer as g
from gafferpy.gaffer_core import JsonConverter

class JsonConverterTest(unittest.TestCase):
    def test_throw_improper_string_json(self):
        with self.assertRaises(json.JSONDecodeError):
            JsonConverter.from_json('Not json')

    def test_throw_when_op(self):
        with self.assertRaises(TypeError):
            JsonConverter.from_json(g.GetAllElements())
        
    def test_throw_when_not_json(self):
        class NonJsonSerialisable():
            pass
    
        with self.assertRaises(TypeError):
            JsonConverter.from_json(NonJsonSerialisable())
    
    def test_correct_json(self):
        op_json = {
            "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
        }
        
        self.assertEqual(JsonConverter.from_json(op_json), g.GetAllElements())

    def test_incorrect_json(self):
        op_json = {
            "class" : "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
        }
        
        with self.assertRaises(TypeError):
            JsonConverter.from_json(op_json, g.GetAllGraphIds())

if __name__ == "__main__":
    unittest.main()
