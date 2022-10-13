<img align="right" width="200" height="auto" src="https://github.com/gchq/Gaffer/raw/develop/logos/logo.png">

# Gaffer Python Client

![ci](https://github.com/gchq/gaffer-tools/actions/workflows/continuous-integration.yaml/badge.svg)
[<img src="https://img.shields.io/badge/docs-passing-success.svg?logo=readthedocs">](https://gchq.github.io/gaffer-doc/latest/)

## Features

- Persistently connect to a Gaffer rest api to run operations
- Connect using PKI certificates and SSL
- Generate Python client code for custom Operations, Predicates, Binary Operators and Functions
- Turn existing json queries into Python objects

## Installation

Gafferpy requires Python 3.6+. We don't currently release gafferpy on pypi, but you can install it over ssh with:

```bash
pip install git+https://github.com/gchq/gaffer-tools.git#subdirectory=python-shell
```

Or if you have the source code locally and want any changes you make reflected in your installation, you can go to the python-shell directory and run:

```bash
pip install -e .
```

## Quick Start

The python shell connects to a running Gaffer REST API. You can start the Gaffer road-traffic-demo rest server and [ui](../ui/README.md) using the command:

```bash
./ui/example/road-traffic/scripts/start.sh
```

```python
# Import the client library and connector
from gafferpy import gaffer as g
from gafferpy import gaffer_connector

# Instantiate a connector
gc = gaffer_connector.GafferConnector("http://localhost:8080/rest/latest")

# You can use the connector to perform get requests
schema = gc.execute_get(g.GetSchema())

# And also run operations
elements = gc.execute_operation(
    operation=g.GetAllElements()
)

# Multiple operations
elements = gc.execute_operations(
    operations=[
        g.GetAllElements(),
        g.Limit(result_limit=3)
    ]
)

# And operation chains
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

See [operation examples](https://gchq.github.io/gaffer-doc/v1docs/getting-started/operations/contents) for more examples of operations in python.

## Coding Style
Please ensure that your coding style is consistent with the rest of the Gaffer project. Guides on the coding style for Gaffer can be found [here](https://gchq.github.io/gaffer-doc/latest/ways-of-working/#coding-style)

## Testing

```bash
# To run all of the tests, first deploy the road traffic example
./ui/example/road-traffic/scripts/start.sh

# Then from within the python-shell folder run
python -m unittest discover
```

## License

Copyright 2016-2022 Crown Copyright

Licensed under the Apache License, Version 2.0 \(the "License"\); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
