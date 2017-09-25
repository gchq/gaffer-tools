Copyright 2016 Crown Copyright

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Python shell
============

This python shell connects to a Gaffer REST API and requires Python 3.x

To start using the python shell you will need an instance of the REST API running.
You can start the Gaffer road-traffic-demo rest server and ui (see ui/README.md) using the command:

```
mvn install -Pquick -Proad-traffic-demo -pl ui -am
```

Once this is running you can run the python example by using the command (all commands are run from the root of the python-shell project):

```
python3 src/example.py
python3 src/example_accumulo.py
```

Alternatively if you have you own REST API running that is authenticated with
PKI certificates then you can follow the pki example. Before using the example you
will need to export your PKI certificate into a .pem file:

```
python3 src/examplePki.py
python3 src/example_accumulo_pki.py
```

## Installation

The python shell can be compiled and distributed for inclusion in other Python projects.

Compilation of the project requires the bdist package, this can be installed using pip:

```bash
pip3 install bdist
```

The project can then be compiled by running the following command from the root of the python-shell project:

```bash
python3 setup.py bdist_wheel
```

This creates a distributable Python wheel which can installed locally to provide the Gaffer Python shell to other applications.

The wheel file is install using pip:

```bash
pip3 install gaffer_shell-1.0.0-RC2-py2.py3-none-any.whl
```

After installation the shell can be imported into an application as below:

```python
from gaffer_shell import gaffer as g
```
