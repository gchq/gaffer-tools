# Fishbowl

## Features
Fishbowl generates code for the core gafferpy classes by pointing to a running Gaffer rest api.
It generates the classes for:

- [Operations](../gafferpy/generated_api/operations.py)
- [Predicates](../gafferpy/generated_api/predicates.py)
- [Functions](../gafferpy/generated_api/functions.py)
- [Binary Operators](../gafferpy/generated_api/binary_operators.py)
- [Config Endpoints](../gafferpy/generated_api/config.py)

This is done automatically on every Gaffer release from a standard spring-rest api and placed into gafferpy's [generated_api](../gafferpy/generated_api) directory.

If you have custom Gaffer Java classes from the list above, fishbowl can generate the gafferpy classes for them.

## Quick Start

```python
from gafferpy.gaffer_connector import GafferConnector
from fishbowl.fishbowl import Fishbowl

gc = GafferConnector("http://localhost:8080/rest")
fb = Fishbowl(gaffer_connector=gc)
```
Your python files will be appear in a folder called `generated`.

You can then use these classes in normal gafferpy operations:
```python
import generated
gc.execute(generated.operations.YourCustomOperation(custom_field=True))
gc.execute(generated.operations.OperationChain(
    operations=[
        generated.operations.GetAllElements(), 
        generated.operations.Count()
    ]
))
```

## License

Copyright 2019-2022 Crown Copyright

Licensed under the Apache License, Version 2.0 \(the "License"\); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
