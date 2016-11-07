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


GafferPop
==================================

GafferPop is a lightweight Gaffer implementation of TinkerPop, where TinkerPop methods are delegated to Gaffer graph operations.

It is still experimental and should be used with caution.

The implementation is very basic and currently suffers from very poor performance in comparison to using Gaffer directly.


Setup
------------------
Create a GafferPopGraph using GraphFactory.open(...)

You must provide a configuration file containing a path to a Gaffer store.properties file and comma separated list of of paths for Gaffer schema files, e.g:

    gremlin.graph=gaffer.gafferpop.GafferPopGraph
    gaffer.storeproperties=conf/gaffer/store.properties
    gaffer.schemas=conf/gaffer/schema/dataSchema.json,conf/gaffer/schema/dataTypes.json

To use the gremlin console download 'apache-gremlin-console-3.2.0-incubating-bin.zip'

To get going with the tinkerpop-modern dataset backed by a MockAccumuloStore you can do the following:

```bash
    # Build the code
    mvn clean install -Pquick -Pgafferpop

    gremlinConsolePath=[gremlin-console-path]

    # Create the necessary directories in the gremlin console folder
    mkdir $gremlinConsolePath/conf/gafferpop
    mkdir -p $gremlinConsolePath/ext/gafferpop/plugin

    # Copy the required files into the gremlin console folder
    cp -R tinkerpop/src/test/resources/* $gremlinConsolePath/conf/gafferpop
    cp -R tinkerpop/target/tinkerpop-*.jar tinkerpop/target/gafferpop-*.jar  $gremlinConsolePath/ext/gafferpop/plugin

    # Start gremlin
    cd $gremlinConsolePath
    ./bin/gremlin.sh

    # Activate the GafferPop plugin
    :plugin use gaffer.gafferpop.GafferPopGraph
```


load the tinkerpop modern data set:

    graph = GraphFactory.open('conf/gafferpop/gafferpop-tinkerpop-modern.properties')
    graph.io(graphml()).readGraph('data/tinkerpop-modern.xml')
    g = graph.traversal(standard())

do some queries:

    g.V('1').hasLabel('person')
    g.V('1', '2').hasLabel('person').outE('knows').values().is(lt(1))

calculate the shortest path from 1 to 3 (max 6 loops):

    start = '1';
    end = '3';
    g.V(start).hasLabel('id').
       repeat(bothE().otherV().hasLabel('id').simplePath()).
         until(hasId(end).or().loops().is(6)).
       hasId(end).path()

Gaffer mapping to TinkerPop terms
------------------
 - Group -> Label
 - Vertex -> Vertex with label 'id'
 - Entity -> Vertex
 - Edge -> Edge
 - Edge ID -> gaffer.gafferpop.EdgeId(sourceId, destinationId)


Limitations
------------------

There are several restrictions with this implementation. The following is not supported by GafferPop:
 - Removal
 - Updating properties
 - Undirected edges
 - Entity group 'id' is reserved for an empty group containing only the vertex id
 - When you get the in or out Vertex directly off an Edge it will not contain any actual properties - it just returns the ID vertex. This is due to Gaffer allowing multiple entities to be associated with the source and destination vertices of an Edge.

Gaffer allows for graphs containing no entities. In order to traverse the graph in TinkerPop
the result of all vertex queries will also contain an empty Vertex labeled 'id' (even if no entities are found in Gaffer).