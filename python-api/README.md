# Gafferpy #

A python API for Gaffer.

The Gafferpy API allows access to Gaffer graphs in 3 ways:

 - Over Gaffer's [REST API](https://github.com/gchq/Gaffer/tree/master/rest-api) using the `gaffer_connector`
 - In a native python environment running on the same machine/cluster as Gaffer using a `GafferPythonSession`
 - In [PySpark](https://spark.apache.org/docs/0.9.0/python-programming-guide.html), giving access to RDDs and DataFrames of Elements in the graph and using a spark session via a `GafferPysparkSession`
 
## Gaffer Pyspark API ##

### A simple example with a local, in-memory graph ###

To work with Gaffer-Pyspark you will need to install [python 3](https://www.anaconda.com/download/) and [spark](https://spark.apache.org/downloads.html) (gaffer-pyspark works with spark 2.2.1).

 1. Build the project using maven. In the `python-api` directory, type `mvn clean package`. 
 2. When the build has finished, you should see a directory called `gafferpy-release-VERSION` in the `python-api` folder that contains 2 files: `gafferpy-build-VERSION-jar-with-dependencies.jar` and `gafferpy-build-VERSION-python-modules.zip`
 3. Start the pyspark shell: `pyspark --jars PATH_TO_gafferpy-build-VERSION-jar-with-dependencies.jar --py-files PATH_TO_gafferpy-build-VERSION-python-modules.zip`
 
In the pyspark shell:

Import the gaffer packages

```
from gafferpy_pyspark import gafferpy_pyspark_session as gs
from gafferpy_core import gaffer as g
from gafferpy_core import gaffer_utils as u
from gafferpy_pyspark import gaffer_pyspark as gp
```

start a gaffer-pyspark session

```
gs.GafferPysparkSession().create_session()
```

create a Gaffer user

```
user = u.User(user_id='user')
```

Use the example gaffer schemas and store-properties

```
schemaPath = 'PATH_TO_python-api/gafferpy-pyspark/src/test/resources/simple-schema.json'
graphConfigPath = 'PATH_TO_python-api/gaffer-tools/python-api/gafferpy-pyspark/src/test/resources/graphconfig.json'
storePropertiesPath = 'PATH_TO_python-api/gaffer-tools/python-api/gafferpy-pyspark/src/test/resources/pyspark-mock-accumulo.properties'
```
 
Create a Gaffer graph
 
```
graph = (gs.Graph.Builder()
         .schema(schemaPath)
         .config(graphConfigPath)
         .storeProperties(storePropertiesPath)
         .build())
```

View the schema

```
print(graph.getSchema())
```

Add the example data

```
edges = []

with open("PATH_TO_python-api/gaffer-tools/python-api/gafferpy-pyspark/src/test/resources/data.csv", "r") as f:
    for line in f:
        t = line.rstrip().split(",")
        edges.append(g.Edge(source=str(t[0]), destination=str(t[1]), directed=True, group="BasicEdge", properties={"count": {"java.lang.Long" : 1}}))
```

```
add_op = g.AddElements(input=edges)
graph.execute(add_op, user=user)
```

Create a view on the data

```
edge=g.ElementDefinition(group="BasicEdge",group_by=[])
view=g.View(
    edges=[edge]
)
```

Return some edges

```
getop = g.GetElements(input=[g.EntitySeed("582")])
result = graph.execute(getop, user)
for element in result:
    print(element)
```

Return a spark dataframe of elements

```
df_op = gp.GetPysparkDataFrameOfElements(sampleRatio=0.1)
df = graph.execute(df_op, user)
```

Sort the results by the `count` property

```
from pyspark.sql.functions import desc
df.sort(desc('count')).show()
```


Get an RDD of elements

```
rdd_op = gp.GetPySparkRDDOfAllElements(view=view)
rdd = graph.execute(rdd_op, user)
```

USe pyspark to calculate the distribution of counts

```
def getCount(edge):
    return (edge.properties.get("count"),1)
    
count_distribution = rdd.map(getCount).reduceByKey(lambda a, b: a + b).collect()
```

### Use with larger graphs ###

If you already have a large Gaffer instance running and want to use the pyspark api with it, follow the same steps above except that you will need to point to the larger graph's schema, graphconfig and store-properties files when you create the python graph object.
And you'll probably want to skip the add data step, but the rest should work the same way.