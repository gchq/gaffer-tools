# Gafferpy #

A python API for Gaffer.

The Gafferpy API allows access to Gaffer graphs in 3 ways:

 - Over Gaffer's [REST API](https://github.com/gchq/Gaffer/tree/master/rest-api) using the `gaffer_connector`
 - In a native python environment running on the same machine/cluster as Gaffer using a `GafferPythonSession`
 - In [PySpark](https://spark.apache.org/docs/0.9.0/python-programming-guide.html), giving access to RDDs and DataFrames of Elements in the graph and using a spark session via a `GafferPysparkSession`
 