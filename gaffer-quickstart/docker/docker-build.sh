#!/bin/bash

docker build -f Dockerfile.gaffer.quickstart.base -t gaffer-quickstart-base ../gaffer-quickstart-release-1.9.3-SNAPSHOT/

docker build -f Dockerfile.gaffer.quickstart -t gaffer-quickstart .

docker build -f Dockerfile.gaffer.aquarium -t gaffer-aquarium .

