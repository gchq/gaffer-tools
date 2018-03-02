#!/usr/bin/env bash

# Run this script from the top level directory of this repository.
# Usage: ./ui/example/type-subtype-value/scripts/start.sh [any extra mvn command arguments, e.g -am to build all dependencies]
mvn clean install -pl :ui -Ptype-subtype-value,quick $@
