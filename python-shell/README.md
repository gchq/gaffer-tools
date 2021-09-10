# README

Copyright 2016 Crown Copyright

Licensed under the Apache License, Version 2.0 \(the "License"\); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Python shell

This python shell connects to a Gaffer REST API and requires Python 3.x See [gaffer-tools/python-shell](https://github.com/gchq/gaffer-tools/tree/master/python-shell).

To start using the python shell you will need an instance of the REST API running. You can start the Gaffer road-traffic-demo rest server and ui \(see ui/README.md\) using the command:

```bash
./ui/example/road-traffic/scripts/start.sh
```

Once this is running you can run the python example by using the command \(all commands are run from the root of the python-shell project\):

```bash
python3 src/example.py
python3 src/example_map.py
```

Alternatively if you have you own REST API running that is authenticated with PKI certificates then you can follow the pki example. Before using the example you will need to export your PKI certificate into a .pem file:

```bash
python3 src/example_pki.py
python3 src/example_map_pki.py
```

To use the python shell without installing just ensure you are execute your scripts from within the python-shell directory. To connect to gaffer you will need to do something like this:

```python
from gafferpy import gaffer as g
from gafferpy import gaffer_connector
gc = gaffer_connector.GafferConnector("http://localhost:8080/rest/latest")
```

To fetch the Gaffer schema you can then run:

```python
result = gc.execute_get(g.GetSchema())

print('Schema:')
print(result)
print()
```

You can run an operation like this:

```python
elements = gc.execute_operation(
    operation=g.GetAllElements()
)
```

Multiple operations like this:

```python
elements = gc.execute_operations(
    operations=[
        g.GetAllElements(),
        g.Limit(result_limit=3)
    ]
)
```

And an operation chain like this:

```python
elements = gc.execute_operation_chain(
    operation_chain=g.OperationChain(
        operations=[
            g.GetAllElements(),
            g.Limit(
                truncate=True,
                result_limit=3
            )
        ]
    )
)
```

See [operation examples](https://gchq.github.io/gaffer-doc/getting-started/operation-examples.html) for more examples of operations in python.

### Installation

We currently don't release gafferpy on pypi, but there are plently of ways to use it once you have the source code.  
As well as refering to the Python source files as above, you can also build gafferpy from source (useful for distribution) or install a local copy in develop mode that will update when you change the source code.  

#### Build with bdist_wheel

This option builds gafferpy and puts the binaries in `python-shell/dist` where it can then be distributed and installed with `pip install`.  

Compilation of the project requires the wheel package, this can be installed using pip:

```bash
pip3 install wheel
```

The project can then be compiled by running the following command from the root of the python-shell project:

```bash
python3 setup.py bdist_wheel
```

This creates a distributable Python wheel which can installed locally to provide the Gaffer Python shell to other applications.

The wheel file is install using pip:

```bash
pip3 install dist/gafferpy-<gaffer.version>-py2.py3-none-any.whl
```

#### Developer installation  

Alternatively, if you want to just install gafferpy locally and have any code changes you make to it reflected in your installation, you can go to the python-shell directory and run:

```bash
pip3 install -e .
```
Note that this does not install the dependencies, which can be found in the `requirements.txt`, and installed with:  
```bash
pip3 install -r requirements.txt
```


#### Import  
After either installation, the shell can be imported into an application from anywhere as below:

```python
from gafferpy import gaffer as g
from gafferpy import gaffer_connector
gc = gaffer_connector.GafferConnector("http://localhost:8080/rest/latest")
```

### Testing

We have some unit and integration tests for our python shell. To run all of the tests, first deploy the REST API \(UI will also be deploy\):

```bash
./ui/example/road-traffic/scripts/start.sh
```

then from within the python-shell folder run:

```bash
python3 -m unittest discover -s src
```

