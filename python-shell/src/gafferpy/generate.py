from gafferpy import gaffer_connector
gc = gaffer_connector.GafferConnector("http://localhost:8080/rest")
from fishbowl.fishbowl import Fishbowl
Fishbowl(gc)
