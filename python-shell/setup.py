from setuptools import setup
from codecs import open
from os import path

here = path.abspath(path.dirname(__file__))

# Get the long description from the README.md file
with open(path.join(here, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

setup(
    name='Gaffer Python Shell',
    version='0.4.6',
    description='A simple python shell for Gaffer',
    long_description=long_description,
    author='GCHQ',
    license="Apache 2.0",
    url='https://github.com/gchq/gaffer-tools',
    py_modules=['gaffer-python-shell']
)
