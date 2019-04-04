#!/bin/bash

docker build -f Dockerfile.quickstart.pyspark.base -t gaffer-quickstart-pyspark-base ../gafferpy-release-1.8.4-SNAPSHOT/

docker build -f Dockerfile.quickstart.pyspark -t gaffer-quickstart-pyspark .

docker build -f Dockerfile.quickstart.pyspark.aquarium -t gaffer-quickstart-pyspark-aquarium .
