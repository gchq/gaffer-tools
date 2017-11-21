#!/usr/bin/env bash

# Run this script from the top level directory of this repository.
# Usage: ./ui/example/road-traffic/scripts/start.sh [any extra mvn command arguments, e.g -am to build all dependencies]
mvn clean install -pl :ui -Proad-traffic-demo,quick $@
