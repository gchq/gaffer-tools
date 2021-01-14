#!/bin/bash

set -e

mvn install -P quick,road-traffic-demo -B -pl ui &
curl -OL https://github.com/mozilla/geckodriver/releases/download/v0.23.0/geckodriver-v0.23.0-linux64.tar.gz
tar -xf geckodriver-v0.23.0-linux64.tar.gz
mv geckodriver ui/
sudo apt-get install -y dbus
sudo bash -c "dbus-uuidgen > /etc/machine-id"
sleep 30s

