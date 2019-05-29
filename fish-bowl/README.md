Copyright 2019 Crown Copyright

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


Fishbowl
============================

An experimental Python client which generates a Gaffer python library from a Gaffer REST API

Things it currently does:
* Generates python files for Operations, Predicates and Functions based on an Gaffer API
* Provide different methods and functions based on those available on the Gaffer API

Things it will do:
* Provide a mechanism for executing the operations on the remote REST API

Things it should do:
* Generate Binary operators based on the API (needs server side work)

Things it will not do:
* Make toast... yet

## How does it work?

```python
from fishbowl.fishbowl import Fishbowl
fb = Fishbowl("http://localhost:8080/rest/latest")
```
Your python files will be appear in a folder called `g`
They can be imported using the following command:
```python
from g import *
```

You can then construct Gaffer objects using the following syntax

```python
get = g.operations.GetElements()
```