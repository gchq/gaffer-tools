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

from gafferpy.gaffer_core import *
from gafferpy.gaffer_predicates import *
from gafferpy.gaffer_functions import *
from gafferpy.gaffer_binaryoperators import *
from gafferpy.gaffer_operations import *
from gafferpy.gaffer_config import *
from gafferpy.gaffer_types import *

import gafferpy.gaffer_predicates as pred
import gafferpy.gaffer_functions as func
import gafferpy.gaffer_binaryoperators as bop
import gafferpy.gaffer_operations as op
import gafferpy.gaffer_config as conf
import gafferpy.gaffer_types as t
"""

from gafferpy.gaffer_core import *
from gafferpy.gaffer_predicates import *
from gafferpy.gaffer_functions import *
from gafferpy.gaffer_binaryoperators import *
from gafferpy.gaffer_operations import *
from gafferpy.gaffer_config import *
from gafferpy.gaffer_types import *

import gafferpy.gaffer_predicates as pred
import gafferpy.gaffer_functions as func
import gafferpy.gaffer_binaryoperators as bop
import gafferpy.gaffer_operations as op
import gafferpy.gaffer_config as conf
import gafferpy.gaffer_types as t
