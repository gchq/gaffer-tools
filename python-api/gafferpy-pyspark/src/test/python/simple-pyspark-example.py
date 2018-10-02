from gafferpy_pyspark import gafferpy_pyspark_session as gs
from gafferpy_core import gaffer as g
from gafferpy_core import gaffer_utils as u
from gafferpy_pyspark import gaffer_pyspark as gp

gs.GafferPysparkSession().create_session()

user = u.User(user_id='user')

schemaPath = '../resources/simple-schema.json'
graphConfigPath = '../resources/graphconfig.json'
storePropertiesPath = '../resources/pyspark-mock-accumulo.properties'

graph = (gs.Graph.Builder()
         .schema(schemaPath)
         .config(graphConfigPath)
         .storeProperties(storePropertiesPath)
         .build())

print(graph.getSchema())

edges = []

with open("../resources/data.csv", "r") as f:
    for line in f:
        t = line.rstrip().split(",")
        edges.append(g.Edge(source=str(t[0]), destination=str(t[1]), directed=True, group="BasicEdge", properties={"count": {"java.lang.Long" : 1}}))

add_op = g.AddElements(input=edges)
graph.execute(add_op, user=user)

edge=g.ElementDefinition(group="BasicEdge",group_by=[])
view=g.View(
    edges=[edge]
)

getop = g.GetElements(input=[g.EntitySeed("582")])
result = graph.execute(getop, user)
for element in result:
    print(element)

df_op = gp.GetPysparkDataFrameOfElements(sampleRatio=0.1)
df = graph.execute(df_op, user)

from pyspark.sql.functions import desc
df.sort(desc('count')).show()

rdd_op = gp.GetPySparkRDDOfAllElements(view=view)
rdd = graph.execute(rdd_op, user)

def getCount(edge):
    return (edge.properties.get("count"),1)

count_distribution = rdd.map(getCount).reduceByKey(lambda a, b: a + b).collect()

import math
counts = []
number = []
counts_log = []
number_log = []
for row in count_distribution:
    counts.append(row[0])
    number.append(row[1])
    if row[0] != 0:
        counts_log.append(math.log(row[0]))
        number_log.append(math.log(row[1]))

import numpy as np
r = np.polyfit(x=counts_log, y=number_log, deg=1)
print("y = " + str(r[0]) + "x + " + str(r[1]))

fit_x = []
fit_y = []
num = 100
dx = 6/100
for x in range(0,num):
    fit_x.append(x*dx)
    fit_y.append(r[0]*x*dx + r[1])

from matplotlib import pyplot as plot
plot.figure(figsize=(20,10))
plot.title("counts distribution")
plot.xlabel("count")
plot.ylabel("frequency")
plot.scatter(counts, number)
plot.show()


plot.figure(figsize=(20,10))
plot.title("counts distribution")
plot.xlabel("log(count)")
plot.ylabel("log(frequency)")
plot.scatter(counts_log, number_log)
#plot.scatter(fit_x, fit_y)
plot.show()