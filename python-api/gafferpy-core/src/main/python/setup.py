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
from setuptools import setup

from gafferpy_core.__init__ import __title__
from gafferpy_core.__init__ import __version__
from gafferpy_core.__init__ import __description__
from gafferpy_core.__init__ import __author__
from gafferpy_core.__init__ import __uri__

def setup_package():
    metadata = dict(
        name=__title__,
        version=__version__,
        description=__description__,
        author=__author__,
        url=__uri__,
        packages=['gafferpy_core'],
        install_requires=['requests', 'py4j']
    )

    setup(**metadata)

if __name__ == '__main__':
    setup_package()