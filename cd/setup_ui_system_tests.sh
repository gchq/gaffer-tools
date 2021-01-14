#!/bin/bash

set -e

mvn install -P quick,road-traffic-demo -B -pl ui &
curl -OL https://github.com/mozilla/geckodriver/releases/download/v0.23.0/geckodriver-v0.23.0-linux64.tar.gz
tar -xf geckodriver-v0.23.0-linux64.tar.gz
mv geckodriver ui/
sleep 1m

