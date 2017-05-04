import re
from codecs import open
from os import path
from setuptools import setup, find_packages

###############################################################################

name = "gafferpy"
packages = find_packages(where="src")
meta_path = path.join("src", "gafferpy", "__init__.py")
keywords = ["class", "attribute", "boilerplate"]
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "Natural Language :: English",
    "License :: OSI Approved :: Apache Software License",
    "Operating System :: OS Independent",
    "Programming Language :: Python",
    "Programming Language :: Python :: 3"
    "Programming Language :: Python :: 3.0",
    "Programming Language :: Python :: 3.1",
    "Programming Language :: Python :: 3.2",
    "Programming Language :: Python :: 3.3",
    "Programming Language :: Python :: 3.4",
    "Programming Language :: Python :: 3.5",
    "Programming Language :: Python :: 3.6",
    "Programming Language :: Python :: 3 :: Only",
    "Topic :: Software Development :: Libraries :: Python Modules",
]
install_requires = []

###############################################################################

here = path.abspath(path.dirname(__file__))


def read(*parts):
    """
    Build an absolute path from *parts* and and return the contents of the
    resulting file.  Assume UTF-8 encoding.
    """
    with open(path.join(here, *parts), "rb", "utf-8") as f:
        return f.read()


meta_file = read(meta_path)


def find_meta(meta):
    """
    Extract __*meta*__ from META_FILE.
    """
    meta_match = re.search(
        r"^__{meta}__ = ['\"]([^'\"]*)['\"]".format(meta=meta),
        meta_file, re.M
    )
    if meta_match:
        return meta_match.group(1)
    raise RuntimeError("Unable to find __{meta}__ string.".format(meta=meta))


version = find_meta("version")
uri = find_meta("uri")

# Get the long description from the README.md file
with open(path.join(here, 'README.md'), encoding='utf-8') as f:
    long = f.read()

setup(
    name=name,
    version=version,
    description=find_meta("description"),
    long_description=long,
    author=find_meta("author"),
    license=find_meta("license"),
    url=uri,
    maintainer=find_meta("author"),
    keywords=keywords,
    packages=packages,
    package_dir={"": "src"},
    zip_safe=False,
    classifiers=classifiers,
    install_requires=install_requires,
    py_modules=['gafferpy.gafferpy', 'gafferpy.example']
)
