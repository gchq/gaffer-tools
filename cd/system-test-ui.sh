#!/bin/bash

set -e

mvn install -P quick,road-traffic-demo -B -pl ui &
curl -OL https://github.com/mozilla/geckodriver/releases/download/v0.23.0/geckodriver-v0.23.0-linux64.tar.gz
tar -xf geckodriver-v0.23.0-linux64.tar.gz
mv geckodriver ui/
sleep 1m
export DISPLAY=:99.0
Xvfb &
mvn verify -P system-test -Dwebdriver.gecko.driver=geckodriver -pl ui
cd python-shell && python3 -m unittest discover -s src
