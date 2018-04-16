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

1. [Introduction](#introduction)
2. [Road Traffic example](#road-traffic-example)
    - [Walkthrough](#walkthrough)
3. [Federated Store Demo](#federated-store-demo)
4. [Configuration](#configuration)
    - [Rest Endpoint](#rest-endpoint)
    - [Operations section](#operations-section)
    - [Types section](#types-section)
    - [Time section](#time-section)
5. [Testing](#testing)


## Introduction


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
- in the "Add Seeds" section we will add a seed as the starting point for your query:
  - Value: ```South West```
  - Click '+' or press 'enter'  Don't forget this step!
- in the Filters section select 'RegionContainsLocation' from the edges dropdown to tell Gaffer you only want 'RegionContainsLocation' edges to be returned. If you didn't select any groups then you would just get all groups returned.
- click the execute query button in the bottom right hand corner

Move the graph around by clicking and dragging the cursor.
Scroll to zoom in/out.

##### Build and execute a query to find all roads within Bristol:
- click on the 'Bristol, City of' vertex
- navigate to the 'query' page
- in the 'Add Seeds' section you can see the 'Bristol, City of' vertex is selected. We do not need to add anymore seeds this time.
- select 'LocationContainsRoad' edges drop down of the filters section
- click the execute button in the bottom right hand corner


#### Build and execute a query to find all junctions on the M32:
- click on the 'M32' vertex
- navigate to the 'query' page
- select 'RoadHasJunction' from the edges dropdown in the filter section.
- click the execute button in the bottom right hand corner


#### Build and execute a query to find the road use between junctions M32:1 and M32:M4 between 6AM and 7AM on 3/5/2005:
- click on the 'M32:1' vertex
- navigate to the 'query' page
- to add the time filter, go to the date card
    - enter or select '03/05/2005' into the start and end date
    - enter 07:00 and 09:00 into the appropriate time boxes
- to specify the edge type we need to use the filters section again
    - select 'RoadUse' from the edges drop down
- click the execute button in the bottom right hand corner

If you find the 'RoadUse' edge in the graph and click on it, you will see the following information in the selected elements window:

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


#### Now we will repeat the previous query but with a bigger time window - this time between 6AM and 8AM on 3/5/2005:
- click on the 'M32:1' vertex
- navigate to the 'query' page
- select 'Get Elements' from the operation drop down
- enter '03/05/2005' into the start and end date, but this time enter 06:00 and 08:00 as the start and end time.
- select 'RoadUse'
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

## Federated Store Demo
There is also a Federated Store Demo, which can be run using:
```bash
./ui/example/federated/scripts/start.sh
```

After the REST and UI have been started you will need to add some federated graphs. There are some example scripts that will execute the AddGraph operation on the REST api (via curl):
```bash
./ui/example/federated/scripts/addAccumuloEntitiesGraph.sh
./ui/example/federated/scripts/addMapEdgesGraph.sh
```

You can then get a list of all the graphIds available using the GetAllGraphIds operation. We also have a script for that:
```bash
./ui/example/federated/scripts/getAllGraphIds.sh
```

To test out some queries you will need to add some elements to these graphs. You can use this script:
```bash
./ui/example/federated/scripts/addElements.sh
```

Once you have run these scripts you will have 2 graphs available, accEntities and mapEdges.
In the UI you can perform queries on these 2 graph simultaneously or you can limit which graph you query.
When you open the UI, first head to the settings page and add a default operation option:
'Federated Store - Graph IDs' with the value: accEntities,mapEdges
This will tell the Gaffer you want to query both Graphs. You will then need to click the 'Update Schema' button, to
obtain a merged schema for these 2 graphs.

Now, when you compose a query you will see there is an operation option predefined with the 2 graphs.
If you wish to query just one graph you can modify it just for the single query.


## Configuration

Like much of Gaffer, the UI is customisable. This is achieved using a config file. 
Default config is loaded from config/defaultConfig.json. An additional
config file config/config.json is then loaded. This allows you to include your
own configurations or override defaults.

You can find examples of these within the example directory:

- config/config.json
- road-traffic/config/config.json - The config used for the road traffic demo
- federated/config/config.json - The config used for the federated store demo

The configuration is made up of different sections and is written in JSON:

### Rest Endpoint

The rest endpoint that the UI uses can be changed. By default, it assumes that the rest service is running on the same
machine as the UI, on the same port, at "/rest/latest". You could overwrite this by specifying a value in the
"restEndpoint" field. This would change where the UI gets the schema from and run operations etc.

An example of a changed rest endpoint:

```
{
    "restEndpoint": "http://localhost/mygraphname/rest/latest",
    "operations": { ... },
    "types": { ... },
    "time": { ... }
}

```


### Operations section

The operations section allows you to choose whether to load named operations on startup as well
as what operations should be available by default.

| variable                     | type    | description
|------------------------------|---------|------------------------------------------
| loadNamedOperationsOnStartup | boolean | should the UI attempt to load all the named operations and expose them for query
| defaultAvailable             | array   | List of objects describing the operations that are available by default (without calling the Named Operations endpoint)
| whiteList                    | array   | optional list of operations to expose to a user. By default all operations are available
| blackList                    | array   | optional list of banned operations. Operations on this list will not be allowed. By default no operations are blacklisted

#### Default available operations API

Default available operations are configured using a list of objects. These objects contain key value pairs which tell
the UI what options it has for a given operations - whether it uses a view or parameters etc.

| variable    | type    |  description
|-------------|---------|-------------------------------
| name        | string  | A friendly name for the operation
| class       | string  | The java class of the operation
| input       | boolean/string | A flag which determines whether it takes seeds as input, if taking a pair of inputs it should be set to the fully qualified Pair Class: "uk.gov.gchq.gaffer.commonutil.Pair"
| inputB      | boolean | A flag stating whether there should be a second input
| view        | boolean | A flag showing whether the operation takes a view - Always false for named operations currently
| description | string  | A description of what the operation does
| arrayOutput | boolean | A flag indicating whether the operation returns an array *(not required)*
| inOutFlag   | boolean | A flag indicating that the operation returns edges. And the direction can be customised.


If you want to allow Named Operations which use an operation which uses takes pairs of inputs, make sure the first operation is added to the default available operations.

### Types section

The types section of the configuration tells the UI how to interpret and show java objects. You will need to figure out
how you want to visualise certain objects. It is advisable to create a type for every Java object the UI will come
across with the exception of Maps, Lists and Sets, which are automatically handled.

**Warning** For those using Bitmaps in their graphs, make sure to configure the type. Otherwise, it will be treated like
any other Map and will probably look completely wrong.

To create a type, use the full class name as the key and create an object with the following fields:

| name        | type    | description
|-------------|---------|-------------------------------------------
| fields      | array   | The fields within the class *see below for creating fields*
| wrapInJson  | boolean | (optional) Should the object be wrapped in JSON. For example Longs, you should wrap but Integers and Strings you shouldn't
| custom      | boolean | (optional) indicates whether the object is a custom object. *see below for details*

#### Fields

Fields are the individual parts which make up an object. They are made up of various sub-fields which describe how the
field should be created and stored.

| name        | type    | description
|-------------|---------|-------------------------------------------
| label       | string  | A label to be applied to inputs
| key         | string  | (optional) a key to store the field against. Omit this field for simple objects that store a value against a class name eg: { "java.lang.Long": 1000000 } as opposed to { "java.lang.Long": { "key": 1000000}}
| type        | string  | the javascript/html type. This translates to how the value is inputted
| step        | number  | (number values only) how much to increment a value by if using the up/down arrows
| class       | string  | The class of this field - this can be another type
| required    | boolean | Whether the field is required to make up the object

For complex types like the HyperLogLogPlus, the value can be determined by going a few layers down in the object.
in order to create a custom object use a '.' in the key to separate the layers. Using the example of the HyperLogLogPlus,
the key is 'hyperLogLogPlus.cardinality' because the cardinality is the only meaningful part:

```
{
    "com.clearspring.analytics.stream.cardinality.HyperLogLogPlus": {
        "hyperLogLogPlus": {
            "cardinality": 5, <----------- The useful information
            "bytes" "/f/a/f/f/32/343/5/6///////"
        }
    }
}

```

### Time section

Use the time section if you want to specify a date range filter easily across all elements in your queries.
In the time section, you will create a filter object which contains all the necessary values needed to create a time
window.

To use the time window feature, some assumptions should be true:
 - Your start and end date properties must be the same on each element
 - The units must be the same for the start and end date
 - The classes of object must be the same for the start and end date

 If all these are true, we can proceed and start creating the filter. It takes the following parameters:

| name          | type    | description
|---------------|---------|------------------------------------------------
| startProperty | string  | The name of the start date property
| endProperty   | string  | The name of the end date property
| unit          | string  | The unit of time. This can be one of: day, hour, minute, second, millisecond, microsecond. This is not case sensitive.
| class         | string  | The java class of the object - this class should exist in the types section

It's worth noting that if your elements have a single timestamp, just use the same timestamp property in the startProperty and endProperty

### Graph section
The graph section allows you to configure the graph view. 
Currently you are limited to configuring the physics used to draw the graph.
The default graph physics are:

```json
"graph": {
    "physics": {
      "springLength": 200,
      "dragCoeff": 0,
      "stableThreshold": 0.000001,
      "fit": true
    }
  }
```

For more information about the configuration of the graph physics and to 
see the algorithm, please see: https://github.com/nickolasmv/cytoscape-ngraph.forcelayout

## Testing

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
```bash
mvn clean integration-test -pl ui
```

If you wish to just run a single test spec file then this can be done by
overriding the jasmine.test.paths maven property and setting it to a
path to your test spec file (relative to the ui/test/webapp/app directory):
```bash
mvn clean integration-test -pl ui -Djasmine.test.paths=gaffer/time-service-spec.js
```

You can also run the jasmine continuous integration tool using this command:
```bash
mvn clean install -Pcontinuous-integration
```