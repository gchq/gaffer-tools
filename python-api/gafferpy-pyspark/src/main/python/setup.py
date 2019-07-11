from setuptools import setup

from gafferpy_pyspark.__init__ import __title__
from gafferpy_pyspark.__init__ import __version__
from gafferpy_pyspark.__init__ import __description__
from gafferpy_pyspark.__init__ import __author__
from gafferpy_pyspark.__init__ import __uri__

def setup_package():
    metadata = dict(
        name=__title__,
        version=__version__,
        description=__description__,
        author=__author__,
        license='Apache License, Version 2.0',
        url=__uri__,
        packages=['gafferpy_pyspark'],
        install_requires=['gaffer','pyspark']
    )

    setup(**metadata)

if __name__ == '__main__':
    setup_package()