#!/bin/bash

docker build -f Dockerfile.quickstart.pyspark.base -t gaffer-quickstart-pyspark-base ../gafferpy-release-1.9.3-SNAPSHOT/

docker build -f Dockerfile.quickstart.pyspark -t gaffer-quickstart-pyspark .

docker build -f Dockerfile.quickstart.pyspark.aquarium -t gaffer-quickstart-pyspark-aquarium .
