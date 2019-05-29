from setuptools import setup

from gafferpy_pyspark.__init__ import __title__
from gafferpy_pyspark.__init__ import __version__
from gafferpy_pyspark.__init__ import __description__
from gafferpy_pyspark.__init__ import __author__
from gafferpy_pyspark.__init__ import __uri__

print(__title__)
print(__version__)
print(__description__)
print(__author__)
print(__uri__)

setup(
    name=__title__,
    version=__version__,
    description=__description__,
    author=__author__,
    url=__uri__,
    packages=['gafferpy_pyspark'],
    install_requires=['pyspark']
)