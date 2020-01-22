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
4. [Deployment](#deployment)
5. [Configuration](#configuration)
    - [Rest Endpoint](#rest-endpoint)
    - [Operations](#operations)
    - [Types](#types)
    - [Time](#time)
    - [Operation options](#operation-options)
    - [Quick Query](#quick-query)
    - [Graph](#graph)
    - [Saved Results](#saved-results)
    - [Feedback](#feedback)
6. [Testing](#testing)


## Introduction


This module contains a Gaffer UI that connects to a Gaffer REST API.
See [gaffer-tools/ui](https://github.com/gchq/gaffer-tools/tree/master/ui).

If you wish to deploy the war file to a container of your choice, then use this option.

To build the war file along with all its dependencies then run the following command from the parent directory:
' mvn clean install -Pquick'

To deploy it to a server of your choice, take target/ui-[version].war and deploy as per the usual deployment process for your server.

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
./ui/example/federated/basic/scripts/addAccumuloEntitiesGraph.sh
./ui/example/federated/basic/scripts/addMapEdgesGraph.sh
```

You can then get a list of all the graphIds available using the GetAllGraphIds operation. We also have a script for that:
```bash
./ui/example/federated/basic/scripts/getAllGraphIds.sh
```

To test out some queries you will need to add some elements to these graphs. You can use this script:
```bash
./ui/example/federated/basic/scripts/addElements.sh
```

Once you have run these scripts you will have 2 graphs available, accEntities and mapEdges.
In the UI you can perform queries on these 2 graph simultaneously or you can limit which graph you query.
When you open the UI, first head to the settings page and add a default operation option:
'Federated Store - Graph IDs' with the value: accEntities,mapEdges
This will tell the Gaffer you want to query both Graphs. You will then need to click the 'Update Schema' button, to
obtain a merged schema for these 2 graphs.

Now, when you compose a query you will see there is an operation option predefined with the 2 graphs.
If you wish to query just one graph you can modify it just for the single query.

## Deployment

Building the Gaffer UI using maven creates a WAR file which can be deployed alongside the REST API. This can be done as-is 
but should you wish to make changes to the UI such as: 

- Adding your own config
- Changing the theme
- Altering the routes

You will need to unpack and repackage the WAR - much the same as if you were to make changes to the REST API.

To do this, you'll need to add the following plugin to your pom.xml:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-dependency-plugin</artifactId>
            <version>2.10</version>
            <dependencies>
                <dependency>
                    <groupId>uk.gov.gchq.gaffer</groupId>
                    <artifactId>ui</artifactId>
                    <version>${gaffer.version}</version>
                    <type>war</type>
                </dependency>
            </dependencies>
            <executions>
                <execution>
                    <id>unpack</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>unpack</goal>
                    </goals>
                    <configuration>
                        <artifactItems>
                            <artifactItem>
                                <groupId>uk.gov.gchq.gaffer</groupId>
                                <artifactId>ui</artifactId>
                                <version>${gaffer.version}</version>
                                <type>war</type>
                                <overWrite>false</overWrite>
                                <outputDirectory>
                                    ${project.build.directory}/${project.artifactId}-${project.version}
                                </outputDirectory>
                            </artifactItem>
                        </artifactItems>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

This will add all the javascript and html files when you build the project. This means that any files you add will overwrite
the ones in the standard Gaffer UI. To make changes to the UI, you will have to add files to the src/main/webapp directory. You could add or edit any of the files to make the UI truly unique but here are a couple of common examples to get you going:

### config/config.json

This is where you specify graph layout and styling, blacklisted / whitelisted operations or any specific objects that the UI
needs to handle. These will all be documented individually under [Configuration](#configuration).

### app/config/route-config.js

This file defines the routes of the app - including which views to render. 

One of the values: '/results' redirects to '/table'. Editing this value changes where UI navigates when a query is
complete.

Changing these values will have a knock-on effect to the sidebar in the UI.

Here is the default example:

```javascript
angular.module('app').config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(false)

    $routeProvider
        .when('/query', {
            title: 'Query',
            template: '<operation-chain></operation-chain>',
            icon: 'query',
            inNav: true
        })
        .when('/table', {
            title: 'Table',
            template: '<results-table></results-table>',
            icon: 'table',
            inNav: true
        })
        .when('/graph', {
            title: 'Graph',
            templateUrl: 'app/graph/graph-page.html',
            icon: 'graph',
            inNav: true
        })
        .when('/schema', {
            title: 'Schema',
            templateUrl: 'app/schema/schema-view-page.html',
            icon: 'schema',
            inNav: true
        })
        .when('/raw', {
            title: 'Raw',
            template: '<raw></raw>',
            icon: 'raw',
            inNav: true
        })
        .when('/settings', {
            title: 'Settings',
            template: '<settings-view></settings-view>',
            icon: 'settings',
            inNav: true
        })
        .when('/results', {
            redirectTo: '/table'
        })
        .when('/', {
            redirectTo: '/query'
        });
}]);
```

### app/config/theme-config.js

This file contains the configuration for theming within the UI. Changes to this file will result in changes to the colour of
many components throughout the UI.

Here is the default:

```javascript
angular.module('app').config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('orange');
}]);
```

Once you've built the WAR with maven, just add it to the deployments alongside your REST API.

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

### Description

By default the UI will use the description provided by the REST API. If you wish to override this value and set a
custom description for the UI you can do this by using the 'description' configuration key.


```json
{
    "description": "Customised description for the UI"
}
```

### Documentation URL

By default the UI will use the documentation URL provided by the REST API. If you wish to override this value and set a
custom documentation URL for the UI you can do this by using the 'docUrl' configuration key.


```json
{
    "docUrl": "https://some-url.com"
}
```

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


### Operations

The operations section allows you to choose what operations should be available by default.

| variable                     | type    | description
|------------------------------|---------|------------------------------------------
| whiteList                    | array   | optional list of operations to expose to a user. By default all operations are available
| blackList                    | array   | optional list of banned operations. Operations on this list will not be allowed. By default no operations are blacklisted


### Types

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

### Time

Use the time section if you want to specify date ranges easily in your queries and view trends over time in the charts.

#### Filter

You can create a filter object which contains all the necessary values needed to create a time
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
| presets       | object  | An object specifying the preset suggestions. (see below for details)

It's worth noting that if your elements have a single timestamp, just use the same timestamp property in the startProperty and endProperty

##### Presets

You can add preset suggestions which, if configured, will result in a menu being added to the ui containing preset dates.
This can be useful when there are common date ranges used by your users.

The presets object can be as long as you like but be cautious about overwhelming your users with options. You can either use
offsets to create a relative range, or specify dates statically. Offsets must include a unit which can either be 'day', 'week', 'month' or 'year'. Dates are expected to be read in the YYYY-MM-DD date format.

#### Time properties

Telling the UI which properties relate to time is good practice as it helps the UI convert numerical values in the table to strings and improves the way charts display your dates. Furthermore if you're named operations contain date parameters, adding the name of these parameters will allow users to enter their dates in a datepicker.

To configure time properties, you need to provide an object which is keyed by the name of the properties. Each property should contain the class of the class associated with the property and the unit. This unit should be one of:

* Microsecond
* Millisecond
* Second
* Minute
* Hour
* Day

#### Example

```json
{
  "time": {
    "filter": {
      "class": "java.util.Date",
      "unit": "millisecond",
      "startProperty": "startDate",
      "endProperty": "endDate",
      "presets": {
        "Today": {
          "offset": 0,
          "unit": "day"
        },
        "Last week": {
          "offset": -1,
          "unit": "week"
        },
        "2002": {
          "date": "2002-01-01"
        }
      }
    },
    "properties": {
      "startDate": {
        "class": "java.util.Date",
        "unit": "millisecond"
      },
      "endDate": {
        "class": "java.util.Date",
        "unit": "millisecond"
      }
    }
  }
}
```

### Operation options

Operations can contain options which can affect how the operation is handled. For example, when using a federated store,
you can specify which graphId you wish to run an operation against.

The UI allows you configure which of these options you make available to the user. In the past, this feature has been 
available but was not formally documented.

#### Old configuration
```json
{
    "operationOptionKeys": {
        "UI label": "key.to.be.sent.to.Gaffer"
    }
}
```

Now you can specify default values and whether to hide the option by default.

#### New configuration
```json
{
    "operationOptions": {
        "visible": [
            {
                "key": "key.to.be.sent.to.Gaffer",
                "label": "UI label",
                "value": "The default value (optional)",
                "multiple": false,
                "autocomplete": {
                    "options": [ "true", "false" ]
                }
            }
        ],
        "hidden": [
            {
                "key": "hidden.key",
                "label": "hidden label"
            }
        ]
    }
}
```

If you add more options to the visible array, the options will be shown by default. If you add them to the hidden array, a 
user will have to add it manually. Only the visible operation options will be added to the operation.

The options themselves are objects with the following fields:

| field name                 | type             | description
|----------------------------|------------------|----------------------------------------------------------
| key                        | string           | The operation option key which will be sent to the rest service
| label                      | string           | The label which will summarise what the option is
| multiple                   | boolean          | (optional) uses chips to create comma delimited strings - defaults to false
| value                      | string or array  | (optional) The default value of this option. Use arrays when multiple is set to true
| autocomplete               | object           | (optional) Configuration for autocompleting values - see below
| autocomplete.options       | array            | Static array of string to use for autocompleting
| autocomplete.asyncOptions  | operation        | operation to be executed to get the autocomplete values. Operation must return an iterable of strings



### Quick Query

You can edit the behaviour of the quick query component in the Gaffer UI using the following properties. If you want to disable this feature, set quickQuery to null in the config. For example:

```json
{
    "quickQuery": null
}
```

| name                        |  type           | description                            
|-----------------------------|-----------------|---------------------------------------------------------
| placeholder                 | string          | The string placeholder on the search box. Defaults to "Quick Query"
| description                 | string          | A brief description of what the query does. Defaults to "Get related elements"
| operation                   | gaffer operation| An operation or operation chain you wish to execute when the user runs the query. Make sure to substitue "${input}" (with quotes) for where the input should be. The quick query component will generate an entity seed and replace the "${input}" string with the entity seed. Defaults to a GetElements operation.
| useDefaultOperationOptions  | boolean         | A flag representing whether the UI should add the default operation options specified in the settings page (if they are specified). Defaults to false
| deduplicate                 | boolean         | A flag representing whether a ToSet operation is added to the chain to remove duplicate values. Defaults to true.
| limit                       | boolean         | A flag representing whether a Limit operation is added to the chain. The operation will use the result limit specified in the settings page. If disabled and the query returns more than the result limit, the results will be truncated anyway. Therefore the limit operation is there to save query time. Defaults to true.

#### Example

```json
{
    "quickQuery": {
        "placeholder": "Enter a seed",
        "description": "2 hop query",
        "useDefaultOperationOptions": true,
        "deduplicate": true,
        "limit": false,
        "operation": {
            "class": "OperationChain",
            "operations": [
                {
                    "class": "GetAdjacentIds",
                    "input": [ "${input}" ]
                },
                {
                    "class": "GetElements",
                    "view": {
                        "globalElements": [
                            {
                                "groupBy": []
                            }
                        ]
                    }
                }
            ]
        }
    }
}
```


### Graph

The graph section allows you to configure the graph view. 
An admin can customise the physics which guide the graph, as well as provide styling for the nodes and edges.
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

As well as the physics, an admin can determine the styling of nodes and edges of their graph based on things like edge type,
vertex fields and vertex type. They can add an entity wrapper, which is further styling applied when the vertex is an entity.
This helps distinguish them from standalone vertices. By default the graph adds some styling like changing the size and adding a border of entities. This default styling can also be configured.

To add styling, update your config file like this:

```json
{
    "graph": {
        "defaultStyle": {
            "edges": {
                "arrow-shape": "triangle"
            },
            "vertices": {
                "background-color": "#444444"
            },
            "entityWrapper": {
                "height": 100,
                "width": 100,
                "border-width": 3
            }
        },
        "style": {
            "edges": {
                "exampleEdgeGroup": {
                    "line-color": "#000000"
                }
            },
            "vertexTypes": {
                "exampleVertexType": {
                    "style": {
                        "background-color": "#00ffff"
                    },
                    "fieldOverrides": {
                        "fieldName": {
                            "fieldValue": {
                                "background-image": "path/to/icon.svg"
                            }
                        }
                    }
                }
            }
        }
    }
}
```

For all the examples of what you can customise check out [Cytoscape.js](http://js.cytoscape.org/#style)
We have all the material design icons [here](https://github.com/gchq/gaffer-tools/blob/master/ui/src/main/webapp/app/img/material-icons) which you can use as background images. There are examples of how to do this in the [road traffic](https://github.com/gchq/gaffer-tools/blob/master/ui/example/road-traffic/config/config.json) and [type-subtype-value](https://github.com/gchq/gaffer-tools/blob/master/ui/example/type-subtype-value/config/config.json) config files.

If you're using a simple string or number as your vertex, use "undefined" as your key. Otherwise you'll need to use the field
name specified in the [types section](#types).

### Saved Results

You can configure the UI to allow results to be saved. The results are stored using the Gaffer ExportToGafferResultCache
and GetGafferResultCacheExport operations, which if configured, will store the results in a separate Gaffer graph.

This UI feature then adds a cookie 'savedResults' which contains the IDs of the user's saved results.

```json
"savedResults": {
    "enabled": true,
    "key": "savedResults",
    "timeToLiveInDays": 7
},
```

| name                 |  type    | description
|----------------------|----------|---------------------------------------------------------
| enabled              | boolean  | If true then the feature is enabled
| key                  | string   | The cookie key
| timeToLiveInDays     | number   | The number of days the cookie should be kept for.


### Feedback

An optional feedback section can be added which the UI uses to send feedback to developers using email. If this section is
left blank, no feedback button will be rendered. You can specify a list of email addresses and the subject of the email.

| field        | type                | description
|--------------|---------------------|--------------------------------------------------------------------------
|    subject   |       String        | An optional (defaults to "Gaffer feedback") subject header of the email
|  recipients  | array&lt;string&gt; | A list of email addresses who receive the emails.

#### Example

```json
{
    "feedback": {
        "subject": "feedback for <your system here>",
        "recipients": [
            "adminperson@organisation.com",
            "someoneElse@theSameOrganisation.com"
        ]
    }
}
```


### Table

You can also configure the way data is displayed in the table view.

| field          | type                | description
|----------------|---------------------|--------------------------------------------------------------------------
|    truncation  |       String        | Allows you to configure how truncation is used in the table view.
|    - maxLength |       Number        | The maximum length of a value to display, values longer will be truncated. Default is 500. Set it to -1 to disable truncation.
|    - text      |       String        | The text to use to signal to the user that the value was truncated. Default is "..."

#### Example

```json
{
    "table": {
        "truncation": {
            "maxLength": 500
            "text": "..."
        }
    }
}
```

### Operation Chain Saving

Added in Gaffer UI 1.10.0, users now have the ability to save their operation chains. This uses Gaffer's Named
Operation feature and saving a query runs an AddNamedOperation under the hood. The named operations that are saved are only visible to the user that created them. Users should be aware that all inputs and filters in the operation chain are added to the named operation.

However if your Gaffer Graph does not make use of this feature, the "Save operation chain" button can be removed along with the sidenav by adding the following to the configuration:
```json
{
    "enableChainSaving": false
}
```

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
    describe('add()', function() {
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
