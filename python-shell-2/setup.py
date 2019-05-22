import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="GafferPy2",
    version="0.0.1",
    author="GCHQ",
    description="A Dynamically generated Gaffer python shell",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/gchq/gaffer-tools",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: Apache License",
        "Operating System :: OS Independent",
    ],
)