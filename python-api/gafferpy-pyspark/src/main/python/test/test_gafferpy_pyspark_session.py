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

import os
import sys

dirname = os.path.dirname(__file__)
gafferpy_core = os.path.join(dirname, '../../../../../gafferpy-core/src/main/python/')

if sys.path.count(gafferpy_core) is 0:
    sys.path.append(gafferpy_core)

import unittest
from unittest.mock import Mock, patch

from gafferpy_pyspark.gafferpy_pyspark_session import GafferPysparkSession, Session

class GafferPySparkSessionTest(unittest.TestCase):


    @patch("pyspark.context.SparkContext.getOrCreate")
    # @patch("self._spark_context._jvm.uk.gov.gchq.gaffer.python.controllers.SessionManager.getInstance().sessionFactory()")
    def test_session_is_the_same_as_core_session(self, mock, ):# mock1):
        # session1 = GafferPysparkSession()
        # print(session1)
        # session2 = Session.GafferPythonSession()
        # print(session2)

        # print(session1.__port)
        # print(session2.__port)

        # session1.create_session()

        # assert mock.called
     
        # self.assertEqual(session1._port, session2._port)
        pass
    
    def test_sessions_returns_same_values(self):
        pass

if __name__ == "__main__":
    suite = unittest.TestLoader().loadTestsFromTestCase(GafferPySparkSessionTest)
    unittest.TextTestRunner(verbosity=2).run(suite)