import os

from gafferpy.gaffer_connector import GafferConnector
from fishbowl.fishbowl import Fishbowl

# Generate the core api using spring-rest as it has access to every store
# operation
gc = GafferConnector("http://localhost:8080/rest")

dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, 'gafferpy/generated_api')

Fishbowl(gc, generated_directory_path=filename)
