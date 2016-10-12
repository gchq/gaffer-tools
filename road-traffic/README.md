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

## Deployment

To run the demo you will first need to build the corresponding version of Gaffer.

To start the demo run:

```bash
mvn clean install -Pquick -Proad-traffic-standalone
```

The rest api will be deployed to localhost:8080/rest and the ui will be deployed to localhost:8080/ui.

The sample data used is taken from the Department for Transport [GB Road Traffic Counts](http://data.dft.gov.uk/gb-traffic-matrix/Raw_count_data_major_roads.zip), which is licensed under the [Open Government Licence](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).


## Example walkthrough

##### Navigate to the UI (the zoom is a bit temperamental in Safari):
```
localhost:8080/ui
```

##### Add a seed as the starting point for your query:
- click 'Add Seed'
- vertex: ```region```
- value: ```South West```
- click 'Add'


##### Build and execute a query to find all locations within the South West region:
- click 'Build query'
- click on the 'South West' vertex
- click 'Next'
- select 'regionContainsLocation'
- click 'Next'
- click 'Next'
- click 'Execute'

The South West vertex will still be selected - click on an empty part of the graph to deselect it.
The around the graph by clicking and dragging the cursor.
Scroll to zoom in/out.

##### Build and execute a query to find all roads within Bristol:
- click 'Build query'
- click on the 'Bristol, City of' vertex
- click 'Next'
- select 'RegionContainsRoad'
- click 'Next'
- click 'Next'
- click 'Execute'


#### Build and execute a query to find all junctions on the M32:
- click 'Build query'
- click on the 'M32' vertex
- click 'Next'
- select 'RoadHasJunction'
- click 'Next'
- click 'Next'
- click 'Execute'


#### Build and execute a query to find the road use between junctions M32:1 and M32:M4 between 6AM and 7AM on 5/3/2005:
- click 'Build query'
- click on the 'M32:1' vertex
- click 'Next'
- select 'RoadUse'
- click 'Next'
- This time we are going to add a filter to the start and end times
- click 'Add filter'
- Enter the following startTime filter:
```
property: startTime
function: gaffer.function.simple.filter.IsMoreThan
orEqualTo: true
value: {"java.util.Date": 1115100000000}
```
- click 'Add filter'
- Enter the following endTime filter:
```
property: endTime
function: gaffer.function.simple.filter.IsLessThan
orEqualTo: true
value: {"java.util.Date": 1115103600000}
```
- click 'Next'
- click 'Execute'


#### Now we will repeat the previous query but with a bigger time window - between 6AM and 8AM on 5/3/2005:
- click 'Build query'
- click on the 'M32:1' vertex
- click 'Next'
- select 'RoadUse'
- click 'Next'
- This time we are going to add a filter to the start and end times
- click 'Add filter'
- Enter the following startTime filter:
```
property: startTime
function: gaffer.function.simple.filter.IsMoreThan
orEqualTo: true
value: {"java.util.Date": 1115100000000}
```
- click 'Add filter'
- Enter the following endTime filter:
```
property: endTime
function: gaffer.function.simple.filter.IsLessThan
orEqualTo: true
value: {"java.util.Date": 1115107200000}
```
- click 'Next'
- click 'Execute'


#### And again, with a bigger time window - between 6AM and 10AM on 5/3/2005:
- click 'Build query'
- click on the 'M32:1' vertex
- click 'Next'
- select 'RoadUse'
- click 'Next'
- This time we are going to add a filter to the start and end times
- click 'Add filter'
- Enter the following startTime filter:
```
property: startTime
function: gaffer.function.simple.filter.IsMoreThan
orEqualTo: true
value: {"java.util.Date": 1115100000000}
```
- click 'Add filter'
- Enter the following endTime filter:
```
property: endTime
function: gaffer.function.simple.filter.IsLessThan
orEqualTo: true
value: {"java.util.Date": 1115114400000}
```
- click 'Next'
- click 'Execute'