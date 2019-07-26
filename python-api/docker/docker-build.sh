#!/bin/bash

cd ../gafferpy-release-1.9.3-SNAPSHOT/

openssl req \
  -new \
  -newkey rsa:4096 \
  -days 3650 \
  -nodes \
  -x509 \
  -subj "/C=UK/ST=EN/L=SF/O=Gaffer-Auth/CN=gaffer.auth" \
  -keyout gaffer.auth.key \
  -out gaffer.auth.cert

cd ../docker

docker build -f Dockerfile.quickstart.pyspark.base -t gaffer-quickstart-pyspark-base ../gafferpy-release-1.9.3-SNAPSHOT/

docker build -f Dockerfile.quickstart.pyspark -t gaffer-quickstart-pyspark .

docker build -f Dockerfile.quickstart.notebook -t gaffer-quickstart-notebook-base ../gafferpy-release-1.9.3-SNAPSHOT/

docker build -f Dockerfile.quickstart.pyspark.aquarium -t gaffer-quickstart-pyspark-aquarium .
