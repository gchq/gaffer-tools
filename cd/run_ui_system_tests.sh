#!/bin/bash

set -e

mvn verify -P system-test -Dwebdriver.gecko.driver=geckodriver -pl ui
cd python-shell && python3 -m unittest discover -s src
