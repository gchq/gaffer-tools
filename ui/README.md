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


UI
============


This module contains a Gaffer read only UI prototype that connects to a Gaffer REST API.
See [gaffer-tools/ui](https://github.com/gchq/gaffer-tools/tree/master/ui).

Limitations:
- There are currently no error messages.
- There is no validation.
- Read only - no data can be added via the UI.


If you wish to deploy the war file to a container of your choice, then use this option.

To build the war file along with all its dependencies then run the following command from the parent directory:
' mvn clean install -Pquick'

To deploy it to a server of your choice, take target/ui-[version].war and deploy as per the usual deployment process for your server.

There is a settings page in the ui where you can temporarily change the REST API URL, alternatively you will need to edit the settings.js file to set the URL permanently.

Alternatively there is a maven profile "standalone-ui" that you can use to start the UI in a standalone tomcat server.
Note that in order to use the UI it will need to be connected separately to a Gaffer REST API.

```bash
mvn install -Pquick -Pstandalone-ui -pl ui -am
```


## Road Traffic example

To demo the UI you can connect it to the Gaffer Road Traffic example REST API.

To deploy both the road-traffic example REST API and the UI you can use the
road-traffic example start script:

```bash
./ui/example/road-traffic/scripts/start.sh
```

### Walkthrough

We've modelled the road use data as a simple Gaffer graph to demonstrate how Gaffer lets users explore and summarise data.

There are edges representing:

 - Region to Location: e.g South West - Bristol, South West - Devon etc.
 - Location to Roads: e.g. Bristol - M32 etc
 - Roads and their Junctions: e.g. M32 - M32:1, M32 - M32:2, etc.
 - Junctions and their locations: e.g. M32:2 - 361150,175250, etc.
 - Traffic counts between junctions during specific hours: e.g. M32:1 - M32:2 etc.

We can start with a uk region, such as the South West, and find the locations within that region. Then pick one or more of those locations, find the roads there and list their junctions. Then between any pair of adjacent junctions, we can summarise the vehicle counts over a time range of our choosing. 

There will be multiple edges representing the traffic counts between the same two junctions: one for each hour of observation recorded in the data. Each of the RoadUse edges has properties attached to it representing the start of the hour during which the traffic was counted, the end of the hour, the total vehicle count for the hour and a map of vehicle type to count for the hour.

For example:

```json
 {
    "group": "RoadUse",
    "source": "M32:1",
    "destination": "M32:M4 (19)",
    "directed": true,
    "class": "uk.gov.gchq.gaffer.data.element.Edge",
    "properties": {
      "countByVehicleType": {
        "uk.gov.gchq.gaffer.types.simple.FreqMap": {
          "HGVR3": 2004,
          "BUS": 1375,
          "HGVR4": 1803,
          "AMV": 407034,
          "HGVR2": 11369,
          "HGVA3": 1277,
          "PC": 1,
          "HGVA5": 5964,
          "HGVA6": 4817,
          "CAR": 320028,
          "HGV": 27234,
          "WMV2": 3085,
          "LGV": 55312
        }
      },
      "startDate": {
        "java.util.Date": 1034316000000
      },
      "endDate": {
        "java.util.Date": 1431540000000
      },
      "count": {
        "java.lang.Long": 841303
      }
    }
  }
```

Gaffer allows us to query the set of RoadUse edges between two junctions across a time range that we choose. It will return a single RoadUse edge representing the sum of the vehicle counts over the time period we have queried for.   

The following steps will take you through a simple exploration and summarisation of the road use data.

##### Navigate to the UI (the zoom is a bit temperamental in Safari):
```
localhost:8080/ui
```

You will be taken directly to the query page. Here is where you can build your query.


##### Build and execute a query to find all locations within the South West region:
- click on the 'Get Elements' row
- in the "Add Seeds" section we will add a seed as the starting point for your query:
  - Vertex Type: ```region```
  - Value: ```South West```
  - Click '+'  Don't forget this step!
- in the "Configure View" section select 'RegionContainsLocation' to tell Gaffer you only want 'RegionContainsLocation' edges to be returned. If you didn't select any groups then you would just get all groups returned.
- click the execute query button in the bottom right hand corner

Move the graph around by clicking and dragging the cursor.
Scroll to zoom in/out.

##### Build and execute a query to find all roads within Bristol:
- click on the 'Bristol, City of' vertex
- navigate to the 'query' page
- click on the 'Get Elements' row
- in the 'Add Seeds' section you can see the 'Bristol, City of' vertex is selected. We do not need to add anymore seeds this time.
- select 'LocationContainsRoad' on the view card
- click the execute button in the bottom right hand corner


#### Build and execute a query to find all junctions on the M32:
- click on the 'M32' vertex
- navigate to the 'query' page
- click on the 'Get Elements' row
- select 'RoadHasJunction' on the view card
- click the execute button in the bottom right hand corner


#### Build and execute a query to find the road use between junctions M32:1 and M32:M4 between 6AM and 7AM on 5/3/2005:
- click on the 'M32:1' vertex
- navigate to the 'query' page
- click on the 'Get Elements' row
- select 'RoadUse' on the view card
- This time we are going to add a filter to the start and end times
- click 'Add Pre Aggregation filter'
- Enter the following startDate filter:
```
property: startDate
function: uk.gov.gchq.koryphe.impl.predicate.InDateRange
start: 2005/05/03 07:00
end: 2005/05/03 08:00
```
- click the execute button in the bottom right hand corner

If you find the 'RoadUse' edge in the graph and click on it, you will see the following information in the pop-up:

```
M32:1 to M32:M4 (19)
RoadUse	
startDate: 1115103600000
endDate: 1115107200000
count: 14400
countByVehicleType: HGVR3: 44, BUS: 10, HGVR4: 28, AMV: 6993, HGVR2: 184, HGVA3: 19, PC: 0, HGVA5: 99, HGVA6: 40, CAR: 5480, HGV: 414, WMV2: 44, LGV: 1045
```

This shows the vehicle types and their counts between these two junctions for the time period described by the filters.

Alternatively, if you click the 'Table' tab at the top of the UI you will see a table with 'Entity' and 'Edge' tabs.

Click the 'Edge' tab and you will see a table listing all of the edges displayed in the Graph based on the queries run so far.

Clicking the 'Raw' tab at the top of the UI displays the Json constructed and handed to Gaffer to run the queries.


#### Now we will repeat the previous query but with a bigger time window - this time between 6AM and 8AM on 5/3/2005:
- click on the 'M32:1' vertex
- navigate to the 'query' page
- click on the 'Get Elements' row
- select 'RoadUse' on the view card
- This time we are going to add a filter to the start and end times with a bigger time window
- click 'Add Pre Aggregation filter'
- Enter the following startDate filter:
```
property: startDate
function: uk.gov.gchq.koryphe.impl.predicate.InDateRange
start: 2005/05/03 07:00
end: 2005/05/03 09:00
```
- click the execute button in the bottom right hand corner

Now if you click on the 'RoadUse' edge, or visit the 'Edges' Table view, you'll see that two 'RoadUse' summaries are displayed:

```
RoadUse
startDate: 1115103600000
endDate: 1115107200000
count: 14400
countByVehicleType: HGVR3: 44, BUS: 10, HGVR4: 28, AMV: 6993, HGVR2: 184, HGVA3: 19, PC: 0, HGVA5: 99, HGVA6: 40, CAR: 5480, HGV: 414, WMV2: 44, LGV: 1045

RoadUse
startDate: 1115103600000
endDate: 1115110800000
count: 28103
countByVehicleType: HGVR3: 68, BUS: 28, HGVR4: 50, AMV: 13640, HGVR2: 370, HGVA3: 35, PC: 0, HGVA5: 204, HGVA6: 96, CAR: 10924, HGV: 823, WMV2: 95, LGV: 1770
```
The top one is from the first query.

The next is a summary over the two hours we specified in our second query. (You can verify this by querying again for second hour separately and then adding counts from the two single-hour summaries together).

In this example we have summarised the vehicle counts by adding them together. Gaffer users are free to define the objects that represent the properties on an edge and the functions used to summarise them and so supports things that are much more complex than adding integers together.

There are some in-depth examples based around the Java API here: [Getting Started](https://gchq.github.io/gaffer-doc/summaries/getting-started.html).

### Testing

The UI contains both End-to-End Selenium tests and Jasmine unit tests. The former testing user interactions, and the
latter testing small units of javascript. New functionality being added to the UI should be fully tested using both
frameworks if appropriate.

If adding functionality to the query page, you can append tests to QueryBuilderST.java. Otherwise, create a new system test.

To add a new unit test, create a file in the "src/test/webapp/" which mirrors it's location in main. For example, to test for the graph service, I would create a file in "src/test/webapp/app/graph" and name unit test file "graph-service-spec.js" and the integration test file "graph-service-integration-spec.js". Be sure to end the file in "-spec.js" so that the jasmine plugin can run the test.

Make your Jasmine specs self documenting as it should define the behaviour of the code.

Start the test with the name of whatever component/service/controller your testing. Separate the spec into logical parts and then define what it's behaviour should be':

```
describe('SomeService', function() {
    // all tests for someService go here

    // inject dependencies and create new service for each test

    // lets test it exists
    it('should Exist', function() {
        expect(service).toBeDefined();
    });

    // now test a specific part of the service
    describe('add function', function() {
        it('should add two positive numbers together', function() {
            expect(someService.add(1, 4)).toEqual(5)
        });
    });
})
```

you can manually run all the unit tests with the command:
```
mvn clean integration-test -pl ui
```
