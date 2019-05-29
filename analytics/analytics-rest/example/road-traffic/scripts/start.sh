#!/usr/bin/env bash

# Run this script from the top level directory of this repository.
# Usage: ./ui/example/road-traffic/scripts/start.sh [any extra mvn command arguments, e.g -am to build all dependencies]
nohup mvn clean install -pl :newui -Proad-traffic-demo,quick $@ &
cd newui && ng serve -o
