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

Road Use Demo
=============

To run the demo you will first need to build the corresponding version of Gaffer.

To start the demo run:

```bash
mvn clean install -Pquick -Proad-traffic-standalone
```

The rest api will be deployed to localhost:8080/rest and the ui will be deployed to localhost:8080/ui.

The sample data used is taken from the Department for Transport [GB Road Traffic Counts](http://data.dft.gov.uk/gb-traffic-matrix/Raw_count_data_major_roads.zip), which is licensed under the [Open Government Licence](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

An example seed to use in the UI is:
```
Vertex: region
Value: South West
```