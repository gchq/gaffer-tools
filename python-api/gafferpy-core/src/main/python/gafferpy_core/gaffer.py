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

"""
This module imports all the gaffer python classes (not including gaffer_connector).

Importing this gaffer.py file will provide you with all the gaffer components.

These components can then be accessed like:

g.GetElements()
g.IsMoreThan()

or if you want a specific class from a specific module, for example if there
is an Operation and Predicate class with the same name, you can use the components like:

g.op.X()
g.pred.X()


Specifically the imports are done as follows:

from gafferpy_core.gaffer_core import *
from gafferpy_core.gaffer_predicates import *
from gafferpy_core.gaffer_functions import *
from gafferpy_core.gaffer_binaryoperators import *
from gafferpy_core.gaffer_operations import *
from gafferpy_core.gaffer_config import *
from gafferpy_core.gaffer_types import *

import gafferpy_core.gaffer_predicates as pred
import gafferpy_core.gaffer_functions as func
import gafferpy_core.gaffer_binaryoperators as bop
import gafferpy_core.gaffer_operations as op
import gafferpy_core.gaffer_config as conf
import gafferpy_core.gaffer_types as t
import gafferpy_core.gaffer_utils as utils
import gafferpy_core.gaffer_session as session
"""

from gafferpy_core.gaffer_core import *
from gafferpy_core.gaffer_predicates import *
from gafferpy_core.gaffer_functions import *
from gafferpy_core.gaffer_binaryoperators import *
from gafferpy_core.gaffer_operations import *
from gafferpy_core.gaffer_config import *
from gafferpy_core.gaffer_types import *
from gafferpy_core.gaffer_utils import *
from gafferpy_core.gaffer_session import *

import gafferpy_core.gaffer_predicates as pred
import gafferpy_core.gaffer_functions as func
import gafferpy_core.gaffer_binaryoperators as bop
import gafferpy_core.gaffer_operations as op
import gafferpy_core.gaffer_config as conf
import gafferpy_core.gaffer_types as t
import gafferpy_core.gaffer_utils as utils
import gafferpy_core.gaffer_session as session
