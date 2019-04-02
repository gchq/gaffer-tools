import gafferpy_core.gaffer_session as GS

sesh = GS.GafferPythonSession().connect_to_session()

print("Port Number is: %d " % sesh.getPortNumber())


print("Status Code is: %d " % sesh.getStatusCode())

schemaPath = '/Users/P41669/Documents/gaffer-tools/python-api/gafferpy-pyspark/src/test/resources/simple-schema.json'
graphConfigPath = '/Users/P41669/Documents/gaffer-tools/python-api/gafferpy-pyspark/src/test/resources/graphconfig.json'
storePropertiesPath = '/Users/P41669/Documents/gaffer-tools/python-api/gafferpy-pyspark/src/test/resources/pyspark-mock-accumulo.properties'

test = GS.Graph().Builder().config(graphConfigPath).schema(schemaPath).storeProperties(storePropertiesPath).build()

print(test.getSchema())

sesh.stop()

print("Service KILLED")
print("Status Code is: %d " % sesh.getStatusCode())