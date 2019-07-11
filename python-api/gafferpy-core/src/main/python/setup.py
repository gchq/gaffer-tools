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